---
layout: Post
date: '2026-02-02 18:27:13 +0000'
title: Displaying Letterboxd Like Counts on My Movie Reviews
toc: true
image: "/assets/images/21addc37-7230-4055-97e9-959509301ba3.png"
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/116003685980532029
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3mdvzl4jnj42n
tags:
- personal-blog
- letterboxd
- jekyll
- language-javascript
serial_number: 2026.BLG.014
---
I've been [crossposting my Letterboxd reviews](https://www.joshbeckman.org/blog/crossposting-from-letterboxd-to-jekyll) to this site for a while now. The posts link back to the original review, but I wanted to show engagement metrics the same way I do for [Mastodon](https://www.joshbeckman.org/blog/pesos-mastodon-to-jekyll), Bluesky, and HackerNews posts. I run this static site on Jekyll so I want to load these in the visitor's browser for efficiency and accuracy.

## The Approach

Letterboxd doesn't have a public API (though they have a [private beta API](https://letterboxd.com/api-beta/)), but the like count is embedded in the review page's HTML. When you view a review, there's an element with a `data-count` attribute holding the number:

```html
data-likes-page="/joshbeckman/film/the-french-connection/likes/"
data-format="count"
data-count="1"
data-owner="joshbeckman"
```

So the plan was simple: fetch the review page, parse out that `data-count` value, and update the link text.

## The Implementation

I added a `loadLetterboxd()` function alongside my existing social platform loaders. These all fire when the comments section scrolls into view, using an `IntersectionObserver` to avoid unnecessary requests on page load.

```javascript
function loadLetterboxd() {
    var letterboxd = document.querySelector('.social-letterboxd');
    if (!letterboxd) {
        return;
    }
    var url = letterboxd.getAttribute('href');
    fetch(url)
        .then(response => response.text())
        .then(html => {
            var match = html.match(/data-count="(\d+)"/);
            if (match) {
                var likes = parseInt(match[1], 10);
                if (likes > 0) {
                    letterboxd.textContent = `${likes} ${pluralize(likes, 'like')} on Letterboxd`;
                }
            }
        })
        .catch(error => console.error('Error fetching Letterboxd review:', error));
}
```

## The CORS Problem

This didn't work. The browser blocked the request:

```
Fetch API cannot load https://letterboxd.com/... due to access control checks.
```

Letterboxd doesn't set CORS headers allowing cross-origin requests from browsers. This is the same problem you hit with any site that hasn't explicitly opted into being fetched by client-side JavaScript from other domains.

## The Fix: A CORS Proxy

The solution is to route the request through a proxy that adds the appropriate headers. I tried a few options:

1. **[corsproxy.io](https://corsproxy.io)** - Worked locally but [blocks HTML content in production](https://corsproxy.io/docs/faq/) due to phishing concerns. Only JSON, XML, and CSV are allowed.

2. **[allorigins.win](https://allorigins.win/)** - Supports HTML, but was painfully slow in my testing.

3. **[cors.lol](https://cors.lol/)** - Fast, supports HTML, and has a simple API. This is what I ended up using.

The [CORS Proxies gist](https://gist.github.com/jimmywarting/ac1be6ea0297c16c477e17f8fbe51347) is a useful reference for finding working proxies, though the landscape changes frequently as services get abused and shut down.

The final implementation:

```javascript
var url = letterboxd.getAttribute('href');
fetch(`https://api.cors.lol/?url=${encodeURIComponent(url)}`)
    .then(response => response.text())
    // ... rest unchanged
```

This adds a dependency on a third-party service, which isn't ideal. If cors.lol goes away or starts blocking HTML, I could set up a Cloudflare Worker to proxy these requests, or fetch the data at Jekyll build time instead of client-side. For now, the simplicity of a hosted proxy wins.

## The Result

<img width="816" height="372" alt="Display of Letterboxd likes on a review" src="/assets/images/21addc37-7230-4055-97e9-959509301ba3.png" />

Movie review posts now show like counts from Letterboxd right alongside the other social metrics. It's a small addition, but it makes the social section feel more complete.

