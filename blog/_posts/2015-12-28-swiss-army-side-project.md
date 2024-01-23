---
toc: true
title: Swiss Army Side Project
date: '2015-12-28 00:00:00'
tags: narro
redirect_from:
- "/swiss-army-side-project"
- "/swiss-army-side-project/"
---

I was thinking today of how there’s a benefit to having a tiny side project. I hope most people do. I have quite a few, but one in particular has been useful to me. I have broken out [Narro](//narro.co) into microservices from the beginning, and one of those is the podcast feed generator service.

Originally, it was written in Node.js, which was chosen for speed of development. Then, I went through a phase of learning Go and seeing server-side code in that light. So the podcast generator was re-written in Go. It also gave me the opportunity to write a podcast generation library in Go: [gopod](https://github.com/andjosh/gopod). Now, I’m learning languages again and have begun to eye the service again. I’m thinking of Rust or Lisp at this point. As I’ve written this service multiple times, it gives me the ability to compare languages and libraries as they tackle the _exact same task_. It’s a valuable perspective.

