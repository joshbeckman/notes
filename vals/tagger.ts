/** @jsxImportSource npm:hono@3/jsx */
import { Hono } from "npm:hono";
import { OpenAI } from "npm:openai";

const openai = new OpenAI();

type Tag = {
  name: string;
  decimal: string;
  slug: string;
};

const app = new Hono();
app.post("/", async (c) => {
  const formData = await c.req.formData();
  const content = formData.get("content");
  const tags: Array<Tag> = await fetch("https://www.joshbeckman.org/assets/js/decimals.json")
    .then((res) => res.json());
  const leafTags = tags.filter((tag) => tag.decimal.match(/^\d\d\.\d\d$/));
  const response = await selectTags(content, leafTags);
  return c.json({ content, suggestedTags: response });
});

async function selectTags(content: string, tags: Array<Tag>): Promise<Array<string>> {
  const tagSlugs = tags.map((tag) => tag.slug);
  const messages = [
    {
      role: "system",
      content:
        "You are an expert librarian who can help people find the research and resources they need to understand things. Based on what the user provices, you need to identify relevant tags (from a selected set) that should be used to file the content. Reply with just the tags, separated by commas, and no other text or filler words, please.",
    },
    {
      role: "system",
      content:
        "Here are the tags you can choose from: " + tagSlugs.join(", "),
    },
    {
      role: "user",
      content: content,
    },
  ];
  const keywordsCompletion = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-4o-mini",
  });
  const keywords = keywordsCompletion.choices[0].message.content;
  // only return the tags that are in the list of tags
  return keywords.split(",").map((tag) => tag.trim()).filter((tag) => tagSlugs.includes(tag));
}

export default app.fetch;
