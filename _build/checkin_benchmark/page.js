(function () {
  'use strict';
  var CFG = window.BENCHMARK_CONFIG || {};
  var BENCH = 'NC Check-In Benchmark Review';
  var NAME_KEY = 'fluencyLabStudentName', CLASS_KEY = 'benchmarkClass';
  var QD = __QDATA__;
  var STD_NAMES = __STDNAMES__;
  var L = 'ABCDEF';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k) || ''; localStorage.setItem(k, v); } catch (e) {} return ''; }
  function newSession() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  var session = newSession(), locked = false, lastPayload = null;
  var st = QD.map(function () { return { done: false, ok: false, answer: '' }; });

  // ── tabs
  function showTab(id) {
    $$('.step').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-tab') === id ? 'true' : 'false'); });
    $$('.tabp').forEach(function (p) { p.hidden = p.id !== id; });
    var top = $('.steps').getBoundingClientRect().top + window.pageYOffset - 70;
    if (window.pageYOffset > top) window.scrollTo({ top: top, behavior: 'smooth' });
  }
  $$('.step').forEach(function (b) { b.addEventListener('click', function () { showTab(b.getAttribute('data-tab')); }); });
  $$('[data-go]').forEach(function (b) { b.addEventListener('click', function () { showTab(b.getAttribute('data-go')); }); });
  $$('.ntab').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.ntab').forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
      $$('.note').forEach(function (n) { n.hidden = n.id !== b.getAttribute('data-n'); });
    });
  });

  // ── choices
  $$('.chip').forEach(function (b) {
    b.addEventListener('click', function () {
      var q = b.closest('.q'), i = +q.getAttribute('data-i');
      if (st[i].done || locked) return;
      var box = b.parentNode;
      if (box.hasAttribute('data-multi')) b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      else $$('.chip', box).forEach(function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); });
      $('.nudge', q).textContent = '';
    });
  });
  function picked(i) { return $$('#q' + (i + 1) + ' .chip[aria-pressed="true"]').map(function (c) { return +c.getAttribute('data-v'); }).sort(); }

  // ── numbers: "5/3", "1 2/3", "-4", "−4", "1.5", "x = 18"  →  [num, den] (exact)
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function parseNum(t) {
    t = String(t).replace(/[−–—]/g, '-').replace(/\s+/g, ' ').trim().replace(/^[a-z]\s*=\s*/i, '').trim();
    var m;
    if ((m = t.match(/^(-?)(\d+) (\d+)\s*\/\s*(\d+)$/))) { var d = +m[4]; if (!d) return null; return { n: (m[1] ? -1 : 1) * (+m[2] * d + +m[3]), d: d, mixed: true }; }
    if ((m = t.match(/^(-?\d+)\s*\/\s*(-?\d+)$/))) { var d2 = +m[2]; if (!d2) return null; return { n: +m[1] * (d2 < 0 ? -1 : 1), d: Math.abs(d2), frac: true }; }
    if ((m = t.match(/^(-?)(\d*)\.?(\d*)$/)) && (m[2] || m[3])) { var dec = m[3] || '', p = Math.pow(10, dec.length); return { n: (m[1] ? -1 : 1) * (+(m[2] || 0) * p + +(dec || 0)), d: p, dec: dec.length > 0 }; }
    return null;
  }
  function eq(p, f) { return p && p.n * f[1] === f[0] * p.d; }

  // ── grading: returns {ok, msgs[], answer}
  function grade(i) {
    var q = QD[i];
    if (q.kind === 'num') {
      var raw = $('#in' + i).value.trim();
      if (!raw) return { blank: true, ok: false, msgs: ['You left this blank.'], answer: '' };
      if (/\.\.\.|…/.test(raw)) return { ok: false, msgs: ['That is the repeating decimal. Write it as a fraction, like 5/3.'], answer: raw };
      var p = parseNum(raw);
      if (!p) return { ok: false, msgs: ['I could not read that. Type a number like 7, -2, 3/4, or 1 2/3.'], answer: raw };
      if (eq(p, q.ans)) {
        if (q.simplest && ((p.frac && gcd(p.n, p.d) !== 1) || p.dec)) return { ok: false, msgs: ['Right value! But the question asks for the fraction in simplest form. ' + (p.dec ? 'Write it as a fraction.' : 'Divide the top and bottom by ' + gcd(p.n, p.d) + '.')], answer: raw };
        return { ok: true, msgs: [], answer: raw };
      }
      for (var h = 0; h < (q.hints || []).length; h++) if (eq(p, q.hints[h][0])) return { ok: false, msgs: [q.hints[h][1]], answer: raw };
      return { ok: false, msgs: ['Check your work one step at a time.'], answer: raw };
    }
    var pk = picked(i), ans = pk.map(function (j) { return L[j]; }).join(', ');
    if (!pk.length) return { blank: true, ok: false, msgs: ['You left this blank.'], answer: '' };
    if (q.kind === 'mc') {
      var j = pk[0];
      if (q.correct.indexOf(j) >= 0) return { ok: true, msgs: [], answer: ans };
      return { ok: false, msgs: [q.fb[j] || 'Look again at each choice.'], answer: ans };
    }
    var c = q.correct.slice().sort(), ok = pk.length === c.length && pk.every(function (v, k) { return v === c[k]; });
    if (ok) return { ok: true, msgs: [], answer: ans };
    var msgs = [];
    pk.forEach(function (v) { if (c.indexOf(v) < 0 && q.fb.pick && q.fb.pick[v]) msgs.push('<b>' + L[v] + ':</b> ' + q.fb.pick[v]); });
    c.forEach(function (v) { if (pk.indexOf(v) < 0 && q.fb.miss && q.fb.miss[v]) msgs.push('<b>' + L[v] + ':</b> ' + q.fb.miss[v]); });
    var nr = pk.filter(function (v) { return c.indexOf(v) >= 0; }).length;
    var lead = nr ? 'You got ' + nr + ' of the ' + c.length + ' right choices. ' : '';
    if (!msgs.length) msgs.push('Judge each choice by itself: true or false?');
    msgs[0] = lead + msgs[0];
    return { ok: false, msgs: msgs, answer: ans };
  }

  function show(i, r) {
    var q = QD[i], el = $('#q' + (i + 1)), res = $('.res', el);
    st[i] = { done: true, ok: r.ok, answer: r.answer };
    if (q.kind === 'num') { var inp = $('#in' + i); inp.disabled = true; inp.classList.add(r.ok ? 'right' : 'wrong'); }
    else $$('.chip', el).forEach(function (c) {
      var v = +c.getAttribute('data-v'), on = c.getAttribute('aria-pressed') === 'true', good = q.correct.indexOf(v) >= 0;
      c.disabled = true;
      if (good && on) c.classList.add('right'); else if (on) c.classList.add('wrong'); else if (good) c.classList.add('missed');
    });
    $('.chk', el).hidden = true;
    res.className = 'res show ' + (r.ok ? 'ok' : 'no');
    res.innerHTML = '<div class="head">' + (r.ok ? 'Correct!' : (r.blank ? 'Not answered' : 'Not yet')) + '</div>' +
      (r.ok ? '' : '<div>' + r.msgs.join('<br>') + '</div>') +
      '<div class="key"><b>Answer:</b> ' + q.key + '</div>' +
      '<div class="why"><b>How to solve it:</b> ' + q.why + '</div>';
    progress();
  }

  $$('.chk').forEach(function (b) {
    b.addEventListener('click', function () {
      var i = +b.getAttribute('data-i'), r = grade(i);
      if (r.blank) { $('#q' + (i + 1) + ' .nudge').textContent = QD[i].kind === 'num' ? 'Type an answer first.' : (QD[i].kind === 'multi' ? 'Tap at least one choice first.' : 'Tap a choice first.'); return; }
      if (QD[i].kind === 'num' && !parseNum($('#in' + i).value) && !/\.\.\.|…/.test($('#in' + i).value)) { $('#q' + (i + 1) + ' .nudge').textContent = 'Type a number like 7, -2, 3/4, or 1 2/3.'; return; }
      show(i, r);
    });
  });
  $$('input.box').forEach(function (inp) {
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var b = inp.closest('.q').querySelector('.chk'); if (!b.hidden) b.click(); } });
    inp.addEventListener('input', function () { inp.closest('.q').querySelector('.nudge').textContent = ''; });
  });

  function progress() {
    var n = st.filter(function (s) { return s.done; }).length, r = st.filter(function (s) { return s.ok; }).length;
    $('#progtxt').textContent = n + ' of ' + QD.length + ' checked';
    $('#progok').textContent = r + ' right';
    $('#pbar').style.width = (100 * n / QD.length) + '%';
  }

  // ── name + class
  var nameEl = $('#sname');
  nameEl.value = store(NAME_KEY);
  function pickClass(c) { $$('.cls').forEach(function (b) { b.setAttribute('aria-pressed', b.textContent === c ? 'true' : 'false'); }); }
  function chosenClass() { var b = $('.cls[aria-pressed="true"]'); return b ? b.textContent : ''; }
  $$('.cls').forEach(function (b) { b.addEventListener('click', function () { if (!locked) pickClass(b.textContent); }); });
  pickClass(store(CLASS_KEY));

  function smsg(t, kind) { var el = $('#smsg'); el.textContent = t; el.className = 'msg' + (kind ? ' ' + kind : ''); }
  var armedBlank = false;
  $('#sbtn').addEventListener('click', function () {
    if (locked) return;
    var name = nameEl.value.replace(/\s+/g, ' ').trim();
    if (name.length < 3 || name.indexOf(' ') < 0) {
      smsg('Type your first AND last name at the top first.', 'warn');
      nameEl.focus(); nameEl.scrollIntoView({ block: 'center', behavior: 'smooth' }); return;
    }
    var cls = chosenClass();
    if (!cls) { smsg('Tap your class at the top first.', 'warn'); $('.cls').focus(); $('.classes').scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
    var open = QD.map(function (q, i) { return i; }).filter(function (i) { return !st[i].done && grade(i).blank; }).map(function (i) { return '#' + (i + 1); });
    if (open.length && !armedBlank) {
      armedBlank = true;
      smsg('You have not answered ' + open.join(', ') + '. Go back and answer, or tap Submit anyway.', 'warn');
      $('#sbtn').textContent = 'Submit anyway'; return;
    }
    store(NAME_KEY, name); store(CLASS_KEY, cls);
    finish(name, cls);
  });

  function finish(name, cls) {
    QD.forEach(function (q, i) { if (!st[i].done) show(i, grade(i)); });
    locked = true;
    $$('.cls, .chip, .q input').forEach(function (el) { el.disabled = true; });
    var items = [], byStd = {}, score = 0;
    QD.forEach(function (q, i) {
      if (st[i].ok) score++;
      var b = byStd[q.std] = byStd[q.std] || { r: 0, n: 0 }; b.n++; if (st[i].ok) b.r++;
      items.push({ id: q.id, std: q.std, label: q.label, answer: st[i].answer || '(blank)', ok: st[i].ok ? 1 : 0 });
    });
    $('#sbtn').hidden = true;
    smsg('Here is your score. Tap a red number to go back to that question.', '');
    $('#bigscore').innerHTML = score + ' <small>out of ' + QD.length + ' (' + Math.round(100 * score / QD.length) + '%)</small>';
    $('#bystd').innerHTML = '<tr><th>Standard</th><th>Skill</th><th style="text-align:right">Right</th></tr>' +
      Object.keys(byStd).map(function (s) {
        var b = byStd[s], tip = b.r === b.n ? 'Ready' : (b.r >= b.n - 1 ? 'Review the notes' : 'Ask for help');
        return '<tr><td><code>' + s + '</code></td><td>' + STD_NAMES[s] + ' <span class="small">· ' + tip + '</span></td><td class="p">' + b.r + ' / ' + b.n + '</td></tr>';
      }).join('');
    $('#qgrid').innerHTML = QD.map(function (q, i) { return '<a href="#q' + (i + 1) + '" class="' + (st[i].ok ? 'r' : 'w') + '" aria-label="Question ' + (i + 1) + (st[i].ok ? ' correct' : ' not correct') + '">' + (i + 1) + '</a>'; }).join('');
    $('#scorebox').classList.add('show');
    lastPayload = { code: CFG.CODE, kind: 'benchmark', benchmark: BENCH, name: name, period: cls, session: session, score: score, total: QD.length, items: items };
    send();
    $('#submitbox').scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  function sendmsg(t, kind) { var el = $('#sendmsg'); el.textContent = t; el.className = 'msg' + (kind ? ' ' + kind : ''); }
  function send() {
    var rb = $('#resend');
    rb.hidden = true;
    if (!CFG.ENDPOINT) { sendmsg('Sending is not switched on yet. Show this screen to Mr. Allen.', 'warn'); return; }
    sendmsg('Sending to Mr. Allen…', '');
    fetch(CFG.ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(lastPayload) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.ok) sendmsg('Sent ✓ Mr. Allen has your results, ' + res.name + ' (attempt ' + res.attempt + ').', 'good');
        else { sendmsg('That did not go through' + (res && res.error ? ' (' + res.error + ')' : '') + '. Tap Try sending again, or tell Mr. Allen.', 'warn'); rb.hidden = false; }
      })
      .catch(function () { sendmsg('Could not reach Mr. Allen\'s sheet. Check the internet, then tap Try sending again.', 'warn'); rb.hidden = false; });
  }
  $('#resend').addEventListener('click', send);

  $('#again').addEventListener('click', function () {
    session = newSession(); lastPayload = null; locked = false; armedBlank = false;
    st = QD.map(function () { return { done: false, ok: false, answer: '' }; });
    $$('.q input').forEach(function (i) { i.value = ''; i.disabled = false; i.classList.remove('right', 'wrong'); });
    $$('.chip').forEach(function (b) { b.disabled = false; b.setAttribute('aria-pressed', 'false'); b.classList.remove('right', 'wrong', 'missed'); });
    $$('.cls').forEach(function (b) { b.disabled = false; });
    $$('.chk').forEach(function (b) { b.hidden = false; });
    $$('.nudge').forEach(function (n) { n.textContent = ''; });
    $$('.res').forEach(function (r) { r.className = 'res'; r.innerHTML = ''; });
    $('#scorebox').classList.remove('show');
    $('#sbtn').hidden = false; $('#sbtn').textContent = 'Submit';
    smsg('New attempt. Your FIRST check on each question is your score.', '');
    progress();
    $('#q1').scrollIntoView({ block: 'center', behavior: 'smooth' });
  });

  // for automated checks
  window.__bench = { QD: QD, parseNum: parseNum, grade: grade, state: function () { return st; } };
})();
