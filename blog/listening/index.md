---
layout: Page
title: Music Listening
toc: true
emoji: 🎶
searchable: true
categories:
- blog
- listening
tags:
- music
- index
redirect_from:
- /music
---
I generate this page from my Apple Music library using [a script I wrote](/blog/pulling-fun-insights-out-of-my-apple-music-library). Feel free to use it, too!

Last updated: 2024-09-07

## Top Played Tracks
This is a list of the top played tracks in my library.

| Artist | Album | Track | Play Count |
| ------ | ----- | ----- | ---------- |
| Duster | Stratosphere | Gold Dust | 93 |
| Peter Broderick | How They Are | Pulling the Rain | 92 |
| Still Woozy | Lucy (feat. Odie) - Single | Lucy (feat. Odie) | 89 |
| Sufjan Stevens | Greetings from Michigan - The Great Lake State (Deluxe Version) | Redford (For Yia-Yia and Pappou) | 87 |
| Jamie xx | In Colour | Gosh | 86 |
| Reptile Youth | Away - EP | Arab Spring Break, Pt. 2 | 86 |
| Peter Broderick | Partners | In a Landscape | 81 |
| Sylvan Esso | Sylvan Esso | Come Down | 80 |
|  | Her OST | Song On The Beach | 78 |
| Peter Broderick | How They Are | Guilt's Tune | 76 |

## Top Played Albums
This is a list of the top played albums in my library (by ratio of song plays to songs in the album).

| Artist | Album | Song Play Ratio |
| ------ | ----- | --------------- |
| Shane Carruth | Upstream Color (Original Motion Picture Score) | 51 |
| Peter Broderick | Partners | 40 |
| Peter Broderick | How They Are | 37 |
| Max Richter | Black Mirror: Nosedive (Music from the Original TV Series) | 36 |
| Daniel Caesar | Freudian | 36 |
| Sylvan Esso | Sylvan Esso | 35 |
| Peter Broderick | Float 2013 | 34 |
| Andy Shauf | The Party | 34 |
| Oddisee | The Beauty in All | 32 |
| Girl Talk | Feed The Animals | 32 |

## Top Played Artists
This is a list of the top played artists in my library (by song plays).

| Artist | Song Play Count | Song Play Ratio |
| ------ | -------------- | --------------- |
| Oddisee | 1078 | 8 |
| Four Tet | 1030 | 9 |
| Peter Broderick | 927 | 32 |
| Sylvan Esso | 867 | 13 |
| Nils Frahm | 859 | 8 |
| Caribou | 797 | 7 |
| Shane Carruth | 765 | 51 |
| José González | 762 | 10 |
| KAYTRANADA | 716 | 12 |
| Alvvays | 647 | 20 |

## Recently Played Albums
This is a list of the albums I've played recently.

| Artist | Album | Date Added |
| ------ | ----- | --------- |
| Hana Vu | Romanticism | 2024-05-13 |
| ID | Boiler Room: Overmono in Manchester, Nov 21, 2023 (Live) | 2024-05-13 |
| Bruce Springsteen | Tunnel of Love | 2016-05-20 |
| Dua Lipa | Radical Optimism (Extended) | 2024-07-09 |
| Jamie xx | In Waves | 2024-08-01 |
| Caribou | Our Love (Expanded Edition) | 2016-06-26 |
| Caribou | Honey | 2024-09-05 |
| Caribou | You Can Do It - Single | 2021-08-29 |
| Justice & Tame Impala | Hyperdrama | 2024-04-26 |
| Ross from Friends | Ross From Friends presents Bubble Love | Boiler Room x DGTL Amsterdam 2024 | 2024-05-13 |

## Recently Loved Albums
This is a list of the albums I've loved recently.

| Artist | Album | Date Added |
| ------ | ----- | --------- |
| Fred again.. | ten days | 2024-09-06 |
| The Smiths | The Smiths | 2024-09-01 |
| Oliver Coates | Early Hours (DJ Mix) | 2024-08-29 |
| SBTRKT | OUTSPOKEN - EP | 2024-08-15 |
| Jamie xx | In Waves | 2024-08-01 |
| DJ Shadow | Endtroducing (Deluxe Edition) | 2024-07-15 |
| Souls of Mischief | Hiero Oldies, Vol. 1 | 2024-07-12 |
| Peggy Gou | I Hear You | 2024-07-07 |
| Tourist | Memory Morning | 2024-06-14 |
| Charli xcx | BRAT | 2024-06-07 |

## Reviews

These are albums that moved me enough to write about.

{% assign postsByMonth = 
site.categories['listening'] | group_by_exp:"post", "post.date | date: '%Y'" %}
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
