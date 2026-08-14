# criticCron

A constructive critic and writing mentor for [joshbeckman.org](https://www.joshbeckman.org). Reads new posts from the site's Atom feed, researches related posts and external sources, and emails back a critique.

This is a [Val Town](https://val.town) HTTP val. The recurring trigger lives in the sibling `criticCronSchedule/` val, which fetches `/cron` on a schedule.

## How it works

Two-model agent loop in `backend/critic.ts`:

1. **Research phase** — Sonnet 4 runs a tool loop with access to:
   - `search_posts`, `get_post`, `get_tags`, `search_tags` against the site's Lunr search index (`SearchData.json`)
   - `read_webpage` for external links, fetched through [Jina Reader](https://r.jina.ai/)
2. **Critique phase** — Opus 4 writes the final critique using the gathered context, following the tone guide at `joshbeckman.org/llms/prompts/tone.txt`. The prompt keeps critiques short (2-3 paragraphs, one landed point) rather than marching through every rubric area.

Images embedded in the post (`![](...)` Markdown, `<img>` tags, or the frontmatter feature image) are extracted and sent to both models as vision blocks via public URL, so the critic can read a photo of workout data or a screenshot instead of saying "I can't see the image."

Critique emails carry both parts: the styled HTML and a `text/plain` alternative built from the critique markdown. HTML-only left the text part as Val Town's "Email sent from Val Town" placeholder, which is all a text client or a JMAP reader ever sees.

The post under critique is sent once, in full. `formatPost` slices bodies to 1000 characters for search results, and sending that slice alongside the full content once had the critic tell the author his post "appears truncated" — it was the summary that got cut. Truncated bodies are now labeled, and `critiquePost` omits the summary body entirely.

The cron handler parses `feed.xml`, filters entries newer than `CUTOFF_DATE` (currently `2026-03-28`), skips anything already in the `critic_cron_processed_urls` blob, critiques each new entry, and emails the result. The processed-URLs set is pruned to whatever is currently in the feed so it doesn't grow without bound.

To fight repetition, the critic keeps a rolling memory of its last 5 cron critiques in the `critic_cron_recent_critiques` blob. Opus emits a `---HEADLINES---` block after each critique with 3-5 distinct angles it took; those headlines are injected into the user message of subsequent runs so the model can see what it's already said and vary its angles. Only `processFeed` writes to this memory — `/critique`, `/preview`, and `/draft` read it but don't pollute it.

## Endpoints

| Route | Description |
|---|---|
| `GET /` | Landing page with a preview form |
| `GET /cron` | Process new feed entries and email critiques (called by `criticCronSchedule`) |
| `GET /critique?url=...` | Ad-hoc critique of a published post — JSON |
| `GET /preview?url=...` | Same, rendered as HTML |
| `GET /links?url=...` | Suggest internal links for a post and open a draft PR — JSON |
| `POST /draft` | Critique an unpublished draft. Body: `{title, content}`. Bearer auth |
| `POST /annotate` | Map a critique onto specific line numbers in a source document. Bearer auth |
| `GET /email?url=...` | Critique a post and email it (manual trigger) |

## Link suggestions (draft PRs)

When `GH_NOTES_TOKEN` is set, each cron critique also runs `suggestLinks` (`backend/github.ts` + `suggestLinks` in `backend/critic.ts`) and opens a **draft** PR against `joshbeckman/notes`. Two independent passes propose edits to the post's Markdown body:

- **Internal links** (🔗): searches the garden (title, tags, body proper-nouns) for related posts and links named entities the garden already covers. Deterministic (temperature 0).
- **External links** (🌐): uses Anthropic's server-side `web_search` to find the canonical URL of a work the post *names but doesn't link* (an essay, podcast episode, video, book), then links it. Proposed URLs are reachability-checked before use.

Both passes are shown a **rejection memory**: the bullets and closing comments from recently closed-unmerged `critic/links-*` PRs, fetched once per process. Past rejections are the only labeled signal for what the author doesn't want, so they're fed back as negative examples.

Every surviving proposal then goes through a **verification pass** — a separate call that reads the target post's *full* text (the proposer only sees a 200-char snippet) and answers whether the author would find the link obviously correct. It defaults to no, and specifically rejects vague conceptual anchors, a series/podcast name linked to a different entry in that series, and a person's name linked to a post that merely cites them. A missing link costs nothing; a wrong one costs review time.

The critique email includes a link to the PR. Draft status is the human gate — nothing merges until you mark it ready.

Application safeguards (`applyInsertions`), each of which exists because a real PR was closed for violating it:

| Check | Rejects |
|---|---|
| protected spans | anchors overlapping an existing link, image caption (`![…](…)`), HTML tag, code span, heading, or blockquote |
| duplicate target | a target URL the body already links |
| link-only edit | `new_string` that changes text beyond adding link markup |
| well-formed edit | a replacement that doesn't strip back to the anchor, or a URL that isn't `https://…` or `/…` |
| unambiguous anchor | anchor text absent, or present more than once |

Spans are recomputed after each applied edit, so a later anchor can't overlap a link an earlier one just added. Matching normalizes typographic punctuation (’ “ ” —) so anchors still match imported prose, and the replacement is rebuilt from the original characters. When anchors overlap, the longest (most specific) one wins.

Mechanics worth knowing:

- A plain URL can't prefill a diff into GitHub's web editor for an existing file, so opening a ready-to-review PR requires committing to a branch via the API — hence the token.
- The token should be a **fine-grained PAT scoped to only `joshbeckman/notes`** with `Contents: read/write` + `Pull requests: read/write`. A leak can't touch other repos.
- File paths are resolved via the git tree API by matching the filename slug, because the URL path is not the file path (subcategories come from frontmatter; `_posts` files are date-prefixed).
- Only the post body is edited; frontmatter is split off and left untouched. Each proposed edit is applied only if its anchor text appears verbatim exactly once.
- If the token is absent or no worthwhile links are found, the critique email sends as before.

## Environment

- `ANTHROPIC_API_KEY` — required (read implicitly by the Anthropic SDK)
- `JINA_AI_API_KEY` — optional, raises Jina rate limits for `read_webpage`
- `CRITIC_PASSWORD` — Bearer token for `/draft` and `/annotate`
- `GH_NOTES_TOKEN` — optional, fine-grained PAT for `joshbeckman/notes`; enables draft-PR link suggestions

## Develop

```sh
vt clone   # if needed
vt watch   # local dev with live deploy
```
