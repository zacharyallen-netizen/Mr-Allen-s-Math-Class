/* HTML helpers + page shell for Units 7–8 notes/practice */
const fs = require('fs');
const path = require('path');
const G = require('./draw.js');
const LIB = __dirname;

const escA = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const jattr = o => JSON.stringify(o).replace(/&/g, '&amp;').replace(/'/g, '&#39;');
const fr = (a, b) => `<span class="fr"><span>${a}</span><span>${b}</span></span>`;
const rad = x => `<span class="rad">√<span>${x}</span></span>`;
const m = s => `<span class="m">${s}</span>`;

const fig = (svg, cap) => `<div class="diagram viz">${svg}${cap ? `<div class="diagram-cap">${cap}</div>` : ''}</div>`;
const figHtml = (html, cap) => `<div class="diagram viz">${html}${cap ? `<div class="diagram-cap">${cap}</div>` : ''}</div>`;
const two = (...xs) => `<div class="two-col">${xs.join('')}</div>`;
const after = (html) => `<div class="after">${html}</div>`;

function vocab(list) {
  return `<div class="vocab"><div class="vocab-h">📖 New words</div><dl>${list.map(([w, d]) => `<div><dt>${w}</dt><dd>${d}</dd></div>`).join('')}</dl></div>`;
}
function howto(title, items) {
  return `<div class="howto"><div class="howto-h">🧭 ${title}</div><ol>${items.map(i => `<li>${i}</li>`).join('')}</ol></div>`;
}
function example(id, o) {
  const last = o.steps.length - 1;
  return `<div class="example"><h4>${o.title}</h4>${o.fig || ''}<div class="steps" data-example="${id}">` +
    o.steps.map((s, i) => `<div class="step${i === last ? ' final' : ''}" onclick="reveal(this)"><strong>${i === last ? '✓ ' : ''}Step ${i + 1}. ${s[0]}</strong><span class="placeholder"> click to reveal</span><span class="hidden-content"> ${s[1]}</span></div>`).join('') +
    `</div><button class="reveal-all" onclick="revealAll('${id}')">Reveal all steps</button>${o.after ? after(o.after) : ''}</div>`;
}
/* typed question */
function q(id, o) {
  const spec = { t: o.t, a: o.a };
  ['traps', 'hint', 'ok', 'form', 'tol', 'sq', 'yint', 'axis', 'fmt'].forEach(k => { if (o[k] != null) spec[k] = o[k]; });
  return `<div class="chk qcard${o.cls ? ' ' + o.cls : ''}" id="${id}" data-q='${jattr(spec)}'>` +
    `<div class="chk-q"><span class="badge">${o.n}</span> ${o.text}</div>${o.fig || ''}` +
    `<div class="val-chk"><input aria-label="Your answer for question ${String(o.n).replace(/<[^>]+>/g, '')}" placeholder="${escA(o.ph || '')}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"><button type="button" onclick="K78.check('${id}')">Check</button></div>` +
    `<div class="chk-fb" aria-live="polite"></div>` +
    (o.sol ? `<div class="solrow"><button class="sa-btn sol-btn" type="button" onclick="K78.sol(this)">📖 Show full solution</button><div class="sa-ans">${o.sol}</div></div>` : '') +
    (o.after ? after(o.after) : '') + `</div>`;
}
/* multiple choice: opts [{t, ok, fb}] */
function mc(id, o) {
  return `<div class="chk mc${o.cls ? ' ' + o.cls : ''}" id="${id}" data-why="${escA(o.why || '')}">` +
    (o.head || '') + `<div class="chk-q">${o.n !== '' ? `<span class="badge">${o.n}</span> ` : ''}${o.text}</div>${o.fig || ''}` + (o.work || '') +
    `<div class="chk-opts">${o.opts.map(op => `<button class="chk-btn" type="button" data-ok="${op.ok ? 1 : 0}" data-fb="${escA(op.fb || '')}" onclick="K78.mc(this)">${op.t}</button>`).join('')}</div>` +
    `<div class="chk-fb" aria-live="polite"></div>` + (o.after ? after(o.after) : '') + `</div>`;
}
/* find-the-mistake: work = [lines]; bad = index of wrong line; fbs = per-line feedback for the right lines */
function mistake(id, o) {
  const work = `<div class="work"><div class="who">${o.who}</div><ol>${o.work.map(w => `<li>${w}</li>`).join('')}</ol></div>`;
  const opts = o.work.map((w, i) => ({ t: `Step ${i + 1}`, ok: i === o.bad, fb: i === o.bad ? '' : (o.fbs && o.fbs[i]) || `Step ${i + 1} is correct. Look again at the others.` }));
  return mc(id, {
    cls: 'mistake', n: o.n || '', head: `<div class="mistake-h">🔍 Find the mistake</div>` + work + (o.fig || ''),
    text: o.text || 'Which step has the mistake?', opts, why: o.why, after: o.after
  });
}
function task(id, o) {
  return `<div class="chk task" id="${id}-card"><div class="chk-q"><span class="badge">${o.n}</span> ${o.text}</div>` +
    `<div class="widget" id="${id}" data-w="${o.w}" data-o='${jattr(o.opts || {})}'></div>${o.after ? after(o.after) : ''}</div>`;
}
const widget = (w, opts) => `<div class="widget viz" data-w="${w}" data-o='${jattr(opts || {})}'></div>`;
const yt = (t) => `<h3 class="yt">✅ ${t || 'Your turn — type your answer, then press Check'}</h3>`;
const legend = `<div class="legend" aria-label="color key"><span><i style="background:#1E2D4F"></i>navy = given</span><span><i style="background:#E0A800"></i>gold = what we want (?)</span><span><i style="background:#15803D"></i>green = answer (after you check)</span></div>`;

const CSS = `
/* ---- Units 7–8 page additions (keeps theme.css look) ---- */
.viz svg{max-width:100%;height:auto}
.diagram.viz>svg{width:min(100%,360px)}
.fr{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;line-height:1.15;margin:0 .12em;font-size:.9em}
.fr>span:first-child{border-bottom:1.5px solid currentColor;padding:0 .2em}
.fr>span:last-child{padding:0 .2em}
.rad{white-space:nowrap}.rad>span{border-top:1.5px solid currentColor;padding:0 .15em 0 .1em;margin-left:1px}
.m{font-family:var(--font-mono);font-size:.95em;white-space:nowrap}
.legend{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:.8rem;color:var(--muted);background:#fff;border:1px solid var(--border);border-radius:8px;padding:7px 12px;margin:0 0 14px}
.legend i{display:inline-block;width:11px;height:11px;border-radius:3px;margin-right:5px;vertical-align:-1px}
.vocab{background:#fff;border:1px dashed #c4cfe2;border-radius:8px;padding:9px 13px;margin:10px 0 12px;font-size:.9rem}
.vocab-h,.howto-h,.mistake-h{font-weight:700;color:var(--navy);margin-bottom:4px}
.vocab dl{margin:0}.vocab dl>div{margin:4px 0}.vocab dt{display:inline;font-weight:700;color:var(--navy)}.vocab dt:after{content:" — ";font-weight:400;color:var(--muted)}.vocab dd{display:inline;margin:0}
.howto{background:#f4f7fc;border:1px solid #dbe4f3;border-left:4px solid var(--navy);border-radius:8px;padding:10px 14px;margin:12px 0;font-size:.92rem}
.howto ol{margin:4px 0 0;padding-left:22px}.howto li{margin:4px 0}
.qcard,.mc,.task{border:1px solid var(--border);border-radius:10px;padding:12px 14px;margin:12px 0;background:#fff}
.mistake{border-left:4px solid var(--red);background:#fffafa}
.mistake-h{color:#a01b1b}
.work{font-family:var(--font-mono);background:#fff;border:1px solid #f0d6d6;border-radius:6px;padding:8px 10px;margin:8px 0;font-size:.88rem}
.work .who{font-family:var(--font-body);font-weight:600;color:var(--muted);font-size:.82rem;margin-bottom:2px}
.work ol{margin:0;padding-left:24px}.work li{margin:3px 0}
.after{display:none;margin-top:10px;border-top:1px dashed #b9dcc4;padding-top:10px}
.after.show{display:block}
.after .ans{color:var(--green-dk);font-weight:600;font-size:.92rem}
.chk-btn:disabled{color:inherit;cursor:default;opacity:1}
.chk-btn.wrong:disabled{opacity:.75}
.chk-fb .tip{display:block;margin-top:4px;font-weight:600}
.solrow{margin-top:8px}.sol-btn{font-size:.78rem;padding:5px 11px;opacity:.92}
.yt{font-family:var(--font-head);color:var(--navy);font-size:1rem;margin:18px 0 4px;border-top:1px solid var(--border);padding-top:12px}
.vt{border-collapse:collapse;margin:6px auto;font-family:var(--font-mono);font-size:.9rem;background:#fff}
.vt th,.vt td{border:1px solid #cdd5e0;padding:5px 10px;text-align:center;min-width:30px}
.vt th{background:#eef2f8;color:var(--navy)}
.vt-text{font-family:var(--font-body);font-size:.88rem}.vt-text td{text-align:left}
.vt td.u,.vt th.u{background:#FFF6D6;color:#8A6400;font-weight:700}
.vt td.ok{background:#E9F7EE;color:#15803D;font-weight:700}
.table-wrap{overflow-x:auto;max-width:100%}
.widget{border:2px solid #E0A800;border-radius:12px;padding:10px 12px;background:#fffdf3;margin:14px 0}
.w-title{font-weight:700;color:var(--navy);margin-bottom:6px}
.w-body{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-start}
.w-svg{flex:1 1 280px;max-width:340px;margin:0 auto}
.w-svg svg{width:100%;height:auto;touch-action:none;display:block;cursor:pointer;border-radius:6px}
.w-svg svg:focus{outline:3px solid #9ec5ff}
.w-ctl{flex:1 1 230px;min-width:0}
.srow{display:flex;align-items:center;gap:10px;margin:4px 0}
.srow .sname{font-family:var(--font-mono);font-weight:700;color:var(--navy);width:18px}
.srow input[type=range]{flex:1;min-width:0;height:32px;accent-color:#1E2D4F}
.srow output{font-family:var(--font-mono);font-weight:700;min-width:36px;text-align:right}
.readout{font-family:var(--font-mono);font-size:.84rem;background:#fff;border:1px solid var(--border);border-radius:8px;padding:8px 10px;margin-top:6px;line-height:1.7;overflow-wrap:anywhere}
.readout .g,.g{color:#15803D;font-weight:700}.readout .b{color:#0056B3;font-weight:700}.readout .n{color:#1E2D4F}.readout .bl{color:#0056B3}
.warn-t{color:#a01b1b;font-weight:600}
.w-hint{font-size:.8rem;color:var(--muted);margin:6px 0 0}
.w-check{background:var(--royal);color:#fff;border:none;border-radius:8px;padding:8px 16px;font-weight:600;cursor:pointer;margin-top:8px}
.flow{display:flex;flex-direction:column;gap:0;align-items:stretch;max-width:420px;margin:8px auto;font-size:.88rem}
.flow .fb{background:#fff;border:2px solid var(--navy);border-radius:8px;padding:7px 10px;text-align:center}
.flow .fb.q{border-color:#E0A800;background:#fffdf3}
.flow .fb.r{border-color:#15803D;background:#E9F7EE;font-weight:700;color:#15803D}
.flow .ar{text-align:center;color:var(--navy);font-weight:700;line-height:1.3;font-size:.8rem;padding:2px 0}
.flow .row{display:flex;gap:8px}.flow .row>*{flex:1 1 0;min-width:0}
@media print{.widget,.legend{display:none!important}.after.show{display:block}}
@media (max-width:520px){.task,.mc:has(.widget){padding:10px 8px}.task .widget,.mc .widget{padding:8px 6px}.w-svg{flex-basis:100%;max-width:none}}
`;

function readLib(name) { return fs.readFileSync(path.join(LIB, name), 'utf8'); }

function page(o) {
  const gate = `<script>
(function(){
  // Math 1 lite gate — mild deterrent only (pages remain public).
  try{
    if(sessionStorage.getItem('m1ok')==='1') return;
    var here = window.location.pathname.split('/').pop() || 'index.html';
    sessionStorage.setItem('m1dest', here + window.location.search + window.location.hash);
  }catch(e){}
  window.location.replace('gate.html');
})();
</script>`;
  const nav = o.nav ? `<div class="topic-nav">\n${o.nav.map(([h, l]) => `  <a href="#${h}">${l}</a>`).join('\n')}\n</div>\n` : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
${gate}

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${o.title}</title>
<link href="https://fonts.googleapis.com/css2?family=Arvo:wght@400;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="theme.css">
<style>${CSS}</style>
</head>
<body>
<script src="../site-bar.js"></script>

<div class="page-wrap">
<a href="${o.back}" class="back-link">← Back to ${o.backLabel}</a>
<div class="page-hdr">
  <h1>${o.h1}</h1>
  <p>${o.sub}</p>
  <p class="stds">${o.stds}</p>
</div>
${o.score ? '<div class="score-box" id="score">Score: <b>0</b> / 0</div>\n' : ''}<div class="intro"><p>${o.intro}</p></div>
${legend}
${nav}${o.revealAll ? '<p style="text-align:right"><button class="reveal-all" onclick="revealPage()">👁 Reveal all answers (for printing an answer key)</button></p>\n' : ''}${o.body}
${o.tail || ''}
</div>
<div class="site-footer">© NC Math 1 — Interactive Guided Notes</div>
<script src="script.js"></script>
<script>
${readLib('draw.js')}
${readLib('kit.js')}
${readLib('widgets.js')}
K78.init(); W78.init();
</script>
</body>
</html>
`;
}

module.exports = { G, C: G.C, fmt: G.fmt, pt: G.pt, fr, rad, m, fig, figHtml, two, after, vocab, howto, example, q, mc, mistake, task, widget, yt, page, escA };
