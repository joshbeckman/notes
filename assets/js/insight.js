(function(){
    var topicInsightUrl = 'https://joshbeckman-amethysthalibut.web.val.run';
    var questionInsightUrl = 'https://joshbeckman-coffeeostrich.web.val.run';
    var postInsightUrl = 'https://joshbeckman-insightpost.web.val.run';
    var conversationInsightUrl = 'https://joshbeckman-insightconversation.web.val.run';
    var params = new URLSearchParams(window.location.search);
    var topic = params.get('topic');
    var question = params.get('question');
    var post = params.get('post');

    if (topic) {
        hideMenu();
        fetchTopicInsight(topic);
    } else if (post) {
        hideMenu();
        fetchPostInsight(post);
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
                if (data.conversation) {
                    setUpConversation(data.conversation);
                }
            });
    }
    function fetchPostInsight(post) {
        startLoading();
        document.getElementById('topic').innerHTML = '';
        if (!post.startsWith('https://')) {
            post = 'https://www.joshbeckman.org' + post;
        }
        postInsightUrl += '?post=' + encodeURIComponent(post);
        fetch(postInsightUrl)
            .then(response => response.json())
            .then(data => {
                stopLoading();
                console.log(data);
                document.title = document.title + ': ' + data.post.title;
                document.getElementById('insight').innerHTML = data.insightHtml;
                if (data.suggestedTags.length > 0) {
                    let p = document.createElement('p');
                    p.innerHTML = 'I suggest adding these tags: ' + data.suggestedTags.join(', ');
                    document.getElementById('insight').appendChild(p);
                }
                let anchor = document.createElement('a');
                anchor.href = data.post.url;
                anchor.innerHTML = data.post.title;
                document.getElementById('topic').innerHTML = 'On "' + anchor.outerHTML + '"';
                if (data.conversation) {
                    setUpConversation(data.conversation);
                }
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
                if (data.conversation) {
                    setUpConversation(data.conversation);
                }
            });
    }
    function fetchConversationInsight(conversation) {
        startLoading();
        fetch(conversationInsightUrl, {
            method: 'POST',
            body: JSON.stringify({conversation: conversation}),
        })
            .then(response => response.json())
            .then(data => {
                stopLoading();
                let insightElement = document.getElementById('insight');
                insightElement.innerHTML = insightElement.innerHTML + data.insightHtml;
                if (data.conversation) {
                    setUpConversation(data.conversation);
                }
            });
    }
    // conversation is an array of objects with the following properties:
    // - role: 'user' or 'assistant' or 'system'
    // - content: string
    function setUpConversation(conversation) {
        console.log('setting up conversation', conversation);
        let form = createConversationForm();
        // add event listener to form
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            let input = document.getElementById('conversation-input');
            let content = input.value;
            if (!content) { return; }
            let message = document.createElement('div');
            message.className = 'conversation-message';
            message.innerHTML = '<strong>You:</strong> ' + content;
            document.getElementById('insight').appendChild(message);
            removeConversationForm();
            fetchConversationInsight(conversation.concat([{role: 'user', content: content}]));
        });
        document.getElementById('insight').appendChild(form);
    }
    function removeConversationForm() {
        let form = document.getElementById('conversation-form');
        if (form) {
            form.parentNode.removeChild(form);
        }
    }
    function createConversationForm() {
        let form = document.createElement('form');
        form.id = 'conversation-form';
        let input = document.createElement('input');
        input.type = 'text';
        input.id = 'conversation-input';
        input.name = 'conversation-input';
        input.placeholder = 'Ask a follow-up question';
        form.appendChild(input);
        let submit = document.createElement('input');
        submit.type = 'submit';
        submit.value = 'Send';
        form.appendChild(submit);
        return form;
    }

})();
