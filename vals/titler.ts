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
  const examples = [
    "My Jet Lag, Visualized",
    "Hacking Life Into My Little Counter",
    "Rules for Syndication on My Site",
    "Gotta Publish Where The People Are",
  ];
  const response = await selectTitle(content, examples);
  return c.json({ content, suggestedTitle: response });
});

async function selectTitle(content: string, examples: Array<string>): Promise<string> {
  const messages = [
    {
      role: "system",
      content:
        "You are an expert copy editor who can help people edit and market their writing. Based on what the user provices, you need to identify a perfect title for their post. Reply with just the suggested title (in titlecase), and no other text or filler words or quotation marks, please.",
    },
    {
      role: "system",
      content:
        "Here are some example titles this user (the author at the joshbeckman.org blog) has previously written in their preferred style (concise, direct, something like a newspaper that is highly intelligent and a bit unserious): "
        + examples.map((example) => `"${example}"`).join(", "),
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
  return keywordsCompletion.choices[0].message.content;
}

export default app.fetch;
