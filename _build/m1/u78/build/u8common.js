const { G, C, fmt } = require('../lib/common.js');
/* square-unit coordinate grid */
function gp(v, o = {}) { return G.plane({ xmin: v[0], xmax: v[1], ymin: v[2], ymax: v[3], W: o.W || 300, lx: o.lx, ly: o.ly }); }
/* label points away from the centre of the figure */
function labPts(P, pts, names, o = {}) {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  pts.forEach((p, i) => {
    const c = (o.cols && o.cols[i]) || o.c || C.navy;
    P.dot(p[0], p[1], { c });
    if (names[i] === '') return;
    let pos = (o.pos && o.pos[i]) || ((p[1] >= cy ? 'n' : 's') + (p[0] > cx + 0.01 ? 'e' : p[0] < cx - 0.01 ? 'w' : ''));
    if ((pos === 'n' || pos === 's') && pts.length === 2 && !(o.pos && o.pos[i])) pos = pos + (i ? 'e' : 'w');
    const txt = names[i] + (o.coords === false ? '' : '(' + fmt(p[0]) + ', ' + fmt(p[1]) + ')');
    const onX = p[1] === 0 && P.o.ymin < 0 && pos.indexOf('s') >= 0;            // keep clear of the x-axis numbers
    if (p[0] === 0 && P.o.xmin < 0 && pos.indexOf('w') >= 0) pos = pos.replace('w', 'e');   // on the y-axis: keep clear of its numbers
    P.lab(p[0], p[1], txt, pos, { c: c === C.gold ? C.goldT : c, fs: o.fs || 12, dy: onX ? 13 : 0 });
  });
  return P;
}
const GL = { '1/2': '½', '1/3': '⅓', '2/3': '⅔', '1/4': '¼', '3/4': '¾', '1/5': '⅕', '2/5': '⅖', '3/5': '⅗', '4/5': '⅘', '1/6': '⅙', '5/6': '⅚', '1/8': '⅛' };
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUB = '₀₁₂₃₄₅₆₇₈₉';
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }
/* slope as text for SVG labels: 2, −½, ⁵⁄₄ */
function ftxt(n, d) {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d); n /= g; d /= g;
  if (d === 1) return fmt(n);
  const s = n < 0 ? '−' : '', k = Math.abs(n) + '/' + d;
  if (GL[k]) return s + GL[k];
  return s + String(Math.abs(n)).split('').map(c => SUP[+c]).join('') + '⁄' + String(d).split('').map(c => SUB[+c]).join('');
}
/* slope as stacked html fraction */
function fhtml(n, d) {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d); n /= g; d /= g;
  if (d === 1) return fmt(n);
  return (n < 0 ? '−' : '') + `<span class="fr"><span>${Math.abs(n)}</span><span>${d}</span></span>`;
}
function slopeND(p, q) { return [q[1] - p[1], q[0] - p[0]]; }
function dist(p, q) { return Math.hypot(q[0] - p[0], q[1] - p[1]); }
/* side-length label at the middle of a segment, pushed outward from centre (cx,cy) */
function sideLab(P, p, q, txt, cen, o = {}) {
  const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
  let dx = mx - cen[0], dy = my - cen[1];
  const L = Math.hypot(dx, dy) || 1;
  if (!o.off && ((p[1] === 0 && q[1] === 0) || (p[0] === 0 && q[0] === 0))) o = Object.assign({}, o, { off: 28 });
  const px = P.X(mx) + dx / L * (o.off || 14), py = P.Y(my) - dy / L * (o.off || 14) + 4;
  P.textPx(px, py, txt, { c: o.c || C.navy, fs: o.fs || 12, bold: true, anchor: Math.abs(dx / L) < 0.3 ? 'middle' : dx > 0 ? 'start' : 'end' });
  return P;
}
module.exports = { gp, labPts, ftxt, fhtml, slopeND, dist, sideLab, gcd };
