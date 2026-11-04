(function () {
  var bands = [
    { id: "early", label: "Early childhood (3–6)", min: 3, max: 6 },
    { id: "middle", label: "Middle childhood (7–12)", min: 7, max: 12 },
    { id: "adults", label: "Adults (18+)", min: 18, max: null }
  ];

  var results = document.querySelector("[data-results]");
  var count = document.querySelector("[data-count]");
  var searchInput = document.querySelector("[data-search]");
  var topicSelect = document.querySelector("[data-topic]");
  var ageSelect = document.querySelector("[data-age]");
  var leadSelect = document.querySelector("[data-lead]");
  var viewButtons = document.querySelectorAll("[data-view]");

  if (!results || !searchInput || !topicSelect || !ageSelect || !leadSelect) {
    return;
  }

  var view = "studies";
  var studies = [];

  function rangesOf(study) {
    if (study.ranges && study.ranges.length) {
      return study.ranges;
    }
    return [{ min: study.ageMin, max: study.ageMax }];
  }

  function overlaps(range, band) {
    if (range.max !== null && range.max < band.min) {
      return false;
    }
    if (band.max !== null && range.min > band.max) {
      return false;
    }
    return true;
  }

  function inBand(study, bandId) {
    if (!bandId) {
      return true;
    }
    var band = bands.filter(function (item) {
      return item.id === bandId;
    })[0];
    if (!band) {
      return true;
    }
    return rangesOf(study).some(function (range) {
      return overlaps(range, band);
    });
  }

  function filters() {
    return {
      q: searchInput.value.trim().toLowerCase(),
      topic: topicSelect.value,
      age: ageSelect.value,
      lead: leadSelect.value
    };
  }

  function matches(study, state) {
    if (state.topic && study.topic !== state.topic) {
      return false;
    }
    if (state.lead && study.leads.indexOf(state.lead) === -1) {
      return false;
    }
    if (!inBand(study, state.age)) {
      return false;
    }
    if (!state.q) {
      return true;
    }
    var haystack = [study.name, study.topic, study.ageLabel]
      .concat(study.leads)
      .concat(study.keywords || [])
      .join(" ")
      .toLowerCase();
    return haystack.indexOf(state.q) !== -1;
  }

  function unique(values) {
    return values.filter(function (value, index) {
      return values.indexOf(value) === index;
    }).sort();
  }

  function fillSelect(select, values, placeholder) {
    var current = select.value;
    select.replaceChildren();
    var all = document.createElement("option");
    all.value = "";
    all.textContent = placeholder;
    select.appendChild(all);
    values.forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
    if (values.indexOf(current) !== -1) {
      select.value = current;
    }
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

  function renderStudies(list) {
    if (!list.length) {
      count.textContent = "Nothing matches.";
      return;
    }
    count.textContent = list.length === 1 ? "1 study" : list.length + " studies";
    var ol = document.createElement("ol");
    ol.className = "studies";
    list.forEach(function (study) {
      var item = document.createElement("li");
      item.className = "study";
      item.id = study.id;
      addText(item, "h3", "", study.name);
      addText(item, "p", "meta", study.topic + " · " + study.ageLabel);
      addText(item, "p", "", study.leads.join(", "));
      ol.appendChild(item);
    });
    results.appendChild(ol);
  }

  function renderResearchers(list) {
    var names = unique(
      list.reduce(function (all, study) {
        return all.concat(study.leads);
      }, [])
    );
    var state = filters();
    if (state.lead) {
      names = names.filter(function (name) {
        return name === state.lead;
      });
    }
    if (!names.length) {
      count.textContent = "Nothing matches.";
      return;
    }
    count.textContent = names.length === 1 ? "1 researcher" : names.length + " researchers";
    var wrap = document.createElement("div");
    wrap.className = "researchers";
    names.forEach(function (name) {
      var block = document.createElement("article");
      block.className = "person";
      var heading = document.createElement("h3");
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = name;
      button.setAttribute("data-person", name);
      heading.appendChild(button);
      block.appendChild(heading);
      var ul = document.createElement("ul");
      list.forEach(function (study) {
        if (study.leads.indexOf(name) === -1) {
          return;
        }
        var li = document.createElement("li");
        li.textContent = study.name + " · " + study.ageLabel;
        ul.appendChild(li);
      });
      block.appendChild(ul);
      wrap.appendChild(block);
    });
    results.appendChild(wrap);
  }

  function render() {
    var list = studies.filter(function (study) {
      return matches(study, filters());
    });
    results.replaceChildren();
    if (view === "researchers") {
      renderResearchers(list);
    } else {
      renderStudies(list);
    }
    viewButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-view") === view));
    });
  }

  function showPerson(name) {
    leadSelect.value = name;
    view = "studies";
    render();
    var node = results.querySelector(".study");
    if (node) {
      node.scrollIntoView({ block: "nearest" });
    }
  }

  bands.forEach(function (band) {
    var option = document.createElement("option");
    option.value = band.id;
    option.textContent = band.label;
    ageSelect.appendChild(option);
  });

  viewButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      view = button.getAttribute("data-view");
      render();
    });
  });

  [searchInput, topicSelect, ageSelect, leadSelect].forEach(function (field) {
    field.addEventListener("input", render);
    field.addEventListener("change", render);
  });

  results.addEventListener("click", function (event) {
    var button = event.target.closest("[data-person]");
    if (!button) {
      return;
    }
    showPerson(button.getAttribute("data-person"));
  });

  fetch("studies.json")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Could not load studies");
      }
      return response.json();
    })
    .then(function (data) {
      studies = data.studies || [];
      fillSelect(
        topicSelect,
        unique(studies.map(function (study) { return study.topic; })),
        "All topics"
      );
      fillSelect(
        leadSelect,
        unique(studies.reduce(function (all, study) { return all.concat(study.leads); }, [])),
        "All researchers"
      );
      render();
    })
    .catch(function () {
      count.textContent = "Nothing matches.";
      results.replaceChildren();
      addText(results, "p", "empty", "The study list could not be loaded.");
    });
})();
