---
toc: true
title: Recruitment Searching on GitHub
date: '2016-09-08 00:00:00'
tags:
- hiring
redirect_from:
- "/recruitment-searching-on-github"
- "/recruitment-searching-on-github/"
---

We’re currently looking for Senior Mobile (iOS / Android) and Senior Fullstack Engineers [at OfficeLuv](//www.officeluv.com/careers). Finding great developers is…difficult. I will occasionally search for individuals on GitHub, where I can find a scrap of contact information and reach out.

[GitHub](//github.com) doesn’t exactly provide a fantastic interface for perusing influential users, but it does have a [reasonably advanced search](//github.com/search/advanced). From there, you can select people using a certain language, in a certain location, and with a certain number of followers. I use the followers as [an admittedly flawed] proxy for proficiency. You could alternatively substitute number of public repositories as a proxy for proficiency.

As an example, here’s [my search for influential JavaScript developers in Chicagoland](https://github.com/search?utf8=✓&q=location%3AChicago+location%3AIL+followers%3A%3E15+language%3AJavaScript&type=Users&ref=searchresults). If you take a look at the search terms, you can see where to tweak/replace the chosen language, alter the lower-bound of followers, or change the location. Use it to find some good employees.

### Update

I was finding good candidates with these searches, but often people obfuscate their email addresses out of their public GitHub profile page. But never forget the metadata found in `git` itself! Every committed code change pushed to GitHub (or any `git` repository) must have an email address attached to it. So, all you have to do is find the raw commit data.

Fortunately, GitHub has an API that displays [a portion of] raw `git` data for public code repositories. To view [commit metadata](https://developer.github.com/v3/git/commits/) for a given repository, you can visit this URL, substituting your own values:

    https://api.github.com/repos/<username>/<repo_name>/commits

Then, just look for the `commit > author > email` field.

