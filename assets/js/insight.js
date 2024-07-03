(function(){
    // load the data at https://joshbeckman-amethysthalibut.web.val.run
    // and parse it as JSON
    // and then replace the content of the element with id "insight" with the value of the "insight" key in the JSON
    fetch('https://joshbeckman-amethysthalibut.web.val.run')
        .then(response => response.json())
        .then(data => {
            document.getElementById('insight').innerHTML = data.insight;
            document.getElementById('topic').innerHTML = data.topic;
        });

})();
