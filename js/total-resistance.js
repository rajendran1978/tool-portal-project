// Total resistance solver: series adds values, parallel adds their reciprocals.
// The resistors are the load on a 12 V battery; the bulb gets brighter as total resistance falls.
(function () {
  var VOLTS = 12;
  var MAX_ROWS = 6;
  var FULL_POWER = 14.4; // watts at 10 ohms, shown as 100% brightness
  var HELP = {
    series: "Series means the resistors sit in a single line, so their values add up.",
    parallel: "Parallel means the resistors sit side by side, so the total is lower than the smallest one."
  };

  var rowsEl = document.getElementById("rows");
  var addButton = document.getElementById("add");
  var helpEl = document.getElementById("mode-help");
  var svg = document.getElementById("circuit");
  var count = 0;

  // The slider position is the power of ten, times 1000: 0 is 1 ohm, 6000 is 1 megohm.
  function ohmsFromPosition(position) {
    return Number(Math.pow(10, position / 1000).toPrecision(3));
  }

  function formatOhms(ohms) {
    var unit = "Ω";
    var value = ohms;
    if (ohms >= 1000000) {
      unit = "MΩ";
      value = ohms / 1000000;
    } else if (ohms >= 1000) {
      unit = "kΩ";
      value = ohms / 1000;
    }
    return Number(value.toPrecision(3)) + " " + unit;
  }

  function formatSmall(value, unit) {
    if (value >= 1) return Number(value.toPrecision(3)) + " " + unit;
    if (value >= 0.001) return Number((value * 1000).toPrecision(3)) + " m" + unit;
    return Number((value * 1000000).toPrecision(3)) + " µ" + unit;
  }

  function mode() {
    return document.querySelector('input[name="mode"]:checked').value;
  }

  function addRow(position) {
    count += 1;
    var row = document.createElement("div");
    row.className = "row";

    var label = document.createElement("label");
    label.textContent = "Resistor " + count;
    label.setAttribute("for", "value-" + count);

    var slider = document.createElement("input");
    slider.type = "range";
    slider.id = "value-" + count;
    slider.min = "0";
    slider.max = "6000";
    slider.step = "20";
    slider.value = String(position);

    var output = document.createElement("output");
    output.setAttribute("for", slider.id);

    var remove = document.createElement("button");
    remove.type = "button";
    remove.className = "button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", "Remove resistor " + count);
    remove.addEventListener("click", function () {
      if (rowsEl.children.length > 1) {
        rowsEl.removeChild(row);
        calculate();
      }
    });

    row.appendChild(label);
    row.appendChild(slider);
    row.appendChild(output);
    row.appendChild(remove);
    rowsEl.appendChild(row);
  }

  function calculate() {
    helpEl.textContent = HELP[mode()];
    var values = [];
    var rows = rowsEl.children;

    for (var i = 0; i < rows.length; i++) {
      var slider = rows[i].querySelector("input");
      var ohms = ohmsFromPosition(Number(slider.value));
      var text = formatOhms(ohms);
      rows[i].querySelector("output").textContent = text;
      slider.setAttribute("aria-valuetext", text);
      rows[i].querySelector("button").disabled = rows.length === 1;
      values.push(ohms);
    }
    addButton.disabled = rows.length >= MAX_ROWS;

    var total;
    if (mode() === "series") {
      total = values.reduce(function (sum, r) { return sum + r; }, 0);
    } else {
      total = 1 / values.reduce(function (sum, r) { return sum + 1 / r; }, 0);
    }

    var current = VOLTS / total;
    var power = VOLTS * current;
    var brightness = Math.min(1, Math.pow(power / FULL_POWER, 0.4));

    document.getElementById("result").textContent = formatOhms(total);
    document.getElementById("current").textContent = formatSmall(current, "A");
    document.getElementById("power").textContent = formatSmall(power, "W");
    document.getElementById("brightness").textContent = Math.round(brightness * 100) + "%";
    window.drawCircuit(svg, mode(), values.map(formatOhms), brightness);
  }

  addButton.addEventListener("click", function () {
    if (rowsEl.children.length < MAX_ROWS) {
      addRow(2000);
      calculate();
    }
  });
  document.getElementById("solver").addEventListener("input", calculate);
  document.getElementById("solver").addEventListener("change", calculate);
  document.getElementById("solver").addEventListener("submit", function (e) {
    e.preventDefault();
  });

  addRow(2000);
  addRow(2300);
  calculate();
})();
