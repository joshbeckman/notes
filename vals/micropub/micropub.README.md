# micropub

A [Micropub](https://micropub.spec.indieweb.org/) endpoint that turns posts
written in a phone Micropub client into commits on this repo. The site's
existing `optimize.yml` and `jekyll.yml` workflows then optimize images and
deploy — no separate publishing pipeline.

## How it works

```
Phone client ──┬── GET  /auth    → approval page (password) → auth code
               ├── POST /token   → exchange code (+PKCE) → access token
               ├── POST /media   → commit to assets/images/, return URL
               └── POST /         → build blog/_posts/<date>-<slug>.md, commit
                         ▲
                    Bearer access token (or MICROPUB_TOKEN fallback)
```

- **Direct commit** (not the issue `/post` flow): the media endpoint commits the
  image first, so the created post references an in-repo path and never races
  the GitHub Pages deploy.
- **Auth is self-hosted IndieAuth.** This val is its own identity provider: the
  authorization endpoint gates on a password (`GARDEN_PASSWORD`), then issues an
  HMAC-signed, single-use auth code; the token endpoint verifies it (with PKCE)
  and returns a long-lived HMAC-signed access token. No third-party service, no
  DB except a `std/blob` entry per code to enforce single use.
- **`MICROPUB_TOKEN`** remains a shared-secret fallback for curl/scripts.
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
| `GITHUB_TOKEN` | yes | — (fine-grained PAT with Contents: read/write on this repo) |
| `INDIEAUTH_SECRET` | yes | — (random string; signs auth codes + access tokens) |
| `GARDEN_PASSWORD` | yes | — (the password you enter on the approval page) |
| `MICROPUB_TOKEN` | no | — (optional shared-secret fallback for curl/scripts) |
| `GITHUB_REPO` | no | `joshbeckman/notes` |
| `GIT_BRANCH` | no | `master` |
| `SITE_URL` | no | `https://www.joshbeckman.org` |
| `SITE_TZ` | no | `America/Chicago` |
| `GIT_COMMITTER_NAME` | no | `micropub-val` |
| `GIT_COMMITTER_EMAIL` | no | `josh@joshbeckman.org` |

The `<link rel="micropub">` in `_includes/head.html` points clients here:
`https://joshbeckman--1708dc0c76e811f1be5b1607ee4eb77e.web.val.run`.

## Client setup

1. Sign in with your site URL `https://www.joshbeckman.org` (the client
   discovers the micropub/authorization/token endpoints from the page head).
2. You're redirected to the approval page — enter `GARDEN_PASSWORD` and approve.
3. The client stores its own token; write, attach photos, publish.

Works with [Quill](https://quill.p3k.io/) (web), iA Writer, and Indigenous — all
speak IndieAuth, so none need a raw token pasted in.

## Test without a client

Uses the optional `MICROPUB_TOKEN` shared-secret fallback (IndieAuth is for GUI
clients; curl skips it).

```sh
TOKEN=your-micropub-token
URL=https://joshbeckman--1708dc0c76e811f1be5b1607ee4eb77e.web.val.run

# config
curl "$URL/?q=config" -H "Authorization: Bearer $TOKEN"

# create a post
curl -i "$URL/" -H "Authorization: Bearer $TOKEN" \
  -d h=entry -d name="Hello from the phone" \
  -d content="A first micropub post." \
  --data-urlencode "category[]=publishing"
```
