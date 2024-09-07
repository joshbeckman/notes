import { OpenAI } from "npm:openai";
import { marked } from "npm:marked";

const openai = new OpenAI();

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return Response.json({ message: "This endpoint responds to POST requests." }, {
      status: 400,
    });
  }
  let body = null;
  try {
    body = await request.json();
  } catch (e) {
    return Response.json({ message: "The body of this request was not JSON-encoded." }, {
      status: 400,
    });
  }
  if (!body || !body.conversation || !Array.isArray(body.conversation)) {
    return Response.json({ message: "The body of this request must include a 'conversation' array." }, {
      status: 400,
    });
  }
  const conversation = body.conversation;
  const systemPrompt = conversation.find((message) => message.role === "system")?.content;
  if (!systemPrompt) {
    return Response.json({ message: "The conversation must include a 'system' message." }, {
      status: 400,
    });
  }
  const completion = await openai.chat.completions.create({
    messages: conversation,
    model: "gpt-4o-mini",
  });
  const messages = conversation.concat([completion.choices[0].message]);
  const insight = messages[messages.length - 1].content;
  const insightHtml = await marked.parse(insight);
  return Response.json({
    insight: insight,
    insightHtml: insightHtml,
    conversation: messages,
  });
}
