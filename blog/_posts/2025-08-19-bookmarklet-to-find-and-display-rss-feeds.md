---
layout: Post
date: '2025-08-19 12:57:51 +0000'
title: Bookmarklet to Find and Display RSS Feeds
toc: true
image: "/assets/images/1da6be97-f108-41e4-8708-5ebf0705cd9c.png"
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/115055943405367191
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3lwr5do2qzg27
tags:
- code-snippets
- language-javascript
serial_number: 2025.BLG.132
---
I wanted to get notified when my friend Kevin posts new photos to [his Flickr profile](https://www.flickr.com/photos/thekevinchang/). Flickr's documentation _says_ [it supports many feed formats](https://www.flickr.com/services/feeds) (including RSS/XML) but in order to actually _get_ those feed URLs, you have to go spelunking into the source code of the page and then decode the HTML entities the developers mistakenly left behind:

<img width="359" height="97" alt="atom URL in source of page" src="/assets/images/42a2217f-2366-4403-8e98-c037df90c95b.png" />

Yuck.

I used to have browser extensions to get these RSS links for me, but they're not working any more due to lack of maintainer support.

Instead, I wrote myself another bookmarklet ([my bookmarks are all bookmarklets](https://www.joshbeckman.org/blog/my-bookmarks-are-all-bookmarklets)) to find any RSS feeds in the current page and display them in a dialog with buttons to copy each. ([Instructions on how to install bookmarklets](https://en.wikipedia.org/wiki/Bookmarklet#Installation).)

<img width="777" height="299" alt="Example dialog from the RSS Finder bookmarklet" src="/assets/images/1da6be97-f108-41e4-8708-5ebf0705cd9c.png" />

Full version, that gives you a nice dialog and buttons to copy each URL:

```js
javascript:(function(){
  const existingDialog = document.getElementById('rss-feed-dialog');
  if (existingDialog) existingDialog.remove();
  
  const feeds = [];
  const linkElements = document.querySelectorAll('link[type="application/rss+xml"], link[type="application/atom+xml"]');
  
  linkElements.forEach(link => {
    feeds.push({
      title: link.title || 'Untitled Feed',
      href: link.href,
      type: link.type
    });
  });
  
  const dialog = document.createElement('div');
  dialog.id = 'rss-feed-dialog';
  dialog.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 2px solid #333;
    border-radius: 8px;
    padding: 20px;
    max-width: 600px;
    max-height: 400px;
    overflow: auto;
    z-index: 99999;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  `;
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
  `;
  closeBtn.onclick = () => dialog.remove();
  
  const title = document.createElement('h3');
  title.textContent = feeds.length === 0 ? 'No RSS/Atom Feeds Found' : `Found ${feeds.length} Feed(s)`;
  title.style.cssText = 'margin: 0 0 15px 0; color: #333;';
  
  const content = document.createElement('div');
  
  if (feeds.length === 0) {
    content.textContent = 'No RSS or Atom feeds found on this page';
    content.style.cssText = 'color: #666;';
  } else {
    feeds.forEach(feed => {
      const feedDiv = document.createElement('div');
      feedDiv.style.cssText = 'margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-radius: 4px;';
      
      const feedTitle = document.createElement('div');
      feedTitle.textContent = feed.title;
      feedTitle.style.cssText = 'font-weight: bold; margin-bottom: 5px; user-select: text;';
      
      const feedUrl = document.createElement('div');
      feedUrl.textContent = feed.href;
      feedUrl.style.cssText = 'color: #0066cc; word-break: break-all; user-select: text; margin-bottom: 3px;';
      
      const feedType = document.createElement('div');
      feedType.textContent = `(${feed.type})`;
      feedType.style.cssText = 'color: #666; font-size: 0.9em; user-select: text;';
      
      const copyBtn = document.createElement('button');
      copyBtn.textContent = 'Copy URL';
      copyBtn.style.cssText = `
        margin-top: 5px;
        padding: 4px 8px;
        background: #0066cc;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 0.9em;
      `;
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(feed.href).then(() => {
          copyBtn.textContent = 'Copied!';
          setTimeout(() => copyBtn.textContent = 'Copy URL', 2000);
        });
      };
      
      feedDiv.appendChild(feedTitle);
      feedDiv.appendChild(feedUrl);
      feedDiv.appendChild(feedType);
      feedDiv.appendChild(copyBtn);
      content.appendChild(feedDiv);
    });
  }
  
  dialog.appendChild(closeBtn);
  dialog.appendChild(title);
  dialog.appendChild(content);
  document.body.appendChild(dialog);
})();
```

Simplest/barebones version (just gives you an `alert` with the URLs):

```js
javascript:alert(Array.from(document.querySelectorAll('link[type="application/rss+xml"], link[type="application/atom+xml"]')).map(x => x.href).join('\n'));
```
