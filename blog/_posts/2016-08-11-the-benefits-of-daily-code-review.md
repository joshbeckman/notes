---
toc: true
title: The Benefits of Daily Code Review
date: '2016-08-11 00:00:00'
redirect_from:
- "/the-benefits-of-daily-code-review"
- "/the-benefits-of-daily-code-review/"
- "/2016/08/11/the-benefits-of-daily-code-review"
- "/2016/08/11/the-benefits-of-daily-code-review/"
tags:
- mentoring
- software-engineering
- officeluv
serial_number: 2016.BLG.010
---
I wrote a while ago about [a methodology for daily code reviews]( /2015/04/04/daily-code-reviews/), one which we implemented originally at ThreadMeUp. Now that I’m building a new team at OfficeLuv, I’ve been excited to start them again. Recently, I was talking to [a very good friend of mine](//elenichappen.com) and found myself reasoning through the importance of team code reviews. I think it boils down to four main skills for individual team members.

### Articulate Your Thoughts

I meet a great many programmers/developers/engineers/hackers. There are some that are good at what they do. There are even fewer that can articulate their ideas well enough for others to understand them. I want to work with that small subset.

Presenting your proposed changes to the group necessitates an explanation of your thought process. What was the bug or feature? How did you research it? What failed? What did you decide to build? Why is it our best course of action? If you can’t present answers to these, the rest of the team can see right away that your changes aren’t ready.

This is a great way for mid-level developers to practice explaining their actions well enough to become effective senior developers. I have seen some companies give up on more experienced engineers building communication skills. I think that’s a big mistake, and presenting ideas daily to the group strengthens those skills.

### Critique Others

Often, it’s discouraged of junior developers to speak up and criticize more experienced teammates. This is not so during our code reviews. Everyone is entitled to their opinion and is expected to have one. An outside horse sometimes wins the race, and a counterpoint raised before merging a new feature could stimulate an even better solution.

It is important to have confidence in one’s own ideas. _Strong opinions, loosely held_. Just keep in mind that, though you should put forth new ideas, be ready for them to be refuted with evidence. This brings me to the third benefit.

### Receive Criticism

I have never worked with someone who was correct all the time. I have worked with several who thought they were. Encouraging discourse inevitably leads to one person challenging another’s solution. The challenged should understand that it is a natural process that attempts to yield the best possible result. Just because I push back on your implementation doesn’t mean that it’s terrible, it just means you need to back it up with evidence.

Bring evidence to the table. Only one person should be talking at a time during code reviews - practice listening to someone else, even if their idea is terrible. It’s terribly good exercise.

### Draw Connections

Code reviews, by forcing everyone to listen while changes within the whole system are proposed, ensures that we are all on the same page. Often, especially during hard sprints, developers can get locked into their own codebase, separated from the group. This is especially common in micro-service systems, where each person may be alone within a service.

By reviewing changes being made elsewhere, members of the team will inevitably see parallels to their own work. This can kickstart the formation of common libraries between apps or a good architecture can be replicated elsewhere. The team shouldn’t make the same mistake twice.

* * *

If you have been practicing regular code reviews with your team, [I’d love to hear]( /contact) about any other benefits you may have noticed.

