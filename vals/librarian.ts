import { email } from "https://esm.town/v/std/email?v=9";

type Entry = {
  title: string;
  content: string;
  date: string;
  type: string;
  url: string;
};

export default async function(interval: Interval) {
  const searchData = await fetch("https://www.joshbeckman.org/assets/js/SearchData.json")
    .then((res) => res.json());
  const cutoff = new Date(Date.now() - 36 * 60 * 60 * 1000); // 36h ago
  const posts: Array<Entry> = Object.values(searchData)
    .filter((entry) => entry.type === "post" && new Date(entry.date) > cutoff)
    .slice(0, 6);
  console.log(`Suggesting tags for ${posts.length} posts`);
  const suggestedTags = await Promise.all(posts.map(suggestTags));
}

async function suggestTags(post: Entry): Promise<Array<string>> {
  const response = await fetch("https://joshbeckman-grayhornet.web.val.run", {
    method: "POST",
    body: new FormData({ content: post.content }),
  }).then((res) => res.json());
  const suggestedTags = response.suggestedTags;
  const presentTags = post.tags.split(" ");
  const newTags = suggestedTags.filter((tag) => !presentTags.includes(tag));
  if (newTags.length < 1) {
    return newTags;
  }
  const text = `New tags for [${post.title}](https://www.joshbeckman.org${post.url}): ${newTags.join(", ")}`;
  await email({
    text,
  });
  return newTags;
}
