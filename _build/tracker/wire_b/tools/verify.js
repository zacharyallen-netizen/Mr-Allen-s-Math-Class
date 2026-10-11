// Verify score-send wiring on the wire_b pages.
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs = require('fs');
const OUT = '/home/claude/mr-allen-s-math-class/_build/tracker/wire_b';
const BASE = 'http://localhost:8792/grade8/';
const IGN = /fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext|net::ERR/;

// Click MC options: for each [cardId, wantRight]
async function mcClick(page, list, sel) {
  await page.evaluate(({ list, sel }) => {
    list.forEach(([id, right]) => {
      const card = document.getElementById(id);
      const btns = [...card.querySelectorAll(sel)];
      const corr = btns[0].getAttribute('onclick').match(/,'((?:[^'\\]|\\.)*)'\)$/)[1];
      const b = btns.find(x => (x.textContent.trim() === corr.trim()) === right);
      b.click();
    });
  }, { list, sel });
}

const PAGES = {
  'unit7_practice.html': async p => mcClick(p, [['7a', true], ['7b', false], ['7c', true], ['7h', false], ['7l', true]], '.opt-btn'),
  'unit8_practice.html': async p => mcClick(p, [['8a', true], ['8b', false], ['8g', true], ['8i', false], ['8j', true]], '.opt-btn'),
  'volume_practice.html': async p => mcClick(p, [['v1', true], ['v4', false], ['v2', true], ['v12', false]], '.opt-btn'),
  'unit7_practice1.html': async p => mcClick(p, [['u7c1_1', true], ['u7c1_10', false], ['u7c2_1', true], ['u7c3_2', false]], '.ob'),
  'unit7_practice2.html': async p => mcClick(p, [['u7h1_1', false], ['u7h2_2', true], ['u7h3_1', true], ['u7h4_4', false]], '.ob'),
  'unit8_practice1.html': async p => mcClick(p, [['u8c1_1', true], ['u8c1_7', false], ['u8c4_6', true], ['u8c5_3', false]], '.ob'),
  'unit8_practice2.html': async p => mcClick(p, [['u8h1_2', true], ['u8h2_6', false], ['u8h4_4', true], ['u8h5_7', false]], '.ob'),
  'transformations-guided-notes.html': async p => {
    await mcClick(p, [['chk1a', true], ['chk1b', false], ['p-trans-1', true], ['chk6b', false]], '.chk-btn');
    await p.fill('#p-trans-2-x', '1'); await p.fill('#p-trans-2-y', '1');
    await p.click('#p-trans-2 button[onclick^="chkInput"]');
    await p.fill('#p-trans-2-x', '2'); await p.fill('#p-trans-2-y', '-1');
    await p.click('#p-trans-2 button[onclick^="chkInput"]');
  },
  'slope_intercept_practice.html': async p => {
    // card 0: y = 2x, all right; card 1: y = 2x+1, one wrong then right
    const fill = async (idx, vals) => { const ins = await p.$$(`#card-${idx} .y-input`); for (let i = 0; i < ins.length; i++) await ins[i].fill(String(vals[i])); };
    await fill(0, [-6, -4, -2, 0, 2, 4, 6]);
    await p.click('#card-0 button[onclick^="checkAnswers"]');
    await fill(1, [-5, -3, -1, 1, 3, 5, 99]);
    await p.click('#card-1 button[onclick^="checkAnswers"]');
    await fill(1, [-5, -3, -1, 1, 3, 5, 7]);
    await p.click('#card-1 button[onclick^="checkAnswers"]');
  },
  'tables_linear_functions.html': async p => {
    await p.selectOption('#p3-sel', 'nonlinear'); await p.click('#p3 button[onclick="checkP3()"]');
    await p.selectOption('#p3-sel', 'linear'); await p.fill('#p3-slope', '2'); await p.click('#p3 button[onclick="checkP3()"]');
    await p.selectOption('#p4-sel', 'nonlinear'); await p.click('#p4 button[onclick="checkP4()"]');
  },
  'graphing.html': async p => {
    await p.evaluate(() => { slopePoints = [{ x: 0, y: 1 }, { x: 1, y: 3 }]; });
    await p.click('button[onclick="checkSlope()"]');
    await p.click('#slope-next'); await p.evaluate(() => { slopePoints = [{ x: 0, y: 1 }, { x: 1, y: 3 }]; });
    await p.click('button[onclick="checkSlope()"]');
    await p.click('button[onclick="clearSlope()"]'); await p.evaluate(() => { slopePoints = [{ x: 0, y: 4 }, { x: 1, y: 3 }]; });
    await p.click('button[onclick="checkSlope()"]');
    await p.click('.tab-btn:nth-child(2)');
    await p.evaluate(() => { sysLine1 = [{ x: 0, y: 1 }, { x: 1, y: 3 }]; sysLine2 = [{ x: 0, y: 4 }, { x: 1, y: 3 }]; });
    await p.click('button[onclick="checkSystem()"]');
    await p.click('.tab-btn:nth-child(1)');
  },
  'slope_guided_notes.html': async p => {
    await p.evaluate(() => goSection(4));
    await p.fill('#ans-0', '3'); await p.click('#prob-0 .btn-primary');
    await p.fill('#ans-0', '2'); await p.click('#prob-0 .btn-primary');
    await p.fill('#ans-2', '1/2'); await p.click('#prob-2 .btn-primary');
    await p.fill('#ans-4', 'undefined'); await p.click('#prob-4 .btn-primary');
  },
  'tables-and-systems-guided-notes.html': async p => {
    await p.fill('#p1m', '3'); await p.fill('#p1b', '2'); await p.click('button[onclick^="checkEq(\'p1\'"]');
    await p.fill('#p1b', '-2'); await p.click('button[onclick^="checkEq(\'p1\'"]');
    await p.click('button[onclick="testPoint(\'tp1\', true)"]');
    await p.fill('#pg1x', '2'); await p.fill('#pg1y', '4'); await p.click('button[onclick^="checkPoint(\'pg1\'"]');
    await p.fill('#s1x', '1'); await p.fill('#s1y', '1'); await p.click('button[onclick^="checkPoint(\'s1\'"]');
  },
  'Unit_6_Functions_Guided_Notes.html': async p => {
    const blur = async (qid, v) => { await p.evaluate(({ qid, v }) => { const i = document.querySelector(`input.fill[data-qid="${qid}"]`); i.value = v; i.dispatchEvent(new Event('input')); i.dispatchEvent(new Event('blur')); }, { qid, v }); };
    await blur('6-1-1', 'something');      // note blank: must NOT be recorded
    await blur('6-1-6', 'no'); await blur('6-1-6', 'yes'); await blur('6-1-6', 'yes'); // practice: wrong then right; repeat ignored
    await blur('6-1-7', 'no');
    await blur('6-4-4', '25');
    await blur('6-5-8', 'B');
    await blur('6-6-6', 'out');
  },
  'trendline_lab.html': async p => {
    await p.click('[data-station="3"]'); await p.click('#startBtn');
    await p.click('#lockBtn'); await p.click('#nextBtn'); await p.click('#lockBtn');
    await p.click('.stage-top .btn.ghost');
    await p.click('[data-station="5"]'); await p.click('#startBtn');
    // Round 1: answer every step; wrong first on the prediction box when present
    for (let k = 0; k < 12; k++) {
      if (await p.$('#nextBtn')) break;
      const box = await p.$('.panel input.box:not([disabled])');
      if (box) {
        const y0 = await p.evaluate(() => TL.ses.item.y0);
        await box.fill(String(y0 + 50)); await p.click('.panel .card:last-child .btn-row .btn:not(.sec)');
        await box.fill(String(y0)); await p.click('.panel .card:last-child .btn-row .btn:not(.sec)');
        continue;
      }
      const ch = await p.$$('.panel .card:last-child .choice:not([disabled])');
      if (ch.length) { await ch[0].click(); continue; }
      break;
    }
  },
};

(async () => {
  const only = process.argv.slice(2);
  const browser = await chromium.launch();
  fs.mkdirSync(OUT + '/payloads', { recursive: true }); fs.mkdirSync(OUT + '/shots', { recursive: true });
  const report = [];
  for (const [file, act] of Object.entries(PAGES)) {
    if (only.length && !only.includes(file)) continue;
    const errs = []; const captured = [];
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    page.on('pageerror', e => errs.push('pageerror: ' + e.message));
    page.on('console', m => { if (m.type() === 'error' && !IGN.test(m.text())) errs.push('console: ' + m.text()); });
    page.on('dialog', d => d.dismiss());
    await page.route('**/script.google.com/**', async route => {
      captured.push(route.request().postData());
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, name: 'Test Student', n: 1, right: 1 }) });
    });
    await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    await page.goto(BASE + file, { waitUntil: 'load' });
    await page.waitForTimeout(200);
    let note = '';
    try { await act(page); } catch (e) { note = 'ACTION FAILED: ' + e.message.split('\n')[0]; }
    await page.waitForTimeout(150);
    const before = await page.evaluate(() => document.getElementById('ssmsg') && document.getElementById('ssmsg').textContent);
    await page.fill('#ssname', 'Test Student');
    await page.click('#ssbtn');
    await page.waitForTimeout(400);
    const after = await page.evaluate(() => document.getElementById('ssmsg').textContent);
    const base = file.replace('.html', '');
    if (captured.length) fs.writeFileSync(`${OUT}/payloads/${base}.json`, captured[captured.length - 1]);
    // layout checks
    const res = {};
    for (const w of [1280, 390]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.waitForTimeout(150);
      res['hscroll' + w] = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      const box = await page.$('#scoresend');
      res['visible' + w] = box ? await box.isVisible() : false;
      if (box) { await box.scrollIntoViewIfNeeded(); await page.waitForTimeout(100);
        await page.screenshot({ path: `${OUT}/shots/${base}-${w}.png`, clip: await (async () => { const b = await box.boundingBox(); const y = Math.max(0, b.y - 60); return { x: 0, y, width: w, height: Math.min(900 - y, b.height + 120) }; })() }); }
    }
    await page.emulateMedia({ media: 'print' });
    res.printHidden = await page.evaluate(() => getComputedStyle(document.getElementById('scoresend')).display === 'none');
    await page.emulateMedia({ media: 'screen' });
    const items = captured.length ? JSON.parse(captured[captured.length - 1]).items : [];
    report.push({ file, note, errs, posts: captured.length, items: items.map(i => `${i.id}:${i.first}/${i.final}:${i.std}`), before, after, ...res });
    await ctx.close();
  }
  await browser.close();
  for (const r of report) console.log(JSON.stringify(r, null, 1));
})();
