// Bell ringer — Solving Equations (Unit 3).  node _build/bellringers/equations_br1.js
// Writes grade8/Unit3_Equations_BellRinger.pdf (one full landscape page)
// and grade8/Unit3_Equations_BellRinger_AnswerKey.pdf (separate page, answers in green).
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const OUT = '/home/claude/mr-allen-s-math-class/grade8/';
const fr = (a, b) => '<span class="fr"><span>' + a + '</span><span>' + b + '</span></span>';

const P = [
  { dir: 'One-step',            q: 'x − 7 = 12',               a: 'x = 19', w: 'x − 7 + 7 = 12 + 7' },
  { dir: 'One-step',            q: '−4x = 28',                 a: 'x = −7', w: '−4x ÷ (−4) = 28 ÷ (−4)' },
  { dir: 'Two-step',            q: '3x + 5 = 26',              a: 'x = 7',  w: '3x = 21 → x = 21 ÷ 3' },
  { dir: 'Two-step',            q: fr('x', 2) + ' − 6 = 3',    a: 'x = 18', w: fr('x', 2) + ' = 9 → x = 9 · 2' },
  { dir: 'Distributive property', q: '4(x − 3) = 20',          a: 'x = 8',  w: '4x − 12 = 20 → 4x = 32' },
  { dir: 'Distributive property', q: '−2(x + 5) = 6',          a: 'x = −8', w: '−2x − 10 = 6 → −2x = 16' },
  { dir: 'Variables on both sides', q: '5x − 4 = 2x + 11',     a: 'x = 5',  w: '3x − 4 = 11 → 3x = 15' },
  { dir: 'Multi-step',          q: '2(3x − 1) + 4 = 4x + 10',  a: 'x = 4',  w: '6x + 2 = 4x + 10 → 2x = 8' },
];

function sheet(key) {
  const g = s => key ? '<span class="ans">' + s + '</span>' : '';
  let h = '<section class="half">' +
    '<div class="top"><div class="title">Bell Ringer · Solving Equations</div>' +
    (key ? '<div class="keytag">ANSWER KEY</div>' : '<div class="nm">Name <span></span> Date <span class="s"></span></div>') + '</div>' +
    '<div class="rule"><b>Remember:</b> distribute first, then combine like terms. Get the variable terms on one side. ' +
    'Then undo + or − before × or ÷. Whatever you do to one side, do to the other. <b>Check</b> by putting your answer back in.</div>' +
    '<div class="part">Solve for x. Show your work.</div><div class="gridE">';
  P.forEach((p, i) => {
    h += '<div class="cell b"><div class="dir">' + p.dir + '</div><div class="q"><b>' + (i + 1) + '.</b> ' + p.q + '</div>' +
      '<div class="work">' + (key ? '<span class="wk">' + p.w + '</span>' : '') + '</div><div class="aline"><span class="ln">' + g(p.a) + '</span></div></div>';
  });
  return h + '</div></section>';
}
const CSS = `
@page{size:Letter landscape;margin:0}
*{box-sizing:border-box}
body{margin:0;font-family:Inter,Arial,Helvetica,sans-serif;color:#1E2D4F}
.page{width:11in;height:8.5in;padding:.45in .5in}
.half{width:100%;height:100%;display:flex;flex-direction:column}
.top{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #1E2D4F;padding-bottom:5px}
.title{font-family:Georgia,'Times New Roman',serif;font-weight:700;font-size:24px}
.nm{font-size:15px;font-weight:600}.nm span{display:inline-block;width:2.6in;border-bottom:1.5px solid #1E2D4F;margin:0 14px 0 6px}.nm span.s{width:1.3in;margin-right:0}
.keytag{background:#15803D;color:#fff;font-weight:800;font-size:15px;padding:4px 14px;border-radius:6px;letter-spacing:.06em}
.rule{font-size:14px;line-height:1.4;background:#F4F7FC;border:1px solid #D7DCE6;border-left:5px solid #0056B3;border-radius:6px;padding:6px 12px;margin:10px 0 8px}
.part{font-size:16px;font-weight:700;margin:8px 0 5px}
.gridA{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.gridB{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:1fr 1fr;gap:10px;flex:1}
.cell{border:1.5px solid #C9D0DD;border-radius:8px;padding:8px 11px}
.q{font-size:21px;font-weight:600;white-space:nowrap}
sup{font-size:.68em;vertical-align:.62em;line-height:0}
.yn{display:flex;gap:14px;margin:8px 0 5px}.yn .o{font-size:15px;font-weight:700;border:2px solid #1E2D4F;border-radius:14px;padding:2px 14px}
.yn .o.on{background:#15803D;border-color:#15803D;color:#fff}
.why{font-size:13px;font-weight:600;color:#4a5570}
.why .ln{display:block;border-bottom:1.2px solid #8A94A8;height:30px;margin-top:2px}
.dir{font-size:12.5px;font-weight:700;color:#0056B3;text-transform:uppercase;letter-spacing:.03em}
.cell.b{display:flex;flex-direction:column}.work{flex:1}
.aline{font-size:18px;font-weight:700}.aline .ln{display:inline-block;width:85%;border-bottom:1.6px solid #1E2D4F;min-height:24px}
.ans{color:#15803D;font-weight:700;font-size:18px}
.why .ans{font-size:14px;position:relative;top:9px}
.gridE{display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:1fr 1fr;gap:10px;flex:1}
.gridE .q{font-size:20px;white-space:nowrap}.gridE .q.sm{font-size:16.5px;letter-spacing:-.01em}
.aline .ln{width:100%}
.wk{display:block;color:#15803D;font-size:14px;font-weight:600;margin-top:8px}
.fr{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;font-size:.85em;line-height:1.05;margin:0 2px}
.fr span:first-child{border-bottom:1.5px solid currentColor;padding:0 3px}
`;
function doc(body) { return '<!doctype html><html><head><meta charset="utf-8"><style>' + CSS + '</style></head><body>' + body + '</body></html>'; }
(async () => {
  const b = await chromium.launch(), p = await b.newPage();
  for (const key of [false, true]) {
    await p.setContent(doc('<div class="page">' + sheet(key) + '</div>'));
    await p.pdf({ path: OUT + 'Unit3_Equations_BellRinger' + (key ? '_AnswerKey' : '') + '.pdf', format: 'Letter', landscape: true, printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
  }
  await b.close(); console.log('wrote bell ringer + key');
})();
