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

            lunr.tokenizer.separator = /[\s/]+/;

            var index = lunr(function(){
                this.ref('id');
                this.field('title');
                this.field('content');
                this.field('url');
                this.field('tags');
                this.metadataWhitelist = ['position']

                for (var i in docs) {
                    this.add({
                        id: i,
                        title: docs[i].title,
                        content: docs[i].content,
                        url: docs[i].url,
                        tags: docs[i].tags,
                    });
                }
            });
            searchLoaded(index, docs);
        }).catch(function(err) {
            console.warn("Error processing the search-data for lunrjs",err);
        });
    }

    function searchLoaded(index, docs) {
        var index = index;
        var docs = docs;
        var searchInput = document.getElementById('search-input');
        var searchResults = document.getElementById('search-results');
        var currentInput;
        var currentSearchIndex = 0;

        function showSearch() {
            document.documentElement.classList.add('search-active');
        }

        function hideSearch() {
            document.documentElement.classList.remove('search-active');
        }

        function update() {
            currentSearchIndex++;

            var input = searchInput.value;
            var isBang = input.endsWith('!');
            if (input === '') {
                hideSearch();
            } else {
                showSearch();
                window.scroll(0, -1);
                setTimeout(function() { window.scroll(0, 0);}, 0);
            }

            if (input === currentInput) {
                return;
            }

            currentInput = input;
            searchResults.innerHTML = '';
            if (input === '') {
                return;
            }

            var results = index.search(input);

            if ((results.length == 0) && (input.length > 2)) {
                var tokens = lunr.tokenizer(input).filter(function(token, i){
                   return token.str.length < 20; 
                })

                if (tokens.length > 0) {
                    results = index.query(function (query){
                        query.term(tokens, {
                            editDistance: Math.round(Math.sqrt(input.length / 2 - 1))
                        });
                    });
                }
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
                    return window.location.href = docs[results[0].ref].url;
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
                
                var doc = docs[result.ref];
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


                
                var metadata = result.matchData.metadata;
                var titlePositions = [];
                var contentPositions = [];
                for (var j in metadata) {
                    var meta = metadata[j];
                    if (meta.title) {
                        var positions = meta.title.position;
                        for (var k in positions) {
                            titlePositions.push(positions[k]);
                        }
                    }

                    if (meta.content) {
                        var positions = meta.content.position;
                        for(var k in positions) {
                            var position = positions[k];
                            var previewStart = position[0];
                            var previewEnd = position[0] + position[1];
                            var ellipsesBefore = true;
                            var ellipsesAfter = true;
                            for (var k = 0; k < 3; k++) {
                                var nextSpace = doc.content.lastIndexOf(' ', previewStart - 2);
                                var nextDot = doc.content.lastIndexOf('. ', previewStart - 2);
                                if ((nextDot >= 0) && (nextDot > nextSpace)) {
                                    previewStart = nextDot + 1;
                                    ellipsesBefore = false;
                                    break;
                                }
                                if (nextSpace < 0) {
                                    previewStart = 0;
                                    ellipsesBefore = false;
                                    break;
                                }
                                previewStart = nextSpace + 1;
                            }

                            for (var k = 0; k < 3; k++) {
                                var nextSpace = doc.content.indexOf(' ', previewEnd + 1);
                                var nextDot = doc.content.indexOf('. ', previewEnd + 1);
                                if ((nextDot >= 0) && (nextDot < nextSpace)) {
                                    previewEnd = nextDot;
                                    ellipsesAfter = false;
                                    break;
                                }
                                if (nextSpace < 0) {
                                    previewEnd = doc.content.length;
                                    ellipsesAfter = false;
                                    break;
                                }
                                previewEnd = nextSpace;
                            }

                            contentPositions.push({
                                highlight: position,
                                previewStart: previewStart, previewEnd: previewEnd,
                                ellipsesBefore: ellipsesBefore, ellipsesAfter: ellipsesAfter
                            });
                        }
                    }
                }
                if (titlePositions.length > 0) {
                    titlePositions.sort(function(p1, p2){ return p1[0] - p2[0] });
                    resultDocOrSection.innerHTML = '';
                    addHighlightedText(resultDocOrSection, doc.title, 0, doc.title.length, titlePositions);
                }

                if (contentPositions.length > 0) {
                    contentPositions.sort(function(p1, p2){ return p1.highlight[0] - p2.highlight[0] });
                    var contentPosition = contentPositions[0];
                    var previewPosition = {
                        highlight: [contentPosition.highlight],
                        previewStart: contentPosition.previewStart, previewEnd: contentPosition.previewEnd,
                        ellipsesBefore: contentPosition.ellipsesBefore, ellipsesAfter: contentPosition.ellipsesAfter
                    };
                    var previewPositions = [previewPosition];
                    for (var j = 1; j < contentPositions.length; j++) {
                        contentPosition = contentPositions[j];
                        if (previewPosition.previewEnd < contentPosition.previewStart) {
                            previewPosition = {
                            highlight: [contentPosition.highlight],
                            previewStart: contentPosition.previewStart, previewEnd: contentPosition.previewEnd,
                            ellipsesBefore: contentPosition.ellipsesBefore, ellipsesAfter: contentPosition.ellipsesAfter
                            }
                            previewPositions.push(previewPosition);
                        } else {
                            previewPosition.highlight.push(contentPosition.highlight);
                            previewPosition.previewEnd = contentPosition.previewEnd;
                            previewPosition.ellipsesAfter = contentPosition.ellipsesAfter;
                        }
                    }

                    var resultPreviews = document.createElement('div');
                    resultPreviews.classList.add('search-result-previews');
                    resultLink.appendChild(resultPreviews);

                    var content = doc.content;
                    
                    for (var j = 0; j < Math.min(previewPositions.length, 2); j++) {
                        var position = previewPositions[j];
                        var resultPreview = document.createElement('div');
                        resultPreview.classList.add('search-result-preview');
                        resultPreviews.appendChild(resultPreview);

                        if (position.ellipsesBefore) {
                            resultPreview.appendChild(document.createTextNode('... '));
                        }
                        addHighlightedText(resultPreview, content, position.previewStart, position.previewEnd, position.highlight);
                        if (position.ellipsesAfter) {
                            resultPreview.appendChild(document.createTextNode(' ...'));
                        }
                    }
                }
            }

            function addHighlightedText(parent, text, start, end, positions) {
                var index = start;
                for (var i in positions) {
                    var position = positions[i];
                    var span = document.createElement('span');
                    span.innerHTML = text.substring(index, position[0]);
                    parent.appendChild(span);
                    index = position[0] + position[1];
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
