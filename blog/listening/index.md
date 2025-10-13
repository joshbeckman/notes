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

Last updated: 2025-10-12

## Recently Played Albums
This is a list of the albums I've played recently.

| Art | Artist | Album |
| --- | ------ | ----- |
|  | Andhim | Lane 8 Fall 2025 Mixtape (DJ Mix) |
| ![Daphni - Josephine - EP](/assets/images/album_art/daphni-josephineep.jpg) | Daphni | Josephine - EP |
| ![Kelly Moran - Don't Trust Mirrors](/assets/images/album_art/kellymoran-donttrustmirrors.jpg) | Kelly Moran | Don't Trust Mirrors |
| ![BADBADNOTGOOD - Mid Spiral](/assets/images/album_art/badbadnotgood-midspiral.jpg) | BADBADNOTGOOD | Mid Spiral |
| ![Nala Sinephro - Endlessness](/assets/images/album_art/nalasinephro-endlessness.jpg) | Nala Sinephro | Endlessness |
| ![Leon Vynehall - Rare, Forever](/assets/images/album_art/leonvynehall-rareforever.jpg) | Leon Vynehall | Rare, Forever |
| ![Fat Dog - WOOF.](/assets/images/album_art/fatdog-woof.jpg) | Fat Dog | WOOF. |
| ![Floating Points - Cascade](/assets/images/album_art/floatingpoints-cascade.jpg) | Floating Points | Cascade |
| ![Jamie xx - In Waves](/assets/images/album_art/jamiexx-inwaves.jpg) | Jamie xx | In Waves |
| ![Kelly Lee Owens - Dreamstate](/assets/images/album_art/kellyleeowens-dreamstate.jpg) | Kelly Lee Owens | Dreamstate |

## Recently Loved Albums
This is a list of the albums I've loved recently.

| Art | Artist | Album |
| ------ | ----- | --------- |
|  | Bicep | Lane 8 Fall 2025 Mixtape (DJ Mix) |
| ![Geese - Getting Killed](/assets/images/album_art/geese-gettingkilled.jpg) | Geese | Getting Killed |
| ![SG Lewis - Anemoia](/assets/images/album_art/sglewis-anemoia.jpg) | SG Lewis | Anemoia |
| ![Weval - CHOROPHOBIA](/assets/images/album_art/weval-chorophobia.jpg) | Weval | CHOROPHOBIA |
| ![Tangerine Dream - Hyperborea (Deluxe Edition)](/assets/images/album_art/tangerinedream-hyperboreadeluxeedition.jpg) | Tangerine Dream | Hyperborea (Deluxe Edition) |
| ![UTFO - Hits](/assets/images/album_art/utfo-hits.jpg) | UTFO | Hits |
| ![Kaitlyn Aurelia Smith - Gush](/assets/images/album_art/kaitlynaureliasmith-gush.jpg) | Kaitlyn Aurelia Smith | Gush |
| ![SG Lewis - AudioLust & HigherLove](/assets/images/album_art/sglewis-audiolusthigherlove.jpg) | SG Lewis | AudioLust & HigherLove |
| ![Sofia Kourtesis - Volver - EP](/assets/images/album_art/sofiakourtesis-volverep.jpg) | Sofia Kourtesis | Volver - EP |
| ![Mustard Service - Vice City Magic](/assets/images/album_art/mustardservice-vicecitymagic.jpg) | Mustard Service | Vice City Magic |

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
| Four Tet | 1158 | 10 |
| Oddisee | 1083 | 8 |
| Caribou | 947 | 9 |
| Peter Broderick | 930 | 32 |
| Sylvan Esso | 896 | 13 |
| KAYTRANADA | 878 | 12 |
| Nils Frahm | 860 | 8 |
| José González | 773 | 10 |
| Shane Carruth | 765 | 51 |
| Beach Bunny | 661 | 17 |

## Top Genres
This is a list of the top genres my library (by track count).

| Genre | Track Count | Song Play Count | Total Time |
| ------ | ---------- | -------------- | --------------- |
| Electronic | 4985 | 20645 | 394h 25m 45s |
| Alternative | 4613 | 18997 | 291h 4m 54s |
| Dance | 3155 | 8986 | 197h 14m 59s |
| Hip-Hop/Rap | 2638 | 7890 | 144h 42m 51s |
| Rock | 1609 | 4086 | 110h 21m 9s |
| Pop | 1318 | 4674 | 86h 13m 35s |
| Soundtrack | 1065 | 3478 | 55h 59m 1s |
| R&B/Soul | 977 | 3184 | 59h 26m 4s |
| Classical | 864 | 2563 | 62h 23m 39s |
| Jazz | 847 | 3574 | 80h 59m 52s |
