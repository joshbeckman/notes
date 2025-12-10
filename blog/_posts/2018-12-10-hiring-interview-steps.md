---
toc: true
title: Hiring Retrospective - Interview Steps
date: '2018-12-10 00:00:00'
tags:
- hiring
- officeluv
redirect_from:
- "/hiring-interview-steps"
- "/hiring-interview-steps/"
serial_number: 2018.BLG.012
---
After interviewing all Summer and Fall, we’ve found the next member of [our OfficeLuv Product Team](https://officeluv.github.io), a talented and thoughtful software engineer.

This hiring cycle, I wanted to approach recruitment as we would a product feature or epic. Part of that, of course, is having a good retrospective. Here’s the first part, a simple overview of the steps in our interview process. This is also for my good friend Bruce Ackerman, who is also [hiring at Printavo](https://angel.co/printavo/jobs).

## Job Description

Finding the good engineers starts with a good job description. I think too many hiring teams forget that _they_ should think of how to entice the engineers they want to hire. To that end, I went through a couple iterations on this particular job description, with each revision focusing _more on our team process_ and, I’m happy to say, bringing in _more candidates_. Here’s the final introduction that brought in a spike of quality applicants:

> We’re growing here at OfficeLuv and are looking for a Full-stack Engineer to help us shape the momentum! The Full-stack Engineer will help develop, solve, and produce the technology that helps power OfficeLuv and our loyal customers. You will work with the small tech/product team to build applications in the cloud, in the browser, and on phones that will iterate rapidly and provide direct benefit to customers you’ll talk to. We’re building for the long run. You’ll be excited about the two-sided marketplace you can shape here. We’re standardizing and automating a process that’s ripe for it. You’ll be shaping the supply and grocery of offices across the country!

> We run a very collaborative and growth-mindset product team. We focus on automating as much as possible (continuous integration and deployment for _all_ systems) so we can all sleep soundly at night. We leave our laptops in the office at the end of the day. If you want a taste of our management style, [you can read about it](https://github.com/andjosh/as-your-manager). [We contribute](https://github.com/officeluv) to the open source community and communicate within our company continuously.

From there, the job description listed out our technical languages/stack, agile process, and 2-5 years &nbsp;as experience requirements (among a few other nice-to-haves).

Originally, the introduction was only the first paragraph. After adding the second, I noticed a spike in more experienced candidates with a philosophy more closely aligned with our team’s. I wasn’t eager to share my management README initially, but it certainly paid off.

We syndicated this job description on our Careers page, on AngelList, on Indeed, on LinkedIn, on HackerNews, and in Chicago Slack groups.

## Application Screening

If a candidate liked our job description (and whatever else they chose to find about us), they would submit a resume and cover letter. If I declined a candidate at this stage, it was largely due to a lack of total experience (e.g. just graduated from a bootcamp or grad school), a lack of experience in relevant languages, or a lack of access (e.g. located outside the Midwest or outside the U.S.).

I would occasionally decline a candidate that shared (open-source) work at this stage containing bad work. Examples included: profanity in code commits, dramatically buggy code on portfolio work, or very sloppy recent work featured prominently.

## Phone/Coffee Screen & Code Samples

I would then book a conversational screening session with the person. This was most often a phone interview, but would sometimes take place over coffee if they were a referral.

I approached this conversation as a two-sided, high-density, cards-on-the-table excitement fest. I would tell them about our company’s history, our product, our team’s process, and would try to excite them about building our future. I would ask them about their ideal product development practices and examples of how they have solved complex problems in their past work. It was the job of both sides to excite the other about working together.

During the conversational screen, I would ask for two code samples:

- An example of something (code, design, data-flow, architecture, etc.) that they built and were proud to build again. They understood the problem and built an elegant or performant or maintainable solution.
- An example of the opposite. Something they have built or designed that, looking back on it now, they knew they should have done better.

I also asked them to write up brief explanations about why they had chosen the two samples. Then they would email the samples and comments to me within a few days.

I would only advance candidates that seemed excited about us and that I was excited to bring into the office. If they sent code samples that were of poor quality (and did not identify it as such), or their comments did not convey a true understanding of the samples, I would also decline at this point.

## On-Site Interview Screen

I would then schedule an on-site interview with the candidate. These interviews normally lasted between 2-4 hours (depending on our team’s availability). They broke down into roughly four sections, handle by myself and three other company members. My technical portion would take roughly twice as long as the others and would usually start the session.

I would set up an account on our staging environment for the candidate to play around in our product (sometimes we simply did this during the interview). I also asked them to prepare a short (5-10 minute) technical topic that they could teach me (“anything interesting or potentially relevant, I’m mostly looking for how you think about things and how you explain things”).

In the technical portion, we would talk about their code samples. I would have them walk me through their comments in more detail. If they prepared a technical teaching topic, they would teach me. I would have them point out where they expect the bodies to be buried in our app (which they had been exploring). Then, I would open up the file or script responsible for that part of the app and have them critique it with me. In all of these topics, I was looking for communication skill and deep technical understanding.

In hiring for past jobs, I would have given a live-coding challenge (a favorite is re-implementing `Array.prototype.push` in their language of choice), but I didn’t feel that was necessary for this particular role. Instead, I would dig deeply into their ability to understand and explain a more complex portion of our code. If the conversation flowed to it, I would posit some data-flow problems and ask how they would address them.

Following, we would have other company members (always the same members, to maintain consistent measures) speak with the candidate about how business metrics or criteria influenced their product engineering, especially through rapid iteration. Someone would press the person on their ability to incorporate stakeholder feedback into the product iteration cycle. Someone would ask them to provide examples of how they decompose problems like our back-end systems. How have they grown their team members and improved their team’s delivery in the past?

## Discussion & Offer

If our other interviewers were excited about the candidate and I thought they were technically savvy, we started reaching out about an offer. We didn’t really ask much more than that.

## Tweaks

These are roughly the same procedural steps I’ve used in hiring the members of my last couple teams. If the role was more junior, I would ask more live-coding exercises during the on-site interview. If the role was more senior, I would spend more time explaining our architecture in the on-site interview, asking them to predict where the faults would lie.

Over the time we interviewed candidates for this role, I moved to sending staging platform access further in advance. That led to more productive discussions during the interview.

When I sent out the on-site interview invites to the other members on our team, I _always_ included the candidate’s resume, a short bio of their past roles, current role, and future role desires, as well as suggestions for questions I thought their should ask the candidate. This allowed our interviewers to prepare quickly and effectively.

In [the next part of this retrospective](https://www.joshbeckman.org/blog/hiring-interview-advancement-rate), I’ll go over some of our acceptance rates for each of these stages.

