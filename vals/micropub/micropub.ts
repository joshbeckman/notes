import { Hono } from "npm:hono";
import yaml from "npm:js-yaml@4.1.0";

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

function verifyToken(token: string | null): boolean {
  return !!token && !!MICROPUB_TOKEN && token === MICROPUB_TOKEN;
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
  if (!verifyToken(bearerFromHeader(c))) return c.text("Unauthorized", 401);
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
  if (!verifyToken(parsed.token)) return c.text("Unauthorized", 401);
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

app.onError((err) => Promise.reject(err));

export default app.fetch;
