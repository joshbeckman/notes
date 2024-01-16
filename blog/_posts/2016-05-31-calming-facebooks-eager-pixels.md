---
toc: true
title: Calming Facebook's Eager Pixels
date: '2016-05-31 00:00:00'
tags:
- code-snippets
redirect_from:
- "/calming-facebooks-eager-pixels"
- "/calming-facebooks-eager-pixels/"
---

Working at [an e-commerce startup](//www.threadmeup.com), I get asked to implement new tracking features every day. I built out the integration points for Google Analytics, Google’s retargeting pixel, Google’s conversion pixel, Facebook’s retargeting pixel, Facebook’s conversion pixel, Facebook’s Audience pixel (and here is where I run out of breath). That’s not even a complete list.

Facebook’s Audience pixel, of that group, is the most recent to the table. It was [introduced last year](https://developers.facebook.com/ads/blog/post/2015/06/10/upgrades-to-conversion-tracking/) as the replacement to both Facebook’s conversion pixel and retargeting pixel. With it, Facebook also introduced a new tracking library, `fbevents.js` (replacing the `fbds.js` library, which was shared between the retargeting and conversion pixels). Phew. There goes my second breath.

Facebook’s own documentation used to carry more red flags about continuing with their _deprecated_ retargeting and conversion pixels, [but that has faded](https://developers.facebook.com/docs/ads-for-websites/drive-conversions). Facebook even updates the documentation of the deprecated pixels. The overwhelming majority of our customers (and, I would bet money, Facebook’s customers) request continued support for their old retargeting and conversion pixels. As such, I continue to wade through deprecation warnings from Facebook’s tracking library.

We also continuously ran into tracking inaccuracies. With [Facebook’s Pixel Helper](https://developers.facebook.com/docs/facebook-pixel/pixel-helper), we could see that multiple events would be recorded via either `fbevents.js` or `fbds.js`. This bug seemed to cause different behavior over time, with some customers reporting an exceedingly high conversion rate in Facebook’s reporting interface (over 100%, at times) and some reporting exceedingly low rates (less than half of transactions). It was frustrating, and it was happening not only to our platform but on our competitors’ as well.

I debugged my way through each step of our JavaScript code, seeing us trigger only one call to Facebook’s libraries. We run a React application for our client checkout flow. We use [react-router](https://github.com/reactjs/react-router) to manage history and URL state. You would think that Facebook’s tracking libraries would play nice with Facebook’s user interface library. The extra events seemed to be triggering themselves whenever the URL or history would change. But we had written our own calls to Facebook’s pixel libraries to avoid this!

I prettified [the source code of `fbevents.js`](https://gist.github.com/andjosh/41001c2b624dd19c1ca2c9f4804ebbb0#file-fbevents-js-L487) and did [the same for the deprecated `fbds.js`](https://gist.github.com/andjosh/a59b26748928f2de399c10b7b24caeb7#file-fbds-js-L129). At the very bottom of both, there is this bit (comments mine):

```js
// s === window.fbq === window._fbq
// d === window.history
// a === window
// New code from fbevents.js
(function ra() {
    if (s.disablePushState === true) return;
    if (!d.pushState || !d.replaceState) return;
    var sa = function() {
        ba = v;
        v = c.href;
        if (v === ba) return;
        var ta = new da({
            allowDuplicatePageViews: true
        });
        ea.call(ta, 'trackCustom', 'PageView');
    };
    p.injectMethod(d, 'pushState', sa);
    p.injectMethod(d, 'replaceState', sa);
    a.addEventListener('popstate', sa, false);
})();
// ------------------------------------
// Deprecated, but still present, code from fbds.js
if (s.disablePushState === true) return;
if (!d.pushState || !d.replaceState) return;
var t = function() {
        k = j;
        j = c.href;
        s.push(['track', 'PixelInitialized']);
    },
    u = function(v, w, x) {
        var y = v[w];
        v[w] = function() {
            var z = y.apply(this, arguments);
            x.apply(this, arguments);
            return z;
        };
    };
u(d, 'pushState', t);
u(d, 'replaceState', t);
a.addEventListener('popstate', t, false);
```

Both Facebook pixel tracking libraries hook into the `window.history` and `popstate` events. This means that it will fire a new cascade of events whenever the browser history API is used and whenever your single page application (SPA) updates the browser URL to reflect the view. Our React SPA was sending API calls to Facebook’s pixels perfectly, but Facebook’s own injected code was triggering duplicate events. The solution:

```js
// shut it down http://i.imgur.com/vxqrKua.gif
window.fbq.disablePushState = true;
window.fbq('init', this.props.fbAudiencePixel);
// or
window._fbq.disablePushState = true;
window._fbq.push(['addPixelId', this.props.fbRetargetingPixel]);
window._fbq.push(['track', 'PixelInitialized', {}]);
```

After that change, everything seems error-free (at least from testing with Facebook’s Pixel Helper). Time will tell if our customers continue to experience the same effects. It seems a shame that Facebook has this undocumented (I couldn’t find any) flag that makes it play nice within single page apps. It seems an equal shame that Facebook would eagerly trigger its own, potentially erroneous, calls on global events. It also troubles me that the same React application (with multiple calls triggering Pixel Helper errors) seems to cause erroneous results on both ends of the spectrum. And it also troubles me that across our multiple e-commerce competitors, where we are the only one using an entirely React SPA, none have been able to yield a 1:1 ratio of internal conversions to Facebook pixel conversions.

As anyone building a single page app right now, the best advice I can give is to `disablePushState`. That should be necessary for Angular, React, and mobile frameworks alike. I’ve been able to find one other codebase identifying this problem, [Segment.io’s tag manager](https://github.com/segment-integrations/analytics.js-integration-facebook-pixel/pull/8/files). The good (or bad?) news is that the `disablePushState` flag seems to be the only Facebook pixel _magic flag_.

