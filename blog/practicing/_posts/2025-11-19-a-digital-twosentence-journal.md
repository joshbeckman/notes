---
layout: Post
date: '2025-11-19 14:06:34 +0000'
title: A Digital Two-Sentence Journal
toc: true
image: "/assets/images/7521025c-92a3-4a6d-8c06-9abcd751fdd9.jpeg"
description: A vampire's journal and a physical notebook inspired me to write a program
  to store my experiences
mastodon_social_status_url: false
bluesky_status_url: false
tags:
- writing
- games
- note-taking
- code-snippets
serial_number: 2025.BLG.185
---
When Marybeth and I got married, I bought us a [Some Lines A Day notebook from LEUCHTTURM1917](https://www.leuchtturm1917.us/some-lines-a-day.html) and we started filling it with a daily note (one sentence from each of us) on our favorite part of our day. We had been asking each other this nightly for years, and it was a nice physical structure to keep and reflect on those moments. The structure of this notebook is such that each page is a day of the year, with sections for 5 years on that day. By writing any one day, you read through that day on prior years.

![The autumn leaves force contemplation on us all, I think.](/assets/images/7521025c-92a3-4a6d-8c06-9abcd751fdd9.jpeg)

Recently I found [the two-sentence journal via De minimis non curat Lex](https://alexanderbjoy.com/two-sentence-journal/). In it, Alexander describes how he's adapted a game mechanic from _Thousand Year Old Vampire_ for his own journaling. In the game, your vampire has finite memory, composed of experiences that you have written down during the game (and as the centuries pass, you must choose which aspects of your vampire's life to retain or forget).

> An Experience should be a single evocative sentence. An Experience is the distillation of an event—a single sentence that combines what happened and why it matters to your vampire. A good format for an Experience is “[description of the event]; [how I feel or what I did about it].”

> As for how an experience might be written, the rulebook offers the following example:
> > Stalking the deserts over lonely years, I watch generations of Christian knights waste themselves on the swords of the Saracen; it’s a certainty that Charles is among them—I dream of his touch as I sleep beneath the burning sand.

Alexander took this into a journaling habit of his own:

> I would aim to constrain each day's entry to one or two key things, and limit their expression to one or two sentences. I allowed myself that latter tweak because the initial Thousand Year Old Vampire rule encourages improper semicolon usage and ugly run-on sentences, both of which strain language in hopes of cramming in as much as possible.

I fully agree with Alexander on loosening the constraint to two sentences; it's much more beautiful that way. Two sentences allow narrative arcs, short stories, and juxtaposition to form. But you still can't ramble and writing a sentence or two is always easy.

## Digital Form

Inspired by this two-sentence journal and the physical structure of our _Some Lines A Day_ notebook, I wanted to make a digital space for both.

So, I wrote a little command line program, `journal`, that will set up the structure of a daily, annualized journal in a markdown file, opening it to today. Then you write your one or two sentences and close it.

```bash
#!/usr/bin/env bash

set -euo pipefail

JOURNAL_FILE="JOURNAL.md"
CURRENT_DATE=$(date +"%B-%d")
CURRENT_YEAR=$(date +"%Y")

if [[ ! -f "$JOURNAL_FILE" ]]; then
    {
        echo "# Journal"
        echo ""
        for month in {1..12}; do
            days_in_month=$(cal $month $CURRENT_YEAR | awk 'NF {DAYS = $NF} END {print DAYS}')

            for day in $(seq 1 $days_in_month); do
                month_padded=$(printf "%02d" $month)
                day_padded=$(printf "%02d" $day)
                day_date=$(date -j -f "%Y-%m-%d" "${CURRENT_YEAR}-${month_padded}-${day_padded}" "+%B-%d" 2>/dev/null)

                echo "## $day_date"
                echo ""
            done
        done
    } > "$JOURNAL_FILE"
fi

if ! awk -v date="$CURRENT_DATE" -v year="$CURRENT_YEAR" '
    /^## / { in_day = 0 }
    $0 ~ "^## " date "$" { in_day = 1 }
    in_day && /^### / && $2 == year { found = 1; exit }
    END { exit !found }
' "$JOURNAL_FILE"; then
    awk -v date="$CURRENT_DATE" -v year="$CURRENT_YEAR" '
        /^## / {
            if (in_day && !year_added) {
                print ""
            }
            in_day = 0
            year_added = 0
        }
        $0 ~ "^## " date "$" {
            in_day = 1
            print
            print ""
            print "### " year
            year_added = 1
            next
        }
        { print }
    ' "$JOURNAL_FILE" > "${JOURNAL_FILE}.tmp"
    mv "${JOURNAL_FILE}.tmp" "$JOURNAL_FILE"
fi

LINE_NUM=$(awk -v date="$CURRENT_DATE" -v year="$CURRENT_YEAR" '
    /^## / { in_day = 0 }
    $0 ~ "^## " date "$" { in_day = 1 }
    in_day && /^### / && $2 == year { print NR; exit }
' "$JOURNAL_FILE")

if [[ -z "$LINE_NUM" ]]; then
    LINE_NUM=$(grep -n "^## $CURRENT_DATE$" "$JOURNAL_FILE" | cut -d: -f1)
fi

if [[ -n "$LINE_NUM" ]]; then
    nvim "+${LINE_NUM}" "$JOURNAL_FILE"
else
    nvim "$JOURNAL_FILE"
fi
```

I won't be switching all my journaling to this digital form (in fact, I just bought another couple _Some Lines A Day_ journals for myself and others), but I want to start a daily journal like this for work. For work notes, I only use digital storage; I can share them with colleagues and basically everything I do for work happens digitally.

## Memory

In the game, your vampire holds five "Memories," which each have room for three "Experiences."

> Memories and Experiences are important moments that have shaped your vampire, crystallized in writing. They make up the core of the vampire’s self—the things they know and care about. An Experience is a particular event; a Memory is an arc of Experiences that are tied together by subject or theme.

I actually love this idea of constrained context. It feels like a great exercise to refocus on a structured narrative, to guide yourself into the shape you want to take. I haven't figured out how to adopt this secondary structure into this program, yet.
