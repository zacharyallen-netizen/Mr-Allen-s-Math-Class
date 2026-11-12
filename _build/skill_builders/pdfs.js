/* Skill Builders PDFs: printed from the same pages (?paper=1 blank, ?paper=1&key=1 key), so print = screen.
   Needs the local server:  python3 -m http.server 8765 --bind 127.0.0.1  (from the repo root)
   Fonts: sh _build/materials/get_fonts.sh, then copy the .ttf files into ~/.local/share/fonts (fc-cache -f).
   node _build/skill_builders/pdfs.js [units]   → grade8/skills/pdf/SkillBuilders_UnitN_{Lessons,Practice}[_AnswerKey].pdf
   Then: python3 _build/skill_builders/combine_all.py  (one file for all units + one key, with bookmarks) */
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const path = require('path');
const OUT = path.join(__dirname, '..', '..', 'grade8', 'skills', 'pdf');
const units = (process.argv[2] || '1,2,3,4,5,6,7,8').split(',').map(Number);
(async () => {
  require('fs').mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const n of units) for (const [mode, kind] of [['', 'Lessons'], ['-practice', 'Practice']]) for (const key of [false, true]) {
    const url = `http://127.0.0.1:8765/grade8/skill-builders-unit${n}${mode}.html?paper=1${key ? '&key=1' : ''}`;
    await p.goto(url); await p.waitForFunction(() => window.SB && SB.ready, null, { timeout: 10000 });
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    await p.addStyleTag({ content: '.site-bar,#site-bar,.fx-foot,.fx-streak,.fx-tpanel,.pp-foot{display:none!important} body{background:#fff!important}' });
    const file = path.join(OUT, `SkillBuilders_Unit${n}_${kind}${key ? '_AnswerKey' : ''}.pdf`);
    await p.pdf({ path: file, format: 'Letter', printBackground: true, margin: { top: '0.45in', bottom: '0.5in', left: '0.5in', right: '0.5in' },
      displayHeaderFooter: true, headerTemplate: '<span></span>',
      footerTemplate: `<div style="font:8px Inter,sans-serif;color:#5B6475;width:100%;text-align:center">Skill Builders · Unit ${n} · ${kind === 'Lessons' ? 'Mini-Lessons' : 'Practice Set'}${key ? ' · Answer Key' : ''} · page <span class="pageNumber"></span> of <span class="totalPages"></span></div>`,
      outline: true, tagged: true });
    console.log('wrote', path.basename(file));
  }
  await b.close();
})();
