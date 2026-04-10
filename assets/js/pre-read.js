(function () {
  var valUrl = "https://joshbeckman--1ba131fe28c011f180b042dde27851f2.web.val.run";

  function init() {
    var params = new URLSearchParams(window.location.search);
    var url = params.get("url");

    var password = params.get("password");
    var savedPassword = window.JoshSettings && window.JoshSettings.load().gardenPassword;
    var passwordField = document.querySelector('#preread-form input[name="password"]');
    if (passwordField && !password && savedPassword) {
      passwordField.value = savedPassword;
    }

    if (url && (password || savedPassword)) {
      hideMenu();
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }
      fetchPreRead(url, password || savedPassword);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function startLoading() {
    document.getElementById("preread-loading").style.display = "block";
  }
  function stopLoading() {
    document.getElementById("preread-loading").style.display = "none";
  }
  function hideMenu() {
    document.getElementById("preread-menu").style.display = "none";
  }
  function notify(body) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Pre-Read", { body: body });
    }
  }

  function fetchPreRead(url, password) {
    startLoading();
    var endpoint = valUrl + "?url=" + encodeURIComponent(url);
    fetch(endpoint, { headers: { "Authorization": "Bearer " + password } })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        stopLoading();
        if (data.error) {
          document.getElementById("perspectives").innerHTML =
            "<p><em>" + data.error + "</em></p>";
          return;
        }
        renderPreRead(data);
        notify("Pre-read ready for " + (data.page.title || "page"));
      })
      .catch(function (err) {
        stopLoading();
        document.getElementById("perspectives").innerHTML =
          "<p><em>Error: " + err.message + "</em></p>";
      });
  }

  function renderPreRead(data) {
    var titleEl = document.getElementById("page-title");
    var anchor = document.createElement("a");
    anchor.href = data.page.url;
    anchor.textContent = data.page.title;
    anchor.target = "_blank";
    titleEl.innerHTML = "";
    titleEl.appendChild(anchor);

    var container = document.getElementById("perspectives");
    container.innerHTML = "";

    var angles = [
      { key: "proponent", label: "Proponent", desc: "supports or extends the ideas" },
      { key: "opponent", label: "Opponent", desc: "complicates or contradicts the ideas" },
      { key: "questioner", label: "Questioner", desc: "raises questions from prior writing" },
    ];

    angles.forEach(function (p) {
      var perspective = data.perspectives[p.key];
      var section = document.createElement("div");
      section.style.marginBottom = "2em";

      var heading = document.createElement("h3");
      heading.innerHTML =
        "<strong>" + p.label + "</strong> — <em>" + p.desc + "</em>";
      section.appendChild(heading);

      var content = document.createElement("div");
      content.innerHTML = perspective.html;
      section.appendChild(content);

      container.appendChild(section);
    });

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
