(function (sj) {
    "use strict";

    sj.addEvent = function(el, type, handler) {
      if (el.attachEvent) el.attachEvent('on'+type, handler); else el.addEventListener(type, handler);
    }
    sj.removeEvent = function(el, type, handler) {
      if (el.detachEvent) el.detachEvent('on'+type, handler); else el.removeEventListener(type, handler);
    }
    sj.onReady = function(ready) {
      // in case the document is already rendered
      if (document.readyState!='loading') ready();
      // modern browsers
      else if (document.addEventListener) document.addEventListener('DOMContentLoaded', ready);
      // IE <= 8
      else document.attachEvent('onreadystatechange', function(){
          if (document.readyState=='complete') ready();
      });
    }

    
    async function getSearchData(dataUrl) {
        let response = await fetch(dataUrl);
        let responseText = response.text();
        return responseText;
    }

    function searchInit() {
        var dataUrl = "/assets/js/SearchData.json";

        getSearchData(dataUrl)
            .then(function(responseText) {
            var docs = JSON.parse(responseText);

            var fuse = new Fuse(Object.values(docs), {
                keys: ['title', 'content', 'tags', 'url'],
                findAllMatches: false,
                ignoreFieldNorm: true,
                ignoreLocation: true,
                includeMatches: true,
                includeScore: true,
                isCaseSensitive: false,
                minMatchCharLength: 3,
                shouldSort: true,
                threshold: 0.2, // set this to 0 to require a perfect match
                useExtendedSearch: true, // ref: https://www.fusejs.io/examples.html#extended-search
            });
            searchLoaded(fuse);
        }).catch(function(err) {
            alert('Failed to load search data: ' + err);
        });
    }

    function searchLoaded(fuse) {
        var searchInput = document.getElementById('search-input');
        var searchResults = document.getElementById('search-results');
        var currentInput;
        var currentSearchIndex = 0;

        function update() {
            currentSearchIndex++;

            var input = searchInput.value;
            var isBang = input.endsWith('!');

            if (input === currentInput) {
                return;
            }

            currentInput = input;
            searchResults.innerHTML = '';
            if (input === '') {
                return;
            }

            var results = fuse.search(input);
            if (results[0] && results[0].score <= 0.3) {
                results = results.filter(function(result){
                    return result.score < 0.5;
                });
            }

            var countResultsDiv = document.createElement('small');
            countResultsDiv.classList.add('search-result-count');
            countResultsDiv.innerText = results.length.toLocaleString() + ' result' + (results.length != 1 ? 's' : '') + ' found';
            searchResults.appendChild(countResultsDiv);

            if (results.length > 0) {
                var resultsList = document.createElement('ul');
                resultsList.classList.add('search-results-list');
                searchResults.appendChild(resultsList);
                if (isBang) {
                    return window.location.href = results[0].item.url;
                }
                addResults(resultsList, results, 0, 10, 100, currentSearchIndex);
            }

            function addResults(resultsList, results, start, batchSize, batchMillis, searchIndex) {
                if (searchIndex != currentSearchIndex) {
                    return;
                }
                for (var i = start; i < (start + batchSize); i++) {
                    if (i == results.length) {
                        return;
                    }
                    addResult(resultsList, results[i]);
                }
                setTimeout(function() {
                    addResults(resultsList, results, start + batchSize, batchSize, batchMillis, searchIndex);
                }, batchMillis);
            }

            function addResult(resultsList, result) {
                var doc = result.item;
                var resultsListItem = document.createElement('li');
                resultsListItem.classList.add('search-results-list-item');
                resultsList.appendChild(resultsListItem);

                var resultLink = document.createElement('a');
                resultLink.classList.add('search-result');
                resultLink.setAttribute('href', doc.url);
                resultsListItem.appendChild(resultLink);

                var resultTitle = document.createElement('div');
                resultTitle.classList.add('search-result-title');
                resultLink.appendChild(resultTitle);

                var resultDoc = document.createElement('div');
                resultDoc.classList.add('search-result-doc');
                resultDoc.innerHTML = "";
                resultTitle.appendChild(resultDoc);
                var resultDocTitle = document.createElement('div');
                resultDocTitle.classList.add('search-result-doc-title');
                resultDocTitle.innerHTML = doc.doc;
                resultDoc.appendChild(resultDocTitle);
                var resultDocOrSection = resultDocTitle;
                if (doc.doc != doc.title) {
                    resultDoc.classList.add('search-result-doc-parent');
                    var resultSection = document.createElement('div');
                    resultSection.classList.add('search-result-section');
                    resultSection.innerHTML = doc.title;
                    resultTitle.appendChild(resultSection);
                    resultDocOrSection = resultSection;
                }
                var titlePositions = result.matches.filter(function(match){
                    return match.key == 'title';
                }).map(function(match){
                    return match.indices[0];
                });
                // result = {item: {title: "title", content: "content", tags: "tags", url: "url"}, matches: [{key: "title", indices: [[0, 3], [30, 34]], value: "title"}, {key: "content", indices: [[0, 3]], velue: "content"}]}
                var contentPositions = result.matches.filter(function(match){
                    return match.key == 'content';
                }).map(function(match){
                    return match.indices.sort(function(a, b){
                        // sort by biggest match first
                        return (b[1] - b[0]) - (a[1] - a[0]);
                    });
                })[0];
                if (titlePositions.length > 0) {
                    resultDocOrSection.innerHTML = '';
                    addHighlightedText(resultDocOrSection, doc.title, 0, doc.title.length, titlePositions);
                }

                if (contentPositions) {
                    var resultPreviews = document.createElement('div');
                    resultPreviews.classList.add('search-result-previews');
                    resultLink.appendChild(resultPreviews);

                    var previewBuffer = 15;
                    var position = contentPositions[0];
                    var resultPreview = document.createElement('div');
                    resultPreview.classList.add('search-result-preview');
                    resultPreviews.appendChild(resultPreview);
                    resultPreview.appendChild(document.createTextNode('... '));
                    addHighlightedText(resultPreview, doc.content, Math.max(0, position[0] - previewBuffer), position[1] + previewBuffer, [position]);
                    resultPreview.appendChild(document.createTextNode(' ...'));
                }
            }

            function addHighlightedText(parent, text, start, end, positions) {
                var index = start;
                for (var i in positions) {
                    var position = positions[i];
                    var span = document.createElement('span');
                    span.innerHTML = text.substring(index, position[0]);
                    parent.appendChild(span);
                    index = position[1] + 1;
                    var highlight = document.createElement('span');
                    highlight.classList.add('search-result-highlight');
                    highlight.innerHTML = text.substring(position[0], index);
                    parent.appendChild(highlight);
                }
                var span = document.createElement('span');
                span.innerHTML = text.substring(index, end);
                parent.appendChild(span);
            }
        }

        sj.onReady(function(){
            update();
        });
    }

    sj.onReady(function(){
        searchInit();
    });
    function searchViaQuery() {
      var search = new URLSearchParams(window.location.search).get("q");
      if (!search) { return; }

      var searchInput = document.getElementById("search-input");
      searchInput.value = search;
    }
    function searchVia404() {
      var shouldSearch = document.title.indexOf("404 - Page not found") >= 0;
      if (!shouldSearch) { return; }

      var search = window.location.pathname.split("/").join(" ").trim().split("-").join(" ");
      var searchInput = document.getElementById("search-input");
      searchInput.value = search;
    }

    searchViaQuery();
    searchVia404();
})(window.sj = window.sj || {});
