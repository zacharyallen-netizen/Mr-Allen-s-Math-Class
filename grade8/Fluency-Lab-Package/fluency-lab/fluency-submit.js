/* ───────────────────────────────────────────────────────────────
   FLUENCY LAB — "send my score" panel for the Skill Checks.

   Adds a small card under the score that lets a student put their
   name in once and send the result straight to Mr. Allen's private
   sheet. No sign-in, no screenshot, no Classroom.

   If no ENDPOINT is configured the panel never appears and the quiz
   behaves exactly as it did before.
   ─────────────────────────────────────────────────────────────── */
(function () {
  var CFG = window.FLUENCY_CONFIG || {};
  var KEY = 'fluencyLabStudentName';

  function ls(op, val) {
    try {
      if (op === 'get') return localStorage.getItem(KEY) || '';
      if (op === 'set') localStorage.setItem(KEY, val);
    } catch (e) { /* private browsing — just carry on */ }
    return '';
  }

  var FL = {
    module: '',
    sent: false,

    init: function (moduleName) {
      // default: read the skill straight off the page heading
      if (!moduleName) {
        var h = document.querySelector('h1');
        moduleName = h ? h.textContent.replace(/^\s*Skill Check\s*[—–-]\s*/, '').trim() : '';
      }
      FL.module = moduleName;
      if (!CFG.ENDPOINT) return;                 // not set up yet
      if (document.getElementById('flsend')) return;
      var host = document.getElementById('score');
      if (!host) return;
      var box = document.createElement('div');
      box.id = 'flsend';
      box.style.cssText =
        'display:none;margin:0 0 18px;padding:16px 18px;border-radius:14px;' +
        'background:var(--panel,#222749);border:1px solid var(--edge,#33396b)';
      box.innerHTML =
        '<div style="font-weight:700;font-size:15px;margin-bottom:4px">Send your score to Mr. Allen</div>' +
        '<div id="flmsg" style="color:var(--muted,#9aa0cf);font-size:13px;margin-bottom:10px">' +
          'Type your first and last name, then tap Send.</div>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
          '<input id="flname" type="text" autocomplete="name" placeholder="Your name" ' +
            'style="flex:1 1 180px;min-width:0;font:inherit;font-size:15px;padding:11px 13px;' +
            'border-radius:11px;border:1px solid var(--edge,#33396b);background:#1b1e38;' +
            'color:var(--ink,#f1f3ff)">' +
          '<button id="flbtn" type="button" style="font:inherit;font-size:15px;font-weight:650;' +
            'color:#12132a;background:var(--mint,#39d99a);border:none;border-radius:11px;' +
            'padding:11px 20px;cursor:pointer">Send my score</button>' +
        '</div>';
      host.parentNode.insertBefore(box, host.nextSibling);
      document.getElementById('flname').value = ls('get');
      document.getElementById('flbtn').addEventListener('click', FL.send);
      document.getElementById('flname').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') FL.send();
      });
    },

    /** called by the quiz once it knows the score */
    show: function (score, total) {
      FL.score = score; FL.total = total; FL.sent = false;
      var box = document.getElementById('flsend');
      if (!box) return;
      box.style.display = 'block';
      var b = document.getElementById('flbtn');
      b.disabled = false; b.style.opacity = '1'; b.textContent = 'Send my score';
      msg('Type your first and last name, then tap Send.', 'muted');
    },

    hide: function () {
      var box = document.getElementById('flsend');
      if (box) box.style.display = 'none';
    },

    send: function () {
      if (FL.sent) return;
      var nameEl = document.getElementById('flname');
      var name = (nameEl.value || '').replace(/\s+/g, ' ').trim();
      if (name.length < 3 || name.indexOf(' ') < 0) {
        msg('Please type your first AND last name.', 'warn');
        nameEl.focus();
        return;
      }
      ls('set', name);
      var btn = document.getElementById('flbtn');
      btn.disabled = true; btn.style.opacity = '.6'; btn.textContent = 'Sending…';
      msg('Sending…', 'muted');

      fetch(CFG.ENDPOINT, {
        method: 'POST',
        // text/plain keeps this a "simple" request, so the browser
        // does not send a CORS preflight that Apps Script cannot answer
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          code:   CFG.CLASS_CODE,
          name:   name,
          module: FL.module,
          score:  FL.score,
          total:  FL.total
        })
      })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.ok) {
          FL.sent = true;
          btn.textContent = 'Sent ✓';
          msg('Got it, ' + res.name + ' — Mr. Allen has your score of ' +
              FL.score + ' / ' + FL.total + '.', 'ok');
        } else {
          btn.disabled = false; btn.style.opacity = '1'; btn.textContent = 'Try again';
          msg('That did not go through' + (res && res.error ? ' (' + res.error + ')' : '') +
              '. Tell Mr. Allen.', 'warn');
        }
      })
      .catch(function () {
        btn.disabled = false; btn.style.opacity = '1'; btn.textContent = 'Try again';
        msg('No connection — check the wifi and try once more.', 'warn');
      });
    }
  };

  function msg(text, kind) {
    var m = document.getElementById('flmsg');
    if (!m) return;
    m.textContent = text;
    m.style.color = kind === 'ok'   ? 'var(--mint,#39d99a)'
                  : kind === 'warn' ? 'var(--amber,#ffbb4d)'
                  : 'var(--muted,#9aa0cf)';
  }

  window.FLSubmit = FL;
})();
