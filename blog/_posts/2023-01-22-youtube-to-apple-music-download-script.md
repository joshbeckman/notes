---
toc: true
title: YouTube to Apple Music Download Script
image: "/assets/images/L1030087.jpeg"
description: Sweep your favorite YouTube concerts into your Apple Music library
date: '2023-01-22 17:57:12'
tags:
- code-snippets
redirect_from:
- "/youtube-to-apple-music-download-script"
- "/youtube-to-apple-music-download-script/"
serial_number: 2023.BLG.004
---
<figure class="kg-card kg-image-card"><img src="/assets/images/L1030087.jpeg" /></figure>

I've long had some bookmarked DJ sets or live performances on YouTube that I would love to have available as I run or work. Viewing them on YouTube is usually not a great option because you have to keep the web page open, it inserts ads into the video and audio, etc. It's not optimized for listening, not like my Apple Music apps.

I've long been a fan and user of [`youtube-dl` - the best program to download videos from YouTube and a few other sites](https://ytdl-org.github.io/youtube-dl/index.html). I've written many scripts against it for Narro and other services.

I've long uploaded my own MP3 files into my Apple Music library - my own recordings or audiobooks I've generated with Narro, etc.

What I _didn't_ know was how to programmatically get a nicely formatted and tagged MP3 into my Apple Music library. Luckily, some web-excavating lead me to [this forum post from ten years ago](https://discussions.apple.com/thread/5304321) about how to move files into (then) iTunes. With that hint I was able to determine the current folder structure and wrote up this script:

    #!/usr/bin/env bash
    
    name=$(echo $1 | sed 's|^.*?v=||g')
    youtube-dl -o "$name.%(ext)s" --embed-thumbnail --add-metadata -x --audio-format=mp3 --buffer-size=16k $1 && \
    mv $name.mp3 ~/Music/Music/Media.localized/Automatically\ Add\ to\ Music.localized

All you need to do is save that into an executable file and then you can run:

    executable_youtube_downloader "https://www.youtube.com/watch?v=JYHp8LwBUzo&t=1s"

And the audio will download, get tagged with the appropriate metadata for music libraries, and be sucked up into your Apple Music library. Simple and sweet.

