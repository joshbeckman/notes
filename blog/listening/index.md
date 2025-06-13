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

Last updated: 2025-06-12

## Top Played Tracks
This is a list of the top played tracks in my library.

| Artist | Album | Track | Play Count | Listening Time |
| ------ | ----- | ----- | ---------- | -------------- |
| Duster | ![Duster - Stratosphere](/assets/images/album_art/duster-stratosphere.jpg) | Gold Dust | 93 | 3h 15m 11s |
| Peter Broderick | ![Peter Broderick - How They Are](/assets/images/album_art/peterbroderick-howtheyare.jpg) | Pulling the Rain | 92 | 8h 23m 21s |
| Still Woozy | ![Still Woozy - Lucy (feat. Odie) - Single](/assets/images/album_art/stillwoozy-lucyfeatodiesingle.jpg) | Lucy (feat. Odie) | 90 | 3h 33m 45s |
| Sufjan Stevens | ![Sufjan Stevens - Greetings from Michigan - The Great Lake State (Deluxe Version)](/assets/images/album_art/sufjanstevens-greetingsfrommichiganthegreatlakestatedeluxeversion.jpg) | Redford (For Yia-Yia and Pappou) | 87 | 2h 56m 54s |
| Jamie xx | ![Jamie xx - In Colour](/assets/images/album_art/jamiexx-incolour.jpg) | Gosh | 87 | 7h 1m 54s |
| Reptile Youth | ![Reptile Youth - Away - EP](/assets/images/album_art/reptileyouth-awayep.jpg) | Arab Spring Break, Pt. 2 | 86 | 7h 22m 48s |
| Peter Broderick | ![Peter Broderick - Partners](/assets/images/album_art/peterbroderick-partners.jpg) | In a Landscape | 82 | 14h 15m 12s |
| Sylvan Esso | ![Sylvan Esso - Sylvan Esso](/assets/images/album_art/sylvanesso-sylvanesso.jpg) | Come Down | 81 | 3h 59m 2s |
|  | ![ - Her OST](/assets/images/album_art/-herost.jpg) | Song On The Beach | 78 | 4h 36m 29s |
| Nils Frahm | ![Nils Frahm - Spaces (Special Edition)](/assets/images/album_art/nilsfrahm-spacesspecialedition.jpg) | Says | 76 | 10h 30m 48s |

## Top Played Albums
This is a list of the top played albums in my library (by ratio of song plays to songs in the album).

| Art | Artist | Album | Song Play Ratio | Play Count
| --- | ------ | ----- | --------------- | --------- |
| ![Shane Carruth - Upstream Color (Original Motion Picture Score)](/assets/images/album_art/shanecarruth-upstreamcolororiginalmotionpicturescore.jpg) | Shane Carruth | Upstream Color (Original Motion Picture Score) | 51 | 765 |
| ![Peter Broderick - Partners](/assets/images/album_art/peterbroderick-partners.jpg) | Peter Broderick | Partners | 40 | 319 |
| ![Peter Broderick - How They Are](/assets/images/album_art/peterbroderick-howtheyare.jpg) | Peter Broderick | How They Are | 37 | 259 |
| ![Sylvan Esso - Sylvan Esso](/assets/images/album_art/sylvanesso-sylvanesso.jpg) | Sylvan Esso | Sylvan Esso | 36 | 364 |
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
| Four Tet | 1111 | 9 |
| Oddisee | 1083 | 8 |
| Caribou | 940 | 9 |
| Peter Broderick | 930 | 33 |
| Sylvan Esso | 895 | 13 |
| Nils Frahm | 860 | 8 |
| José González | 772 | 10 |
| Shane Carruth | 765 | 51 |
| KAYTRANADA | 716 | 12 |
| Still Woozy | 659 | 15 |

## Top Genres
This is a list of the top genres my library (by track count).

| Genre | Track Count | Song Play Count | Total Time |
| ------ | ---------- | -------------- | --------------- |
| Electronic | 4774 | 20146 | 376h 31m 33s |
| Alternative | 4502 | 18390 | 284h 35m 33s |
| Dance | 3026 | 8088 | 188h 48m 21s |
| Hip-Hop/Rap | 2626 | 7817 | 143h 39m 1s |
| Rock | 1595 | 4001 | 109h 22m 24s |
| Pop | 1310 | 4573 | 85h 47m 21s |
| Soundtrack | 1052 | 3464 | 55h 11m 16s |
| R&B/Soul | 945 | 3154 | 57h 33m 24s |
| Classical | 871 | 2557 | 62h 46m 14s |
| Jazz | 837 | 3504 | 80h 24m 5s |

## Recently Played Albums
This is a list of the albums I've played recently.

| Art | Artist | Album | Date Added |
| --- | ------ | ----- | --------- |
| ![Black Moth Super Rainbow - Soft New Magic Dream](/assets/images/album_art/blackmothsuperrainbow-softnewmagicdream.jpg) | Black Moth Super Rainbow | Soft New Magic Dream | 2025-06-07 |
|  | Arapu | The Warehouse Project: Four Tet in Manchester, Oct 19, 2024 (DJ Mix) | 2025-01-24 |
|  | Four Tet | Four Tet | @KioskRadio x @TheLotRadio at @HorstArtsAndMusicFestival  2025 | 2025-05-09 |
| ![Cole Pulice - Land's End Eternal](/assets/images/album_art/colepulice-landsendeternal.jpg) | Cole Pulice | Land's End Eternal | 2025-05-24 |
| ![Death In Vegas - Death Mask](/assets/images/album_art/deathinvegas-deathmask.jpg) | Death In Vegas | Death Mask | 2025-06-07 |
| ![Underworld - Strawberry Hotel](/assets/images/album_art/underworld-strawberryhotel.jpg) | Underworld | Strawberry Hotel | 2024-10-25 |
| ![Marcus Marr - Familiar Five - EP](/assets/images/album_art/marcusmarr-familiarfiveep.jpg) | Marcus Marr | Familiar Five - EP | 2025-06-05 |
| ![Turnstile - NEVER ENOUGH](/assets/images/album_art/turnstile-neverenough.jpg) | Turnstile | NEVER ENOUGH | 2025-06-06 |
| ![Pavement - Crooked Rain, Crooked Rain](/assets/images/album_art/pavement-crookedraincrookedrain.jpg) | Pavement | Crooked Rain, Crooked Rain | 2025-06-06 |
| ![Anne Müller - Heliopause](/assets/images/album_art/annemller-heliopause.jpg) | Anne Müller | Heliopause | 2021-12-20 |

## Recently Loved Albums
This is a list of the albums I've loved recently.

| Art | Artist | Album | Date Added |
| ------ | ----- | --------- |
| ![Black Moth Super Rainbow - Soft New Magic Dream](/assets/images/album_art/blackmothsuperrainbow-softnewmagicdream.jpg) | Black Moth Super Rainbow | Soft New Magic Dream | 2025-06-07 |
| ![Death In Vegas - Death Mask](/assets/images/album_art/deathinvegas-deathmask.jpg) | Death In Vegas | Death Mask | 2025-06-07 |
| ![Marcus Marr - Familiar Five - EP](/assets/images/album_art/marcusmarr-familiarfiveep.jpg) | Marcus Marr | Familiar Five - EP | 2025-06-05 |
| ![Sunday Cruise - Art of Losing My Reflection](/assets/images/album_art/sundaycruise-artoflosingmyreflection.jpg) | Sunday Cruise | Art of Losing My Reflection | 2025-05-10 |
| ![Poison Girl Friend - Melting Moment](/assets/images/album_art/poisongirlfriend-meltingmoment.jpg) | Poison Girl Friend | Melting Moment | 2025-05-04 |
| ![DJ Koze - Music Can Hear Us](/assets/images/album_art/djkoze-musiccanhearus.jpg) | DJ Koze | Music Can Hear Us | 2025-04-03 |
| ![Kassian - Channels](/assets/images/album_art/kassian-channels.jpg) | Kassian | Channels | 2025-03-30 |
| ![Parcels - Live Vol. 2](/assets/images/album_art/parcels-livevol2.jpg) | Parcels | Live Vol. 2 | 2025-03-14 |
| ![Kilbourne - If Not to Give a Fantasy](/assets/images/album_art/kilbourne-ifnottogiveafantasy.jpg) | Kilbourne | If Not to Give a Fantasy | 2025-03-10 |
| ![Marie Davidson - City Of Clowns](/assets/images/album_art/mariedavidson-cityofclowns.jpg) | Marie Davidson | City Of Clowns | 2025-03-01 |
