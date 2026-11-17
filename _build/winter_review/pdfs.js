// Winter Break Review: printable copies + answer keys made from the interactive pages (Nov 17, 2026, Zach: "include PDF
// copies of the interactive assignments ... edit or remove any website features that do not make sense as a paper copy").
// Paper copies keep ONLY the problems and room for work (Zach, Nov 17: no review notes). Paper edits: name/date line, no buttons/links/"tap"/"type"/"Send my work",
// the tap choices the web page shows print as A-D, a "Show your work" space under every problem, Skill Builders link -> words.
//   python3 -m http.server 8765 --bind 127.0.0.1   (repo root), then   node _build/winter_review/pdfs.js
const { chromium } = require('playwright');
const path = require('path');
const G = path.join(__dirname, '..', '..', 'grade8') + '/';
const JOBS = [['winter-break-review.html', 'winter-review/Winter_Break_Review'], ['winter-break-review-v2.html', 'winter-review/Winter_Break_Review_Version2']];
(async () => {
  require('fs').mkdirSync(G + 'winter-review', { recursive: true });
  const b = await chromium.launch();
  for (const [page, base] of JOBS) for (const mode of ['blank', 'key']) {
    const out = base + (mode === 'key' ? '_AnswerKey.pdf' : '.pdf');
    const p = await b.newPage({ viewport: { width: 900, height: 1200 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://127.0.0.1:8765/grade8/' + page); await p.evaluate(() => localStorage.setItem('oat-mode', 'all-test'));
    await p.reload(); await p.waitForTimeout(1500);
    const info = await p.evaluate((mode) => {
      const D = window.PRACTICE.data, L = 'ABCDEF', norm = t => String(t).replace(/<[^>]+>/g, '').replace(/\s+/g, '').toLowerCase();
      const strip = h => String(h).replace(/<[^>]+>/g, '');
      document.querySelectorAll('#site-bar,#side-nav,#side-nav-pad,#top-ticker,.site-bar,.sb-local,#ss-mount,#scoresend,.pr-how,.pr-score,.pr-links,.oat-bar,.oat-nav,.oat-finish,.ineq-keys,.back-link,.sw-host,.pr-tips,.site-footer,.fx-read,.fx-foot,.fx-tpanel,.fx-help,.fx-streak,.fx-toast,.fx-fin,.fx-gate,.oat-hint,.ta-why,.ta-wrap,.ta-choices,.svw-bar,#svw-bar,.save-bar,#save-bar,.pr-progress').forEach(e => e.remove());
      document.querySelectorAll('[class*="oat"]').forEach(e => { if (e !== document.body && !e.matches('.pr-sec,h1,h2,.page-wrap,.pr-sub,p') && !e.closest('.pr-card') && !e.querySelector('.pr-card')) e.style.display = 'none'; });
      document.querySelectorAll('html > div, body > div').forEach(e => { if (!e.querySelector('#practice') && e.id !== 'practice' && !e.classList.contains('page-wrap')) e.remove(); });
      // paper look: white page, full width, tighter cards
      document.head.insertAdjacentHTML('beforeend', '<style>html,body{background:#fff!important}.page-wrap,#practice{max-width:none!important;margin:0!important;padding:0!important;background:#fff!important;box-shadow:none!important}' +
        '.pr-card{padding:8px 12px!important;margin:0 0 8px!important;box-shadow:none!important;border:1px solid #D5DAE3!important}.pr-sec{margin:12px 0 8px!important}.wb-box{margin:0 0 8px!important;padding:6px 12px!important}.wb-box p{margin:4px 0!important}' +
        '.pr-hd,.pr-head{margin-bottom:2px!important}hr{margin:8px 0!important}</style>');
      // Nov 17, 2026 (Zach): the PDFs keep ONLY the problems and room for work: no Quick review boxes, no intro text
      document.querySelectorAll('.wb-box,.wb-top,.hero > p').forEach(e => e.remove());
      // top paragraph: the paper version
      const top = document.querySelector('.wb-top');
      if (top) top.innerHTML = 'You are building the <b>foundation for Math 1</b>. Every skill here comes back next year, so make it strong now. ' +
        'Do one section a day. Read the yellow Quick review first, then do the problems. <b>Show your work</b> in the space under each problem.';
      const h1 = document.querySelector('h1');
      if (h1) h1.insertAdjacentHTML('afterend', '<div style="display:flex;gap:28px;margin:10px 0 6px;font:600 14px Inter,sans-serif;color:#1E2D4F">' +
        ['Name', 'Date', 'Period'].map((w, i) => w + ' <span style="display:inline-block;width:' + [2.6, 1.2, 0.7][i] + 'in;border-bottom:1.5px solid #1E2D4F">&nbsp;</span>').join('') + '</div>');
      // Quick review boxes: always open, no arrow; the Skill Builders link becomes words
      document.querySelectorAll('details.wb-box').forEach(d => { d.open = true; d.style.breakInside = 'avoid'; const s = d.querySelector('summary'); if (s) s.style.listStyle = 'none'; });
      document.querySelectorAll('.wb-sb').forEach(sb => { const a = sb.querySelector('a'); sb.innerHTML = 'Need to see it again? Watch the <b>' + (a ? a.textContent.replace(/\s*↗\s*/, '') : 'Skill Builders') + '</b> video on the class website.'; });
      document.querySelectorAll('.wb-box summary').forEach(s => s.textContent = 'Quick review');
      let n = 0;
      D.secs.forEach((sec, si) => sec.probs.forEach(pr => {
        const c = document.getElementById('s' + si + 'p' + pr.n); if (!c) return; n++;
        c.style.display = ''; c.style.breakInside = 'avoid';
        c.querySelectorAll('.pr-row,.pr-fb,.pr-hintbox,button,.pr-hint,.ta-wrap').forEach(e => e.remove());
        c.querySelectorAll('*').forEach(e => { if (e.children.length === 0 && /\((type|tap)[^)]*\)/i.test(e.textContent)) e.innerHTML = e.innerHTML.replace(/\(type a fraction[^)]*\)/i, '(write it as a fraction)').replace(/\s*\((type|tap)[^)]*\)/ig, ''); });
        // the choices the web page shows: its own, or the tap choices made from the answer
        let ch = pr.choices && pr.choices.length ? pr.choices : null;
        if (!ch && window.TapAnswers) { const t = TapAnswers.choices(pr.ans, { q: strip(pr.q) }); if (Array.isArray(t) && t.length) ch = t.slice(); }
        let keyAns = pr.ans;
        if (ch) {
          const ri = ch.findIndex(t => norm(t) === norm(pr.ans)), box = document.createElement('div');
          if (ri < 0) throw new Error('no right choice for ' + strip(pr.q));
          box.style.cssText = 'margin:10px 0 0 2px;font:500 14.5px/1.5 Inter,system-ui,sans-serif;color:#1E2D4F';
          const wide = ch.some(t => strip(t).length > 26);
          box.innerHTML = '<div style="font-size:12.5px;color:#6B7488;margin-bottom:2px">Circle one.</div><div style="display:grid;grid-template-columns:' + (wide ? '1fr' : '1fr 1fr') + ';column-gap:24px">' + ch.map((t, i) => '<div style="margin:3px 0' + (mode === 'key' && i === ri ? ';color:#15803D;font-weight:700' : '') + '"><b>' + L[i] + '.</b> ' + t + (mode === 'key' && i === ri ? ' ✓' : '') + '</div>').join('') + '</div>';
          c.appendChild(box); keyAns = L[ri] + '. ' + ch[ri];
        }
        if (mode === 'blank') {
          const w = document.createElement('div');
          w.style.cssText = 'margin-top:10px;height:' + (ch && pr.lv < 4 ? '0.45in' : '0.85in') + ';border:1px dashed #C9CFDB;border-radius:8px;padding:4px 8px;font:500 11px Inter,sans-serif;color:#9AA3B5';
          w.textContent = 'Show your work'; c.appendChild(w);
        }
        const a = document.createElement('div');
        a.style.cssText = 'margin-top:10px;font:600 15px Inter,system-ui,sans-serif;color:#1E2D4F';
        a.innerHTML = 'Answer: ' + (mode === 'key'
          ? '<span style="color:#15803D;font-weight:700;border-bottom:1.5px solid #15803D;padding:0 10px">' + keyAns + '</span>'
          : '<span style="display:inline-block;width:2.6in;border-bottom:1.5px solid #1E2D4F">&nbsp;</span>');
        c.appendChild(a);
      }));
      document.querySelectorAll('.pr-sec').forEach(h => { h.style.breakAfter = 'avoid'; h.style.display = ''; });
      document.querySelectorAll('a').forEach(a => { const s = document.createElement('b'); s.innerHTML = a.innerHTML; a.replaceWith(s); });
      if (mode === 'key' && h1) h1.insertAdjacentHTML('beforeend', ' <span style="color:#15803D">— Answer Key</span>');
      const words = document.body.innerText;
      return { title: D.title, n, left: (words.match(/\b(tap|click|send my work|type)\b[^\n]{0,40}/ig) || []) };
    }, mode);
    await p.emulateMedia({ media: 'screen' });
    await p.pdf({
      path: G + out, format: 'Letter', printBackground: true,
      scale: 0.9, margin: { top: '0.45in', bottom: '0.55in', left: '0.5in', right: '0.5in' }, displayHeaderFooter: true, headerTemplate: '<div></div>',
      footerTemplate: '<div style="font:9px Inter,Arial,sans-serif;color:#6B7488;width:100%;text-align:center">' + info.title.replace(/&/g, '&amp;') +
        (mode === 'key' ? ' — Answer Key' : '') + ' · page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
    });
    console.log('wrote', out, info.n, 'problems', 'screen words left:', JSON.stringify(info.left), errs.join(' ')); await p.close();
  }
  await b.close();
})();
