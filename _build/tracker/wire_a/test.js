const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs = require('fs');
const W = __dirname, BASE = 'http://127.0.0.1:8731/grade8/';
const IGN = /fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext|net::ERR/;

async function val(p, id, ans) { await p.fill('#' + id + '-in', ans); await p.click('#' + id + ' .val-chk button'); }
async function mc(p, id, text) { const bs = await p.$$('#' + id + ' .chk-btn'); for (const b of bs) if ((await b.textContent()).trim() === text) return b.click(); throw 'no button ' + text; }
async function fbHas(p, sel, cls) { return p.$eval(sel, (e, c) => e.classList.contains(c), cls); }

const PAGES = {
  'Unit_1_Real_Numbers_Guided_Notes.html': async p => {
    await mc(p, 'chk1a', '√49');                  // wrong first try (MC locks)
    await mc(p, 'chk2a', '144');
    await val(p, 'chk2b', '12'); await val(p, 'chk2b', '13');
    if (!await fbHas(p, '#fb-chk2b', 'c')) throw 'chk2b feedback broken';
    await val(p, 'chk4a', '5.5');
    await val(p, 'chk3a', '');                     // empty: must not record
  },
  'Unit_1_Estimating_Roots.html': async p => {
    await p.fill('#tryInput', '1.0'); await p.click('#tryCheck');
    const t = await p.evaluate(() => document.getElementById('tryPrompt').textContent);
    // compute the right answer from the prompt
    const m = t.match(/([√∛])(\d+)/); const n = +m[2], k = m[1] === '√' ? 2 : 3;
    const r = k === 2 ? Math.sqrt(n) : Math.cbrt(n), lo = Math.floor(r + 1e-9);
    const est = lo + (n - lo ** k) / ((lo + 1) ** k - lo ** k);
    await p.fill('#tryInput', (Math.round(est * 10) / 10).toFixed(1)); await p.click('#tryCheck');
    if (!(await p.$eval('#tryFb', e => e.className)).includes('ok')) throw 'try feedback broken';
    await p.click('#tryNew'); await p.fill('#tryInput', '0.1'); await p.click('#tryCheck');
  },
  'guided_notes_real_number_system.html': async p => {
    await p.fill('#a1-1', '375/1000'); await p.click('#p1-1 .check-btn');
    await p.fill('#a1-1', '3/8'); await p.click('#p1-1 .check-btn');
    if (!(await p.$eval('#f1-1', e => e.className)).includes('correct')) throw '1-1 broken';
    await p.fill('#a1-2', '0.(63)'); await p.click('#p1-2 .check-btn');
    await p.fill('#a2-2', '6.692'); await p.click('#p2-2 .check-btn');
    await p.fill('#a2-5', '15'); await p.click('#p2-5 .check-btn');
    await p.fill('#a2-5', '14.1'); await p.click('#p2-5 .check-btn');
    await p.click('#p3-1 .check-btn');
    await p.click('#p1-3 .check-btn');                 // empty: must not record
  },
  'Unit_2_Exponent_Rules_Guided_Notes.html': async p => {
    await mc(p, 'chk21a', 'x⁸ (Product Rule)');
    await val(p, 'u2pA1', 'x^15'); await val(p, 'u2pA1', 'x^8');
    await val(p, 'u2pA5', '27m^6');
  },
  'Unit_2_Scientific_Notation_Guided_Notes.html': async p => {
    await val(p, 'u2pB1', '45x10^6'); await val(p, 'u2pB1', '4.5x10^7');
    await val(p, 'u2pB4', '0.000091');
    await val(p, 'u2pC2', '2x10^4');
  },
  'Unit_2_Exponents_Guided_Notes.html': async p => {
    await mc(p, 'chk21a', 'x² (Quotient Rule)');
    await val(p, 'u2pA2', 'y^12');
    await val(p, 'u2pB3', '602000000');
    await val(p, 'u2pC4', '3x10^2'); await val(p, 'u2pC4', '3x10^3');
  },
  'Unit_3_Equations_Guided_Notes.html': async p => {
    await mc(p, 'chk36a', 'Infinitely many solutions');
    await val(p, 'pA1', '4'); await val(p, 'pA1', 'x=5');
    await val(p, 'pB2', 'no solution');
    await val(p, 'pC3', 'x>-3'); await val(p, 'pC3', '-3>x');
    if (!await fbHas(p, '#fb-pC3', 'c')) throw 'pC3 broken';
  },
  'Unit_4_Geometry_Guided_Notes.html': async p => {
    await mc(p, 'chk41a', '75°');
    await val(p, 'u4pA1', '55');
    await val(p, 'u4pC5', '100'); await val(p, 'u4pC5', '120');
    await val(p, 'u4pD4', '12');
  },
  'Unit_5_Pythagorean_Guided_Notes.html': async p => {
    await val(p, 'u5h1', '5');
    await mc(p, 'chk54b', 'No');
    await val(p, 'u5pB1', '4'); await val(p, 'u5pB1', '3');
    await val(p, 'u5pD3', '10');
    await val(p, 'u5pE6', 'yes'); await val(p, 'u5pE6', 'no');
  },
  'drone_shortcut.html': async p => {
    // Solve one delivery per level kind: L1 (flight), L4 (corner), L5 (range + box)
    async function solve(wrongFirst) {
      for (let guard = 0; guard < 30; guard++) {
        const info = await p.evaluate(() => { const G = window.__ds.G; const P = G.prob; if (!P) return null;
          const st = P.steps[P.si]; if (!st) return null;
          return { i: P.si, kind: st.kind, ans: st.ans, last: P.si === P.steps.length - 1, k: st.opts ? st.opts.findIndex(o => o.ok) : -1, n: st.opts ? st.opts.length : 0 }; });
        if (!info) return;
        if (info.kind === 'num') {
          if (info.last && wrongFirst) { await p.fill('#in' + info.i, '999'); await p.click(`[data-act=check][data-i="${info.i}"]`); }
          await p.fill('#in' + info.i, String(Math.round(info.ans * 10) / 10)); await p.click(`[data-act=check][data-i="${info.i}"]`);
        } else {
          if (info.last && wrongFirst) await p.click(`[data-act=opt][data-i="${info.i}"][data-k="${(info.k + 1) % info.n}"]`);
          await p.click(`[data-act=opt][data-i="${info.i}"][data-k="${info.k}"]`);
        }
        if (info.last) return;
      }
    }
    await p.click('button[data-lv="1"]'); await p.click('#goBtn');
    await p.click('[data-act=offer][data-k="0"]').catch(async () => {});
    await solve(true);
    await p.waitForTimeout(2200);
    await p.click('#quitBtn');
    await p.click('button[data-lv="4"]'); await p.click('#goBtn'); await solve(false); await p.click('[data-act=next]'); await solve(true);
    await p.click('#quitBtn');
    await p.click('button[data-lv="5"]'); await p.click('#goBtn'); await solve(false); await p.click('[data-act=next]'); await solve(false);
  },
};

(async () => {
  const only = process.argv[2];
  const br = await chromium.launch();
  let fails = 0;
  for (const [f, act] of Object.entries(PAGES)) {
    if (only && !f.includes(only)) continue;
    const errs = [], captured = [];
    const ctx = await br.newContext({ viewport: { width: 1280, height: 900 } });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push('pageerror: ' + e.message));
    p.on('console', m => { if (m.type() === 'error' && !IGN.test(m.text())) errs.push('console: ' + m.text()); });
    await p.route('**/script.google.com/**', async route => { captured.push(route.request().postData());
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, name: 'Test Student', n: 1, right: 1 }) }); });
    await p.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
    await p.goto(BASE + f, { waitUntil: 'load' });
    try {
      await act(p);
      await p.fill('#ssname', 'Test Student');
      await p.click('#ssbtn');
      await p.waitForFunction(() => /Got it/.test(document.getElementById('ssmsg').textContent), null, { timeout: 5000 });
    } catch (e) { errs.push('action: ' + e); }
    const name = f.replace('.html', '');
    if (captured.length) fs.writeFileSync(`${W}/payloads/${name}.json`, captured[captured.length - 1]);
    const body = captured.length ? JSON.parse(captured[captured.length - 1]) : { items: [] };
    // layout + screenshots
    const res = {};
    for (const w of [1280, 390]) {
      await p.setViewportSize({ width: w, height: 900 });
      await p.waitForTimeout(200);
      res['hscroll' + w] = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      const box = await p.$('#scoresend');
      if (box) { await box.scrollIntoViewIfNeeded(); await p.screenshot({ path: `${W}/shots/${name}_${w}.png` }); }
    }
    await p.emulateMedia({ media: 'print' });
    res.printHidden = await p.$eval('#scoresend', e => getComputedStyle(e).display === 'none').catch(() => 'no panel');
    await p.emulateMedia({ media: 'screen' });
    await p.pdf({ path: `${W}/shots/${name}.pdf` }).catch(() => {});
    const ok = !errs.length && !res.hscroll390 && !res.hscroll1280 && res.printHidden === true && body.items.length;
    if (!ok) fails++;
    console.log((ok ? 'PASS ' : 'FAIL ') + f, JSON.stringify(res), 'items=' + body.items.length,
      body.items.map(i => `${i.id}:${i.std}:${i.first}/${i.final}x${i.tries}`).join(' '), errs.join(' | '));
    await ctx.close();
  }
  await br.close();
  process.exitCode = fails ? 1 : 0;
})();
