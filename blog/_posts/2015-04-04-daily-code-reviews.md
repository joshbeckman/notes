---
toc: true
title: ThreadMeUp Daily Code Reviews
image: "/assets/images/tmu_eng.jpg"
date: '2015-04-04 00:00:00'
redirect_from:
- "/daily-code-reviews"
- "/daily-code-reviews/"
tags:
- threadmeup
- mentoring
- software-engineering
---

<figure class="kg-card kg-image-card"><img src="/assets/images/tmu_eng.jpg" class="kg-image" alt ></figure>

We have daily code reviews at 1pm. Everyone in the engineering team sits around our big wooden table and one person tethers their screen to the big television. People can eat their lunch here, but everyone pays attention.

Then we go through each of our repositories. The first step is to view all open pull requests. Some have been reviewed the previous day and some are brand new following the morning’s work.

For new and old pull-requests, our process is the same: contextualize, comment, and assign for follow-up.

### Context

For each pull-request, it is important to establish the reason it was made. Usually, this means we go back to the linked story/bug/feature in our sprint-tracking tool (Jira). It can also mean we bring in the team member that proposed the change or asked for the feature. This really helps to alleviate needless questions in the commenting portion.

Establishing context also helps the group evaluate the testability of the proposed changes. Each issue being tackled has acceptance criteria, and when the group is reviewing the code we keep that in mind.

### Commenting

Once the background has been understood, we can move on to the actual code. We all read through the changes together and make comments on a method or line basis. A comment can be about something we disagree with, a method we don’t understand, an optimization, or something anyone likes.

All four of those reasons are important. It is important to provide concrete questions and suggestions, but equally important to recognize ingenuity when we see it. Sometimes we rip a method apart, but nothing feels better than being commended for a piece of logic that took all afternoon.

We write out all the comments in the pull-request interface. This allows us to search through changes in the past, with the added benefit of understanding the reasons we took one path or another. When in doubt, write it out.

If a pull-request was previously reviewed and changes were requested, we review those changes in the same manner.

### Assignment and Follow-up

Once the commenting and review are done, we decide if the code is ready to be merged. This is a group decision. If we are not ready, we make clear comments requesting changes, to be reviewed the following day. From there, we assign a point person to tackle the changes. Almost always, this is the person who wrote the code in the first place.

If the code is ready for merging, we assign a team member to do so. This can be done either through the GitHub UI or manually, depending on the size of the change and merge conflicts. We tend to err on the side of manual merges, as we have seen unexpected behavior in the past.

* * *

Once all pull-requests have been reviewed, team members are free to suggest other topics for review. This can be code they are currently working on, some logic they are stuck on, something they were proud of cracking, or just an interesting link or library.

This daily review has been amazingly beneficial to our team. We get the benefit of everyone’s experience and merge code every day with at least one other member’s input.

It also allows everyone to keep a pulse on the changes made to projects they are not directly involved in building. With a microservice architecture, this can be immensely important for reducing redundancy and increasing cross-communication.

Daily commenting also makes it easy for us to formulate things like style guides, as they naturally fall out of our discussions.

**Edit:** I have since [expanded on the benefits of code reviews]( /2016/08/11/the-benefits-of-daily-code-review/) for individual team members.

* * *

> Originally posted on the [ThreadMeUp](//threadmeup.com) engineering blog.

