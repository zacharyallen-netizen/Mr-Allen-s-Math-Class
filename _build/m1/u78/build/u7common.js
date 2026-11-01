/* shared quadratic helpers for Unit 7 pages (answers computed here, never typed by hand) */
const { G, C, fmt } = require('../lib/common.js');

function Q(a, b, c) {
  const f = x => a * x * x + b * x + c;
  const h = -b / (2 * a), k = f(h);
  const d = b * b - 4 * a * c;
  const zeros = d < 0 ? [] : d === 0 ? [h] : [(-b - Math.sqrt(d)) / (2 * a), (-b + Math.sqrt(d)) / (2 * a)].sort((p, q) => p - q);
  return { a, b, c, f, h, k, zeros, yint: c };
}
/* from vertex form */
function QV(a, h, k) { return Q(a, -2 * a * h, a * h * h + k); }

function pgraph(f, v, o = {}) {
  const P = G.plane({ xmin: v[0], xmax: v[1], ymin: v[2], ymax: v[3], W: o.W || 300, square: false, H: o.H || 280,
    lx: o.lx, ly: o.ly, gx: o.gx, gy: o.gy, xname: o.xname, yname: o.yname });
  if (f) P.curve(f, { c: o.c || C.navy, w: o.w });
  return P;
}
/* mark features. spec: {vertex:{c,pos,text}, axis:{c,text,at:[x,y]}, zeros:{c,pos:[..]}, yint:{c,pos}} */
function feats(P, q, s) {
  if (s.axis) {
    P.vline(q.h, { c: s.axis.c, w: 1.8, dash: '6 4' });
    let ay = s.axis.y != null ? s.axis.y : (q.a < 0 ? P.o.ymin + 0.6 : P.o.ymax - 0.6);
    if (q.a < 0 && ay > q.k) ay = P.o.ymin + 0.6; if (q.a > 0 && ay < q.k) ay = P.o.ymax - 0.6;
    if (s.axis.text !== false) P.text(q.h, ay, s.axis.text || ('x = ' + fmt(q.h)), { c: s.axis.c === C.gold ? C.goldT : s.axis.c, fs: 12, bold: true, anchor: s.axis.anchor || (q.h < 0 ? 'end' : 'start'), dx: (s.axis.anchor || (q.h < 0 ? 'end' : 'start')) === 'end' ? -6 : 6 });
  }
  if (s.zeros) q.zeros.forEach((z, i) => {
    P.dot(z, 0, { c: s.zeros.c, r: 5 });
    if (s.zeros.text !== false) P.lab(z, 0, s.zeros.texts ? s.zeros.texts[i] : '(' + fmt(z) + ', 0)', (s.zeros.pos || [])[i] || (i ? 'se' : 'sw'), { c: s.zeros.c === C.gold ? C.goldT : s.zeros.c, fs: 11 });
  });
  if (s.yint) {
    P.dot(0, q.c, { c: s.yint.c, r: 5 });
    if (s.yint.text !== false) P.lab(0, q.c, s.yint.text || '(0, ' + fmt(q.c) + ')', s.yint.pos || 'e', { c: s.yint.c === C.gold ? C.goldT : s.yint.c, fs: 11 });
  }
  if (s.vertex) {
    P.dot(q.h, q.k, { c: s.vertex.c, r: 5.5 });
    if (s.vertex.text !== false) P.lab(q.h, q.k, s.vertex.text || ('vertex (' + fmt(q.h) + ', ' + fmt(q.k) + ')'), (s.vertex.pos && s.vertex.pos !== 'e' ? s.vertex.pos : (q.a > 0 ? 'se' : 'ne')), { c: s.vertex.c === C.gold ? C.goldT : s.vertex.c, fs: 12 });
  }
  return P;
}
/* range band along the y-axis side */
function rangeBand(P, q, c) {
  const x = P.o.xmax - 0.35;
  const up = q.a > 0;
  const y0 = q.k, y1 = up ? P.o.ymax : P.o.ymin;
  P.seg(x, y0, x, y1, { c, w: 6 });
  P.dot(x, y0, { c, r: 5 });
  P.text(x, up ? P.o.ymax - 0.3 : P.o.ymin + 0.3, up ? '▲' : '▼', { c, fs: 12, anchor: 'middle', dy: up ? 8 : 0 });
  return P;
}
/* polynomial text with true minus and superscripts */
function poly(a, b, c, v = 'x') {
  let s = '';
  const co = (n) => n === 1 ? '' : n === -1 ? '−' : (Math.abs(Math.abs(n) - 0.5) < 1e-9 ? (n < 0 ? '−½' : '½') : fmt(n));
  if (a !== 0) s = co(a) + v + '²';
  if (b !== 0) s += (s ? (b < 0 ? ' − ' : ' + ') : (b < 0 ? '−' : '')) + (Math.abs(b) === 1 ? '' : fmt(Math.abs(b))) + v;
  if (c !== 0 || !s) s += s ? (c < 0 ? ' − ' : ' + ') + fmt(Math.abs(c)) : fmt(c);
  return s;
}
function vform(a, h, k) {
  const co = a === 1 ? '' : a === -1 ? '−' : fmt(a);
  let s = co + (h === 0 ? 'x²' : '(x ' + (h > 0 ? '− ' : '+ ') + fmt(Math.abs(h)) + ')²');
  if (k !== 0) s += (k > 0 ? ' + ' : ' − ') + fmt(Math.abs(k));
  return s;
}
/* ascii answer string for the checker */
function polyA(a, b, c, v = 'x') { return `${a}*${v}^2+(${b})*${v}+(${c})`; }

module.exports = { Q, QV, pgraph, feats, rangeBand, poly, vform, polyA };
