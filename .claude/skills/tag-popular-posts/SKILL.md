---
name: tag-popular-posts
description: Review GoatCounter analytics to find blog posts with high traffic that are missing the "popular" tag, then offer to add it. Use when the user wants to update popular tags based on real traffic data.
argument-hint: "[optional: view threshold or date range]"
user-invocable: true
---

# Tag Popular Posts from GoatCounter Analytics

Review site traffic data from GoatCounter and identify blog posts that should have the `popular` tag added based on their view counts.

## Prerequisites

- The GoatCounter API token is stored in `.goatcounter_token` at the project root
- The GoatCounter instance is at `https://joshbeckman.goatcounter.com`

## Process

### Step 1: Gather current state

In parallel:
1. Read the API token from `.goatcounter_token`
2. Find all blog posts that already have the `popular` tag by grepping for `popular` in `blog/**/*.md` frontmatter

### Step 2: Query GoatCounter for top pages

Use the GoatCounter API to fetch the most-viewed pages:

```
GET https://joshbeckman.goatcounter.com/api/v0/stats/hits
Authorization: Bearer <token>
Content-Type: application/json
```

Query parameters:
- `start`: Use `2024-01-01T00:00:00Z` (or a user-specified start date) — this is roughly when GoatCounter was installed
- `end`: Current date
- `limit`: `100` (the API max)

Parse the response to extract `path` and `count` for each hit. Filter to only `/blog/` paths (exclude non-post pages like `/`, `/about`, `/search`, `/tags`, etc.).

### Step 3: Cross-reference and identify gaps

Compare the top blog posts by traffic against the list of posts already tagged `popular`. Identify posts with significant view counts that are missing the tag.

Use the lowest-traffic already-tagged post as a reference threshold, but present all untagged posts above ~80 views for the user to consider.

### Step 4: Present findings

Show the user a table of untagged blog posts sorted by view count, alongside the range of views for already-tagged posts as context. Recommend which posts should be tagged based on the threshold.

Ask the user which posts to tag before making changes.

### Step 5: Apply tags

For each approved post, add `- popular` to the `tags:` array in the YAML front matter. Do not modify anything else in the file.

### Step 6: Commit

Offer to commit the changes with a message referencing the GoatCounter view counts as justification.

## Notes

- GoatCounter data only covers traffic from ~2024 onward. Some older posts may be tagged `popular` from before analytics were installed — don't remove those tags.
- The API rate limit is 4 requests per second.
- The `/api/v0/stats/hits` endpoint returns hourly breakdowns per path — only the top-level `count` field per hit is needed.
- Some posts may appear under multiple URL paths (e.g. with and without `/practicing/`). Combine their counts when comparing.
