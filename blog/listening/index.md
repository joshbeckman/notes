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

Last updated: 2026-08-20

## Recently Played Albums
This is a list of the albums I've played recently.

| Art | Artist | Album |
| --- | ------ | ----- |
| ![Jungle - Sunshine](/assets/images/album_art/jungle-sunshine.jpg) | Jungle | Sunshine |
| ![Jungle - Sunshine Stereo 4.0 World Cup Edition (DJ Mix)](/assets/images/album_art/jungle-sunshinestereo40worldcupeditiondjmix.jpg) | Jungle | Sunshine Stereo 4.0 World Cup Edition (DJ Mix) |
| ![Major Lazer - Get Free (feat. Amber Coffman) - Single](/assets/images/album_art/majorlazer-getfreefeatambercoffmansingle.jpg) | Major Lazer | Get Free (feat. Amber Coffman) - Single |
| ![James Holden - Balance 005 (Mixed by James Holden) [Mixed Version]](/assets/images/album_art/jamesholden-balance005mixedbyjamesholdenmixedversion.jpg) | James Holden | Balance 005 (Mixed by James Holden) [Mixed Version] |
| ![Barry Can't Swim - Loner](/assets/images/album_art/barrycantswim-loner.jpg) | Barry Can't Swim | Loner |
| ![Rival Consoles - Landscape from Memory](/assets/images/album_art/rivalconsoles-landscapefrommemory.jpg) | Rival Consoles | Landscape from Memory |
| ![ex_libris - ex_libris 002 (feat. A Made Up Sound) - EP](/assets/images/album_art/exlibris-exlibris002featamadeupsoundep.jpg) | ex_libris | ex_libris 002 (feat. A Made Up Sound) - EP |
|  | Four Tet | Four Tet Live at Glastonbury Festival 2025 |
| ![Jungle - For Ever](/assets/images/album_art/jungle-forever.jpg) | Jungle | For Ever |
| ![Gelli Haha - Switcheroo](/assets/images/album_art/gellihaha-switcheroo.jpg) | Gelli Haha | Switcheroo |

## Recently Loved Albums
This is a list of the albums I've loved recently.

| Art | Artist | Album |
| ------ | ----- | --------- |
| ![The Avalanches - Since I Left You (20th Anniversary Deluxe Edition)](/assets/images/album_art/theavalanches-sinceileftyou20thanniversarydeluxeedition.jpg) | The Avalanches | Since I Left You (20th Anniversary Deluxe Edition) |
| ![Jungle - Sunshine](/assets/images/album_art/jungle-sunshine.jpg) | Jungle | Sunshine |
| ![Dux Content - Lifestyle](/assets/images/album_art/duxcontent-lifestyle.jpg) | Dux Content | Lifestyle |
| ![Vince Staples - Cry Baby](/assets/images/album_art/vincestaples-crybaby.jpg) | Vince Staples | Cry Baby |
| ![Gold Panda - TON  UP](/assets/images/album_art/goldpanda-tonup.jpg) | Gold Panda | TON  UP |
| ![LinLin - DISCO INFERNO](/assets/images/album_art/linlin-discoinferno.jpg) | LinLin | DISCO INFERNO |
| ![Slayyyter - WOR$T GIRL IN AMERICA](/assets/images/album_art/slayyyter-wortgirlinamerica.jpg) | Slayyyter | WOR$T GIRL IN AMERICA |
|  | Rebecca Black | Pride 2025 (DJ Mix) |
| ![Skrillex - SOMA](/assets/images/album_art/skrillex-soma.jpg) | Skrillex | SOMA |
| ![Air Credits - Breathe Well+](/assets/images/album_art/aircredits-breathewell.jpg) | Air Credits | Breathe Well+ |

## Forgotten Favorites
Loved tracks I haven't played in the longest time.

| Artist | Track | Last Played |
| ------ | ----- | ----------- |
| Romare | Down the Line (It Takes a Number) | 2016-01-27 |
| Misun | Promise Me (The Hood Internet Remix) | 2016-02-15 |
| Scarlett Johansson & Joaquin Phoenix | The Moon Song (Film Version) | 2016-02-24 |
| SBTRKT | Higher | 2016-02-27 |
| SBTRKT & Sampha | Trials of the Past | 2016-02-27 |
| Radiohead | The Daily Mail | 2016-03-03 |
| Dave Matthews & Tim Reynolds | Two Step (Live) | 2016-03-07 |
| Devendra Banhart | Rosa | 2016-04-28 |
| Active Child | Hanging On | 2016-05-20 |
| Duke Ellington | Little African Flower | 2016-06-06 |

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
|  | ![ - Her OST](/assets/images/album_art/-herost.jpg) | Photograph | 76 | 3h 8m 48s |

## Top Played Albums
This is a list of the top played albums in my library (by ratio of song plays to songs in the album).

| Art | Artist | Album | Song Play Ratio | Play Count
| --- | ------ | ----- | --------------- | --------- |
| ![Shane Carruth - Upstream Color (Original Motion Picture Score)](/assets/images/album_art/shanecarruth-upstreamcolororiginalmotionpicturescore.jpg) | Shane Carruth | Upstream Color (Original Motion Picture Score) | 51 | 765 |
| ![Peter Broderick - Partners](/assets/images/album_art/peterbroderick-partners.jpg) | Peter Broderick | Partners | 40 | 319 |
| ![Ahmad Jamal Trio - Ahmad Jamal At The Pershing: But Not for Me](/assets/images/album_art/ahmadjamaltrio-ahmadjamalatthepershingbutnotforme.jpg) | Ahmad Jamal Trio | Ahmad Jamal At The Pershing: But Not for Me | 39 | 311 |
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
| Four Tet | 1186 | 10 |
| Oddisee | 1083 | 8 |
| KAYTRANADA | 984 | 13 |
| Peter Broderick | 930 | 33 |
| Sylvan Esso | 896 | 13 |
| Caribou | 891 | 9 |
| Nils Frahm | 860 | 8 |
| Jungle | 833 | 12 |
| José González | 773 | 10 |
| Shane Carruth | 765 | 51 |

## Top Genres
This is a list of the top genres my library (by track count).

| Genre | Track Count | Song Play Count | Total Time |
| ------ | ---------- | -------------- | --------------- |
| Electronic | 5141 | 22087 | 401h 15m 32s |
| Alternative | 4552 | 19645 | 285h 14m 0s |
| Dance | 3493 | 11064 | 218h 0m 38s |
| Hip-Hop/Rap | 2317 | 8117 | 126h 48m 45s |
| Rock | 1541 | 4166 | 107h 0m 25s |
| Pop | 1220 | 4825 | 79h 34m 37s |
| Classical | 847 | 2937 | 60h 33m 24s |
| Soundtrack | 833 | 3510 | 43h 13m 30s |
| Jazz | 795 | 3637 | 77h 2m 43s |
| R&B/Soul | 747 | 3201 | 43h 52m 54s |

## Play Concentration
How unevenly my plays are distributed across the library.

- 98314 total plays across the library
- The top 1% of tracks account for 11% of all plays
- The top 5% of tracks account for 32% of all plays
- The top 10% of tracks account for 48% of all plays
- 7201 tracks (28%) have never been played

## Library Growth
Tracks added to my library by year.

| Year | Tracks Added | |
| ---- | ------------ | --- |
| 2013 | 194 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:6px"></span> |
| 2014 | 55 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:2px"></span> |
| 2015 | 698 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:20px"></span> |
| 2016 | 2078 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:61px"></span> |
| 2017 | 883 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:26px"></span> |
| 2018 | 1258 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:37px"></span> |
| 2019 | 1209 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:35px"></span> |
| 2020 | 2482 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:72px"></span> |
| 2021 | 2862 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:83px"></span> |
| 2022 | 2439 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:71px"></span> |
| 2023 | 3895 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:114px"></span> |
| 2024 | 4114 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:120px"></span> |
| 2025 | 2245 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:65px"></span> |
| 2026 | 1177 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:34px"></span> |

## Taste Drift
The top genres of the tracks I added each year.

| Year | Top Genres Added |
| ---- | ---------------- |
| 2013 | Classical (61) · Soundtrack (30) · Other (26) |
| 2014 | Soundtrack (36) · Hip Hop/Rap (2) · Other (1) |
| 2015 | Alternative (186) · Electronic (114) · Classical (108) |
| 2016 | Alternative (424) · Electronic (327) · Soundtrack (204) |
| 2017 | Alternative (138) · Electronic (130) · Soundtrack (109) |
| 2018 | Alternative (222) · Classical (206) · Hip-Hop/Rap (195) |
| 2019 | Electronic (360) · Alternative (225) · Hip-Hop/Rap (117) |
| 2020 | Electronic (472) · Alternative (391) · Hip-Hop/Rap (352) |
| 2021 | Electronic (572) · Alternative (475) · Dance (466) |
| 2022 | Alternative (501) · Electronic (425) · Dance (412) |
| 2023 | Electronic (854) · Alternative (735) · Dance (528) |
| 2024 | Electronic (811) · Alternative (709) · Dance (658) |
| 2025 | Electronic (596) · Alternative (472) · Dance (421) |
| 2026 | Dance (462) · Electronic (304) · Alternative (74) |

## Library by Release Decade
When the music in my library was originally released.

| Decade | Tracks | Plays | |
| ------ | ------ | ----- | --- |
| 1910s | 2 | 0 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:2px"></span> |
| 1920s | 3 | 0 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:2px"></span> |
| 1930s | 1 | 0 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:2px"></span> |
| 1940s | 8 | 16 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:2px"></span> |
| 1950s | 293 | 1081 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:3px"></span> |
| 1960s | 669 | 1352 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:7px"></span> |
| 1970s | 658 | 1114 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:6px"></span> |
| 1980s | 664 | 1672 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:7px"></span> |
| 1990s | 1164 | 1866 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:11px"></span> |
| 2000s | 2616 | 8607 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:26px"></span> |
| 2010s | 7124 | 40094 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:70px"></span> |
| 2020s | 12196 | 41344 | <span style="display:inline-block;background:var(--c-link);height:0.75em;width:120px"></span> |

## One-Hit Wonders
Artists where a single track soaks up most of my plays (min. 5 tracks and 100 plays).

| Artist | The Hit | Hit Plays | All Plays | Share |
| ------ | ------- | --------- | --------- | ----- |
| Sufjan Stevens | Redford (For Yia-Yia and Pappou) | 87 | 214 | 41% |
| James Blake | I Need a Forest Fire (feat. Bon Iver) | 76 | 193 | 39% |
| Keys N Krates | My Night (feat. 070 Shake) | 32 | 112 | 29% |
| Jamie xx | Gosh | 87 | 306 | 28% |
| Cosmo Pyke | Wish You Were Gone | 43 | 161 | 27% |
| DRAMA | Billy | 41 | 162 | 25% |
| AIR CREDITS | ALL I NEED PT 2 | 30 | 122 | 25% |
| Devendra Banhart | My Dearest Friend | 40 | 163 | 25% |
| Jon Brion | Little Person | 37 | 164 | 23% |
| Alabama Shakes | Sound & Color | 59 | 262 | 23% |

## Album Loyalty
Whether I play an album front-to-back or cherry-pick tracks, measured by how evenly plays spread across its tracks (min. 4 tracks and 5 plays per track on average).

### Front-to-Back

| Artist | Album | Album Plays |
| ------ | ----- | ----------- |
| ford. | Intermission Broadcast (DJ Mix) | 126 |
| Gidon Kremer, Keith Jarrett & The 12 Cellists of the Berlin Philharmonic Orchestra | Arvo Pärt: Tabula Rasa | 50 |
| FKJ | Ylang Ylang EP | 45 |
| Best Coast | Make You Mine - EP | 53 |
| Toro y Moi | Soul Trash | 268 |

### Cherry-Picked

| Artist | Album | Album Plays |
| ------ | ----- | ----------- |
| Boardwalk | Boardwalk | 84 |
| Philip Glass | Solo Piano | 72 |
| Moderat | Moderat (Deluxe Version) | 118 |
| Childish Gambino | Because the Internet | 136 |
| Jamie xx | In Colour | 168 |
