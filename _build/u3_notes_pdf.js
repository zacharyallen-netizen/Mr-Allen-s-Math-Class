// Unit 3 notes → paper PDFs (blank, answer key, and the "Guided Notes (Print PDF)" copy).
// The page turns itself into a paper version when opened with ?paper=1 (see /paper.js).
//   node _build/u3_notes_pdf.js
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs = require('fs');
const SITE = '/home/claude/mr-allen-s-math-class/grade8/';
const SRC = 'file://' + SITE + 'Unit_3_Equations_Guided_Notes.html';
const PDF = { format: 'Letter', printBackground: true, scale: 0.9,
  margin: { top: '0.45in', bottom: '0.5in', left: '0.45in', right: '0.45in' },
  displayHeaderFooter: true, headerTemplate: '<span></span>',
  footerTemplate: '<div style="font:9px Inter,Arial,sans-serif;color:#6B7488;width:100%;text-align:center">Unit 3 Guided Notes · page <span class="pageNumber"></span> of <span class="totalPages"></span></div>' };
async function make(b, query, out) {
  const p = await b.newPage({ viewport: { width: 900, height: 1200 } });
  await p.goto(SRC + query, { waitUntil: 'load' });
  await p.waitForSelector('html[data-paper-ready]', { timeout: 15000 });
  await p.waitForTimeout(400);
  await p.emulateMedia({ media: 'print' });
  await p.pdf(Object.assign({ path: SITE + out }, PDF));
  await p.close(); console.log('wrote', out);
}
(async () => {
  const b = await chromium.launch();
  await make(b, '?paper=1', 'Unit3_Equations_Notes_Blank.pdf');
  await make(b, '?paper=1&key=1', 'Unit3_Equations_Notes_AnswerKey.pdf');
  fs.copyFileSync(SITE + 'Unit3_Equations_Notes_Blank.pdf', SITE + 'Unit_3_Equations_Guided_Notes.pdf');
  console.log('copied blank → Unit_3_Equations_Guided_Notes.pdf');
  await b.close();
})();
