---
toc: true
title: On Adding React Native to Existing iOS and Android Apps
date: '2017-08-10 00:00:00'
tags:
- javascript
redirect_from:
- "/on-adding-react-native-to-android-ios"
- "/on-adding-react-native-to-android-ios/"
---

> I write in defense of the beliefs I fear are least defensible. Everything else feels like homework.   
> - Sarah Manguso, _300 Arguments_

No homework for me today. I woke up and integrated new [React Native](https://facebook.github.io/react-native/) code into an existing [Swift 3](https://swift.org) iOS app.

I spent 5 hours getting the bare dependencies to compile React components into the existing app codebase, then 3 hours building an interface in React that would have taken a day in native iOS. I was also able to copy and paste our existing JavaScript business logic libraries with zero problem. It felt as if I spent all morning painfully biking up a mountain, after which I’m [now coasting downhill](https://www.youtube.com/watch?v=fYGPcfUqzL0).

Tomorrow is biking up the mountain to integrate React Native into our Android app. Luckily I have [Nevzat](https://gitlab.com/nevzat) to help with that.

I will write up all of this once a full release cycle is complete.

**Update:** This made its way into [a full talk on bridging native apps with React Native](http://ghpages.joshbeckman.org/presents/bridge-existing-ios-android-apps-react-native/).

