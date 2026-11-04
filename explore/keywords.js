(function () {
  var results = document.getElementById("keyword-results");
  var links = document.querySelectorAll("[data-keyword]");
  var studies = [];

  if (!results || !links.length) {
    return;
  }

  function keywordId() {
    return decodeURIComponent(location.hash.replace(/^#/, ""));
  }

  function labelFor(id) {
    var link = document.querySelector('[data-keyword="' + id + '"]');
    if (!link) {
      return "";
    }
    var name = link.querySelector("strong");
    return name ? name.textContent : "";
  }

  function addText(parent, tag, className, text) {
    var node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    node.textContent = text;
    parent.appendChild(node);
    return node;
  }

  function show(id) {
    var known = false;
    links.forEach(function (link) {
      var selected = link.getAttribute("data-keyword") === id;
      if (selected) {
        link.setAttribute("aria-current", "true");
        known = true;
      } else {
        link.removeAttribute("aria-current");
      }
    });

    results.replaceChildren();
    if (!known) {
      addText(results, "p", "empty", "Choose a word to see the studies connected to it.");
      return;
    }

    var list = studies.filter(function (study) {
      return (study.keywords || []).indexOf(id) !== -1;
    });
    addText(results, "h2", "", labelFor(id));

    if (!list.length) {
      addText(results, "p", "empty", "Nothing in the directory is tagged with this word yet.");
      return;
    }

    addText(
      results,
      "p",
      "result-count",
      list.length === 1 ? "1 study" : list.length + " studies"
    );
    var ol = document.createElement("ol");
    ol.className = "studies";
    list.forEach(function (study) {
      var item = document.createElement("li");
      item.className = "study";
      addText(item, "h3", "", study.name);
      addText(item, "p", "meta", study.topic + " · " + study.ageLabel);
      addText(item, "p", "", study.leads.join(", "));
      ol.appendChild(item);
    });
    results.appendChild(ol);
    var more = document.createElement("p");
    more.className = "links";
    var all = document.createElement("a");
    all.href = "../data/";
    all.textContent = "See the full directory";
    more.appendChild(all);
    results.appendChild(more);
  }

  document.querySelector(".keywords").addEventListener("click", function (event) {
    var link = event.target.closest("[data-keyword]");
    if (!link) {
      return;
    }
    var id = link.getAttribute("data-keyword");
    if (keywordId() === id) {
      event.preventDefault();
      show(id);
      results.scrollIntoView({ block: "nearest" });
    }
  });

  window.addEventListener("hashchange", function () {
    var id = keywordId();
    show(id);
    if (id) {
      results.scrollIntoView({ block: "nearest" });
    }
  });

  fetch("../data/studies.json")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Could not load studies");
      }
      return response.json();
    })
    .then(function (data) {
      studies = data.studies || [];
      show(keywordId());
    })
    .catch(function () {
      results.replaceChildren();
      addText(results, "p", "empty", "The study list could not be loaded.");
    });
})();
