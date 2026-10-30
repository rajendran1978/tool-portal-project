// Total resistance solver: series adds values, parallel adds their reciprocals.
(function () {
  var UNITS = { "Ω": 1, "kΩ": 1000, "MΩ": 1000000 };
  var HELP = {
    series: "Series means the resistors sit in a single line, so their values add up.",
    parallel: "Parallel means the resistors sit side by side, so the total is lower than the smallest one."
  };

  var rowsEl = document.getElementById("rows");
  var resultEl = document.getElementById("result");
  var helpEl = document.getElementById("mode-help");
  var count = 0;

  function addRow() {
    count += 1;
    var row = document.createElement("div");
    row.className = "row";

    var label = document.createElement("label");
    label.textContent = "Resistor " + count;
    label.setAttribute("for", "value-" + count);

    var input = document.createElement("input");
    input.type = "number";
    input.id = "value-" + count;
    input.min = "0";
    input.step = "any";
    input.inputMode = "decimal";

    var select = document.createElement("select");
    select.setAttribute("aria-label", "Unit for resistor " + count);
    Object.keys(UNITS).forEach(function (name) {
      var option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });

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
    row.appendChild(input);
    row.appendChild(select);
    row.appendChild(remove);
    rowsEl.appendChild(row);
  }

  function mode() {
    return document.querySelector('input[name="mode"]:checked').value;
  }

  function format(ohms) {
    var unit = "Ω";
    var value = ohms;
    if (ohms >= 1000000) {
      unit = "MΩ";
      value = ohms / 1000000;
    } else if (ohms >= 1000) {
      unit = "kΩ";
      value = ohms / 1000;
    }
    return Number(value.toPrecision(4)) + " " + unit;
  }

  function calculate() {
    helpEl.textContent = HELP[mode()];
    var values = [];
    var rows = rowsEl.children;

    for (var i = 0; i < rows.length; i++) {
      var raw = rows[i].querySelector("input").value;
      var unit = rows[i].querySelector("select").value;
      var number = parseFloat(raw);
      if (raw.trim() === "" || isNaN(number)) {
        resultEl.textContent = "Enter a value for every resistor.";
        return;
      }
      if (number < 0) {
        resultEl.textContent = "Resistor values cannot be negative.";
        return;
      }
      values.push(number * UNITS[unit]);
    }

    var total;
    if (mode() === "series") {
      total = values.reduce(function (sum, r) { return sum + r; }, 0);
    } else if (values.indexOf(0) !== -1) {
      total = 0;
    } else {
      total = 1 / values.reduce(function (sum, r) { return sum + 1 / r; }, 0);
    }
    resultEl.textContent = format(total);
  }

  document.getElementById("add").addEventListener("click", function () {
    addRow();
    calculate();
  });
  document.getElementById("solver").addEventListener("input", calculate);
  document.getElementById("solver").addEventListener("change", calculate);
  document.getElementById("solver").addEventListener("submit", function (e) {
    e.preventDefault();
  });

  addRow();
  addRow();
  calculate();
})();
