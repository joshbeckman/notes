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

Last updated: 2024-11-25

## Top Played Tracks
This is a list of the top played tracks in my library.

| Artist | Album | Track | Play Count |
| ------ | ----- | ----- | ---------- |
| Duster | Stratosphere | Gold Dust | 93 |
| Peter Broderick | How They Are | Pulling the Rain | 92 |
| Still Woozy | Lucy (feat. Odie) - Single | Lucy (feat. Odie) | 90 |
| Sufjan Stevens | Greetings from Michigan - The Great Lake State (Deluxe Version) | Redford (For Yia-Yia and Pappou) | 87 |
| Reptile Youth | Away - EP | Arab Spring Break, Pt. 2 | 86 |
| Jamie xx | In Colour | Gosh | 86 |
| Sylvan Esso | Sylvan Esso | Come Down | 81 |
| Peter Broderick | Partners | In a Landscape | 81 |
|  | Her OST | Song On The Beach | 78 |
| Peter Broderick | How They Are | Guilt's Tune | 76 |

## Top Played Albums
This is a list of the top played albums in my library (by ratio of song plays to songs in the album).

| Artist | Album | Song Play Ratio |
| ------ | ----- | --------------- |
| Shane Carruth | Upstream Color (Original Motion Picture Score) | 51 |
| Peter Broderick | Partners | 40 |
| Peter Broderick | How They Are | 37 |
| Sylvan Esso | Sylvan Esso | 36 |
| Max Richter | Black Mirror: Nosedive (Music from the Original TV Series) | 36 |
| Daniel Caesar | Freudian | 36 |
| Peter Broderick | Float 2013 | 34 |
| Andy Shauf | The Party | 34 |
| Oddisee | The Beauty In All | 32 |
| Girl Talk | Feed The Animals | 32 |

## Top Played Artists
This is a list of the top played artists in my library (by song plays).

| Artist | Song Play Count | Song Play Ratio |
| ------ | -------------- | --------------- |
| Oddisee | 1083 | 8 |
| Four Tet | 1055 | 9 |
| Peter Broderick | 927 | 33 |
| Sylvan Esso | 887 | 13 |
| Caribou | 872 | 8 |
| Nils Frahm | 859 | 8 |
| Shane Carruth | 765 | 51 |
| José González | 762 | 10 |
| KAYTRANADA | 716 | 12 |
| Alvvays | 647 | 20 |

## Recently Played Albums
This is a list of the albums I've played recently.

| Artist | Album | Date Added |
| ------ | ----- | --------- |
| PawPaw Rod | Doobie Mouth (An EP From PawPaw Rod) | 2024-10-31 |
| Fat Dog | WOOF. | 2024-04-26 |
| Fat Dog | Peace Song - Single | 2024-11-22 |
| Souls of Mischief | Hiero Oldies, Vol. 1 | 2024-07-12 |
| Still Woozy | Cooks - Single | 2018-04-30 |
| Still Woozy | Lucy (feat. Odie) - Single | 2018-04-28 |
| Doja Cat | Scarlet 2 CLAUDE | 2024-05-23 |
| PawPaw Rod | HIT EM WHERE IT HURTS - Single | 2024-10-31 |
| Major Lazer | Guns Don't Kill People... Lazers Do (15th Anniversary Edition) | 2024-11-22 |
| Tyler, The Creator | CHROMAKOPIA | 2024-10-31 |

## Recently Loved Albums
This is a list of the albums I've loved recently.

| Artist | Album | Date Added |
| ------ | ----- | --------- |
| Major Lazer | Guns Don't Kill People... Lazers Do (15th Anniversary Edition) | 2024-11-22 |
| Simian Mobile Disco | Attack Sustain Decay Release | 2024-11-07 |
| Madonna | The Immaculate Collection | 2024-11-04 |
| Dwayne Jensen | The Warehouse Project: Sofia Kourtesis, Manchester (DJ Mix) | 2024-10-31 |
| PawPaw Rod | HIT EM WHERE IT HURTS - Single | 2024-10-31 |
| Underworld | Strawberry Hotel | 2024-10-25 |
| The Blessed Madonna | Godspeed | 2024-10-18 |
| Confidence Man | 3AM (LA LA LA) | 2024-10-18 |
| Kelly Lee Owens | Dreamstate | 2024-10-18 |
| Raffertie | The Substance (Original Motion Picture Score) - Single | 2024-10-06 |

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
