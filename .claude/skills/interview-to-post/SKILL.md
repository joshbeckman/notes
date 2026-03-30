---
name: interview-to-post
description: Interview the user to flesh out an idea into a compelling blog post. Use when the user wants to brainstorm, draft, or develop a post idea through conversation. Triggers on phrases like "interview me", "help me write a post", "I have a post idea", "let's flesh out a post".
argument-hint: "[optional topic or idea]"
user-invocable: true
---

# Interview to Post

Guide the user through a structured interview to develop a rough idea into a compelling blog post for joshbeckman.org.

## Process

### Phase 1: Seed

Ask the user what they want to write about. If they've already provided a topic or idea, skip to Phase 2.

If they haven't provided anything yet, ask:

> What's on your mind? Give me the rough idea, a sentence, a question, an observation — whatever you've got.

### Phase 2: Interview

Your job is to be a curious, sharp interviewer who draws out the substance of the post. Ask questions **one or two at a time** — do not dump a list of questions. Wait for the user to respond before continuing.

Work through these dimensions (not necessarily in order — follow the conversation naturally):

1. **The hook**: What's the surprising, interesting, or non-obvious part of this? Why would someone stop scrolling to read this?
2. **The specifics**: Get concrete details — names, numbers, dates, code, examples, anecdotes. Push past generalities. Ask "can you give me an example?" liberally.
3. **The stakes**: Why does this matter? Who cares? What goes wrong if people don't know this?
4. **The tension**: What's the counterargument? What did you try that didn't work? What's the trade-off? What would a skeptic say?
5. **The insight**: What do you know now that you didn't before? What's the lesson, the principle, the takeaway?
6. **The scope**: What's in and what's out? Help the user draw boundaries so the post stays focused.

**Interview style:**
- Be direct and curious, not sycophantic
- Challenge vague statements — "what do you mean by that?" / "can you be more specific?"
- Reflect back what you're hearing to confirm understanding
- If the user is stuck, offer two contrasting framings and ask which feels closer
- Notice when you have enough material and say so — don't over-interview

### Phase 3: Pitch

When you have enough material, present a **post pitch** to the user:

- **Title** (2-3 options)
- **Opening hook** (the first 1-2 sentences — lead with the anomaly, not background)
- **Structure** (bullet-point outline of sections)
- **Core takeaway** (one sentence)
- **Suggested tags** (lowercase, hyphenated)
- **Suggested category** (e.g. `blog`, `blog/practicing`, `notes`)

Ask the user: "Does this capture what you want to say? What would you change?"

Iterate on the pitch until the user is satisfied.

### Phase 3.5: Images

Before drafting, ask the user about images that should accompany the post:

> Do you have any images, photos, screenshots, or diagrams that should go in this post? You can paste paths, URLs, or drag files into the chat.

**Guidance:**
- If the topic naturally involves visuals (a project demo, a place, a physical object, a diagram, a UI), prompt specifically: "This sounds like it would benefit from a screenshot/photo of X — do you have one?"
- Ask about a **feature image** for the post header (sets the `image:` front matter field)
- Ask if any images should be placed inline at specific points in the post
- If the user provides local file paths, note them for embedding as `![alt text](/assets/images/filename)` in the draft — the build pipeline will handle optimization
- If the user provides URLs, use them directly
- If the user says no images, move on — don't push
- For posts with multiple images, ask about ordering and which sections they belong to

### Phase 4: Draft

Once the pitch is approved and images are gathered, write the full post as a Markdown file with proper YAML front matter.

**Front matter — always include:**
- `layout: Post`
- `date:` — use current date/time (use the `get_current_time_of_day` tool)
- `title:` — the approved title
- `tags:` — YAML array, lowercase with hyphens
- `category:` — the approved category
- `description:` — a one-sentence description

**Front matter — include when relevant (surface these during the interview if the topic warrants it):**
- `image:` — feature image URL (auto-set from embedded images, IMDB, or album art)
- `rating:` — numeric rating (for reviews)
- `imdb_id:` — IMDB ID e.g. `tt1234567` for movie/TV posts (auto-fetches poster)
- `in_reply_to:` — URL this post is replying to
- `hide_title:` — `true` to hide the title on the page
- `song_link:` — URL to a song
- `photo_feature:` — `true` or a URL for photo feature display
- `album:` — nested `title` and `artist` fields for music posts (auto-fetches album art)
- `syndicate:` — `false` to skip cross-posting to Mastodon/Bluesky (default: `true`)
- `published:` — `false` to create as a draft
- `canonical:` — canonical URL if cross-posting from elsewhere
- `encrypted:` — key ID from `_secrets.yml` for client-side encryption
- `toc:` — `true` for a table of contents on longer posts
- `slug:` — URL slug, defaults to slugified title

During the interview, ask about these when context suggests them. For example:
- If discussing a movie or show → ask about `imdb_id` and `rating`
- If discussing music → ask about `album` or `song_link`
- If replying to someone else's writing → ask about `in_reply_to`
- If the post includes photos → ask about `photo_feature` and `image`
- If the user wants it private or draft → ask about `published` or `encrypted`
- If the post is long with multiple sections → suggest `toc: true`

**Writing rules:**
- Follow the tone and style guide in `llms/prompts/tone.txt`
- Lead with the hook, not background
- Use first person
- Be concrete and specific — prefer examples over abstractions
- Keep paragraphs short
- Use headings to break up longer posts
- Link to relevant external resources where appropriate
- Do not pad with filler or unnecessary conclusions

**File placement:**
- Blog posts go in `blog/_posts/YYYY-MM-DD-slug.md`
- Notes go in `notes/` with the filename as the note ID

Write the file, then show the user the path and ask if they want any revisions before committing.

## Important

- The interview is the core value of this skill — spend most of the time there
- Do not rush to drafting. A good interview produces a good post with minimal editing.
- If the user provides a fully formed idea with plenty of detail upfront, shorten the interview accordingly — adapt to what's needed
- The user can say "skip to draft" or "just write it" at any point to jump ahead
