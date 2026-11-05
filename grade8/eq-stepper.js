/* Step-by-step equation helper (Units 3-4 Pre-Test + Tutorial Review).
   Students pick the best next step. The helper then shows the math ("Add 6 to both sides") and the new equation.
   Data comes from _build/u34_steps.py (every line checked there).
   EqStepper.mount(el, data)        – build a helper inside el
   EqStepper.attach({id: data, …})  – add helpers to pre-test cards #q<id>
*/
(function () {
  var CSS = '' +
    '.es{margin-top:10px}' +
    '.es-open{font:600 15px var(--sans,Inter,system-ui,sans-serif);min-height:44px;padding:8px 14px;border-radius:8px;border:1.5px dashed #1E2D4F;background:#FFF6D6;color:#1E2D4F;cursor:pointer}' +
    '.es-open:focus-visible,.es-ch:focus-visible,.es-redo:focus-visible{outline:3px solid #1D4ED8;outline-offset:2px}' +
    '.es-panel{margin-top:8px;border:1px solid #E3E5EA;border-left:4px solid #FFC107;border-radius:8px;background:#fff;padding:10px 12px;text-align:left}' +
    '.es-panel[hidden]{display:none}' +
    '.es-trail{list-style:none;margin:0;padding:0}' +
    '.es-trail li{padding:6px 0;border-bottom:1px solid #EEF0F3}' +
    '.es-trail li:last-child{border-bottom:0}' +
    '.es-move{font:700 12.5px var(--sans,Inter,sans-serif);letter-spacing:.02em;color:#9A6B00;text-transform:none}' +
    '.es-work{font:500 16px "Source Serif 4",Georgia,serif;color:#5B6475}' +
    '.es-line{font:600 19px "Source Serif 4",Georgia,serif;color:#1E2D4F}' +
    '.es-ask{font:600 15px var(--sans,Inter,sans-serif);color:#1E2D4F;margin:10px 0 6px}' +
    '.es-chs{display:flex;flex-direction:column;gap:6px}' +
    '.es-ch{font:500 15.5px var(--sans,Inter,sans-serif);text-align:left;min-height:44px;padding:8px 12px;border-radius:8px;border:1.5px solid #1E2D4F;background:#fff;color:#1E2D4F;cursor:pointer}' +
    '.es-ch.no{border-color:#B42318;background:#FBEAEA;color:#7A1A12}' +
    '.es-fb{min-height:1px;margin-top:6px;font-size:15px;color:#B42318}' +
    '.es-done{margin-top:10px;background:#E7F5EC;border-radius:8px;padding:8px 12px;color:#14532D;font-size:15.5px}' +
    '.es-done b{font-family:"Source Serif 4",Georgia,serif;font-size:18px}' +
    '.es-redo{margin-top:8px;font:600 14px var(--sans,Inter,sans-serif);min-height:44px;padding:6px 12px;border-radius:8px;border:1.5px solid #1E2D4F;background:#fff;color:#1E2D4F;cursor:pointer}' +
    '@media print{.es{display:none!important}}';
  function css() {
    if (document.getElementById('es-css')) return;
    var s = document.createElement('style'); s.id = 'es-css'; s.textContent = CSS; document.head.appendChild(s);
  }
  function mx(t) { return String(t).replace(/(^|[^A-Za-z])x(?![A-Za-z])/g, '$1<i>x</i>'); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  function mount(host, d) {
    css();
    var box = el('div', 'es');
    var open = el('button', 'es-open', 'Step-by-step help');
    open.type = 'button'; open.setAttribute('aria-expanded', 'false');
    var panel = el('div', 'es-panel'); panel.hidden = true;
    box.appendChild(open); box.appendChild(panel); host.appendChild(box);
    open.addEventListener('click', function () {
      panel.hidden = !panel.hidden; open.setAttribute('aria-expanded', String(!panel.hidden));
      open.textContent = panel.hidden ? 'Step-by-step help' : 'Hide step-by-step help';
      if (!panel.hidden && !panel.firstChild) start();
    });
    function start() {
      panel.innerHTML = '';
      var trail = el('ol', 'es-trail'); panel.appendChild(trail);
      var li = el('li'); li.appendChild(el('div', 'es-move', 'Start with the equation.')); li.appendChild(el('div', 'es-line', mx(d.start)));
      trail.appendChild(li);
      var ask = el('div'); panel.appendChild(ask);
      step(0, trail, ask);
    }
    function step(i, trail, ask) {
      ask.innerHTML = '';
      if (i >= d.steps.length) {
        var done = el('div', 'es-done', '<b>' + mx(d.steps[d.steps.length - 1].res) + '</b><br>Check: ' + mx(d.check) +
          '<br>Now type your answer in the answer box.');
        done.setAttribute('role', 'status');
        ask.appendChild(done);
        var redo = el('button', 'es-redo', 'Start over'); redo.type = 'button'; redo.onclick = start; ask.appendChild(redo);
        return;
      }
      var s = d.steps[i];
      ask.appendChild(el('div', 'es-ask', 'Step ' + (i + 1) + ': What is the best next step?'));
      var chs = el('div', 'es-chs'); ask.appendChild(chs);
      var fb = el('div', 'es-fb'); fb.setAttribute('aria-live', 'polite'); ask.appendChild(fb);
      s.choices.forEach(function (c) {
        var b = el('button', 'es-ch', mx(c[0])); b.type = 'button';
        b.onclick = function () {
          if (c[1]) {
            var li = el('li');
            li.appendChild(el('div', 'es-move', mx(s.move)));
            s.work.forEach(function (w) { li.appendChild(el('div', 'es-work', mx(w))); });
            li.appendChild(el('div', 'es-line', mx(s.res)));
            trail.appendChild(li);
            step(i + 1, trail, ask);
          } else {
            b.classList.add('no'); b.setAttribute('aria-disabled', 'true');
            fb.innerHTML = 'Not that one. ' + mx(c[2]);
          }
        };
        chs.appendChild(b);
      });
    }
  }
  function attach(map) {
    Object.keys(map).forEach(function (id) {
      var card = document.getElementById('q' + id);
      if (card) mount(card, map[id]);
    });
  }
  window.EqStepper = { mount: mount, attach: attach };
})();
