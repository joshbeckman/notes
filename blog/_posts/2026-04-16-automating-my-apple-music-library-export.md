---
layout: Post
date: 2026-04-16 11:00:00.000000000 +00:00
title: Automating My Apple Music Library Export
description: Using macOS GUI scripting to fully automate my music stats pipeline
tags:
- code-snippets
- music
- automation
category: practicing
toc: true
---

Two years ago I wrote [a parser that pulls fun insights out of my Apple Music library](/blog/pulling-fun-insights-out-of-my-apple-music-library) and generates my [Music Listening page](/music). The pipeline worked well but it had an annoying manual step: I had to open Music.app, click File > Library > Export Library, navigate to the right directory, and save the XML file before running the script. It was enough friction that I'd forget to do it for months.

## The automation

Apple Music doesn't expose a "library export" command in its AppleScript dictionary, so the only option is GUI scripting through System Events. The script:

1. Activates Music.app
2. Navigates the menu: File > Library > Export Library...
3. Uses Cmd+Shift+G in the save dialog to jump to the project directory
4. Clicks Save
5. Waits for the ~46MB XML file to finish writing (by polling file size until it stabilizes)
6. Runs the existing `update_music` Ruby script to regenerate the page
7. Commits any changes to `blog/` and `assets/` and pushes to deploy

```bash
./utilities/export_and_update_music
```

The interesting part was discovering that Music.app opens a standalone `window "Save"` rather than the more common `sheet 1 of window 1` pattern that most macOS apps use for save dialogs. That small difference was the only real debugging needed.

## Running it on a schedule

Since GUI scripting requires a logged-in session with screen access, a plain cron job won't work. Instead, I'm using a `launchd` agent with `LimitLoadToSessionType: Aqua`, which ensures it only fires when I'm actually at my Mac.

```xml
<key>LimitLoadToSessionType</key>
<string>Aqua</string>
```

It runs weekly on Sunday mornings. Unlike cron, `launchd` with `StartCalendarInterval` will fire a missed job on wake, so if my laptop was sleeping during the scheduled time, it catches up as soon as I open the lid.

The other `launchd` gotcha: the agent runs with a minimal environment, not your shell profile. I had to set `PATH` (to find Homebrew's Ruby and `bundle`) and `LANG` (to `en_US.UTF-8`, since the plist parser chokes on non-ASCII track metadata without it) in the plist's `EnvironmentVariables`.

## Requirements

The prerequisite is granting Accessibility permissions (System Settings > Privacy & Security > Accessibility). When running from a terminal, your terminal app needs the permission. When running via `launchd`, `/usr/bin/env` needs it instead. Since the script's shebang uses `#!/usr/bin/env bash`, `env` is the parent process that macOS checks for Accessibility access.

The full script is in [the repo](https://github.com/joshbeckman/notes/blob/master/utilities/export_and_update_music).
