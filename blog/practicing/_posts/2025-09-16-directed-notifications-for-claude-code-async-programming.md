---
layout: Post
date: '2025-09-16 03:37:56 +0000'
title: Directed Notifications for Claude Code Async Programming
toc: true
image: "/assets/images/ab4a116a-65da-4bc0-84c1-1cbecefc941d.png"
description:
mastodon_social_status_url: https://mastodon.social/@joshbeckman/115212358770048207
bluesky_status_url: https://bsky.app/profile/joshbeckman.org/post/3lywm55jlwj2u
hacker_news_url: https://news.ycombinator.com/item?id=45264463
tags:
- code-snippets
- ai
- tools
- popular
serial_number: 2025.BLG.153
---
This afternoon I leveled up my [previous Claude Code notifications](https://www.joshbeckman.org/blog/practicing/claude-code-notifications-for-async-programming). Now I have Claude's notifications:
- grouped by project/directory
- take me directly to the relevant terminal pane if clicked
- persisted until I act on them

> Read that original post for details, but generally I have Claude send me notifications in two channels: general prompt and hooks. 

In that previous configuration, I was using Apple's built-in notifications via AppleScript. Now, I've finally bitten the bullet and upgraded to [julienXX's `terminal-notifier`](https://github.com/julienXX/terminal-notifier) package that lets you customize much more. Specifically, it lets you set:
- an application to activate upon notification click
- a shell command to execute upon notification click
- a group identifier for grouping notifications
- and a bunch of [other options](https://github.com/julienXX/terminal-notifier?tab=readme-ov-file#options)

So, where previously all the Claude notifications were bunched together and clicking any did nothing but bring up AppleScripts, now I can have each Claude instance send its own notifications to its own group and when I click one I'm brought directly to that Claude Code panel in my terminal.

## Installation

You'll need to install:
- [terminal-notifier](https://github.com/julienXX/terminal-notifier)
- a terminal that allows for programmatic tab/panel activation
  - I use [WezTerm](https://wezterm.org/)
  - (you could replicate this in `tmux` or `kitty`, for example)

Once you have those installed, you can install a [Claude Code Hook](https://docs.anthropic.com/en/docs/claude-code/hooks) to get a desktop notification whenever it needs you to unblock its progress on a task. It will ping you when it needs permission or input on a task, with details about the permission.

Here’s what I have in my `~/.claude/settings.json` user settings:

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.message' | xargs -I {} terminal-notifier -message \"{}\" -title \"Claude Hook\" -group \"$(pwd):hook\" -execute \"/opt/homebrew/bin/wezterm cli activate-pane --pane-id $WEZTERM_PANE\" -activate com.github.wez.wezterm"
          }
        ]
      }
    ]
  }
}
```

Breaking that down:

```sh
# parse out the message field from the hook payload sent by Claude Code
jq -r '.message' | \
# pipe that into terminal-notifier as the message
xargs -I {} terminal-notifier -message \"{}\" \
# title it Claude Hook so I can distinguish it from Claude itself
-title \"Claude Hook\" \
# group it by the directory Claude is operating in, suffixed with ':hook'
-group \"$(pwd):hook\" \
# focus this Claude instance's pane within the terminal multiplexer when the notification is clicked
-execute \"/opt/homebrew/bin/wezterm cli activate-pane --pane-id $WEZTERM_PANE\" \
# activate WezTerm when the notification is clicked
-activate com.github.wez.wezterm
```

This is using WezTerm's [activate-pane CLI command](https://wezterm.org/cli/cli/activate-pane.html) and [its `$WEZTERM_PANE` environment variable](https://wezterm.org/cli/cli/index.html#:~:text=If%20the%20%24WEZTERM_PANE%20environment%20variable%20is%20set%2C%20it%20will%20be%20used) for each session.

So that takes care of notifying me when Claude needs permission for something. I also tell Claude Code to notify me when it accomplishes something (and it's about to stop). Here’s the relevant section in my user settings prompt `~/.claude/CLAUDE.md`:

````md
After making a set of changes to files or satisfying a task, you MUST display a `terminal-notifier` notification to tell me what's been done. Use a title and a brief descriptive message. Here's an example:

```bash
terminal-notifier -message "I've finished refactoring the FooBar class into smaller methods" -title "Claude Code" -group $PWD -execute "/opt/homebrew/bin/wezterm cli activate-pane --pane-id $WEZTERM_PANE" -activate com.github.wez.wezterm
```
````

This is very similar to the hook implementation but I just have it grouping by the present working directory. Since I make git worktrees for each of my different tasks these days, each task tends to have its own dedicated directory.

For this to reliably be available for Claude, I also add a permission to my user settings to allow terminal-notifier commands:

```json
{
  "permissions": {
    "allow": [
      "Bash(terminal-notifier:*)"
    ]
  }
}
```

<img width="445" height="109" alt="Example Claude notification via terminal-notifier" src="/assets/images/ab4a116a-65da-4bc0-84c1-1cbecefc941d.png" />

Another change I've made with this new configuration is that I have the notifications persist until I dismiss or click them. You can set this in System Preferences under `Notifications > terminal-notifier`.

<img width="497" height="250" alt="Allowing Alerts for terminal-notifier" src="/assets/images/b77aa74c-23bf-41af-9745-ba956aae23f9.png" />

I know others have been building more... complex interfaces for managing lots of Claude instances, but I like to keep as close to the terminal as possible (as close to the actual Claude and its code/changeset as possible). With this new setup, I'm even more confident running handfuls of concurrent Claude coders. Each one gets its own notification queue and I can be sure of finding them in just a single click.
