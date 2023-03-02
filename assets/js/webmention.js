function enableWebmentions(rootContainer) {
    var webmentionDiv = document.createElement('div');
    var webmentionTitle = document.createElement('h3');
    var webmentionButton = document.createElement('button');
    var webmentionEmpty = document.createElement('p');
    var webmentionTarget = (document.head.querySelector('link[rel=canonical]') || document.location).href;
    var fetchMissingError = 'fetch not available: cannot populate webmentions';
    function populateWebmentionCount() {
        if (!fetch) {
            console.log(fetchMissingError);
            return;
        }
        fetch("https://webmention.io/api/count?target=" + webmentionButton.dataset.webmentionTarget)
            .then(function(response) { return response.json() })
            .then(function(responseJson) {
                webmentionButton.innerText += ' (' + responseJson.count + ')';
                if (responseJson.count < 1) {
                    webmentionButton.disabled = true;
                }
            });
    }

    function handleWebmentionClick() {
        if (!fetch) {
            console.log(fetchMissingError);
            return;
        }
        webmentionButton.removeEventListener('click', handleWebmentionClick);
        fetch("https://webmention.io/api/mentions.jf2?per-page=100&target=" + webmentionButton.dataset.webmentionTarget)
            .then(function(response) { return response.json() })
            .then(function(responseJson) {
                addWebmentions(responseJson.children);
            });
    }

    function addWebmentions(mentions) {
        var divs = mentions.map(buildWebmention);
        webmentionDiv.append.apply(webmentionDiv, divs);
        webmentionTitle.removeChild(webmentionButton);
        if (divs.length < 1) {
            webmentionEmpty.innerText = 'None found.';
            webmentionDiv.appendChild(webmentionEmpty);
        }
    }

    function buildWebmention(mention) {
        var div = document.createElement('div');
        var title = document.createElement('p');
        var body = document.createElement('blockquote');
        var link = document.createElement('a');
        var date = new Date(mention.published || mention['wm-received']).toLocaleString().match(/[\d|/]*/);
        var name = mention.author.name || 'someone';
        div.className = 'webmention-entry';
        link.href = mention.url;
        link.innerText = mention.name || 'a post';
        link.target = '_blank';
        link.rel = 'nofollow';
        link.className = 'webmention-entry-link';
        title.className = 'webmention-entry-title';
        body.className = 'webmention-entry-summary';
        title.innerHTML = [
            name,
            ' mentioned in ',
            link.outerHTML,
            ' (',
            date,
            ')'
        ].join('');
        if (mention.summary) {
            body.innerText = mention.summary.value;
        } else if (mention.content) {
            body.innerText = mention.content.text.substring(0, 240) + '...';
        }
        div.append(title, body);
        return div;
    }

    webmentionDiv.className = 'webmention-container';
    webmentionTitle.innerText = 'Note Mentions';
    webmentionTitle.className = 'webmention-title';
    webmentionButton.innerText = 'View';
    webmentionButton.className = 'webmention-button';
    webmentionButton.addEventListener('click', handleWebmentionClick);
    webmentionButton.dataset.webmentionTarget = webmentionTarget;
    webmentionTitle.appendChild(webmentionButton);
    webmentionDiv.appendChild(webmentionTitle);
    rootContainer.appendChild(webmentionDiv);
    setTimeout(populateWebmentionCount, 1000 * 10);
}
if (document.querySelector('.note-post')){
    enableWebmentions(document.querySelector('article section'));
}
