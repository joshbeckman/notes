# criticCron

A constructive critic and writing mentor for [joshbeckman.org](https://www.joshbeckman.org). Reads new posts from the site's Atom feed, researches related posts and external sources, and emails back a critique.

This is a [Val Town](https://val.town) HTTP val. The recurring trigger lives in the sibling `criticCronSchedule/` val, which fetches `/cron` on a schedule.

## How it works

Two-model agent loop in `backend/critic.ts`:

1. **Research phase** — Sonnet 4 runs a tool loop with access to:
   - `search_posts`, `get_post`, `get_tags`, `search_tags` against the site's Lunr search index (`SearchData.json`)
   - `read_webpage` for external links, fetched through [Jina Reader](https://r.jina.ai/)
2. **Critique phase** — Opus 4 writes the final critique using the gathered context, following the tone guide at `joshbeckman.org/llms/prompts/tone.txt`.

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

The critique email includes a link to the PR. Draft status is the human gate — nothing merges until you mark it ready.

Application safeguards (`applyInsertions`): each edit must add ONLY link markup (stripped text equals the anchor), the anchor must appear exactly once, and it must not fall inside a quoted passage (Markdown `>` or embedded `<blockquote>`). Matching normalizes typographic punctuation (’ “ ” —) so anchors still match imported prose, and the replacement is rebuilt from the original characters. When anchors overlap, the longest (most specific) one wins.

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
