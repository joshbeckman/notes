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

Last updated: 2026-04-19

## Recently Played Albums
This is a list of the albums I've played recently.

| Art | Artist | Album |
| --- | ------ | ----- |
| ![Fcukers - Ö](/assets/images/album_art/fcukers-.jpg) | Fcukers | Ö |
| ![Lane 8 - Brightest Lights](/assets/images/album_art/lane8-brightestlights.jpg) | Lane 8 | Brightest Lights |
|  | Ákos Győrfy | Lane 8 Spring 2026 Mixtape (DJ Mix) |
|  | Alice Coltrane | Daphni Live at FOLD, Nov 22, 2025 (DJ Mix) |
| ![Robyn - Sexistential](/assets/images/album_art/robyn-sexistential.jpg) | Robyn | Sexistential |
| ![TOMORA - COME CLOSER](/assets/images/album_art/tomora-comecloser.jpg) | TOMORA | COME CLOSER |
| ![Joshua Idehen - I know you're hurting, everyone is hurting, everyone is trying, you have got to try](/assets/images/album_art/joshuaidehen-iknowyourehurtingeveryoneishurtingeveryoneistryingyouhavegottotry.jpg) | Joshua Idehen | I know you're hurting, everyone is hurting, everyone is trying, you have got to try |
|  | Daft Punk | Alexandra Palace, London, Feb 27, 2026 (DJ Mix) |
| ![Geese - Getting Killed](/assets/images/album_art/geese-gettingkilled.jpg) | Geese | Getting Killed |
| ![MEG MYERS - Sorry](/assets/images/album_art/megmyers-sorry.jpg) | MEG MYERS | Sorry |

## Recently Loved Albums
This is a list of the albums I've loved recently.

| Art | Artist | Album |
| ------ | ----- | --------- |
|  | Fred again.. & Daft Punk | Alexandra Palace, London, Feb 27, 2026 (DJ Mix) |
|  | Kara-Lis Coverdale | Daphni Live at FOLD, Nov 22, 2025 (DJ Mix) |
| ![Joshua Idehen - I know you're hurting, everyone is hurting, everyone is trying, you have got to try](/assets/images/album_art/joshuaidehen-iknowyourehurtingeveryoneishurtingeveryoneistryingyouhavegottotry.jpg) | Joshua Idehen | I know you're hurting, everyone is hurting, everyone is trying, you have got to try |
| ![TOMORA - COME CLOSER](/assets/images/album_art/tomora-comecloser.jpg) | TOMORA | COME CLOSER |
| ![Pixel Grip - Percepticide: The Death of Reality](/assets/images/album_art/pixelgrip-percepticidethedeathofreality.jpg) | Pixel Grip | Percepticide: The Death of Reality |
|  | Fred again.. & Young Thug | Apple Music Live: Fred again.. (DJ Mix) |
| ![Leon Vynehall - Midnight on Rainbow Road - Single](/assets/images/album_art/leonvynehall-midnightonrainbowroadsingle.jpg) | Leon Vynehall | Midnight on Rainbow Road - Single |
|  | ID | Live at Village Underground, London: Nov 1, 2025 (DJ Mix) |
| ![Daphni - Butterfly](/assets/images/album_art/daphni-butterfly.jpg) | Daphni | Butterfly |
| ![Alice Sara Ott - John Field: Complete Nocturnes](/assets/images/album_art/alicesaraott-johnfieldcompletenocturnes.jpg) | Alice Sara Ott | John Field: Complete Nocturnes |

## Top Played Tracks
This is a list of the top played tracks in my library.

| Artist | Album | Track | Play Count | Listening Time |
| ------ | ----- | ----- | ---------- | -------------- |
| Duster | ![Duster - Stratosphere](/assets/images/album_art/duster-stratosphere.jpg) | Gold Dust | 94 | 3h 17m 17s |
| Peter Broderick | ![Peter Broderick - How They Are](/assets/images/album_art/peterbroderick-howtheyare.jpg) | Pulling the Rain | 92 | 8h 23m 21s |
| Still Woozy | ![Still Woozy - Lucy (feat. Odie) - Single](/assets/images/album_art/stillwoozy-lucyfeatodiesingle.jpg) | Lucy (feat. Odie) | 90 | 3h 33m 45s |
| Jamie xx | ![Jamie xx - In Colour](/assets/images/album_art/jamiexx-incolour.jpg) | Gosh | 87 | 7h 1m 54s |
| Sufjan Stevens | ![Sufjan Stevens - Greetings from Michigan - The Great Lake State (Deluxe Version)](/assets/images/album_art/sufjanstevens-greetingsfrommichiganthegreatlakestatedeluxeversion.jpg) | Redford (For Yia-Yia and Pappou) | 87 | 2h 56m 54s |
| Reptile Youth | ![Reptile Youth - Away - EP](/assets/images/album_art/reptileyouth-awayep.jpg) | Arab Spring Break, Pt. 2 | 86 | 7h 22m 48s |
| Sylvan Esso | ![Sylvan Esso - Sylvan Esso](/assets/images/album_art/sylvanesso-sylvanesso.jpg) | Come Down | 82 | 4h 1m 59s |
| Peter Broderick | ![Peter Broderick - Partners](/assets/images/album_art/peterbroderick-partners.jpg) | In a Landscape | 82 | 14h 15m 12s |
|  | ![ - Her OST](/assets/images/album_art/-herost.jpg) | Song On The Beach | 78 | 4h 36m 29s |
| James Blake | ![James Blake - The Colour in Anything](/assets/images/album_art/jamesblake-thecolourinanything.jpg) | I Need a Forest Fire (feat. Bon Iver) | 76 | 5h 25m 48s |

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
| Four Tet | 1165 | 9 |
| Oddisee | 1083 | 8 |
| KAYTRANADA | 943 | 13 |
| Peter Broderick | 930 | 33 |
| Sylvan Esso | 896 | 13 |
| Caribou | 887 | 9 |
| Nils Frahm | 860 | 8 |
| Jungle | 776 | 13 |
| José González | 773 | 10 |
| Shane Carruth | 765 | 51 |

## Top Genres
This is a list of the top genres my library (by track count).

| Genre | Track Count | Song Play Count | Total Time |
| ------ | ---------- | -------------- | --------------- |
| Electronic | 5277 | 21506 | 415h 12m 4s |
| Alternative | 4894 | 19512 | 308h 8m 19s |
| Dance | 3756 | 10266 | 238h 28m 59s |
| Hip-Hop/Rap | 2768 | 7902 | 150h 47m 54s |
| Rock | 1658 | 4102 | 113h 37m 39s |
| Pop | 1365 | 4749 | 88h 58m 34s |
| Soundtrack | 1072 | 3508 | 56h 13m 30s |
| R&B/Soul | 976 | 3201 | 59h 16m 29s |
| Classical | 881 | 2877 | 63h 33m 9s |
| Jazz | 863 | 3625 | 82h 21m 28s |
