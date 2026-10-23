// Student tracker for the Math Fluency Lab (one landscape page, uses the class 1–5 SBG scale).
//   node _build/fluency_tracker.js  →  grade8/Fluency-Lab-Package/fluency-lab/Fluency_Lab_Student_Tracker.pdf
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const OUT = '/home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/fluency-lab/Fluency_Lab_Student_Tracker.pdf';
const GROUPS = [
  ['Whole-Number Fluency', [['1', '+ −', 'Add & Subtract'], ['2', '×', 'Multiply'], ['3', '÷', 'Divide']]],
  ['Rational Numbers', [['4', '½', 'Fractions'], ['5', '.5', 'Decimals & Percents'], ['6', '±', 'Integers']]],
  ['Toward Grade Level', [['7', ':', 'Ratios & Proportions'], ['8', 'x²', 'Expressions & Order of Ops']]],
];
const SBG = [
  ['5', 'Beyond', '100% on the Skill Check <b>and</b> I reached Level 6 in practice.'],
  ['4', 'Mastery', '80% to 99%. Only small mistakes.'],
  ['3', 'Getting there', '65% to 79%. I know the basics but still miss some.'],
  ['2', 'Partly', '40% to 64%. I need the worked steps or help.'],
  ['1', 'Starting', 'Below 40%. I need to practice before I try again.'],
];
const FP = [
  ['1', 'Add & subtract integers'], ['2', 'All four operations'], ['3', 'Bigger integers'],
  ['4', 'Fractions, same denominator'], ['5', 'Fractions, different denominators'],
];
const tryCell = '<td class="t"><span class="d">Date</span><span class="sc"><b></b>%</span><span class="lv">SBG</span></td>';
let rows = '';
GROUPS.forEach(([g, mods]) => {
  rows += '<tr class="grp"><td colspan="7">' + g + '</td></tr>';
  mods.forEach(([n, sym, name]) => {
    rows += '<tr><td class="mod"><span class="sym">' + sym + '</span><span><small>Module ' + n + '</small><br>' + name + '</span></td>' +
      '<td class="lvls">' + [1, 2, 3, 4, 5, 6].map(i => '<span>' + i + '</span>').join('') + '</td>' +
      tryCell + tryCell + tryCell + '<td class="best"></td><td class="goal"><span class="box"></span></td></tr>';
  });
});
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@page{size:Letter landscape;margin:0}
*{box-sizing:border-box}
body{margin:0;font-family:Inter,Arial,Helvetica,sans-serif;color:#1E2D4F}
.page{width:11in;height:8.5in;padding:.3in .45in .25in;display:flex;flex-direction:column;overflow:hidden}
.top{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #1E2D4F;padding-bottom:5px}
h1{font-family:Georgia,'Times New Roman',serif;font-size:23px;margin:0}
.nm{font-size:13px;font-weight:600}.nm span{display:inline-block;width:2.3in;border-bottom:1.4px solid #1E2D4F;margin:0 12px 0 5px}.nm span.s{width:.8in;margin-right:0}
.mid{display:grid;grid-template-columns:1.05fr 1.35fr;gap:12px;margin:7px 0 7px}
.how{background:#F4F7FC;border:1px solid #D7DCE6;border-left:5px solid #0056B3;border-radius:7px;padding:5px 11px;font-size:10.5px;line-height:1.3}
.how b.h{display:block;font-size:12.5px;margin-bottom:2px}
.how ol{margin:0;padding-left:17px}.how li{margin:1px 0}
.sbg{border:1.5px solid #C9D0DD;border-radius:7px;padding:6px 10px}
.sbg .h{font-size:12.5px;font-weight:700;margin-bottom:3px}
.sbg .r{display:grid;grid-template-columns:26px 92px 1fr;align-items:center;font-size:11px;line-height:1.3;padding:1.5px 0}
.sbg .n{display:inline-flex;width:21px;height:21px;border-radius:50%;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:12px}
.sbg .w{font-weight:700}
.c5{background:#15803D}.c4{background:#2F855A}.c3{background:#B45309}.c2{background:#C2410C}.c1{background:#B42318}
table{width:100%;border-collapse:collapse}
th{background:#1E2D4F;color:#fff;font-size:11px;font-weight:700;padding:5px 6px;text-align:center;border:1px solid #1E2D4F}
th small{display:block;font-weight:500;font-size:9.5px;opacity:.85}
td{border:1px solid #B8C0CF;padding:3px 6px;font-size:11.5px;vertical-align:middle}
tr.grp td{background:#EEF2F8;font-weight:800;font-size:10.5px;letter-spacing:.05em;text-transform:uppercase;color:#0056B3;padding:3px 8px}
td.mod{width:2.05in;white-space:nowrap}
td.mod .sym{display:inline-flex;width:26px;height:26px;border-radius:7px;background:#E8EEF8;color:#0056B3;font-weight:800;font-size:13px;align-items:center;justify-content:center;margin-right:8px;vertical-align:middle}
td.mod span:last-child{display:inline-block;vertical-align:middle;font-weight:700;font-size:12px;line-height:1.15}
td.mod small{font-weight:600;color:#6B7488;font-size:9.5px}
td.lvls{width:1.7in;text-align:center;white-space:nowrap}
td.lvls span{display:inline-flex;width:20px;height:20px;border:1.5px solid #1E2D4F;border-radius:50%;align-items:center;justify-content:center;font-size:11px;font-weight:700;margin:0 1.5px}
td.t{width:1.6in;font-size:9.5px;color:#6B7488;font-weight:600}
td.t span{display:block;line-height:1.3}
td.t .d{border-bottom:1px solid #C9D0DD}
td.t .sc b{display:inline-block;width:.45in;border-bottom:1px solid #8A94A8;margin-right:2px}
td.t .sc{display:inline-block}td.t .lv{display:inline-block;float:right}
td.t .lv::after{content:"";display:inline-block;width:20px;height:20px;border:1.5px solid #8A94A8;border-radius:50%;vertical-align:middle;margin-left:4px}
td.best{width:.75in}
td.goal{width:.62in;text-align:center}.box{display:inline-block;width:20px;height:20px;border:2px solid #15803D;border-radius:4px}
.ref{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:5px;font-size:11.5px;font-weight:600}
.ref div span{display:block;border-bottom:1.3px solid #8A94A8;height:16px}
.fp{margin-top:7px;border:1.5px solid #C9D0DD;border-radius:7px;padding:5px 8px 6px}
.fp .h{display:flex;justify-content:space-between;align-items:baseline;font-size:12.5px;font-weight:800;margin-bottom:4px}
.fp .h small{font-size:10px;font-weight:600;color:#6B7488}
.fp table td{font-size:10px;padding:3px 5px;vertical-align:top;width:20%}
.fp .ln{font-weight:800;font-size:11px}.fp .lname{display:block;font-weight:600;color:#6B7488;font-size:9.5px;margin-bottom:2px}
.fp .row{display:flex;justify-content:space-between;align-items:center;font-weight:600;color:#6B7488;margin-top:2px}
.fp .row b{display:inline-block;width:.42in;border-bottom:1px solid #8A94A8;margin:0 2px}
.fp .st{font-size:13px;color:#8A94A8;letter-spacing:1px}
.ref{grid-template-columns:2fr 1fr!important}
.foot{font-size:10px;color:#6B7488;margin-top:5px;text-align:center}
</style></head><body><div class="page">
<div class="top"><h1>Math Fluency Lab · My Progress Tracker</h1><div class="nm">Name <span></span> Period <span class="s"></span></div></div>
<div class="mid">
 <div class="how"><b class="h">How to use this tracker</b><ol>
  <li><b>Practice</b> a module in sets of 10. Circle the <b>highest level</b> you reach (1–6).</li>
  <li>When you feel ready, take the <b>Skill Check</b>. Write the date and your percent.</li>
  <li>The Skill Check shows your <b>SBG level</b> (1–5) in <b>My plan</b>. Write it down.</li>
  <li>Write your <b>best</b> level. Check the box when you reach <b>4 or higher</b>, my goal.</li>
  <li>Below a 4? Tap the <b>Practice</b> button in My plan, do a set of 10, then retake it.</li></ol></div>
 <div class="sbg"><div class="h">Our SBG scale for the Skill Check (percent right)</div>
  ${SBG.map(([n, w, t]) => `<div class="r"><span class="n c${n}">${n}</span><span class="w">${w}</span><span>${t}</span></div>`).join('')}
 </div>
</div>
<table><thead><tr><th>Module</th><th>Highest practice level<small>circle one</small></th><th>Skill Check · Try 1<small>date · score · SBG</small></th><th>Skill Check · Try 2<small>date · score · SBG</small></th><th>Skill Check · Try 3<small>date · score · SBG</small></th><th>Best SBG</th><th>4 or higher ✓</th></tr></thead>
<tbody>${rows}</tbody></table>
<div class="fp"><div class="h"><span>⚡ Flashpoint scores</span><small>20 problems a round · 12 right = ★ · 16 right = ★★ and the next level unlocks · 19 right = ★★★ · write your best round</small></div>
<table><tr>${FP.map(([n, name]) => `<td><span class="ln">Level ${n}</span><span class="lname">${name}</span><div class="row">Right<b></b>/ 20<span class="st">☆☆☆</span></div><div class="row">Points<b style="width:.6in"></b>Date<b></b></div></td>`).join('')}</tr></table></div>

<div class="foot">Fluency Lab: Mr. Allen's Math Class website → 8th Grade → Fluency Lab. Flashpoint is on the Fluency Lab page. Send each Skill Check and Flashpoint score to Mr. Allen from the results screen.</div>
</div></body></html>`;
(async () => {
  const b = await chromium.launch(), p = await b.newPage();
  await p.setContent(html);
  await p.pdf({ path: OUT, format: 'Letter', landscape: true, printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
  await b.close(); console.log('wrote', OUT);
})();
