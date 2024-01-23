---
toc: true
title: GitHub as Social Media
date: '2015-06-13 00:00:00'
tags: social-networks
redirect_from:
- "/github-as-social-media"
- "/github-as-social-media/"
---

GitHub already allows you to follow other users publicly. It displays your _followers_ publicly, too.

Wouldn’t it be possible to make your GitHub account even more sociable? Someone could build a third-party application for this. Here’s the sequence of events I’m imagining to make GitHub-as-a-social-messaging-platform (_SocialHub_?) possible.

### Common Repo

You authorize the app to make a public repo under your account. Everyone using _SocialHub_ has a repo with the same name. Only that respective user has _write_ access to it.

### Commenting

When a user makes a post with _SocialHub_, he or she is actually making a commit to his/her special common repo. The post can be the message, and/or the message can be written into the file of the repo. That way, a message history is preserved within the commits to the common repo.

When other users interact with someone’s _SocialHub_ post (commit), they are actually just using the GitHub comment form/API call on that commit. The same commit that was made to the common repo.

### History

With this structure, pulling up a _SocialHub_ user’s post history is as simple as looking at the commit history to his/her public, common repo. You could make it even more interesting and make the common repo contain a lone markdown file, containing only the most recent post/message. A history of interactions to other users is available simply by listing the comments on each commit.

### Interface/Privacy

You could build this app, I believe, solely as a front-end implementation using GitHub’s available API endpoints. No database required.

Private messages could be passed via a common private repo on a user’s profile. He or she would have to grant access to other users before they could comment/view his/her “private” commits/posts.

Wouldn’t this be a pretty cool social messaging service? It would be completely intertwined with your public GitHub code commits and could leverage the expanse of git and GitHub.

