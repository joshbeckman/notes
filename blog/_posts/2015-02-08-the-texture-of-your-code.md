---
toc: true
title: The texture of your code
date: '2015-02-08 00:00:00'
tags:
- software-engineering
redirect_from:
- "/the-texture-of-your-code"
- "/the-texture-of-your-code/"
---

I’ve been thinking about intuitive methods of code review. Last week, I read an article about [the Japanese onomatopoeic words used to describe texture](http://www.spoon-tamago.com/2015/01/16/nendo-chocolates-japanese-onomatopoeic-words-texture/) that resonated with something I’ve been inkling about for a bit.

I think you can get a sense for the texture of your code. I think there’s a consistent difference between the layout and connections of poorly-written functions and well-written ones. There’s a common term for one aspect of this already: spaghetti code.

There are a couple ways I’ve been _feeling_ code recently. The most immediate is, of course, simply the visual structure of the methods. Each of these is a red flag for me.

- Are the functions massive and lengthy? Large boulders, difficult to manipulate in your head, let alone in your program.
- Are the variable names too short or unclear as to intention? Sharp, tiny bits, too many and too hazardous to pick up or discern.
- Are there many long strings? Are there many variables consistenly passed around and piled up? A great many objects can be too much to effectively carry with you.

The more difficult and intangible way I’ve noticed poor code texture is after stepping through a program. Once you understand the connections between methods, you can hold the program as a whole in a mental, spacial representation. Rotating a method map, plucking and running over the surface can show immediate cracks and obstructions.

- Are there any single, large funcitnos that protrude away from all others? You should probably decompose them to better fill the space.
- Are the calls to separate funcitons very thick (many arguments passed) and stretched (calling to disparate sections of the codebase)? You probably want to optimize for easy, related calls without over-dependent arguments.
- Are there deep cracks in the code where the path trace dips into conditionals upon conditionals? It is exceedingly difficult to fall down into “conditional cracks” and come out the other side every time.
- Are there pieces that look too similar, found in multiple methods? Repetition is your enemy.
- Are there pieces that stand alone, unconnected? You’ll want to remove those.

I’ve grown to enjoy optimizing code this way. I think many people do something similar already. For one, I can run my hands across the object or method structure without needing the actual lines of code in front of me. Once I have a conceptual understanding of the program, I can take it’s spacial representation and push and prod.

I’m trying to settle on more specific terms for this type of _code texture_ than just “spaghetti” or “boulder.” Maybe I’ll adapt those Japanese texture-words. I think, of those words used in the article, _tsubu tsubu_ would be my choice for well-written code. Small, modular, easy to piece apart.

