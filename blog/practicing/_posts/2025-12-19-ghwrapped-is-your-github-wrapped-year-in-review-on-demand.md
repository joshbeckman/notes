---
layout: Post
date: '2025-12-19 03:11:29 +0000'
title: gh-wrapped is Your GitHub Wrapped Year in Review, On Demand
toc: true
image: "/assets/images/c00b8275-9b80-41c1-bbea-86bc33607789.png"
description:
mastodon_social_status_url: false
bluesky_status_url: false
tags:
- tools
- github
- open-source
- CLI
serial_number: 2025.BLG.201
---
Every December, I watch people share their "Spotify/etc. Wrapped" results and wonder when someone will finally build a proper GitHub version. Various "GitHub Wrapped" websites pop up each year, but they always disappoint me:

1. They only work for public contributions
2. They miss gists, repos created, and sponsorship data
3. They're only available during a narrow window in December
4. You can only check your own stats

I got tired of waiting for someone else to solve this, so I built [gh-wrapped](https://github.com/joshbeckman/gh-wrapped) to give you a complete *GitHub Wrapped* on demand.

> [!NOTE]
> `gh-wrapped` is a [GitHub CLI extension](https://docs.github.com/en/github-cli/github-cli/creating-github-cli-extensions) that generates a year-in-review summary of your GitHub activity, inspired by Spotify Wrapped. Get detailed stats on your contributions, activity patterns, top languages, and more—all as formatted markdown.

<img width="662" height="289" alt="Example rendering of the beginning of gh-wrapped markdown" src="/assets/images/c00b8275-9b80-41c1-bbea-86bc33607789.png" />

## Installation

```bash
gh extension install joshbeckman/gh-wrapped
```

That's it. You have the GitHub CLI installed and authenticated (and `jq` for JSON parsing), you're ready to go.

## Run It Any Time, For Any Year, For Anyone

```bash
# Your stats for this year
gh wrapped

# Your stats for 2023
gh wrapped 2023

# Check someone else's public activity
gh wrapped 2024 octocat

# Save it as a gist
gh wrapped 2024 | gh gist create -f wrapped-2024.md
```

The third-party websites that appear each December are fine for a quick shareable image, but I wanted something I could run any time I'm curious. How did Q1 compare to Q4? What was my busiest month? Did I actually contribute more this year than last? These questions don't care about December.

## What You Get

The tool pulls from GitHub's GraphQL `contributionsCollection` endpoint which is the same data source that powers your profile's contribution graph. This means it includes **both public and private contributions** in the totals.

- **Contribution Summary** with public/private breakdown
- **Activity Patterns**: busiest day of week, longest streak, peak activity day
- **Visual Charts** for daily and monthly activity (ASCII bar charts in your terminal)
- **Top Languages** by commits
- **Top Repositories** by commits
- **Repositories Created** that year
- **Gists Created** (including private ones)
- **GitHub Sponsors** activity (when checking your own stats)
- **Profile Stats**: stars, followers, following

## Private Contributions

This was the main reason I built this. GitHub's API provides the total count of private contributions through `restrictedContributionsCount`, which those web-based tools often ignore or can't access. The detailed per-repo and per-language breakdowns only cover public repos (GitHub's API doesn't expose private repo details), but at least your totals reflect reality.

The output clearly labels what's public vs private so you know exactly what you're looking at.

> [!NOTE]
> This is my third `gh` extension. Previously released: [gh-pr-staleness](https://www.joshbeckman.org/blog/practicing/releasing-ghprstaleness-github-cli-extension-for-commits-behind-target) and [gh-view-md](https://www.joshbeckman.org/blog/practicing/releasing-ghviewmd-a-github-cli-extension-for-llmoptimized-issue-and-pr-viewing)

The [source is on GitHub](https://github.com/joshbeckman/gh-wrapped) with examples and full documentation. Contributions are welcome!
