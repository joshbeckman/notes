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

Last updated: 2024-12-15

## Top Played Tracks
This is a list of the top played tracks in my library.

| Artist | Album | Track | Play Count | Listening Time |
| ------ | ----- | ----- | ---------- | -------------- |
| Duster | Stratosphere | Gold Dust | 93 | 3h 15m 11s |
| Peter Broderick | How They Are | Pulling the Rain | 92 | 8h 23m 21s |
| Still Woozy | Lucy (feat. Odie) - Single | Lucy (feat. Odie) | 90 | 3h 33m 45s |
| Jamie xx | In Colour | Gosh | 87 | 7h 1m 54s |
| Sufjan Stevens | Greetings from Michigan - The Great Lake State (Deluxe Version) | Redford (For Yia-Yia and Pappou) | 87 | 2h 56m 54s |
| Reptile Youth | Away - EP | Arab Spring Break, Pt. 2 | 86 | 7h 22m 48s |
| Sylvan Esso | Sylvan Esso | Come Down | 81 | 3h 59m 2s |
| Peter Broderick | Partners | In a Landscape | 81 | 14h 4m 46s |
|  | Her OST | Song On The Beach | 78 | 4h 36m 29s |
|  | Her OST | Photograph | 76 | 3h 8m 48s |

## Top Played Albums
This is a list of the top played albums in my library (by ratio of song plays to songs in the album).

| Artist | Album | Song Play Ratio | Play Count
| ------ | ----- | --------------- | --------- |
| Shane Carruth | Upstream Color (Original Motion Picture Score) | 51 | 765 |
| Peter Broderick | Partners | 40 | 317 |
| Peter Broderick | How They Are | 37 | 259 |
| Daniel Caesar | Freudian | 36 | 364 |
| Sylvan Esso | Sylvan Esso | 36 | 356 |
| Max Richter | Black Mirror: Nosedive (Music from the Original TV Series) | 36 | 249 |
| Peter Broderick | Float 2013 | 34 | 340 |
| Andy Shauf | The Party | 34 | 335 |
| Ahmad Jamal Trio | Ahmad Jamal At The Pershing: But Not for Me | 33 | 260 |
| Oddisee | The Beauty In All | 32 | 384 |

## Top Played Artists
This is a list of the top played artists in my library (by song plays).

| Artist | Song Play Count | Song Play Ratio |
| ------ | -------------- | --------------- |
| Oddisee | 1083 | 8 |
| Four Tet | 1055 | 9 |
| Peter Broderick | 928 | 33 |
| Sylvan Esso | 887 | 13 |
| Caribou | 885 | 8 |
| Nils Frahm | 860 | 8 |
| Shane Carruth | 765 | 51 |
| José González | 762 | 10 |
| KAYTRANADA | 716 | 12 |
| Still Woozy | 648 | 14 |

## Top Genres
This is a list of the top genres my library (by track count).

| Genre | Track Count | Song Play Count | Total Time |
| ------ | ---------- | -------------- | --------------- |
| Electronic | 4613 | 18908 | 361h 9m 28s |
| Alternative | 4280 | 17709 | 271h 13m 1s |
| Dance | 2974 | 7696 | 184h 23m 4s |
| Hip-Hop/Rap | 2540 | 7606 | 139h 37m 25s |
| Rock | 1588 | 3979 | 109h 9m 50s |
| Pop | 1269 | 4431 | 88h 38m 8s |
| Soundtrack | 1026 | 3424 | 53h 49m 18s |
| R&B/Soul | 897 | 3082 | 55h 19m 30s |
| Classical | 885 | 2514 | 63h 46m 48s |
| Jazz | 822 | 3319 | 74h 17m 26s |

## Recently Played Albums
This is a list of the albums I've played recently.

| Artist | Album | Date Added |
| ------ | ----- | --------- |
|  |  | 2013-04-23 |
| Bicep | In Waves Radio Presents: The Floor with Jamie xx b2b Caribou, Ep. 1 (DJ Mix) | 2024-12-13 |
| Charli xcx | BRAT | 2024-06-07 |
| Kelly Lee Owens | Dreamstate | 2024-10-18 |
| Mark Barrott | Everything Changes, Nothing Ends | 2024-12-10 |
| Nilüfer Yanya | PAINLESS (Deluxe Edition) | 2022-12-19 |
| Hana Vu | Romanticism | 2024-05-13 |
| True Cuckoo | Non Binary Code | 2024-05-03 |
| Father John Misty | Mahashmashana | 2024-11-22 |
| Major Lazer | Guns Don't Kill People... Lazers Do (15th Anniversary Edition) | 2024-11-22 |

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
