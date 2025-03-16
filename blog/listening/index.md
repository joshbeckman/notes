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

Last updated: 2025-03-16

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
| Sylvan Esso | ![Sylvan Esso - Sylvan Esso](/assets/images/album_art/sylvanesso-sylvanesso.jpg) | Come Down | 81 | 3h 59m 2s |
| Peter Broderick | ![Peter Broderick - Partners](/assets/images/album_art/peterbroderick-partners.jpg) | In a Landscape | 81 | 14h 4m 46s |
|  | ![ - Her OST](/assets/images/album_art/-herost.jpg) | Song On The Beach | 78 | 4h 36m 29s |
|  | ![ - Her OST](/assets/images/album_art/-herost.jpg) | Photograph | 76 | 3h 8m 48s |

## Top Played Albums
This is a list of the top played albums in my library (by ratio of song plays to songs in the album).

| Art | Artist | Album | Song Play Ratio | Play Count
| --- | ------ | ----- | --------------- | --------- |
| ![Shane Carruth - Upstream Color (Original Motion Picture Score)](/assets/images/album_art/shanecarruth-upstreamcolororiginalmotionpicturescore.jpg) | Shane Carruth | Upstream Color (Original Motion Picture Score) | 51 | 765 |
| ![Peter Broderick - Partners](/assets/images/album_art/peterbroderick-partners.jpg) | Peter Broderick | Partners | 40 | 317 |
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
| Four Tet | 1087 | 9 |
| Oddisee | 1083 | 8 |
| Caribou | 936 | 8 |
| Peter Broderick | 928 | 33 |
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
| Electronic | 4686 | 19485 | 366h 28m 24s |
| Alternative | 4396 | 18182 | 278h 22m 16s |
| Dance | 3038 | 7842 | 189h 13m 13s |
| Hip-Hop/Rap | 2588 | 7744 | 141h 43m 53s |
| Rock | 1583 | 3980 | 108h 53m 35s |
| Pop | 1296 | 4521 | 90h 24m 2s |
| Soundtrack | 1023 | 3463 | 53h 37m 49s |
| R&B/Soul | 945 | 3141 | 57h 40m 29s |
| Classical | 885 | 2552 | 63h 46m 49s |
| Jazz | 824 | 3404 | 74h 17m 29s |

## Recently Played Albums
This is a list of the albums I've played recently.

| Art | Artist | Album | Date Added |
| --- | ------ | ----- | --------- |
| ![Magic City Hippies - Enemies](/assets/images/album_art/magiccityhippies-enemies.jpg) | Magic City Hippies | Enemies | 2025-01-29 |
| ![Panda Bear - Sinister Grift](/assets/images/album_art/pandabear-sinistergrift.jpg) | Panda Bear | Sinister Grift | 2024-10-16 |
|  | Little Simz | Lotus | 2025-02-27 |
| ![Pixel Grip - Arena](/assets/images/album_art/pixelgrip-arena.jpg) | Pixel Grip | Arena | 2022-02-27 |
|  | Caribou | In Waves Radio Presents: The Floor with Jamie xx b2b Caribou, Ep. 1 (DJ Mix) | 2024-12-13 |
| ![Marie Davidson - City Of Clowns](/assets/images/album_art/mariedavidson-cityofclowns.jpg) | Marie Davidson | City Of Clowns | 2025-03-01 |
| ![Kilbourne - If Not to Give a Fantasy](/assets/images/album_art/kilbourne-ifnottogiveafantasy.jpg) | Kilbourne | If Not to Give a Fantasy | 2025-03-10 |
| ![Parcels - Live Vol. 2](/assets/images/album_art/parcels-livevol2.jpg) | Parcels | Live Vol. 2 | 2025-03-14 |
| ![Ela Minus - DÍA](/assets/images/album_art/elaminus-da.jpg) | Ela Minus | DÍA | 2025-01-29 |
| ![Magdalena Bay - Imaginal Disk](/assets/images/album_art/magdalenabay-imaginaldisk.jpg) | Magdalena Bay | Imaginal Disk | 2024-12-19 |

## Recently Loved Albums
This is a list of the albums I've loved recently.

| Art | Artist | Album | Date Added |
| ------ | ----- | --------- |
| ![Parcels - Live Vol. 2](/assets/images/album_art/parcels-livevol2.jpg) | Parcels | Live Vol. 2 | 2025-03-14 |
| ![Kilbourne - If Not to Give a Fantasy](/assets/images/album_art/kilbourne-ifnottogiveafantasy.jpg) | Kilbourne | If Not to Give a Fantasy | 2025-03-10 |
| ![Marie Davidson - City Of Clowns](/assets/images/album_art/mariedavidson-cityofclowns.jpg) | Marie Davidson | City Of Clowns | 2025-03-01 |
| ![The Egyptian Lover - King of Ecstasy (His Greatest Hits Album)](/assets/images/album_art/theegyptianlover-kingofecstasyhisgreatesthitsalbum.jpg) | The Egyptian Lover | King of Ecstasy (His Greatest Hits Album) | 2025-02-23 |
| ![Barry Can't Swim - When Will We Land?](/assets/images/album_art/barrycantswim-whenwillweland.jpg) | Barry Can't Swim | When Will We Land? | 2025-02-20 |
| ![Yelle - Pop-Up (Extended Version)](/assets/images/album_art/yelle-popupextendedversion.jpg) | Yelle | Pop-Up (Extended Version) | 2025-02-18 |
| ![Maribou State - Hallucinating Love](/assets/images/album_art/mariboustate-hallucinatinglove.jpg) | Maribou State | Hallucinating Love | 2025-02-07 |
| ![Mas Ysa - Seraph](/assets/images/album_art/masysa-seraph.jpg) | Mas Ysa | Seraph | 2025-02-02 |
| ![Ela Minus - DÍA](/assets/images/album_art/elaminus-da.jpg) | Ela Minus | DÍA | 2025-01-29 |
| ![Studio - West Coast](/assets/images/album_art/studio-westcoast.jpg) | Studio | West Coast | 2025-01-25 |
