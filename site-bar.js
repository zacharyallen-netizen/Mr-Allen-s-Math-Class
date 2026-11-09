/* ==========================================================================
   Mr. Allen's Math Class — shared top bar
   One file draws the top bar on every page of the site.
   To change a link, edit the LINKS list below. Paths are from the site root.
   The bar's styles live inside a shadow root, so they never change how a
   page, game, or worksheet looks, and a page's styles never change the bar.
   ========================================================================== */
(function () {
  var LINKS = [
    { label: "8th Grade",      href: "grade8/index.html",            section: "grade8/" },
    { label: "NC Math 1",      href: "math1/index.html",             section: "math1/" },
    { label: "Grading & Standards", href: "grade8/grading.html", section: "grade8/targets/" },
    { label: "Arcade",         href: "grade8/arcade.html" },
    { label: "Reset Room",     href: "grade8/reset-room.html", section: "grade8/ripples" },
    { label: "Chill Math Music", href: "grade8/drift.html" },
    { label: "Calculators", menu: [
        { label: "Desmos Scientific Calculator", href: "https://www.desmos.com/scientific" },
        { label: "Desmos Graphing Calculator",   href: "https://www.desmos.com/calculator" } ] },
    { label: "NC Check-Ins / Benchmarks", href: "grade8/benchmarks.html" },
    { label: "EOG Prep",       href: "grade8/8th_grade_eog_hub.html" },
    { label: "Class Info",     href: "class-information.html" }
  ];

  var me = document.currentScript;
  if (!me || document.getElementById("site-bar")) return;
  var root = me.src.replace(/site-bar\.js(\?.*)?$/, "");          // site root URL
  var here = location.href.split("#")[0].split("?")[0];
  var rel  = here.indexOf(root) === 0 ? here.slice(root.length) : "";
  if (rel === "" || /\/$/.test(rel)) rel += "index.html";

  // Current page: an exact link match wins; otherwise the course section.
  var current = -1;
  LINKS.forEach(function (l, i) { if (rel === l.href) current = i; });
  var best = 0;
  if (current < 0) LINKS.forEach(function (l, i) {   // longest matching section wins (a section can be a list)
    [].concat(l.section || []).forEach(function (sec) { if (rel.indexOf(sec) === 0 && sec.length > best) { best = sec.length; current = i; } });
  });

  // Fonts (shared with the page; harmless if already loaded or blocked)
  if (!document.querySelector('link[data-site-fonts]')) {
    var f = document.createElement("link");
    f.rel = "stylesheet"; f.setAttribute("data-site-fonts", "");
    f.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,600&display=swap";
    document.head.appendChild(f);
  }

  // The slim row of page-specific links (e.g. "← Unit 5", U1–U9) that some
  // pages keep under the bar. Styled here so it looks the same on every page.
  if (!document.getElementById("sb-local-css")) {
    var st = document.createElement("style");
    st.id = "sb-local-css";
    st.textContent =
      ".sb-local{display:flex;flex-wrap:wrap;align-items:center;gap:4px 20px;margin:0;padding:10px max(20px,calc((100% - 1080px)/2));" +
      "background:#fff;border-bottom:1px solid #E3E5EA;font:500 14px/1.5 Inter,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;position:relative;z-index:999}" +
      ".sb-local a,.sb-local button{color:#1E2D4F;text-decoration:none;background:none;border:0;padding:4px 0;font:inherit;cursor:pointer;" +
      "border-bottom:2px solid transparent}" +
      ".sb-local a:hover,.sb-local button:hover{border-bottom-color:#E0A800}" +
      ".sb-local a.active,.sb-local a[aria-current]{border-bottom-color:#E0A800;font-weight:600}" +
      ".sb-local a:focus-visible,.sb-local button:focus-visible{outline:2px solid #E0A800;outline-offset:3px}" +
      "@media print{.sb-local{display:none}}";
    document.head.appendChild(st);
  }

  var host = document.createElement("div");
  host.id = "site-bar";
  host.setAttribute("role", "banner");
  var sr = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;

  var css =
    ":host{all:initial;display:block;position:relative;z-index:1000}" +
    "*{box-sizing:border-box}" +
    ".bar{background:#1E2D4F;color:#fff;font-family:Inter,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased}" +
    ".in{max-width:1320px;margin:0 auto;padding:0 20px;height:56px;display:flex;align-items:center;gap:28px}" +
    ".mark{color:#fff;text-decoration:none;display:flex;align-items:baseline;gap:8px;white-space:nowrap;margin-right:auto}" +
    ".mark b{font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:19px;letter-spacing:.005em}" +
    ".mark span{font-size:13px;color:#AEB7C8;letter-spacing:.04em}" +
    "nav{display:flex;align-items:center;gap:24px}" +
    "nav a{color:#D9DEE8;text-decoration:none;font-size:14.5px;font-weight:500;padding:18px 0 16px;border-bottom:2px solid transparent;white-space:nowrap}" +
    "nav a:hover{color:#fff}" +
    "nav a[aria-current]{color:#fff;border-bottom-color:#FFC107}" +
    "a:focus-visible,button:focus-visible{outline:2px solid #FFC107;outline-offset:3px;border-radius:2px}" +
    ".menu{display:none;background:none;border:1px solid rgba(255,255,255,.28);color:#fff;font:500 14px Inter,system-ui,sans-serif;border-radius:6px;height:36px;padding:0 14px;cursor:pointer}" +
    ".dd{position:relative;display:flex;align-items:center}" +
    ".ddb{background:none;border:0;border-bottom:2px solid transparent;color:#D9DEE8;font:500 14.5px Inter,system-ui,sans-serif;padding:18px 0 16px;cursor:pointer;white-space:nowrap;display:flex;align-items:center;gap:5px}" +
    ".ddb:hover,.ddb[aria-expanded=true]{color:#fff}.ddb svg{width:10px;height:10px;transition:transform .15s}.ddb[aria-expanded=true] svg{transform:rotate(180deg)}" +
    ".ddm{position:absolute;right:0;top:calc(100% - 4px);background:#fff;border-radius:10px;box-shadow:0 12px 30px rgba(15,23,42,.25);padding:6px;min-width:250px;z-index:5}" +
    ".ddm[hidden]{display:none}" +
    "nav .ddm a{display:flex;justify-content:space-between;gap:12px;color:#1E2D4F;font-size:15px;font-weight:600;padding:11px 12px;border:0;border-radius:7px;white-space:nowrap}" +
    "nav .ddm a:hover{background:#FFF6D6;color:#1E2D4F}.ddm small{color:#5B6576;font-weight:500}" +
    // Sizes are chosen by measuring (see fitNav below): t1 = tighter, t2 = tightest, mob = Menu button.
    ".t1 nav,.t2 nav{gap:14px}.t1 nav a,.t1 .ddb{font-size:14px}.t1 .in{gap:18px}" +
    ".t2 nav{gap:11px}.t2 nav a,.t2 .ddb{font-size:13.5px}.t2 .in{gap:14px;padding:0 16px}.t2 .mark span{display:none}" +
    ".mob .in{gap:12px}" +
    ".mob .menu{display:inline-flex;align-items:center;gap:8px}" +
    ".mob nav{display:none;position:absolute;left:0;right:0;top:56px;background:#1E2D4F;flex-direction:column;align-items:stretch;gap:0;padding:4px 20px 12px;box-shadow:0 10px 24px rgba(15,23,42,.25)}" +
    ".mob.open nav{display:flex}" +
    ".mob nav a{padding:13px 0;border-bottom:1px solid rgba(255,255,255,.1);font-size:16px}" +
    ".mob nav a:last-child{border-bottom:0}" +
    ".mob .dd{display:block}.mob .ddb{width:100%;padding:13px 0;font-size:16px;border-bottom:1px solid rgba(255,255,255,.1);justify-content:space-between}" +
    ".mob .ddm{position:static;box-shadow:none;background:rgba(255,255,255,.06);margin:6px 0 8px;min-width:0}" +
    ".mob nav .ddm a{color:#fff;font-size:15.5px;border-bottom:0}.mob nav .ddm a:hover{background:rgba(255,255,255,.1);color:#fff}.mob .ddm small{color:#AEB7C8}" +
    ".mob nav a[aria-current]{border-bottom-color:rgba(255,255,255,.1);box-shadow:inset 3px 0 0 #FFC107;padding-left:12px}" +
    "@media (max-width:380px){.mark span{display:none}}" +
    "@media print{.bar{display:none}}";

  var nav = LINKS.map(function (l, i) {
    if (l.menu) return '<div class="dd"><button type="button" class="ddb" aria-expanded="false" aria-controls="sb-dd' + i + '">' + l.label +
      '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button>' +
      '<div class="ddm" id="sb-dd' + i + '" hidden>' + l.menu.map(function (m) {
        return '<a href="' + m.href + '" target="_blank" rel="noopener">' + m.label + ' <small>opens in a new tab ↗</small></a>';
      }).join("") + "</div></div>";
    return '<a href="' + root + l.href + '"' + (i === current ? ' aria-current="page"' : "") + ">" + l.label + "</a>";
  }).join("");

  sr.innerHTML =
    "<style>" + css + "</style>" +
    '<div class="bar"><div class="in">' +
      '<a class="mark" href="' + root + 'index.html"><b>Mr. Allen</b><span>Mathematics</span></a>' +
      '<button type="button" class="menu" aria-expanded="false" aria-controls="sb-nav">Menu</button>' +
      '<nav id="sb-nav" aria-label="Site">' + nav + "</nav>" +
    "</div></div>";

  var bar = sr.querySelector(".bar"), btn = sr.querySelector(".menu");
  btn.addEventListener("click", function () {
    var open = bar.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.textContent = open ? "Close" : "Menu";
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && bar.classList.contains("open")) btn.click();
  });

  // Fit the links: try full size, then tighter, then tightest; if they still do not fit, use the Menu button.
  var inEl = sr.querySelector(".in");
  function fitNav() {
    var steps = ["", "t1", "t2", "mob"];
    for (var k = 0; k < steps.length; k++) {
      bar.classList.remove("t1", "t2", "mob");
      if (steps[k]) bar.classList.add(steps[k]);
      if (steps[k] === "mob") break;
      if (window.innerWidth >= 700 && inEl.scrollWidth <= inEl.clientWidth + 1) break;
    }
    if (!bar.classList.contains("mob") && bar.classList.contains("open")) { bar.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.textContent = "Menu"; }
  }
  fitNav();
  window.addEventListener("resize", fitNav);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNav);
  window.addEventListener("load", fitNav);

  // Calculators list: open and close it; close when clicking elsewhere or pressing Escape
  [].forEach.call(sr.querySelectorAll(".ddb"), function (b) {
    var m = sr.getElementById ? sr.getElementById(b.getAttribute("aria-controls")) : sr.querySelector("#" + b.getAttribute("aria-controls"));
    function set(open) { b.setAttribute("aria-expanded", open ? "true" : "false"); m.hidden = !open; }
    b.addEventListener("click", function (e) { e.stopPropagation(); set(m.hidden); });
    m.addEventListener("click", function (e) { e.stopPropagation(); if (e.target.closest("a")) setTimeout(function () { set(false); }, 0); });
    document.addEventListener("click", function () { set(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !m.hidden) { set(false); b.focus(); } });
  });

  // Some pages pad, center or flex their <body>. Stretch the bar (and the slim
  // row of page links, if any) to the full width of the window and pull it up to
  // the very top, whatever the page's own layout is. The top space the page had
  // (its body padding and margin) is then given back UNDER the bar / slim row,
  // so the page's first line keeps its own breathing room.
  function px(v) { return parseFloat(v) || 0; }
  function fit() {
    var w = document.documentElement.clientWidth;
    var local = document.querySelector("body > .sb-local");
    var last = local || host;
    [host, local].forEach(function (el, i) {
      if (!el) return;
      el.style.alignSelf = "stretch"; el.style.flex = "none"; el.style.boxSizing = "border-box";
      el.style.marginLeft = "0px"; el.style.marginRight = "0px"; el.style.width = w + "px";
      if (i === 0) el.style.marginTop = "0px";
      var r = el.getBoundingClientRect();
      el.style.marginLeft = -(r.left + window.scrollX) + "px";
      if (i === 0) {
        var off = Math.max(0, r.top + window.scrollY);
        el.style.marginTop = -off + "px";
        // What the page itself put above its content (not any centering offset).
        var b = getComputedStyle(document.body), h = getComputedStyle(document.documentElement);
        var pad = px(b.paddingTop) + px(b.borderTopWidth) + px(h.paddingTop) + px(h.borderTopWidth);
        var mar = px(b.marginTop) + px(h.marginTop);
        pad = Math.min(pad, off); mar = Math.min(mar, off - pad);
        host.style.paddingBottom = "0px"; host.style.marginBottom = "0px";
        if (local) local.style.marginBottom = "0px";
        if (last === host) {
          // padding keeps the page's own padding exactly; margin still collapses
          // with the first element's margin, as the body margin used to.
          host.style.paddingBottom = pad + "px";
          host.style.marginBottom = mar + "px";
        } else {
          last.style.marginBottom = (pad + mar) + "px";
        }
      }
    });
  }
  function mount() {
    document.body.insertBefore(host, document.body.firstChild);
    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("load", fit);
    document.addEventListener("DOMContentLoaded", fit);
  }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
