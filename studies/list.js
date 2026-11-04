(function () {
  var root = document.querySelector("[data-studies]");
  if (!root) {
    return;
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

  fetch("../data/studies.json")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Could not load studies");
      }
      return response.json();
    })
    .then(function (data) {
      (data.studies || []).forEach(function (study) {
        var card = document.createElement("a");
        card.className = "card";
        card.href = study.id + "/";
        addText(card, "h3", "", study.name);
        addText(card, "p", "meta", study.topic + " · " + study.ageLabel);
        addText(card, "p", "", study.leads.join(", "));
        root.appendChild(card);
      });
    })
    .catch(function () {
      addText(root, "p", "empty", "The study list could not be loaded.");
    });
})();
