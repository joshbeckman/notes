---
layout: Page
title: Music Listening
toc: true
emoji: 🎶
searchable: true
categories:
- blog
tags:
- music
- index
redirect_from:
- /music
---
Albums that moved me enough to write about them.

{% assign postsByMonth = site.categories['listening'] | group_by_exp:"post", "post.date | date: '%Y'" %}
{% for day in postsByMonth %}
  <table>
      <thead>
        <tr>
            <td colspan="3">
                <span id="{{ day.name }}">{{ day.name }}</span>
            </td>
        </tr>
      </thead>
  {% for post in day.items %}
  {%- include PostTableRow.html post=post -%}
  {% endfor %}
  </table>
{% endfor %}

## Listening Stats
I generate this page from my Apple Music library using [a script I wrote](/blog/pulling-fun-insights-out-of-my-apple-music-library). Feel free to use it, too!

Last updated: 2026-07-06

## Recently Played Albums
This is a list of the albums I've played recently.

| Art | Artist | Album |
| --- | ------ | ----- |
| ![Anish Kumar - AK Cuts: Vol. 3 - EP](/assets/images/album_art/anishkumar-akcutsvol3ep.jpg) | Anish Kumar | AK Cuts: Vol. 3 - EP |
| ![Slayyyter - WOR$T GIRL IN AMERICA](/assets/images/album_art/slayyyter-wortgirlinamerica.jpg) | Slayyyter | WOR$T GIRL IN AMERICA |
| ![Gold Panda - TON  UP](/assets/images/album_art/goldpanda-tonup.jpg) | Gold Panda | TON  UP |
| ![DJ Plead - Relentless Trills](/assets/images/album_art/djplead-relentlesstrills.jpg) | DJ Plead | Relentless Trills |
| ![Metronomy - The English Riviera](/assets/images/album_art/metronomy-theenglishriviera.jpg) | Metronomy | The English Riviera |
| ![LinLin - DISCO INFERNO](/assets/images/album_art/linlin-discoinferno.jpg) | LinLin | DISCO INFERNO |
|  | KAYTRANADA | Sunshine Stereo 4.0 World Cup Edition (DJ Mix) |
| ![Talking Heads - The Best of Talking Heads (Remastered)](/assets/images/album_art/talkingheads-thebestoftalkingheadsremastered.jpg) | Talking Heads | The Best of Talking Heads (Remastered) |
| ![Major Lazer - Get Free (feat. Amber Coffman) - Single](/assets/images/album_art/majorlazer-getfreefeatambercoffmansingle.jpg) | Major Lazer | Get Free (feat. Amber Coffman) - Single |

## Recently Loved Albums
This is a list of the albums I've loved recently.

| Art | Artist | Album |
| ------ | ----- | --------- |
| ![Gold Panda - TON  UP](/assets/images/album_art/goldpanda-tonup.jpg) | Gold Panda | TON  UP |
| ![Slayyyter - WOR$T GIRL IN AMERICA](/assets/images/album_art/slayyyter-wortgirlinamerica.jpg) | Slayyyter | WOR$T GIRL IN AMERICA |
|  | Hannah Montana | Pride 2025 (DJ Mix) |
|  | Skrillex & Nitepunk | SOMA |
| ![Air Credits - Breathe Well+](/assets/images/album_art/aircredits-breathewell.jpg) | Air Credits | Breathe Well+ |
| ![Nine Inch Nails & Boys Noize - Nine Inch Noize](/assets/images/album_art/nineinchnailsboysnoize-nineinchnoize.jpg) | Nine Inch Nails & Boys Noize | Nine Inch Noize |
| ![Paul Simon - The Essential Paul Simon](/assets/images/album_art/paulsimon-theessentialpaulsimon.jpg) | Paul Simon | The Essential Paul Simon |
| ![Olof Dreijer - Loud Bloom](/assets/images/album_art/olofdreijer-loudbloom.jpg) | Olof Dreijer | Loud Bloom |
| ![bassvictim - Forever](/assets/images/album_art/bassvictim-forever.jpg) | bassvictim | Forever |
|  | GRiZ & Levity | Pop Off - Single |

## Top Played Tracks
This is a list of the top played tracks in my library.

| Artist | Album | Track | Play Count | Listening Time |
| ------ | ----- | ----- | ---------- | -------------- |
| Duster | ![Duster - Stratosphere](/assets/images/album_art/duster-stratosphere.jpg) | Gold Dust | 94 | 3h 17m 17s |
| Peter Broderick | ![Peter Broderick - How They Are](/assets/images/album_art/peterbroderick-howtheyare.jpg) | Pulling the Rain | 92 | 8h 23m 21s |
| Still Woozy | ![Still Woozy - Lucy (feat. Odie) - Single](/assets/images/album_art/stillwoozy-lucyfeatodiesingle.jpg) | Lucy (feat. Odie) | 90 | 3h 33m 45s |
| Sufjan Stevens | ![Sufjan Stevens - Greetings from Michigan - The Great Lake State (Deluxe Version)](/assets/images/album_art/sufjanstevens-greetingsfrommichiganthegreatlakestatedeluxeversion.jpg) | Redford (For Yia-Yia and Pappou) | 87 | 2h 56m 54s |
| Jamie xx | ![Jamie xx - In Colour](/assets/images/album_art/jamiexx-incolour.jpg) | Gosh | 87 | 7h 1m 54s |
| Reptile Youth | ![Reptile Youth - Away - EP](/assets/images/album_art/reptileyouth-awayep.jpg) | Arab Spring Break, Pt. 2 | 86 | 7h 22m 48s |
| Peter Broderick | ![Peter Broderick - Partners](/assets/images/album_art/peterbroderick-partners.jpg) | In a Landscape | 82 | 14h 15m 12s |
| Sylvan Esso | ![Sylvan Esso - Sylvan Esso](/assets/images/album_art/sylvanesso-sylvanesso.jpg) | Come Down | 82 | 4h 1m 59s |
|  | ![ - Her OST](/assets/images/album_art/-herost.jpg) | Song On The Beach | 78 | 4h 36m 29s |
|  | ![ - Her OST](/assets/images/album_art/-herost.jpg) | Photograph | 76 | 3h 8m 48s |

## Top Played Albums
This is a list of the top played albums in my library (by ratio of song plays to songs in the album).

| Art | Artist | Album | Song Play Ratio | Play Count
| --- | ------ | ----- | --------------- | --------- |
| ![Shane Carruth - Upstream Color (Original Motion Picture Score)](/assets/images/album_art/shanecarruth-upstreamcolororiginalmotionpicturescore.jpg) | Shane Carruth | Upstream Color (Original Motion Picture Score) | 51 | 765 |
| ![Peter Broderick - Partners](/assets/images/album_art/peterbroderick-partners.jpg) | Peter Broderick | Partners | 40 | 319 |
| ![Ahmad Jamal Trio - Ahmad Jamal At The Pershing: But Not for Me](/assets/images/album_art/ahmadjamaltrio-ahmadjamalatthepershingbutnotforme.jpg) | Ahmad Jamal Trio | Ahmad Jamal At The Pershing: But Not for Me | 38 | 304 |
| ![Peter Broderick - How They Are](/assets/images/album_art/peterbroderick-howtheyare.jpg) | Peter Broderick | How They Are | 37 | 259 |
| ![Sylvan Esso - Sylvan Esso](/assets/images/album_art/sylvanesso-sylvanesso.jpg) | Sylvan Esso | Sylvan Esso | 37 | 365 |
| ![Daniel Caesar - Freudian](/assets/images/album_art/danielcaesar-freudian.jpg) | Daniel Caesar | Freudian | 36 | 364 |
| ![Max Richter - Black Mirror: Nosedive (Music from the Original TV Series)](/assets/images/album_art/maxrichter-blackmirrornosedivemusicfromtheoriginaltvseries.jpg) | Max Richter | Black Mirror: Nosedive (Music from the Original TV Series) | 36 | 249 |
| ![Peter Broderick - Float 2013](/assets/images/album_art/peterbroderick-float2013.jpg) | Peter Broderick | Float 2013 | 34 | 340 |
| ![Andy Shauf - The Party](/assets/images/album_art/andyshauf-theparty.jpg) | Andy Shauf | The Party | 34 | 335 |
| ![Oddisee - The Beauty In All](/assets/images/album_art/oddisee-thebeautyinall.jpg) | Oddisee | The Beauty In All | 32 | 384 |

## Top Played Artists
This is a list of the top played artists in my library (by song plays).

| Artist | Song Play Count | Song Play Ratio |
| ------ | -------------- | --------------- |
| Four Tet | 1186 | 9 |
| Oddisee | 1083 | 8 |
| KAYTRANADA | 964 | 13 |
| Peter Broderick | 930 | 33 |
| Sylvan Esso | 896 | 13 |
| Caribou | 890 | 9 |
| Nils Frahm | 860 | 8 |
| Jungle | 789 | 13 |
| José González | 773 | 10 |
| Shane Carruth | 765 | 51 |

## Top Genres
This is a list of the top genres my library (by track count).

| Genre | Track Count | Song Play Count | Total Time |
| ------ | ---------- | -------------- | --------------- |
| Electronic | 5397 | 21900 | 422h 52m 31s |
| Alternative | 4894 | 19616 | 308h 10m 16s |
| Dance | 3867 | 10701 | 243h 0m 3s |
| Hip-Hop/Rap | 2775 | 7985 | 150h 28m 47s |
| Rock | 1690 | 4165 | 116h 15m 38s |
| Pop | 1393 | 4804 | 90h 26m 26s |
| Soundtrack | 1074 | 3509 | 56h 19m 53s |
| R&B/Soul | 1001 | 3203 | 60h 50m 29s |
| Classical | 881 | 2877 | 63h 33m 9s |
| Jazz | 870 | 3630 | 82h 57m 27s |
