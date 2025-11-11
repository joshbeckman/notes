---
layout: Post
date: '2025-11-11 15:25:24 +0000'
title: Word Count Bookmarklet
toc: true
image: "/assets/images/8736b73f-6fd5-4e5d-a3d3-216654c9d160.png"
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/115532278497276421
bluesky_status_url: false
tags:
- language-javascript
- code-snippets
- writing
serial_number: 2025.BLG.179
---
Inspired by [See Your Word Count While You Write from dreeves](https://www.lesswrong.com/posts/8G24bWJ5nE2QjCGAb/see-your-word-count-while-you-write), I whipped up my own word count bookmarklet.

My version:
- displays the word count on the `textarea` when you focus it
- updates the count as you type

> [!TIP]
> Drag this bookmarklet to your bookmarks bar:  
<a href="javascript:(function(){document.addEventListener('focusin',(e)=>{if(e.target.tagName==='TEXTAREA'){const t=e.target;if(t.dataset.hasCounter)return;t.dataset.hasCounter='true';const o=t.style.position;if(!o||o==='static')t.style.position='relative';const c=document.createElement('div');c.style.cssText='position:absolute;bottom:4px;right:8px;font-size:11px;color:#666;pointer-events:none;background:rgba(255,255,255,0.9);padding:2px 6px;border-radius:3px;font-family:monospace;z-index:1';t.parentElement.insertBefore(c,t.nextSibling);let r=null;const u=()=>{const txt=t.value.trim();const w=txt?txt.split(/\s+/).length:0;c.textContent=`${w} word${w!==1?'s':''}`;};t.addEventListener('input',()=>{if(r)cancelAnimationFrame(r);r=requestAnimationFrame(u);});u();t.addEventListener('blur',()=>{setTimeout(()=>{if(document.activeElement!==t){c.remove();if(!o||o==='static')t.style.position='';delete t.dataset.hasCounter;}},100);});}});})();" class="bookmarklet">Word Counter</a>

How to use:

1. Drag the link above to your bookmarks bar
2. Click it on any webpage
2. Focus on any textarea to see a live word count

<img width="448" height="227" alt="Bookmarklet for word count, in action" src="/assets/images/8736b73f-6fd5-4e5d-a3d3-216654c9d160.png" />

Full code:

```javascript
document.addEventListener('focusin', (e) => {
  if (e.target.tagName === 'TEXTAREA') {
    const textarea = e.target;
    
    if (textarea.dataset.hasCounter) return;
    textarea.dataset.hasCounter = 'true';
    
    const originalPosition = textarea.style.position;
    
    if (!originalPosition || originalPosition === 'static') {
      textarea.style.position = 'relative';
    }
    
    const counter = document.createElement('div');
    counter.style.cssText = `
      position: absolute;
      bottom: 4px;
      right: 8px;
      font-size: 11px;
      color: #666;
      pointer-events: none;
      background: rgba(255, 255, 255, 0.9);
      padding: 2px 6px;
      border-radius: 3px;
      font-family: monospace;
      z-index: 1;
    `;
    
    textarea.parentElement.insertBefore(counter, textarea.nextSibling);
    
    let rafId = null;
    const updateCount = () => {
      const text = textarea.value.trim();
      const words = text ? text.split(/\s+/).length : 0;
      counter.textContent = `${words} word${words !== 1 ? 's' : ''}`;
    };
    
    textarea.addEventListener('input', () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateCount);
    });
    
    updateCount();
    
    textarea.addEventListener('blur', () => {
      setTimeout(() => {
        if (document.activeElement !== textarea) {
          counter.remove();
          if (!originalPosition || originalPosition === 'static') {
            textarea.style.position = '';
          }
          delete textarea.dataset.hasCounter;
        }
      }, 100);
    });
  }
});
```
