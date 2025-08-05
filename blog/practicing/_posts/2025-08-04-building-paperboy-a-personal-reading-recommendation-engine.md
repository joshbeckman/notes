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

## Example Newspaper

```md
## Your Personal Evening Edition • Summer 2025

*Good evening, Josh. While you've been building MCP servers and pondering the dual nature of writing for humans and AI training, your unread collection has been quietly accumulating some remarkable pieces that seem almost handpicked for your current intellectual journey.*

---

## 📊 YOUR READING PATTERNS DECODED

Your recent consumption tells a fascinating story: **40% AI and Technology Engineering** (the practical stuff, not the hype), **25% Technology Criticism** (platform economics and digital rights), **15% Financial Markets** (Matt Levine's influence showing), and the rest split between engineering leadership and personal optimization. You're clearly in an experimental phase with AI tools while maintaining a healthy skepticism about the broader implications.

**Translation**: You want depth over breadth, practical wisdom over quick takes, and you're building while critically evaluating.

---

## 🚨 MUST READ TONIGHT
*These five pieces are practically speaking your language*

### 1. The Memory Problem Solver
**[Building proactive AI agents](https://read.readwise.io/read/01jxwe3aah9vcayxvx0hk6g11s)** by Bryan Houlton

Remember your MCP server experiments? Houlton built Orin, an AI tutoring system with "decaying-resolution memory" that gets more specific as interactions increase. It's not just another AI agent story—it's a blueprint for the kind of personalized, context-aware systems you're clearly fascinated by.

*Why now*: This directly extends your current AI agent work with a practical memory architecture approach.

### 2. The Thinking Tool Breakthrough 
**[The 'think' tool: Enabling Claude to stop and think in complex tool use situations](https://read.readwise.io/read/01jz3sax9b1bgjbqn15s9v53mg)** by Anthropic

This isn't marketing fluff—it's the technical explanation of how Claude's "think" tool actually works to improve problem-solving by creating assessment pauses. Given your LLM optimization interests, this is essentially a look under the hood of the cognitive architecture you're working with daily.

*Why now*: Perfect timing as you optimize LLM workflows and tool chains.

### 3. The PRD-to-Iteration Pipeline
**[Align, Plan, Ship: From Ideas to Iterations with PRD-Driven AI Agents](https://read.readwise.io/read/01jy6wyx3b1kdb8z72smg7rrsm)** by Oleksiy Kovyrin

Kovyrin describes using AI agents to transform PRDs into detailed project plans and focused tasks. This matches your specification-driven development philosophy perfectly—it's process optimization with AI that actually makes sense.

*Why now*: Bridges your engineering leadership experience with your current AI tool experimentation.

### 4. The Citation-Aware Writing Assistant
**[Google's NotebookLM Aims to Be the Ultimate Writing Assistant](https://read.readwise.io/read/01hhxc2t6vnc1w1jgsv6e9j0x0)** by Steven Levy (WIRED)

NotebookLM analyzes research material while maintaining proper citations—solving the "AI writing for AI training" problem you've been thinking about. It's a concrete example of how AI can enhance rather than replace the human writing process.

*Why now*: Directly relevant to your content strategy and writing-as-AI-training-data concerns.

### 5. The Developer Learning Manual
**[10 things software developers should learn about learning](https://read.readwise.io/read/01hvh1wp8x7186gn51nn20b57c)** by Abi Noda

Noda breaks down how developers actually learn and retain information, with practical implications for hiring and training. This combines your engineering leadership background with your continuous learning philosophy.

*Why now*: Actionable insights for both personal development and team building.

---

## 🔗 INTERESTING CONNECTIONS
*Unexpected ways these pieces link to your work*

### The Personal Agent Ecosystem
**[Who will build new search engines for new personal AI agents?](https://read.readwise.io/read/01hse7ttbec3k2s4s903ck60hn)** by Interconnected

Your MCP server work is part of a larger trend toward personal AI agents that need new search infrastructure. This piece connects the dots between your current projects and the emerging ecosystem they'll operate in.

### The Alternative Web Vision
**[We can have a different web](https://read.readwise.io/read/01hwtyngdtnaa3spvnvehn8wqt)** by Molly White

White's vision for a web beyond platform domination directly supports your POSSE philosophy and personal publishing infrastructure work. It's the ideological foundation for the technical work you're doing.

### The Personal Site Manifesto
**[Why Have a Personal Site Instead of Social Media?](https://read.readwise.io/read/01j1m9xm39h4144phktdn1xnvx)** by Kev Quirk

Quirk articulates the ownership and control benefits that drive your cross-platform syndication systems. It's validation for your technical choices from a philosophical perspective.

---

## 📚 FOR LATER
*Lower priority but still in your wheelhouse*

- **[Remaking the app store](https://read.readwise.io/read/01hnr96cegfhdf77z8fwwh22kb)** by Benedict Evans - Platform economics meets regulatory reality
- **[AI: the not-so-good parts](https://read.readwise.io/read/01hmd4t7mkhfrhnswka46942j4)** by Xe's Blog - Critical counterbalance to AI enthusiasm 
- **[How bad are search results? Let's compare Google, Bing, Marginalia, Kagi, Mwmbl, and ChatGPT](https://read.readwise.io/read/01hk0drhypbhs1j9dm6x8nb63t)** by Dan Luu - Technical analysis of search quality degradation

---

## 🧵 TOPIC THREADS
*How these pieces weave together*

**The Personal AI Infrastructure Stack**: Articles 1, 2, 3, and 6 form a complete picture of building personal AI systems that actually work—from memory architecture to tool chains to search infrastructure.

**The Independent Creator's Toolkit**: Articles 4, 7, and 8 support your vision of controlled, cross-platform content creation that serves both human readers and AI training while maintaining ownership.

**The Critical Technologist's Reading List**: Articles 5, 9, 10, and 11 provide the analytical framework for evaluating new tools and platforms without falling into either extreme hype or dismissal.

---

*That's your evening reading sorted. These aren't just articles—they're the next chapters in the story you're already writing about personal technology sovereignty and practical AI integration.*

**Happy reading,** 
*The Paperboy* 📰
```

<img width="2000" height="1000" alt="Paperboy repo header" src="/assets/images/c403a529-190b-4c2a-8ac4-5ba840c320d8.png" />
