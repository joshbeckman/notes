---
layout: Post
title: Random Note
permalink: /random/
content-type: eg
---

Loading...

<script>
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
                return !item.url.match(/tags/);
            });
            var randomItem = items[Math.floor(Math.random()*items.length)];
            window.location.href = randomItem.url;
        });
})();
</script>
