    // ===== VISUALS START =====
    // One picture per question, drawn from that question's own numbers.
    // Parts wrapped in giv(...) show only BEFORE the student answers (the "?" labels).
    // Parts wrapped in ans(...) show only AFTER the student answers (the worked picture).
    // The page adds class "revealed" to #game after an answer; CSS does the rest.
    // (The same library is used by eog_math_review_game.html and Grade_8_Math_Review_Quest.html.)
    function makeVisuals(C) {
      const FONT = 'font-family="Arvo, Georgia, serif"';
      const r1 = v => Math.round(v * 10) / 10;
      const m = n => (n < 0 ? "−" + Math.abs(n) : String(n));
      const pt = (x, y) => `(${m(x)}, ${m(y)})`;
      const T = (x, y, s, o = {}) =>
        `<text x="${r1(x)}" y="${r1(y)}" fill="${o.fill || C.ink}" font-size="${o.size || 14}" font-weight="${o.weight || 700}" text-anchor="${o.anchor || "start"}" ${FONT}${o.rot ? ` transform="rotate(${o.rot} ${r1(x)} ${r1(y)})"` : ""}>${s}</text>`;
      const Ln = (x1, y1, x2, y2, o = {}) =>
        `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${o.c || C.ink}" stroke-width="${o.w || 2}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""} stroke-linecap="round"/>`;
      const Dot = (x, y, o = {}) =>
        `<circle cx="${r1(x)}" cy="${r1(y)}" r="${o.r || 5}" fill="${o.c || C.ink}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="2"` : ""}/>`;
      const Poly = (pts, o = {}) =>
        `<polygon points="${pts.map(([x, y]) => r1(x) + "," + r1(y)).join(" ")}" fill="${o.fill || "none"}" fill-opacity="${o.op ?? 1}" stroke="${o.c || C.ink}" stroke-width="${o.w || 2}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""} stroke-linejoin="round"/>`;
      const PL = (pts, o = {}) =>
        `<polyline points="${pts.map(([x, y]) => r1(x) + "," + r1(y)).join(" ")}" fill="none" stroke="${o.c || C.ink}" stroke-width="${o.w || 2.5}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""} stroke-linejoin="round" stroke-linecap="round"/>`;
      const Rect = (x, y, w, h, o = {}) =>
        `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="${o.rx ?? 6}" fill="${o.fill || "#fff"}"${o.op != null ? ` fill-opacity="${o.op}"` : ""} stroke="${o.c || C.ink}" stroke-width="${o.w ?? 1.5}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;
      const textWidth = (s, size) => [...String(s).replace(/<[^>]+>/g, "")].length * size * 0.6;
      const Tag = (x, y, s, o = {}) => {
        const size = o.size || 14, w = textWidth(s, size) + 16, h = size + 12;
        const left = o.anchor === "start" ? x : o.anchor === "end" ? x - w : x - w / 2;
        return Rect(left, y - h / 2, w, h, { fill: o.bg || C.goldSoft, c: o.border || C.gold, rx: 6, w: 1.5 }) +
          T(left + w / 2, y + size * 0.36, s, { size, anchor: "middle", fill: o.fill || C.ink, weight: 800 });
      };
      const Bad = (x, y, s, o = {}) => Tag(x, y, s, Object.assign({ bg: C.roseSoft, border: C.rose, fill: C.rose }, o));
      const Good = (x, y, s, o = {}) => Tag(x, y, s, Object.assign({ bg: C.greenSoft, border: C.green, fill: C.green }, o));
      const Arrow = (x1, y1, x2, y2, o = {}) => {
        const a = Math.atan2(y2 - y1, x2 - x1), L = o.head || 9;
        const p1 = [x2 - L * Math.cos(a - 0.45), y2 - L * Math.sin(a - 0.45)];
        const p2 = [x2 - L * Math.cos(a + 0.45), y2 - L * Math.sin(a + 0.45)];
        return Ln(x1, y1, x2 - 4 * Math.cos(a), y2 - 4 * Math.sin(a), o) + Poly([[x2, y2], p1, p2], { fill: o.c || C.ink, c: o.c || C.ink, w: 1 });
      };
      const pol = (cx, cy, rad, deg) => [cx + rad * Math.cos(deg * Math.PI / 180), cy - rad * Math.sin(deg * Math.PI / 180)];
      const Arc = (cx, cy, rad, a1, a2, o = {}) => {
        const [x1, y1] = pol(cx, cy, rad, a1), [x2, y2] = pol(cx, cy, rad, a2);
        return `<path d="M ${r1(x1)} ${r1(y1)} A ${rad} ${rad} 0 ${Math.abs(a2 - a1) > 180 ? 1 : 0} ${a2 > a1 ? 0 : 1} ${r1(x2)} ${r1(y2)}" fill="none" stroke="${o.c || C.ink}" stroke-width="${o.w || 2}"/>`;
      };
      const giv = s => `<g class="giv">${s}</g>`;
      const ans = s => `<g class="ans">${s}</g>`;
      const SVG = (w, h, label, body) =>
        `<svg viewBox="0 0 ${w} ${h}" width="${w}" style="max-width:100%;height:auto" role="img" aria-label="${label}">${body}</svg>`;
      const multi = arr => `<div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;width:100%">${arr.join("")}</div>`;
      const vlabel = (P, pts, i, s, o = {}) => {
        const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
        const [x, y] = pts[i], X = P.X(x), Y = P.Y(y), dx = X - P.X(cx), dy = Y - P.Y(cy), d = Math.hypot(dx, dy) || 1, k = o.dist || 14;
        return T(X + dx / d * k, Y + dy / d * k + 5, s, { size: o.size || 13, anchor: "middle", fill: o.fill || C.ink, weight: 800 });
      };

      // Coordinate plane. Every grid line is its own <line>.
      function plane(o) {
        const { x0, y0, w, h, xmin, xmax, ymin, ymax } = o;
        const xs = o.xstep || 1, ys = o.ystep || 1, xl = o.xlab || xs, yl = o.ylab || ys, fs = o.fs || 11;
        const X = v => x0 + (v - xmin) / (xmax - xmin) * w;
        const Y = v => y0 + h - (v - ymin) / (ymax - ymin) * h;
        let s = "";
        for (let i = 0; xmin + i * xs <= xmax + 1e-9; i++) { const v = xmin + i * xs; s += Ln(X(v), y0, X(v), y0 + h, { c: C.grid, w: 1 }); }
        for (let i = 0; ymin + i * ys <= ymax + 1e-9; i++) { const v = ymin + i * ys; s += Ln(x0, Y(v), x0 + w, Y(v), { c: C.grid, w: 1 }); }
        const hasX0 = xmin <= 0 && xmax >= 0, hasY0 = ymin <= 0 && ymax >= 0;
        const axY = hasY0 ? Y(0) : Y(ymin), axX = hasX0 ? X(0) : X(xmin);
        s += Ln(x0, axY, x0 + w, axY, { c: C.ink, w: 1.8 }) + Ln(axX, y0, axX, y0 + h, { c: C.ink, w: 1.8 });
        if (o.labels !== false) {
          for (let v = Math.ceil(xmin / xl - 1e-9) * xl; v <= xmax + 1e-9; v += xl) {
            const vv = Math.round(v * 1000) / 1000;
            if (vv === 0 && hasX0 && hasY0) continue;
            s += T(X(vv), axY + fs + 4, m(vv), { size: fs, anchor: "middle", weight: 600, fill: C.muted });
          }
          for (let v = Math.ceil(ymin / yl - 1e-9) * yl; v <= ymax + 1e-9; v += yl) {
            const vv = Math.round(v * 1000) / 1000;
            if (vv === 0 && hasX0 && hasY0) continue;
            s += T(axX - 5, Y(vv) + fs * 0.36, m(vv), { size: fs, anchor: "end", weight: 600, fill: C.muted });
          }
          if (hasX0 && hasY0) s += T(axX - 5, axY + fs + 4, "0", { size: fs, anchor: "end", weight: 600, fill: C.muted });
        }
        if (o.xname) s += T(x0 + w, axY - 6, o.xname, { size: fs + 1, anchor: "end" });
        if (o.yname) s += T(axX + 6, y0 + fs + 1, o.yname, { size: fs + 1 });
        return { s, X, Y, xmin, xmax, ymin, ymax };
      }
      function fn(P, f, a, b, o = {}) {
        const segs = []; let cur = []; const n = o.n || 120;
        for (let i = 0; i <= n; i++) {
          const x = a + (b - a) * i / n, y = f(x);
          if (isFinite(y) && y >= P.ymin - 1e-9 && y <= P.ymax + 1e-9) cur.push([P.X(x), P.Y(y)]);
          else { if (cur.length > 1) segs.push(cur); cur = []; }
        }
        if (cur.length > 1) segs.push(cur);
        return segs.map(sg => PL(sg, o)).join("");
      }
      // Table: rows of cells. A cell may be a string, or {g:"?", a:"20"} (given / answer text).
      function table(x, y, rows, o = {}) {
        const rh = o.rh || 30, fs = o.fs || 14, cws = rows[0].map((_, j) => (Array.isArray(o.cw) ? o.cw[j] : o.cw || 60));
        let s = "", a = "", g = "";
        const cell = (i, j) => ({ x: x + cws.slice(0, j).reduce((p, q) => p + q, 0), y: y + i * rh, w: cws[j], h: rh });
        rows.forEach((row, i) => row.forEach((c, j) => {
          const k = cell(i, j), head = (o.headRow !== false && i === 0) || (o.headCol && j === 0);
          s += Rect(k.x, k.y, k.w, k.h, { fill: head ? C.soft : "#fff", c: C.ink, w: 1.2, rx: 0 });
          const tx = k.x + k.w / 2, ty = k.y + k.h / 2 + fs * 0.36;
          if (c && typeof c === "object") {
            g += Rect(k.x + 3, k.y + 3, k.w - 6, k.h - 6, { fill: "#fff", c: C.hl, w: 2, dash: "4 3", rx: 3 }) + T(tx, ty, c.g, { size: fs, anchor: "middle", fill: C.muted, weight: 800 });
            a += Rect(k.x + 2, k.y + 2, k.w - 4, k.h - 4, { fill: C.goldSoft, c: C.hl, w: 2, rx: 3 }) + T(tx, ty, c.a, { size: fs, anchor: "middle", weight: 800 });
          } else {
            s += T(tx, ty, c, { size: fs, anchor: "middle", weight: head ? 800 : 600 });
          }
        }));
        return { s: s + giv(g) + ans(a), cell, width: cws.reduce((p, q) => p + q, 0), height: rows.length * rh };
      }
      // Horizontal x/y table with step arrows (used by slope / intercept items)
      function hTable(x, y, heads, xs, ys, o = {}) {
        const cw = o.cw || 62, hw = o.hw || 70, fs = o.fs || 15;
        return table(x, y, [[heads[0], ...xs], [heads[1], ...ys]], { cw: [hw, ...xs.map(() => cw)], rh: o.rh || 34, fs, headRow: false, headCol: true });
      }
      const stepArrow = (x1, x2, y, label, up, color) => {
        const mid = (x1 + x2) / 2, top = up ? y - 18 : y + 18;
        return `<path d="M ${r1(x1)} ${r1(y)} Q ${r1(mid)} ${r1(top - (up ? 10 : -10))} ${r1(x2)} ${r1(y)}" fill="none" stroke="${color}" stroke-width="2"/>` +
          Poly([[x2, y], [x2 - 7, y + (up ? -7 : 7)], [x2 + 2, y + (up ? -9 : 9)]], { fill: color, c: color, w: 1 }) +
          T(mid, up ? top - 12 : top + 22, label, { size: 13, anchor: "middle", fill: color, weight: 800 });
      };

      const main = {}, choice = {};

      // ---------- 1 & 33: scatterplots as answer choices ----------
      function scatterMini(pts, o) {
        const P = plane({ x0: 26, y0: 8, w: 192, h: 122, xmin: 0, xmax: 10, ymin: 0, ymax: 10, labels: false, xname: "x", yname: "y" });
        let s = P.s + pts.map(([x, y]) => Dot(P.X(x), P.Y(y), { r: 4.5, c: C.main })).join("");
        let a = "";
        if (o.trend) { const [x1, y1, x2, y2] = o.trend; a += Ln(P.X(x1), P.Y(y1), P.X(x2), P.Y(y2), { c: C.hl, w: 3, dash: "8 5" }); }
        a += (o.good ? Good : Bad)(122, 152, o.tag, { size: 12 });
        return SVG(232, 168, o.label, s + ans(a));
      }
      const sc1 = {
        A: [[[1, 2], [2, 2.6], [3, 3.4], [4, 3.9], [5, 5], [6, 5.4], [7, 6.8], [8, 7.1], [9, 8.2], [9.6, 8.9]], [0.5, 1.4, 9.8, 9.2], "rises → positive"],
        B: [[[1, 6], [2, 2], [3, 8.4], [4, 4.5], [5, 1.5], [6, 7.5], [7, 3], [8, 9], [9, 5.2], [2.6, 5]], null, "no pattern → none"],
        C: [[[1, 9], [2, 8.2], [3, 7.6], [4, 6.4], [5, 5.8], [6, 4.6], [7, 4], [8, 2.8], [9, 2.2], [9.6, 1.2]], [0.5, 9.6, 9.8, 1.3], "falls → negative ✓"],
        D: [[[1, 2], [2, 4.6], [3, 6.6], [4, 7.8], [5, 8.3], [6, 7.9], [7, 6.4], [8, 4.6], [9, 2.2]], null, "up, then down → not negative"]
      };
      choice[1] = L => scatterMini(sc1[L][0], { trend: sc1[L][1], tag: sc1[L][2], good: L === "C", label: "Scatterplot " + L });
      const sc33 = {
        A: [[[0.6, 8], [1.5, 8.6], [2, 7], [3, 6.8], [4, 6], [5, 5.2], [6, 4], [7, 3.6], [8, 2.5], [9, 2]], [0.3, 8.7, 9.6, 1.6], "falls → negative"],
        B: [[[1, 1.5], [1.6, 2.8], [2.5, 2.5], [3.5, 4], [4, 4.7], [5, 5], [6, 6.4], [7, 6.6], [8, 8], [9, 8.6]], [0.6, 1.4, 9.6, 9.2], "rises → positive ✓"],
        C: [[[1, 4], [2, 8], [3, 2], [4, 6], [5, 9], [6, 3], [7, 7], [8, 1.5], [9, 5], [5.5, 5.6]], null, "no pattern → none"],
        D: [[[1, 5], [2, 5.4], [3, 4.7], [4, 5.2], [5, 4.9], [6, 5.3], [7, 4.6], [8, 5.1], [9, 4.8]], null, "flat → none"]
      };
      choice[33] = L => scatterMini(sc33[L][0], { trend: sc33[L][1], tag: sc33[L][2], good: L === "B", label: "Scatterplot " + L });

      // ---------- 2 & 34: which equation is linear? ----------
      function eqMinis(list, rng, label) {
        return multi(list.map(([L, eq, f, ok]) => {
          const P = plane({ x0: 30, y0: 30, w: 170, h: 120, xmin: rng[0], xmax: rng[1], ymin: rng[2], ymax: rng[3], xstep: 1, ystep: rng[4], labels: false, xname: "x", yname: "y" });
          const g = T(115, 98, "?", { size: 30, anchor: "middle", fill: C.muted });
          const a = fn(P, f, rng[0], rng[1], { c: ok ? C.hl : C.main, w: 3, n: 240 }) + (ok ? Good : Bad)(115, 172, ok ? "straight line ✓" : "curved → not linear", { size: 12 });
          return SVG(220, 188, label + " " + L, T(115, 19, `${L}:  ${eq}`, { size: 14, anchor: "middle" }) + P.s + giv(g) + ans(a));
        }));
      }
      main[2] = () => eqMinis([
        ["A", "y = x²", x => x * x, false],
        ["B", "xy = 2", x => 2 / x, false],
        ["C", "y = x² + 8", x => x * x + 8, false],
        ["D", "y = 2x + 4", x => 2 * x + 4, true]
      ], [-3, 3, -4, 16, 4], "Graph of choice");
      main[34] = () => eqMinis([
        ["A", "y = 3x + 5", x => 3 * x + 5, true],
        ["B", "y = 5x² + 3", x => 5 * x * x + 3, false],
        ["C", "y = 5ˣ", x => Math.pow(5, x), false],
        ["D", "y = 3/x", x => 3 / x, false]
      ], [-2, 2, -4, 20, 4], "Graph of choice");

      // ---------- 3: 4 × 10⁶ is 5 times last year ----------
      main[3] = () => {
        const u = 66, x0 = 120;
        let s = T(20, 64, "Last year", { size: 14 }) + T(20, 124, "This year", { size: 14 });
        s += Rect(x0, 44, u, 30, { fill: C.soft, c: C.main, rx: 4 });
        s += Rect(x0, 104, 5 * u, 30, { fill: C.goldSoft, c: C.main, rx: 4 });
        for (let i = 1; i < 5; i++) s += Ln(x0 + i * u, 104, x0 + i * u, 134, { c: C.main, w: 1.5, dash: "4 3" });
        s += T(x0 + 2.5 * u, 124, "4 × 10⁶ dollars", { size: 15, anchor: "middle" });
        s += T(x0 + 2.5 * u, 158, "5 equal parts — each part is one “last year”", { size: 12, anchor: "middle", fill: C.muted, weight: 600 });
        const g = T(x0 + u + 12, 65, "? dollars", { size: 15, fill: C.muted });
        const a = T(x0 + u + 12, 65, "8 × 10⁵ dollars", { size: 15 }) + Tag(240, 192, "(4 × 10⁶) ÷ 5 = 0.8 × 10⁶ = 8 × 10⁵", { size: 14 });
        return SVG(480, 212, "Bar model: this year is 5 times last year", s + giv(g) + ans(a));
      };

      // ---------- 4: vertical line test choices ----------
      const g4 = {
        A: { draw: P => fn(P, x => 0.5 * x + 1, -5, 5, { c: C.main, w: 3 }), hits: [1.5] },
        B: { draw: P => { const pts = []; for (let i = 0; i <= 80; i++) { const t = -3.6 + 7.2 * i / 80; pts.push([P.X(t * t / 2 - 3), P.Y(t)]); } return PL(pts, { c: C.main, w: 3 }); }, hits: [Math.sqrt(8), -Math.sqrt(8)] },
        C: { draw: P => fn(P, x => x * x / 2 - 3, -3.4, 3.4, { c: C.main, w: 3 }), hits: [-2.5] },
        D: { draw: P => fn(P, () => 3, -5, 5, { c: C.main, w: 3 }), hits: [3] }
      };
      choice[4] = L => {
        const P = plane({ x0: 26, y0: 8, w: 192, h: 132, xmin: -5, xmax: 5, ymin: -5, ymax: 5, labels: false, xname: "x", yname: "y" });
        const it = g4[L];
        const a = Ln(P.X(1), P.Y(5), P.X(1), P.Y(-5), { c: C.hl, w: 2.5, dash: "6 4" }) +
          it.hits.map(y => Dot(P.X(1), P.Y(y), { r: 5.5, c: it.hits.length > 1 ? C.rose : C.green })).join("") +
          (it.hits.length > 1 ? Bad(122, 160, "2 crossings → NOT a function", { size: 12 }) : Good(122, 160, "1 crossing → function", { size: 12 }));
        return SVG(232, 176, "Graph " + L, P.s + it.draw(P) + ans(a));
      };

      // ---------- 5: which is irrational ----------
      main[5] = () => {
        const X = v => 40 + v * 66;
        let s = Ln(25, 100, 455, 100, { w: 2.5 });
        for (let n = 0; n <= 6; n++) s += Ln(X(n), 92, X(n), 108, { w: 2 }) + T(X(n), 128, String(n), { size: 15, anchor: "middle" }) + T(X(n), 148, "√" + n * n, { size: 12, anchor: "middle", fill: C.muted, weight: 600 });
        s += T(240, 22, "Perfect squares: √1, √4, √9, √16, √25, √36 are whole numbers", { size: 13, anchor: "middle", weight: 700 });
        const v20 = Math.sqrt(20);
        const a = Dot(X(3), 100, { r: 7, c: C.green }) + Good(X(3) + 8, 62, "√9 = 3 → rational", { size: 12, anchor: "end" }) +
          Dot(X(v20), 100, { r: 7, c: C.rose, stroke: C.ink }) + Bad(470, 62, "√20 ≈ 4.472… → irrational", { size: 12, anchor: "end" }) +
          Good(240, 176, "¹⁷⁄₅₃ is a fraction of two integers → rational", { size: 13 });
        return SVG(480, 194, "Number line with perfect squares", s + ans(a));
      };

      // ---------- 6: two squares ----------
      main[6] = () => {
        const k = 10;
        let s = Rect(40, 180 - 6 * k, 6 * k, 6 * k, { fill: C.soft, c: C.main, rx: 0, w: 2 }) +
          T(70, 147, "Area", { size: 11, anchor: "middle" }) + T(70, 162, "36 ft²", { size: 12, anchor: "middle" });
        s += Rect(150, 180 - 12 * k, 12 * k, 12 * k, { fill: C.goldSoft, c: C.main, rx: 0, w: 2 }) +
          T(210, 117, "Area", { size: 13, anchor: "middle" }) + T(210, 137, "144 ft²", { size: 15, anchor: "middle" });
        const g = T(70, 200, "side = ?", { size: 13, anchor: "middle", fill: C.muted }) + T(210, 200, "side = ?", { size: 13, anchor: "middle", fill: C.muted }) +
          T(300, 110, "How much longer", { size: 14, fill: C.muted }) + T(300, 130, "is the big side?", { size: 14, fill: C.muted });
        const a = T(70, 200, "side = 6 ft", { size: 13, anchor: "middle", fill: C.blue }) + T(210, 200, "side = 12 ft", { size: 13, anchor: "middle", fill: C.blue }) +
          T(300, 92, "√36 = 6", { size: 14 }) + T(300, 114, "√144 = 12", { size: 14 }) + Tag(300, 146, "12 − 6 = 6 ft", { size: 16, anchor: "start" });
        return SVG(480, 212, "Two squares with areas 36 and 144 square feet", s + giv(g) + ans(a));
      };

      // ---------- 7: three-move transformation ----------
      main[7] = () => {
        const P = plane({ x0: 40, y0: 12, w: 300, h: 380, xmin: -7, xmax: 8, ymin: -9, ymax: 10, xlab: 2, ylab: 2 });
        const E = [[-4, 0], [-4, 3], [-2, 0]], M = [[7, 5], [1, 5], [7, 9]];
        const R = [[0, -4], [-3, -4], [0, -2]], D = [[0, -8], [-6, -8], [0, -4]];
        const shape = (pts, o) => Poly(pts.map(([x, y]) => [P.X(x), P.Y(y)]), o);
        let s = P.s + shape(E, { fill: C.main, op: 0.25, c: C.main, w: 2.5 }) + shape(M, { fill: C.hl, op: 0.35, c: C.ink, w: 2.5 });
        ["E", "G", "H"].forEach((n, i) => s += vlabel(P, E, i, n));
        ["M", "P", "T"].forEach((n, i) => s += vlabel(P, M, i, n));
        const a = shape(R, { c: C.blue, w: 2.5, dash: "6 4" }) + shape(D, { c: C.rose, w: 2.5, dash: "6 4" }) +
          ["E₁", "G₁", "H₁"].map((n, i) => vlabel(P, R, i, n, { fill: C.blue, size: 12 })).join("") +
          ["E₂", "G₂", "H₂"].map((n, i) => vlabel(P, D, i, n, { fill: C.rose, size: 12 })).join("") +
          T(352, 60, "1st: turn 90°", { size: 13, fill: C.blue }) + T(352, 78, "counterclockwise", { size: 13, fill: C.blue }) +
          T(352, 102, "(x, y) → (−y, x)", { size: 12, fill: C.blue }) +
          T(352, 140, "2nd: × 2", { size: 13, fill: C.rose }) + T(352, 160, "3rd: 7 right, 13 up", { size: 13 }) +
          T(352, 198, "E(−4, 0) → (0, −4)", { size: 12 }) + T(352, 216, "→ (0, −8) → M(7, 5) ✓", { size: 12 });
        const g = T(352, 60, "1st move: ?", { size: 14, fill: C.muted }) + T(352, 90, "2nd: × 2", { size: 13 }) + T(352, 110, "3rd: 7 right,", { size: 13 }) + T(352, 128, "13 up", { size: 13 });
        return SVG(480, 410, "Triangle EGH and triangle MPT on a coordinate plane", s + giv(g) + ans(a));
      };

      // ---------- 8, 10, 38: linear models in context ----------
      main[8] = () => {
        const P = plane({ x0: 50, y0: 24, w: 360, h: 220, xmin: 0, xmax: 8, ymin: 0, ymax: 100, xstep: 1, ystep: 10, ylab: 20, xname: "practices (x)", yname: "score (y)" });
        let s = P.s + Ln(P.X(0), P.Y(60), P.X(8), P.Y(100), { c: C.main, w: 3 }) + T(P.X(5.2), P.Y(91) , "y = 5x + 60", { size: 14 });
        const a = Dot(P.X(0), P.Y(60), { r: 7, c: C.hl, stroke: C.ink }) + Tag(P.X(0) + 10, P.Y(60) + 30, "x = 0 practices → y = 60 points", { size: 13, anchor: "start" }) +
          Ln(P.X(2), P.Y(70), P.X(3), P.Y(70), { c: C.blue, dash: "4 3" }) + Ln(P.X(3), P.Y(70), P.X(3), P.Y(75), { c: C.blue, dash: "4 3" }) + T(P.X(3) + 6, P.Y(71), "+5 (slope)", { size: 12, fill: C.blue });
        return SVG(480, 280, "Graph of y = 5x + 60", s + ans(a));
      };
      main[10] = () => {
        const P = plane({ x0: 60, y0: 24, w: 360, h: 220, xmin: 0, xmax: 50, ymin: 0, ymax: 1600, xstep: 5, xlab: 10, ystep: 200, ylab: 400, xname: "minutes (x)", yname: "cars (y)" });
        let s = P.s + Ln(P.X(0), P.Y(1500), P.X(50), P.Y(0), { c: C.main, w: 3 }) + T(P.X(28), P.Y(900), "y = 1500 − 30x", { size: 14 });
        const a = Ln(P.X(10), P.Y(1200), P.X(20), P.Y(1200), { c: C.blue, w: 2.5 }) + Ln(P.X(20), P.Y(1200), P.X(20), P.Y(900), { c: C.rose, w: 2.5 }) +
          T(P.X(15), P.Y(1200) - 8, "10 min", { size: 12, anchor: "middle", fill: C.blue }) + T(P.X(20) + 6, P.Y(1050), "−300 cars", { size: 12, fill: C.rose }) +
          Tag(262, P.Y(1480), "300 ÷ 10 = 30 cars leave each minute", { size: 13 });
        return SVG(480, 280, "Graph of y = 1500 − 30x", s + ans(a));
      };
      main[38] = () => {
        const P = plane({ x0: 50, y0: 24, w: 360, h: 220, xmin: 0, xmax: 10, ymin: 0, ymax: 100, xstep: 1, xlab: 2, ystep: 10, ylab: 20, xname: "absences (x)", yname: "grade (y)" });
        let s = P.s + Ln(P.X(0), P.Y(92), P.X(10), P.Y(56), { c: C.main, w: 3 }) + T(P.X(5.5), P.Y(84), "y = −3.6x + 92", { size: 14 });
        const a = Ln(P.X(0), P.Y(92), P.X(5), P.Y(92), { c: C.blue, w: 2.5 }) + Ln(P.X(5), P.Y(92), P.X(5), P.Y(74), { c: C.rose, w: 2.5 }) +
          T(P.X(2.5), P.Y(92) - 8, "5 absences", { size: 12, anchor: "middle", fill: C.blue }) + T(P.X(5) - 6, P.Y(80), "−18", { size: 12, anchor: "end", fill: C.rose }) +
          Tag(P.X(0.4), P.Y(28), "18 ÷ 5 = 3.6 points lower per absence", { size: 13, anchor: "start" });
        return SVG(480, 280, "Graph of y = −3.6x + 92", s + ans(a));
      };

      // ---------- 9: mapping diagrams ----------
      main[9] = () => {
        const sets = {
          A: [[-2, 3], [0, 3], [-2, 0], [3, 3]], B: [[3, -2], [3, 0], [3, -4], [3, 2]],
          C: [[3, -2], [0, 0], [4, -3], [3, 2]], D: [[2, 4], [1, 4], [-2, 4], [-1, 4]]
        };
        return multi(Object.entries(sets).map(([L, pts]) => {
          const xs = [...new Set(pts.map(p => p[0]))].sort((a, b) => a - b), ys = [...new Set(pts.map(p => p[1]))].sort((a, b) => a - b);
          const yAt = (arr, v) => 62 + (arr.indexOf(v) + 0.5) * (100 / arr.length);
          const repeat = xs.filter(x => pts.filter(p => p[0] === x).length > 1);
          let s = T(110, 20, "Set " + L, { size: 14, anchor: "middle" }) + T(50, 46, "x", { size: 13, anchor: "middle" }) + T(170, 46, "y", { size: 13, anchor: "middle" }) +
            `<ellipse cx="50" cy="112" rx="28" ry="56" fill="${C.soft}" stroke="${C.ink}" stroke-width="1.5"/>` +
            `<ellipse cx="170" cy="112" rx="28" ry="56" fill="${C.soft}" stroke="${C.ink}" stroke-width="1.5"/>`;
          xs.forEach(x => s += T(50, yAt(xs, x) + 5, m(x), { size: 14, anchor: "middle" }));
          ys.forEach(y => s += T(170, yAt(ys, y) + 5, m(y), { size: 14, anchor: "middle" }));
          let a = "";
          pts.forEach(([x, y]) => {
            const bad = repeat.includes(x);
            s += Arrow(64, yAt(xs, x), 155, yAt(ys, y), { c: C.main, w: 1.6, head: 8 });
            if (bad) a += Arrow(64, yAt(xs, x), 155, yAt(ys, y), { c: C.rose, w: 2.6, head: 8 });
          });
          a += repeat.length ? Bad(110, 190, `x = ${m(repeat[0])} has 2+ y's ✗`, { size: 12 }) : Good(110, 190, "each x has one y ✓", { size: 12 });
          return SVG(220, 206, "Mapping diagram for set " + L, s + ans(a));
        }));
      };

      // ---------- 11, 14, 17: expression / equation cards ----------
      function card(title, given, steps, result, label) {
        let s = Rect(20, 12, 440, 54, { fill: C.soft, c: C.main, w: 2, rx: 8 }) + T(240, 47, title, { size: 22, anchor: "middle" });
        const g = T(240, 106, given, { size: 16, anchor: "middle", fill: C.muted });
        const a = steps.map((st, i) => T(40, 100 + i * 28, st, { size: 15, weight: 600 })).join("") + Tag(240, 106 + steps.length * 28, result, { size: 16 });
        return SVG(480, 126 + steps.length * 28, label, s + giv(g) + ans(a));
      }
      main[11] = () => card("2⁻³ × 5⁻³ × 10²  = ?", "Write the answer as a decimal.", [
        "Same exponent: 2⁻³ × 5⁻³ = (2 × 5)⁻³ = 10⁻³",
        "Add exponents: 10⁻³ × 10² = 10⁻¹",
        "10⁻¹ = ¹⁄₁₀"
      ], "= 0.1", "Expression 2 to the negative 3 times 5 to the negative 3 times 10 squared");
      main[14] = () => card("9³ ÷ 3²  = ?", "Hint: 9 = 3 × 3", [
        "9 = 3², so 9³ = (3²)³ = 3⁶",
        "Same base, subtract exponents: 3⁶ ÷ 3² = 3⁴",
        "3⁴ = 3 × 3 × 3 × 3"
      ], "= 81", "Expression 9 cubed divided by 3 squared");
      main[17] = () => card("½x − 3 = x + 3", "x = ?", [
        "Multiply every term by 2:  x − 6 = 2x + 6",
        "Subtract x:  −6 = x + 6",
        "Subtract 6:  −12 = x"
      ], "x = −12", "Equation one half x minus 3 equals x plus 3");

      // ---------- 12, 15, 18, 31: tables ----------
      main[12] = () => {
        const t = hTable(100, 60, ["x", "y"], ["2", "4", "6", "8"], ["5", "12", "19", "26"]);
        const c = (i, j) => t.cell(i, j);
        let a = "";
        for (let j = 1; j < 4; j++) {
          a += stepArrow(c(0, j).x + 31, c(0, j + 1).x + 31, 58, "+2", true, C.blue);
          a += stepArrow(c(1, j).x + 31, c(1, j + 1).x + 31, 130, "+7", false, C.rose);
        }
        a += Tag(240, 200, "slope = 7 ÷ 2 = 3.5", { size: 16 });
        return SVG(480, 218, "Table of x and y values", t.s + giv(T(240, 170, "slope = change in y ÷ change in x = ?", { size: 14, anchor: "middle", fill: C.muted })) + ans(a));
      };
      main[15] = () => {
        const t = hTable(84, 60, ["x", "y"], [{ g: "0", a: "0" }, "2", "4", "6", "8"], [{ g: "?", a: "20" }, "26", "32", "38", "44"]);
        const c = (i, j) => t.cell(i, j);
        let a = "";
        for (let j = 2; j < 5; j++) {
          a += stepArrow(c(0, j).x + 31, c(0, j + 1).x + 31, 58, "+2", true, C.blue);
          a += stepArrow(c(1, j).x + 31, c(1, j + 1).x + 31, 130, "+6", false, C.rose);
        }
        a += stepArrow(c(0, 2).x + 31, c(0, 1).x + 31, 58, "−2", true, C.hl) + stepArrow(c(1, 2).x + 31, c(1, 1).x + 31, 130, "−6", false, C.hl);
        a += Tag(240, 200, "slope 3 · step back to x = 0: 26 − 6 = 20", { size: 14 });
        return SVG(480, 218, "Table of points on a line", t.s + giv(T(240, 170, "The y-intercept is the y-value when x = 0.", { size: 14, anchor: "middle", fill: C.muted })) + ans(a));
      };
      main[18] = () => {
        const t = hTable(60, 60, ["Tickets", "Total"], [{ g: "0", a: "0" }, "3", "5", "6"], [{ g: "$ ?", a: "$10" }, "$91", "$145", "$172"], { cw: 76, hw: 80 });
        const c = (i, j) => t.cell(i, j);
        const a = stepArrow(c(0, 2).x + 38, c(0, 3).x + 38, 58, "+2", true, C.blue) + stepArrow(c(1, 2).x + 38, c(1, 3).x + 38, 130, "+$54", false, C.rose) +
          stepArrow(c(0, 3).x + 38, c(0, 4).x + 38, 58, "+1", true, C.blue) + stepArrow(c(1, 3).x + 38, c(1, 4).x + 38, 130, "+$27", false, C.rose) +
          Tag(240, 196, "$54 ÷ 2 = $27 per ticket", { size: 14 }) + Tag(240, 228, "fee = 91 − 3 × 27 = 91 − 81 = $10", { size: 14 });
        return SVG(480, 246, "Table of ticket totals", t.s + giv(T(240, 172, "0 tickets would cost only the fee.", { size: 14, anchor: "middle", fill: C.muted })) + ans(a));
      };
      main[31] = () => {
        const t = hTable(100, 60, ["x", "y"], ["1", "2", "3", "4"], ["1", "4", "7", "10"]);
        const c = (i, j) => t.cell(i, j);
        let a = "";
        for (let j = 1; j < 4; j++) {
          a += stepArrow(c(0, j).x + 31, c(0, j + 1).x + 31, 58, "+1", true, C.blue);
          a += stepArrow(c(1, j).x + 31, c(1, j + 1).x + 31, 130, "+3", false, C.rose);
        }
        a += Tag(240, 196, "table slope = 3 ÷ 1 = 3", { size: 14 }) + Tag(240, 228, "2 × 3 = 6  →  y = 6x − 4", { size: 15 });
        return SVG(480, 246, "Table of a linear function", t.s + giv(T(240, 172, "table slope = ?   Then double it.", { size: 14, anchor: "middle", fill: C.muted })) + ans(a));
      };

      // ---------- 13: estimate √172 ----------
      main[13] = () => {
        const X = v => 40 + (v - 12) * 133.3;
        let s = Ln(25, 100, 455, 100, { w: 2.5 });
        for (let n = 12; n <= 15; n++) s += Ln(X(n), 90, X(n), 110, { w: 2 }) + T(X(n), 132, String(n), { size: 16, anchor: "middle" }) + T(X(n), 152, `${n}² = ${n * n}`, { size: 12, anchor: "middle", fill: C.muted, weight: 600 });
        for (let v = 12.1; v < 15; v += 0.1) if (Math.abs(v - Math.round(v)) > 0.05) s += Ln(X(v), 95, X(v), 105, { w: 1, c: C.muted });
        const g = T(240, 40, "Where does √172 go?", { size: 15, anchor: "middle", fill: C.muted });
        const v = Math.sqrt(172);
        const a = Dot(X(v), 100, { r: 7, c: C.hl, stroke: C.ink }) + Tag(X(v) + 4, 58, "√172 ≈ 13.1", { size: 14 }) +
          T(240, 182, "172 − 169 = 3   but   196 − 172 = 24  →  closest to 13", { size: 13, anchor: "middle" });
        return SVG(480, 196, "Number line from 12 to 15", s + giv(g) + ans(a));
      };

      // ---------- 16: scientific notation ----------
      main[16] = () => {
        let s = Rect(20, 14, 200, 50, { fill: C.soft, c: C.main, rx: 8 }) + T(120, 36, "Expression One", { size: 12, anchor: "middle", fill: C.muted }) + T(120, 56, "4 × 10³", { size: 18, anchor: "middle" }) +
          Rect(260, 14, 200, 50, { fill: C.goldSoft, c: C.main, rx: 8 }) + T(360, 36, "Expression Two", { size: 12, anchor: "middle", fill: C.muted }) +
          Arrow(222, 39, 258, 39, { c: C.main }) + T(240, 84, "Two is 25 times One", { size: 13, anchor: "middle" });
        const g = T(360, 56, "? × 10⁵", { size: 18, anchor: "middle" });
        const a = T(360, 56, "1 × 10⁵", { size: 18, anchor: "middle" }) +
          T(40, 116, "25 × (4 × 10³) = 100 × 10³", { size: 15, weight: 600 }) + T(40, 142, "100 = 10², so 10² × 10³ = 10⁵", { size: 15, weight: 600 }) + Tag(240, 174, "x × 10⁵ = 1 × 10⁵  →  x = 1", { size: 15 });
        return SVG(480, 192, "Expression One and Expression Two", s + giv(g) + ans(a));
      };

      // ---------- 19: parallel lines and a transversal ----------
      main[19] = () => {
        const yR = 80, yS = 190, xR = 300, ang = 113, dx = Math.cos(ang * Math.PI / 180), dy = Math.sin(ang * Math.PI / 180);
        const xS = xR + dx * (yS - yR) / dy * -1;          // where Q meets S
        const top = [xR + dx * (60 / dy), yR - 60], bot = [xS - dx * (60 / dy), yS + 60];
        let s = Ln(30, yR, 450, yR, { w: 2.5 }) + Ln(30, yS, 450, yS, { w: 2.5 }) + Ln(top[0], top[1], bot[0], bot[1], { c: C.blue, w: 2.5 });
        s += T(456, yR + 5, "R", { size: 15 }) + T(456, yS + 5, "S", { size: 15 }) + T(top[0] - 16, top[1] + 4, "Q", { size: 15, fill: C.blue });
        s += Arrow(80, yR, 70, yR, { head: 9 }) + Arrow(80, yS, 70, yS, { head: 9 });
        s += Arc(xR, yR, 26, 0, ang, { w: 2 }) + T(...pol(xR, yR, 48, ang / 2), "113°", { size: 15, anchor: "middle" });
        s += Arc(xS, yS, 30, ang, 180, { c: C.rose, w: 2.5 }) + T(...pol(xS, yS, 50, (ang + 180) / 2 + 4), "x°", { size: 16, anchor: "middle", fill: C.rose });
        s += T(30, 248, "R ∥ S", { size: 13, fill: C.muted });
        const a = Arc(xR, yR, 34, ang, 180, { c: C.hl, w: 3 }) + T(...pol(xR, yR, 56, (ang + 180) / 2 + 4), "67°", { size: 15, anchor: "middle", fill: C.goldText }) +
          Tag(120, 135, "180° − 113° = 67°", { size: 13 }) + Tag(380, 135, "corresponding → x = 67", { size: 13 });
        return SVG(480, 256, "Parallel lines R and S cut by transversal Q", s + ans(a));
      };

      // ---------- 20, 24: distance between points ----------
      function distance(p1, p2, rng, scale, label) {
        const [xmin, xmax, ymin, ymax] = rng;
        const P = plane({ x0: 40, y0: 14, w: (xmax - xmin) * scale, h: (ymax - ymin) * scale, xmin, xmax, ymin, ymax });
        const c = [p2[0], p1[1]], dxv = Math.abs(p2[0] - p1[0]), dyv = Math.abs(p2[1] - p1[1]);
        let s = P.s + Dot(P.X(p1[0]), P.Y(p1[1]), { r: 6, c: C.main }) + Dot(P.X(p2[0]), P.Y(p2[1]), { r: 6, c: C.main });
        s += T(P.X(p1[0]) - 4, P.Y(p1[1]) - 10, pt(...p1), { size: 13, anchor: "end" }) + T(P.X(p2[0]) + 8, P.Y(p2[1]) + 18, pt(...p2), { size: 13 });
        const g = Ln(P.X(p1[0]), P.Y(p1[1]), P.X(p2[0]), P.Y(p2[1]), { c: C.muted, w: 2, dash: "6 5" });
        const a = Ln(P.X(p1[0]), P.Y(p1[1]), P.X(c[0]), P.Y(c[1]), { c: C.blue, w: 3 }) + Ln(P.X(c[0]), P.Y(c[1]), P.X(p2[0]), P.Y(p2[1]), { c: C.rose, w: 3 }) +
          Ln(P.X(p1[0]), P.Y(p1[1]), P.X(p2[0]), P.Y(p2[1]), { c: C.hl, w: 3.5 }) +
          T((P.X(p1[0]) + P.X(c[0])) / 2, P.Y(c[1]) - 8, String(dxv), { size: 14, anchor: "middle", fill: C.blue }) +
          T(P.X(c[0]) + 8, (P.Y(c[1]) + P.Y(p2[1])) / 2, String(dyv), { size: 14, fill: C.rose });
        return { P, s, g, a };
      }
      main[20] = () => {
        const d = distance([-4, 6], [8, 1], [-5, 9, -1, 7], 30, "");
        const mid = [(d.P.X(-4) + d.P.X(8)) / 2, (d.P.Y(6) + d.P.Y(1)) / 2];
        const g = d.g + Tag(mid[0], mid[1] + 22, "d = ?", { size: 14 });
        const a = d.a + Tag(240, 300, "d = √(12² + 5²) = √169 = 13", { size: 15 });
        return SVG(480, 318, "Points (−4, 6) and (8, 1) on a coordinate plane", d.s + giv(g) + ans(a));
      };
      main[24] = () => {
        const d = distance([-2, 7], [4, -3], [-3, 5, -4, 8], 26, "");
        const mid = [(d.P.X(-2) + d.P.X(4)) / 2, (d.P.Y(7) + d.P.Y(-3)) / 2];
        const g = d.g + Tag(mid[0] - 12, mid[1], "d = ?", { size: 14, anchor: "end" });
        const a = d.a + T(270, 120, "d² = 6² + 10²", { size: 15 }) + T(270, 146, "d² = 36 + 100 = 136", { size: 15 }) + Tag(270, 180, "d = √136 ≈ 11.7", { size: 15, anchor: "start" });
        return SVG(480, 342, "Points (−2, 7) and (4, −3) on a coordinate plane", d.s + giv(g) + ans(a));
      };

      // ---------- 21: steepness compared with slope 6 ----------
      main[21] = () => {
        const X = v => 140 + v * 40, rows = [["y = 6x + 5", 6, ""], ["A", 2, "(7 − 3) ÷ (1 − 3) = −2"], ["B", 1, "(6 − 4) ÷ (2 − 4) = −1"], ["C", 7, "(11 − 4) ÷ (5 − 6) = −7"], ["D", 0, "(9 − 9) ÷ (5 − 1) = 0"]];
        let s = T(240, 20, "Steepness = size of the slope (ignore the sign)", { size: 13, anchor: "middle" }), g = "", a = "";
        rows.forEach(([lab, v, calc], i) => {
          const y = 32 + i * 46;
          s += T(130, y + 19, lab, { size: 14, anchor: "end" });
          if (i === 0) s += Rect(X(0), y + 2, v * 40, 24, { fill: C.soft, c: C.main, rx: 3 }) + T(X(v) + 6, y + 19, "6", { size: 13 });
          else {
            g += T(X(0) + 8, y + 20, "?", { size: 16, fill: C.muted });
            a += (v > 0 ? Rect(X(0), y + 2, v * 40, 24, { fill: v > 6 ? C.hl : C.soft, c: C.main, rx: 3 }) : "") +
              T(X(Math.max(v, 0)) + 6, y + 19, `${v}${v > 6 ? " > 6 ✓" : ""}`, { size: 13, fill: v > 6 ? C.green : C.ink }) +
              T(X(0) + 4, y + 40, "slope " + calc, { size: 11, weight: 600, fill: C.muted });
          }
        });
        s += Ln(X(6), 30, X(6), 262, { c: C.rose, w: 2, dash: "5 4" }) + Ln(X(0), 30, X(0), 262, { w: 1.5 });
        for (let v = 0; v <= 7; v++) s += T(X(v), 278, String(v), { size: 11, anchor: "middle", fill: C.muted, weight: 600 });
        return SVG(480, 288, "Steepness of each table compared with 6", s + giv(g) + ans(a));
      };

      // ---------- 22: dilation of a pentagon ----------
      const pent = [[1, 1], [3, 1], [4, 3], [2, 4], [1, 3]];
      const pentChoices = {
        A: [pent.map(([x, y]) => [x / 2, y / 2]), "× ½ → too small"],
        B: [pent.map(([x, y]) => [x + 2, y + 2]), "slid, same size"],
        C: [pent.map(([x, y]) => [2 * x, y]), "only x doubled"],
        D: [pent.map(([x, y]) => [2 * x, 2 * y]), "every point × 2 ✓"]
      };
      main[22] = () => {
        const P = plane({ x0: 40, y0: 12, w: 256, h: 256, xmin: 0, xmax: 8, ymin: 0, ymax: 8, xstep: 1, ystep: 1 });
        const sh = pts => pts.map(([x, y]) => [P.X(x), P.Y(y)]);
        let s = P.s + Poly(sh(pent), { fill: C.main, op: 0.25, c: C.main, w: 2.5 }) + pent.map((p, i) => vlabel(P, pent, i, pt(...p), { size: 11, dist: 20 })).join("");
        const a = Poly(sh(pentChoices.D[0]), { fill: C.hl, op: 0.2, c: C.ink, w: 2.5, dash: "7 4" }) + Arrow(P.X(0), P.Y(0), P.X(8), P.Y(6), { c: C.rose, w: 2 }) +
          Dot(P.X(4), P.Y(3), { r: 5, c: C.rose }) + Dot(P.X(8), P.Y(6), { r: 5, c: C.rose }) +
          T(316, 120, "(x, y) → (2x, 2y)", { size: 14 }) + T(316, 148, "(4, 3) → (8, 6)", { size: 14, fill: C.rose }) + T(316, 172, "(2, 4) → (4, 8)", { size: 14 });
        const g = T(316, 130, "Scale factor 2", { size: 14 }) + T(316, 152, "about the origin", { size: 14 });
        return SVG(480, 296, "Pentagon on a coordinate plane", s + giv(g) + ans(a));
      };
      choice[22] = L => {
        const P = plane({ x0: 24, y0: 8, w: 184, h: 168, xmin: 0, xmax: 8, ymin: 0, ymax: 8, xlab: 2, ylab: 2, fs: 10 });
        const sh = pts => pts.map(([x, y]) => [P.X(x), P.Y(y)]);
        const [pts, tag] = pentChoices[L];
        const s = P.s + Poly(sh(pent), { c: C.muted, w: 1.5, dash: "4 3" }) + Poly(sh(pts), { fill: C.main, op: 0.3, c: C.main, w: 2.5 });
        return SVG(220, 214, "Pentagon choice " + L, s + ans((L === "D" ? Good : Bad)(116, 200, tag, { size: 12 })));
      };

      // ---------- 23: cost per bottle ----------
      main[23] = () => {
        const X = v => 60 + (v - 12) * 288;
        let s = Ln(40, 120, 440, 120, { w: 2.5 });
        for (let v = 12; v <= 13.26; v += 0.25) s += Ln(X(v), 112, X(v), 128, { w: 2 }) + T(X(v), 148, "$" + v.toFixed(2), { size: 12, anchor: "middle", fill: C.muted, weight: 600 });
        s += Ln(X(12.5), 40, X(12.5), 128, { c: C.main, w: 2.5, dash: "6 4" }) + T(X(12.5), 30, "model: y = 12.50x → $12.50 per bottle", { size: 13, anchor: "middle" });
        const g = T(240, 180, "Cost per bottle = total ÷ bottles.  A ?  B ?  C ?  D ?", { size: 13, anchor: "middle", fill: C.muted });
        const rates = [["A", 13], ["B", 12.5], ["C", 12.25], ["D", 12.75]];
        const a = rates.map(([L, v]) => Dot(X(v), 120, { r: 8, c: L === "C" ? C.hl : C.main, stroke: L === "C" ? C.ink : null }) + T(X(v), L === "B" ? 72 : 100, `${L}: $${v.toFixed(2)}`, { size: 13, anchor: "middle", fill: L === "C" ? C.green : C.ink })).join("") +
          Tag(240, 182, "Only C ($12.25) is below $12.50", { size: 14 });
        return SVG(480, 200, "Cost per bottle number line", s + giv(g) + ans(a));
      };

      // ---------- 25: two-way tables ----------
      const tw = {
        A: [[12, 53, 65], [28, 157, 185], [40, 210, 250]],
        B: [[12, 65, 77], [40, 133, 173], [52, 198, 250]],
        C: [[53, 12, 65], [28, 157, 185], [81, 169, 250]],
        D: [[12, 53, 65], [28, 145, 173], [40, 198, 238]]
      };
      const twBad = { B: [0, 2, "football total must be 65"], C: [2, 0, "basketball total must be 40"], D: [2, 2, "grand total must be 250"] };
      const twRows = v => [["", "Basketball", "No bball", "Total"], ["Football", ...v[0].map(String)], ["No football", ...v[1].map(String)], ["Total", ...v[2].map(String)]];
      choice[25] = L => {
        const t = table(4, 4, twRows(tw[L]), { cw: [86, 80, 72, 54], rh: 26, fs: 12, headCol: true });
        let a = "";
        if (twBad[L]) { const [i, j, msg] = twBad[L]; const k = t.cell(i + 1, j + 1); a += Rect(k.x + 1, k.y + 1, k.w - 2, k.h - 2, { fill: "none", c: C.rose, w: 3, rx: 2 }) + Bad(150, 126, msg, { size: 12 }); }
        else a += Good(150, 126, "12, 53, 28, 157 · all totals match ✓", { size: 12 });
        return SVG(300, 142, "Two-way table " + L, t.s + ans(a));
      };
      main[25] = () => {
        const q = (a) => ({ g: "?", a: String(a) });
        const t = table(40, 20, [["", "Basketball", "No basketball", "Total"], ["Football", "12", q(53), "65"], ["No football", q(28), q(157), q(185)], ["Total", "40", q(210), "250"]], { cw: [110, 100, 120, 70], rh: 34, fs: 14, headCol: true });
        const a = T(240, 182, "65 − 12 = 53 · 40 − 12 = 28 · 250 − 12 − 53 − 28 = 157", { size: 12, anchor: "middle", weight: 600 });
        return SVG(480, 194, "Two-way table with football and basketball", t.s + ans(a));
      };

      // ---------- 26: park diagonal ----------
      main[26] = () => {
        const x0 = 60, y0 = 40, w = 320, h = 200;
        let s = Rect(x0, y0, w, h, { fill: C.soft, c: C.main, w: 2, rx: 0 }) + Ln(x0, y0 + h, x0 + w, y0, { c: C.hl, w: 5 });
        s += T(x0 + w / 2, y0 + h + 22, "320 yd", { size: 14, anchor: "middle", fill: C.blue }) + T(x0 - 12, y0 + h / 2, "200 yd", { size: 14, anchor: "middle", fill: C.blue, rot: -90 });
        s += Rect(x0, y0 + h - 14, 14, 14, { fill: "none", c: C.ink, rx: 0 }) + T(240, 24, "Path is 1 yd wide · $10.75 per square yard", { size: 13, anchor: "middle" });
        const g = Tag(x0 + w / 2 + 20, y0 + h / 2 + 20, "path length = ?", { size: 13, anchor: "start" });
        const a = Tag(x0 + w / 2 + 14, y0 + h / 2 + 22, "d = √(200² + 320²) ≈ 377.4 yd", { size: 13, anchor: "start" }) +
          Tag(240, 290, "377.4 × 1 × $10.75 ≈ $4,057  →  about $4,060", { size: 14 });
        return SVG(480, 306, "Rectangular park with a diagonal path", s + giv(g) + ans(a));
      };

      // ---------- 27: Alex's ride ----------
      const ride = {
        A: [[[0, 0], [3, 2], [6, 2], [9, 8]], "stops in the middle"],
        B: [[[0, 0], [3, 2], [6, 7], [9, 3]], "ends going back"],
        C: [[[0, 0], [3, 5], [6, 7], [9, 7]], "slows down, not up"],
        D: [[[0, 0], [4, 3], [6, 8], [9, 8]], "steady → steeper → flat ✓"]
      };
      choice[27] = L => {
        const P = plane({ x0: 26, y0: 8, w: 192, h: 128, xmin: 0, xmax: 10, ymin: 0, ymax: 10, labels: false, xname: "time", yname: "distance" });
        const [pts, tag] = ride[L];
        return SVG(232, 172, "Distance-time graph " + L, P.s + PL(pts.map(([x, y]) => [P.X(x), P.Y(y)]), { c: C.main, w: 3.5 }) + ans((L === "D" ? Good : Bad)(122, 156, tag, { size: 12 })));
      };
      main[27] = () => {
        const steps = ["1. constant speed", "2. sped up", "3. stopped to talk"], look = ["straight, rising", "steeper rise", "flat (no new distance)"];
        let s = "", a = "";
        steps.forEach((st, i) => {
          const x = 14 + i * 158;
          s += Rect(x, 14, 136, 40, { fill: C.soft, c: C.main, rx: 8 }) + T(x + 68, 39, st, { size: 13, anchor: "middle" });
          if (i < 2) s += Arrow(x + 138, 34, x + 156, 34, { c: C.main, head: 7 });
          a += T(x + 68, 78, look[i], { size: 12, anchor: "middle", fill: C.green });
        });
        return SVG(480, 92, "Story of Alex's ride in three parts", s + ans(a));
      };

      // ---------- 28, 36, 44: when do two costs match? ----------
      function costs(o) {
        const P = plane({ x0: 60, y0: 74, w: 360, h: 200, xmin: 0, xmax: o.xmax, ymin: 0, ymax: o.ymax, xstep: 1, xlab: o.xlab || 1, ystep: o.ystep, ylab: o.ylab, xname: o.xname, yname: "cost ($)" });
        let s = Rect(14, 8, 220, 50, { fill: C.soft, c: C.main, rx: 8 }) + T(124, 28, o.n1, { size: 12, anchor: "middle", fill: C.muted }) + T(124, 49, o.e1, { size: 15, anchor: "middle", fill: C.main }) +
          Rect(246, 8, 220, 50, { fill: C.goldSoft, c: C.main, rx: 8 }) + T(356, 28, o.n2, { size: 12, anchor: "middle", fill: C.muted }) + T(356, 49, o.e2, { size: 15, anchor: "middle", fill: C.goldText });
        s += P.s + Dot(P.X(0), P.Y(o.b1), { r: 5, c: C.main }) + Dot(P.X(0), P.Y(o.b2), { r: 5, c: C.goldText });
        const [xi, yi] = o.meet;
        const a = Ln(P.X(0), P.Y(o.b1), P.X(o.xmax), P.Y(o.b1 + o.m1 * o.xmax), { c: C.main, w: 3 }) +
          Ln(P.X(0), P.Y(o.b2), P.X(o.xmax), P.Y(o.b2 + o.m2 * o.xmax), { c: C.hl, w: 3 }) +
          Ln(P.X(xi), P.Y(yi), P.X(xi), P.Y(0), { c: C.rose, dash: "4 3" }) + Dot(P.X(xi), P.Y(yi), { r: 7, c: C.rose, stroke: "#fff" }) +
          Tag(P.X(xi) + 12, P.Y(yi) + 34, o.say, { size: 13, anchor: "start" });
        const g = T(P.X(o.xmax * 0.55), P.Y(o.ymax * 0.55), "Where do the costs match?", { size: 13, anchor: "middle", fill: C.muted });
        return SVG(480, 304, o.label, s + giv(g) + ans(a));
      }
      main[28] = () => costs({ n1: "Company 1", e1: "cost = 18x + 12", n2: "Company 2", e2: "cost = 20x + 4", b1: 12, m1: 18, b2: 4, m2: 20, meet: [4, 84], xmax: 8, ymax: 180, ystep: 20, ylab: 40, xname: "shirts (x)", say: "4 shirts → $84 at both", label: "Cost of shirts at two companies" });
      main[36] = () => costs({ n1: "Book club 1", e1: "cost = 20 + 12x", n2: "Book club 2", e2: "cost = 35 + 9x", b1: 20, m1: 12, b2: 35, m2: 9, meet: [5, 80], xmax: 10, ymax: 140, ystep: 10, ylab: 20, xname: "books (x)", say: "5 books → $80 at both", label: "Cost of two book clubs" });
      main[44] = () => costs({ n1: "Provider 1", e1: "cost = 10 + 2x", n2: "Provider 2", e2: "cost = 8 + 3x", b1: 10, m1: 2, b2: 8, m2: 3, meet: [2, 14], xmax: 6, ymax: 30, ystep: 2, ylab: 6, xname: "movies (x)", say: "2 movies → $14 at both", label: "Cost of two movie providers" });

      // ---------- 29: tables, is y a function of x? ----------
      main[29] = () => {
        const tabs = { A: [[5, 4, 3, 2], [6, 6, 6, 6]], B: [[2, 3, 4, 4], [4, 3, 2, 1]], C: [[5, 5, 1, 1], [6, 0, 0, 6]], D: [[3, 3, 1, 7], [7, 6, 3, 1]] };
        return multi(Object.entries(tabs).map(([L, [xs, ys]]) => {
          const t = table(30, 28, [["x", "y"], ...xs.map((x, i) => [String(x), String(ys[i])])], { cw: [50, 50], rh: 26, fs: 14 });
          const rep = xs.filter((x, i) => xs.indexOf(x) !== i);
          let a = "";
          xs.forEach((x, i) => { if (rep.includes(x)) { const k = t.cell(i + 1, 0); a += Rect(k.x, k.y, 100, k.h, { fill: C.roseSoft, op: 0.55, c: C.rose, w: 2, rx: 0 }); } });
          a += rep.length ? Bad(80, 182, `x = ${rep[0]} repeats ✗`, { size: 12 }) : Good(80, 182, "no x repeats ✓", { size: 12 });
          return SVG(160, 198, "Table " + L, T(80, 18, "Table " + L, { size: 14, anchor: "middle" }) + t.s + ans(a));
        }));
      };

      // ---------- 30: tower and wire ----------
      main[30] = () => {
        const k = 1.3, gx = 100, gy = 236, ht = 140 * k, bw = 72 * k;
        let s = Ln(30, gy, 450, gy, { c: C.muted, w: 3 }) + Rect(gx - 12, gy - ht, 12, ht, { fill: C.main, c: C.main, rx: 0 }) +
          Ln(gx, gy - ht, gx + bw, gy, { c: C.hl, w: 4 }) + Rect(gx, gy - 14, 14, 14, { fill: "none", c: C.ink, rx: 0 }) +
          T(gx - 22, gy - ht / 2, "140 ft", { size: 14, anchor: "middle", rot: -90, fill: C.blue }) + T(gx + bw / 2, gy + 20, "72 ft", { size: 14, anchor: "middle", fill: C.blue });
        const g = Tag(gx + bw / 2 + 16, gy - ht / 2, "wire = ?", { size: 14, anchor: "start" });
        const a = Tag(gx + bw / 2 + 14, gy - ht / 2, "wire ≈ 157 ft", { size: 14, anchor: "start" }) +
          T(270, 80, "w² = 140² + 72²", { size: 15 }) + T(270, 106, "w² = 19,600 + 5,184", { size: 15 }) + T(270, 132, "w² = 24,784", { size: 15 }) + T(270, 158, "w ≈ 157.4 → 157 ft", { size: 15, fill: C.green });
        return SVG(480, 262, "Tower with a supporting wire", s + giv(g) + ans(a));
      };

      // ---------- 32: cone ----------
      main[32] = () => {
        const k = 13, cx = 140, by = 214, r = 5 * k, h = 12 * k;
        let s = `<ellipse cx="${cx}" cy="${by}" rx="${r}" ry="16" fill="${C.soft}" stroke="${C.ink}" stroke-width="2"/>` +
          Ln(cx - r, by, cx, by - h, { w: 2 }) + Ln(cx + r, by, cx, by - h, { w: 2 }) +
          Ln(cx, by, cx, by - h, { c: C.rose, w: 2, dash: "5 4" }) + Ln(cx, by, cx + r, by, { c: C.blue, w: 3 }) +
          Rect(cx, by - 12, 12, 12, { fill: "none", c: C.ink, rx: 0, w: 1.2 }) +
          T(cx + r / 2, by + 32, "r = 5 cm", { size: 14, anchor: "middle", fill: C.blue }) + T(cx + 8, by - h / 2, "h = 12 cm", { size: 14, fill: C.rose });
        const g = T(270, 110, "V = ⅓πr²h", { size: 16 }) + T(270, 140, "V = ?", { size: 18, fill: C.muted });
        const a = T(260, 80, "V = ⅓πr²h", { size: 16 }) + T(260, 108, "= ⅓ × π × 5² × 12", { size: 15, weight: 600 }) + T(260, 134, "= ⅓ × π × 300", { size: 15, weight: 600 }) +
          T(260, 160, "= 100π", { size: 15, weight: 600 }) + Tag(260, 192, "≈ 314 cm³", { size: 16, anchor: "start" });
        return SVG(480, 252, "Cone with radius 5 cm and height 12 cm", s + giv(g) + ans(a));
      };
      // ---------- 35: cylinder ----------
      main[35] = () => {
        const k = 22, cx = 130, rx = 2.5 * k, h = 7.5 * k, ty = 32, by = ty + h;
        let s = `<ellipse cx="${cx}" cy="${by}" rx="${rx}" ry="13" fill="${C.soft}" stroke="${C.ink}" stroke-width="2"/>` +
          Rect(cx - rx, ty, 2 * rx, h, { fill: C.soft, c: "none", rx: 0, w: 0 }) +
          Ln(cx - rx, ty, cx - rx, by, { w: 2 }) + Ln(cx + rx, ty, cx + rx, by, { w: 2 }) +
          `<ellipse cx="${cx}" cy="${ty}" rx="${rx}" ry="13" fill="#fff" stroke="${C.ink}" stroke-width="2"/>` +
          Ln(cx - rx, ty, cx + rx, ty, { c: C.blue, w: 3 }) + T(cx, ty - 20, "d = 5 cm", { size: 14, anchor: "middle", fill: C.blue }) +
          Ln(cx + rx + 14, ty, cx + rx + 14, by, { c: C.rose, w: 2 }) + T(cx + rx + 22, (ty + by) / 2, "h = 7.5 cm", { size: 14, fill: C.rose });
        const g = T(290, 110, "V = πr²h", { size: 16 }) + T(290, 140, "V = ?", { size: 18, fill: C.muted });
        const a = T(272, 66, "r = 5 ÷ 2 = 2.5 cm", { size: 15, fill: C.blue }) + T(272, 96, "V = πr²h", { size: 16 }) + T(272, 122, "= π × 2.5² × 7.5", { size: 15, weight: 600 }) +
          T(272, 148, "= 46.875π", { size: 15, weight: 600 }) + Tag(272, 180, "≈ 147 cm³", { size: 16, anchor: "start" });
        return SVG(480, 228, "Cylinder with diameter 5 cm and height 7.5 cm", s + giv(g) + ans(a));
      };

      // ---------- 37: line of best fit ----------
      main[37] = () => {
        const P = plane({ x0: 50, y0: 14, w: 360, h: 240, xmin: 0, xmax: 10, ymin: 0, ymax: 16, xstep: 1, xlab: 2, ystep: 2, ylab: 4 });
        const pts = [[0, 4.5], [1, 4.5], [2, 7], [3, 6], [4, 8.5], [5, 9], [6, 9.5], [7, 12], [8, 11.5], [9, 13.5], [10, 13.5]];
        const s = P.s + pts.map(([x, y]) => Dot(P.X(x), P.Y(y), { r: 5.5, c: C.main })).join("");
        const a = Ln(P.X(0), P.Y(4), P.X(10), P.Y(14), { c: C.hl, w: 3.5 }) + Dot(P.X(0), P.Y(4), { r: 7, c: C.rose, stroke: "#fff" }) +
          Tag(P.X(0.3), P.Y(1.5), "crosses the y-axis near 4", { size: 12, anchor: "start" }) +
          Tag(P.X(5.2), P.Y(3.5), "rise 10 ÷ run 10 = slope 1", { size: 12, anchor: "start" }) + Tag(P.X(6), P.Y(15.3), "y = x + 4", { size: 15 });
        return SVG(480, 286, "Scatterplot of data", s + ans(a));
      };

      // ---------- 39: ladder ----------
      main[39] = () => {
        const k = 13, wx = 120, gy = 226, hh = Math.sqrt(200) * k, bw = 5 * k;
        let s = Ln(40, gy, 450, gy, { c: C.muted, w: 3 }) + Ln(wx, gy, wx, 20, { c: C.main, w: 6 }) +
          Ln(wx, gy - hh, wx + bw, gy, { c: C.hl, w: 5 }) + Rect(wx, gy - 14, 14, 14, { fill: "none", c: C.ink, rx: 0 }) +
          T(wx + bw / 2 + 14, gy - hh / 2, "15 ft", { size: 14 }) + T(wx + bw / 2, gy + 20, "5 ft", { size: 14, anchor: "middle", fill: C.blue }) +
          T(wx - 12, 40, "wall", { size: 12, anchor: "end", fill: C.muted });
        const g = T(wx - 12, gy - hh / 2, "h = ?", { size: 15, anchor: "end", fill: C.muted });
        const a = T(wx - 12, gy - hh / 2, "h ≈ 14 ft", { size: 15, anchor: "end", fill: C.green }) +
          T(250, 80, "h² + 5² = 15²", { size: 15 }) + T(250, 106, "h² + 25 = 225", { size: 15 }) + T(250, 132, "h² = 200", { size: 15 }) + Tag(250, 164, "h = √200 ≈ 14.1 → 14 ft", { size: 14, anchor: "start" });
        return SVG(480, 250, "Ladder leaning on a wall", s + giv(g) + ans(a));
      };

      // ---------- 40: same y-intercept ----------
      main[40] = () => {
        const P = plane({ x0: 44, y0: 14, w: 270, h: 288, xmin: -4, xmax: 2, ymin: -10, ymax: 8, xstep: 1, ystep: 1, ylab: 2 });
        let s = P.s + fn(P, x => 5 * x - 3, -4, 2, { c: C.main, w: 3 }) + T(P.X(0.75) + 6, P.Y(6.5), "y = 5x − 3", { size: 13, fill: C.main });
        const B = [[-3, -9], [-2, -7], [-1, -5]];
        const a = Ln(P.X(-3), P.Y(-9), P.X(0), P.Y(-3), { c: C.hl, w: 3, dash: "7 4" }) + B.map(([x, y]) => Dot(P.X(x), P.Y(y), { r: 5.5, c: C.goldText })).join("") +
          Dot(P.X(0), P.Y(-3), { r: 7, c: C.rose, stroke: "#fff" }) +
          T(330, 110, "Table B: slope 2", { size: 14 }) + T(330, 134, "(−1, −5) → (0, −3)", { size: 14 }) + Tag(330, 170, "y-intercept −3 ✓", { size: 14, anchor: "start" });
        const g = T(330, 130, "Which table also", { size: 14, fill: C.muted }) + T(330, 150, "crosses here?", { size: 14, fill: C.muted });
        return SVG(480, 330, "Graph of y = 5x − 3", s + giv(g) + ans(a));
      };

      // ---------- 41: angle z ----------
      main[41] = () => {
        const A = [80, 220], B = [340, 220], AC = 260 * Math.sin(75 * Math.PI / 180) / Math.sin(69 * Math.PI / 180);
        const Cp = [A[0] + AC * Math.cos(36 * Math.PI / 180), A[1] - AC * Math.sin(36 * Math.PI / 180)];
        const ext = pol(A[0], A[1], 70, 216);
        let s = Poly([A, B, Cp], { fill: C.soft, c: C.ink, w: 2.5 }) + Ln(A[0], A[1], 18, A[1], { w: 2.5 }) + Ln(A[0], A[1], ext[0], ext[1], { w: 2.5 }) + Ln(B[0], B[1], 456, B[1], { w: 2.5 });
        s += T(A[0] + 2, A[1] - 10, "A", { size: 15 }) + T(B[0] - 4, B[1] + 22, "B", { size: 15 }) + T(Cp[0], Cp[1] - 10, "C", { size: 15, anchor: "middle" });
        s += Arc(A[0], A[1], 30, 180, 216, { c: C.blue, w: 2.5 }) + T(...pol(A[0], A[1], 50, 196), "36°", { size: 14, anchor: "middle", fill: C.blue });
        s += Arc(B[0], B[1], 26, 0, 105, { c: C.blue, w: 2.5 }) + T(...pol(B[0], B[1], 46, 52), "105°", { size: 14, anchor: "middle", fill: C.blue });
        s += Arc(Cp[0], Cp[1], 30, 216, 285, { c: C.rose, w: 2.5 }) + T(...pol(Cp[0], Cp[1], 46, 250), "z", { size: 16, anchor: "middle", fill: C.rose });
        const a = Arc(A[0], A[1], 38, 0, 36, { c: C.hl, w: 3 }) + T(...pol(A[0], A[1], 60, 16), "36°", { size: 13, anchor: "middle", fill: C.goldText }) +
          Arc(B[0], B[1], 34, 105, 180, { c: C.hl, w: 3 }) + T(...pol(B[0], B[1], 56, 150), "75°", { size: 13, anchor: "middle", fill: C.goldText }) +
          Tag(240, 268, "z = 180° − 36° − 75° = 69°", { size: 15 });
        return SVG(480, 286, "Triangle ABC with angle measures", s + ans(a));
      };

      // ---------- 42: no solutions ----------
      main[42] = () => {
        let s = Rect(14, 10, 452, 50, { fill: C.soft, c: C.main, w: 2, rx: 8 }) + T(240, 42, "3x + 6(2x + 5) = k(3x + 4)", { size: 19, anchor: "middle" });
        const g = T(240, 96, "k = ?   (no solutions)", { size: 16, anchor: "middle", fill: C.muted });
        const P = plane({ x0: 330, y0: 76, w: 130, h: 150, xmin: -4, xmax: 1, ymin: -50, ymax: 50, xstep: 1, ystep: 10, labels: false, xname: "x", yname: "y" });
        const a = T(24, 94, "Left:  3x + 12x + 30 = 15x + 30", { size: 14, weight: 600 }) + T(24, 120, "Right: 3kx + 4k", { size: 14, weight: 600 }) +
          T(24, 146, "Match x-terms: 3k = 15 → k = 5", { size: 14, weight: 600 }) + T(24, 172, "15x + 30 = 15x + 20", { size: 14, weight: 600 }) +
          Bad(24, 202, "30 ≠ 20 → no solution", { size: 13, anchor: "start" }) + Tag(160, 236, "k = 5", { size: 16 }) +
          P.s + fn(P, x => 15 * x + 30, -4, 1, { c: C.main, w: 2.5 }) + fn(P, x => 15 * x + 20, -4, 1, { c: C.hl, w: 2.5 }) +
          T(395, 244, "parallel: never meet", { size: 11, anchor: "middle", fill: C.muted });
        return SVG(480, 254, "Equation with unknown k", s + giv(g) + ans(a));
      };

      // ---------- 43: reflect, then translate ----------
      main[43] = () => {
        const P = plane({ x0: 40, y0: 12, w: 392, h: 224, xmin: -6, xmax: 8, ymin: -6, ymax: 2 });
        const tri = [[-3, -4], [-1, -1], [-5, -1]], ref = tri.map(([x, y]) => [-x, y]), fin = ref.map(([x, y]) => [x + 2, y]);
        const sh = pts => pts.map(([x, y]) => [P.X(x), P.Y(y)]);
        let s = P.s + Poly(sh(tri), { fill: C.main, op: 0.3, c: C.main, w: 2.5 }) + ["P", "Q", "R"].map((n, i) => vlabel(P, tri, i, n)).join("");
        const a = Poly(sh(ref), { c: C.blue, w: 2, dash: "6 4" }) + Poly(sh(fin), { fill: C.hl, op: 0.35, c: C.ink, w: 2.5 }) +
          ["P′", "Q′", "R′"].map((n, i) => vlabel(P, fin, i, n)).join("") + Arrow(P.X(-3), P.Y(-4), P.X(3) - 6, P.Y(-4), { c: C.blue, w: 1.8 }) +
          Arrow(P.X(3), P.Y(-4) + 14, P.X(5), P.Y(-4) + 14, { c: C.rose, w: 1.8 }) + Tag(P.X(5) + 10, P.Y(-5.3), "P′ = (5, −4)", { size: 13, anchor: "start" }) +
          T(P.X(-2.5), P.Y(-5.4), "flip: (x, y) → (−x, y)", { size: 12, fill: C.blue }) ;
        return SVG(480, 270, "Triangle PQR on a coordinate plane", s + ans(a));
      };

      // ---------- 45: slope through two points ----------
      main[45] = () => {
        const P = plane({ x0: 40, y0: 14, w: 270, h: 240, xmin: 0, xmax: 9, ymin: 0, ymax: 8 });
        let s = P.s + Ln(P.X(3), P.Y(1), P.X(8), P.Y(7), { c: C.main, w: 3 }) + Dot(P.X(3), P.Y(1), { r: 6, c: C.main }) + Dot(P.X(8), P.Y(7), { r: 6, c: C.main }) +
          T(P.X(3) + 10, P.Y(1) + 4, "(3, 1)", { size: 13 }) + T(P.X(8) - 10, P.Y(7) - 4, "(8, 7)", { size: 13, anchor: "end" });
        const g = T(325, 140, "slope = ?", { size: 16, fill: C.muted });
        const a = Ln(P.X(3), P.Y(1), P.X(8), P.Y(1), { c: C.blue, w: 3 }) + Ln(P.X(8), P.Y(1), P.X(8), P.Y(7), { c: C.rose, w: 3 }) +
          T(P.X(5.5), P.Y(1) + 18, "run = 5", { size: 13, anchor: "middle", fill: C.blue }) + T(P.X(8) + 8, P.Y(4), "rise = 6", { size: 13, fill: C.rose }) +
          T(325, 120, "(7 − 1) ÷ (8 − 3)", { size: 14 }) + Tag(325, 152, "slope = 6/5", { size: 16, anchor: "start" });
        return SVG(480, 284, "Line through (3, 1) and (8, 7)", s + giv(g) + ans(a));
      };

      return {
        main: n => (main[n] ? main[n]() : ""),
        choice: (n, L) => (choice[n] ? choice[n](L) : "")
      };
    }
    // ===== VISUALS END =====
