(function(){
    var topicInsightUrl = 'https://joshbeckman-amethysthalibut.web.val.run';
    var questionInsightUrl = 'https://joshbeckman-coffeeostrich.web.val.run';
    var params = new URLSearchParams(window.location.search);
    var topic = params.get('topic');
    var question = params.get('question');

    if (topic) {
        hideMenu();
        fetchTopicInsight(topic);
    } else if (question) {
        hideMenu();
        fetchQuestionInsight(question);
    }

    function startLoading() {
        document.getElementById('insight-loading').style.display = 'block';
    }
    function stopLoading() {
        document.getElementById('insight-loading').style.display = 'none';
    }
    function hideMenu() {
        document.getElementById('insight-menu').style.display = 'none';
    }
    function fetchTopicInsight(topic) {
        startLoading();
        if (topic == 'random') {
            topic = null;
        }
        if (topic) {
            document.getElementById('topic').innerHTML = topic;
            topicInsightUrl += '?topic=' + encodeURIComponent(topic);
        }
        fetch(topicInsightUrl)
            .then(response => response.json())
            .then(data => {
                stopLoading();
                document.title = document.title + ': ' + data.topic;
                document.getElementById('insight').innerHTML = data.insightHtml;
                document.getElementById('topic').innerHTML = data.topic;
            });
    }
    function fetchQuestionInsight(question) {
        startLoading();
        document.getElementById('topic').innerHTML = question;
        questionInsightUrl += '?question=' + encodeURIComponent(question);
        fetch(questionInsightUrl)
            .then(response => response.json())
            .then(data => {
                stopLoading();
                document.title = document.title + ': ' + data.question;
                document.getElementById('insight').innerHTML = data.insightHtml;
                document.getElementById('topic').innerHTML = data.question;
            });
    }

})();
