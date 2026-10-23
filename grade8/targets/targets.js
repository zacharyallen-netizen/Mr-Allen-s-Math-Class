/* ==========================================================================
   I Can Targets — makes each question card interactive.
   • Choices are shuffled every visit, so the answer is never always "A".
   • Wrong pick: a short nudge about that mistake; try again.
     After two misses the "Show answer" button appears.
   • Right pick: the worked steps open and the target is marked solved.
   • Solved targets are remembered in this browser only (localStorage).
   ========================================================================== */
(function () {
  "use strict";
  var KEY = "ican-solved-v1";
  var solved = {};
  try { solved = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { solved = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(solved)); } catch (e) {} }
  var LETTERS = "ABCDEF";

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  function setupCard(card) {
    var box = card.querySelector(".choices");
    if (!box) return;
    var btns = Array.prototype.slice.call(box.querySelectorAll(".ch"));
    var fb = card.querySelector(".fb");
    var ex = card.querySelector(".explain");
    var hintBtn = card.querySelector(".btn-hint");
    var hintBox = card.querySelector(".hintbox");
    var showBtn = card.querySelector(".btn-show");
    var againBtn = card.querySelector(".btn-again");
    var misses = 0;

    function letterize() {
      Array.prototype.slice.call(box.querySelectorAll(".ch")).forEach(function (b, i) {
        b.querySelector(".lt").textContent = LETTERS[i];
      });
    }
    function order() {
      shuffle(btns.slice()).forEach(function (b) { box.appendChild(b); });
      letterize();
    }
    function reset() {
      misses = 0;
      btns.forEach(function (b) { b.disabled = false; b.classList.remove("right", "wrong", "dim"); b.setAttribute("aria-pressed", "false"); });
      fb.textContent = ""; fb.className = "fb";
      ex.hidden = true;
      if (hintBox) hintBox.hidden = true;
      if (showBtn) showBtn.hidden = true;
      againBtn.hidden = true;
      order();
    }
    function finish(gotIt) {
      btns.forEach(function (b) {
        b.disabled = true;
        if (b.dataset.ok === "1") b.classList.add("right");
        else if (!b.classList.contains("wrong")) b.classList.add("dim");
      });
      ex.hidden = false;
      if (showBtn) showBtn.hidden = true;
      againBtn.hidden = false;
      if (gotIt) {
        solved[card.id] = 1; save();
        card.classList.add("solved");
        refreshCounts();
      }
    }

    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.disabled) return;
        b.setAttribute("aria-pressed", "true");
        var note = b.querySelector(".why") ? b.querySelector(".why").innerHTML : "";
        if (b.dataset.ok === "1") {
          fb.className = "fb ok";
          fb.innerHTML = "<b>" + (misses ? "Yes — you fixed it." : "Correct!") + "</b> " + note;
          finish(true);
        } else {
          misses++;
          b.classList.add("wrong"); b.disabled = true;
          fb.className = "fb no";
          fb.innerHTML = "<b>Not quite.</b> " + note + (misses === 1 ? " Try again." : "");
          if (misses >= 2 && showBtn) showBtn.hidden = false;
        }
      });
    });
    if (hintBtn) hintBtn.addEventListener("click", function () { hintBox.hidden = !hintBox.hidden; });
    if (showBtn) showBtn.addEventListener("click", function () {
      fb.className = "fb no"; fb.innerHTML = "<b>Here's the answer.</b> Read the steps, then try it again later.";
      finish(false);
    });
    againBtn.addEventListener("click", reset);

    if (solved[card.id]) card.classList.add("solved");
    reset();
  }

  /* ---------- progress counts ---------- */
  function refreshCounts() {
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var codes = el.getAttribute("data-count").split(",").filter(Boolean);
      var n = codes.filter(function (c) { return solved[c]; }).length;
      var b = el.querySelector("b"); if (b) b.textContent = n + " / " + codes.length;
      var i = el.querySelector(".bar i"); if (i) i.style.width = (codes.length ? 100 * n / codes.length : 0) + "%";
    });
    applyFilter();
  }

  /* ---------- level filter ---------- */
  var filter = "all";
  function applyFilter() {
    document.querySelectorAll(".tg").forEach(function (c) {
      var show = filter === "all" || (filter === "todo" ? !solved[c.id] : c.dataset.level === filter);
      c.hidden = !show;
    });
    document.querySelectorAll(".lvl-h").forEach(function (h) {
      var sib = h.nextElementSibling, any = false;
      while (sib && sib.classList.contains("tg")) { if (!sib.hidden) any = true; sib = sib.nextElementSibling; }
      h.hidden = !any;
    });
  }
  document.querySelectorAll(".filters button").forEach(function (b) {
    b.addEventListener("click", function () {
      filter = b.dataset.f;
      document.querySelectorAll(".filters button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      applyFilter();
    });
  });

  /* ---------- tap a coordinate graph to read a point ---------- */
  document.querySelectorAll("svg.coordsvg").forEach(function (svg) {
    var fig = svg.closest("figure"); var out = fig && fig.querySelector(".readout");
    if (!out) return;
    var d = svg.dataset;
    function read(ev) {
      var pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
      var m = svg.getScreenCTM(); if (!m) return;
      var p = pt.matrixTransform(m.inverse());
      var sx = +d.sx, sy = +d.sy;
      var x = +d.x0 + (p.x - +d.ox) / +d.ux, y = +d.y0 + (+d.oy - p.y) / +d.uy;
      x = Math.round(x / sx) * sx; y = Math.round(y / sy) * sy;
      if (x < +d.xmin || x > +d.xmax || y < +d.ymin || y > +d.ymax) { out.textContent = ""; return; }
      var f = function (v) { v = Math.round(v * 100) / 100; return (v < 0 ? "−" + (-v) : "" + v); };
      out.textContent = "Nearest grid point: (" + f(x) + ", " + f(y) + ")";
    }
    svg.addEventListener("pointermove", read);
    svg.addEventListener("pointerdown", read);
    svg.addEventListener("pointerleave", function () { out.textContent = "Tap or hover on the graph to read a point."; });
  });

  /* ---------- reset all (hub) ---------- */
  var rs = document.getElementById("reset-all");
  if (rs) rs.addEventListener("click", function () {
    if (!confirm("Clear every solved check mark saved in this browser?")) return;
    solved = {}; save();
    document.querySelectorAll(".tg.solved").forEach(function (c) { c.classList.remove("solved"); });
    refreshCounts();
  });

  document.querySelectorAll(".tg").forEach(setupCard);
  refreshCounts();

  /* open the explore panel / scroll target when arriving from the tracker */
  if (location.hash) {
    var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (t) setTimeout(function () { t.scrollIntoView({ block: "start" }); }, 60);
  }
})();
