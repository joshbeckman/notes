---
toc: true
title: Fix to Enable Display Features - Google Analytics iOS SDK
date: '2014-09-23 00:00:00'
tags:
- code-snippets
redirect_from:
- "/fix-enable-display-features"
- "/fix-enable-display-features/"
serial_number: 2014.BLG.004
---
In the official Google Analytics iOS SDK documentation, this function call will enable Display Features in your app:

```obj-c
id tracker = [[GAI sharedInstance] defaultTracker]; // Enable Advertising Features. 
[tracker set:allowIDFACollection value:@YES]; 
```

Sadly, this causes an error, as `allowIDFACollection` is an invalid key. The real way to enable display features is to call this method:

```obj-c
[[GAI sharedInstance].defaultTracker setAllowIDFACollection:YES]; 
```

Save yourself a few minutes of frustration. Build and be happy.

