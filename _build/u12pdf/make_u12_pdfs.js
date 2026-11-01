// Regenerates the Unit 1 (Form A, Form B) and Unit 2 Exponent Rules pre-test PDFs
// straight from the online HTML pages, so paper and screen can never drift apart.
//   node make_u12_pdfs.js            -> writes 6 PDFs into grade8/
// Blank = page as loaded (print media). Key = the page's own answer reveal, then print.
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const G = '/home/claude/mr-allen-s-math-class/grade8/';

const JOBS = [
  { html: 'Unit1_PreTest',       out: 'Unit1_PreTest',               name: 'Unit 1 Pre-Test · Form A',
    key: async p => p.evaluate(() => window.showAnswerKey()) },
  { html: 'Unit1_PreTest_FormB', out: 'Unit1_PreTest_FormB',         name: 'Unit 1 Pre-Test · Form B',
    key: async p => p.evaluate(() => window.showAnswerKey()) },
  { html: 'Unit_2_Pretest',      out: 'Unit2_PreTest_ExponentRules', name: 'Unit 2 Pre-Test · Exponent Rules',
    key: async p => p.click('#reveal') },
];

const footer = label => `<div style="width:100%;font-family:Georgia,serif;font-size:8.5px;color:#666;text-align:center;">
  ${label} · Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>`;

async function render(browser, job, isKey) {
  const page = await browser.newPage({ viewport: { width: 1000, height: 1200 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('file://' + G + job.html + '.html', { waitUntil: 'load' });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(300);
  if (isKey) { await job.key(page); await page.waitForTimeout(300); }

  // guard rails: blank has no answers; key passes every one of the page's own checkers
  const state = await page.evaluate(() => ({
    filled: [...document.querySelectorAll('input.answer, .ans input')].filter(i => i.value.trim()).length,
    selects: [...document.querySelectorAll('#vocab select')].filter(s => s.value).length,
    keyErrors: [...document.querySelectorAll('.feedback')].filter(f => /KEY ERROR/.test(f.textContent)).length,
    notCorrect: [...document.querySelectorAll('#quiz .q, .qgrid .q')].filter(q => !q.classList.contains('correct')).length,
  }));
  if (!isKey && (state.filled || state.selects)) throw new Error(job.html + ': blank version has answers ' + JSON.stringify(state));
  if (isKey && (state.keyErrors || state.notCorrect)) throw new Error(job.html + ': key incomplete ' + JSON.stringify(state));
  if (errors.length) throw new Error(job.html + ': page errors ' + errors.join(' | '));

  await page.emulateMedia({ media: 'print' });
  const file = G + job.out + (isKey ? '_AnswerKey' : '') + '.pdf';
  await page.pdf({
    path: file, format: 'Letter', printBackground: true,
    margin: { top: '0.5in', bottom: '0.55in', left: '0.45in', right: '0.45in' },
    displayHeaderFooter: true, headerTemplate: '<span></span>',
    footerTemplate: footer(isKey ? job.name + ' · ANSWER KEY' : job.name),
  });
  await page.close();
  return file;
}

(async () => {
  const browser = await chromium.launch();
  for (const job of JOBS) {
    for (const isKey of [false, true]) {
      const f = await render(browser, job, isKey);
      console.log('wrote', f.replace(G, 'grade8/'));
    }
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
