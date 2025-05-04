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

Last updated: 2025-05-04

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
| Peter Broderick | ![Peter Broderick - How They Are](/assets/images/album_art/peterbroderick-howtheyare.jpg) | Guilt's Tune | 76 | 5h 39m 3s |

## Top Played Albums
This is a list of the top played albums in my library (by ratio of song plays to songs in the album).

| Art | Artist | Album | Song Play Ratio | Play Count
| --- | ------ | ----- | --------------- | --------- |
| ![Shane Carruth - Upstream Color (Original Motion Picture Score)](/assets/images/album_art/shanecarruth-upstreamcolororiginalmotionpicturescore.jpg) | Shane Carruth | Upstream Color (Original Motion Picture Score) | 51 | 765 |
| ![Peter Broderick - Partners](/assets/images/album_art/peterbroderick-partners.jpg) | Peter Broderick | Partners | 40 | 319 |
| ![Peter Broderick - How They Are](/assets/images/album_art/peterbroderick-howtheyare.jpg) | Peter Broderick | How They Are | 37 | 259 |
| ![Daniel Caesar - Freudian](/assets/images/album_art/danielcaesar-freudian.jpg) | Daniel Caesar | Freudian | 36 | 364 |
| ![Sylvan Esso - Sylvan Esso](/assets/images/album_art/sylvanesso-sylvanesso.jpg) | Sylvan Esso | Sylvan Esso | 36 | 364 |
| ![Max Richter - Black Mirror: Nosedive (Music from the Original TV Series)](/assets/images/album_art/maxrichter-blackmirrornosedivemusicfromtheoriginaltvseries.jpg) | Max Richter | Black Mirror: Nosedive (Music from the Original TV Series) | 36 | 249 |
| ![Ahmad Jamal Trio - Ahmad Jamal At The Pershing: But Not for Me](/assets/images/album_art/ahmadjamaltrio-ahmadjamalatthepershingbutnotforme.jpg) | Ahmad Jamal Trio | Ahmad Jamal At The Pershing: But Not for Me | 35 | 276 |
| ![Peter Broderick - Float 2013](/assets/images/album_art/peterbroderick-float2013.jpg) | Peter Broderick | Float 2013 | 34 | 340 |
| ![Andy Shauf - The Party](/assets/images/album_art/andyshauf-theparty.jpg) | Andy Shauf | The Party | 34 | 335 |
| ![Oddisee - The Beauty In All](/assets/images/album_art/oddisee-thebeautyinall.jpg) | Oddisee | The Beauty In All | 32 | 384 |

## Top Played Artists
This is a list of the top played artists in my library (by song plays).

| Artist | Song Play Count | Song Play Ratio |
| ------ | -------------- | --------------- |
| Four Tet | 1102 | 9 |
| Oddisee | 1083 | 8 |
| Caribou | 945 | 8 |
| Peter Broderick | 930 | 33 |
| Sylvan Esso | 895 | 13 |
| Nils Frahm | 860 | 8 |
| José González | 772 | 10 |
| Shane Carruth | 765 | 51 |
| KAYTRANADA | 716 | 12 |
| Still Woozy | 659 | 14 |

## Top Genres
This is a list of the top genres my library (by track count).

| Genre | Track Count | Song Play Count | Total Time |
| ------ | ---------- | -------------- | --------------- |
| Electronic | 4797 | 20073 | 372h 49m 18s |
| Alternative | 4448 | 18318 | 281h 12m 44s |
| Dance | 3027 | 7981 | 189h 4m 59s |
| Hip-Hop/Rap | 2605 | 7773 | 142h 36m 41s |
| Rock | 1571 | 3968 | 107h 58m 26s |
| Pop | 1286 | 4516 | 84h 32m 16s |
| Soundtrack | 1024 | 3463 | 53h 40m 37s |
| R&B/Soul | 948 | 3153 | 57h 50m 29s |
| Classical | 871 | 2556 | 62h 46m 14s |
| Jazz | 833 | 3477 | 79h 56m 31s |

## Recently Played Albums
This is a list of the albums I've played recently.

| Art | Artist | Album | Date Added |
| --- | ------ | ----- | --------- |
| ![Parcels - Live Vol. 2](/assets/images/album_art/parcels-livevol2.jpg) | Parcels | Live Vol. 2 | 2025-03-14 |
| ![Gloorp - Gloorp 'Em Up](/assets/images/album_art/gloorp-gloorpemup.jpg) | Gloorp | Gloorp 'Em Up | 2025-04-30 |
| ![Rival Consoles - Coda - Single](/assets/images/album_art/rivalconsoles-codasingle.jpg) | Rival Consoles | Coda - Single | 2023-06-13 |
| ![Rival Consoles - Now Is](/assets/images/album_art/rivalconsoles-nowis.jpg) | Rival Consoles | Now Is | 2022-11-17 |
| ![Rival Consoles - Articulation](/assets/images/album_art/rivalconsoles-articulation.jpg) | Rival Consoles | Articulation | 2020-09-04 |
| ![Rival Consoles - Persona](/assets/images/album_art/rivalconsoles-persona.jpg) | Rival Consoles | Persona | 2020-02-07 |
| ![Rival Consoles - Odyssey / Sonne](/assets/images/album_art/rivalconsoles-odysseysonne.jpg) | Rival Consoles | Odyssey / Sonne | 2021-04-02 |
| ![Rival Consoles - Howl](/assets/images/album_art/rivalconsoles-howl.jpg) | Rival Consoles | Howl | 2021-04-09 |
|  | VIAL | Grow The F**k Up | 2025-05-01 |
| ![Chappell Roan - The Rise and Fall of a Midwest Princess](/assets/images/album_art/chappellroan-theriseandfallofamidwestprincess.jpg) | Chappell Roan | The Rise and Fall of a Midwest Princess | 2023-10-11 |

## Recently Loved Albums
This is a list of the albums I've loved recently.

| Art | Artist | Album | Date Added |
| ------ | ----- | --------- |
| ![DJ Koze - Music Can Hear Us](/assets/images/album_art/djkoze-musiccanhearus.jpg) | DJ Koze | Music Can Hear Us | 2025-04-03 |
| ![Kassian - Channels](/assets/images/album_art/kassian-channels.jpg) | Kassian | Channels | 2025-03-30 |
| ![Parcels - Live Vol. 2](/assets/images/album_art/parcels-livevol2.jpg) | Parcels | Live Vol. 2 | 2025-03-14 |
| ![Kilbourne - If Not to Give a Fantasy](/assets/images/album_art/kilbourne-ifnottogiveafantasy.jpg) | Kilbourne | If Not to Give a Fantasy | 2025-03-10 |
| ![Marie Davidson - City Of Clowns](/assets/images/album_art/mariedavidson-cityofclowns.jpg) | Marie Davidson | City Of Clowns | 2025-03-01 |
| ![The Egyptian Lover - King of Ecstasy (His Greatest Hits Album)](/assets/images/album_art/theegyptianlover-kingofecstasyhisgreatesthitsalbum.jpg) | The Egyptian Lover | King of Ecstasy (His Greatest Hits Album) | 2025-02-23 |
| ![Barry Can't Swim - When Will We Land?](/assets/images/album_art/barrycantswim-whenwillweland.jpg) | Barry Can't Swim | When Will We Land? | 2025-02-20 |
| ![Yelle - Pop-Up (Extended Version)](/assets/images/album_art/yelle-popupextendedversion.jpg) | Yelle | Pop-Up (Extended Version) | 2025-02-18 |
| ![Maribou State - Hallucinating Love](/assets/images/album_art/mariboustate-hallucinatinglove.jpg) | Maribou State | Hallucinating Love | 2025-02-07 |
| ![Mas Ysa - Seraph](/assets/images/album_art/masysa-seraph.jpg) | Mas Ysa | Seraph | 2025-02-02 |
