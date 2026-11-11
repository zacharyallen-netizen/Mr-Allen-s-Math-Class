// Re-make the Unit 6 and Unit 7 pre-test PDFs (blank + answer key) from the pages, the same way render_all.js does.
//   python3 -m http.server 8765 --bind 127.0.0.1   (from the repo root), then:  node _build/pretest_pdf_nov11.js
const { chromium } = require('playwright'); const path = require('path'); const G = path.join(__dirname, '..', 'grade8');
(async () => { const b = await chromium.launch();
  for (const [page, pdf] of [['unit6-pretest', 'Unit6_PreTest'], ['unit7-pretest', 'Unit7_PreTest']]) for (const key of [false, true]) {
    const p = await b.newPage(); await p.goto('http://127.0.0.1:8765/grade8/' + page + '.html?paper=1', { waitUntil: 'load' }); await p.waitForTimeout(900);
    if (key) { await p.evaluate(() => { const r = document.getElementById('reveal'); if (r) r.click(); }); await p.waitForTimeout(300); }
    await p.emulateMedia({ media: 'print' });
    await p.pdf({ path: path.join(G, pdf + (key ? '_AnswerKey' : '') + '.pdf'), format: 'Letter', printBackground: true, margin: { top: '0.5in', bottom: '0.5in', left: '0.45in', right: '0.45in' } });
    await p.close(); console.log('made', pdf + (key ? '_AnswerKey' : '') + '.pdf'); }
  await b.close(); })();
