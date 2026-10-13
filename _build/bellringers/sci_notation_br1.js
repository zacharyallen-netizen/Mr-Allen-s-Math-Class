// Bell ringer — Scientific Notation (Unit 2).  node _build/bellringers/sci_notation_br1.js
// Writes grade8/Unit2_SciNotation_BellRinger.pdf (LANDSCAPE: two half-sheets side by side, cut on the dashed line)
// and grade8/Unit2_SciNotation_BellRinger_AnswerKey.pdf (one copy, answers in green).
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const OUT = '/home/claude/mr-allen-s-math-class/grade8/';
const sup = n => '<sup>' + String(n).replace('-', '−') + '</sup>';
const sn = (a, n) => a + ' × 10' + sup(n);

// Part A: is it in scientific notation?  (rule: a × 10ⁿ with 1 ≤ a < 10)
const A = [
  { q: sn('4.7', 6),  ok: true,  why: '4.7 is between 1 and 10' },
  { q: sn('23', 4),   ok: false, why: '23 is 10 or more' },
  { q: sn('0.8', -3), ok: false, why: '0.8 is less than 1' },
  { q: sn('9.05', -2), ok: true, why: '9.05 is between 1 and 10' },
];
// Part B: convert
const B = [
  { dir: 'Write in standard form', q: sn('3.2', 5),   a: '320,000' },
  { dir: 'Write in standard form', q: sn('7.08', -4), a: '0.000708' },
  { dir: 'Write in standard form', q: sn('1.5', 7),   a: '15,000,000' },
  { dir: 'Write in scientific notation', q: '46,000',   a: sn('4.6', 4) },
  { dir: 'Write in scientific notation', q: '0.0039',   a: sn('3.9', -3) },
  { dir: 'Write in scientific notation', q: '0.000052', a: sn('5.2', -5) },
];

function sheet(key) {
  const g = s => key ? '<span class="ans">' + s + '</span>' : '';
  let h = '<section class="half">' +
    '<div class="top"><div class="title">Bell Ringer · Scientific Notation</div>' +
    (key ? '<div class="keytag">ANSWER KEY</div>' : '<div class="nm">Name <span></span> Date <span class="s"></span></div>') + '</div>' +
    '<div class="rule"><b>Remember:</b> scientific notation looks like <b>a × 10<sup>n</sup></b>, where <b>a</b> is at least 1 and less than 10 ' +
    '(1 ≤ a &lt; 10) and <b>n</b> is a whole number. A big number has a positive power; a small decimal has a negative power.</div>' +
    '<div class="part">A. Is it in scientific notation? Circle <b>Yes</b> or <b>No</b>, then tell why.</div><div class="gridA">';
  A.forEach((p, i) => {
    h += '<div class="cell"><div class="q"><b>' + (i + 1) + '.</b> ' + p.q + '</div>' +
      '<div class="yn"><span class="o' + (key && p.ok ? ' on' : '') + '">Yes</span><span class="o' + (key && !p.ok ? ' on' : '') + '">No</span></div>' +
      '<div class="why">Why? <span class="ln">' + g(p.why) + '</span></div></div>';
  });
  h += '</div><div class="part">B. Convert. Show your work.</div><div class="gridB">';
  B.forEach((p, i) => {
    h += '<div class="cell b"><div class="dir">' + p.dir + '</div><div class="q"><b>' + (i + 5) + '.</b> ' + p.q + '</div>' +
      '<div class="work"></div><div class="aline">= <span class="ln">' + g(p.a) + '</span></div></div>';
  });
  return h + '</div></section>';
}
const CSS = `
@page{size:Letter landscape;margin:0}
*{box-sizing:border-box}
body{margin:0;font-family:Inter,Arial,Helvetica,sans-serif;color:#1E2D4F}
.page{width:11in;height:8.5in;padding:.35in .3in;display:flex;flex-direction:row;justify-content:space-between}
.half{width:5.05in;height:7.8in;display:flex;flex-direction:column}
.cut{border-left:1.5px dashed #8A94A8;width:0;position:relative}
.cut span{position:absolute;top:50%;left:-7px;transform:rotate(90deg);transform-origin:left top;background:#fff;color:#8A94A8;font-size:9px;white-space:nowrap;padding:0 6px}
.top{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2.5px solid #1E2D4F;padding-bottom:3px}
.title{font-family:Georgia,'Times New Roman',serif;font-weight:700;font-size:15.5px}
.top{flex-wrap:wrap}.nm{font-size:11px;font-weight:600;width:100%;margin-top:6px}.nm span{display:inline-block;width:2.6in;border-bottom:1.2px solid #1E2D4F;margin:0 8px 0 4px}.nm span.s{width:1.15in;margin-right:0}
.keytag{background:#15803D;color:#fff;font-weight:800;font-size:11px;padding:3px 10px;border-radius:5px;letter-spacing:.06em}
.rule{font-size:10.5px;line-height:1.35;background:#F4F7FC;border:1px solid #D7DCE6;border-left:4px solid #0056B3;border-radius:5px;padding:4px 8px;margin:6px 0 5px}
.part{font-size:11.5px;font-weight:700;margin:5px 0 3px}
.gridA{display:grid;grid-template-columns:repeat(2,1fr);gap:6px}
.gridB{display:grid;grid-template-columns:repeat(2,1fr);grid-auto-flow:column;grid-template-rows:repeat(3,1fr);gap:6px;flex:1}
.cell{border:1.2px solid #C9D0DD;border-radius:6px;padding:5px 7px}
.q{font-size:15px;font-weight:600;white-space:nowrap}
sup{font-size:.68em;vertical-align:.62em;line-height:0}
.yn{display:flex;gap:10px;margin:5px 0 3px}.yn .o{font-size:11.5px;font-weight:700;border:1.5px solid #1E2D4F;border-radius:12px;padding:1px 9px}
.yn .o.on{background:#15803D;border-color:#15803D;color:#fff}
.why{font-size:10px;font-weight:600;color:#4a5570}
.why .ln{display:block;border-bottom:1px solid #8A94A8;height:22px;margin-top:2px}
.dir{font-size:9.5px;font-weight:700;color:#0056B3;text-transform:uppercase;letter-spacing:.03em}
.cell.b{display:flex;flex-direction:column}.work{flex:1}
.aline{font-size:13px;font-weight:700}.aline .ln{display:inline-block;width:83%;border-bottom:1.3px solid #1E2D4F;min-height:18px}
.ans{color:#15803D;font-weight:700;font-size:12px}
.why .ans{font-size:10.5px;position:relative;top:4px}
`;
function doc(body) { return '<!doctype html><html><head><meta charset="utf-8"><style>' + CSS + '</style></head><body>' + body + '</body></html>'; }
(async () => {
  const b = await chromium.launch(), p = await b.newPage();
  await p.setContent(doc('<div class="page">' + sheet(false) + '<div class="cut"><span>✂ cut here</span></div>' + sheet(false) + '</div>'));
  await p.pdf({ path: OUT + 'Unit2_SciNotation_BellRinger.pdf', format: 'Letter', landscape: true, printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
  await p.setContent(doc('<div class="page">' + sheet(true) + '<div></div></div>'));
  await p.pdf({ path: OUT + 'Unit2_SciNotation_BellRinger_AnswerKey.pdf', format: 'Letter', landscape: true, printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
  await b.close(); console.log('wrote bell ringer + key');
})();
