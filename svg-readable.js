/* SVG-READABLE — keeps picture labels readable on phones.
   A drawing made for a computer screen shrinks on a phone, and its labels can get tiny.
   This enlarges only the labels that would show smaller than 12 px, only as much as needed,
   and gives them a white outline so they stay clear over lines. Nothing changes on big screens.
   Include once per page:  <script src="../svg-readable.js"></script>                       */
(function () {
  var MIN = 12.5;
  function fix() {
    var svgs = document.querySelectorAll('svg');
    for (var i = 0; i < svgs.length; i++) {
      var svg = svgs[i], vb = svg.viewBox && svg.viewBox.baseVal, w = svg.getBoundingClientRect().width;
      if (!vb || !vb.width || !w) continue;
      var scale = w / vb.width, texts = svg.querySelectorAll('text');
      for (var j = 0; j < texts.length; j++) {
        var t = texts[j];
        if (!t.hasAttribute('data-fs0')) t.setAttribute('data-fs0', parseFloat(getComputedStyle(t).fontSize) || 12);
        var fs0 = +t.getAttribute('data-fs0'), need = MIN / scale;
        if (fs0 * scale < MIN) {
          t.style.fontSize = need.toFixed(2) + 'px';
          if (!t.getAttribute('stroke')) { t.style.paintOrder = 'stroke'; t.style.stroke = '#fff'; t.style.strokeWidth = (need * 0.28).toFixed(2) + 'px'; t.style.strokeLinejoin = 'round'; }
          // never grow a label past the picture's edge: a long caption keeps the largest size that still fits
          try { var bb = t.getBBox(), over = Math.max(vb.x - bb.x, bb.x + bb.width - (vb.x + vb.width));
            if (over > 0 && bb.width > 0) { var fit = need * (bb.width - 2 * over - 2) / bb.width; t.style.fontSize = Math.max(fs0, fit).toFixed(2) + 'px'; } } catch (e) {}
        } else if (t.style.fontSize) { t.style.fontSize = ''; t.style.stroke = ''; t.style.strokeWidth = ''; }
      }
    }
  }
  var timer; function later() { clearTimeout(timer); timer = setTimeout(fix, 120); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fix); else fix();
  window.addEventListener('load', fix); window.addEventListener('resize', later);
  document.addEventListener('click', function () { setTimeout(fix, 60); });      // pictures that appear after an answer
  window.SVGReadable = { fix: fix };
})();
