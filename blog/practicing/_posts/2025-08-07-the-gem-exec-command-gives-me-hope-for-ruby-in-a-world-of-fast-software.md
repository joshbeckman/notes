---
layout: Post
date: '2025-08-07 12:53:07 +0000'
title: The gem exec command gives me hope for Ruby in a world of fast software
toc: true
image:
description:
mastodon_social_status_url: 'false'
bluesky_status_url: 'false'
tags:
- language-ruby
- tools
- open-source
---


As more and more software is being developed quickly by LLMs, I'm seeing this "fast software" as akin to "[fast fashion](https://en.wikipedia.org/wiki/Fast_fashion)". I'm seeing more people gravitate to Python and JavaScript as the common language for their scripts and one-off commands. I think it's because of the simplicity and ease of sharing these scripts with one-click-copy-and-run commands powered by [`npx`](https://docs.npmjs.com/cli/v9/commands/npx?v=true) and [`uvx`](https://pypi.org/project/uv/). 

I personally gravitate toward Ruby as my lingua franca and while the rubygems ecosystem is loving and healthy, I saw the friction imposed by explicitly installing gems to be slowing that adoption in an LLM-driven world. But behold! The community has already seen this as well and we have an equivalent in `gem exec` ([initial pushback](https://github.com/rubygems/rubygems/issues/2872), then [RFC](https://github.com/rubygems/rfcs/pull/45), then [implementation](https://github.com/rubygems/rubygems/pull/6309)) that is available today.

This is going to revitalize my commitment to making more of my utilities (like I've [been doing recently](https://www.joshbeckman.org/blog/practicing/releasing-ghviewmd-a-github-cli-extension-for-llmoptimized-issue-and-pr-viewing)) into public gems that can be shared and distributed. I've already got a couple in mind (incubating in [my dotfiles `bin` commands](https://github.com/joshbeckman/dotfiles/tree/master/bin)) that I'd love to demo and document with this executable distribution.

## Details

```sh
Usage: gem exec [options --] COMMAND [args] [options]

  Options:
    -v, --version VERSION            Specify version of gem to exec
        --[no-]prerelease            Allow prerelease versions of a gem
                                     to be installed
    -g, --gem GEM                    run the executable from the given gem


  Install/Update Options:
        --conservative               Prefer the most recent installed version, 
                                     rather than the latest version overall


  Common Options:
    -h, --help                       Get help on this command
    -V, --[no-]verbose               Set the verbose level of output
    -q, --quiet                      Silence command progress meter
        --silent                     Silence RubyGems output
        --config-file FILE           Use this config file instead of default
        --backtrace                  Show stack backtrace on errors
        --debug                      Turn on Ruby debugging
        --norc                       Avoid loading any .gemrc file


  Arguments:
    COMMAND  the executable command to run

  Summary:
    Run a command from a gem

  Description:
    The exec command handles installing (if necessary) and running an executable
    from a gem, regardless of whether that gem is currently installed.
    
    The exec command can be thought of as a shortcut to running `gem install`
    and
    then the executable from the installed gem.
    
    For example, `gem exec rails new .` will run `rails new .` in the current
    directory, without having to manually run `gem install rails`.
    Additionally, the exec command ensures the most recent version of the gem
    is used (unless run with `--conservative`), and that the gem is not
    installed
    to the same gem path as user-installed gems.

  Defaults:
    --version '>= 0'
```
