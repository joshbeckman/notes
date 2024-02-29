---
title: Dynamically Upgrade Your JS App
date: 2018-09-21 00:00:00 Z
redirect_to: "https://ghpages.joshbeckman.org/presents/dynamically-upgrade-long-spa-sessions"
presented_at: JSCamp Chicago 2018
tags:
- software-engineering
- code-snippets
---

<section data-markdown data-background-image="https://media.giphy.com/media/uBQNLeszLtiNO/giphy-downsized.gif">

# {{ page.title }}

</section>
<section data-markdown>
<script type="text/template">
### The Problem

Customers on the page for months! <!-- .element: class="fragment" -->

But we get better constantly! <!-- .element: class="fragment" -->
</script>
</section>
<section data-markdown>
<script type="text/template">
### How Do Other Clients Handle This?

Updating desktop apps? <!-- .element: class="fragment" -->

Auto-updating phone apps? <!-- .element: class="fragment" -->
</script>
</section>
<section data-markdown>
### Watch For a Version

- Polling
- Websockets
- Use semver
</section>
<section data-markdown>
## Watch Page Visibility

```js
window.document.addEventListener('visibilitychange', () => {
    if (window.document.hidden) {
        window.alert('I will not be ignored!');
    }
});
```
</section>
<section data-markdown>
## Watch Input, Progress, State

Guarantee reconstruction
</section>
<section data-markdown>
## Watch For Downtime

Are they AFK?
</section>
<section data-markdown>
## Look Before You Leap

```js
if (navigator.onLine) {
    console.log('online');
}

window.addEventListener('offline',
    () => { console.log('offline'); });

window.addEventListener('online',
    () => { console.log('online'); });
```
</section>
<section data-markdown>
## Satisfied?

```
    Semver Upgrade
    Invisible
    Idempotent State
    Downtime
  + Connectivity
--------------
    Reload!
```
</section>
<section data-markdown data-background-image="https://media.giphy.com/media/r2MkQEOe7niGk/giphy-downsized.gif">
</section>
<section data-markdown>
## Reload API

```js
// reload *from the server*

window.location.reload(true);

// avoid the browser cache
```
</section>
<section data-markdown>
## Good Resources

- [Page Visibility API - Mozilla](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
- [Location.reload() - Mozilla](https://developer.mozilla.org/en-US/docs/Web/API/Location/reload)
- [Navigator.onLine - Mozilla](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine)
</section>
<section data-markdown>

## We're Hiring @ OfficeLuv!

https://officeluv.github.io

</section>
<section data-markdown>

## Thanks!

https://www.andjosh.com/presents

</section>
