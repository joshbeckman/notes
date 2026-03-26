import { Hono } from "npm:hono";
import { resetCache } from "./search.ts";
import { critiquePost, processFeed, emailCritique } from "./critic.ts";

const STYLE_HEAD = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Sans+Condensed:wght@600&display=swap">`;
const BODY_STYLE = `font-family: 'IBM Plex Sans', sans-serif; max-width: 640px; margin: 0 auto; padding: 32px 20px; color: #151515; line-height: 1.6; background-color: #EBEDEA;`;
const H1_STYLE = `font-family: 'IBM Plex Sans Condensed', 'IBM Plex Sans', sans-serif; font-size: 1.5em; margin-bottom: 4px;`;
const H2_STYLE = `font-family: 'IBM Plex Sans Condensed', 'IBM Plex Sans', sans-serif; font-size: 1.1em; margin-bottom: 2px;`;
const LINK_STYLE = `color: #903465; text-decoration: underline;`;
const HR_STYLE = `border: none; border-top: 2px solid #903465; margin: 16px 0;`;

const app = new Hono();

app.onError((err) => Promise.reject(err));

app.get("/", (c) => {
  return c.html(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Critic Cron</title>
  ${STYLE_HEAD}
  <script src="https://esm.town/v/std/catch"></script>
</head>
<body style="${BODY_STYLE}">
  <h1 style="${H1_STYLE}">Critic Cron</h1>
  <p style="color: #666; margin-bottom: 24px;">Constructive critique for <a href="https://www.joshbeckman.org" style="${LINK_STYLE}">joshbeckman.org</a> posts.</p>
  <div>
    <div style="margin-bottom: 16px;">
      <h2 style="${H2_STYLE}">GET /cron</h2>
      <p style="color: #666; font-size: 14px;">Process new feed entries and email critiques.</p>
    </div>
    <div style="margin-bottom: 16px;">
      <h2 style="${H2_STYLE}">GET /critique?url=...</h2>
      <p style="color: #666; font-size: 14px;">Ad-hoc critique of a single post. Returns JSON.</p>
    </div>
    <div style="margin-bottom: 16px;">
      <h2 style="${H2_STYLE}">GET /preview?url=...</h2>
      <p style="color: #666; font-size: 14px;">Ad-hoc critique of a single post. Returns HTML page.</p>
    </div>
  </div>
  <hr style="${HR_STYLE}">
  <form style="margin-top: 16px;" method="get" action="/preview">
    <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 4px;">Preview a critique:</label>
    <div style="display: flex; gap: 8px;">
      <input type="text" name="url" placeholder="https://www.joshbeckman.org/blog/..." style="flex: 1; border: 1px solid #ddd; border-radius: 4px; padding: 6px 12px; font-size: 14px; font-family: 'IBM Plex Sans', sans-serif;">
      <button type="submit" style="background: #903465; color: #EBEDEA; padding: 6px 16px; border-radius: 4px; font-size: 14px; border: none; cursor: pointer; font-family: 'IBM Plex Sans', sans-serif;">Go</button>
    </div>
  </form>
</body>
</html>`);
});

app.get("/cron", async (c) => {
  resetCache();
  const result = await processFeed();
  return c.json(result);
});

app.get("/critique", async (c) => {
  resetCache();
  const url = c.req.query("url");
  if (!url) return c.json({ error: "url parameter is required" }, 400);

  const result = await critiquePost(url);
  return c.json(result);
});

app.get("/preview", async (c) => {
  resetCache();
  const url = c.req.query("url");
  if (!url) return c.text("url parameter is required", 400);

  const result = await critiquePost(url);

  return c.html(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Critique: ${result.title}</title>
  ${STYLE_HEAD}
  <script src="https://esm.town/v/std/catch"></script>
</head>
<body style="${BODY_STYLE}">
  <p style="color: #666; font-size: 14px; margin-bottom: 4px;">Critique</p>
  <h1 style="${H1_STYLE}"><a href="${result.url}" style="${LINK_STYLE}">${result.title}</a></h1>
  <hr style="${HR_STYLE}">
  <div style="line-height: 1.7;">
    ${result.critique.html}
  </div>
  <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;">
  <form style="margin-top: 16px;" method="get" action="/preview">
    <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 4px;">Critique another post:</label>
    <div style="display: flex; gap: 8px;">
      <input type="text" name="url" placeholder="https://www.joshbeckman.org/blog/..." style="flex: 1; border: 1px solid #ddd; border-radius: 4px; padding: 6px 12px; font-size: 14px; font-family: 'IBM Plex Sans', sans-serif;">
      <button type="submit" style="background: #903465; color: #EBEDEA; padding: 6px 16px; border-radius: 4px; font-size: 14px; border: none; cursor: pointer; font-family: 'IBM Plex Sans', sans-serif;">Go</button>
    </div>
  </form>
</body>
</html>`);
});

app.get("/email", async (c) => {
  resetCache();
  const url = c.req.query("url");
  if (!url) return c.json({ error: "url parameter is required" }, 400);

  const result = await critiquePost(url);
  await emailCritique(result.title, result.url, result.critique.html);
  return c.json({ sent: true, title: result.title, url: result.url });
});

export default app.fetch;
