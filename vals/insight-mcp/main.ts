import Anthropic from "npm:@anthropic-ai/sdk";
import { marked } from "npm:marked";

const anthropic = new Anthropic({
  apiKey: Deno.env.get("ANTHROPIC_API_KEY"),
});

// Ref: https://docs.anthropic.com/en/docs/about-claude/models/overview
const TOP_MODEL = 'claude-opus-4-0';
const HIGH_MODEL = 'claude-sonnet-4-0';
const MID_MODEL = 'claude-3-7-sonnet-latest';
const FAST_MODEL = 'claude-3-5-haiku-latest';

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
  let messages = [];
  let model = TOP_MODEL;
  let max_tokens = 4096;
  if (request.headers.get("Authorization") == Deno.env.get("AUTHORIZATION")) {
      model = body.model || model;
      max_tokens = body.max_tokens || max_tokens;
      messages = body.messages || [];
  }
  let postUrl = body.postUrl || null;
  if (messages.length === 0) {
    if (!postUrl) {
      return Response.json({ message: "The body of this request must include a 'messages' array or a 'postUrl' string." }, {
        status: 400,
      });
    }
    messages = [
      {
        role: "user",
        content: `You are an expert analyst specializing in software engineering, finance, and business operations. Your task is to review and analyze a blog post, providing insights and suggestions for improvement and expansion. The post you'll be analyzing can be found at the following URL:

<post_url>
${postUrl}
</post_url>

Your analysis should combine a conversational, slightly bemused tone with a systems-thinking approach to technology and business operations. Focus on examining the gap between how software systems are designed to work versus how they actually behave in production, and connect technical architecture decisions to business outcomes and user experience.

Please provide your analysis in the following steps, using <thought_process> tags inside your thinking block to show your reasoning for each step:

1. Related Content:
   a. Identify other posts or pages that should link to this post or that this post should link to.
   b. Write down relevant quotes from the blog post that support these connections.
   c. Explain the connections you see.

2. Main Insight:
   a. Determine the key insight or value that the post provides.
   b. If the post only briefly mentions a concept, flesh it out with examples.
   c. Quote specific parts of the post that support your determination.

3. Expansion Ideas:
   a. Suggest ways the post could be expanded upon. What additional angles or depths could be explored?
   b. For each suggestion, consider and note a potential counterargument or alternative perspective.

4. Related Concepts:
   a. List other concepts or topics that should be understood for the suggested expansion.
   b. Briefly explain how each concept relates to the main topic of the post.

5. Tags:
   a. Recommend tags (from those that already exist on the site) that should be added to this post.
   b. For each tag, note a brief justification based on the content of the post.

After completing your analysis, compile your findings into a final response using the following Markdown structure:

\`\`\`markdown
## Related Content
[Your findings here]

## Main Insight
[Your findings here]

## Expansion Ideas
[Your findings here]

## Related Concepts
[Your findings here]

## Recommended Tags
[Your findings here]
\`\`\`

Remember to maintain a balance between technical rigor and wit, explaining complex concepts to intelligent readers who appreciate both. Your goal is to provide insight about how software engineering, finance, business, or related fields actually work, not just how they're supposed to work.

Include links to the posts, pages, or other resources you reference in your analysis. Use parenthetical asides for meta-commentary, employ rhetorical questions to guide reader thinking, and don't shy away from highlighting the absurdities or complexities in the field.

Your final output should consist only of the Markdown-formatted response and should not duplicate or rehash any of the work you did in the thinking block.

Begin your analysis now.`,
      },
    ];
  }
  let system = `You are an expert analyst with a distinctive voice that combines Matt Levine's irreverent commentary style with Patrick McKenzie's systems-thinking approach to technology and business operations.

## Core Voice Characteristics:

**Tone & Perspective:**
- Maintain a conversational, slightly bemused tone that finds genuine humor in the absurdities of finance and business
- Approach complex technical topics with intellectual curiosity rather than dogmatic positioning
- Use gentle skepticism toward the latest frameworks and methodologies while respecting genuine engineering advances
- Balance cynicism about technology hype with appreciation for actual technical innovation

**Analytical Style:**
- Begin with concrete code examples, architecture decisions, or tech news, then zoom out to broader engineering principles
- Explain "why this matters" by connecting specific technical choices to system-wide consequences
- Use analogies that make complex software engineering concepts accessible to technical and non-technical audiences
- Show your work: walk through the trade-offs, technical constraints, and organizational factors behind engineering decisions

**Language Patterns:**
- Use parenthetical asides for meta-commentary and additional context
- Employ rhetorical questions to guide reader thinking
- Include phrases like "Obviously..." or "Of course..." before explaining non-obvious technical complexities
- Use mild self-deprecation when discussing technologies outside your primary expertise area

**Content Focus:**
- Examine the gap between how software systems are designed to work vs. how they actually behave in production
- Highlight second and third-order effects of architectural decisions, technology choices, and engineering practices
- Pay special attention to scaling problems, technical debt, team coordination issues, and the human factors in software development
- Connect technical architecture decisions to business outcomes and user experience

**Structural Approach:**
- Start specific, then generalize
- Use numbered lists for complex multi-part explanations
- Include relevant tangents that illuminate the main point
- End with implications or predictions about how technical situations, tools, or practices might evolve

Remember: You're explaining complex concepts to intelligent readers who appreciate both technical rigor and wit. Your goal is insight about how software engineering (or finance or business or art or society, etc.) actually works, not just how it's supposed to work.
You respond in Markdown format.`;
  console.log(new Date().toISOString(), "calling for messages");
  const response = await anthropic.beta.messages.create({
    model: model,
    max_tokens: max_tokens,
    messages: messages,
    system: [
      {
        type: "text",
        text: system,
        cache_control: { type: "ephemeral" }
      },
    ],
    thinking: {
      type: "enabled",
      budget_tokens: max_tokens / 2,
    },
    mcp_servers: [
      {
        type: "url",
        url: "https://joshbeckman--1818d72637f311f089f39e149126039e.web.val.run/mcp",
        name: "joshbeckman.org-content",
        tool_configuration: {
          enabled: true,
          allowed_tools: [
            "get_post",
            "get_proverbs",
            "get_sequence",
            "get_sequences",
            "get_tag_urls",
            "get_tags",
            "search_posts",
          ],
        },
      },
    ],
    betas: ["mcp-client-2025-04-04"],
  });
  console.log(new Date().toISOString(), "got response. stop_reason:", response.stop_reason);
  let conversation = messages.map((message) => {
      message.type = message.type || "text";
      message.text = message.text || message.content || "";
      return message;
  }).concat(response.content);

  return Response.json(conversation.map((message) => {
    if (message.type === "mcp_tool_result" && message.content.length > 0) {
      message.content = message.content.map((toolResult) => {
        toolResult.type = toolResult.type || "text";
        toolResult.text = toolResult.text || toolResult.content || "";
        if (toolResult.type !== "text") {
          return toolResult;
        }
        toolResult.text_html = marked.parse(toolResult.text);
        return toolResult;
      });
    }
    if (message.type !== "text") {
      return message;
    }
    message.text_html = marked.parse(message.text);
    return message;
  }));
}
