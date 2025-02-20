/** @jsxImportSource npm:hono@3/jsx */
import { Hono } from "npm:hono";
import { OpenAI } from "npm:openai";

const openai = new OpenAI();

type Tag = {
  name: string;
  url: string;
};

const app = new Hono();
app.post("/", async (c) => {
  const formData = await c.req.formData();
  const content = formData.get("content");
  const tags: Array<Tag> = await fetch("https://www.joshbeckman.org/assets/js/tags.json")
    .then((res) => res.json());
  const response = await selectTags(content, tags);
  return c.json({ content, suggestedTags: response });
});

async function selectTags(content: string, tags: Array<Tag>): Promise<Array<string>> {
  const tagNames = tags.map((tag) => tag.name);
  const messages = [
    {
      role: "system",
      content:
        "You are an expert librarian who can help people find the research and resources they need to understand things. Based on what the user provices, you need to identify relevant tags (from a selected set) that should be used to file the content. Reply with just the tags, separated by commas, and no other text or filler words, please.",
    },
    {
      role: "system",
      content:
        "Here are the tags you can choose from: " + tagNames.join(", "),
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
  return keywords.split(",").map((tag) => tag.trim()).filter((tag) => tagNames.includes(tag));
}

export default app.fetch;
