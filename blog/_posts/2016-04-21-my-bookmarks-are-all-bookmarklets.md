---
toc: true
title: My Bookmarks Are All Bookmarklets
date: '2016-04-21 00:00:00'
tags:
- code-snippets
redirect_from:
- "/my-bookmarks-are-all-bookmarklets"
- "/my-bookmarks-are-all-bookmarklets/"
---

I love all my bookmarks. None of them actually go to any websites, though. They’re all bookmarklets.

> A [bookmarklet](https://en.wikipedia.org/wiki/Bookmarklet) is a little app that runs in your browser.

Some of them have been around for years, and I recently got into the habit of making them again. Mostly, I just make them for repetitive or arduous tasks while debugging browser junk. I thought I would list out some of my favorites.

### Source

This little love dumps the HTML source of the current page in a new tab. This isn’t very useful most of the time, but _utterly invaluable_ when trying to debug a client from my smartphone on the L train at 2AM.

[`source`](unsafe:javascript:(function()%7Bvar%20a=window.open('about:blank').document;a.write('%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3Ctitle%3ESource%20of%20'+location.href+'%3C/title%3E%3Cmeta%20name=%22viewport%22%20content=%22width=device-width%22%20/%3E%3C/head%3E%3Cbody%3E%3C/body%3E%3C/html%3E');a.close();var%20b=a.body.appendChild(a.createElement('pre'));b.style.overflow='auto';b.style.whiteSpace='pre-wrap';b.appendChild(a.createTextNode(document.documentElement.innerHTML))%7D)();)

    javascript:(function(){
        var a = window.open('about:blank').document, b;
        a.write('<!DOCTYPE html><html><head><title>Source of '+location.href+'</title><meta name="viewport" content="width=device-width" /></head><body></body></html>');
        a.close();
        b = a.body.appendChild(a.createElement('pre'));
        b.style.overflow = 'auto';
        b.style.whiteSpace = 'pre-wrap';
        b.appendChild(a.createTextNode(document.documentElement.innerHTML))
    })();

### Headers

I love finding little gems hiding in the headers of other websites. I try to put a bit of gold in the headers of websites I build myself. This one has helped test CORS issues, cookie issues, or even just satisfying curiosity about what stack competitors are using.

[`headers`](unsafe:javascript:var%20req%20=%20new%20XMLHttpRequest();%20req.open('GET',%20prompt('page?',document.location),%20false);%20req.send(null);%20var%20headers%20=%20req.getAllResponseHeaders().toLowerCase();%20alert(headers);)

    javascript:(function(){
        var req = new XMLHttpRequest(), headers;
        req.open('GET', prompt('page?',document.location), false);
        req.send(null);
        headers = req.getAllResponseHeaders().toLowerCase();
        alert(headers);
    })();

### Toggle CSS

Many designers/developers use CSS as a whole lot of lipstick on a pig. Sometimes, it’s a lot easier to debug something without all that color getting in the way. This bookmarklet toggles the entire CSS structure on and off, so you can wipe it all away or put it right back.

[`toggleCSS`](unsafe:javascript:(function()%7Bfunction%20d(a,b)%7Ba.setAttribute(%22data-css-storage%22,b)%7Dfunction%20e(a)%7Bvar%20b=a.getAttribute(%22data-css-storage%22);a.removeAttribute(%22data-css-storage%22);return%20b%7Dvar%20c=%5B%5D;(function()%7Bvar%20a=document.body,b=a.hasAttribute(%22data-css-disabled%22);b?a.removeAttribute(%22data-css-disabled%22):a.setAttribute(%22data-css-disabled%22,%22%22);return%20b%7D)()?(c=document.querySelectorAll(%22%5Bdata-css-storage%5D%22),%5B%5D.slice.call(c).forEach(function(a)%7B%22STYLE%22===a.tagName?a.innerHTML=e(a):%22LINK%22===a.tagName?a.disabled=!1:a.style.cssText=e(a)%7D)):(c=document.querySelectorAll(%22%5Bstyle%5D,%20link,%20style%22),%5B%5D.slice.call(c).forEach(function(a)%7B%22STYLE%22===a.tagName?(d(a,a.innerHTML),a.innerHTML=%22%22):%22LINK%22===a.tagName?(d(a,%22%22),a.disabled=!0):(d(a,a.style.cssText),a.style.cssText=%22%22)%7D))%7D)();)

    javascript:(function(){
        function d(a,b){
            a.setAttribute("data-css-storage",b)
        }
        function e(a){
            var b = a.getAttribute("data-css-storage");
            a.removeAttribute("data-css-storage");
            return b
        }
        var c = [];
        (function(){
            var a = document.body,
                b = a.hasAttribute("data-css-disabled");
            b ? a.removeAttribute("data-css-disabled") :
                a.setAttribute("data-css-disabled","");
            return b
        })() ?
        (
            c = document.querySelectorAll("[data-css-storage]"),
                [].slice.call(c).forEach(function(a){
                    "STYLE" === a.tagName ?
                        a.innerHTML=e(a) :
                        "LINK" === a.tagName ?
                            a.disabled = !1 :
                            a.style.cssText = e(a)
                })
        ) :
        (
            c = document.querySelectorAll("[style], link, style"),
                [].slice.call(c).forEach(function(a){
                    "STYLE" === a.tagName ?
                        (d(a, a.innerHTML), a.innerHTML="") :
                        "LINK" === a.tagName ?
                            (d(a, ""), a.disabled = !0) :
                            (d(a, a.style.cssText), a.style.cssText = "")
                })
        )
    })();

### Others

Here are some others, maintained by other people, that I use quite frequently:

- [Stats.js](https://github.com/mrdoob/stats.js/)
- [DOM Monster](http://mir.aculo.us/dom-monster/)
- [Tota11y](http://khan.github.io/tota11y/)
- [My Narro Bookmarklet](https://www.narro.co/bookmarklet)
