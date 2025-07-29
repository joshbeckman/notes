---
layout: Post
date: '2025-07-27 15:49:20 +0000'
title: Claude Code Notifications for Async Programming
toc: true
image: "/assets/images/5d859726-2875-445c-acb8-f433bef74e4b.png"
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/114926418464779885
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3luxmokkm7d2i
tags:
- ai
- tools
serial_number: 2025.BLG.117
---
I'm doing so much asynchronous programming through agents now. While at work I'm generally running one to several agents working on ideas or bugs or monitoring things for me. To avoid having to visit each one to check its status, I'm having them _tell_ me when they need my input.

## General Prompt

The first way I did this (and the easiest) was just to tell Claude Code that I wanted to be notified. Here's the relevant section in my user settings prompt `~/.claude/CLAUDE.md`:

````markdown
## General Guidelines for Claude Code

After making a set of changes to files or satisfying a task, you MUST display a notification to tell me what's been done. Use the title "Claude Code" and a brief descriptive message. Here's an example:

```bash
/usr/bin/osascript -e "display notification \"I've finished refactoring the FooBar class into smaller methods\" with title \"Claude Code\" sound name \"Sosumi\""
```
````

This works surprisingly well and has the unexpected benefit that both the main agent and sub-agents will use it and _also_ they will use it to send _progress_ on more complex tasks.

## Hooks

<img width="397" height="115" alt="example notification" src="/assets/images/5d859726-2875-445c-acb8-f433bef74e4b.png" />

I've been using the new [Hooks feature in Claude Code](https://docs.anthropic.com/en/docs/claude-code/hooks) to get a desktop notification whenever it needs me to unblock its progress on a task. It will ping me when it needs permission or input on a task. 

Here's what I have in my `~/.claude/settings.json` user settings:


```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.message' | xargs -I {} /usr/bin/osascript -e 'display notification \"{}\" with title \"Claude\" sound name \"Sosumi\"'"
          }
        ]
      }
    ]
  }
}
```

This just uses some AppleScript to send a nice summary into my Notification Center and I can deal with it immediately or later.

I've also tried a more aggressive version that puts up a dialog box (overlays and interrupts what I'm doing):

```json
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.message' | xargs -I {} /usr/bin/osascript -e 'display alert \"Claude\" message \"{}\"'"
          }
        ]
      }
    ]
  }
```

But I like the desktop notification better because it doesn't grab my input focus and it's also kind of nice to have a history of the notifications in the Notification Center.

NOTE: I _could_ be using the `Stop` hook to send my notification that Claude has completed a task (first section, above), but actually I find that my general prompt is a bit nicer than the hook because it gets Claude to summarize progress for me (and also sends progress rather than just completion).

(See also [my snippet to get notifications on Buildkite](https://www.joshbeckman.org/blog/buildkite-browser-notifications-userscript).)
