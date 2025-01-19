import lunr from "https://cdn.skypack.dev/lunr";
import { OpenAI } from "npm:openai";
import { marked } from "npm:marked";

const openai = new OpenAI();

type Message = {
  role: string;
  content: string;
};

type Post = {
  title: string;
  content: string;
  url: string;
};

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
  var conversation = body.conversation;
  const systemPrompt = conversation.find((message) => message.role === "system")?.content;
  if (!systemPrompt) {
    return Response.json({ message: "The conversation must include a 'system' message." }, {
      status: 400,
    });
  }
  const searchData = await fetch("https://www.joshbeckman.org/assets/js/SearchData.json")
    .then((res) => res.json());
  const db: Array<Post> = Object.values(searchData)
    .filter(postFilter);
  const index = buildIndex(searchData);
  const keywords = await selectKeywords(compactConversation(conversation));
  const context = buildContext(keywords, index, searchData);
  conversation = conversation.concat([
    { role: "assistant", content: "Can you give me some more sources/context to help answer that?" },
    { role: "user", content: context },
  ]);
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

function buildContext(topic: string, index, searchData): string {
  return search(topic, index, searchData)
    .filter(postFilter)
    .slice(0, 3)
    .map((result) => `[${result.title}](${result.url}): ${result.content}`)
    .join("\n\n");
}

function postFilter(post: Post) {
  return !post.title.includes("(tag)");
}

// compact all the conversation messages into a single string (attributing each message to the specific role)
function compactConversation(conversation: Array<Message>): string {
    return conversation.map((message) => `[${message.role}]: ${message.content}`).join("\n");
}

async function selectKeywords(question: string): Promise<string> {
  const messages = [
    {
      role: "system",
      content:
        "You are an expert librarian who can help people find the research and resources they need to understand things. Based on the conversation, you need to identify a few keywords that we can use to search the archives to find articles relevant to continuing the conversation. Reply with just the keywords, and no other text or filler words, please.",
    },
    {
      role: "user",
      content: question,
    },
  ];
  const keywordsCompletion = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-4o-mini",
    max_tokens: 30,
  });
  const keywords = keywordsCompletion.choices[0].message.content;
  return keywords;
}

function buildIndex(searchData) {
  lunr.tokenizer.separator = /[\s/]+/;
  return lunr(function() {
    this.ref("id");
    this.field("title");
    this.field("content");
    this.field("url");
    this.field("tags");
    this.metadataWhitelist = ["position"];

    for (var i in searchData) {
      this.add({
        id: i,
        title: searchData[i].title,
        content: searchData[i].content,
        url: searchData[i].url,
        tags: searchData[i].tags,
      });
    }
  });
}

function search(input: string, index, searchData) {
  let results = index.search(input);

  if ((results.length == 0) && (input.length > 2)) {
    let tokens = lunr.tokenizer(input).filter(function(token, i) {
      return token.str.length < 20;
    });

    if (tokens.length > 0) {
      results = index.query(function(query) {
        query.term(tokens, {
          editDistance: Math.round(Math.sqrt(input.length / 2 - 1)),
        });
      });
    }
  }
  return results.map((result) => {
    const item = searchData[result.ref];
    return {
      title: item.title,
      content: item.content,
      url: "https://www.joshbeckman.org" + item.url,
      score: result.score,
      match: result.matchData.metadata,
    };
  });
}
