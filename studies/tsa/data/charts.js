(function () {
  var SVG = "http://www.w3.org/2000/svg";
  var trials = [];
  var summary = document.getElementById("summary");
  var views = document.getElementById("views");

  function svgEl(name, attrs) {
    var node = document.createElementNS(SVG, name);
    Object.keys(attrs).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    return node;
  }

  function text(parent, value, attrs) {
    var node = svgEl("text", attrs);
    node.textContent = value;
    parent.appendChild(node);
    return node;
  }

  function selected() {
    return {
      age: document.getElementById("age").value,
      size: document.getElementById("size").value,
      location: document.getElementById("location").value,
      familiarity: document.getElementById("familiarity").value
    };
  }

  function filtered() {
    var choice = selected();
    return trials.filter(function (row) {
      if (choice.age && String(row.age) !== choice.age) return false;
      if (choice.size && row.size !== choice.size) return false;
      if (choice.location && row.location !== choice.location) return false;
      if (choice.familiarity && row.familiarity !== choice.familiarity) return false;
      return true;
    });
  }

  function groupsOf(rows) {
    var map = {};
    rows.forEach(function (row) {
      if (!map[row.group]) {
        map[row.group] = {
          group: row.group,
          age: row.age,
          size: row.size,
          successes: 0,
          trials: 0
        };
      }
      map[row.group].successes += row.success;
      map[row.group].trials += 1;
    });
    return Object.keys(map).map(function (key) {
      return map[key];
    });
  }

  function agesPresent(rows) {
    return [2, 3].filter(function (age) {
      return rows.some(function (row) { return row.age === age; });
    });
  }

  function sizesPresent(rows) {
    return ["dyad", "triad"].filter(function (size) {
      return rows.some(function (row) { return row.size === size; });
    });
  }

  function ageLabel(age) {
    return age + "-year-olds";
  }

  function sizeLabel(size) {
    return size === "dyad" ? "Dyads" : "Triads";
  }

  function percent(successes, total) {
    if (!total) return "0%";
    return Math.round((successes / total) * 100) + "%";
  }

  function meanLabel(value) {
    var rounded = Math.round(value * 10) / 10;
    return (Math.round(rounded) === rounded ? String(rounded) : rounded.toFixed(1));
  }

  function cells(rows) {
    var list = [];
    agesPresent(rows).forEach(function (age) {
      sizesPresent(rows).forEach(function (size) {
        var matching = rows.filter(function (row) {
          return row.age === age && row.size === size;
        });
        if (!matching.length) return;
        var successes = matching.reduce(function (sum, row) { return sum + row.success; }, 0);
        list.push({
          age: age,
          size: size,
          successes: successes,
          trials: matching.length,
          groups: groupsOf(matching).length
        });
      });
    });
    return list;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function table(headers, records) {
    var tableNode = document.createElement("table");
    tableNode.className = "chart-table";
    var head = document.createElement("thead");
    var headRow = document.createElement("tr");
    headers.forEach(function (header) {
      var cell = document.createElement("th");
      cell.scope = "col";
      cell.textContent = header;
      headRow.appendChild(cell);
    });
    head.appendChild(headRow);
    tableNode.appendChild(head);
    var body = document.createElement("tbody");
    records.forEach(function (record) {
      var row = document.createElement("tr");
      record.forEach(function (value) {
        var cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });
      body.appendChild(row);
    });
    tableNode.appendChild(body);
    var wrap = document.createElement("div");
    wrap.className = "chart-scroll";
    wrap.appendChild(tableNode);
    return wrap;
  }

  function drawDots(groups) {
    var host = document.getElementById("dots");
    var tableHost = document.getElementById("dots-table");
    clear(host);
    clear(tableHost);
    var ages = [2, 3].filter(function (age) {
      return groups.some(function (group) { return group.age === age; });
    });
    var sizes = ["dyad", "triad"].filter(function (size) {
      return groups.some(function (group) { return group.size === size; });
    });
    var width = ages.length > 1 ? 760 : 420;
    var height = 340;
    var margin = { top: 36, right: 18, bottom: 46, left: 52 };
    var gap = 28;
    var plotWidth = width - margin.left - margin.right - gap * (ages.length - 1);
    var panelWidth = plotWidth / ages.length;
    var plotHeight = height - margin.top - margin.bottom;
    var svg = svgEl("svg", {
      class: "plot",
      viewBox: "0 0 " + width + " " + height,
      role: "img",
      "aria-hidden": "true"
    });
    var yFor = function (value) {
      return margin.top + plotHeight - (value / 4) * plotHeight;
    };
    for (var tick = 0; tick <= 4; tick += 1) {
      svg.appendChild(svgEl("line", {
        x1: margin.left,
        x2: width - margin.right,
        y1: yFor(tick),
        y2: yFor(tick),
        stroke: "rgba(28, 26, 23, 0.12)",
        "stroke-width": "1"
      }));
      text(svg, String(tick), {
        x: margin.left - 12,
        y: yFor(tick) + 4,
        "text-anchor": "end",
        "font-size": "13",
        fill: "#5e584f",
        "font-family": "Fira Sans, Helvetica, sans-serif"
      });
    }
    text(svg, "Successes", {
      x: 16,
      y: margin.top + plotHeight / 2,
      "text-anchor": "middle",
      transform: "rotate(-90 16 " + (margin.top + plotHeight / 2) + ")",
      "font-size": "13",
      fill: "#5e584f",
      "font-family": "Fira Sans, Helvetica, sans-serif"
    });
    ages.forEach(function (age, panel) {
      var panelX = margin.left + panel * (panelWidth + gap);
      text(svg, ageLabel(age), {
        x: panelX + panelWidth / 2,
        y: 20,
        "text-anchor": "middle",
        "font-size": "15",
        "font-weight": "700",
        fill: "#1c1a17",
        "font-family": "Fira Sans, Helvetica, sans-serif"
      });
      var panelSizes = sizes.filter(function (size) {
        return groups.some(function (group) {
          return group.age === age && group.size === size;
        });
      });
      panelSizes.forEach(function (size, index) {
        var slot = panelWidth / panelSizes.length;
        var center = panelX + slot * index + slot / 2;
        var matching = groups.filter(function (group) {
          return group.age === age && group.size === size;
        });
        var average = matching.reduce(function (sum, group) {
          return sum + group.successes;
        }, 0) / matching.length;
        var bins = {};
        matching.forEach(function (group) {
          var key = String(group.successes);
          if (!bins[key]) bins[key] = [];
          bins[key].push(group);
        });
        Object.keys(bins).forEach(function (key) {
          bins[key].sort(function (a, b) { return a.group - b.group; });
          bins[key].forEach(function (group, dot) {
            var count = bins[key].length;
            var spread = Math.min(15, (slot * 0.62) / count);
            var offset = (dot - (count - 1) / 2) * spread;
            svg.appendChild(svgEl("circle", {
              cx: center + offset,
              cy: yFor(group.successes),
              r: "7",
              fill: "#5aa276",
              stroke: "#ffffff",
              "stroke-width": "1.5"
            }));
          });
        });
        var barWidth = Math.min(slot * 0.62, 92);
        svg.appendChild(svgEl("line", {
          x1: center - barWidth / 2,
          x2: center + barWidth / 2,
          y1: yFor(average),
          y2: yFor(average),
          stroke: "#1c1a17",
          "stroke-width": "3",
          "stroke-linecap": "round"
        }));
        text(svg, sizeLabel(size), {
          x: center,
          y: height - 16,
          "text-anchor": "middle",
          "font-size": "14",
          "font-weight": "600",
          fill: "#1c1a17",
          "font-family": "Fira Sans, Helvetica, sans-serif"
        });
      });
    });
    host.appendChild(svg);
    var rows = [];
    ages.forEach(function (age) {
      sizes.forEach(function (size) {
        var matching = groups.filter(function (group) {
          return group.age === age && group.size === size;
        });
        if (!matching.length) return;
        var average = matching.reduce(function (sum, group) {
          return sum + group.successes;
        }, 0) / matching.length;
        rows.push([ageLabel(age), sizeLabel(size), String(matching.length), meanLabel(average)]);
      });
    });
    tableHost.appendChild(table(["Age", "Group size", "Groups", "Average successes"], rows));
  }

  function drawBars(hostId, tableHostId, items, labelFor, colorFor) {
    var host = document.getElementById(hostId);
    var tableHost = document.getElementById(tableHostId);
    clear(host);
    clear(tableHost);
    var width = 760;
    var height = 320;
    var margin = { top: 28, right: 16, bottom: 72, left: 48 };
    var plotWidth = width - margin.left - margin.right;
    var plotHeight = height - margin.top - margin.bottom;
    var svg = svgEl("svg", {
      class: "plot",
      viewBox: "0 0 " + width + " " + height,
      role: "img",
      "aria-hidden": "true"
    });
    [0, 25, 50, 75, 100].forEach(function (tick) {
      var y = margin.top + plotHeight - (tick / 100) * plotHeight;
      svg.appendChild(svgEl("line", {
        x1: margin.left,
        x2: width - margin.right,
        y1: y,
        y2: y,
        stroke: "rgba(28, 26, 23, 0.12)",
        "stroke-width": "1"
      }));
      text(svg, tick + "%", {
        x: margin.left - 10,
        y: y + 4,
        "text-anchor": "end",
        "font-size": "13",
        fill: "#5e584f",
        "font-family": "Fira Sans, Helvetica, sans-serif"
      });
    });
    items.forEach(function (item, index) {
      var slot = plotWidth / items.length;
      var center = margin.left + slot * index + slot / 2;
      var barWidth = Math.min(64, slot * 0.5);
      var rate = item.trials ? item.successes / item.trials : 0;
      var barHeight = rate * plotHeight;
      var y = margin.top + plotHeight - barHeight;
      svg.appendChild(svgEl("rect", {
        x: center - barWidth / 2,
        y: y,
        width: barWidth,
        height: Math.max(barHeight, 0),
        rx: "8",
        fill: colorFor(item)
      }));
      text(svg, percent(item.successes, item.trials), {
        x: center,
        y: y - 8,
        "text-anchor": "middle",
        "font-size": "14",
        "font-weight": "700",
        fill: "#1c1a17",
        "font-family": "Fira Sans, Helvetica, sans-serif"
      });
      labelFor(item).forEach(function (line, lineIndex) {
        text(svg, line, {
          x: center,
          y: height - 46 + lineIndex * 18,
          "text-anchor": "middle",
          "font-size": "13",
          "font-weight": lineIndex === 0 ? "600" : "500",
          fill: lineIndex === 0 ? "#1c1a17" : "#5e584f",
          "font-family": "Fira Sans, Helvetica, sans-serif"
        });
      });
    });
    host.appendChild(svg);
  }

  function draw(rows) {
    var successes = rows.reduce(function (sum, row) { return sum + row.success; }, 0);
    var groups = groupsOf(rows);
    var perGroup = groups.reduce(function (sum, group) { return sum + group.successes; }, 0) / groups.length;
    summary.textContent = successes + " of " + rows.length + " trials successful · " + groups.length + (groups.length === 1 ? " group" : " groups");
    var stats = document.getElementById("stats");
    clear(stats);
    [
      [percent(successes, rows.length), successes + " of " + rows.length + " trials successful"],
      [String(groups.length), groups.length === 1 ? "group" : "groups"],
      [meanLabel(perGroup), "successes per group, out of 4"]
    ].forEach(function (pair) {
      var block = document.createElement("p");
      block.className = "stat";
      var strong = document.createElement("strong");
      strong.textContent = pair[0];
      var span = document.createElement("span");
      span.textContent = pair[1];
      block.appendChild(strong);
      block.appendChild(span);
      stats.appendChild(block);
    });
    drawDots(groups);
    var rateItems = cells(rows);
    drawBars("rates", "rates-table", rateItems, function (item) {
      return [ageLabel(item.age), sizeLabel(item.size)];
    }, function () {
      return "#5aa276";
    });
    document.getElementById("rates-table").appendChild(table(
      ["Age", "Group size", "Successful trials", "Trials", "Percent"],
      rateItems.map(function (item) {
        return [ageLabel(item.age), sizeLabel(item.size), String(item.successes), String(item.trials), percent(item.successes, item.trials)];
      })
    ));
    var trialItems = [1, 2, 3, 4].map(function (trial) {
      var matching = rows.filter(function (row) { return row.trial === trial; });
      return {
        trial: trial,
        successes: matching.reduce(function (sum, row) { return sum + row.success; }, 0),
        trials: matching.length
      };
    }).filter(function (item) { return item.trials > 0; });
    drawBars("trials", "trials-table", trialItems, function (item) {
      return ["Trial " + item.trial, item.trial === 4 ? "Generalization" : "Test"];
    }, function (item) {
      return item.trial === 4 ? "#ee871f" : "#5aa276";
    });
    document.getElementById("trials-table").appendChild(table(
      ["Trial", "Kind", "Successful trials", "Trials", "Percent"],
      trialItems.map(function (item) {
        return [String(item.trial), item.trial === 4 ? "Generalization" : "Test", String(item.successes), String(item.trials), percent(item.successes, item.trials)];
      })
    ));
  }

  function update() {
    var rows = filtered();
    if (!rows.length) {
      views.hidden = true;
      summary.textContent = "Nothing in the data matches these filters.";
      return;
    }
    views.hidden = false;
    draw(rows);
  }

  document.getElementById("filters").addEventListener("change", update);
  fetch("trials.json")
    .then(function (response) {
      if (!response.ok) throw new Error("missing");
      return response.json();
    })
    .then(function (data) {
      trials = data;
      update();
    })
    .catch(function () {
      views.hidden = true;
      summary.textContent = "The recorded scores did not load.";
    });
})();
