---
layout: Page
title: Redirecting to Random Note...
hide_title: true
permalink: "/random/"
tags: index
emoji: "\U0001F500"
serial_number: 2023.PAE.004
---
Loading...

<script>
// TODO: accept a tag as a parameter to filter the random note
async function getSearchData(dataUrl) {
    let response = await fetch(dataUrl);
    let responseText = response.text();
    return responseText;
}

(function searchInit() {
    var dataUrl = "/assets/js/SearchData.json";

    getSearchData(dataUrl)
        .then(function(responseText) {
            var docs = JSON.parse(responseText);
            var items = Object.values(docs).filter(function(item) {
                return !item.url.match(/\/search/) && !item.url.match(/exercise\/[\d]+/);;
            });
            var randomItem = items[Math.floor(Math.random()*items.length)];
            window.location.href = randomItem.url;
        });
})();
</script>
