---
layout: Post
date: '2025-06-30 13:07:03 +0000'
title: Exploring Datapacks
toc: true
image: "/assets/images/9ff9e3af-c9f4-4fa4-bf64-8fcf200aa8b0.jpeg"
description:
mastodon_social_status_url: false
bluesky_status_url: false
tags:
- data
- research
- software-engineering
- tools
- personal-blog
- llm
- education
- automation
---


![Josh carrying a big pack](/assets/images/9ff9e3af-c9f4-4fa4-bf64-8fcf200aa8b0.jpeg)

I was skeptical when reading [Will Larson's datapack concept](https://www.joshbeckman.org/notes/906991341): a static export of content on a specific topic, uploaded as a file to an LLM client. In a world where LLMs are trained on the entire web and MCP servers can provide structured access to any site's content, why would we need yet another medium to give context to LLM agents?

But after exploring the tension between those different media, I've become convinced that datapacks solve unique problems that neither training data nor MCP servers address. Here's why I'm excited to both use and create them.

## The Problem with "Everything is Training Data"

Yes, LLMs already know about most publicly published content. But this brings several issues:

- **Temporal boundaries**: Models have knowledge cutoffs
- **Attribution fog**: LLMs blend sources, making precise citation impossible  
- **Synthesis drift**: Concepts get subtly transformed through the training process
- **Adversarial pollution**: As AI-generated content floods the web, training data becomes increasingly unreliable

More fundamentally, "my content is somewhere in your training data" is very different from "here's exactly what I want you to know for this task," when I'm using an LLM agent to plan or create something.

## Datapacks as Context Kits

The first breakthrough insight: datapacks aren't competing with web content or MCP servers - they're **curated context**; big reference blocks you curate for yourself and carry around and use deliberately. 

Instead of prompting an LLM to search for relevant information (burning tokens and time), I can load a pre-assembled kit:
- "Architecture Decision Record Pack" for design reviews
- "Brand Voice Kit" for consistent content creation  
- "Personal Medical History" for health discussions
- "Project Context Bundle" for focused work sessions

This makes datapacks look like capability cartridges - I'm temporarily equipping an LLM with specific, bounded expertise. I'll probably build up a library of datapacks (or subscribe to a service that provides/updates them) the same way I'm building up a library of LLM prompts[^1] (and a [library of MCP servers](https://www.joshbeckman.org/blog/3lgds3uw7t22z)).

## Compelling Economics

Then I started thinking about whether there would be financial incentive for people to use datapacks. Consider the token costs:

**Via MCP tool calls**: 
- Multiple queries to find relevant content
- Processing and filtering responses  
- Deciding what's actually needed
- Often requiring follow-up queries
- Total: ~50k tokens ($0.50-$1.00)

**Via datapack**:
- One-time context load
- Pre-filtered and organized
- Total: ~5k tokens ($0.05-$0.10)

This 10-20x efficiency opens up a new creator economy. I'd happily pay $5-10 for curated datapacks that save me time and API costs:
- "Complete guide to browser JavaScript event loops"
- "Academic papers on transformer architectures, with summaries"
- "Zoning regulations for Cook County"

## Strategic Fact Reserves

Defensively, datapacks can serve as personal "[strategic fact reserves](https://www.joshbeckman.org/notes/907497305)" - carefully curated knowledge that I control and can use to:

- **Test models**: Does this LLM get my field's fundamentals right?
- **Correct biases**: Here's accurate information about my domain/culture/community
- **Fine-tune**: Make this model an expert using MY curated knowledge
- **Detect drift**: Periodically validate that models haven't degraded

As base models become more opaque and AI-generated content pollutes the web, maintaining these verified knowledge anchors becomes critical for preserving truth.

## Breaking the Security Trifecta

Simon Willison identified the ["lethal trifecta"](https://www.joshbeckman.org/notes/907494919) for AI agents: access to private data + exposure to untrusted content + ability to communicate externally = data exfiltration risk.

MCP servers inherently involve external communication. But datapacks break this trifecta:
- Content accessed locally
- No external API calls during use
- Even malicious instructions can't phone home

This makes datapacks ideal for sensitive domains - medical records, financial data, proprietary research - where data leakage is unacceptable.

## Building My Own Datapacks

I'm convinced enough to start experimenting with datapacks for my own site. My initial plans:

1. **Themed collections**: Curated sets of posts on specific topics
2. **Sequence packs**: Complete post series ([sequences](https://www.joshbeckman.org/blog/tracing-sequences-and-finding-anchors)) with proper ordering and context
3. **Project documentation**: All writings related to specific projects I've worked on

The goal isn't to replace my website or [MCP server](https://www.joshbeckman.org/blog/i-built-an-mcp-server-for-my-site), but to offer high-value, pre-processed knowledge products that save readers time and enhance their AI interactions. It's also as easy door for me to bring my site content into LLM interfaces that don't support me connecting my own MCP server (e.g. work LLMs, Claude for iOS, etc.)

## The Hybrid Future

Obviously, I don't see datapacks replacing traditional web publishing or MCP servers. Instead, we're heading toward a hybrid ecosystem for publishers/authors:

- **Web publishing**: For human readers and [influencing training data](https://www.joshbeckman.org/notes/884224560)
- **MCP servers**: For dynamic queries and real-time context
- **Datapacks**: For curated context, offline use, and high-trust applications

In an AI-mediated future, the author's question isn't "how can I make my content accessible?" but "how can I package my knowledge to fit the use case?" Datapacks fit in: as focused, verifiable, efficient context kits that readers can deploy exactly when and how they need them.

[^1]: Relation to **Prompts**: I view prompts as useful for curated grounding points and bringing personal styles into the LLM client. Generally they're small and hand-tuned by users to be applied as a filter on the working context.  So they're related to datapacks (in that they're static and curated) but they're not sources of truth.
