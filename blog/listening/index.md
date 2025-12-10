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
serial_number: 2024.PAE.009
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

Last updated: 2025-12-10

## Recently Played Albums
This is a list of the albums I've played recently.

| Art | Artist | Album |
| --- | ------ | ----- |
| ![Gelli Haha - Switcheroo](/assets/images/album_art/gellihaha-switcheroo.jpg) | Gelli Haha | Switcheroo |
| ![Rival Consoles - Landscape from Memory](/assets/images/album_art/rivalconsoles-landscapefrommemory.jpg) | Rival Consoles | Landscape from Memory |
| ![Mustard Service - Vice City Magic](/assets/images/album_art/mustardservice-vicecitymagic.jpg) | Mustard Service | Vice City Magic |
| ![Alice Sara Ott - John Field: Complete Nocturnes](/assets/images/album_art/alicesaraott-johnfieldcompletenocturnes.jpg) | Alice Sara Ott | John Field: Complete Nocturnes |
|  | Fred again.., Scott Hardkiss & The Japanese House | Live from Lyon, France, Oct 24, 2025 (DJ Mix) |
| ![Kelly Lee Owens - KELLY - EP](/assets/images/album_art/kellyleeowens-kellyep.jpg) | Kelly Lee Owens | KELLY - EP |
| ![Vince Guaraldi Trio - A Charlie Brown Christmas (Original 1965 TV Soundtrack) [Expanded Edition]](/assets/images/album_art/vinceguaralditrio-acharliebrownchristmasoriginal1965tvsoundtrackexpandededition.jpg) | Vince Guaraldi Trio | A Charlie Brown Christmas (Original 1965 TV Soundtrack) [Expanded Edition] |
|  | Jai Paul | Live from Toronto, Canada, Nov 14, 2025 (DJ Mix) |
| ![Slow Mass - Low on Foot](/assets/images/album_art/slowmass-lowonfoot.jpg) | Slow Mass | Low on Foot |
| ![Slow Mass - On Watch](/assets/images/album_art/slowmass-onwatch.jpg) | Slow Mass | On Watch |

## Recently Loved Albums
This is a list of the albums I've loved recently.

| Art | Artist | Album |
| ------ | ----- | --------- |
| ![Alice Sara Ott - John Field: Complete Nocturnes](/assets/images/album_art/alicesaraott-johnfieldcompletenocturnes.jpg) | Alice Sara Ott | John Field: Complete Nocturnes |
|  | Four Tet & Burial | Live from Toronto, Canada, Nov 14, 2025 (DJ Mix) |
| ![Juana Molina - DOGA](/assets/images/album_art/juanamolina-doga.jpg) | Juana Molina | DOGA |
| ![Austra - Chin up Buttercup](/assets/images/album_art/austra-chinupbuttercup.jpg) | Austra | Chin up Buttercup |
| ![Robyn - Dopamine - Single](/assets/images/album_art/robyn-dopaminesingle.jpg) | Robyn | Dopamine - Single |
|  | Fred again.., Scott Hardkiss & The Japanese House | Live from Lyon, France, Oct 24, 2025 (DJ Mix) |
| ![Jane Inc. - A RUPTURE A CANYON A BIRTH](/assets/images/album_art/janeinc-aruptureacanyonabirth.jpg) | Jane Inc. | A RUPTURE A CANYON A BIRTH |
| ![Tame Impala - Deadbeat](/assets/images/album_art/tameimpala-deadbeat.jpg) | Tame Impala | Deadbeat |
|  | Bicep | Lane 8 Fall 2025 Mixtape (DJ Mix) |
| ![Leon Vynehall - In Daytona Yellow](/assets/images/album_art/leonvynehall-indaytonayellow.jpg) | Leon Vynehall | In Daytona Yellow |

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
| Sylvan Esso | ![Sylvan Esso - Sylvan Esso](/assets/images/album_art/sylvanesso-sylvanesso.jpg) | Come Down | 82 | 4h 1m 59s |
| Peter Broderick | ![Peter Broderick - Partners](/assets/images/album_art/peterbroderick-partners.jpg) | In a Landscape | 82 | 14h 15m 12s |
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
| Four Tet | 1163 | 9 |
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
| Electronic | 5147 | 20997 | 405h 26m 54s |
| Alternative | 4703 | 19250 | 296h 31m 36s |
| Dance | 3371 | 9469 | 213h 22m 52s |
| Hip-Hop/Rap | 2638 | 7891 | 144h 51m 0s |
| Rock | 1621 | 4096 | 111h 14m 48s |
| Pop | 1328 | 4704 | 86h 45m 11s |
| Soundtrack | 1075 | 3474 | 56h 25m 6s |
| R&B/Soul | 979 | 3191 | 59h 38m 15s |
| Classical | 882 | 2711 | 63h 39m 41s |
| Jazz | 847 | 3583 | 80h 56m 39s |
