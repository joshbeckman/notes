---
toc: true
title: How To Link Like You Mean It
date: '2015-02-16 00:00:00'
redirect_from:
- "/learn-to-link-better"
- "/learn-to-link-better/"
- "/2015/02/16/learn-to-link-better"
- "/2015/02/16/learn-to-link-better/"
tags:
- personal-blog
- interfaces
- popular
serial_number: 2015.BLG.005
---
Links within your text do two things:

1. Provide me with valuable information or context
2. Direct me away from the text I’m reading

Please link like you mean it – with those points in mind. This means taking a few considerations for accessibility. Accessibility, here, means not only for handicapped access but also for normal access. Yes, I’ve begun noticing trends that make it difficult for me, a fully-sighted user, to access links within text.

### Visited links are not unvisited links

This is something small, but invaluable to me. An unvisited link is worth much more than a visited one. Especially on a mobile browser, the cost of clicking a link I’ve already read is high. I’ll need to navigate tabs, wait for page-load, scan, close, navigate back, and refocus. Save me the time and keep me with your text.

A good `visited` link state blends into the text just enough to go unnoticed. [Modern browsers only allow `visited` states to change color](http://www.nngroup.com/articles/change-the-color-of-visited-links/), so the best option is to choose a color that is about halfway between your `unvisited` link state and your plain text.

### Denote links

Everyone needs to be able to distinguish your links. There has been a widely resurgent trend in underlining links within text. I think this (still default within the browser) behavior is lovely. With an underline, or something similar, link recognition can happen without color.

The best, recent, example of this focus has been in [Medium’s use of the underline](https://medium.com/designing-medium/crafting-link-underlines-on-medium-7c03a9274f9). Medium still fails to distinguish between `visited` link states.

### Anchor text matters

Many writers will wrap a link around one or two ancillary words. How will that give anyone a reasonable idea of what is at the other end? Anchor text should be capable of standing alone while still conveying the link topic. Imagine the reader scanning your article and reading only the anchor text. Don’t anchor a video link with the word “[here](unsafe:javascript:alert('gotcha');).”

### Bonus points

- Distinguish links on `focus` for tab-navigation. An outline or subtle background is helpful here.
- Put `title` attributes on your links for voice readers and hover information.
- Put `rel` attributes on your links for navigation and search indexing.

### N.B.

These are all suggestions to improve links from a user’s standpoint. They are not always applicable to search engine optimization for links, though there is significant overlap. The overlap is especially true for anchor text, `rel` and `title` attributes, and link density.

