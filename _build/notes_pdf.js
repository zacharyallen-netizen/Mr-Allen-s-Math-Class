// Guided notes → paper PDFs (blank + answer key). Pass "-" for the copy: the site keeps ONE PDF per notes page
// (duplicate "Guided Notes (Print PDF)" copies were removed 2026-10-30; don't recreate them).
// The notes page must load /paper.js; it turns itself into paper when opened with ?paper=1 (&key=1 for the key).
//   node _build/notes_pdf.js <page.html> <Blank.pdf> <AnswerKey.pdf> [PrintCopy.pdf] ["Footer label"]
//   e.g. node _build/notes_pdf.js Unit_4_Geometry_Guided_Notes.html Unit4_Geometry_Notes_Blank.pdf \
//        Unit4_Geometry_Notes_AnswerKey.pdf - "Unit 4 Guided Notes"
// All paths are inside grade8/.
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs = require('fs');
const SITE = '/home/claude/mr-allen-s-math-class/grade8/';
const [, , page, blank, key, copy, label] = process.argv;
if (!page || !blank || !key) { console.error('usage: node _build/notes_pdf.js page.html Blank.pdf AnswerKey.pdf [Copy.pdf] ["label"]'); process.exit(1); }
const foot = (label || 'Guided Notes').replace(/[<&]/g, '');
const PDF = { format: 'Letter', printBackground: true, scale: 0.9,
  margin: { top: '0.45in', bottom: '0.5in', left: '0.45in', right: '0.45in' },
  displayHeaderFooter: true, headerTemplate: '<span></span>',
  footerTemplate: '<div style="font:9px Inter,Arial,sans-serif;color:#6B7488;width:100%;text-align:center">' + foot +
    ' · page <span class="pageNumber"></span> of <span class="totalPages"></span></div>' };
async function make(b, query, out) {
  const p = await b.newPage({ viewport: { width: 900, height: 1200 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + SITE + page + query, { waitUntil: 'load' });
  await p.waitForSelector('html[data-paper-ready]', { timeout: 20000 });
  await p.waitForTimeout(500);
  await p.emulateMedia({ media: 'print' });
  await p.pdf(Object.assign({ path: out.startsWith('/') ? out : SITE + out }, PDF));
  await p.close(); console.log('wrote', out, errs.length ? 'PAGE ERRORS: ' + errs.join(' | ') : '');
}
(async () => {
  const b = await chromium.launch();
  await make(b, '?paper=1', blank);
  await make(b, '?paper=1&key=1', key);
  if (copy && copy !== '-') { fs.copyFileSync(blank.startsWith('/') ? blank : SITE + blank, copy.startsWith('/') ? copy : SITE + copy); console.log('copied', blank, '→', copy); }
  await b.close();
})();
