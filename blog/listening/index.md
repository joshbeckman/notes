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

Last updated: 2025-07-09

## Top Played Tracks
This is a list of the top played tracks in my library.

| Artist | Album | Track | Play Count | Listening Time |
| ------ | ----- | ----- | ---------- | -------------- |
| Duster | ![Duster - Stratosphere](/assets/images/album_art/duster-stratosphere.jpg) | Gold Dust | 93 | 3h 15m 11s |
| Peter Broderick | ![Peter Broderick - How They Are](/assets/images/album_art/peterbroderick-howtheyare.jpg) | Pulling the Rain | 92 | 8h 23m 21s |
| Still Woozy | ![Still Woozy - Lucy (feat. Odie) - Single](/assets/images/album_art/stillwoozy-lucyfeatodiesingle.jpg) | Lucy (feat. Odie) | 90 | 3h 33m 45s |
| Jamie xx | ![Jamie xx - In Colour](/assets/images/album_art/jamiexx-incolour.jpg) | Gosh | 87 | 7h 1m 54s |
| Sufjan Stevens | ![Sufjan Stevens - Greetings from Michigan - The Great Lake State (Deluxe Version)](/assets/images/album_art/sufjanstevens-greetingsfrommichiganthegreatlakestatedeluxeversion.jpg) | Redford (For Yia-Yia and Pappou) | 87 | 2h 56m 54s |
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
| ![Peter Broderick - How They Are](/assets/images/album_art/peterbroderick-howtheyare.jpg) | Peter Broderick | How They Are | 37 | 259 |
| ![Sylvan Esso - Sylvan Esso](/assets/images/album_art/sylvanesso-sylvanesso.jpg) | Sylvan Esso | Sylvan Esso | 37 | 365 |
| ![Daniel Caesar - Freudian](/assets/images/album_art/danielcaesar-freudian.jpg) | Daniel Caesar | Freudian | 36 | 364 |
| ![Max Richter - Black Mirror: Nosedive (Music from the Original TV Series)](/assets/images/album_art/maxrichter-blackmirrornosedivemusicfromtheoriginaltvseries.jpg) | Max Richter | Black Mirror: Nosedive (Music from the Original TV Series) | 36 | 249 |
| ![Ahmad Jamal Trio - Ahmad Jamal At The Pershing: But Not for Me](/assets/images/album_art/ahmadjamaltrio-ahmadjamalatthepershingbutnotforme.jpg) | Ahmad Jamal Trio | Ahmad Jamal At The Pershing: But Not for Me | 35 | 276 |
| ![Peter Broderick - Float 2013](/assets/images/album_art/peterbroderick-float2013.jpg) | Peter Broderick | Float 2013 | 34 | 340 |
| ![Andy Shauf - The Party](/assets/images/album_art/andyshauf-theparty.jpg) | Andy Shauf | The Party | 34 | 335 |
| ![Oddisee - The Beauty In All](/assets/images/album_art/oddisee-thebeautyinall.jpg) | Oddisee | The Beauty In All | 32 | 384 |

## Top Played Artists
This is a list of the top played artists in my library (by song plays).

| Artist | Song Play Count | Song Play Ratio |
| ------ | -------------- | --------------- |
| Four Tet | 1141 | 10 |
| Oddisee | 1083 | 8 |
| Caribou | 965 | 9 |
| Peter Broderick | 930 | 32 |
| Sylvan Esso | 896 | 13 |
| Nils Frahm | 860 | 8 |
| José González | 773 | 10 |
| Shane Carruth | 765 | 51 |
| KAYTRANADA | 716 | 12 |
| Still Woozy | 659 | 14 |

## Top Genres
This is a list of the top genres my library (by track count).

| Genre | Track Count | Song Play Count | Total Time |
| ------ | ---------- | -------------- | --------------- |
| Electronic | 4860 | 20408 | 383h 7m 31s |
| Alternative | 4543 | 18510 | 286h 37m 53s |
| Dance | 3089 | 8185 | 192h 19m 14s |
| Hip-Hop/Rap | 2629 | 7846 | 144h 3m 32s |
| Rock | 1596 | 4006 | 109h 25m 29s |
| Pop | 1310 | 4580 | 85h 49m 51s |
| Soundtrack | 1053 | 3465 | 55h 15m 0s |
| R&B/Soul | 961 | 3154 | 58h 33m 53s |
| Classical | 869 | 2562 | 62h 41m 50s |
| Jazz | 839 | 3511 | 80h 26m 46s |

## Recently Played Albums
This is a list of the albums I've played recently.

| Art | Artist | Album | Date Added |
| --- | ------ | ----- | --------- |
|  | Four Tet | Four Tet | @KioskRadio x @TheLotRadio at @HorstArtsAndMusicFestival  2025 | 2025-05-09 |
| ![Gelli Haha - Switcheroo](/assets/images/album_art/gellihaha-switcheroo.jpg) | Gelli Haha | Switcheroo | 2025-06-27 |
|  | Boiler Room | Mall Grab | Boiler Room: Melbourne | 2023-03-28 |
| ![Sunday Cruise - Art of Losing My Reflection](/assets/images/album_art/sundaycruise-artoflosingmyreflection.jpg) | Sunday Cruise | Art of Losing My Reflection | 2025-05-10 |
| ![Anthony Naples - Scanners](/assets/images/album_art/anthonynaples-scanners.jpg) | Anthony Naples | Scanners | 2025-05-06 |
|  | AK | Early Hours (DJ Mix) | 2025-06-13 |
| ![FKA twigs - EUSEXUA](/assets/images/album_art/fkatwigs-eusexua.jpg) | FKA twigs | EUSEXUA | 2025-01-24 |
| ![Ela Minus - DÍA](/assets/images/album_art/elaminus-da.jpg) | Ela Minus | DÍA | 2025-01-29 |
| ![HAIM - I quit](/assets/images/album_art/haim-iquit.jpg) | HAIM | I quit | 2025-06-20 |
| ![Dayglow - Dayglow (Superbloom)](/assets/images/album_art/dayglow-dayglowsuperbloom.jpg) | Dayglow | Dayglow (Superbloom) | 2025-06-29 |

## Recently Loved Albums
This is a list of the albums I've loved recently.

| Art | Artist | Album | Date Added |
| ------ | ----- | --------- |
| ![Young Fathers - 28 Years Later (Original Motion Picture Soundtrack)](/assets/images/album_art/youngfathers-28yearslateroriginalmotionpicturesoundtrack.jpg) | Young Fathers | 28 Years Later (Original Motion Picture Soundtrack) | 2025-06-30 |
| ![Gelli Haha - Switcheroo](/assets/images/album_art/gellihaha-switcheroo.jpg) | Gelli Haha | Switcheroo | 2025-06-27 |
| ![Black Moth Super Rainbow - Soft New Magic Dream](/assets/images/album_art/blackmothsuperrainbow-softnewmagicdream.jpg) | Black Moth Super Rainbow | Soft New Magic Dream | 2025-06-07 |
| ![Death In Vegas - Death Mask](/assets/images/album_art/deathinvegas-deathmask.jpg) | Death In Vegas | Death Mask | 2025-06-07 |
| ![Marcus Marr - Familiar Five - EP](/assets/images/album_art/marcusmarr-familiarfiveep.jpg) | Marcus Marr | Familiar Five - EP | 2025-06-05 |
| ![Sunday Cruise - Art of Losing My Reflection](/assets/images/album_art/sundaycruise-artoflosingmyreflection.jpg) | Sunday Cruise | Art of Losing My Reflection | 2025-05-10 |
| ![Poison Girl Friend - Melting Moment](/assets/images/album_art/poisongirlfriend-meltingmoment.jpg) | Poison Girl Friend | Melting Moment | 2025-05-04 |
| ![DJ Koze - Music Can Hear Us](/assets/images/album_art/djkoze-musiccanhearus.jpg) | DJ Koze | Music Can Hear Us | 2025-04-03 |
| ![Kassian - Channels](/assets/images/album_art/kassian-channels.jpg) | Kassian | Channels | 2025-03-30 |
| ![Parcels - Live Vol. 2](/assets/images/album_art/parcels-livevol2.jpg) | Parcels | Live Vol. 2 | 2025-03-14 |
