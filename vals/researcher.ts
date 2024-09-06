import lunr from "https://cdn.skypack.dev/lunr";
import { email } from "https://esm.town/v/std/email?v=9";
import { marked } from "npm:marked";
import Anthropic from "npm:@anthropic-ai/sdk";

const anthropic = new Anthropic();
const model = "claude-3-5-sonnet-20240620";

type Entry = {
  title: string;
  content: string;
  date: string;
  type: string;
  url: string;
  tags: string;
};

type Tag = {
  name: string;
  decimal: string;
  slug: string;
};
// run on interval
// select recent posts
// for each
//   determine relevant topics
//   for each topic
//      search posts for those topics
//      summarize how this post is different
//      summarize how this post is related
//   determine tags
//   for each tag
//      search posts for that tag
//      summarize how this post is different
//      summarize how this post is related

export default async function(interval: Interval) {
  const searchData = await fetch("https://www.joshbeckman.org/assets/js/SearchData.json")
    .then((res) => res.json());
  const cutoff = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const entries: Array<Entry> = Object.values(searchData)
    .map((entry) => {
      entry.url = "https://www.joshbeckman.org" + entry.url;
      return entry;
    });
  const posts = entries.filter((entry) => entry.type === "post");
  const pages = entries.filter((entry) => entry.type === "page");
  const maxPosts = 5;
  const recentPosts = posts.filter((entry) => new Date(entry.date) > cutoff);
  const shuffledPosts = posts.sort(() => Math.random() - 0.5).filter((entry) => {
      return !recentPosts.includes(entry);
  });
  const postsToProcess = recentPosts.concat(shuffledPosts).slice(0, maxPosts);
  const index = buildIndex(posts.concat(pages));
  const searcher = makeSearcher(index, searchData);
  await Promise.all(postsToProcess.map((post) => introspectPost(post, searcher)));
}

async function introspectPost(post: Entry, search): Promise<void> {
  console.log(`introspecting ${post.title}`);
  const maxTopics = 3;
  const maxTags = 3;
  const [allTopics, allTags] = await Promise.all([suggestTopics(post.content), suggestTags(post.content)]);
  const topics = allTopics.slice(0, maxTopics);
  const tags = allTags.slice(0, maxTags);
  const summaries = await Promise.all(
    topics.map((topic) => summarizeTopic(topic, post, search))
        .concat(tags.map((tag) => summarizeTag(tag, post, search)))
  );
  let lines = [
    "Hi! I've been thinking about this post:",
    `# [${post.title}](${post.url})`,
    post.content,
    "---",
  ];
  const tagInsights = [
      `I think it should be tagged with ${tags.join(", ")}. Based on those tags (and how it relates to ${topics.join(", ")}), here's what I think:`,
  ].concat(summaries);
  const insights = lines.concat(tagInsights).join("\n\n");
  const summary = await summarizeInsights(post, insights);
  const oldTags = post.tags.split(" ");
  const newTags = allTags.filter((tag) => !oldTags.includes(tag));
  const emailText = [
    "Hi! I've been thinking about this post:",
    `# [${post.title}](${post.url})`,
    post.content,
    "---",
    `I think these tags should be added: ${newTags.join(" ") || "(none)"}.`,
    `It made me think about these topics: ${topics.join(", ")}.`,
    summary,
    "---",
    "I hope this helps!",
    `- Librarian NPC 📚 (Anthropic ${model})`
  ].join("\n\n");
  const emailHTML = await marked.parse(emailText);
  await email({
    subject: `Re: ${post.title}`,
    text: emailText,
    html: emailHTML,
  });
}

async function summarizeInsights(post: Entry, insights: string): Promise<string> {
  const completion = await anthropic.messages.create({
    system:
      "You are the philosophical academic Richard Feynman. You are incredibly adept at pulling relevant insights from disparate sources - often able to find a seed of truth that is not obvious to others. Based on some background research posts, please summarize a couple key insights. Use a brief style with short replies. Please provide a link to relevant posts in your response, so we might better understand how they relate.",
    messages: [
      { role: "user", content: insights },
    ],
    model,
    max_tokens: 2048,
  });
  const insight = completion.content[0].text;
  return insight;
}

async function summarizeTopic(topic: string, post: Entry, search): Promise<string> {
  const maxRelated = 3;
  const results = search(topic);
  const related = results.filter((result) => result.url !== post.url);
  if (related.length < 1) {
    return `This post is the only one related to "${topic}".`;
  }

  const research = related.slice(0, maxRelated).map((result) => {
    return [`# [${result.title}](${result.url})`, `${result.content}`].join("\n\n");
  }).join("\n\n");
  const context = [
    `I did a bunch of previous research and found these posts related to "${topic}":\n\n${research}`,
    `Now I found this new post:\n\n# [${post.title}](${post.url})\n\n${post.content}`,
  ].join("\n\n");
  const question =
    `How does this post complement the related posts? How does it contrast?`;
  const completion = await anthropic.messages.create({
    system:
      "You are the philosophical academic Richard Feynman. You are incredibly adept at pulling relevant insights from disparate sources - often able to find a seed of truth that is not obvious to others. Based on some background research posts, you will be asked to compare and contrast them to a new post. Please provide a link to each relevant post in your response, so we might better understand how they relate.",
    messages: [
      { role: "user", content: context },
      { role: "assistant", content: "Thank you for that context. What is your question?"},
      {
        role: "user",
        content: question,
      },
    ],
    model,
    max_tokens: 1028,
  });
  const insight = completion.content[0].text;
  return insight;
}

async function summarizeTag(tag: string, post: Entry, search): Promise<string> {
  const maxRelated = 3;
  const results = search(tag);
  const related = results.filter((result) => result.url !== post.url);
  if (related.length < 1) {
    return `This post is the only one tagged with "${tag}".`;
  }

  const research = related.slice(0, maxRelated).map((result) => {
    return [`# [${result.title}](${result.url})`, `${result.content}`].join("\n\n");
  }).join("\n\n");
  const context = [
    `I did a bunch of previous research and found these posts tagged with "${tag}":\n\n${research}`,
    `Now I found this new post:\n\n# [${post.title}](${post.url})\n\n${post.content}`,
  ].join("\n\n");
  const question =
    `How is this post different from the related posts? How is it similar? What insights can you provide?`;
  const completion = await anthropic.messages.create({
    system:
      "You are the philosophical academic Richard Feynman. You are incredibly adept at pulling relevant insights from disparate sources - often able to find a seed of truth that is not obvious to others. Based on some background research posts, you will be asked to compare and contrast them to a new post. Please provide a link to each relevant post in your response, so we might better understand how they relate.",
    messages: [
      { role: "user", content: context },
      { role: "assistant", content: "Thank you for that context. What is your question?"},
      {
        role: "user",
        content: question,
      },
    ],
    model,
    max_tokens: 1028,
  });
  const insight = completion.content[0].text;
  return insight;
}

async function suggestTags(content: string): Promise<Array<string>> {
  const tags: Array<Tag> = await fetch("https://www.joshbeckman.org/assets/js/decimals.json")
    .then((res) => res.json());
  const leafTags = tags.filter((tag) => tag.decimal.match(/^\d\d\.\d\d$/));
  const leafSlugs = leafTags.map((tag) => tag.slug);
  const messages = [
    {
      role: "user",
      content: content,
    },
  ];
  const completion = await anthropic.messages.create({
  system:
    "You are an expert librarian who can help people find the research and resources they need to understand things. Based on what the user provices, you need to identify relevant tags (from a selected set) that should be used to file the content. Reply with just the tags, separated by commas, and no other text or filler words, please.\nHere are the tags you can choose from: " + leafSlugs.join(", "),
    messages: messages,
    model,
    max_tokens: 100,
  });
  const suggestedTags = completion.content[0].text.split(",").map((tag) => tag.trim());
  return suggestedTags.filter((tag) => leafSlugs.includes(tag));
}

async function suggestTopics(content: string): Promise<Array<string>> {
  const messages = [
    {
      role: "user",
      content: content,
    },
  ];
  const completion = await anthropic.messages.create({
    system: "You are an expert librarian who can help people find the research and resources they need to understand things. Based on what the user provides, you need to identify a few topics that would be useful in searching the archives to find related articles. Each topic should be one (maybe two) words long. Reply with just the topics, separated by commas, and no other text or filler words, please.",
    messages: messages,
    model,
    max_tokens: 100,
  });
  const topics = completion.content[0].text;
  return topics.split(",").map((topic) => topic.trim());
}

function buildIndex(posts: Array<Entry>) {
  lunr.tokenizer.separator = /[\s/]+/;
  return lunr(function() {
    this.ref("id");
    this.field("title");
    this.field("content");
    this.field("url");
    this.field("tags");
    this.metadataWhitelist = ["position"];

    for (var i in posts) {
      this.add({
        id: i,
        title: posts[i].title,
        content: posts[i].content,
        url: posts[i].url,
        tags: posts[i].tags,
      });
    }
  });
}

function makeSearcher(index, searchData) {
  return function(input: string) {
    return search(input, index, searchData);
  };
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
    item.score = result.score;
    item.match = result.matchData.metadata;
    return item;
  });
}
