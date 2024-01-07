---
toc: true
title: Your App Is Not Better Than An Open Protocol
date: '2015-02-15 00:00:00'
redirect_from:
- "/using-open-protocols"
- "/using-open-protocols/"
---

Open protocols power the web. They should be powering the interactions to your next application, too. RSS, SMS, plaintext-email, HTML5 - these are the easiest, fastest ways to get users into your system. Open protocols are the lowest barriers to entry. Your potential users already have them and know exactly how to use them!

When Twitter was gathering steam back in 2009-10, it did so because [tweeting was done via SMS](https://blog.twitter.com/2010/introducing-fast-follow-and-other-sms-tips) and not over a proprietary interface. Everyone was getting a feature-phone. [WhatsApp emulates simple SMS paradigms](http://www.whatsapp.com) to gain traction and meet basic needs. GitHub [allows for RSS access to repos, users, and issues](https://help.github.com/articles/viewing-your-feeds/) so you don’t have to log in or open a browser to be updated. The best services don’t require a visit to the website to be notified. I can reply on Slack and Trello via email notifications.

To lay this all out, it seems that some applications are forgoing open standards. To wit, [Flipboard just announced their migration to full-canvas](http://engineering.flipboard.com/2015/02/mobile-web/), leaving text behind and rendering the full context within a canvas. The problem with this should be apparent. It completely eschews accessibility. It seems antithetical to widespread adoption. Twitter left its RSS profile-feeds behind, and [LinkedIn is walling the garden](http://stopusinglinkedin.com).

When I built out the access points for [Narro](http://narro.co), I made sure to include open protocols. It’s built first and foremost around RSS/podcast feed syndication, which means that every iOS user (at least) already has built-in support for offline access. Every email sent includes a plaintext version. The vanilla JavaScript bookmarklet runs on every browser.

Why should anyone learn your new app flow? If I can do it all in email, let me do it there. If I can do it all in text messages, let me. Open protocols are easy for you to build into your next application, and your users are already there.

### Edit 2015/02/19

This post became [popular on Hacker News](https://news.ycombinator.com/item?id=9074330) and many people had thoughts to give.

