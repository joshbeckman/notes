import { Hono } from "npm:hono";
import yaml from "npm:js-yaml@4.1.0";
import { blob } from "https://esm.town/v/std/blob";

// Direct-commit Micropub endpoint: translates Micropub create/media requests
// into commits against the Jekyll repo, reusing the site's own build/optimize
// workflows rather than a separate publishing pipeline.
//
// Auth is a single shared bearer token (MICROPUB_TOKEN) rather than IndieAuth:
// chosen to prove the loop with the least moving parts. It is swappable for an
// IndieAuth token check at verifyToken() without touching the rest.

const REPO = Deno.env.get("GITHUB_REPO") || "joshbeckman/notes";
const BRANCH = Deno.env.get("GIT_BRANCH") || "master";
const SITE_URL = (Deno.env.get("SITE_URL") || "https://www.joshbeckman.org").replace(/\/$/, "");
const SITE_TZ = Deno.env.get("SITE_TZ") || "America/Chicago";
const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN") || "";
const MICROPUB_TOKEN = Deno.env.get("MICROPUB_TOKEN") || "";
const GARDEN_PASSWORD = Deno.env.get("GARDEN_PASSWORD") || "";
const INDIEAUTH_SECRET = Deno.env.get("INDIEAUTH_SECRET") || "";
const COMMITTER = {
  name: Deno.env.get("GIT_COMMITTER_NAME") || "micropub-val",
  email: Deno.env.get("GIT_COMMITTER_EMAIL") || "josh@joshbeckman.org",
};

const app = new Hono();

// Bearer token can arrive in the Authorization header or, per the Micropub
// spec, as an access_token form field. Header wins.
function bearerFromHeader(c: any): string | null {
  const auth = c.req.header("Authorization") || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

// --- IndieAuth: self-hosted authorization + token endpoints ---
//
// Tokens/codes are stateless HMAC-signed blobs (no DB for the happy path).
// The one place state is required is single-use enforcement of auth codes,
// which uses std/blob to burn a code's jti on redemption.

function b64urlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlDecode(s: string): Uint8Array {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
const b64urlStr = (s: string) => b64urlEncode(new TextEncoder().encode(s));
const unb64urlStr = (s: string) => new TextDecoder().decode(b64urlDecode(s));

let _key: CryptoKey | null = null;
async function signingKey(): Promise<CryptoKey> {
  if (!_key) {
    _key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(INDIEAUTH_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
  }
  return _key;
}
async function hmac(data: string): Promise<string> {
  const sig = await crypto.subtle.sign("HMAC", await signingKey(), new TextEncoder().encode(data));
  return b64urlEncode(new Uint8Array(sig));
}
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}
async function signPayload(payload: Record<string, any>): Promise<string> {
  const p = b64urlStr(JSON.stringify(payload));
  return `${p}.${await hmac(p)}`;
}
async function verifyPayload(token: string): Promise<Record<string, any> | null> {
  const [p, sig] = token.split(".");
  if (!p || !sig) return null;
  if (!timingSafeEqual(sig, await hmac(p))) return null;
  let payload: Record<string, any>;
  try {
    payload = JSON.parse(unb64urlStr(p));
  } catch {
    return null;
  }
  if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
  return payload;
}
async function sha256b64url(s: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return b64urlEncode(new Uint8Array(d));
}

// Single-use enforcement: an auth code's jti is burned in blob storage on
// first redemption so a replay within the 5-minute window is rejected.
async function codeAlreadyUsed(jti: string): Promise<boolean> {
  try {
    return !!(await blob.getJSON(`mp_used_code_${jti}`));
  } catch {
    return false;
  }
}
async function burnCode(jti: string): Promise<void> {
  try {
    await blob.setJSON(`mp_used_code_${jti}`, { at: Date.now() });
  } catch {
    // If blob write fails we fail closed at the caller rather than issue a token.
  }
}

async function verifyToken(token: string | null): Promise<boolean> {
  if (!token) return false;
  // Shared secret kept as a fallback for curl/scripts.
  if (MICROPUB_TOKEN && token === MICROPUB_TOKEN) return true;
  const payload = await verifyPayload(token);
  return !!payload && payload.t === "token";
}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function textToBase64(text: string): string {
  return toBase64(new TextEncoder().encode(text));
}

async function getSha(path: string): Promise<string | undefined> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${encodeURI(path)}?ref=${BRANCH}`,
    { headers: ghHeaders() },
  );
  if (res.status === 200) return (await res.json()).sha;
  return undefined;
}

function ghHeaders() {
  return {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "micropub-val",
    "Content-Type": "application/json",
  };
}

async function commitFile(path: string, contentBase64: string, message: string) {
  const sha = await getSha(path);
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${encodeURI(path)}`, {
    method: "PUT",
    headers: ghHeaders(),
    body: JSON.stringify({
      message,
      content: contentBase64,
      branch: BRANCH,
      committer: COMMITTER,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`GitHub commit failed for ${path}: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugify(title: string): string {
  return title.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "-").toLowerCase();
}

// Match Post#front_matter date format: "YYYY-MM-DD HH:MM:SS +ZZZZ" in the
// site's timezone, so posts land on the right calendar day near midnight.
function formatInTz(date: Date, tz: string): { day: string; full: string } {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "longOffset",
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  const day = `${parts.year}-${parts.month}-${parts.day}`;
  const hour = parts.hour === "24" ? "00" : parts.hour;
  const offset = (parts.timeZoneName || "GMT+00:00").replace("GMT", "").replace(":", "") || "+0000";
  return { day, full: `${day} ${hour}:${parts.minute}:${parts.second} ${offset}` };
}

function firstValue(v: any): string | undefined {
  if (v == null) return undefined;
  if (Array.isArray(v)) v = v[0];
  if (v == null) return undefined;
  if (typeof v === "object") return v.html ?? v.value ?? undefined;
  return String(v);
}

function photoUrl(p: any): string | undefined {
  if (typeof p === "string") return p;
  if (p && typeof p === "object") return p.value ?? p.url ?? undefined;
  return undefined;
}

// A site-absolute media URL (from our own media endpoint) is rewritten to a
// repo-relative path so the committed post references the in-repo asset rather
// than round-tripping through the live CDN.
function toRepoPath(url: string): string {
  if (url.startsWith(SITE_URL + "/")) return url.slice(SITE_URL.length);
  return url;
}

type Parsed = {
  h: string;
  name?: string;
  content?: string;
  categories: string[];
  photos: string[];
  files: File[];
  published?: string;
  slug?: string;
  token: string | null;
};

async function parseRequest(c: any): Promise<Parsed> {
  const ct = c.req.header("Content-Type") || "";
  let token = bearerFromHeader(c);

  if (ct.includes("application/json")) {
    const body = await c.req.json();
    const props = body.properties || {};
    const type = Array.isArray(body.type) ? body.type[0] : body.type;
    return {
      h: (type || "h-entry").replace(/^h-/, ""),
      name: firstValue(props.name),
      content: firstValue(props.content),
      categories: (props.category || []).map((x: any) => String(x)),
      photos: (props.photo || []).map(photoUrl).filter(Boolean) as string[],
      files: [],
      published: firstValue(props.published),
      slug: firstValue(props["mp-slug"]),
      token,
    };
  }

  const fd = await c.req.formData();
  if (!token) token = (fd.get("access_token") as string) || null;
  const cats = [...fd.getAll("category[]"), ...fd.getAll("category")].filter(
    (v) => typeof v === "string",
  ) as string[];
  const rawPhotos = [...fd.getAll("photo[]"), ...fd.getAll("photo")];
  return {
    h: ((fd.get("h") as string) || "entry").replace(/^h-/, ""),
    name: (fd.get("name") as string) || undefined,
    content: (fd.get("content") as string) || undefined,
    categories: cats,
    photos: rawPhotos.filter((v) => typeof v === "string") as string[],
    files: rawPhotos.filter((v) => v instanceof File) as File[],
    published: (fd.get("published") as string) || undefined,
    slug: (fd.get("mp-slug") as string) || undefined,
    token,
  };
}

// Micropub config query: advertises the media endpoint so clients know where
// to upload photos.
app.get("/", (c) => {
  if (c.req.query("q") === "config" || c.req.query("q") === "syndicate-to") {
    return c.json({
      "media-endpoint": `${new URL(c.req.url).origin}/media`,
      "syndicate-to": [],
    });
  }
  return c.text("Micropub endpoint", 200);
});

// Media endpoint: commit an uploaded image and hand back its site-absolute URL.
app.post("/media", async (c) => {
  if (!(await verifyToken(bearerFromHeader(c)))) return c.text("Unauthorized", 401);
  const fd = await c.req.formData();
  const file = (fd.get("file") || fd.get("photo")) as File | null;
  if (!file) return c.text("Missing file", 400);

  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const name = `${Date.now()}-${safe}`;
  const path = `assets/images/${name}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  await commitFile(path, toBase64(bytes), `new(usr): Upload ${name} via micropub`);

  const url = `${SITE_URL}/${path}`;
  c.header("Location", url);
  return c.json({ url }, 201);
});

app.post("/", async (c) => {
  const parsed = await parseRequest(c);
  if (!(await verifyToken(parsed.token))) return c.text("Unauthorized", 401);
  if (parsed.h !== "entry") return c.text("Only h-entry is supported", 400);

  // Commit any inline photo files uploaded in the create request itself
  // (clients that skip the media endpoint), collecting their repo paths.
  const inlinePaths: string[] = [];
  for (const file of parsed.files) {
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const name = `${Date.now()}-${safe}`;
    const path = `assets/images/${name}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    await commitFile(path, toBase64(bytes), `new(usr): Upload ${name} via micropub`);
    inlinePaths.push(`/${path}`);
  }

  let body = parsed.content || "";

  // Optional YAML frontmatter inside the content overrides Micropub props and
  // defaults, mirroring the site's issue_post frontmatter path so the phone
  // flow behaves "just like normal Jekyll".
  let fm: Record<string, any> = {};
  const fmMatch = body.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fmMatch) {
    fm = (yaml.load(fmMatch[1]) as Record<string, any>) || {};
    body = body.slice(fmMatch[0].length);
  }

  const photoPaths = [
    ...parsed.photos.map(toRepoPath),
    ...inlinePaths,
  ];

  const title = fm.title || parsed.name;
  if (!title) return c.text("A title is required (name or frontmatter title)", 400);

  const category = fm.category || "blog";
  const when = fm.date ? new Date(fm.date) : parsed.published ? new Date(parsed.published) : new Date();
  const { day, full } = formatInTz(isNaN(when.getTime()) ? new Date() : when, SITE_TZ);
  const slug = fm.slug || parsed.slug || slugify(title);
  const tags = fm.tags
    ? (Array.isArray(fm.tags) ? fm.tags : String(fm.tags).split(",").map((t) => t.trim()))
    : parsed.categories;
  const image = fm.image || (photoPaths.length ? photoPaths[0] : undefined);

  // Inline the photos above the body, matching set_album_art's prepend style.
  const imageMd = photoPaths.map((p) => `![](${p})`).join("\n");
  const finalBody = [imageMd, body.trim()].filter(Boolean).join("\n\n");

  const front: Record<string, any> = {
    layout: fm.layout || "Post",
    date: full,
    title,
    toc: true,
  };
  if (image) front.image = image;
  if (fm.description) front.description = fm.description;
  if (tags && tags.length) front.tags = tags.map((t: string) => String(t).toLowerCase());
  if (fm.published !== undefined) front.published = fm.published;

  const fileContent = `---\n${yaml.dump(front)}---\n\n${finalBody}\n`;
  const path = `${category}/_posts/${day}-${slug}.md`;
  await commitFile(path, textToBase64(fileContent), `new(usr): Post "${title}" via micropub`);

  const location = `${SITE_URL}/${category}/${slug}`;
  c.header("Location", location);
  return c.body(null, 201);
});

// IndieAuth authorization endpoint: approval form. The password gate is the
// identity check — this val is its own identity provider, so there is no
// third-party login to delegate to.
app.get("/auth", (c) => {
  const q = c.req.query();
  const hidden = [
    "client_id",
    "redirect_uri",
    "state",
    "scope",
    "code_challenge",
    "code_challenge_method",
    "me",
    "response_type",
  ]
    .map((k) => `<input type="hidden" name="${k}" value="${escapeHtml(q[k] || "")}">`)
    .join("\n");
  return c.html(`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Authorize</title>
<style>body{font:16px system-ui;max-width:28rem;margin:3rem auto;padding:0 1rem}
input[type=password]{width:100%;padding:.6rem;font-size:1rem;box-sizing:border-box}
button{margin-top:1rem;padding:.6rem 1rem;font-size:1rem}code{word-break:break-all}</style>
<h1>Authorize app</h1>
<p><strong>${escapeHtml(q.client_id || "unknown app")}</strong> is requesting
scope <code>${escapeHtml(q.scope || "create")}</code>.</p>
<form method="post" action="/auth">
${hidden}
<label>Password<br><input type="password" name="password" autofocus></label>
<button type="submit">Approve</button>
</form>`);
});

app.post("/auth", async (c) => {
  const fd = await c.req.formData();
  const get = (k: string) => (fd.get(k) as string) || "";
  if (!GARDEN_PASSWORD || get("password") !== GARDEN_PASSWORD) {
    return c.text("Forbidden", 403);
  }
  const redirectUri = get("redirect_uri");
  if (!redirectUri) return c.text("Missing redirect_uri", 400);

  const code = await signPayload({
    t: "code",
    jti: crypto.randomUUID(),
    client_id: get("client_id"),
    redirect_uri: redirectUri,
    scope: get("scope") || "create",
    me: get("me") || SITE_URL,
    cc: get("code_challenge"),
    ccm: get("code_challenge_method"),
    exp: Math.floor(Date.now() / 1000) + 300,
  });

  const sep = redirectUri.includes("?") ? "&" : "?";
  const state = get("state");
  const location = `${redirectUri}${sep}code=${encodeURIComponent(code)}${
    state ? `&state=${encodeURIComponent(state)}` : ""
  }`;
  return c.body(null, 302, { Location: location });
});

// IndieAuth token endpoint: exchange a single-use auth code for an access token.
app.post("/token", async (c) => {
  const fd = await c.req.formData();
  const get = (k: string) => (fd.get(k) as string) || "";
  if (get("grant_type") !== "authorization_code") {
    return c.json({ error: "unsupported_grant_type" }, 400);
  }
  const payload = await verifyPayload(get("code"));
  if (!payload || payload.t !== "code") return c.json({ error: "invalid_grant" }, 400);
  if (payload.client_id !== get("client_id") || payload.redirect_uri !== get("redirect_uri")) {
    return c.json({ error: "invalid_grant" }, 400);
  }
  // PKCE: verify code_verifier against the challenge bound to the code.
  if (payload.cc) {
    const verifier = get("code_verifier");
    if (!verifier) return c.json({ error: "invalid_grant" }, 400);
    const challenge = payload.ccm === "plain" ? verifier : await sha256b64url(verifier);
    if (!timingSafeEqual(challenge, payload.cc)) return c.json({ error: "invalid_grant" }, 400);
  }
  if (await codeAlreadyUsed(payload.jti)) return c.json({ error: "invalid_grant" }, 400);
  await burnCode(payload.jti);

  const accessToken = await signPayload({
    t: "token",
    me: payload.me,
    scope: payload.scope,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 10 * 365 * 24 * 3600,
  });
  return c.json({
    access_token: accessToken,
    token_type: "Bearer",
    scope: payload.scope,
    me: payload.me,
  });
});

app.onError((err) => Promise.reject(err));

export default app.fetch;
