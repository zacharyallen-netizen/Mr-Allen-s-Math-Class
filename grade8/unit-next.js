/* UNIT NEXT — on unit1..9.html.
   Nov 13, 2026 (Zach): the big gold "Start here / Keep going / Next" button and the fold were REMOVED; the
   "Start here: do these in order" strip at the top stays, and every item is shown. Only the Done / Started checks remain.
   Old notes (Nov 10):
   one big "Keep going" button under the Start-here strip, and everything else folded under "All of Unit N".
   The button uses this device's progress (localStorage "fx-prog", written by student-fx.js on each student page):
     - a page opened but not finished  -> "Keep going: <that page>" (the most recent one)
     - else the item after the last finished one, in page order -> "Next: <item>"
     - else the first item -> "Start here: <item>"
   Finished = work sent, homework turned in, or every question done. Only Notes / Practice / Homework / EOG / Pre-Test
   items count (not Games & Extras, not PDFs). The Start-here step links open the fold and jump to their section.
   Finished items in the list show a green "Done" check and started ones "Started" (same fx-prog data).
   Print shows everything. */
(function () {
  "use strict";
  var IN = /notes|practice|homework|eog|pretest|part\d|tutorial/i, OUT = /game|extra|project/i;
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function key(href) { var u; try { u = new URL(href, location.href); } catch (e) { return ''; } var m = u.search.match(/[?&]hw=([^&#]+)/); return u.pathname.split('/').pop() + (m ? '?hw=' + m[1] : ''); }
  function run() {
    var labels = [].slice.call(document.querySelectorAll('.section-label')); if (!labels.length) return;
    var holder = labels[0].parentNode, unit = (document.querySelector('h1') || {}).textContent || '';
    var um = location.pathname.match(/units?(\d(?:-\d)?)\.html/), uname = um ? 'Unit' + (um[1].indexOf('-') > 0 ? 's ' + um[1].replace('-', '–') : ' ' + um[1]) : 'this unit';

    /* the ordered list of things to do */
    var items = [], group = null;
    [].forEach.call(holder.children, function (el) {
      if (el.classList.contains('section-label')) { var t = el.textContent; group = OUT.test(t) ? null : (IN.test(el.id || '') || (!el.id && group)) ? true : (IN.test(t) ? true : null); return; }
      if (!group) return;
      [].forEach.call(el.matches('a') ? [el] : el.querySelectorAll('a'), function (a) {
        var h = a.getAttribute('href') || ''; if (!h || /\.pdf($|[?#])/i.test(h) || /^(https?:|#|mailto:)/.test(h)) return;
        var t = a.querySelector('.ft'); items.push({ a: a, ft: t, href: h, key: key(h), title: (t ? t.textContent : a.textContent).trim().replace(/\s+/g, ' ') });
      });
    });
    if (!items.length) return;
    var prog; try { prog = JSON.parse(ls('fx-prog') || '{}'); } catch (e) { prog = {}; }
    var open = items.filter(function (it) { var p = prog[it.key]; return p && p.s && !p.d; }).sort(function (a, b) { return prog[b.key].s - prog[a.key].s; })[0];
    var pick, kind;
    if (open) { pick = open; kind = 'Keep going'; }
    else {
      var last = -1; items.forEach(function (it, i) { if (prog[it.key] && prog[it.key].d) last = i; });
      if (last < 0) { pick = items[0]; kind = 'Start here'; }
      else { pick = items.slice(last + 1).filter(function (it) { return !(prog[it.key] && prog[it.key].d); })[0]; kind = 'Next'; }
    }

    /* look */
    var st = document.createElement('style');
    st.textContent = '.un-next{display:flex;align-items:center;gap:14px;background:#FFC107;color:#1E2D4F;text-decoration:none;border-radius:14px;padding:16px 20px;margin:16px 0 6px;box-shadow:0 4px 18px rgba(0,0,0,.28);border:2px solid #FFD54F}' +
      '.un-next:hover{background:#FFCD38}.un-next .un-k{display:block;font:700 13px Inter,system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#1E2D4F;opacity:.8}' +
      '.un-next .un-t{display:block;font:600 1.3rem/1.25 "Source Serif 4",Georgia,serif;color:#1E2D4F;margin-top:2px}.un-next .un-go{margin-left:auto;font:700 26px Inter,sans-serif;color:#1E2D4F}' +
      '.un-note{font:500 14px/1.4 Inter,system-ui,sans-serif;color:#DDE3EE;margin:-2px 0 16px}' +
      '.un-ck{display:inline-block;margin-left:8px;font:700 12px Inter,system-ui,sans-serif;color:#15803D;background:#E7F6EC;border-radius:999px;padding:2px 9px;vertical-align:1px;white-space:nowrap}.un-ck.st{color:#8A6100;background:#FFF3CD}' +
      'details.un-all{margin:8px 0 0}details.un-all>summary{cursor:pointer;list-style:none;font:600 16px Inter,system-ui,sans-serif;color:#1E2D4F;background:#fff;border:1px solid #D5D9E0;border-radius:10px;padding:12px 16px}' +
      'details.un-all>summary::-webkit-details-marker{display:none}details.un-all>summary:after{content:" ▾";color:#8A93A3}details.un-all[open]>summary:after{content:" ▴"}' +
      'details.un-all[open]>summary{margin-bottom:6px}@media print{.un-next,.un-note,details.un-all>summary{display:none}}';
    document.head.appendChild(st);

    /* checkmarks (Nov 11, 2026): finished items show "\u2713 Done", opened-but-not-finished items show "Started"; the fold shows the count */
    var nd = 0;
    items.forEach(function (it) { var p = prog[it.key]; if (!p || !(p.d || p.s)) return; if (p.d) nd++;
      var c = document.createElement('span'); c.className = 'un-ck' + (p.d ? '' : ' st'); c.textContent = p.d ? '\u2713 Done' : 'Started'; (it.ft || it.a).appendChild(c); });
    if (location.hash) { var t0 = document.getElementById(location.hash.slice(1)); if (t0) setTimeout(function () { t0.scrollIntoView(); }, 50); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
