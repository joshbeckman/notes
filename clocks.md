---
layout: Page
title: Clocks
permalink: "/clocks/"
searchable: true
emoji: "\U000023F1"
description: A live-updating view of the current date and time, with progress bars
  and rings tracking how far along we are through the current minute, hour, day, week,
  month, season, year, decade, and century, plus the sun and moon's position in your
  sky.
tags:
- index
serial_number: 2026.PAE.011
---
<div id="clocks">
  <div class="clock-date" id="clock-date">&nbsp;</div>
  <div class="clock-time" id="clock-time">&nbsp;</div>
<br/><br/>
<h2 id="progress">Progress</h2>

  <div class="clock-bars" id="clock-bars"></div>
  <div class="clock-rings">
    <svg id="clock-rings-svg" viewBox="0 0 200 200" role="img" aria-label="Concentric progress rings, minute innermost to century outermost"></svg>
    <ul class="clock-rings-legend" id="clock-rings-legend"></ul>
  </div>
</div>

<h2 id="astronomical">Astronomical</h2>

Share your location and this will plot the sun and moon on a 24-hour dial — noon at the top, midnight at the bottom — with their rise and set times marked and the time each is above the horizon lit up. Your coordinates stay in the browser — nothing is stored or sent anywhere.

<button id="astro-locate">Use my location</button>
<p id="astro-status" class="astro-status">Location not shared.</p>

<div class="astro-charts" id="astro-charts" hidden></div>

<style>
  #clocks {
    margin: 2rem 0;
  }
  .clock-date {
    font-size: 1.5rem;
    color: var(--c-text-secondary);
  }
  .clock-time {
    font-size: 3.5rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1.1;
  }
  .clock-bars {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .clock-bar-label {
    display: flex;
    justify-content: space-between;
    font-variant-numeric: tabular-nums;
    color: var(--c-text-secondary);
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
  .clock-bar-value {
    color: var(--c-text);
    font-weight: 600;
    margin-left: 0.4rem;
  }
  .clock-bar-track {
    height: 0.75rem;
    background: var(--c-bg-alt);
    border: 1px solid var(--c-border);
    border-radius: 0.375rem;
    overflow: hidden;
  }
  .clock-bar-fill {
    height: 100%;
    background: var(--c-josh);
    /* No CSS transition: the JS updates every animation frame, so a transition
       would lag behind the true value and desync the bars from the clock. */
    width: 0;
  }
  .clock-rings {
    margin-top: 2.5rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }
  .clock-rings svg {
    width: 200px;
    height: 200px;
    flex: none;
  }
  .clock-ring-track {
    fill: none;
    stroke: var(--c-bg-alt);
  }
  .clock-ring-fill {
    fill: none;
    stroke-linecap: round;
  }
  .clock-rings-legend {
    list-style: none;
    margin: 0;
    padding: 0;
    columns: 2;
    column-gap: 1.5rem;
    font-size: 0.85rem;
    color: var(--c-text-secondary);
  }
  .clock-rings-legend li {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin: 0.15rem 0;
    break-inside: avoid;
  }
  /* The site's prose styles add a "– " marker to list items via ::before; this
     legend is a color key, not a prose list, so suppress it. */
  .text ul.clock-rings-legend li::before {
    content: none;
  }
  .clock-rings-legend .swatch {
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 50%;
    flex: none;
  }
  .astro-status {
    color: var(--c-text-secondary);
    font-size: 0.9rem;
  }
  .astro-charts {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    margin-top: 1.5rem;
  }
  .astro-chart {
    flex: 1 1 260px;
  }
  .astro-chart svg {
    width: 100%;
    max-width: 280px;
    height: auto;
  }
  .astro-dial-night {
    fill: none;
    stroke: var(--c-border);
  }
  .astro-dial-day {
    fill: none;
    stroke-linecap: round;
  }
  .astro-tick {
    stroke: var(--c-text-secondary);
    opacity: 0.5;
  }
  .astro-diallabel {
    fill: var(--c-text-secondary);
    font-size: 10px;
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .astro-body {
    stroke: var(--c-bg);
    stroke-width: 1.5;
  }
  .astro-body.below {
    opacity: 0.4;
  }
  .astro-marker {
    stroke-width: 1.5;
  }
  .astro-details {
    margin: 0.75rem 0 0;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.15rem 0.75rem;
    font-size: 0.9rem;
    font-variant-numeric: tabular-nums;
  }
  .astro-details dt {
    color: var(--c-text-secondary);
  }
  .astro-details dd {
    margin: 0;
  }
</style>

<script>
(function () {
  var bars = [
    { key: "minute", label: "Minute" },
    { key: "hour", label: "Hour" },
    { key: "day", label: "Day" },
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
    { key: "season", label: "Season" },
    { key: "year", label: "Year" },
    { key: "decade", label: "Decade" },
    { key: "century", label: "Century" }
  ];

  var container = document.getElementById("clock-bars");
  var dateEl = document.getElementById("clock-date");
  var timeEl = document.getElementById("clock-time");
  var fills = {};
  var percents = {};
  var values = {};

  bars.forEach(function (bar) {
    var wrap = document.createElement("div");
    wrap.className = "clock-bar";

    var label = document.createElement("div");
    label.className = "clock-bar-label";
    var name = document.createElement("span");
    name.textContent = bar.label;
    var value = document.createElement("span");
    value.className = "clock-bar-value";
    name.appendChild(value);
    var pct = document.createElement("span");
    label.appendChild(name);
    label.appendChild(pct);

    var track = document.createElement("div");
    track.className = "clock-bar-track";
    var fill = document.createElement("div");
    fill.className = "clock-bar-fill";
    track.appendChild(fill);

    wrap.appendChild(label);
    wrap.appendChild(track);
    container.appendChild(wrap);

    fills[bar.key] = fill;
    percents[bar.key] = pct;
    values[bar.key] = value;
  });

  // The season value is a link to /season, created once rather than rebuilt
  // each frame; only its text changes as seasons turn over.
  var seasonLink = document.createElement("a");
  seasonLink.href = "/season";
  values.season.appendChild(seasonLink);

  // Concentric rings mirror the bars: minute innermost (fastest) to century
  // outermost (slowest), sharing the same progress values.
  var SVG_NS = "http://www.w3.org/2000/svg";
  var svg = document.getElementById("clock-rings-svg");
  var legend = document.getElementById("clock-rings-legend");
  var CENTER = 100;
  var RING_STEP = 9;
  var INNER_RADIUS = 16;
  var STROKE = 6;
  var ringFills = {};

  bars.forEach(function (bar, i) {
    var radius = INNER_RADIUS + i * RING_STEP;
    var circumference = 2 * Math.PI * radius;
    var hue = Math.round((i / bars.length) * 320);
    var color = "hsl(" + hue + ", 62%, 52%)";

    var track = document.createElementNS(SVG_NS, "circle");
    track.setAttribute("class", "clock-ring-track");
    track.setAttribute("cx", CENTER);
    track.setAttribute("cy", CENTER);
    track.setAttribute("r", radius);
    track.setAttribute("stroke-width", STROKE);

    var fill = document.createElementNS(SVG_NS, "circle");
    fill.setAttribute("class", "clock-ring-fill");
    fill.setAttribute("cx", CENTER);
    fill.setAttribute("cy", CENTER);
    fill.setAttribute("r", radius);
    fill.setAttribute("stroke", color);
    fill.setAttribute("stroke-width", STROKE);
    fill.setAttribute("stroke-dasharray", circumference);
    fill.setAttribute("stroke-dashoffset", circumference);
    // Rotate so each ring fills clockwise from the top rather than 3 o'clock.
    fill.setAttribute("transform", "rotate(-90 " + CENTER + " " + CENTER + ")");
    var title = document.createElementNS(SVG_NS, "title");
    title.textContent = bar.label;
    fill.appendChild(title);

    svg.appendChild(track);
    svg.appendChild(fill);
    ringFills[bar.key] = { el: fill, circumference: circumference };

    var li = document.createElement("li");
    var swatch = document.createElement("span");
    swatch.className = "swatch";
    swatch.style.background = color;
    var text = document.createElement("span");
    text.textContent = bar.label;
    li.appendChild(swatch);
    li.appendChild(text);
    legend.appendChild(li);
  });

  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  function pad(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  // ISO 8601 week number: weeks start Monday and week 1 contains the first
  // Thursday of the year, so a plain "days since Jan 1 / 7" count would be off.
  function isoWeek(now) {
    var d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var day = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - day + 3);
    var firstThursday = new Date(d.getFullYear(), 0, 4);
    var firstDay = (firstThursday.getDay() + 6) % 7;
    firstThursday.setDate(firstThursday.getDate() - firstDay + 3);
    return 1 + Math.round((d - firstThursday) / (7 * 86400000));
  }

  // The 24 small seasons (sekki), injected from _data/seasons.yml at build time
  // so this page and /season stay in sync from one source. Months are 1-indexed
  // in the data, hence the month - 1 when building Date objects below.
  var SMALL_SEASONS = [
{% for season in site.data.seasons -%}
    { name: {{ season.name | jsonify }}, marker: {{ season.marker | jsonify }}, month: {{ season.start_month }}, day: {{ season.start_day }} }{% unless forloop.last %},{% endunless %}
{% endfor -%}
  ];

  function seasonInfo(now) {
    var y = now.getFullYear();
    var t = now.getTime();
    var idx = SMALL_SEASONS.length - 1;
    for (var i = 0; i < SMALL_SEASONS.length; i++) {
      var s = SMALL_SEASONS[i];
      if (new Date(y, s.month - 1, s.day).getTime() <= t) idx = i; else break;
    }
    var cur = SMALL_SEASONS[idx];
    // The final season begins in December, so early January still belongs to it
    // but started in the previous calendar year.
    var curStart = new Date(y, cur.month - 1, cur.day).getTime();
    var startYear = curStart <= t ? y : y - 1;
    var start = new Date(startYear, cur.month - 1, cur.day).getTime();
    var nextIdx = (idx + 1) % SMALL_SEASONS.length;
    var next = SMALL_SEASONS[nextIdx];
    var endYear = nextIdx === 0 ? startYear + 1 : startYear;
    var end = new Date(endYear, next.month - 1, next.day).getTime();
    return { name: cur.name, marker: cur.marker, start: start, end: end };
  }

  function ordinal(n) {
    var s = ["th", "st", "nd", "rd"];
    var v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function currentValue(key, now) {
    var y = now.getFullYear();
    switch (key) {
      case "minute": return now.getMinutes();
      case "hour": return now.getHours();
      case "day": return now.getDate();
      case "week": return isoWeek(now);
      case "month": return now.getMonth() + 1;
      case "year": return y;
      case "decade": return Math.floor(y / 10) * 10 + "s";
      // Casual grouping (2000–2099 = 21st) rather than strict 2001–2100, so the
      // fill lines up with the decade bar above it.
      case "century": return ordinal(Math.floor(y / 100) + 1);
    }
  }

  function progress(now) {
    var y = now.getFullYear();
    var mo = now.getMonth();
    var d = now.getDate();

    var minuteStart = new Date(y, mo, d, now.getHours(), now.getMinutes()).getTime();
    var hourStart = new Date(y, mo, d, now.getHours()).getTime();
    var dayStart = new Date(y, mo, d).getTime();

    // Week starts Monday: getDay() returns 0 for Sunday, so remap to 6.
    var weekday = (now.getDay() + 6) % 7;
    var weekStart = dayStart - weekday * 86400000;

    var monthStart = new Date(y, mo, 1).getTime();
    var monthEnd = new Date(y, mo + 1, 1).getTime();
    var yearStart = new Date(y, 0, 1).getTime();
    var yearEnd = new Date(y + 1, 0, 1).getTime();

    var season = seasonInfo(now);

    var decadeStart = new Date(Math.floor(y / 10) * 10, 0, 1).getTime();
    var decadeEnd = new Date(Math.floor(y / 10) * 10 + 10, 0, 1).getTime();
    var centuryStart = new Date(Math.floor(y / 100) * 100, 0, 1).getTime();
    var centuryEnd = new Date(Math.floor(y / 100) * 100 + 100, 0, 1).getTime();

    var t = now.getTime();
    return {
      minute: (t - minuteStart) / 60000,
      hour: (t - hourStart) / 3600000,
      day: (t - dayStart) / 86400000,
      week: (t - weekStart) / (7 * 86400000),
      month: (t - monthStart) / (monthEnd - monthStart),
      season: (t - season.start) / (season.end - season.start),
      year: (t - yearStart) / (yearEnd - yearStart),
      decade: (t - decadeStart) / (decadeEnd - decadeStart),
      century: (t - centuryStart) / (centuryEnd - centuryStart)
    };
  }

  function tick() {
    var now = new Date();

    dateEl.textContent = DAYS[now.getDay()] + ", " +
      MONTHS[now.getMonth()] + " " + now.getDate() + ", " + now.getFullYear();
    timeEl.textContent = pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());

    var season = seasonInfo(now);
    seasonLink.textContent = season.marker + " " + season.name;

    var p = progress(now);
    bars.forEach(function (bar) {
      var ratio = Math.max(0, Math.min(1, p[bar.key]));
      fills[bar.key].style.width = (ratio * 100) + "%";
      percents[bar.key].textContent = (ratio * 100).toFixed(1) + "%";
      if (bar.key !== "season") {
        values[bar.key].textContent = currentValue(bar.key, now);
      }

      var ring = ringFills[bar.key];
      ring.el.setAttribute("stroke-dashoffset", ring.circumference * (1 - ratio));
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
</script>

<script src="/assets/js/vendor/suncalc.js"></script>
<script>
(function () {
  var btn = document.getElementById("astro-locate");
  var status = document.getElementById("astro-status");
  var charts = document.getElementById("astro-charts");
  if (!btn || !navigator.geolocation) {
    if (status) status.textContent = "Geolocation is not available in this browser.";
    return;
  }

  var SVG_NS = "http://www.w3.org/2000/svg";
  var C = 100;      // dial center
  var R = 78;       // dial radius

  function el(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  // The dial is a 24-hour clock: the body travels once around per day. Noon sits
  // at the top, midnight at the bottom, morning on the left and evening on the
  // right, so a body climbs the left side to its noon high point and descends
  // the right. Angle is measured clockwise from the top.
  function fractionOfDay(date) {
    return (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / 86400;
  }
  function angleForDate(date) {
    return (fractionOfDay(date) - 0.5) * 360;
  }
  function pointOnCircle(angleDeg, radius) {
    var a = angleDeg * Math.PI / 180;
    return { x: C + radius * Math.sin(a), y: C - radius * Math.cos(a) };
  }
  // Arc swept clockwise (forward in time) from a0 to a1.
  function arcPath(a0, a1, radius) {
    var span = ((a1 - a0) % 360 + 360) % 360;
    var large = span > 180 ? 1 : 0;
    var p0 = pointOnCircle(a0, radius);
    var p1 = pointOnCircle(a1, radius);
    return "M" + p0.x.toFixed(2) + " " + p0.y.toFixed(2) +
      " A" + radius + " " + radius + " 0 " + large + " 1 " + p1.x.toFixed(2) + " " + p1.y.toFixed(2);
  }

  var CARDINALS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  function cardinal(bearingDeg) {
    return CARDINALS[Math.round(bearingDeg / 45) % 8];
  }
  function azToBearing(azimuth) {
    return (azimuth * 180 / Math.PI + 180 + 360) % 360;
  }

  function fmtTime(date) {
    if (!date || isNaN(date.getTime())) return "—";
    var h = date.getHours(), m = date.getMinutes();
    return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);
  }
  function fmtAngle(rad) {
    return (rad * 180 / Math.PI).toFixed(1) + "\u00b0";
  }
  function fmtAzimuth(azimuth) {
    var b = azToBearing(azimuth);
    return b.toFixed(0) + "\u00b0 " + cardinal(b);
  }

  var MOON_PHASES = [
    { name: "New Moon", emoji: "\uD83C\uDF11" },
    { name: "Waxing Crescent", emoji: "\uD83C\uDF12" },
    { name: "First Quarter", emoji: "\uD83C\uDF13" },
    { name: "Waxing Gibbous", emoji: "\uD83C\uDF14" },
    { name: "Full Moon", emoji: "\uD83C\uDF15" },
    { name: "Waning Gibbous", emoji: "\uD83C\uDF16" },
    { name: "Last Quarter", emoji: "\uD83C\uDF17" },
    { name: "Waning Crescent", emoji: "\uD83C\uDF18" }
  ];
  function phaseName(phase) {
    // SunCalc phase is 0..1; round to the nearest of 8 named phases.
    return MOON_PHASES[Math.round(phase * 8) % 8];
  }

  // Build the static dial (night ring, noon/midnight ticks and labels) once and
  // return the mutable pieces the update loop touches each tick.
  function createChart(title, dayColor) {
    var card = document.createElement("div");
    card.className = "astro-chart";
    var h = document.createElement("h3");
    h.textContent = title;
    card.appendChild(h);

    var svg = el("svg", { viewBox: "0 0 200 200" });
    var STROKE = 7;
    svg.appendChild(el("circle", { "class": "astro-dial-night", cx: C, cy: C, r: R, "stroke-width": STROKE }));

    // The lit arc from rise to set is drawn over the night ring each tick.
    var dayArc = el("path", { "class": "astro-dial-day", stroke: dayColor, "stroke-width": STROKE });
    svg.appendChild(dayArc);

    // Tick + label at the noon (top) and midnight (bottom) extremes.
    [["noon", 0], ["midnight", 180]].forEach(function (d) {
      var outer = pointOnCircle(d[1], R + STROKE / 2);
      var inner = pointOnCircle(d[1], R - STROKE / 2);
      svg.appendChild(el("line", { "class": "astro-tick", x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y }));
      var lp = pointOnCircle(d[1], R - STROKE - 8);
      var t = el("text", { "class": "astro-diallabel", x: lp.x, y: lp.y });
      t.textContent = d[0];
      svg.appendChild(t);
    });

    var riseMarker = el("circle", { "class": "astro-marker", r: 4, fill: "var(--c-yellow)", stroke: "var(--c-bg)" });
    var setMarker = el("circle", { "class": "astro-marker", r: 4, fill: "var(--c-orange)", stroke: "var(--c-bg)" });
    var body = el("circle", { "class": "astro-body", r: 6.5, fill: dayColor });
    svg.appendChild(riseMarker);
    svg.appendChild(setMarker);
    svg.appendChild(body);
    card.appendChild(svg);

    var dl = document.createElement("dl");
    dl.className = "astro-details";
    var fields = {};
    card.appendChild(dl);
    charts.appendChild(card);

    function addField(key, label) {
      var dt = document.createElement("dt");
      dt.textContent = label;
      var dd = document.createElement("dd");
      dl.appendChild(dt);
      dl.appendChild(dd);
      fields[key] = dd;
    }

    return { dayArc: dayArc, body: body, riseMarker: riseMarker, setMarker: setMarker, fields: fields, addField: addField };
  }

  function isValid(date) {
    return date && !isNaN(date.getTime());
  }
  function placeMarker(marker, date) {
    if (!isValid(date)) { marker.style.display = "none"; return; }
    marker.style.display = "";
    var p = pointOnCircle(angleForDate(date), R);
    marker.setAttribute("cx", p.x);
    marker.setAttribute("cy", p.y);
  }
  function placeBody(body, now, altitude) {
    var p = pointOnCircle(angleForDate(now), R);
    body.setAttribute("cx", p.x);
    body.setAttribute("cy", p.y);
    body.setAttribute("class", altitude < 0 ? "astro-body below" : "astro-body");
  }
  function setDayArc(dayArc, rise, set) {
    if (!isValid(rise) || !isValid(set)) { dayArc.style.display = "none"; return; }
    dayArc.style.display = "";
    dayArc.setAttribute("d", arcPath(angleForDate(rise), angleForDate(set), R));
  }

  var lat, lng, timer;
  var sunChart, moonChart;

  function update() {
    var now = new Date();

    var sunPos = SunCalc.getPosition(now, lat, lng);
    var sunTimes = SunCalc.getTimes(now, lat, lng);
    placeBody(sunChart.body, now, sunPos.altitude);
    placeMarker(sunChart.riseMarker, sunTimes.sunrise);
    placeMarker(sunChart.setMarker, sunTimes.sunset);
    setDayArc(sunChart.dayArc, sunTimes.sunrise, sunTimes.sunset);
    sunChart.fields.altitude.textContent = fmtAngle(sunPos.altitude);
    sunChart.fields.azimuth.textContent = fmtAzimuth(sunPos.azimuth);
    sunChart.fields.rise.textContent = fmtTime(sunTimes.sunrise);
    sunChart.fields.set.textContent = fmtTime(sunTimes.sunset);
    if (sunTimes.sunrise && sunTimes.sunset && !isNaN(sunTimes.sunrise) && !isNaN(sunTimes.sunset)) {
      var mins = Math.round((sunTimes.sunset - sunTimes.sunrise) / 60000);
      sunChart.fields.length.textContent = Math.floor(mins / 60) + "h " + (mins % 60) + "m";
    } else {
      sunChart.fields.length.textContent = "—";
    }

    var moonPos = SunCalc.getMoonPosition(now, lat, lng);
    var moonTimes = SunCalc.getMoonTimes(now, lat, lng);
    var illum = SunCalc.getMoonIllumination(now);
    var phase = phaseName(illum.phase);
    placeBody(moonChart.body, now, moonPos.altitude);
    placeMarker(moonChart.riseMarker, moonTimes.rise);
    placeMarker(moonChart.setMarker, moonTimes.set);
    setDayArc(moonChart.dayArc, moonTimes.rise, moonTimes.set);
    moonChart.fields.altitude.textContent = fmtAngle(moonPos.altitude);
    moonChart.fields.azimuth.textContent = fmtAzimuth(moonPos.azimuth);
    moonChart.fields.rise.textContent = fmtTime(moonTimes.rise);
    moonChart.fields.set.textContent = fmtTime(moonTimes.set);
    moonChart.fields.phase.textContent = phase.emoji + " " + phase.name;
    moonChart.fields.illum.textContent = Math.round(illum.fraction * 100) + "%";
  }

  function locate() {
    status.textContent = "Requesting location\u2026";
    navigator.geolocation.getCurrentPosition(function (pos) {
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
      status.textContent = "Sky for " + lat.toFixed(3) + ", " + lng.toFixed(3) + ". Rise \uD83D\uDFE1 and set \uD83D\uDFE0 marked on the dial; lit arc is time above the horizon.";

      if (!sunChart) {
        sunChart = createChart("Sun \u2600\uFE0F", "var(--c-yellow)");
        sunChart.addField("altitude", "Altitude");
        sunChart.addField("azimuth", "Azimuth");
        sunChart.addField("rise", "Sunrise");
        sunChart.addField("set", "Sunset");
        sunChart.addField("length", "Day length");

        moonChart = createChart("Moon \uD83C\uDF19", "var(--c-klein-blue)");
        moonChart.addField("altitude", "Altitude");
        moonChart.addField("azimuth", "Azimuth");
        moonChart.addField("rise", "Moonrise");
        moonChart.addField("set", "Moonset");
        moonChart.addField("phase", "Phase");
        moonChart.addField("illum", "Illuminated");
      }
      charts.hidden = false;
      update();
      // Positions drift slowly, so a per-second refresh is plenty; no rAF here.
      if (!timer) timer = setInterval(update, 1000);
    }, function (err) {
      status.textContent = "Location unavailable: " + err.message;
    });
  }

  btn.addEventListener("click", locate);

  // Auto-load when permission was already granted on a prior visit, so returning
  // visitors skip the button. The Permissions API isn't universal, so a failed
  // query just leaves the manual button as the fallback.
  if (navigator.permissions && navigator.permissions.query) {
    navigator.permissions.query({ name: "geolocation" }).then(function (result) {
      if (result.state === "granted") locate();
    }).catch(function () {});
  }
})();
</script>
