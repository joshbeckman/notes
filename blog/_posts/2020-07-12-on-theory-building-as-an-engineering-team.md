---
toc: true
title: Documenting Theory Building as An Engineering Team
date: '2020-07-12 00:00:00'
tags:
- writing
- maintenance
- software-engineering
- officeluv
redirect_from:
- "/on-theory-building-as-an-engineering-team"
- "/on-theory-building-as-an-engineering-team/"
serial_number: 2020.BLG.017
---
Recently, I was reading [Marc Booker’s post](http://brooker.co.za/blog/2020/06/23/code.html) about the need for documentation outside of the codebase. [A thoughtful comment](https://news.ycombinator.com/item?id=23751652) on the post led me to [Peter Naur’s paper on Programming as Theory Building](http://pages.cs.wisc.edu/~remzi/Naur.pdf), which I recommend reading[^1]. In it, Naur argues that the act of programming is not a practice of writing code but the work of creating a theory of the problem at hand and a theory of the system to address it. As a team exercise, we practiced documenting our theories of the OfficeLuv system and found it very rewarding.

In my mind, there is a hierarchy of explanatory documentation that programmers pass between each other. At the bottom there is the pulse of the commit history. This documentation is a permanent record, but the explanations themselves are brief, incomplete, and ephemeral.

The next level consists of comments in the code itself. These explanations are often even more brief, but sit in plain sight and directly beside their subjects.

Above comments, we have [Architecture Decision Records](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions) (ADRs). These are structured stories about features or services that are written and read outside of the actual program material. We’ve begun adopting this level of documentation at OfficeLuv over the last couple months (with several benefits, which I’ll probably write about in the future). I would also lump Requests for Comment (RFCs) and documents like that into this level.

I think Naur’s idea of Theory Building fits as a flavor of documentation one level higher. The central assumptions about what our system should handle and what it operates on are foundational. These read like laws of physics, but for the worldview and inner-workings of the system. This documentation informs other contributors on how to best extend the current program, and which rules we would hesitate to violate.

I’ve never read this kind of documentation at the level of a program or system before. The closest that comes to mind are Rails’ “[Convention over configuration](https://en.m.wikipedia.org/wiki/Convention_over_configuration)”, the [Zen of Python](https://en.m.wikipedia.org/wiki/Zen_of_Python) guiding principles, or even OfficeLuv’s [Heart of a Developer](https://github.com/officeluv/heart-of-a-developer) proverbs. But these just provide a breezy direction as to how we should go about our programming. The _Theory of The Program_ can be much more direct about the boundaries and patterns of the worldview from within our specific program.

To that end, I had the OfficeLuv engineering team practice documenting our own theories of our system. Each of us took a couple days and wrote up our individual theories, which we then shared together. Multiple theories overlapped between us, which reassured us that we agreed on what a theory should be. Tenets that applied only to a subsystem we decided to extract as ADRs. We now have a Theory of The OfficeLuv System at the top level of our documentation and we’ll continue to evolve it as we build.

I wish we had started this practice earlier - I would _love_ to read what our previous teams had held as theory. Contrasting the worldview from two years ago would be interesting to measure against the problems we face now. This document will be used during onboarding and for guidance in feature-building as we grow. And having these theories on hand for our next hire will allow them to begin contributing more effectively on day one.

## Tips for Writing Your Own Theories

Naur recommends identifying a clear metaphor as the best way to convey the Theory of The Program. I found this exceedingly difficult, even for a startup like OfficeLuv. I could readily think of metaphors for subsystems, but I wouldn’t recommend spending too much time finding a metaphor for a sufficiently large project. If you can find one, congrats.

I think it’s key to have each team member write their theories on their own. This increases the diversity of ideas that you can combine into your group theories. The diversity also prompts you to coalesce similar theories into higher-level rules that become more powerful and applicable.

Don’t spend time trying to pull a single Grand Unifying Theory of The Program out of several individual theories. Our document ended up as a series of sentences and paragraphs, along with a few references and examples. Again, I think this may be possible at the subsystem level, but unlikely to exist at the level of a sufficiently complex product.

[^1]: If you find it repetitive, I recommend skipping to the final couple pages where Naur talks about how best to actually _apply_ “Theory Building” on your own. It comes after the actual paper.

