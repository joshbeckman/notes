---
layout: Post
date: '2025-08-04 18:02:41 +0000'
title: 'Building Paperboy: A Personal Reading Recommendation Engine'
toc: true
image: "/assets/images/c403a529-190b-4c2a-8ac4-5ba840c320d8.png"
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/114972426892917389
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3lvm2ir7kcn2z
tags:
- automation
- llm
- readwise-ruby
- language-ruby
serial_number: 2025.BLG.120
---
I have a problem. My [Readwise](https://readwise.io/) [Reader](https://readwise.io/read) inbox has over a thousand articles waiting to be read. Despite reading daily, I almost always reach for something recent, leaving that backlog perpetually growing.

I don't just want to clear the queue. I want to optimize for momentum in my reading. When I'm deep in a topic, I want to find the counterpoints and complementary perspectives that will sharpen my thinking. When I'm writing about something, I want to surface the articles from months ago that suddenly become relevant.

So I built [Paperboy](https://github.com/joshbeckman/paperboy), a tool that creates a personalized newspaper from my reading backlog based on what I'm currently thinking and writing about.

## Context-Aware Reading

My reading workflow has always been about building momentum. When I read an article about database indexing strategies, I want to follow it with related perspectives – maybe that piece about PostgreSQL internals I saved six months ago, or the counterargument about why indexes aren't always the answer. But finding these connections in a thousand-article backlog is very hard.

The standard approaches didn't work:
- **Chronological reading** meant missing timely connections
- **Tag-based organization** required prescient categorization
- **Search** only works when you know what you're looking for (and when I remember to do it)
- **Random selection** lacks the contextual relevance I craved

What I needed was something that understood not just what I'd saved, but what I was actively thinking about right now.

## AI-Powered Curation

Paperboy combines three key insights:

1. **Your recent reading reveals your current interests**: The articles I've read in the past two weeks are a strong signal for what I'm thinking about
2. **Your writing is your deepest thinking**: What I'm writing about represents where I want to go deeper
3. **AI can find non-obvious connections**: Modern large language models excel at finding thematic links between disparate content

The workflow is simple: I run the paperboy `rake` command and it:
- Exports my recent reading history and inboxes from Readwise Reader
- Starts a headless [Claude Code slash command](https://docs.anthropic.com/en/docs/claude-code/slash-commands) to:
  - Analyzes my recent writing on my site
  - Peruses my thousand-article backlog/inbox for relevant pieces
  - Delivers a personalized newspaper via email

## Technical Implementation

The architecture splits into three parts:

### Data Export (Ruby + Readwise API)

I used Ruby and my own [`readwise-ruby`](https://github.com/joshbeckman/readwise-ruby) gem to handle the Readwise integration:

```ruby
def export_documents(location, start_date, file_prefix = location)
  documents = @readwise.list_documents(
    location: location,
    updated_after: start_date
  ).to_a

  documents.each do |doc|
    clean_doc = clean_document(doc)
    filename = generate_filename(clean_doc[:title], file_prefix)

    File.write(
      File.join(location_dir, "#{filename}.json"),
      JSON.pretty_generate(clean_doc)
    )
  end
end
```

I chose JSON files over a database for a simple reason: the filesystem is already a great database for this use case. Agents can use `grep`, `find`, and other standard CLI tools without me building a query interface. The filesystem structure provides natural organization, and I don't have to maintain a database dependency.

Each document gets exported with cleaned metadata and a readable, timestamped filename. The key directories are:
- `new/` – Unread articles (the main backlog)
- `later/` – Articles I've marked for later (not much difference, at the moment)
- `recent_reading/` – What I've read in the past 2 weeks

### Multi-Agent Analysis (Claude Code)

The magic happens through specialized [Claude subagents](https://docs.anthropic.com/en/docs/claude-code/sub-agents), each focused on one aspect:

1. **Writing Themes Analyst** – Examines my recent posts via [this site's MCP server](https://www.joshbeckman.org/blog/i-built-an-mcp-server-for-my-site) to identify current themes
2. **Document Archive Analyst** – Analyzes reading patterns from the past 2 weeks
3. **Engaging Journalist** – Creates the final newspaper with prioritized recommendations

This multi-agent approach lets each component focus on its specialty while maintaining security through restricted tool access. And the first two run in parallel, speeding up the overall process.

### Delivery

The final newspaper gets delivered via email using MCP tools (soon, I'll write up how I did this), formatted with:
- **Must Read** section (3-5 high-priority articles)
- **Interesting Connections** (unexpected but relevant finds)
- **For Later** (lower priority but still relevant)
- Direct links back to Readwise Reader for seamless reading

## Results

After just one day of using Paperboy, it's already proving its value:

**Momentum Amplification**: On my first run, Paperboy surfaced an article from two months ago – deep enough in the backlog that I likely wouldn't have found it manually. It perfectly complemented my recent agent-building work, and reading it yielded [valuable highlights](https://www.joshbeckman.org/notes/922122090) that connected directly to what I'm building now.

**Serendipitous Connections**: The AI often finds thematic links I wouldn't have made. An article about urban planning connected beautifully with my thoughts on software architecture – both dealing with systems that evolve under constraints.

**Early Success Rate**: Even on day one, I'm reading about half the recommendations – a much higher rate than my random browsing through the backlog. The context makes reading feel purposeful rather than obligatory.

## Technical Notes

**Why Ruby?**: Ruby remains my default beautiful language for tasks like this, and I could use my Readwise API client gem.

**Why Multiple Agents?**: Rather than one mega-prompt, specialized agents provide better and faster results. The writing analyst doesn't need to know about document structure, and the archive analyst doesn't need access to my website.

**Why Email Delivery?**: Email creates a natural checkpoint in my day. The newspaper arrives, I can read it when ready, and the links take me directly to Reader. No new app or workflow to manage. Also, it means I can read it on any device, not just where I run the script. _Also_ also, it means I can revisit past issues easily, since they're just emails in my archive.

## Claude Code's Subagent Interface

Building Paperboy gave me a chance to explore Claude Code's new subagent creation interface, and I learned a bit about how these agents perform.

**Easy to Create, Specific in Purpose**: The interface makes creating subagents remarkably easy, but they're not the general-purpose collaborators I initially expected. You need to tightly constrain them for a specific purpose. Think of them less as pair programmers sitting next to you and more as specialists working in separate rooms whom you send specific requests.

**The Prompts**: Using Claude Code's built-in generator revealed something surprising – the prompts it creates for subagents are substantial. Running `wc` on my agent files shows:
- Writing themes analyst: 56 lines, 5.3KB
- Document archive analyst: 95 lines, 5.9KB
- Engaging journalist: 65 lines, 5.2KB

It's a reminder that I should revisit my expectations around prompt size. These aren't just short instructions; they're full-fledged prompts for the agent's behavior.

**Independent Actors Pattern**: I initially tried implementing this without subagents, and while it worked, everything ran serially and took longer. The multi-agent approach provides natural parallelization and cleaner separation of concerns.

The most successful approach treats each subagent as an independent actor with a narrow scope. This separation isn't a limitation – it's a feature. By keeping agents focused and independent, you get more predictable, higher-quality outputs.

The subagent interface revealed an interesting design philosophy: rather than creating AI "coworkers," we're creating AI "services" – focused, stateless, and composable. This actually makes them more powerful for automation tasks like Paperboy, where you want consistent, repeatable behavior rather than creative collaboration.

## Economics of Personalized Curation

One thing to note: running Paperboy costs about $1-1.50 per run in Anthropic API fees (using the latest Sonnet model). That's not prohibitive, but it's not throwaway money either. I'm planning to run it once or twice a week – enough time between runs for my reading input and writing output to move, ensuring diverse recommendations.

This cadence also makes sense cognitively. Daily recommendations are too frequent to act on, while weekly gives me time to actually read the suggestions and develop new interests for the next batch.

## Open Source and Adaptable

Paperboy is [open source](https://github.com/joshbeckman/paperboy) and designed to be adaptable. While it's built around my specific workflow (Readwise + Claude Code + MCP), the core pattern – using Claude Code to find contextually relevant content from a large Readwise archive – could work for you.

Our backlogs aren't just queues; they're potential knowledge waiting to be activated at the right moment. By understanding what we're currently thinking about, we can surface the most relevant pieces from our half-hearted curation efforts.

Honestly, I think Readwise should be building something like this directly into Reader. They wouldn't have access to personal writing data like I do through MCP, but they could absolutely recommend articles based on recent reading patterns.

For now though, I'm happy with my personal newspaper delivery service. Even after just one day, it's already surfacing gems from my backlog that perfectly complement my current work. That's worth the dollar and the weekly ritual.

<img width="2000" height="1000" alt="Paperboy repo header" src="/assets/images/c403a529-190b-4c2a-8ac4-5ba840c320d8.png" />
