# micropub

A [Micropub](https://micropub.spec.indieweb.org/) endpoint that turns posts
written in a phone Micropub client into commits on this repo. The site's
existing `optimize.yml` and `jekyll.yml` workflows then optimize images and
deploy — no separate publishing pipeline.

## How it works

```
Phone client ──┬── POST /media   → commit to assets/images/, return URL
               └── POST /         → build blog/_posts/<date>-<slug>.md, commit
                         ▲
                    Bearer MICROPUB_TOKEN
```

- **Direct commit** (not the issue `/post` flow): the media endpoint commits the
  image first, so the created post references an in-repo path and never races
  the GitHub Pages deploy.
- **Auth** is a single shared bearer token. To move to IndieAuth later, replace
  `verifyToken()` only.
- **Frontmatter override**: if the post content starts with a `---` YAML block,
  it overrides Micropub properties and defaults (`category`, `published`,
  `slug`, `tags`, `title`, `date`, `image`, `description`) — the same mental
  model as the site's issue-based posting.

## Property mapping

| Micropub | Post |
|---|---|
| `name` | `title` (required unless set in frontmatter) |
| `content` | body (leading `---` frontmatter block is parsed as overrides) |
| `category[]` | `tags` |
| `photo[]` (URL or uploaded file) | inlined `![](…)` + frontmatter `image` |
| `published` (datetime) | `date` |
| `mp-slug` | `slug` |
| — (defaults to `blog`) | Jekyll category, override via frontmatter `category:` |

## Deploy

From this directory:

```sh
vt create micropub          # or: vt push, if already linked
```

Set env vars on the val:

| Var | Required | Default |
|---|---|---|
| `MICROPUB_TOKEN` | yes | — (random secret you paste into the client) |
| `GITHUB_TOKEN` | yes | — (fine-grained PAT with Contents: read/write on this repo) |
| `GITHUB_REPO` | no | `joshbeckman/notes` |
| `GIT_BRANCH` | no | `master` |
| `SITE_URL` | no | `https://www.joshbeckman.org` |
| `SITE_TZ` | no | `America/Chicago` |
| `GIT_COMMITTER_NAME` | no | `micropub-val` |
| `GIT_COMMITTER_EMAIL` | no | `josh@joshbeckman.org` |

The `<link rel="micropub">` in `_includes/head.html` points clients here:
`https://joshbeckman--1708dc0c76e811f1be5b1607ee4eb77e.web.val.run`.

## Client setup

1. Point the client at `https://www.joshbeckman.org` (it discovers the endpoint
   via `rel="micropub"`).
2. When it asks for a token, paste `MICROPUB_TOKEN`.
3. Write, attach photos, publish.

Fastest to debug: [Quill](https://quill.p3k.io/). Phone: iA Writer, Indigenous.

## Test without a client

```sh
TOKEN=your-secret
URL=https://joshbeckman--1708dc0c76e811f1be5b1607ee4eb77e.web.val.run

# config
curl "$URL/?q=config" -H "Authorization: Bearer $TOKEN"

# create a post
curl -i "$URL/" -H "Authorization: Bearer $TOKEN" \
  -d h=entry -d name="Hello from the phone" \
  -d content="A first micropub post." \
  --data-urlencode "category[]=publishing"
```
