// Verify score-send wiring on every grade 8 pre-test.
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs = require('fs');
const OUT = __dirname;
const BASE = 'http://127.0.0.1:8793/grade8/';
const IGN = /fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext|net::ERR/;

const GEN = ['Unit2_PreTest_ScientificNotation', 'Unit3_PreTest', 'Unit4_PreTest', 'Unit5_PreTest', 'Unit6_PreTest',
             'Unit7_PreTest', 'Unit8_PreTest', 'Unit9_PreTest'];
const ONLY = process.argv[2];

function rightAnswer(chk) {
  const t = chk[0];
  if (t === 'val' || t === 'num') return String(chk[1]);
  if (t === 'sci') return chk[1].toExponential().replace('e+', 'e');
  if (t === 'text' || t === 'contains') return chk[1][0];
  if (t === 'frac') return chk[1] + '/' + chk[2];
  if (t === 'coord') return '(' + chk[1] + ', ' + chk[2] + ')';
  if (t === 'pi') return chk[1] + 'π';
  if (t === 'linear') return chk[1] + 'x+' + chk[2];
}

async function open(b, name, w) {
  const page = await b.newPage({ viewport: { width: w, height: 900 } });
  const errs = [], captured = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !IGN.test(m.text())) errs.push('console: ' + m.text()); });
  await page.route('**/script.google.com/**', async route => {
    captured.push(route.request().postData());
    await route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ ok: true, name: 'Test Student', n: 1, right: 1 }) });
  });
  await page.goto(BASE + name + '.html', { waitUntil: 'load' });
  await page.waitForTimeout(300);
  return { page, errs, captured };
}

async function common(page, name, errs, captured, expect) {
  const r = {};
  r.panel = await page.$('#scoresend') ? 'yes' : 'NO PANEL';
  r.panelAtEnd = await page.evaluate(() => {   // last thing on the page: end of .sheet, or right after it
    const p = document.getElementById('scoresend'), sh = document.querySelector('.sheet');
    if (sh.lastElementChild === p) return 'end of sheet';
    let n = sh.nextElementSibling; while (n && (n.tagName === 'SCRIPT' || n.tagName === 'STYLE')) n = n.nextElementSibling;
    return n === p ? 'after sheet' : 'WRONG PLACE';
  });
  r.overlap = await page.evaluate(() => {        // nothing covers the panel heading when scrolled to the end
    scrollTo(0, document.body.scrollHeight);
    const p = document.getElementById('scoresend').firstElementChild, b = p.getBoundingClientRect();
    const hit = document.elementFromPoint(b.left + 10, b.top + b.height / 2);
    return p.contains(hit) ? 'clear' : 'COVERED by ' + (hit && hit.className);
  });
  await page.fill('#ssname', 'Test Student');
  await page.click('#ssbtn');
  await page.waitForTimeout(500);
  r.msg = await page.textContent('#ssmsg');
  const body = captured[captured.length - 1];
  fs.mkdirSync(OUT + '/payloads', { recursive: true });
  fs.writeFileSync(OUT + '/payloads/' + name + '.json', body || '{}');
  const d = JSON.parse(body || '{}');
  r.items = (d.items || []).map(i => i.id + ':' + i.std + '/b' + i.band + '/f' + i.first + 'F' + i.final + 't' + i.tries).join(' ');
  r.kind = d.kind; r.unit = d.unit; r.page = d.page; r.revealed = d.revealed;
  r.labels = (d.items || []).slice(0, 2).map(i => i.label);
  if (expect) for (const [id, f, F] of expect) {
    const it = (d.items || []).find(i => i.id === id);
    if (!it || it.first !== f || it.final !== F) errs.push('expect ' + id + ' first=' + f + ' final=' + F + ' got ' + JSON.stringify(it));
  }
  return r;
}

async function layout(b, name, extra) {
  const res = {};
  for (const w of [390, 1280]) {
    const { page, errs } = await open(b, name, w);
    if (extra) await extra(page);
    res['hscroll' + w] = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    const el = await page.$('#scoresend');
    if (el) {
      await el.scrollIntoViewIfNeeded();
      const box = await el.boundingBox();
      await page.screenshot({ path: OUT + '/shots/' + name + '_' + w + '.png',
        clip: { x: 0, y: Math.max(0, box.y + (await page.evaluate(() => scrollY)) - 260), width: w, height: Math.min(560, box.height + 300) }, fullPage: true });
    }
    await page.emulateMedia({ media: 'print' });
    res['printHidden' + w] = await page.evaluate(() => getComputedStyle(document.getElementById('scoresend')).display === 'none');
    if (w === 1280) {
      await page.pdf({ path: OUT + '/pdf/' + name + '.pdf', format: 'Letter', printBackground: true,
        margin: { top: '0.5in', bottom: '0.5in', left: '0.45in', right: '0.45in' } });
    }
    if (errs.length) res['errs' + w] = errs;
    await page.close();
  }
  return res;
}

(async () => {
  fs.mkdirSync(OUT + '/shots', { recursive: true }); fs.mkdirSync(OUT + '/pdf', { recursive: true });
  const b = await chromium.launch();
  const report = {};

  // ---------- generated pre-tests ----------
  for (const name of GEN) {
    if (ONLY && ONLY !== name) continue;
    const { page, errs, captured } = await open(b, name, 1280);
    const QS = await page.evaluate(() => QS);
    const n = QS.length;
    const ans = q => rightAnswer(q.chk);
    for (const q of QS) {   // sanity: my answers are right
      const ok = await page.evaluate(([c, a]) => runCheck(c, a), [q.chk, ans(q)]);
      if (!ok) errs.push('my answer for ' + q.id + ' not accepted: ' + ans(q));
    }
    const qT = QS.find(q => q.lvl === 'target'), qA = QS.find(q => q.lvl === 'advanced'), qL = QS[n - 1];
    // check 1: q1 wrong, q2 right, target right, advanced wrong; q3 blank (must not be recorded)
    await page.fill('#i1', '999'); await page.fill('#i2', ans(QS[1]));
    await page.fill('#i' + qT.id, ans(qT)); await page.fill('#i' + qA.id, '999');
    await page.click('#check');
    const fb1 = await page.textContent('#fb1'), sb = await page.textContent('#scorebox');
    if (!/answer/.test(fb1)) errs.push('q1 wrong feedback missing: ' + fb1);
    if (!/correct/.test(await page.textContent('#fb2'))) errs.push('q2 feedback missing');
    // check 2: fix q1, fix advanced, add last
    await page.fill('#i1', ans(QS[0])); await page.fill('#i' + qA.id, ans(qA)); await page.fill('#i' + qL.id, ans(qL));
    await page.press('#i' + qL.id, 'Enter');   // Enter also checks
    const r = await common(page, name, errs, captured,
      [['q1', 0, 1], ['q2', 1, 1], ['q' + qT.id, 1, 1], ['q' + qA.id, 0, 1], ['q' + qL.id, 1, 1]]);
    r.scorebox = sb.replace(/\s+/g, ' ').trim();
    if (r.items.split(' ').length !== 5) errs.push('expected 5 items, got ' + r.items);
    if (r.revealed !== false) errs.push('revealed should be false');
    // reset clears, reveal flags
    await page.click('#reset');
    const after = await page.evaluate(() => ScoreSend.count().n);
    if (after !== 0) errs.push('reset did not clear: ' + after);
    await page.click('#reveal');
    await page.fill('#i1', ans(QS[0])); await page.click('#check');
    await page.click('#ssbtn'); await page.waitForTimeout(400);
    const d2 = JSON.parse(captured[captured.length - 1]);
    if (!(d2.revealed === true && d2.items.length === 1 && d2.session !== JSON.parse(captured[0]).session))
      errs.push('reveal/reset payload wrong: ' + JSON.stringify({ rev: d2.revealed, n: d2.items.length }));
    r.vocabStillScored = /Basic \d+\/\d+/.test(await page.textContent('#lvls'));
    r.errs = errs; await page.close();
    Object.assign(r, await layout(b, name));
    report[name] = r;
  }

  // ---------- Unit 2 exponent rules (hand-built) ----------
  if (!ONLY || ONLY === 'Unit_2_Pretest') {
    const name = 'Unit_2_Pretest';
    const { page, errs, captured } = await open(b, name, 1280);
    const QS = await page.evaluate(() => QS);
    await page.fill('#i1', '4^4'); await page.fill('#i7', QS[6].ans[0]); await page.fill('#i13', '2');
    await page.click('#check');
    if (!/answer/.test(await page.textContent('#fb1'))) errs.push('q1 wrong feedback missing');
    await page.fill('#i1', '4⁵'); await page.fill('#i13', '1'); await page.fill('#i18', '4x^2/y^2');
    await page.press('#i18', 'Enter');
    const r = await common(page, name, errs, captured, [['q1', 0, 1], ['q7', 1, 1], ['q13', 0, 1], ['q18', 1, 1]]);
    await page.click('#reset');
    if (await page.evaluate(() => ScoreSend.count().n) !== 0) errs.push('reset did not clear');
    await page.click('#reveal'); await page.fill('#i2', '5^6'); await page.click('#check');
    await page.click('#ssbtn'); await page.waitForTimeout(400);
    const d2 = JSON.parse(captured[captured.length - 1]);
    if (!(d2.revealed === true && d2.items.length === 1)) errs.push('reveal/reset payload wrong');
    r.errs = errs; await page.close();
    Object.assign(r, await layout(b, name));
    report[name] = r;
  }

  // ---------- Unit 1 forms (hand-built, per-question Check) ----------
  for (const [name, A] of [['Unit1_PreTest', { q1: '0.375', q9: '6.3', q14: ['15', '60'] }],
                           ['Unit1_PreTest_FormB', { q1: '0.625', q9: '5.3', q14: ['14', '56'] }]]) {
    if (ONLY && ONLY !== name) continue;
    const { page, errs, captured } = await open(b, name, 1280);
    const card = n => page.locator('section.q').nth(n - 1);
    // q1 wrong then right (per-question Check button)
    await card(1).locator('input.answer').fill('0.5'); await card(1).locator('.check-btn').click();
    if (!/Not quite/.test(await card(1).locator('.feedback').textContent())) errs.push('q1 wrong feedback missing');
    await card(1).locator('input.answer').fill(A.q1); await card(1).locator('.check-btn').click();
    if (!/Correct/.test(await card(1).locator('.feedback').textContent())) errs.push('q1 right feedback missing');
    // q3 classify right; q6 classify wrong (Check all)
    await card(3).locator('input.answer').fill('R'); await card(6).locator('input.answer').fill('R');
    // q9 number line (click the right tick)
    await card(9).locator('.nl-hit[aria-label="' + A.q9 + '"]').click({ force: true });
    // q13 ordering — click chips in correct order (sorted by value)
    const items = await page.evaluate(() => BANDS[2].sections[1].qs[0].items.slice().sort((a, b) => a.value - b.value).map(i => i.label));
    for (const lab of items) await card(13).locator('button.chip', { hasText: lab }).first().click();
    // q14 multi — one wrong
    await card(14).locator('input.answer').nth(0).fill(A.q14[0]); await card(14).locator('input.answer').nth(1).fill('1');
    await page.click('#checkAll');
    await card(6).locator('input.answer').fill('IR'); await card(6).locator('input.answer').press('Enter');
    await card(14).locator('input.answer').nth(1).fill(A.q14[1]); await card(14).locator('.check-btn').click();
    const chip = await page.textContent('#chip');
    const r = await common(page, name, errs, captured,
      [['q1', 0, 1], ['q3', 1, 1], ['q6', 0, 1], ['q9', 1, 1], ['q13', 1, 1], ['q14', 0, 1]]);
    r.chip = chip;
    await page.click('#reset'); await page.waitForTimeout(300);
    if (await page.evaluate(() => ScoreSend.count().n) !== 0) errs.push('reset did not clear');
    r.errs = errs; await page.close();
    Object.assign(r, await layout(b, name));
    report[name] = r;
  }

  await b.close();
  console.log(JSON.stringify(report, null, 1));
})();
