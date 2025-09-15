---
layout: Post
date: '2025-09-14 16:41:11 +0000'
title: 'Releasing gh-pr-staleness: GitHub CLI Extension for Commits Behind Target'
toc: true
image: "/assets/images/d8238fc8-3f69-4c51-9be0-94d238607ceb.png"
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/115203860421219532
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3lystemi2ds2c
tags:
- tools
- llm
- language-ruby
- open-source
serial_number: 2025.BLG.151
---
Working in a monorepo and with a merge-queue (as we are now doing inside Shopify - I'm [grappling](https://www.joshbeckman.org/notes/01jwtzrp79033w8x8dc8sje7d6) with it), it becomes imperative that pull-requests (proposed changes) are compared and tested against the most up-to-date version of the codebase. To ensure tests and reviews are accurate, they need to cross the smallest gap possible.

So, the operators of a merge-queue will often implement staleness checks/guarantees like:
- PRs can only be merged if they are less than X commits behind the target branch
- Code will only be tested in CI if it is less than X commits behind `main`/trunk

So, the engineers need to get into a habit of tracking staleness and proactively rebasing their changes on the active target/trunk. _I"m_ having to do this quite a lot, so I built [gh-pr-staleness](https://github.com/joshbeckman/gh-pr-staleness).

> gh-pr-staleness is a [GitHub CLI extension](https://docs.github.com/en/github-cli/github-cli/creating-github-cli-extensions) that calculates the staleness (how many commits behind TARGET branch) of a pull request.

<img width="1200" height="600" alt="gh-pr-staleness repo" src="/assets/images/d8238fc8-3f69-4c51-9be0-94d238607ceb.png" />

This is very useful for determining which PRs are actionably mergeable, especially in highly active monorepo or merge-queue environments. It's simple and fast and easy to use in scripts.

What I _also_ want is for GitHub to display the PR staleness _in their actual pull request user interface_, but I think they are resistant because it's kind of an expensive calculation.

> This is my second `gh` extension. Previously released: [gh-view-md - A GitHub CLI Extension for LLM-Optimized Issue and PR Viewing](https://www.joshbeckman.org/blog/practicing/releasing-ghviewmd-a-github-cli-extension-for-llmoptimized-issue-and-pr-viewing)

## Installation

```bash
gh extension install joshbeckman/gh-pr-staleness
```

That's it. If you have the GitHub CLI installed and authenticated, you're ready to go.

```bash
gh pr-staleness <github_pr_url_or_number>
# or, if you are on a branch that has a PR already, it will be inferred:
gh pr-staleness
```

The [source is on GitHub](https://github.com/joshbeckman/gh-pr-staleness) with examples and full documentation. Contributions are welcome!

