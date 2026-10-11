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
    { label: "Arcade",         href: "grade8/arcade.html" },
    { label: "EOG Prep",       href: "grade8/8th_grade_eog_hub.html" },
    { label: "Class Info",     href: "class-information.html" },
    { label: "Meet Mr. Allen", href: "about.html" }
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
  if (current < 0) LINKS.forEach(function (l, i) {
    if (current < 0 && l.section && rel.indexOf(l.section) === 0) current = i;
  });

  // Fonts (shared with the page; harmless if already loaded or blocked)
  if (!document.querySelector('link[data-site-fonts]')) {
    var f = document.createElement("link");
    f.rel = "stylesheet"; f.setAttribute("data-site-fonts", "");
    f.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,600&display=swap";
    document.head.appendChild(f);
  }

  var host = document.createElement("div");
  host.id = "site-bar";
  host.setAttribute("role", "banner");
  var sr = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;

  var css =
    ":host{all:initial;display:block;position:relative;z-index:1000}" +
    "*{box-sizing:border-box}" +
    ".bar{background:#1E2D4F;color:#fff;font-family:Inter,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased}" +
    ".in{max-width:1120px;margin:0 auto;padding:0 20px;height:56px;display:flex;align-items:center;gap:28px}" +
    ".mark{color:#fff;text-decoration:none;display:flex;align-items:baseline;gap:8px;white-space:nowrap;margin-right:auto}" +
    ".mark b{font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:19px;letter-spacing:.005em}" +
    ".mark span{font-size:13px;color:#AEB7C8;letter-spacing:.04em}" +
    "nav{display:flex;align-items:center;gap:24px}" +
    "nav a{color:#D9DEE8;text-decoration:none;font-size:14.5px;font-weight:500;padding:18px 0 16px;border-bottom:2px solid transparent;white-space:nowrap}" +
    "nav a:hover{color:#fff}" +
    "nav a[aria-current]{color:#fff;border-bottom-color:#FFC107}" +
    "a:focus-visible,button:focus-visible{outline:2px solid #FFC107;outline-offset:3px;border-radius:2px}" +
    "button{display:none;background:none;border:1px solid rgba(255,255,255,.28);color:#fff;font:500 14px Inter,system-ui,sans-serif;border-radius:6px;height:36px;padding:0 14px;cursor:pointer}" +
    "@media (max-width:860px){" +
      ".in{gap:12px}" +
      "button{display:inline-flex;align-items:center;gap:8px}" +
      "nav{display:none;position:absolute;left:0;right:0;top:56px;background:#1E2D4F;flex-direction:column;align-items:stretch;gap:0;padding:4px 20px 12px;box-shadow:0 10px 24px rgba(15,23,42,.25)}" +
      ".open nav{display:flex}" +
      "nav a{padding:13px 0;border-bottom:1px solid rgba(255,255,255,.1);font-size:16px}" +
      "nav a:last-child{border-bottom:0}" +
      "nav a[aria-current]{border-bottom-color:rgba(255,255,255,.1);box-shadow:inset 3px 0 0 #FFC107;padding-left:12px}" +
    "}" +
    "@media (max-width:380px){.mark span{display:none}}" +
    "@media print{.bar{display:none}}";

  var nav = LINKS.map(function (l, i) {
    return '<a href="' + root + l.href + '"' + (i === current ? ' aria-current="page"' : "") + ">" + l.label + "</a>";
  }).join("");

  sr.innerHTML =
    "<style>" + css + "</style>" +
    '<div class="bar"><div class="in">' +
      '<a class="mark" href="' + root + 'index.html"><b>Mr. Allen</b><span>Mathematics</span></a>' +
      '<button type="button" aria-expanded="false" aria-controls="sb-nav">Menu</button>' +
      '<nav id="sb-nav" aria-label="Site">' + nav + "</nav>" +
    "</div></div>";

  var bar = sr.querySelector(".bar"), btn = sr.querySelector("button");
  btn.addEventListener("click", function () {
    var open = bar.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.textContent = open ? "Close" : "Menu";
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && bar.classList.contains("open")) btn.click();
  });

  function mount() { document.body.insertBefore(host, document.body.firstChild); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
