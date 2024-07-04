(function(){
    var url = 'https://joshbeckman-amethysthalibut.web.val.run';
    var topic = new URLSearchParams(window.location.search).get('topic');
    if (topic) {
        url += '?topic=' + encodeURIComponent(topic);
    }
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('insight').innerHTML = data.insightHtml;
            document.getElementById('topic').innerHTML = data.topic;
        });

})();
