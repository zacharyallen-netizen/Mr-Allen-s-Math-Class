/* 7th grade Skill Builders: warm colors for the shared figures, plus a simple "board" animation builder.
   Loaded after ../grade8/skills/sbfig.js and before skills/uN.js. SB.C is changed in place (never replaced). */
(function () {
  'use strict';
  var SB = window.SB, C = SB.C, D = SB.D;
  var W = { navy: '#3E2414', gold: '#D98E1C', gold2: '#F2B13C', blue: '#2C6E91', green: '#3F7A1F', red: '#B4541C', teal: '#2F7A6E',
    purple: '#7A3E6E', orange: '#C8642A', gray: '#6E5A48', light: '#E9DCC4', soft: '#FBF3E6', ink: '#2A1B10' };
  for (var k in W) C[k] = W[k];
  /* board(title, top, rows, caps, o)
     top: static SVG fragment drawn above (o.th = its height, default 0)
     rows: [{ t: 'text', c: color, s: size }] shown one per frame, lined up in the middle
     caps: captions; caps[0] = before any row, caps[i] = after row i is shown (so caps.length = rows.length + 1)
     o.extra: { frameIndex: { id: {o: 1}, ... } } more things to show on a frame (ids drawn in top with hide: true) */
  function board(title, top, rows, caps, o) {
    o = o || {}; var th = o.th || 0, w = 640, gap = o.gap || 40, h = th + gap * rows.length + 26, s = D.arrowDefs() + (top || '');
    rows.forEach(function (r, i) {
      s += D.txt(w / 2, th + 34 + gap * i, D.minus(r.t), { s: r.s || 22, mono: r.mono !== false, c: r.c || C.ink, id: 'r' + i, hide: true });
    });
    var frames = [], acc = {};
    for (var f = 0; f < caps.length; f++) {
      if (f > 0 && rows[f - 1]) acc['r' + (f - 1)] = { o: 1 };
      var set = {}; for (var a in acc) set[a] = acc[a];
      var ex = (o.extra || {})[f]; if (ex) for (var b in ex) { set[b] = ex[b]; acc[b] = ex[b]; }
      frames.push({ cap: caps[f], set: set });
    }
    return { w: w, h: h, svg: s, title: title, frames: frames };
  }
  SB.G7 = { board: board };
})();
