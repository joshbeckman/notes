---
toc: true
title: Importing Readwise into Day One
description: Bringing my media log highlights into my journal app
date: '2023-01-16 04:56:39'
tags:
- readwise-ruby
- note-taking
- code-snippets
redirect_from:
- "/importing-readwise-into-day-one"
- "/importing-readwise-into-day-one/"
---

I've returned to using [Readwise](https://readwise.io) to record snippets of the books I'm reading at home (through their mobile app) and the articles I'm reading online (through their new [Reader](https://readwise.io/read) app).

In previous years, I've just recorded highlights and snippets of articles in my journal - written in [Day One](https://dayoneapp.com/) - alongside other general journal notes. I've got a couple years of those notes (though they are sparser than what I've been recording in Readwise these days), and I really enjoy looking back at what I was reading in previous years (like a [Media Log]( /tag/media-log/)), so I wanted to bring these Readwise highlights into my Day One journal.

Luckily, [Readwise has a good API](https://readwise.io/api_deets) and [pre-configured data export options](https://readwise.io/export). I was drawn to the API, but the [markdown exporter](https://help.readwise.io/article/56-how-do-i-export-my-highlights-to-csv-or-markdown) already offered most of what I wanted: grouping highlights by source, auto-tagging, image embedding, etc. It will download a folder named `Readwise` with sections for `Books` and `Articles`. So I decided to start there.

<figure class="kg-card kg-image-card"><img src="/assets/images/Screenshot-2023-01-15-at-10.44.12-PM.png" class="kg-image" alt  width="1482" height="690"  sizes="(min-width: 720px) 720px"></figure>

Luckily, [Day One has a [rudimentary] command line interface](https://dayoneapp.com/guides/tips-and-tutorials/command-line-interface-cli/) that I could write a [rudimentary] Ruby script around:

```ruby
# Change this to your preferred journal
journal = 'Media Log'

command = "dayone2 -j '#{journal}' new"

# This assumes you have downloaded your Readwise highlights
# exported as markdown into a folder named 'Readwise'.
files = Dir["Readwise/*/*.md"]

files.each do |filename|
  IO.popen(command, 'r+') do |cmd_io|
    file = File.open(filename)
    cmd_io.puts file.read
    cmd_io.close
  end
end
```

You can save this into a file in the same directory where you have downloaded the markdown export and execute as `ruby file.rb` or you can just open up an interactive session via `irb` and paste in the code.

Now I have a reminder every weekend to download highlights from the week and run this script.

But this integration isn't exactly what I would like - all the highilights are dated for the time of the import and it takes a bit of time to remember this and run the script. &nbsp;So next week I'll be experimenting with the Readwise API and the [IFTTT Day One service](https://ifttt.com/day_one/details) (the closest thing I've found to a Day One API). I think I could get something running that would create journal entries on the fly (as highlights become available in Readwise).

