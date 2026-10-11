/* Static figure builders (Node, build time). Every figure is drawn from the numbers passed in. */
const G = require('./draw.js');
const C = G.C;

/* equation decoder: big equation with brackets under parts and labels below
   parts: [{t:'y = '}, {t:'(x − 3)', lab:'h = ?', c:'gold'}, ...] */
function decoder(parts, o = {}) {
  const W = o.W || 300, fs = o.fs || 19, cw = fs * 0.6;
  const text = parts.map(p => p.t).join('');
  const total = text.length * cw;
  const x0 = Math.max(6, (W - total) / 2);
  const P = G.canvas(W, o.H || 112);
  let cx = x0;
  const marks = [];
  parts.forEach(p => { const w = p.t.length * cw; if (p.lab) marks.push({ x: cx, w, p }); cx += w; });
  P.textPx(x0, 38, text, { fs, anchor: 'start', bold: true, c: C.navy, halo: false });
  let lastEnd = -1e9, row = 0;
  marks.forEach((m, i) => {
    const col = m.p.c === 'gold' ? C.goldT : m.p.c === 'green' ? C.green : C.navy;
    const stroke = m.p.c === 'gold' ? C.gold : col;
    const lx = m.x + m.w / 2;
    const labW = m.p.lab.length * 12 * 0.62;
    row = (lx - labW / 2 < lastEnd + 6) ? (row + 1) % 2 : 0;
    const ly = 72 + row * 22;
    P.add(`<path d="M${(m.x + 2).toFixed(1)} 47 v6 h${(m.w - 4).toFixed(1)} v-6" fill="none" stroke="${stroke}" stroke-width="2"/>`);
    P.add(`<line x1="${lx.toFixed(1)}" y1="53" x2="${lx.toFixed(1)}" y2="${ly - 13}" stroke="${stroke}" stroke-width="1.5"/>`);
    P.textPx(lx, ly, m.p.lab, { fs: 12, anchor: 'middle', bold: true, c: col });
    lastEnd = lx + labW / 2;
  });
  return P.out(o.aria || ('equation ' + text));
}

/* 2x2 (or 2xN) box method / area model for multiplying binomials */
function boxMethod(o) {
  // o: {top:[..], left:[..], cells:[[..],[..]], W}
  const W = o.W || 300, cols = o.top.length, rows = o.left.length;
  const x0 = 64, y0 = 30, cw = Math.min(100, (W - x0 - 14) / cols), ch = o.ch || 50;
  const H = y0 + rows * ch + 14;
  const P = G.canvas(W, H);
  const colr = v => (String(v).indexOf('?') >= 0 ? C.goldT : C.navy);
  o.top.forEach((t, j) => P.textPx(x0 + cw * j + cw / 2, y0 - 9, t, { fs: 14, anchor: 'middle', bold: true, c: colr(t) }));
  o.left.forEach((t, i) => P.textPx(x0 - 10, y0 + ch * i + ch / 2 + 5, t, { fs: 14, anchor: 'end', bold: true, c: colr(t) }));
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
    const v = o.cells[i][j];
    const unk = String(v).indexOf('?') >= 0;
    P.rectPx(x0 + cw * j, y0 + ch * i, cw, ch, { fill: unk ? '#FFF6D6' : (o.fills && o.fills[i][j]) || '#E8EEF8', c: unk ? C.gold : C.navy, w: 2 });
    P.textPx(x0 + cw * j + cw / 2, y0 + ch * i + ch / 2 + 5, v, { fs: 14, anchor: 'middle', bold: true, c: unk ? C.goldT : (o.green ? C.green : C.navy), halo: false });
  }
  return P.out(o.aria || 'box method');
}

/* function machine (vertical) */
function machine(o) {
  // o: {input:'x = 0', rule:'g(x) = x² − 6x + 5', output:'?'}
  const W = o.W || 300, H = 162, P = G.canvas(W, H);
  const mid = W / 2;
  const box = (y, h, txt, col, fill, fs) => {
    const w = Math.min(W - 12, txt.length * fs * 0.62 + 28);
    P.rectPx(mid - w / 2, y, w, h, { fill, c: col, w: 2, rx: 8 });
    P.textPx(mid, y + h / 2 + fs * 0.36, txt, { fs, anchor: 'middle', bold: true, c: col === C.gold ? C.goldT : col, halo: false });
  };
  box(6, 32, 'input: ' + o.input, C.navy, '#E8EEF8', 13);
  P.add(`<line x1="${mid}" y1="40" x2="${mid}" y2="56" stroke="${C.navy}" stroke-width="2"/><path d="M${mid - 5} 52 L${mid} 59 L${mid + 5} 52" fill="none" stroke="${C.navy}" stroke-width="2"/>`);
  box(61, 40, o.rule, C.navy, '#FFFFFF', 13);
  P.add(`<line x1="${mid}" y1="103" x2="${mid}" y2="119" stroke="${C.navy}" stroke-width="2"/><path d="M${mid - 5} 115 L${mid} 122 L${mid + 5} 115" fill="none" stroke="${C.navy}" stroke-width="2"/>`);
  const unk = String(o.output).indexOf('?') >= 0;
  box(124, 32, 'output: ' + o.output, unk ? C.gold : C.green, unk ? '#FFF6D6' : '#E9F7EE', 13);
  return P.out(o.aria || 'function machine');
}

/* branching tree for square-root steps: top -> two branches -> results */
function tree(o) {
  // o: {top:'(x − 3)² = 1', left:'x − 3 = 1', right:'x − 3 = −1', lres:'x = ?', rres:'x = ?'}
  const W = o.W || 300, H = 168, P = G.canvas(W, H);
  const box = (cx, y, txt, col, fill) => {
    const w = Math.min(W / 2 - 8, txt.length * 13 * 0.62 + 18);
    P.rectPx(cx - w / 2, y, w, 30, { fill, c: col, w: 2, rx: 7 });
    P.textPx(cx, y + 20, txt, { fs: 13, anchor: 'middle', bold: true, c: col === C.gold ? C.goldT : col, halo: false });
  };
  const L = W * 0.27, Rr = W * 0.73, M = W / 2;
  box(M, 6, o.top, C.navy, '#E8EEF8');
  P.add(`<line x1="${M - 20}" y1="36" x2="${L}" y2="62" stroke="${C.navy}" stroke-width="2"/><line x1="${M + 20}" y1="36" x2="${Rr}" y2="62" stroke="${C.navy}" stroke-width="2"/>`);
  P.textPx(L + 6, 50, '+', { fs: 13, anchor: 'end', bold: true, c: C.navy });
  P.textPx(Rr - 6, 50, '−', { fs: 13, anchor: 'start', bold: true, c: C.navy });
  box(L, 64, o.left, C.navy, '#FFFFFF');
  box(Rr, 64, o.right, C.navy, '#FFFFFF');
  P.add(`<line x1="${L}" y1="94" x2="${L}" y2="124" stroke="${C.navy}" stroke-width="2"/><line x1="${Rr}" y1="94" x2="${Rr}" y2="124" stroke="${C.navy}" stroke-width="2"/>`);
  const gl = String(o.lres).indexOf('?') >= 0, gr = String(o.rres).indexOf('?') >= 0;
  box(L, 126, o.lres, gl ? C.gold : C.green, gl ? '#FFF6D6' : '#E9F7EE');
  box(Rr, 126, o.rres, gr ? C.gold : C.green, gr ? '#FFF6D6' : '#E9F7EE');
  return P.out(o.aria || 'two cases');
}

/* projectile sketch (not to scale). hi: which label is gold ('start','max','tmax','land') */
function scene(o) {
  const W = o.W || 300, H = 224, P = G.canvas(W, H);
  const gy = 200, cliffW = 50, cliffTop = 134;
  P.rectPx(10, cliffTop, cliffW, gy - cliffTop, { fill: '#D9DEE7', c: C.navy, w: 1.5 });
  P.add(`<line x1="4" y1="${gy}" x2="${W - 4}" y2="${gy}" stroke="${C.axis}" stroke-width="2"/>`);
  const sx = 10 + cliffW, sy = cliffTop, px = 140, py = 58, ex = W - 30;
  // quadratic bezier through start->peak->end approximations
  P.add(`<path d="M${sx} ${sy} Q ${px - 40} ${py - 22} ${px} ${py} Q ${px + 70} ${py - 6} ${ex} ${gy}" fill="none" stroke="${C.navy}" stroke-width="2.4" stroke-dasharray="6 5"/>`);
  P.add(`<circle cx="${sx}" cy="${sy}" r="5" fill="${C.navy}" stroke="#fff" stroke-width="1.5"/>`);
  const col = k => (o.hi === k ? C.goldT : '#7C869B');
  const dotc = k => (o.hi === k ? C.gold : '#9AA3B5');
  P.add(`<circle cx="${px}" cy="${py}" r="5" fill="${dotc('max')}" stroke="#fff" stroke-width="1.5"/>`);
  P.add(`<circle cx="${ex}" cy="${gy}" r="5" fill="${dotc('land')}" stroke="#fff" stroke-width="1.5"/>`);
  P.add(`<line x1="${sx - 30}" y1="${sy}" x2="${sx - 30}" y2="${gy}" stroke="${o.hi === 'start' ? C.gold : '#9AA3B5'}" stroke-width="2" stroke-dasharray="3 3"/>`);
  P.textPx(sx - 26, (sy + gy) / 2 + 4, 'h(0) = ?', { fs: 12, bold: true, c: col('start') });
  P.textPx(px, py - 12, 'max height = ?', { fs: 12, bold: true, anchor: 'middle', c: col('max') });
  P.add(`<line x1="${px}" y1="${py + 6}" x2="${px}" y2="${gy}" stroke="${o.hi === 'tmax' ? C.gold : '#C3CAD6'}" stroke-width="1.5" stroke-dasharray="3 3"/>`);
  P.textPx(px, gy + 15, 't = ?', { fs: 12, bold: true, anchor: 'middle', c: col('tmax') });
  P.textPx(ex - 10, gy - 10, 'lands: t = ?', { fs: 12, bold: true, anchor: 'end', c: col('land') });
  P.textPx(W / 2, 16, o.eq, { fs: 12, bold: true, anchor: 'middle', c: C.navy });
  return P.out(o.aria || 'sketch of a thrown ball');
}

/* value table (HTML). cells containing '?' are gold; cls 'g' marks answer cells green */
function vt(head, rows, o = {}) {
  const td = (v, isHead) => {
    const s = String(v);
    const cls = s.indexOf('?') >= 0 ? ' class="u"' : (o.green && o.green(s) ? ' class="ok"' : '');
    return isHead ? `<th${cls}>${s}</th>` : `<td${cls}>${s}</td>`;
  };
  return `<table class="vt">` + rows.map((r, i) => `<tr>${td(head[i], true)}${r.map(v => td(v)).join('')}</tr>`).join('') + `</table>`;
}

module.exports = { decoder, boxMethod, machine, tree, scene, vt, areaModel: G.areaModel };
