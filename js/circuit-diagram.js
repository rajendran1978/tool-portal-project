// Draws the circuit: 12 V battery on the left, light bulb on the right,
// and the resistors across the top, either in a line (series) or stacked (parallel).
(function () {
  var WIDTH = 480;
  var LEFT = 72;
  var RIGHT = 410;
  var TOP = 50;
  var ZIGZAG = [[0, 0], [0.125, 0], [0.25, -9], [0.417, 9], [0.583, -9], [0.75, 9], [0.875, 0], [1, 0]];

  function path(d, cls) {
    return '<path class="' + (cls || "wire") + '" d="' + d + '"/>';
  }

  function segment(x1, y1, x2, y2) {
    return path("M" + x1 + " " + y1 + "L" + x2 + " " + y2);
  }

  function label(x, y, text, anchor) {
    return '<text class="label" x="' + x + '" y="' + y + '" text-anchor="' + (anchor || "middle") + '">' + text + "</text>";
  }

  function resistor(cx, y, width) {
    var x0 = cx - width / 2;
    var d = ZIGZAG.map(function (p, i) {
      return (i === 0 ? "M" : "L") + (x0 + p[0] * width).toFixed(1) + " " + (y + p[1]);
    }).join("");
    return path(d);
  }

  function battery(mid, bottom) {
    return segment(LEFT, TOP, LEFT, mid - 14) +
      segment(LEFT - 18, mid - 14, LEFT + 18, mid - 14) +
      segment(LEFT - 10, mid + 8, LEFT + 10, mid + 8).replace('class="wire"', 'class="plate"') +
      segment(LEFT, mid + 8, LEFT, bottom) +
      label(LEFT + 28, mid - 12, "+", "start") +
      label(LEFT + 28, mid + 16, "−", "start") +
      label(LEFT - 24, mid + 5, "12 V", "end");
  }

  function bulb(mid, bottom, brightness) {
    var b = brightness.toFixed(3);
    return '<circle cx="' + RIGHT + '" cy="' + mid + '" r="44" fill="url(#bulb-glow)" opacity="' + b + '"/>' +
      '<circle class="bulb-base" cx="' + RIGHT + '" cy="' + mid + '" r="24"/>' +
      '<circle cx="' + RIGHT + '" cy="' + mid + '" r="24" fill="#ffd54a" fill-opacity="' + b + '"/>' +
      segment(RIGHT, TOP, RIGHT, mid - 24) +
      segment(RIGHT, mid + 24, RIGHT, bottom) +
      '<circle class="wire" cx="' + RIGHT + '" cy="' + mid + '" r="24"/>' +
      path("M" + (RIGHT - 12) + " " + (mid - 12) + "L" + (RIGHT + 12) + " " + (mid + 12) +
        "M" + (RIGHT + 12) + " " + (mid - 12) + "L" + (RIGHT - 12) + " " + (mid + 12), "halo") +
      path("M" + (RIGHT - 12) + " " + (mid - 12) + "L" + (RIGHT + 12) + " " + (mid + 12) +
        "M" + (RIGHT + 12) + " " + (mid - 12) + "L" + (RIGHT - 12) + " " + (mid + 12)) +
      label(RIGHT - 32, mid + 5, "Bulb", "end");
  }

  function series(labels) {
    var start = 116;
    var end = 368;
    var slot = (end - start) / labels.length;
    var width = Math.min(56, slot - 12);
    var out = "";
    var previous = LEFT;
    labels.forEach(function (text, i) {
      var cx = start + slot * (i + 0.5);
      out += segment(previous, TOP, cx - width / 2, TOP) + resistor(cx, TOP, width);
      out += label(cx, i % 2 === 0 ? TOP - 16 : TOP + 30, text);
      previous = cx + width / 2;
    });
    out += segment(previous, TOP, RIGHT, TOP);
    return { svg: out, bottom: 190 };
  }

  function parallel(labels) {
    var railLeft = 160;
    var railRight = 330;
    var gap = 52;
    var last = TOP + (labels.length - 1) * gap;
    var out = segment(LEFT, TOP, railLeft, TOP) + segment(railRight, TOP, RIGHT, TOP) +
      segment(railLeft, TOP, railLeft, last) + segment(railRight, TOP, railRight, last);
    labels.forEach(function (text, i) {
      var y = TOP + i * gap;
      out += segment(railLeft, y, 190, y) + resistor(245, y, 100) + segment(300, y, railRight, y);
      out += label(245, y - 18, text);
    });
    return { svg: out, bottom: Math.max(190, last + 60) };
  }

  // mode: "series" or "parallel"; labels: text for each resistor; brightness: 0 to 1
  window.drawCircuit = function (svg, mode, labels, brightness) {
    var network = mode === "series" ? series(labels) : parallel(labels);
    var bottom = network.bottom;
    var mid = (TOP + bottom) / 2;
    var defs = '<defs><radialGradient id="bulb-glow"><stop offset="0" stop-color="#ffc93c" stop-opacity="0.9"/>' +
      '<stop offset="1" stop-color="#ffc93c" stop-opacity="0"/></radialGradient></defs>';

    svg.setAttribute("viewBox", "0 0 " + WIDTH + " " + (bottom + 50));
    svg.setAttribute("aria-label", "Circuit: a 12 volt battery, " + labels.length +
      (labels.length === 1 ? " resistor" : " resistors") + " in " + mode + ", and a light bulb.");
    svg.innerHTML = defs + network.svg + segment(RIGHT, bottom, LEFT, bottom) + battery(mid, bottom) + bulb(mid, bottom, brightness);
  };
})();
