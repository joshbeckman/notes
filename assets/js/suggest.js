(function () {
  var suggestUrl = "https://joshbeckman--cc88a93a27c511f1833342dde27851f2.web.val.run";
  var params = new URLSearchParams(window.location.search);
  var post = params.get("post");

  if (post) {
    hideMenu();
    fetchSuggestions(post);
  }

  function startLoading() {
    document.getElementById("suggest-loading").style.display = "block";
  }
  function stopLoading() {
    document.getElementById("suggest-loading").style.display = "none";
  }
  function hideMenu() {
    document.getElementById("suggest-menu").style.display = "none";
  }

  function fetchSuggestions(post) {
    startLoading();
    if (!post.startsWith("https://")) {
      post = "https://www.joshbeckman.org" + post;
    }
    var url = suggestUrl + "?post=" + encodeURIComponent(post);
    fetch(url)
      .then(function (response) { return response.json(); })
      .then(function (data) {
        stopLoading();
        if (data.error) {
          document.getElementById("suggestions").innerHTML =
            "<p><em>" + data.error + "</em></p>";
          return;
        }
        renderSuggestions(data);
      })
      .catch(function (err) {
        stopLoading();
        document.getElementById("suggestions").innerHTML =
          "<p><em>Error: " + err.message + "</em></p>";
      });
  }

  function renderSuggestions(data) {
    var titleEl = document.getElementById("post-title");
    var anchor = document.createElement("a");
    anchor.href = data.post.url;
    anchor.textContent = data.post.title;
    anchor.target = "_blank";
    titleEl.innerHTML = "";
    titleEl.appendChild(anchor);

    // Show the post body so we can see what we're commenting on
    if (data.post.contentHtml) {
      var postBody = document.createElement("blockquote");
      postBody.innerHTML = data.post.contentHtml;
      titleEl.after(postBody);
    }

    var container = document.getElementById("suggestions");
    container.innerHTML = "";

    var perspectives = [
      { key: "proponent", label: "Proponent", desc: "builds on the idea" },
      { key: "opponent", label: "Opponent", desc: "complicates the idea" },
      { key: "questioner", label: "Questioner", desc: "opens up the idea" },
    ];

    perspectives.forEach(function (p) {
      var suggestion = data.suggestions[p.key];
      var section = document.createElement("div");
      section.style.marginBottom = "2em";

      var heading = document.createElement("h3");
      heading.innerHTML =
        "<strong>" + p.label + "</strong> — <em>" + p.desc + "</em>";
      section.appendChild(heading);

      var content = document.createElement("div");
      content.innerHTML = suggestion.html;
      section.appendChild(content);

      var btn = document.createElement("button");
      btn.textContent = "Copy";
      btn.addEventListener("click", function () {
        navigator.clipboard.writeText(suggestion.markdown);
        btn.textContent = "Copied!";
        setTimeout(function () { btn.textContent = "Copy"; }, 2000);
      });
      section.appendChild(btn);

      container.appendChild(section);
    });

    // Show search queries used by the agent
    if (data.queries && data.queries.length > 0) {
      var details = document.createElement("details");
      var summary = document.createElement("summary");
      summary.textContent = "Search queries used (" + data.queries.length + ")";
      details.appendChild(summary);

      var list = document.createElement("ul");
      data.queries.forEach(function (q) {
        var li = document.createElement("li");
        li.textContent = q;
        list.appendChild(li);
      });
      details.appendChild(list);

      container.appendChild(details);
    }
  }
})();
