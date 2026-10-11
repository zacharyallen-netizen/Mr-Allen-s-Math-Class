const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const IGN = /fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext|net::ERR/;
const files = process.argv.slice(2).filter(a => !a.startsWith('--'));
const shots = process.argv.includes('--shots');
const DIR = __dirname + '/shots/';
(async () => {
  const b = await chromium.launch();
  for (const f of files) {
    for (const vw of [390, 1280]) {
      const p = await b.newPage({ viewport: { width: vw, height: vw === 390 ? 844 : 800 } });
      await p.addInitScript(() => sessionStorage.setItem('m1ok', '1'));
      const errs = [];
      p.on('pageerror', e => errs.push('pageerror: ' + e.message));
      p.on('console', m => { if (m.type() === 'error' && !IGN.test(m.text())) errs.push('console: ' + m.text()); });
      await p.goto('file:///home/claude/mr-allen-s-math-class/math1/' + f + '.html');
      await p.waitForTimeout(300);
      const sw = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
      // show all after-blocks so their svgs render
      await p.evaluate(() => document.querySelectorAll('.after').forEach(a => a.classList.add('show')));
      const r = await p.evaluate(() => {
        const out = [], ovl = [];
        let n = 0;
        const svgs = [...document.querySelectorAll('.page-wrap svg')];
        svgs.forEach((s, i) => {
          n++;
          const vb = s.viewBox.baseVal;
          const ts = [...s.querySelectorAll('text')];
          const bbs = ts.map(t => { const bb = t.getBBox(); return { t: t.textContent, x: bb.x, y: bb.y, w: bb.width, h: bb.height, fs: +t.getAttribute('font-size') }; });
          bbs.forEach(bb => { if (bb.w === 0) return; if (bb.x < vb.x - 0.5 || bb.y < vb.y - 0.5 || bb.x + bb.w > vb.x + vb.width + 0.5 || bb.y + bb.h > vb.y + vb.height + 0.5) out.push(i + ':' + bb.t); });
          for (let a = 0; a < bbs.length; a++) for (let c = a + 1; c < bbs.length; c++) {
            const A = bbs[a], B = bbs[c];
            if (A.fs < 11 || B.fs < 11) continue;
            const ix = Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x), iy = Math.min(A.y + A.h, B.y + B.h) - Math.max(A.y, B.y);
            if (ix > 2 && iy > 3) ovl.push(i + ': "' + A.t + '" x "' + B.t + '"');
          }
        });
        const sec = document.querySelectorAll('section.topic').length;
        return { n, out, ovl, sec };
      });
      console.log(f, vw, 'svgs', r.n, 'scroll', sw.join('/'), 'clipped', JSON.stringify(r.out), 'overlap', r.ovl.length ? '\n   ' + r.ovl.join('\n   ') : 0, errs.length ? '\n ERR ' + errs.join('\n ERR ') : '');
      if (shots) {
        const secs = await p.$$('section.topic');
        for (let i = 0; i < secs.length; i++) {
          await secs[i].screenshot({ path: `${DIR}${f}-${vw}-s${i + 1}.png` });
        }
      }
      await p.close();
    }
  }
  await b.close();
})();
