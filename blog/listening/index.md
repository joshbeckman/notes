---
layout: Page
title: Music Listening
toc: true
emoji: "\U0001F3B6"
searchable: true
categories:
- blog
tags:
- music
- index
redirect_from:
- "/music"
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

Last updated: 2025-09-15

## Recently Played Albums
This is a list of the albums I've played recently.

| Art | Artist | Album |
| --- | ------ | ----- |
| ![Parcels - LOVED](/assets/images/album_art/parcels-loved.jpg) | Parcels | LOVED |
| ![SG Lewis - Anemoia](/assets/images/album_art/sglewis-anemoia.jpg) | SG Lewis | Anemoia |
| ![Hot Chip - Joy In Repetition](/assets/images/album_art/hotchip-joyinrepetition.jpg) | Hot Chip | Joy In Repetition |
| ![Weval - CHOROPHOBIA](/assets/images/album_art/weval-chorophobia.jpg) | Weval | CHOROPHOBIA |
|  | Underworld | Underworld | Boiler Room: London |
| ![Kaitlyn Aurelia Smith - Gush](/assets/images/album_art/kaitlynaureliasmith-gush.jpg) | Kaitlyn Aurelia Smith | Gush |
| ![Daphni - Eleven - Single](/assets/images/album_art/daphni-elevensingle.jpg) | Daphni | Eleven - Single |
| ![Tangerine Dream - Hyperborea (Deluxe Edition)](/assets/images/album_art/tangerinedream-hyperboreadeluxeedition.jpg) | Tangerine Dream | Hyperborea (Deluxe Edition) |
| ![KAYTRANADA - AIN'T NO DAMN WAY!](/assets/images/album_art/kaytranada-aintnodamnway.jpg) | KAYTRANADA | AIN'T NO DAMN WAY! |
| ![Beach Bunny - Emotional Creature](/assets/images/album_art/beachbunny-emotionalcreature.jpg) | Beach Bunny | Emotional Creature |

## Recently Loved Albums
This is a list of the albums I've loved recently.

| Art | Artist | Album |
| ------ | ----- | --------- |
| ![Weval - CHOROPHOBIA](/assets/images/album_art/weval-chorophobia.jpg) | Weval | CHOROPHOBIA |
| ![Tangerine Dream - Hyperborea (Deluxe Edition)](/assets/images/album_art/tangerinedream-hyperboreadeluxeedition.jpg) | Tangerine Dream | Hyperborea (Deluxe Edition) |
| ![UTFO - Hits](/assets/images/album_art/utfo-hits.jpg) | UTFO | Hits |
| ![Kaitlyn Aurelia Smith - Gush](/assets/images/album_art/kaitlynaureliasmith-gush.jpg) | Kaitlyn Aurelia Smith | Gush |
| ![SG Lewis - AudioLust & HigherLove](/assets/images/album_art/sglewis-audiolusthigherlove.jpg) | SG Lewis | AudioLust & HigherLove |
| ![Sofia Kourtesis - Volver - EP](/assets/images/album_art/sofiakourtesis-volverep.jpg) | Sofia Kourtesis | Volver - EP |
| ![Mustard Service - Vice City Magic](/assets/images/album_art/mustardservice-vicecitymagic.jpg) | Mustard Service | Vice City Magic |
| ![Barry Can't Swim - Loner](/assets/images/album_art/barrycantswim-loner.jpg) | Barry Can't Swim | Loner |
| ![Tony Njoku - ALL OUR KNIVES ARE ALWAYS SHARP](/assets/images/album_art/tonynjoku-allourknivesarealwayssharp.jpg) | Tony Njoku | ALL OUR KNIVES ARE ALWAYS SHARP |
| ![Wet Leg - moisturizer](/assets/images/album_art/wetleg-moisturizer.jpg) | Wet Leg | moisturizer |

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
| Peter Broderick | ![Peter Broderick - How They Are](/assets/images/album_art/peterbroderick-howtheyare.jpg) | Guilt's Tune | 76 | 5h 39m 3s |

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
| Four Tet | 1142 | 10 |
| Oddisee | 1083 | 8 |
| Caribou | 969 | 9 |
| Peter Broderick | 930 | 33 |
| Sylvan Esso | 896 | 13 |
| KAYTRANADA | 866 | 12 |
| Nils Frahm | 860 | 8 |
| José González | 773 | 10 |
| Shane Carruth | 765 | 51 |
| Beach Bunny | 661 | 17 |

## Top Genres
This is a list of the top genres my library (by track count).

| Genre | Track Count | Song Play Count | Total Time |
| ------ | ---------- | -------------- | --------------- |
| Electronic | 4978 | 21010 | 393h 33m 5s |
| Alternative | 4612 | 18846 | 291h 1m 47s |
| Dance | 3050 | 8300 | 190h 12m 23s |
| Hip-Hop/Rap | 2650 | 7856 | 145h 21m 10s |
| Rock | 1590 | 4046 | 109h 2m 2s |
| Pop | 1322 | 4664 | 86h 19m 7s |
| Soundtrack | 1064 | 3478 | 55h 56m 3s |
| R&B/Soul | 975 | 3181 | 59h 14m 15s |
| Classical | 864 | 2563 | 62h 23m 39s |
| Jazz | 849 | 3554 | 81h 7m 21s |
