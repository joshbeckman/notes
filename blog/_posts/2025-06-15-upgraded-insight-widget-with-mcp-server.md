---
layout: Post
date: '2025-06-15 00:00:00 +0000'
title: "Upgraded Insight Widget with MCP Server"
toc: true
image: /assets/images/insight-mcp.png
description: 
tags:
  - ai
  - llm
  - tools
  - personal-blog
---

So I've been running an [insight widget](/blog/using-an-llmand-rag-to-wring-insights-from-my-posts) on my site for about a year now. It's been a nice little tool for reflecting on my posts, but the LLM landscape is still moving incredibly fast and it was time for an upgrade.

A few weeks back I [built an MCP server](/blog/i-built-an-mcp-server-for-my-site) for this site, and obviously the really interesting question was: what could I actually *do* with direct LLM access to my entire post archive?

## From RAG to Agentic Loops

Here's a fun thing: my original insight widget used a classic RAG approach - grab some random posts, ask an LLM to find a common topic, search for related content, then generate insights. Which seems completely rational until you realize you're artificially constraining the LLM to whatever your search algorithm happens to return.

The new approach flips this entirely. Instead of me deciding what's relevant and feeding it to the LLM, I give the LLM direct access to search my entire site through the MCP server. Want to know what other posts should link to this one? The LLM can search for related content. Need to understand what tags already exist? It can explore the tag system. Curious about sequences or proverbs that might relate? All available through tool calls.

You know what's weird about this upgrade? Everyone treats MCP like it's just another API wrapper, but if you actually look at the interaction patterns, it's fundamentally different from traditional RAG. The LLM isn't just retrieving and generating - it's *exploring*. It can follow threads of inquiry, backtrack when something doesn't pan out, and build up context iteratively.

## The Technical Architecture

The new widget is deceptively simple on the frontend. When you click the details element, it makes a POST request to my [Val Town endpoint](https://joshbeckman--d1be1cf4398811f0a2079e149126039e.web.val.run) with just the post URL. That's it.

But behind the scenes, the [MCP-powered handler](https://github.com/joshbeckman/vals-insight-mcp/blob/main/main.ts) gives the LLM a much richer prompt:

> I'm reviewing the post at [URL]. What other posts/pages do you think it should link to (or should link to it)? What's the insight or value that the post provides? How could the post be expanded upon? What tags should be added to this post?

The LLM then uses the MCP server's tools to:
- Search for related posts (`search_posts`)
- Explore existing tags (`get_tags`, `search_tags`)  
- Find relevant sequences (`get_sequences`)
- Pull in proverbs when relevant (`get_proverbs`)
- Get full post content for deeper analysis (`get_post`)

## Voice and Personality

There's this pattern I keep seeing where technical tools try to sound neutral and professional, and the standard explanation is "we want to be authoritative," but I think what's really happening is they're boring their users to death.

I gave the new system a distinctive voice that combines Matt Levine's irreverent commentary style with Patrick McKenzie's systems-thinking approach. The system prompt specifically instructs it to:

- Find genuine humor in the absurdities of technology and business
- Use gentle skepticism toward the latest frameworks while respecting actual innovation
- Employ parenthetical asides and meta-commentary
- Connect specific technical choices to system-wide consequences

Obviously, this makes the insights more engaging to read, but the non-obvious benefit is that personality constraints actually help focus the LLM's reasoning. When you tell it to write like someone with a specific worldview, it has to filter its responses through that lens, which often produces more thoughtful analysis.

## From Batch to Interactive

The old widget was essentially batch processing - fire off some queries, get back some HTML, done. The new one surfaces the entire conversation flow, including all the MCP tool calls and their results.

Each tool use gets wrapped in a collapsible `<details>` element showing:
- The function name and parameters
- The raw result from the MCP server
- How that result informed the next step in reasoning

This transparency serves multiple purposes:
1. **Debugging**: I can see exactly what the LLM searched for and what it found
2. **Trust**: Readers can verify the sources and reasoning behind insights  
3. **Learning**: The exploration patterns reveal interesting connections I might have missed

## Second-Order Effects

Here's what I didn't expect: making the LLM's research process visible has changed how I think about my own writing. When I see it connecting a throwaway comment in one post to a detailed analysis in another post from two years ago, it highlights patterns in my thinking that weren't obvious to me.

The widget also serves as a kind of automated link-building tool. Since it suggests related posts that should cross-reference each other, it's helping create the kind of densely interconnected content web that makes personal sites more valuable over time.

And there's this weird effect where the insights often suggest expansions or follow-up posts. The LLM will identify gaps in my coverage of a topic or suggest angles I haven't explored. It's like having a research assistant who's read everything I've written and can suggest what to write next.

## Technical Implementation Notes

A few things I learned while building this:

**MCP tool calls are sequential and latency adds up.** The original approach would sometimes make 6-8 tool calls in sequence, which could take 30+ seconds. I optimized the prompts to be more focused and reduced typical interactions to 2-4 tool calls.

**Conversation format matters.** The frontend displays the full conversation array, with different rendering for user messages, tool calls, and LLM responses. This required careful handling of the message format transformation between the MCP client response and the frontend display.

**Error handling is critical.** Since this runs as an async process that can take 30+ seconds, I added proper loading states, browser notifications when complete, and fallback error messages when things go wrong.

## Migration Strategy

I kept the old widget around for now - you can still see it on older posts. The new MCP-powered version is gradually rolling out to newer content. This lets me compare approaches and gather feedback before fully committing to the new system.

The performance characteristics are different enough that I want to understand the implications before making it the default everywhere. The old system was predictably fast (5-10 seconds) but limited in scope. The new one is more variable (15-60 seconds) but much more capable.

## Where This Goes Next

The interesting thing about having an MCP server for your personal site is that it becomes a platform for all kinds of experiments. The insight widget is just one application - I could build research assistants, content recommendation engines, or tools for identifying content gaps.

I'm particularly intrigued by the idea of using this to identify "orphaned" content - posts that don't link to anything else and aren't linked from anywhere. The MCP server makes it trivial to analyze the link graph of the entire site and surface content that needs better integration.

The broader lesson here is about the difference between retrieving information and exploring it. RAG assumes you know what you're looking for. Agentic systems with tool access can discover things you didn't know you needed to find. And in the context of a personal knowledge base, that exploration capability turns out to be surprisingly valuable.

Try it out on this post - click the "Insight Agent" section below. It'll probably find connections I haven't thought of yet.
