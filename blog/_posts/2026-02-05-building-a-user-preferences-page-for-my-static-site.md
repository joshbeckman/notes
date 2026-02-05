---
layout: Post
date: '2026-02-05 21:59:30 +0000'
title: Building a User Preferences Page for My Static Site
toc: true
image:
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/116020666267363434
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3me5kutnpqu2n
tags:
- jekyll
- code-snippets
- personal-blog
- tools
- language-javascript
serial_number: 2026.BLG.020
---
I've been wanting to give visitors more control over how they experience this site. Not everyone wants the same thing from a personal website - some prefer dark mode, some want to disable tracking, and some have their own Mastodon instance they'd rather interact from. So I built a [settings page](/settings/) that stores your preferences in `localStorage` and applies them across the site.

## Why Build This?

Static sites are usually "read-only" - you generate the HTML and that's what everyone gets. But they can be more dynamic. With `localStorage` and a bit of JavaScript, you can offer personalization without needing a backend or user accounts.

The settings I wanted to support fell into a few categories:

**Appearance**: Custom accent color, dark/light mode override, and reduced motion for accessibility. Now I can have my production website colored differently than my `localhost` version for easy differentiation! Or you can just choose some color other than purple when you visit (like you can do on Hacker News).

**Privacy**: The ability to disable analytics entirely, and control whether decryption passphrases for [encrypted posts](https://www.joshbeckman.org/blog/encrypted-post) are cached in session storage. If someone doesn't want to be tracked, they shouldn't have to be.

**Social**: Options to disable the social engagement counters (Mastodon, Bluesky, HN, etc.) and to redirect Mastodon links to the user's own instance for easier interaction.

## The Architecture

The implementation is straightforward. A single `settings.js` file handles all the logic:

```javascript
var STORAGE_KEY = 'joshbeckman_settings';
var DEFAULT_SETTINGS = {
    customColor: null,
    colorScheme: 'system',
    reduceMotion: false,
    disableAnalytics: false,
    disableSocialLoading: false,
    mastodonInstance: null,
    cacheDecryptionPassphrase: false
};
```

On every page load, the script reads from `localStorage` and applies the settings:

```javascript
function applySettings(settings) {
    if (settings.customColor) {
        var color = settings.customColor;
        document.documentElement.style.setProperty('--c-josh', color);
    }
    if (settings.colorScheme !== 'system') {
        document.documentElement.setAttribute('data-color-scheme', settings.colorScheme);
    }
    if (settings.reduceMotion) {
        document.documentElement.setAttribute('data-reduce-motion', 'true');
    }
}
```

The CSS uses data attributes to override the default styles:

```css
:root[data-color-scheme="dark"] {
  --c-bg: hsl(0, 0%, 5%);
  --c-text: hsl(0, 0%, 100%);
  /* ... */
}

:root[data-reduce-motion="true"] .name-svg path {
  stroke-dasharray: none !important;
  stroke-dashoffset: 0 !important;
}
```

## Conditional Script Loading

For analytics, I couldn't just toggle a CSS class - I needed to prevent the tracking script from loading entirely. The solution was to load it conditionally:

```javascript
if (window.JoshSettings && window.JoshSettings.shouldLoadAnalytics()) {
    var gc = document.createElement('script');
    gc.src = 'https://gc.zgo.at/count.js';
    gc.dataset.goatcounter = 'https://joshbeckman.goatcounter.com/count';
    document.body.appendChild(gc);
}
```

By checking the setting before creating the script element, users who disable analytics never send any data to GoatCounter.

## The Mastodon Instance Feature

This one required a bit more thought. When someone has their own Mastodon instance (say, `fosstodon.org`), clicking a link to a post on `mastodon.social` means they can't easily boost or reply - they'd need to copy the URL and search for it on their home instance.

The solution uses Mastodon's search feature. When a user sets their instance, I transform the links:

```javascript
function transformMastodonUrl(originalUrl, userInstance) {
    return 'https://' + userInstance + '/search?q=' + encodeURIComponent(originalUrl);
}
```

So a link to `https://mastodon.social/@joshbeckman/123456` becomes `https://fosstodon.org/search?q=https%3A%2F%2Fmastodon.social%2F%40joshbeckman%2F123456`, which loads the post in the user's home instance context where they can interact with it directly.

## Remote Sync

I also added an optional remote sync feature. Users can point to a JSON file they control (like a GitHub Gist) containing their settings. The page fetches it, compares timestamps to detect which version is newer, and offers to load the remote settings.

This isn't full bidirectional sync - I'm not writing back to the remote. Instead, the settings page shows an "Export" section with the current settings as JSON that users can copy to their Gist. It's manual but keeps things simple and puts the user in control of their data.

## Try It Out

Head over to the [settings page](/settings/) and customize away. Set a wild accent color, force dark mode, disable tracking - it's your call. The settings persist in your browser, so they'll be there next time you visit.

If you're running your own static site and want to add similar features, the [full implementation is on GitHub](https://github.com/joshbeckman/notes). "Static" doesn't have to mean "one-size-fits-all."

