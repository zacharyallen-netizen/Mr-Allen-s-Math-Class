// Printable worksheet + answer key for a practice-engine page (same problems, same pictures, Score labels).
//   node _build/practice_pdf.js unit6-practice.html Unit6_Practice_Blank.pdf Unit6_Practice_AnswerKey.pdf
// Needs the local server: python3 -m http.server 8765 --bind 127.0.0.1  (from the repo root)
const { chromium } = require('playwright');
const path = require('path');
const [, , page, blank, key] = process.argv;
if (!page || !blank || !key) { console.error('usage: node _build/practice_pdf.js page.html Blank.pdf AnswerKey.pdf'); process.exit(1); }
const G = path.join(__dirname, '..', 'grade8') + '/';
(async () => {
  const b = await chromium.launch();
  for (const [mode, out] of [['blank', blank], ['key', key]]) {
    const p = await b.newPage({ viewport: { width: 900, height: 1200 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://127.0.0.1:8765/grade8/' + page); await p.evaluate(() => localStorage.setItem('oat-mode', 'all-test'));
    await p.reload(); await p.waitForTimeout(1200);
    const title = await p.evaluate((mode) => {
      const D = window.PRACTICE.data;
      document.querySelectorAll('#site-bar,.site-bar,.sb-local,#ss-mount,#scoresend,.pr-how,.pr-score,.pr-links,.oat-bar,.oat-nav,.oat-finish,.ineq-keys,script+div:empty').forEach(e => e.remove());
      document.querySelectorAll('.sw-host,.pr-tips,.site-footer,.fx-read,.fx-foot,.fx-tpanel,.fx-help,.fx-streak,.fx-toast,.fx-fin,.fx-gate,.oat-hint,.ta-why').forEach(e => e.remove());   // screen-only helpers
      document.querySelectorAll('body > *, .page-wrap > *').forEach(e => { if (!e.textContent.trim() && !e.querySelector('svg,img,canvas') && !/^(SCRIPT|STYLE|LINK)$/.test(e.tagName)) e.remove(); });
      document.querySelectorAll('a').forEach(a => { if (/^\s*←/.test(a.textContent)) a.remove(); });
      document.querySelectorAll('[class*="oat"]').forEach(e => { if (e !== document.body && !e.matches('.pr-sec,h1,h2,.page-wrap,.pr-sub,p') && !e.closest('.pr-card') && !e.querySelector('.pr-card')) e.style.display = 'none'; });
      D.secs.forEach((sec, si) => sec.probs.forEach(pr => {
        const c = document.getElementById('s' + si + 'p' + pr.n); if (!c) return;
        c.style.display = ''; c.style.breakInside = 'avoid';
        c.querySelectorAll('.pr-row,.pr-fb,.pr-hintbox').forEach(e => e.remove());
        // a problem with its own answer choices prints them as A, B, C, D (Nov 11, 2026); the key marks the right one
        let keyAns = pr.ans;
        if (pr.choices && pr.choices.length) {
          const L = 'ABCDEF', norm = t => String(t).replace(/<[^>]+>/g, '').replace(/\s+/g, ''), ri = pr.choices.findIndex(t => norm(t) === norm(pr.ans)), box = document.createElement('div');
          box.style.cssText = 'margin:10px 0 0 2px;font:500 14.5px/1.5 Inter,system-ui,sans-serif;color:#1E2D4F';
          box.innerHTML = pr.choices.map((t, i) => '<div style="margin:3px 0' + (mode === 'key' && i === ri ? ';color:#15803D;font-weight:700' : '') + '"><b>' + L[i] + '.</b> ' + t + '</div>').join('');
          c.appendChild(box); if (ri >= 0) keyAns = L[ri];
        }
        const a = document.createElement('div');
        a.style.cssText = 'margin-top:12px;font:600 15px Inter,system-ui,sans-serif;color:#1E2D4F';
        a.innerHTML = 'Answer: ' + (mode === 'key'
          ? '<span style="color:#15803D;font-weight:700;border-bottom:1.5px solid #15803D;padding:0 10px">' + keyAns + '</span>'
          : '<span style="display:inline-block;width:2.6in;border-bottom:1.5px solid #1E2D4F">&nbsp;</span>');
        c.appendChild(a);
      }));
      document.querySelectorAll('.pr-sec').forEach(h => { h.style.breakAfter = 'avoid'; h.style.display = ''; });
      if (mode === 'key') { const h = document.querySelector('h1'); if (h) h.insertAdjacentHTML('beforeend', ' <span style="color:#15803D">— Answer Key</span>'); }
      return D.title;
    }, mode);
    await p.emulateMedia({ media: 'screen' });
    await p.pdf({
      path: G + out, format: 'Letter', printBackground: true,
      margin: { top: '0.5in', bottom: '0.6in', left: '0.5in', right: '0.5in' }, displayHeaderFooter: true, headerTemplate: '<div></div>',
      footerTemplate: '<div style="font:9px Inter,Arial,sans-serif;color:#6B7488;width:100%;text-align:center">' + title.replace(/&/g, '&amp;').replace(/</g, '&lt;') +
        (mode === 'key' ? ' — Answer Key' : '') + ' · page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
    });
    console.log('wrote', out, errs.join(' ')); await p.close();
  }
  await b.close();
})();
