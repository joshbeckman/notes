---
toc: true
title: Memory Leaks Using Canvas in Node
date: '2015-09-23 00:00:00'
tags:
- code-snippets
redirect_from:
- "/memory-leaks-using-canvas-in-node"
- "/memory-leaks-using-canvas-in-node/"
serial_number: 2015.BLG.022
---
At [ThreadMeUp](//threadmeup.com), we do much of our image manipulation and generation using HTML5 `Canvas` objects. This allows us to build some interesting tech, like mirroring client-side interactions with the `canvas` onto a Node server representation.

Recently, we ran into a problem where concurrent or repetitive `canvas` manipulations on the server would produce huge memory leaks. This has happened for us while using the [Fabric.js](http://fabricjs.com/) library for abstraction as well as with the bare [`node-canvas`](https://github.com/Automattic/node-canvas) package.

Either way, the behavior was the same. We saw `canvas` instances created, used correctly, released but never removed form actual memory. After a few large images were placed and moved around within the context, memory would climb to above 2 gigabytes.

After trying eplicit calls with `delete` and setting values to `null`, this is what finally did the trick:

```js
var canvas = fabric.createCanvasForNode(); // or whatever you do to create a context
// blah blah canvas manipulation
// place images, etc
canvas.clear();
canvas.dispoose();
// Now, your garbage collection will reclaim memory
```

