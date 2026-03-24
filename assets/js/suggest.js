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
    titleEl.innerHTML = "";
    titleEl.appendChild(anchor);

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
      btn.style.cssText =
        "cursor:pointer;padding:4px 12px;border:1px solid #ccc;border-radius:4px;background:#f5f5f5;font-size:13px;margin-top:0.5em";
      btn.addEventListener("click", function () {
        navigator.clipboard.writeText(suggestion.markdown);
        btn.textContent = "Copied!";
        setTimeout(function () { btn.textContent = "Copy"; }, 2000);
      });
      section.appendChild(btn);

      container.appendChild(section);
    });

    // Show related posts and search queries used
    if (data.relatedPosts && data.relatedPosts.length > 0) {
      var details = document.createElement("details");
      var summary = document.createElement("summary");
      summary.textContent = "Related posts used (" + data.relatedPosts.length + ")";
      details.appendChild(summary);

      var list = document.createElement("ul");
      data.relatedPosts.forEach(function (rp) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = rp.url;
        a.textContent = rp.title;
        a.target = "_blank";
        li.appendChild(a);
        list.appendChild(li);
      });
      details.appendChild(list);

      if (data.queries) {
        var qp = document.createElement("p");
        qp.innerHTML =
          "<em>Search queries: " + data.queries.join("; ") + "</em>";
        details.appendChild(qp);
      }

      container.appendChild(details);
    }
  }
})();
