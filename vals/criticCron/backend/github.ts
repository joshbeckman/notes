const REPO = "joshbeckman/notes";
const BASE_BRANCH = "master";
const ASSIGNEE = "joshbeckman";
const API = "https://api.github.com";

// The GitHub web-edit URL for an existing file cannot prefill new content, and
// the compare/quick_pull URL needs a branch with commits to already exist. So a
// real "click to review" link requires committing to a branch via the API — a
// token is unavoidable for the auto-PR path. Missing token degrades gracefully
// to null so the critique email still sends without link PRs.
function token(): string | null {
  return Deno.env.get("GH_NOTES_TOKEN") ?? null;
}

export function hasToken(): boolean {
  return token() !== null;
}

function headers(): Record<string, string> {
  return {
    Authorization: `Bearer ${token()}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "criticCron",
  };
}

async function gh(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API}${path}`, { ...init, headers: { ...headers(), ...(init?.headers ?? {}) } });
}

// Surface GitHub errors instead of letting an error body flow downstream as
// `undefined.field` reads (which produce cryptic TypeErrors far from the cause,
// e.g. a token missing repo access returns 404 {message} not a ref object).
async function ghJson(path: string, init?: RequestInit): Promise<Record<string, unknown>> {
  const resp = await gh(path, init);
  if (!resp.ok) {
    throw new Error(`GitHub ${init?.method ?? "GET"} ${path} → ${resp.status}: ${await resp.text()}`);
  }
  return resp.json();
}

// Resolve a site URL/path to its repo file. The URL path is NOT the file path:
// subcategories come from frontmatter, and _posts files are date-prefixed. So
// match the recursive tree by filename slug rather than reconstructing a path.
export async function resolveFilePath(postUrl: string): Promise<string | null> {
  const path = postUrl.startsWith("http") ? new URL(postUrl).pathname : postUrl;
  const slug = path.replace(/\/+$/, "").split("/").pop();
  if (!slug) return null;

  const ref = await ghJson(`/repos/${REPO}/git/ref/heads/${BASE_BRANCH}`);
  const sha = (ref.object as { sha: string }).sha;
  const tree = await ghJson(`/repos/${REPO}/git/trees/${sha}?recursive=1`);
  const files: string[] = ((tree.tree as { type: string; path: string }[]) ?? [])
    .filter((n: { type: string; path: string }) => n.type === "blob" && n.path.endsWith(".md"))
    .map((n: { path: string }) => n.path);

  // _posts files are `YYYY-MM-DD-<slug>.md`; pages are `<slug>.md` or `<slug>/index.md`.
  const candidates = files.filter((f) => {
    const name = f.split("/").pop()!.replace(/\.md$/, "");
    return name === slug || name.replace(/^\d{4}-\d{2}-\d{2}-/, "") === slug;
  });
  if (candidates.length === 0) return null;
  // Prefer the shortest path when multiple match (avoids picking a stray draft).
  return candidates.sort((a, b) => a.length - b.length)[0];
}

export type FileContent = { content: string; sha: string };

export async function getRawFile(path: string): Promise<FileContent | null> {
  const resp = await gh(`/repos/${REPO}/contents/${encodeURI(path)}?ref=${BASE_BRANCH}`);
  if (!resp.ok) return null;
  const data = await resp.json();
  // atob mangles multi-byte UTF-8; decode as bytes then UTF-8.
  const bytes = Uint8Array.from(atob(data.content.replace(/\n/g, "")), (c) => c.charCodeAt(0));
  return { content: new TextDecoder().decode(bytes), sha: data.sha };
}

function encodeContent(content: string): string {
  const bytes = new TextEncoder().encode(content);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

// Commit `newContent` to a fresh branch and open a draft PR. Draft (not ready)
// so nothing can merge without the author explicitly marking it ready — the
// human gate the author asked for.
export async function openDraftPR(opts: {
  path: string;
  sha: string;
  newContent: string;
  branch: string;
  commitMessage: string;
  title: string;
  body: string;
}): Promise<string> {
  const ref = await ghJson(`/repos/${REPO}/git/ref/heads/${BASE_BRANCH}`);
  const baseSha = (ref.object as { sha: string }).sha;

  const branchResp = await gh(`/repos/${REPO}/git/refs`, {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${opts.branch}`, sha: baseSha }),
  });
  if (!branchResp.ok && branchResp.status !== 422) {
    throw new Error(`branch create failed: ${branchResp.status} ${await branchResp.text()}`);
  }

  const putResp = await gh(`/repos/${REPO}/contents/${encodeURI(opts.path)}`, {
    method: "PUT",
    body: JSON.stringify({
      message: opts.commitMessage,
      content: encodeContent(opts.newContent),
      sha: opts.sha,
      branch: opts.branch,
    }),
  });
  if (!putResp.ok) throw new Error(`commit failed: ${putResp.status} ${await putResp.text()}`);

  const prResp = await gh(`/repos/${REPO}/pulls`, {
    method: "POST",
    body: JSON.stringify({
      title: opts.title,
      head: opts.branch,
      base: BASE_BRANCH,
      body: opts.body,
      draft: true,
    }),
  });
  if (!prResp.ok) throw new Error(`pr create failed: ${prResp.status} ${await prResp.text()}`);
  const pr = await prResp.json();

  // Assignees can't be set on the pulls endpoint; a PR is an issue, so assign
  // via the issues endpoint. Best-effort: a failed assignment shouldn't discard
  // an otherwise-good PR the author still wants to see.
  const assignResp = await gh(`/repos/${REPO}/issues/${pr.number}/assignees`, {
    method: "POST",
    body: JSON.stringify({ assignees: [ASSIGNEE] }),
  });
  if (!assignResp.ok) {
    console.error(`assign failed: ${assignResp.status} ${await assignResp.text()}`);
  }

  return pr.html_url as string;
}
