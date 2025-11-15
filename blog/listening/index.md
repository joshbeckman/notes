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

Last updated: 2025-11-15

## Recently Played Albums
This is a list of the albums I've played recently.

| Art | Artist | Album |
| --- | ------ | ----- |
| ![KAYTRANADA - AIN'T NO DAMN WAY!](/assets/images/album_art/kaytranada-aintnodamnway.jpg) | KAYTRANADA | AIN'T NO DAMN WAY! |
|  | The City of Prague Philharmonic Orchestra & Richard Hein | Melancholia (Original Soundtrack) |
|  | TEED | When the Lights Go |
|  | Thelonious Monk | Criss-Cross |
|  | Theodore Shapiro | Music To Refine To: A Remix Companion to Severance |
|  | Theodore Shapiro | Music Of Wellness (From Severance: Season 1 Apple TV+ Original Series Soundtrack) - Single |
|  | Ninajirachi | I Love My Computer |
|  | Shlohmo | REPULSOR |
|  | Whitney | Small Talk |
|  | Khruangbin | The Universe Smiles Upon You ii |

## Recently Loved Albums
This is a list of the albums I've loved recently.

| Art | Artist | Album |
| ------ | ----- | --------- |
|  | Jane Inc. | A RUPTURE A CANYON A BIRTH |
|  | Tame Impala | Deadbeat |
|  | Leon Vynehall | In Daytona Yellow |
|  | Bicep | Lane 8 Fall 2025 Mixtape (DJ Mix) |
| ![Geese - Getting Killed](/assets/images/album_art/geese-gettingkilled.jpg) | Geese | Getting Killed |
| ![SG Lewis - Anemoia](/assets/images/album_art/sglewis-anemoia.jpg) | SG Lewis | Anemoia |
| ![Weval - CHOROPHOBIA](/assets/images/album_art/weval-chorophobia.jpg) | Weval | CHOROPHOBIA |
| ![Tangerine Dream - Hyperborea (Deluxe Edition)](/assets/images/album_art/tangerinedream-hyperboreadeluxeedition.jpg) | Tangerine Dream | Hyperborea (Deluxe Edition) |
| ![UTFO - Hits](/assets/images/album_art/utfo-hits.jpg) | UTFO | Hits |
| ![Kaitlyn Aurelia Smith - Gush](/assets/images/album_art/kaitlynaureliasmith-gush.jpg) | Kaitlyn Aurelia Smith | Gush |

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
| Four Tet | 1162 | 10 |
| Oddisee | 1083 | 8 |
| Peter Broderick | 930 | 33 |
| KAYTRANADA | 919 | 12 |
| Sylvan Esso | 896 | 13 |
| Caribou | 887 | 9 |
| Nils Frahm | 860 | 8 |
| José González | 773 | 10 |
| Shane Carruth | 765 | 51 |
| Beach Bunny | 661 | 17 |

## Top Genres
This is a list of the top genres my library (by track count).

| Genre | Track Count | Song Play Count | Total Time |
| ------ | ---------- | -------------- | --------------- |
| Electronic | 5081 | 20875 | 401h 19m 45s |
| Alternative | 4699 | 19203 | 295h 47m 38s |
| Dance | 3287 | 9222 | 207h 16m 49s |
| Hip-Hop/Rap | 2639 | 7890 | 144h 54m 51s |
| Rock | 1608 | 4090 | 110h 21m 9s |
| Pop | 1328 | 4703 | 86h 43m 27s |
| Soundtrack | 1064 | 3474 | 55h 54m 27s |
| R&B/Soul | 976 | 3185 | 59h 23m 58s |
| Classical | 864 | 2589 | 62h 23m 39s |
| Jazz | 845 | 3583 | 80h 51m 24s |
