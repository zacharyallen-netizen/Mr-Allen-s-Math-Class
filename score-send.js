/* ───────────────────────────────────────────────────────────────
   SCORE SEND — "Send my work to Mr. Allen" for pre-tests and
   unit practice pages. Same idea as the Fluency Lab Skill Checks:
   the student types their first and last name once and taps Send.
   Results go to Mr. Allen's private Google Sheet and nowhere else.

   For each question it keeps:
     first  – right on the FIRST try (1) or not (0)
     final  – right in the end (1) or not (0)
     std    – the NC standard, e.g. "NC.8.EE.7"
     band   – 3 (basic), 4 (target) or 5 (advanced) on the 1–5 scale

   How a page uses it
     ScoreSend.setup({ kind:'practice' | 'pretest', unit:'7', page:'Unit 7 · Practice 1',
                       mount:'#where-the-panel-goes', std:'NC.8.SP.1', band:4 });
     ScoreSend.record('q3', true|false, { std:'NC.8.SP.2', band:4 });  // every time an answer is checked
     ScoreSend.reset();          // pre-test "Reset" — start a fresh attempt
     ScoreSend.revealed();       // answers were shown before checking (flagged in the Sheet)

   If tracker-config.js has no ENDPOINT, nothing appears and the page
   works exactly as before.
   ─────────────────────────────────────────────────────────────── */
(function () {
  var CFG = window.TRACKER_CONFIG || {};
  var NAME_KEY = 'fluencyLabStudentName';            // shared with the Fluency Lab

  function store(op, k, v) {
    try {
      if (op === 'get') return localStorage.getItem(k) || '';
      localStorage.setItem(k, v);
    } catch (e) { /* private browsing: carry on without remembering */ }
    return '';
  }
  function newSession() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  var S = {
    opts: null, items: {}, order: [], session: newSession(), wasRevealed: false, box: null,

    setup: function (o) {
      S.opts = o || {};
      if (!CFG.ENDPOINT) return;
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', S.mount);
      else S.mount();
    },

    record: function (id, ok, meta) {
      if (!S.opts) return;
      id = String(id); meta = meta || {};
      var it = S.items[id];
      if (!it) {
        it = S.items[id] = {
          id: id,
          std: meta.std || S.opts.std || '',
          band: Number(meta.band || S.opts.band || 4),
          label: meta.label ? String(meta.label).slice(0, 80) : '',
          first: ok ? 1 : 0, final: ok ? 1 : 0, tries: 1
        };
        S.order.push(id);
      } else {
        it.final = ok ? 1 : 0; it.tries++;
      }
      S.refresh();
    },

    reset: function () {
      S.items = {}; S.order = []; S.session = newSession(); S.wasRevealed = false; S.sentSig = ''; S.sentOnce = false; S.refresh();
    },
    revealed: function () { S.wasRevealed = true; },

    count: function () {
      var n = S.order.length, first = 0, fin = 0;
      S.order.forEach(function (k) { first += S.items[k].first; fin += S.items[k].final; });
      return { n: n, first: first, fin: fin, sig: S.session + ':' + n + ':' + first + ':' + fin };
    },

    mount: function () {
      if (S.box || !S.opts) return;
      var host = S.opts.mount ? (typeof S.opts.mount === 'string' ? document.querySelector(S.opts.mount) : S.opts.mount) : null;
      if (!document.getElementById('scoresend-css')) {          // never print the panel
        var st = document.createElement('style'); st.id = 'scoresend-css';
        st.textContent = '@media print{#scoresend{display:none!important}}';
        document.head.appendChild(st);
      }
      var box = document.createElement('section');
      box.id = 'scoresend';
      box.setAttribute('aria-label', 'Send my work to Mr. Allen');
      box.style.cssText =
        'box-sizing:border-box;max-width:720px;margin:28px auto;padding:18px 20px;border-radius:10px;' +
        'background:#fff;border:1px solid #E3E5EA;box-shadow:0 1px 2px rgba(30,45,79,.06);' +
        'font:15px/1.5 Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1B2333;text-align:left';
      box.innerHTML =
        '<div style="font:600 17px/1.3 \'Source Serif 4\',Georgia,serif;color:#1E2D4F;margin-bottom:4px">Send my work to Mr. Allen</div>' +
        '<div id="ssmsg" style="color:#5B6475;font-size:14px;margin-bottom:12px"></div>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
          '<label for="ssname" style="position:absolute;left:-9999px">Your first and last name</label>' +
          '<input id="ssname" type="text" autocomplete="name" placeholder="First and last name" ' +
            'style="flex:1 1 200px;min-width:0;font:inherit;padding:11px 13px;border-radius:8px;border:1px solid #D5D9E0;background:#fff;color:#1B2333">' +
          '<button id="ssbtn" type="button" style="font:600 15px Inter,system-ui,sans-serif;color:#fff;background:#1E2D4F;' +
            'border:0;border-radius:8px;padding:11px 20px;cursor:pointer;min-height:44px">Send my work</button>' +
        '</div>';
      if (host) host.appendChild(box);
      else document.body.appendChild(box);
      S.box = box;
      var nm = document.getElementById('ssname');
      nm.value = store('get', NAME_KEY);
      document.getElementById('ssbtn').addEventListener('click', S.send);
      nm.addEventListener('keydown', function (e) { if (e.key === 'Enter') S.send(); });
      S.refresh();
    },

    refresh: function () {
      if (!S.box) return;
      var c = S.count(), btn = document.getElementById('ssbtn');
      if (S.sending) return;
      if (!c.n) {
        msg('Answer some questions first. Then type your first and last name and tap Send.', 'muted');
        btn.disabled = true; btn.style.opacity = '.5'; btn.textContent = 'Send my work';
        return;
      }
      btn.disabled = false; btn.style.opacity = '1';
      if (S.sentSig === c.sig) {                     // nothing new since the last send
        btn.textContent = 'Sent ✓';
        msg('Sent ✓ Mr. Allen has this work: ' + c.first + ' of ' + c.n + ' right on the first try.', 'ok');
        return;
      }
      btn.textContent = S.sentOnce ? 'Send again' : 'Send my work';
      if (S.sentOnce) {
        msg('You have new work since you sent. Tap Send again so Mr. Allen sees it.', 'muted');
        return;
      }
      msg('You checked ' + c.n + (c.n === 1 ? ' question' : ' questions') + '. ' + c.first +
          ' right on the first try. Type your first and last name, then tap Send.', 'muted');
    },

    send: function () {
      var c = S.count();
      if (!c.n || S.sending) return;
      var nameEl = document.getElementById('ssname');
      var name = (nameEl.value || '').replace(/\s+/g, ' ').trim();
      if (name.length < 3 || name.indexOf(' ') < 0) {
        msg('Please type your first AND last name.', 'warn'); nameEl.focus(); return;
      }
      store('set', NAME_KEY, name);
      var btn = document.getElementById('ssbtn');
      S.sending = true; btn.disabled = true; btn.style.opacity = '.6'; btn.textContent = 'Sending…';
      msg('Sending…', 'muted');
      var o = S.opts;
      fetch(CFG.ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },   // "simple" request: no CORS preflight
        body: JSON.stringify({
          code: CFG.CLASS_CODE, v: 2, kind: o.kind, unit: String(o.unit || ''), page: o.page || document.title,
          url: location.pathname.split('/').slice(-2).join('/'),
          name: name, session: S.session, revealed: S.wasRevealed,
          items: S.order.map(function (k) { return S.items[k]; })
        })
      })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        S.sending = false;
        if (res && res.ok) {
          S.sentSig = c.sig; S.sentOnce = true;
          btn.disabled = false; btn.style.opacity = '1'; btn.textContent = 'Sent ✓';
          msg('Got it, ' + res.name + '. Mr. Allen has your work: ' + c.first + ' of ' + c.n +
              ' right on the first try. If you keep working, you can send again.', 'ok');
        } else {
          btn.disabled = false; btn.style.opacity = '1'; btn.textContent = 'Try again';
          var off = res && /unknown skill|bad/.test(String(res.error));
          msg(off ? 'Sending is not switched on yet for this page. Tell Mr. Allen.'
                  : 'That did not go through' + (res && res.error ? ' (' + res.error + ')' : '') + '. Tell Mr. Allen.', 'warn');
        }
      })
      .catch(function () {
        S.sending = false;
        btn.disabled = false; btn.style.opacity = '1'; btn.textContent = 'Try again';
        msg('Could not reach Mr. Allen\'s sheet. Check the internet and try again.', 'warn');
      });
    }
  };

  function msg(t, kind) {
    var el = document.getElementById('ssmsg');
    if (!el) return;
    el.textContent = t;
    el.style.color = kind === 'ok' ? '#15803D' : kind === 'warn' ? '#B42318' : '#5B6475';
  }

  window.ScoreSend = S;
})();
