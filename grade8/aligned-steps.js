/* aligned-steps.js — written solutions, lined up (Mr. Allen's Math Class, Nov 12, 2026).

   Zach: "It is imperative that as equations or inequalities are worked, that the steps are horizontal and
   align with like terms." Many pages show worked steps as text ("Subtract x: 2x − 6 = 8<br>Add 6: 2x = 14").
   This script finds those solutions and draws them the lined-up way (StepWork.alignTrail in step-work.js):
   every line lines up on the = sign, and each move sits UNDER the like term it changes on BOTH sides.

   - It only draws lines that really are the same equation one step later (checked with exact fractions), so a
     "Check: 3(13) = 39" line or a "plug in" line is never mistaken for a step.
   - The page's own words become the step labels. If a solution is ONLY steps, the lined-up work replaces the
     text lines (they stay in the page, hidden). If it also explains things in sentences, the sentences stay and
     the lined-up work is added under them.
   - Solutions that show up later (after Check, "Try a similar one", Show answer) are handled as they appear.
   - Off on blank printed copies (?paper=1); ON for answer keys (?paper=1&key=1), so the printed keys match and on pages that already draw their own aligned work (vwork, ss-sol).
   Loaded by student-fx.js; it loads step-work.js itself if the page does not have it. */
(function () {
  'use strict';
  if (window.AlignedSteps) return;
  var KEY = /[?&]key=1/.test(location.search);
  if (/[?&]paper=1/.test(location.search) && !KEY) return;   // blank printed copies: nothing to line up
  var SEL = '.np-sol, .sol, .steps, .xsteps, .sh-steps, .explain, .tw-sol, .twin-sol, .howto';   // worked solutions only (short feedback notes stay as text)
  var SKIP = '.sw, .sw-alb, .sw-alb-h, .vw, .ss-sol, .ss-trail, script, style, textarea, input, select, button';
  var MOVE = /^(subtract|add|divide|multiply|distribute|combine|simplify|undo|move|get|then|now|flip|solve)/i;

  function ready(f) { if (window.StepWork && StepWork.alignTrail) return f(); var s = document.querySelector('script[src*="step-work.js"]');
    if (!s) { if (!window.FX) window.SW_NO_FX = true;   // a page without the student look stays as it is
      s = document.createElement('script'); var me = document.querySelector('script[src*="aligned-steps.js"]'), base = me ? me.src.replace(/aligned-steps\.js.*$/, '') : '';
      s.src = base + 'step-work.js?v=20261113d'; document.head.appendChild(s); }
    var n = 0, t = setInterval(function () { if (window.StepWork && StepWork.alignTrail) { clearInterval(t); f(); } else if (++n > 100) clearInterval(t); }, 100); }

  /* ---- text of a box, one step per line ---- */
  function plainLines(box) {
    var c = box.cloneNode(true);
    c.querySelectorAll(SKIP + ', .placeholder').forEach(function (x) { if (x !== c) x.remove(); });
    c.querySelectorAll('.sf, .fr, .sw-fr, .vw-fr, .frac, .fraction').forEach(function (f) {
      var k = Array.prototype.filter.call(f.children, function (x) { return !/sfx/.test(x.className) && x.textContent !== '/'; });
      if (k.length === 2) f.textContent = '(' + k[0].textContent + ')/(' + k[1].textContent + ')';
    });
    c.querySelectorAll('sup').forEach(function (x) { x.textContent = '^' + x.textContent + ' '; });
    c.querySelectorAll('br').forEach(function (x) { x.replaceWith('\n'); });
    c.querySelectorAll('li, p, div, tr').forEach(function (x) { x.insertAdjacentText('beforebegin', '\n'); x.insertAdjacentText('afterend', '\n'); });
    var t = c.textContent.replace(/ /g, ' ');
    var out = [];
    t.split('\n').forEach(function (ln) {
      ln.split(/\s*(?:→|⇒|=>)\s*|;\s+|\.\s+(?=[A-Z])/).forEach(function (seg) { seg = seg.trim(); if (seg) out.push(seg); });
    });
    return out;
  }

  /* ---- one equation (and its label) in a piece of text ---- */
  var REL = /(≤|≥|<=|>=|=|<|>)/;
  function isWord(tok) { return /[a-zA-Z]{2,}/.test(tok.replace(/\b(sqrt)\b/g, '')); }
  function findEq(seg) {
    var m = seg.match(/^(.*?)(≤|≥|<=|>=|=|<|>)(.*)$/); if (!m) return null;
    if (REL.test(m[3])) return null;   // two signs in one piece: not one simple line
    var head = m[1], tail = m[3], label = '';
    var colon = head.lastIndexOf(':'); if (colon >= 0) { label = head.slice(0, colon); head = head.slice(colon + 1); }
    var lt = head.trim().split(/\s+/), keep = [];
    for (var i = lt.length - 1; i >= 0; i--) { if (!lt[i] || isWord(lt[i]) || /[,:]$/.test(lt[i])) { if (keep.length) { label = (label ? label + ' ' : '') + lt.slice(0, i + 1).join(' '); break; } else return null; } keep.unshift(lt[i]); if (i === 0) break; }
    var rt = tail.trim().replace(/[.,!]+$/, '').split(/\s+/), rk = [];
    for (var j = 0; j < rt.length; j++) { var w = rt[j].replace(/[.,!]+$/, ''); if (!w || isWord(w) || /[✓✗°%$]/.test(w)) break; rk.push(w); if (/[.,!]$/.test(rt[j])) break; }
    if (!keep.length || !rk.length) return null;
    var txt = keep.join(' ') + ' ' + m[2] + ' ' + rk.join(' ');
    if (!/[a-z]/i.test(txt) || /π|pi\b/i.test(txt)) return null;   // π lines stay as written
    var e; try { e = StepWork._t.parseEq(txt); } catch (x) { return null; }
    if (!e || e.vars.length !== 1) return null;
    try { StepWork._t.sides(e, e.vars[0]); } catch (x) { return null; }
    label = label.replace(/^[\s—–\-✓✔•]+/, '').replace(/^(\d+[.)]\s*|step\s*\d+[:.]?\s*)/i, '').replace(/[,:.\s]+$/, '').trim();
    if (label.length > 60 || /^(so|now|then|solve|answer|check|it|this|and)$/i.test(label)) label = '';
    return { e: e, v: e.vars[0], label: label, txt: txt };
  }
  function sameSol(a, b, v) {   // same answer, and one answer (not "every number" / "no number": those always look alike)
    try { var A = StepWork._t.solve(a, v), B = StepWork._t.solve(b, v); return A.kind !== 'all' && A.kind !== 'none' && StepWork._t.sameSet(A, B); } catch (x) { return false; } }
  function solved(e, v) { try { return !!StepWork._t.isSolved(e, v); } catch (x) { return false; } }
  function sameEq(a, b) { return StepWork._t.eqHtml(a) === StepWork._t.eqHtml(b); }

  /* ---- chains of equivalent lines ---- */
  function chains(lines) {
    var out = [], cur = [], used = 0, eqs = 0;
    lines.forEach(function (seg) {
      var q = findEq(seg); if (!q) return; eqs++;
      var last = cur[cur.length - 1];
      if (last && q.v === last.v && !solved(last.e, last.v) && sameSol(last.e, q.e, q.v)) { if (!sameEq(last.e, q.e)) cur.push(q); return; }
      if (last && sameEq(last.e, q.e)) return;
      if (cur.length) out.push(cur);
      cur = [q];
    });
    if (cur.length) out.push(cur);
    out.forEach(function (c) { used += c.length; });
    return { list: out, eqs: eqs, used: used };
  }

  /* the starting equation, from the problem (when the steps begin one move in) */
  function startFor(box, first) {
    var node = box, guard = 0;
    while (node && node.parentElement && guard++ < 4) {
      var par = node.parentElement, c = par.cloneNode(true), mine = c.querySelectorAll(SEL), self = Array.prototype.indexOf.call(par.querySelectorAll(SEL), box);
      if (self >= 0 && mine[self]) mine[self].remove();
      var segs = plainLines(c);
      for (var i = 0; i < segs.length; i++) { var q = findEq(segs[i]); if (q && q.v === first.v && !sameEq(q.e, first.e) && sameSol(q.e, first.e, q.v) && !solved(q.e, q.v)) return { e: q.e, v: q.v, label: '' }; }
      node = par;
    }
    return null;
  }

  function sig(box) { return box.textContent.replace(/\s+/g, ' ').trim() + '|' + box.querySelectorAll('.revealed').length; }
  function waiting(box) {   // click-to-reveal steps: draw only after every step is revealed (never give the answer early)
    if (KEY) return false;   // answer keys show every step
    var r = box.querySelectorAll('[onclick*="reveal"]'); if (!r.length) return /click to reveal|tap to reveal/i.test(box.textContent) && !box.querySelector('.revealed');
    return Array.prototype.some.call(r, function (x) { return !x.classList.contains('revealed'); });
  }
  function run(box) {
    if (box.closest(SKIP)) return;
    if (box.parentElement && box.parentElement.closest(SEL) && box.parentElement.closest(SEL) !== box) return;   // the outer box does it
    var s = sig(box); if (box.dataset.al === s) return;
    if (waiting(box)) { box.querySelectorAll(':scope > .sw-alb-h').forEach(function (x) { x.remove(); }); return; }
    box.querySelectorAll(':scope > .sw-alb-h').forEach(function (x) { x.remove(); });
    box.querySelectorAll('.al-hid').forEach(function (x) { x.classList.remove('al-hid'); });
    var lines = plainLines(box), ch = chains(lines);
    ch.list.forEach(function (c) {
      if (MOVE.test(c[0].label)) { var st = startFor(box, c[0]); if (st) c.unshift(st); }
    });
    ch.list = ch.list.filter(function (c) { return c.length >= 2; });
    ch.used = ch.list.reduce(function (a, c) { return a + c.filter(function (q) { return q.txt; }).length; }, 0);
    if (!ch.list.length) { box.dataset.al = sig(box); return; }
    // only steps? (every line is an equation that went into the work, apart from short labels)
    var words = lines.filter(function (seg) { return !findEq(seg); }).join(' ');
    var pure = ch.list.length === 1 && ch.used === ch.eqs && words.replace(/[^a-z]/gi, '').length < 25;
    var html = ch.list.map(function (c) {   // a reason written on the first line ("Alternate interior angles are EQUAL") stays, above the work
      var lead = c[0].label && !MOVE.test(c[0].label) ? '<div class="al-lead">' + c[0].label.replace(/[<&]/g, '') + ':</div>' : '';
      return lead + StepWork.alignTrail(c, c[0].v);
    }).join('');
    var isList = /^(UL|OL)$/.test(box.tagName);
    if (pure) {   // hide the text lines (kept in the page), show the lined-up work in their place
      Array.prototype.slice.call(box.childNodes).forEach(function (n) {
        if (n.nodeType === 3) { if (!n.textContent.trim()) return; var sp = document.createElement('span'); sp.className = 'al-hid'; n.replaceWith(sp); sp.appendChild(n); }
        else if (n.nodeType === 1) n.classList.add('al-hid');
      });
    }
    var holder = document.createElement(isList ? 'li' : 'div'); holder.className = 'sw-alb-h'; holder.innerHTML = html;
    if (isList) holder.style.listStyle = 'none';
    box.appendChild(holder);
    box.dataset.al = sig(box);
  }
  var queued = false;
  function scan() {
    queued = false;
    document.querySelectorAll(SEL).forEach(function (b) { try { run(b); } catch (x) { if (window.console) console.warn('aligned-steps', x); } });
    window.AlignedSteps.done = true;   // _build/notes_pdf.js waits for this before printing a key
  }
  function later() { if (!queued) { queued = true; setTimeout(scan, 120); } }
  window.AlignedSteps = { scan: scan, done: false, _t: { plainLines: plainLines, findEq: findEq, chains: chains } };
  ready(function () {
    if (!document.getElementById('al-css')) { var st = document.createElement('style'); st.id = 'al-css'; st.textContent = '.al-hid{display:none!important}.al-lead{font:600 14.5px Inter,system-ui,sans-serif;color:#1E2D4F;margin:6px 0 -2px}'; document.head.appendChild(st); }
    scan();
    new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) { var t = ms[i].target; if (t.nodeType !== 1) t = t.parentElement; if (t && !(t.closest && t.closest('.sw-alb'))) { later(); return; } }
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class'] });
  });

})();
