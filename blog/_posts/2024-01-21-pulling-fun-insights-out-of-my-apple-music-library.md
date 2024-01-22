---
layout: Post
date: 2024-01-21 18:42:27 +0000
title: Pulling Fun Insights Out of My Apple Music Library
toc: true
image: /assets/images/E3C149B261194795BA6D316104BA1706.png
description: I wrote an Apple Music Library parser for fun
tags: code-snippets
---

A month ago I had a thought: I should be able to get those “[Your year in music](https://replay.music.apple.com/)” stats whenever I want\.

I have a huge library of music \- especially in this age of streaming music where “add to library” costs ​*nothing*​\. I am always recommending albums to friends and I’d love a way to share that publicly \(the music streaming services are woefully walled from each other\)\. And I have been wanting to re\-discover songs from my “listening archives” \- songs that I used to love and have forgotten\.

Luckily, Apple Music lets me export my library as a giant, lovely, XML file\. I can work with that\!

Today I wrote a parser that can tell me stats about my favorite, played, forgotten tracks and albums and artists\. I used it to generate [a Music Listening page](https://www.joshbeckman.org/music) with some fun insights and recommendations\!

If you’re interested in doing something similar or just want to see the code, you can read through [the library parser](https://github.com/joshbeckman/notes/blob/8714ab8ad05bce2c50855c48e077d883ed67352f/utilities/apple_music_library_parser.rb) and [the script used to generate the page](https://github.com/joshbeckman/notes/blob/8714ab8ad05bce2c50855c48e077d883ed67352f/utilities/update_music)\. There were already a few \(very old\) Ruby gems that did something similar, but when I tried them they either no longer worked were waaaay too slow to load my massive library\. I’ll probably extract the library parser I wrote into a publicly\-available gem soon\.
