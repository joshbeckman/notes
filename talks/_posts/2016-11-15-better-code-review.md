---
title: Code Review Doesn't Have to Suck
date: 2016-11-15 00:00:00.000000000 Z
redirect_to: https://ghpages.joshbeckman.org/presents/better-code-review
presented_at: Chicago JavaScript Meetup, Chicago Tech Leads Meetup
tags:
- mentoring
- software-engineering
serial_number: 2016.TLS.001
---
## Why do it?

![](http://i.giphy.com/hvM1tC6CPba5a.gif)

---

- Articulate your thoughts
- Critique others
- Receive criticism
- Draw connections 
- Practice communication within your team
- Develop ideas across individuals/languages
- Extract code into libraries
- Catch bugs

Your team will get better. Your product will get better. The community will get better. 


---


## On a team

![](http://i.giphy.com/1264KaMcpCzySY.gif)

---

Have a secondary or rotation location.

Don't fight over semicolons; come ready with a style guide.

Let the initiator drive the discussion.  

- Why is this happening?
- What did you research?
- How did you approach it?
- What did you do?
- How do you test it?
- What about the future?
- What are resources for further consideration?
- Relevant file guidance

Present even if you are the only one working on the app or in the language or even knows it. 


---


## On a distributed team

![](http://i.giphy.com/3o7TKHr47g10ixHpvy.gif)

---

Share a call; share the screen.

Otherwise, just write it out.

We all know Skype sucks, but there are others. [Meetspace][0]?


---


## On an individual team, side projects, etc.

![](http://i.giphy.com/VfyC5j7sR4cso.gif)

---

Have others review your code!

Explain your thoughts and be accountable for them.

Have someone challenge your assumptions and decisions. 

Make pull requests to single-person code bases. 


---

## Current Code Review Practices

---

__Team__: Meeting daily at 1:30pm at a rotating desk, limit to 30 min

__Individual Projects__: Asking friends to review remotely


---


## Tools to use

![](http://i.giphy.com/3hQ0hZDo4QhR6.gif)

---

Use [ghi][1] for GitHub

Use [review][5]/[discussions][6] & [templates][4]/[templates][3] features on GitHub/GitLab. 

Do code review in interviews. 

You can use code review to review candidate samples. 

Choose a time that works for the team.

Have a rule set for assignment, cut down on repeated reviews. 

If the team is large enough, have a [Code of Construction][2].


---


## How to transform an existing code review system

![](http://i.giphy.com/hwDQrYvbyqgBq.gif)

 ---

Start by meeting as a group. One person will probably have to own it. 

Stop wasting code review just on senior engineers.


---


## How to write comments

![](http://i.giphy.com/xHAc8lG6pPH8I.gif)

---

Do it even when in person.

Leave notes for the future. Assume a bad reading of your comments. 

Whenever possible, put example code in the comment. 


---


## Gotchas

![](http://i.giphy.com/EyNdkaG6plg4w.gif)

---

What to do if your distributed team is across incomparable timezones.

Don't let pull requests hang around after being reviewed.

If they hang around too long, it's a sign of mis-alignment within the team.

Have a canonical representation of a pull request that is ready for review. 

Make more pull requests and smaller ones. 


---


## Things to not talk about immediately 

- Structure of branches
- Structure of pull request description
- Connection between pull requests and issue tracker
- Structure of continuous integration or deployment relating to pull requests


[0]: http://www.meetspaceapp.com
[1]: https://github.com/stephencelis/ghi
[2]: https://rfc.zeromq.org/spec:22/C4/
[3]: https://gitlab.com/help/customization/issue_and_merge_request_template.md
[4]: https://help.github.com/articles/creating-a-pull-request-template-for-your-repository/
[5]: https://help.github.com/articles/about-pull-request-reviews/
[6]: https://docs.gitlab.com/ce/user/project/merge_requests/merge_request_discussion_resolution.html
