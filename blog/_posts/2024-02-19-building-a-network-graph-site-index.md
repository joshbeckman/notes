---
layout: Post
date: 2024-02-19 15:32:33 +0000
title: Building a Network Graph Site Index
toc: true
image: /assets/images/4C804249D0304C4CBA565320A8D782C6.png
description: 
tags: 
- interfaces
- personal-blog
---

I had a fun time this morning building a network view/graph for this site\.

I’ve been wanting to walk a visual path through this notes garden for a while\. Browsing posts “near” each other and [finding edges that need pruning or encouragement](https://www.joshbeckman.org/blog/weeding-the-edges)\. I imagined a networked view of posts connected by their tags/topics and sources and backlinks\. I have really enjoyed the exercise of [programming these notes](https://www.joshbeckman.org/notes/472520959) and this site, and I want to lean into it\. A new interface might produce new thinking.

After some quick research, I found [the vis\-network library](https://github.com/visjs/vis-network), and it took me a couple hours this morning to put something together \([source here](https://github.com/joshbeckman/notes/blob/6e65c2c2610261b4a95c34ce6abc583364ab053b/_includes/Network.html)\)\.

You can see [the full network view at /network](https://www.joshbeckman.org/network/) \(beware, it takes a few seconds to load the couple\-thousand nodes and edges\)\.

<video controls src="/assets/videos/D0253D57B1CB4DE6BBCA4F86EA84C2A9.mov"></video>

Initially, I hated how jumpy the full graph was, but I’ve now learned to love how it never quite settles down\. I’ve tuned the physics engine a bit, but the constant movement kind of emulates how these all sit in my head anyway\. So instead of fighting it, I’m embracing it\.

So, that’s the “full garden”, but I also figured it would be nice to display a “local area network” on each post, so I whipped that up, too\.

![](/assets/images/4C804249D0304C4CBA565320A8D782C6.png)

## Legend
Here’s a basic legend:
- Each tag/topic is a `#` node
- Each source is a `#` node \(orange\)
- Each post is a `✎` node \(blue\)
- The current page/post is the `@` node \(yellow\)
- Clicking a node or edge highlights its connected nodes
- Double\-clicking a node navigates you to it
- You can scroll and pan and drag nodes around
- Nodes you have visited in this [browsing session](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) are recorded and edges you have travelled are highlighted \(red\)
I used the [colors from Tom Sachs](https://www.joshbeckman.org/blog/tom-sachs-colors), because that’s fun\. Initially, I had each node containing its title, but it was just *way* too busy, so I opted to display an icon for each and use hover/focus text to display the title\.
