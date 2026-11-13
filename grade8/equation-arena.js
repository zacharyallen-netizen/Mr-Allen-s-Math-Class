/* Nov 13, 2026 (Zach): side by side — the work on the LEFT, the fight on the RIGHT (stacked on narrow screens, fight on top),
   and the fight is more violent in a CARTOON way: goo splats stick to the beast, teeth fly, X-eyes, a goo puddle when it falls,
   bandages and dizzy stars on the hero when he gets hit. No real blood: bright monster goo only.
   EQUATION ARENA (Nov 11, 2026, Mr. Allen: "make Equation Master less dry, sword-and-sorcery action").
   A battle strip for Equation Master. Every problem is a beast; every correct step is a sword strike; the last step
   is the finishing blow. A wrong step: the beast strikes and the hero blocks (the game still goes on, as before).
   It only WATCHES the game: it wraps loadProblem / handleChoice / showResults and never changes a question, a choice,
   the feedback text, the score or what is sent. The hero and the beasts are original drawings made here (inline SVG).
   Uses arcade-fx.js (AFX) for sparks, shake and sounds when it is loaded. Reduced motion: no lunges or shakes. */
(function () {
  "use strict";
  if (typeof window.handleChoice !== 'function' || typeof window.loadProblem !== 'function') return;
  var RM = false; try { RM = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var NS = 'http://www.w3.org/2000/svg';
  function fx(fn) { try { if (window.AFX) fn(window.AFX); } catch (e) {} }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  var css = document.createElement('style');
  css.textContent =
    '.em-split{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,1fr);gap:20px;align-items:start;max-width:1400px;margin:0 auto}' +
    '.em-work{min-width:0}.em-fight{position:sticky;top:12px;min-width:0}' +
    '@media (max-width:880px){.em-split{grid-template-columns:1fr;gap:10px}.em-fight{order:-1;top:0;z-index:5}.em-fight .arena svg{max-height:190px}}' +
    '.arena{position:relative;margin:0 0 16px;border-radius:12px;border:3px solid #FFC107;overflow:hidden;background:linear-gradient(180deg,#1b1436 0%,#3b1d3f 46%,#7a3524 78%,#2a160f 100%)}' +
    '.arena svg{display:block;width:100%;height:auto;max-height:420px}' +
    '.arena .tag{position:absolute;left:12px;top:8px;font:700 12px Inter,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#FFD86B;text-shadow:0 1px 2px #000}' +
    '.arena .foe{position:absolute;right:12px;top:8px;text-align:right;font:700 13px Inter,system-ui,sans-serif;color:#fff;text-shadow:0 1px 2px #000}' +
    '.arena .hp{display:flex;gap:4px;justify-content:flex-end;margin-top:4px}.arena .hp i{width:18px;height:9px;border-radius:3px;background:#e23b3b;border:1px solid rgba(0,0,0,.5);transition:background .3s,transform .3s}.arena .hp i.gone{background:rgba(255,255,255,.14);transform:scaleY(.6)}' +
    '.arena .shout{position:absolute;left:50%;top:38%;transform:translate(-50%,-50%);font:900 clamp(22px,5vw,40px) "Arvo",Georgia,serif;color:#FFC107;text-shadow:0 2px 0 #5a1a00,0 0 18px rgba(255,150,40,.8);letter-spacing:.04em;pointer-events:none;opacity:0;white-space:nowrap}' +
    '.arena .rage{position:absolute;left:12px;bottom:8px;font:800 13px Inter,system-ui,sans-serif;color:#ffb347;text-shadow:0 1px 2px #000;opacity:0;transition:opacity .3s}.arena .rage.on{opacity:1}' +
    '.arena .snd{position:absolute;right:10px;bottom:8px}.arena .snd button{font:600 12px Inter,system-ui,sans-serif!important;padding:5px 10px!important;min-height:30px!important;background:rgba(255,255,255,.9)!important}' +
    '@media print{.arena{display:none}}';
  document.head.appendChild(css);

  var HERO =
    '<g id="ar-hero" transform="translate(150,150)">' +
      '<ellipse cx="0" cy="2" rx="46" ry="7" fill="rgba(0,0,0,.35)"/>' +
      '<path d="M-20,-78 C-52,-60 -56,-20 -40,-2 L-14,-8 Z" fill="#7a1d24" stroke="#3d0b10" stroke-width="2"/>' +                      /* cape */
      '<path d="M-14,-34 L-22,-2 L-8,-2 L-2,-30 Z M4,-30 L8,-2 L22,-2 L14,-34 Z" fill="#4a3324" stroke="#22150d" stroke-width="2"/>' +   /* legs */
      '<path d="M-26,-4 L-6,-4 L-6,2 L-28,2 Z M6,-4 L26,-4 L28,2 L6,2 Z" fill="#2b1c12"/>' +                                        /* boots */
      '<path d="M-20,-80 L20,-80 L16,-32 L-16,-32 Z" fill="#8a6a3c" stroke="#3b2a14" stroke-width="2.5"/>' +                          /* tunic */
      '<path d="M-17,-48 L17,-48 L16,-40 L-16,-40 Z" fill="#3b2a14"/><rect x="-5" y="-50" width="10" height="12" rx="2" fill="#FFC107" stroke="#7a5a00" stroke-width="1.5"/>' +  /* belt */
      '<path d="M-28,-84 Q-16,-92 -4,-82 L-10,-70 Q-20,-74 -26,-70 Z" fill="#9aa3b5" stroke="#4a5266" stroke-width="2"/>' +            /* pauldron */
      '<circle cx="0" cy="-96" r="14" fill="#d9a877" stroke="#5a3a1c" stroke-width="2.5"/>' +                                          /* head */
      '<path d="M-15,-98 Q-14,-116 0,-116 Q14,-116 15,-98 L10,-100 L8,-90 L5,-100 L-5,-100 L-8,-90 L-10,-100 Z" fill="#b8c0d0" stroke="#4a5266" stroke-width="2.2"/>' +  /* helmet */
      '<path d="M-2,-116 Q10,-134 26,-124 Q12,-124 4,-112 Z" fill="#e0452f" stroke="#7a1d10" stroke-width="1.6"/>' +                   /* plume */
      '<path d="M4,-93 l7,0" stroke="#3b1c0a" stroke-width="2.4" stroke-linecap="round"/>' +                                           /* eye */
      '<g id="ar-shield" transform="translate(-30,-56)"><circle r="20" fill="#2f5a8a" stroke="#c9a23a" stroke-width="4"/><circle r="6" fill="#FFC107" stroke="#7a5a00" stroke-width="1.5"/><path d="M-14,0 L14,0 M0,-14 L0,14" stroke="#c9a23a" stroke-width="2"/></g>' +
      '<g id="ar-arm" transform="translate(18,-74)"><g id="ar-sword" transform="rotate(-28)">' +
        '<path d="M0,0 L22,-6" stroke="#d9a877" stroke-width="9" stroke-linecap="round"/>' +
        '<g transform="translate(24,-7) rotate(-15)"><rect x="-3" y="-4" width="10" height="8" rx="2" fill="#5a3a1c"/><rect x="5" y="-12" width="5" height="24" rx="2" fill="#FFC107" stroke="#7a5a00" stroke-width="1.2"/>' +
        '<path id="ar-blade" d="M10,-6 L60,-4 L70,0 L60,4 L10,6 Z" fill="#e8eef7" stroke="#5c6880" stroke-width="2"/><path d="M12,0 L62,0" stroke="#9aa6bd" stroke-width="1.5"/></g>' +
      '</g></g>' +
    '</g>';

  /* beasts: one body, different horns / eyes / colors, picked by the problem number */
  var KINDS = [
    { name: 'Ogre', c: '#5f9e3e', d: '#2f5a1c', horns: 0, eyes: 2, goo: '#c6ff3d' },
    { name: 'Cyclops', c: '#b0623c', d: '#5c2c14', horns: 1, eyes: 1, goo: '#8BEA3C' },
    { name: 'Hydra', c: '#3e8f9e', d: '#184a55', horns: 2, eyes: 3, goo: '#b46cff' },
    { name: 'Wraith', c: '#7d5fb0', d: '#3a2760', horns: 3, eyes: 2, goo: '#5ef0c8' },
    { name: 'Troll', c: '#8c8f3a', d: '#4a4c14', horns: 1, eyes: 2, goo: '#8BEA3C' },
    { name: 'Dragon', c: '#c0392b', d: '#6a140c', horns: 2, eyes: 2, goo: '#b46cff' }
  ];
  function beastSVG(k) {
    var h = '';
    if (k.horns === 1 || k.horns === 3) h += '<path d="M-8,-112 L0,-146 L8,-112 Z" fill="#efe6c8" stroke="#6b5f3a" stroke-width="2"/>';
    if (k.horns >= 2) h += '<path d="M-34,-98 Q-58,-120 -50,-146 Q-36,-124 -20,-108 Z M34,-98 Q58,-120 50,-146 Q36,-124 20,-108 Z" fill="#efe6c8" stroke="#6b5f3a" stroke-width="2"/>';
    var eyes = k.eyes === 1 ? '<circle cx="0" cy="-78" r="13" fill="#fff8d6" stroke="#222" stroke-width="2"/><circle id="ar-pupil" cx="-4" cy="-78" r="6" fill="#111"/>'
      : k.eyes === 3 ? '<circle cx="-20" cy="-80" r="8" fill="#fff8d6" stroke="#222" stroke-width="2"/><circle cx="0" cy="-90" r="8" fill="#fff8d6" stroke="#222" stroke-width="2"/><circle cx="20" cy="-80" r="8" fill="#fff8d6" stroke="#222" stroke-width="2"/><circle cx="-23" cy="-80" r="3.5" fill="#111"/><circle cx="-3" cy="-90" r="3.5" fill="#111"/><circle cx="17" cy="-80" r="3.5" fill="#111"/>'
      : '<circle cx="-16" cy="-80" r="10" fill="#fff8d6" stroke="#222" stroke-width="2"/><circle cx="16" cy="-80" r="10" fill="#fff8d6" stroke="#222" stroke-width="2"/><circle cx="-20" cy="-80" r="4.5" fill="#111"/><circle cx="12" cy="-80" r="4.5" fill="#111"/><path d="M-28,-94 L-6,-88 M28,-94 L6,-88" stroke="#222" stroke-width="3.5" stroke-linecap="round"/>';
    return '<g id="ar-beast" transform="translate(450,150)">' +
      '<ellipse cx="0" cy="2" rx="60" ry="8" fill="rgba(0,0,0,.35)"/>' + h +
      '<path d="M-44,0 Q-66,-52 -40,-96 Q0,-128 40,-96 Q66,-52 44,0 Z" fill="' + k.c + '" stroke="' + k.d + '" stroke-width="3.5"/>' +
      '<path d="M-52,-48 Q-84,-40 -78,-8 L-66,-14 Q-66,-30 -46,-34 Z M52,-48 Q84,-40 78,-8 L66,-14 Q66,-30 46,-34 Z" fill="' + k.c + '" stroke="' + k.d + '" stroke-width="3"/>' +   /* arms */
      '<path d="M-78,-8 l-7,9 m7,-9 l0,11 m0,-11 l7,8 M78,-8 l-7,9 m7,-9 l0,11 m0,-11 l7,8" stroke="#efe6c8" stroke-width="3" stroke-linecap="round"/>' +                         /* claws */
      '<path d="M-20,-34 Q0,-8 20,-34" fill="rgba(0,0,0,.18)"/>' + eyes +
      '<path d="M-26,-54 Q0,-34 26,-54 Q0,-44 -26,-54 Z" fill="#3a0d0d" stroke="#1a0505" stroke-width="2"/><path d="M-16,-51 l4,8 l4,-7 l4,8 l4,-8 l4,8 l4,-7 l4,7" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/>' +
      '</g>';
  }

  var box, svg, foeName, hpBox, shout, rage, hp = 0, hpMax = 0, kind = KINDS[0];
  function build() {
    if (box) return; var gs = document.getElementById('game-screen'), eq = document.getElementById('eq-panel'); if (!gs || !eq) return;
    box = document.createElement('div'); box.className = 'arena'; box.setAttribute('aria-hidden', 'true');
    box.innerHTML = '<span class="tag">The Arena</span><div class="foe"><span class="nm"></span><div class="hp"></div></div>' +
      '<svg viewBox="0 -70 600 240" preserveAspectRatio="xMidYMid meet"><rect x="0" y="-70" width="600" height="70" fill="#140f2a"/>' +
        '<path d="M0,112 L60,70 L110,98 L170,52 L240,100 L300,64 L370,104 L440,58 L520,96 L600,66 L600,170 L0,170 Z" fill="rgba(20,10,30,.55)"/>' +
        '<circle cx="318" cy="40" r="20" fill="#ffd9a0" opacity=".8"/>' +
        '<rect x="0" y="150" width="600" height="20" fill="#2a160f"/><path d="M0,150 L600,150" stroke="#8a5a3a" stroke-width="2"/>' +
        '<g id="ar-torch1" transform="translate(40,150)"><rect x="-3" y="-46" width="6" height="46" fill="#4a2c14"/><path class="fl" d="M0,-74 Q12,-58 0,-46 Q-12,-58 0,-74 Z" fill="#ffb347"/></g>' +
        '<g id="ar-torch2" transform="translate(560,150)"><rect x="-3" y="-46" width="6" height="46" fill="#4a2c14"/><path class="fl" d="M0,-74 Q12,-58 0,-46 Q-12,-58 0,-74 Z" fill="#ffb347"/></g>' +
        '<g id="ar-puddles"></g>' + HERO + '<g id="ar-foe"></g><path id="ar-slash" d="M380,40 Q470,70 520,150" fill="none" stroke="#fff" stroke-width="0" stroke-linecap="round"/>' +
      '</svg><div class="shout"></div><div class="rage">Berserker streak!</div><div class="snd"></div>';
    var split = document.createElement('div'); split.className = 'em-split';
    var work = document.createElement('div'); work.className = 'em-work';
    var fight = document.createElement('div'); fight.className = 'em-fight';
    gs.insertBefore(split, eq);
    ['eq-panel', 'feedback', 'choices-panel', 'next-wrap', 'next-prob-wrap'].forEach(function (id) { var n = document.getElementById(id); if (n) work.appendChild(n); });
    fight.appendChild(box); split.appendChild(work); split.appendChild(fight);
    svg = box.querySelector('svg'); foeName = box.querySelector('.nm'); hpBox = box.querySelector('.hp'); shout = box.querySelector('.shout'); rage = box.querySelector('.rage');
    fx(function (A) { box.querySelector('.snd').appendChild(A.soundButton()); });
    if (!RM) [].forEach.call(box.querySelectorAll('.fl'), function (f, i) { try { f.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(.86,1.16)' }, { transform: 'scale(1.08,.92)' }, { transform: 'scale(1,1)' }], { duration: 520 + i * 90, iterations: Infinity }); f.style.transformOrigin = '0px -46px'; f.style.transformBox = 'view-box'; } catch (e) {} });
  }
  function el(id) { return svg.querySelector('#' + id); }
  function at(node) { var r = node.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
  function say(t, color) { shout.textContent = t; shout.style.color = color || '#FFC107'; try { shout.animate([{ opacity: 0, transform: 'translate(-50%,-50%) scale(.5) rotate(-6deg)' }, { opacity: 1, transform: 'translate(-50%,-50%) scale(1.12) rotate(-3deg)', offset: .18 }, { opacity: 1, transform: 'translate(-50%,-50%) scale(1) rotate(-3deg)', offset: .7 }, { opacity: 0, transform: 'translate(-50%,-70%) scale(1) rotate(-3deg)' }], { duration: RM ? 900 : 1000 }); } catch (e) {} }
  function anim(node, frames, ms) { if (RM || !node || !node.animate) return; try { node.animate(frames, { duration: ms, easing: 'ease-out' }); } catch (e) {} }
  function svgEl(tag, attrs) { var n = document.createElementNS(NS, tag); for (var k in attrs) n.setAttribute(k, attrs[k]); return n; }
  function splat(x, y, r, color, parent) {        // a cartoon goo splat with drips
    var g = svgEl('g', { transform: 'translate(' + x + ',' + y + ')', 'class': 'goo' });
    g.appendChild(svgEl('circle', { r: r, fill: color, stroke: 'rgba(0,0,0,.35)', 'stroke-width': 1.5 }));
    for (var i = 0; i < 5; i++) { var a = Math.random() * 6.28, d = r * (0.8 + Math.random() * 0.6); g.appendChild(svgEl('circle', { cx: Math.cos(a) * d, cy: Math.sin(a) * d, r: r * (0.22 + Math.random() * 0.25), fill: color })); }
    var drip = svgEl('path', { d: 'M' + (-r * 0.3) + ',' + (r * 0.6) + ' q' + (r * 0.15) + ',' + (r * 1.2) + ' ' + (r * 0.3) + ',0', fill: color, stroke: color, 'stroke-width': r * 0.35, 'stroke-linecap': 'round' });
    g.appendChild(drip); g.appendChild(svgEl('circle', { cx: -r * 0.35, cy: -r * 0.35, r: r * 0.22, fill: 'rgba(255,255,255,.55)' }));
    parent.appendChild(g);
    anim(g, [{ transform: 'translate(' + x + 'px,' + y + 'px) scale(.2)' }, { transform: 'translate(' + x + 'px,' + y + 'px) scale(1.25)', offset: .5 }, { transform: 'translate(' + x + 'px,' + y + 'px) scale(1)' }], 260);
    return g;
  }
  function tooth(from) {                          // a tooth flies off (cartoon)
    if (RM) return; var t = svgEl('path', { d: 'M-4,-5 L4,-5 L3,5 L0,2 L-3,5 Z', fill: '#fffbe6', stroke: '#333', 'stroke-width': 1.2 });
    svg.appendChild(t); var x0 = from[0], y0 = from[1], dx = 60 + Math.random() * 80, up = 70 + Math.random() * 40;
    try { var a = t.animate([{ transform: 'translate(' + x0 + 'px,' + y0 + 'px) rotate(0deg)' }, { transform: 'translate(' + (x0 + dx * .5) + 'px,' + (y0 - up) + 'px) rotate(260deg)', offset: .45 }, { transform: 'translate(' + (x0 + dx) + 'px,148px) rotate(560deg)' }], { duration: 750, easing: 'ease-in', fill: 'forwards' }); a.onfinish = function () { setTimeout(function () { t.remove(); }, 900); }; } catch (e) { t.remove(); }
  }
  function pips() { hpBox.innerHTML = ''; for (var i = 0; i < hpMax; i++) { var p = document.createElement('i'); if (i >= hp) p.className = 'gone'; hpBox.appendChild(p); } }

  function newBeast(prob, idx) {
    build(); if (!box) return;
    kind = KINDS[idx % KINDS.length]; hpMax = hp = (prob.steps || []).length || 1;
    var t = String(prob.title || 'Equation').replace(/\s*\(.*\)$/, '').replace(/:.*$/, '');
    foeName.textContent = 'The ' + t + ' ' + kind.name; el('ar-foe').innerHTML = beastSVG(kind); pips();
    el('ar-puddles').innerHTML = ''; [].forEach.call(svg.querySelectorAll('.ouch'), function (n) { n.remove(); });
    anim(el('ar-beast'), [{ transform: 'translate(640px,150px)' }, { transform: 'translate(450px,150px)' }], 520);
    fx(function (A) { A.sfx.roar(); });
  }
  function strike(last) {
    if (!box) return; var hero = el('ar-hero'), sword = el('ar-sword'), beast = el('ar-beast'), slash = el('ar-slash');
    var berserk = (window.streak || 0) >= 3; rage.classList.toggle('on', berserk); rage.textContent = berserk ? 'Berserker streak ×' + window.streak + '!' : '';
    anim(hero, [{ transform: 'translate(150px,150px)' }, { transform: 'translate(300px,150px)', offset: .35 }, { transform: 'translate(300px,150px)', offset: .6 }, { transform: 'translate(150px,150px)' }], 620);
    anim(sword, [{ transform: 'rotate(-28deg)' }, { transform: 'rotate(-110deg)', offset: .22 }, { transform: 'rotate(55deg)', offset: .42 }, { transform: 'rotate(-28deg)' }], 620);
    fx(function (A) { A.sfx.whoosh(); });
    setTimeout(function () {
      if (!RM && slash.animate) slash.animate([{ strokeWidth: 0, opacity: 1 }, { strokeWidth: berserk ? 16 : 10, opacity: 1, offset: .3 }, { strokeWidth: 0, opacity: 0 }], { duration: 260 });
      hp = Math.max(0, hp - 1); pips();
      var p = beast ? at(beast) : at(box);
      fx(function (A) { A.sfx.clang(); A.sparks(p[0], p[1], { color: berserk ? '#ff7a3c' : '#FFC107', count: berserk ? 30 : 18, speed: 420 }); if (berserk) A.shake(box, 7, 260); });
      if (last) {
        say(pick(['K.O.!', 'BEAST SPLATTED!', 'GOO-BYE!', 'IT IS SOLVED!']), '#7CFC9A');
        if (beast) { var xe = svgEl('path', { d: 'M-26,-88 l14,14 m0,-14 l-14,14 M12,-88 l14,14 m0,-14 l-14,14', stroke: '#111', 'stroke-width': 5, 'stroke-linecap': 'round' }); beast.appendChild(xe); tooth([440, 100]); tooth([460, 96]); }
        var pd = el('ar-puddles'); if (pd) { var pu = svgEl('ellipse', { cx: 455, cy: 150, rx: 8, ry: 3, fill: kind.goo, opacity: .9 }); pd.appendChild(pu); anim(pu, [{ rx: 8 }, { rx: 78 }], 700); pu.setAttribute('rx', 78);
          for (var c = 0; c < 4; c++) splat(400 + c * 35, 140 + Math.random() * 8, 6 + Math.random() * 5, kind.goo, pd); }
        fx(function (A) { A.sparks(p[0], p[1], { color: kind.goo, count: 44, speed: 520 }); A.sparks(p[0], p[1], { color: kind.c, count: 22, speed: 420 }); });
        fx(function (A) { A.boom(p[0], p[1], { color: kind.c, color2: '#FFC107', size: 1.6 }); A.sfx.boom(1.1); A.sfx.power(); A.shake(box, 10, 420); });
        if (beast) { if (!RM && beast.animate) beast.animate([{ opacity: 1, transform: 'translate(450px,150px) scale(1)' }, { opacity: 0, transform: 'translate(470px,120px) scale(1.5) rotate(18deg)' }], { duration: 420, fill: 'forwards' }); else beast.style.opacity = '0'; }
        anim(sword, [{ transform: 'rotate(-28deg)' }, { transform: 'rotate(-95deg)' }, { transform: 'rotate(-95deg)' }, { transform: 'rotate(-28deg)' }], 1300);
      } else {
        say(pick(berserk ? ['MIGHTY BLOW!', 'GOO EVERYWHERE!', 'UNSTOPPABLE!', 'THAT HAD TO HURT!'] : ['SPLAT!', 'SLASH!', 'SPLURCH!', 'A CLEAN HIT!']));
        if (beast) { splat(-30 + Math.random() * 60, -100 + Math.random() * 70, berserk ? 13 : 9, kind.goo, beast); if (Math.random() < .6) tooth([450, 100]); }
        fx(function (A) { A.sparks(p[0], p[1], { color: kind.goo, count: berserk ? 26 : 16, speed: 360 }); });
        anim(beast, [{ transform: 'translate(450px,150px)' }, { transform: 'translate(478px,144px) rotate(8deg)', offset: .3 }, { transform: 'translate(450px,150px)' }], 360);
      }
    }, RM ? 0 : 250);
  }
  function struck() {
    if (!box) return; var beast = el('ar-beast'), shield = el('ar-shield'), hero = el('ar-hero'); rage.classList.remove('on');
    anim(beast, [{ transform: 'translate(450px,150px)' }, { transform: 'translate(250px,150px)', offset: .4 }, { transform: 'translate(450px,150px)' }], 560);
    anim(shield, [{ transform: 'translate(-30px,-56px) scale(1)' }, { transform: 'translate(6px,-60px) scale(1.5)', offset: .35 }, { transform: 'translate(6px,-60px) scale(1.5)', offset: .7 }, { transform: 'translate(-30px,-56px) scale(1)' }], 700);
    setTimeout(function () { say(pick(['BLOCKED!', 'THE BEAST STRIKES!', 'HOLD THE LINE!', 'SHIELD UP!']), '#ff8a7a');
      var p = at(hero); fx(function (A) { A.sfx.thud(); A.sfx.clang(); A.sparks(p[0] - 10, p[1] - 10, { color: '#9ec5ff', count: 14 }); A.shake(box, 8, 300); });
      anim(hero, [{ transform: 'translate(150px,150px)' }, { transform: 'translate(132px,150px)', offset: .3 }, { transform: 'translate(150px,150px)' }], 320);
      if (hero && !hero.querySelector('.ouch')) { var bd = svgEl('g', { 'class': 'ouch', transform: 'translate(-8,-104) rotate(-20)' }); bd.appendChild(svgEl('rect', { x: -9, y: -3, width: 18, height: 6, rx: 2, fill: '#f6e7c8', stroke: '#8a7350', 'stroke-width': 1 })); bd.appendChild(svgEl('rect', { x: -3, y: -9, width: 6, height: 18, rx: 2, fill: '#f6e7c8', stroke: '#8a7350', 'stroke-width': 1 })); hero.appendChild(bd); }
      if (hero && !RM) { var st = svgEl('g', { transform: 'translate(0,-126)' }); for (var k = 0; k < 3; k++) st.appendChild(svgEl('path', { d: 'M0,-5 L1.5,-1.5 L5,0 L1.5,1.5 L0,5 L-1.5,1.5 L-5,0 L-1.5,-1.5 Z', fill: '#FFD86B', transform: 'translate(' + (Math.cos(k * 2.1) * 16) + ',' + (Math.sin(k * 2.1) * 5) + ')' })); hero.appendChild(st);
        try { st.animate([{ transform: 'translate(0px,-126px) rotate(0deg)' }, { transform: 'translate(0px,-126px) rotate(360deg)' }], { duration: 500, iterations: 2 }).onfinish = function () { st.remove(); }; } catch (e) { st.remove(); } }
    }, RM ? 0 : 220);
    /* the step is still shown after a miss (as before), so the beast still loses that point: a plain hit, no glory */
    setTimeout(function () { hp = Math.max(0, hp - 1); pips(); if (hp === 0 && beast) { beast.style.opacity = '.25'; say('It falls… barely.', '#d6d6d6'); } }, 950);
  }

  var _load = window.loadProblem, _choice = window.handleChoice, _results = window.showResults;
  window.loadProblem = function () { var r = _load.apply(this, arguments); try { newBeast(window.problems[window.probIdx], window.probIdx); } catch (e) {} return r; };
  window.handleChoice = function (btn, isCorrect, step) {
    var last = false; try { last = window.stepIdx >= window.problems[window.probIdx].steps.length - 1; } catch (e) {}
    var r = _choice.apply(this, arguments);
    try { if (isCorrect) strike(last); else struck(); } catch (e) {}
    return r;
  };
  if (typeof _results === 'function') window.showResults = function () { var r = _results.apply(this, arguments);
    try { fx(function (A) { A.sfx.win(); A.confetti(innerWidth / 2, innerHeight * .3, { count: 110, colors: ['#FFC107', '#e0452f', '#2f5a8a', '#7CFC9A', '#ffffff'] }); }); } catch (e) {} return r; };
})();
