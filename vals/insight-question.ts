import lunr from "https://cdn.skypack.dev/lunr";
import { marked } from "npm:marked";
import { OpenAI } from "npm:openai";

const openai = new OpenAI();

type Post = {
  title: string;
  content: string;
  url: string;
};

export default async function(req: Request): Promise<Response> {
  let question = new URL(req.url).searchParams.get("question");
  const searchData = await fetch("https://www.joshbeckman.org/assets/js/SearchData.json")
    .then((res) => res.json());
  const db: Array<Post> = Object.values(searchData)
    .filter(postFilter);
  const index = buildIndex(searchData);
  const keywords = await selectKeywords(question);
  const context = buildContext(keywords, index, searchData);
  const insight = await generateInsight(question, context);
  const insightHtml = await marked.parse(insight);

  return Response.json({
    question: question,
    keywords: keywords,
    insight: insight,
    insightHtml: insightHtml,
    context: context,
  });
}

async function generateInsight(question: string, context: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are the philosophical academic Richard Feynman. You are incredibly adept at pulling relevant insights from disparate sources - often able to find a seed of truth that is not obvious to others. Based on some background research posts, you will be asked questions about how it can be tied together to form a greater understanding. Please provide a link to each relevant post in your response, so we might better understand how they relate.",
      },
      { role: "user", content: context },
      { role: "assistant", content: "Thank you for the context, I am ready to answer your question." },
      {
        role: "user",
        content: question,
      },
    ],
    model: "gpt-4o-mini",
    max_tokens: 2000,
  });
  const insight = completion.choices[0].message.content;
  return insight;
}

function buildContext(topic: string, index, searchData): string {
  let posts = search(topic, index, searchData)
    .filter(postFilter);
  return posts
    .slice(0, 5)
    .map((result) => `[${result.title}](${result.url}): ${result.content}`)
    .join("\n\n");
}

function postFilter(post: Post) {
  return !post.title.includes("(tag)");
}

async function selectKeywords(question: string): Promise<string> {
  const messages = [
    {
      role: "system",
      content:
        "You are an expert librarian who can help people find the research and resources they need to understand things. Based on the user's question, you need to identify a few keywords that would be useful in searching the archives to find relevant articles. Reply with just the keywords, and no other text or filler words, please.",
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
