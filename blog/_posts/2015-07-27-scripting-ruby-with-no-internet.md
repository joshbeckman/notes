---
toc: true
title: Scripting Ruby with no Internet
date: '2015-07-27 00:00:00'
tags:
- end-user-programming
- code-snippets
- language-ruby
- jekyll
redirect_from:
- "/scripting-ruby-with-no-internet"
- "/scripting-ruby-with-no-internet/"
---

As I sit, I’m riding on the commuter rail as it creaks and staggers its way North. I intended to write some thoughts down, but got distracted in the hassle of touching a new Jekyll post.

So, I wrote [a little Ruby script](https://github.com/andjosh/dotfiles/blob/master/bin/jpost) - aptly - for creating a new Jekyll draft or post from the command line.

```ruby
#!/usr/bin/env ruby

# jpost
# A script to create a jekyll post with provided title & current date
# and open it with current $EDITOR
# usage within Jekyll directory:
# $ jpost My Title Goes Here [--draft]

first = ARGV[0]
last = ARGV[ARGV.count - 1]
flag = '--draft'
name = '_drafts/'

if first == flag
    ARGV.shift(1)
elsif last == flag
    ARGV.pop
else 
    name = '_posts/'
end

name += Time.now.to_s.split(' ')[0] + '-'
name += ARGV.join('-').downcase.gsub(/[^\w-]/, '')
name += '.md'

front_matter = '---\nlayout: post\ntitle: ' + ARGV.join(' ') + '\n---\n'

exec('echo "' + front_matter + '" > ' + name + ' && $EDITOR ' + name)
```

When I worked as a photojournalist, there was a concept of _chimping_: glancing at the camera LCD immediately after each photograph taken. Most photographers viewed it as a cheapening of the craft - many extolled the benefits of photographing with old film Nikons simply because you were not tempted to check the camera incessantly.

It’s interesting that I feel somewhat the same about programming without the aid of sites like Stack Overflow. As I wrote this Jekyll posting script, I loved the empowering feeling as I paged through the native Ruby `man` pages. Having not written Ruby in a few months, it was reassuring to know that I could find my own way without cowing to search results.

