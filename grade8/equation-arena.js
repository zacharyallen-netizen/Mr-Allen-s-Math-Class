/* Nov 13, 2026, afternoon (Zach: "monsters more evil looking and aggressive... block with a space bar... roar, grunt, and cry
   when dispatched... deaths a little more gruesome and gory with a quick slow motion playback... upgrade weapons... more
   menacing and do more harm... dramatic music"). Added here, all LOOKS and SOUNDS only (questions, feedback, score and
   what is sent never change):
   - evil beasts (glowing slit eyes, jagged maws, drool, spikes, scars) with menacing names;
   - ATTACKS: every few seconds the beast winds up ("!" + growl); Space (or the Block button) in time = BLOCKED; too late =
     the hero gets clawed and loses health. A wrong step is a heavy hit. At 0 health the hero is knocked down and gets up.
     Attacks never touch the score; they pause between problems. Space never presses an answer button.
   - SOUNDS: roar on entry, grunts when hit, a dying wail; DEATH in slow motion: letterbox, the beast is cut in two,
     goo sprays, eyeballs pop, then the K.O.;
   - WEAPONS: 6 weapons unlocked by beasts defeated (saved on this device, localStorage em-kos / em-weapon): Rusty Sword,
     Battle Axe, Flame Blade, Frost Hammer, Thunder Spear, Shadow Scythe; each has its own look and hit effect;
   - MUSIC: original dramatic loop (Web Audio: war drums, low drone, minor-key strings, choir pad); Music: on/off.
   Nov 13, 2026, later (Zach: "change the style to imitate Mortal Kombat"): the arena now LOOKS like a classic 2-D arcade
   fighting game (a genre look only: two health bars with names, ROUND n / FIGHT!, hit sparks with a freeze, an "n HIT COMBO"
   counter, a K.O. and PERFECT! for a problem with no wrong step, a dark stone temple with braziers and a red moon).
   Nothing from that series is used: no names, characters, ninjas, logos or its catchphrases. Same hero and beasts.
   Nov 13, 2026 (Zach): side by side — the work on the LEFT, the fight on the RIGHT (stacked on narrow screens, fight on top),
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
    '.arena{position:relative;margin:0 0 16px;border-radius:6px;border:3px solid #3a2a1a;box-shadow:0 0 0 2px #000,0 10px 30px rgba(0,0,0,.45);overflow:hidden;background:#0c0806}' +
    '.arena .bars{position:absolute;left:10px;right:10px;top:8px;display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:start;z-index:2;pointer-events:none}' +
    '.arena .bar{height:16px;border:2px solid #e8d9a8;background:#5a0b0b;box-shadow:0 0 0 2px #000;position:relative;overflow:hidden}' +
    '.arena .bar b{position:absolute;top:0;bottom:0;background:linear-gradient(180deg,#ffe36b,#e0a800 55%,#b57a00);transition:width .35s ease-out}' +
    '.arena .bar.l b{left:0}.arena .bar.r b{right:0}.arena .bar b.low{background:linear-gradient(180deg,#ff8a5b,#d6331f)}' +
    '.arena .nm2{font:900 12px Inter,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#fff;text-shadow:2px 2px 0 #000;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.arena .r .nm2,.arena .rt{text-align:right}' +
    '.arena .rnd{min-width:44px;text-align:center;font:900 20px "JetBrains Mono",monospace;color:#ffe36b;text-shadow:2px 2px 0 #000;border:2px solid #e8d9a8;background:#1a0e08;box-shadow:0 0 0 2px #000;padding:1px 6px;line-height:1.1}' +
    '.arena .rnd small{display:block;font:800 8px Inter,sans-serif;letter-spacing:.14em;color:#e8d9a8}' +
    '.arena .combo{position:absolute;left:12px;top:30%;font:900 clamp(16px,3vw,26px) Impact,"Arial Black",sans-serif;font-style:italic;color:#ffe36b;text-shadow:3px 3px 0 #000,0 0 12px #ff6a00;opacity:0;pointer-events:none;letter-spacing:.03em}' +
    '.arena .combo span{display:block;font-size:.55em;color:#fff}' +
    '.arena .flashw{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none}' +
    '.arena svg{display:block;width:100%;height:auto;max-height:420px}' +
    '.arena .tag{position:absolute;left:12px;top:8px;font:700 12px Inter,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#FFD86B;text-shadow:0 1px 2px #000}' +
    '.arena .foe{position:absolute;right:12px;top:8px;text-align:right;font:700 13px Inter,system-ui,sans-serif;color:#fff;text-shadow:0 1px 2px #000}' +
    '.arena .hp{display:flex;gap:4px;justify-content:flex-end;margin-top:4px}.arena .hp i{width:18px;height:9px;border-radius:3px;background:#e23b3b;border:1px solid rgba(0,0,0,.5);transition:background .3s,transform .3s}.arena .hp i.gone{background:rgba(255,255,255,.14);transform:scaleY(.6)}' +
    '.arena .shout{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);font:900 clamp(26px,6.5vw,58px) Impact,"Arial Black",sans-serif;font-style:italic;color:#ffe36b;-webkit-text-stroke:2px #3a0000;text-shadow:4px 4px 0 #000,0 0 22px rgba(255,90,0,.85);letter-spacing:.04em;pointer-events:none;opacity:0;white-space:nowrap;z-index:3}' +
    '.arena .rage{position:absolute;left:12px;bottom:8px;font:800 13px Inter,system-ui,sans-serif;color:#ffb347;text-shadow:0 1px 2px #000;opacity:0;transition:opacity .3s}.arena .rage.on{opacity:1}' +
    '.arena .snd{position:absolute;right:10px;bottom:8px}.arena .snd button{font:600 12px Inter,system-ui,sans-serif!important;padding:5px 10px!important;min-height:30px!important;background:rgba(255,255,255,.9)!important}' +
    '.arena .ctl{position:absolute;left:0;right:0;bottom:6px;display:flex;justify-content:center;gap:8px;z-index:4;pointer-events:none}' +
    '.arena .blk{pointer-events:auto;font:900 13px Inter,system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#fff;background:#3a3f52;border:2px solid #9aa6bd;border-radius:6px;padding:5px 12px;box-shadow:0 0 0 2px #000;cursor:pointer;touch-action:manipulation}' +
    '.arena .blk.warn{background:#c0151b;border-color:#ffe36b;animation:arBlink .18s steps(2) infinite}' +
    '@keyframes arBlink{50%{transform:scale(1.08)}}' +
    '.arena .warnx{position:absolute;left:50%;top:22%;transform:translateX(-50%);font:900 clamp(14px,2.6vw,20px) Impact,"Arial Black",sans-serif;color:#fff;background:#c0151b;padding:3px 10px;border:2px solid #ffe36b;box-shadow:0 0 0 2px #000;opacity:0;pointer-events:none;z-index:3;white-space:nowrap}' +
    '.arena .warnx.on{opacity:1}' +
    '.arena .hurt{position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 60px 20px rgba(200,0,0,.0);transition:box-shadow .5s}' +
    '.arena .hurt.on{box-shadow:inset 0 0 70px 26px rgba(200,0,0,.7);transition:none}' +
    '.arena .lb{position:absolute;left:0;right:0;height:0;background:#000;z-index:3;transition:height .25s;pointer-events:none}.arena .lb.t{top:0}.arena .lb.b{bottom:0}' +
    '.arena.slow .lb{height:13%}.arena.slow svg{filter:saturate(.45) contrast(1.25) sepia(.25)}' +
    '.arena .slowtag{position:absolute;right:12px;bottom:15%;font:900 12px "JetBrains Mono",monospace;color:#ff5a2a;letter-spacing:.2em;opacity:0;z-index:4}.arena.slow .slowtag{opacity:1}' +
    '.em-armory{margin:-8px 0 14px;padding:8px 10px;background:#140b07;border:2px solid #3a2a1a;border-radius:6px;box-shadow:0 0 0 2px #000}' +
    '.em-armory .ah{display:flex;justify-content:space-between;align-items:center;gap:8px;font:800 11px Inter,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#e8d9a8;margin-bottom:6px}' +
    '.em-armory .ah button{font:700 11px Inter,system-ui,sans-serif;letter-spacing:.04em;text-transform:none;background:#2b1a10;color:#ffe36b;border:1px solid #6a4a2a;border-radius:5px;padding:3px 9px;cursor:pointer}' +
    '.em-armory .wl{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:6px}' +
    '.em-armory .w{display:flex;flex-direction:column;align-items:center;gap:2px;padding:5px 4px;border:2px solid #4a3220;border-radius:6px;background:#22140c;color:#fff;font:700 11px Inter,system-ui,sans-serif;cursor:pointer;line-height:1.15;text-align:center}' +
    '.em-armory .w svg{width:56px;height:22px}' +
    '.em-armory .w.on{border-color:#ffe36b;box-shadow:0 0 10px rgba(255,200,40,.6)}' +
    '.em-armory .w.lock{opacity:.45;cursor:not-allowed;filter:grayscale(1)}' +
    '.em-armory .w small{font-weight:600;color:#c9b88a;font-size:10px}' +
    '@media (max-width:880px){.em-armory{margin:-6px 0 8px;padding:5px 6px}.em-armory .ah{font-size:10px;margin-bottom:4px}.em-armory .ah span:last-child{display:none}.em-armory .wl{display:flex;overflow-x:auto;gap:5px}.em-armory .w{flex:0 0 auto;flex-direction:row;padding:3px 7px;font-size:10px;gap:4px}.em-armory .w svg{display:none}.em-armory .w small{display:none}}' +
    '@media print{.arena,.em-armory{display:none}}';
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
        '<g id="ar-wpn" transform="translate(24,-7) rotate(-15)"></g>' +
      '</g></g>' +
    '</g>';

  /* beasts: original evil monsters, picked by the problem number */
  var KINDS = [
    { name: 'Gutripper Ogre', c: '#3f6b2a', d: '#16290c', horns: 0, eyes: 2, goo: '#c6ff3d', eye: '#ffea00' },
    { name: 'Bonecrusher Cyclops', c: '#7a3a22', d: '#2c1006', horns: 1, eyes: 1, goo: '#8BEA3C', eye: '#ff3b1f' },
    { name: 'Venomfang Hydra', c: '#1f5f6b', d: '#082429', horns: 2, eyes: 3, goo: '#b46cff', eye: '#7CFF3C' },
    { name: 'Shriekwraith', c: '#4b3477', d: '#1a0f33', horns: 3, eyes: 2, goo: '#5ef0c8', eye: '#ff2bd6' },
    { name: 'Skullgnaw Troll', c: '#5d5f22', d: '#202108', horns: 1, eyes: 2, goo: '#8BEA3C', eye: '#ff7a00' },
    { name: 'Ashmaw Dragon', c: '#8a1a12', d: '#2e0503', horns: 2, eyes: 2, goo: '#ffb000', eye: '#ffe14a' }
  ];
  function eyeSVG(x, y, r, k) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 1.9) + '" fill="' + k.eye + '" opacity=".28" class="eglow"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + k.eye + '" stroke="#000" stroke-width="2"/>' +
      '<ellipse cx="' + (x - r * .15) + '" cy="' + y + '" rx="' + (r * .2) + '" ry="' + (r * .8) + '" fill="#000"/>';
  }
  function beastSVG(k) {
    var h = '';
    if (k.horns === 1 || k.horns === 3) h += '<path d="M-6,-126 Q-2,-160 10,-176 Q8,-150 8,-124 Z" fill="#e8dcc0" stroke="#3a2f14" stroke-width="2"/>';
    if (k.horns >= 2) h += '<path d="M-34,-112 Q-70,-126 -64,-170 Q-50,-140 -22,-122 Z M34,-112 Q70,-126 64,-170 Q50,-140 22,-122 Z" fill="#e8dcc0" stroke="#3a2f14" stroke-width="2"/>' +
      '<path d="M-60,-150 l6,4 M-56,-138 l7,3 M60,-150 l-6,4 M56,-138 l-7,3" stroke="#3a2f14" stroke-width="1.5"/>';
    var eyes = k.eyes === 1 ? eyeSVG(0, -96, 15, k) + '<path d="M-24,-118 L0,-104 L24,-118" fill="none" stroke="#000" stroke-width="6" stroke-linecap="round"/>'
      : k.eyes === 3 ? eyeSVG(-22, -96, 8, k) + eyeSVG(0, -108, 8, k) + eyeSVG(22, -96, 8, k) + '<path d="M-34,-108 L-12,-100 M34,-108 L12,-100" stroke="#000" stroke-width="5" stroke-linecap="round"/>'
      : eyeSVG(-18, -98, 10, k) + eyeSVG(18, -98, 10, k) + '<path d="M-36,-116 L-8,-104 M36,-116 L8,-104" stroke="#000" stroke-width="6" stroke-linecap="round"/>';
    return '<g id="ar-beast" transform="translate(450,150)"><g class="bb">' +
      '<ellipse cx="0" cy="2" rx="66" ry="8" fill="rgba(0,0,0,.45)"/>' +
      '<ellipse cx="0" cy="-70" rx="92" ry="92" fill="url(#ar-aura)" class="aura"/>' + h +
      '<path d="M8,-128 L20,-158 L30,-126 Z M32,-118 L52,-144 L52,-108 Z M48,-98 L76,-114 L64,-84 Z M58,-70 L84,-76 L66,-54 Z" fill="#e8dcc0" stroke="#3a2f14" stroke-width="2"/>' +   /* back spikes */
      '<path d="M-52,0 Q-80,-40 -62,-92 Q-44,-134 0,-136 Q48,-134 64,-92 Q82,-40 54,0 Z" fill="' + k.c + '" stroke="' + k.d + '" stroke-width="4"/>' +
      '<path d="M-38,-8 Q-50,-44 -38,-70" fill="none" stroke="' + k.d + '" stroke-width="3" opacity=".6"/><path d="M30,-30 l14,-16 M34,-22 l14,-16 M38,-14 l14,-16" stroke="' + k.d + '" stroke-width="2.5" opacity=".8"/>' +   /* muscle + scar */
      '<path d="M-56,-58 Q-96,-56 -100,-14 L-86,-16 Q-84,-36 -56,-40 Z M56,-58 Q96,-56 100,-14 L86,-16 Q84,-36 56,-40 Z" fill="' + k.c + '" stroke="' + k.d + '" stroke-width="3.5"/>' +   /* arms */
      '<path d="M-100,-14 q-10,6 -14,22 q8,-8 14,-10 M-94,-14 q-4,10 -2,26 q4,-10 8,-14 M-88,-15 q2,10 8,22 q-1,-10 0,-16 M100,-14 q10,6 14,22 q-8,-8 -14,-10 M94,-14 q4,10 2,26 q-4,-10 -8,-14 M88,-15 q-2,10 -8,22 q1,-10 0,-16" fill="#f2ead2" stroke="#3a2f14" stroke-width="1.5"/>' +   /* claws */
      '<path d="M-114,8 l3,-4 M-96,12 l2,-4 M-80,7 l1,-3 M114,8 l-3,-4 M96,12 l-2,-4" stroke="#a0000a" stroke-width="3" stroke-linecap="round"/>' +   /* bloody tips */
      eyes +
      '<path d="M-36,-70 Q0,-20 36,-70 Q0,-56 -36,-70 Z" fill="#2a0006" stroke="#000" stroke-width="2.5"/>' +   /* maw */
      '<path d="M-24,-46 Q0,-30 22,-48 Q2,-40 -24,-46 Z" fill="#b3122e"/>' +   /* tongue */
      '<path d="M-33,-68 l5,12 l4,-10 l5,13 l4,-12 l5,14 l4,-13 l5,14 l4,-13 l5,12 l4,-10 l4,9" fill="#fffbe6" stroke="#222" stroke-width="1.2" stroke-linejoin="round"/>' +
      '<path d="M-22,-40 l4,-9 l4,8 l4,-10 l4,9 l4,-10 l4,9 l4,-8 l4,8" fill="#fffbe6" stroke="#222" stroke-width="1.2" stroke-linejoin="round"/>' +
      '<path class="drool" d="M-10,-38 q2,14 0,22 q-3,4 -4,0 q0,-10 1,-22 Z" fill="' + k.goo + '" opacity=".85"/>' +
      '</g></g>';
  }

  var box, svg, foeName, hpBox, shout, rage, hp = 0, hpMax = 0, kind = KINDS[0];
  function build() {
    if (box) return; var gs = document.getElementById('game-screen'), eq = document.getElementById('eq-panel'); if (!gs || !eq) return;
    box = document.createElement('div'); box.className = 'arena'; box.setAttribute('aria-hidden', 'true');
    box.innerHTML = '<div class="bars"><div class="l"><div class="bar l"><b id="ar-hb" style="width:100%"></b></div><div class="nm2">Hero</div></div>' +
      '<div class="rnd"><small>ROUND</small><span id="ar-rn">1</span></div>' +
      '<div class="r"><div class="bar r"><b id="ar-bb" style="width:100%"></b></div><div class="nm2 nm"></div></div></div><div class="hp" style="display:none"></div>' +
      '<svg viewBox="0 -70 600 240" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="ar-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0405"/><stop offset=".6" stop-color="#4a0d08"/><stop offset="1" stop-color="#7a2a10"/></linearGradient>' +
        '<radialGradient id="ar-aura"><stop offset="0" stop-color="#ff1a1a" stop-opacity=".0"/><stop offset=".55" stop-color="#ff1a1a" stop-opacity=".0"/><stop offset=".8" stop-color="#ff1a1a" stop-opacity=".22"/><stop offset="1" stop-color="#ff1a1a" stop-opacity="0"/></radialGradient>' +
        '<clipPath id="ar-cut-a"><polygon points="-140,-220 140,-220 140,-96 -140,-58"/></clipPath><clipPath id="ar-cut-b"><polygon points="-140,-58 140,-96 140,30 -140,30"/></clipPath>' +
        '<radialGradient id="ar-moon"><stop offset="0" stop-color="#ffb08a"/><stop offset=".7" stop-color="#d0391f"/><stop offset="1" stop-color="#d0391f" stop-opacity="0"/></radialGradient></defs>' +
        '<rect x="0" y="-70" width="600" height="240" fill="url(#ar-sky)"/><circle cx="300" cy="-10" r="62" fill="url(#ar-moon)" opacity=".9"/>' +
        '<path d="M0,96 L40,60 L80,84 L130,40 L190,88 L250,58 L300,82 L360,44 L420,86 L480,54 L540,80 L600,50 L600,150 L0,150 Z" fill="#200605"/>' +
        '<g fill="#2b1810" stroke="#120804" stroke-width="2"><rect x="70" y="-20" width="34" height="170"/><rect x="496" y="-20" width="34" height="170"/><rect x="60" y="-30" width="54" height="14"/><rect x="486" y="-30" width="54" height="14"/>' +
        '<path d="M180,40 L420,40 L440,26 L160,26 Z"/><rect x="200" y="40" width="16" height="110"/><rect x="384" y="40" width="16" height="110"/></g>' +
        '<g fill="#6a0f0f" stroke="#2a0404" stroke-width="1.5"><path d="M118,-12 h22 v70 l-11,-10 l-11,10 Z"/><path d="M460,-12 h22 v70 l-11,-10 l-11,10 Z"/></g>' +
        '<g fill="none" stroke="#e0a800" stroke-width="2"><circle cx="129" cy="14" r="6"/><path d="M465,8 l12,12 m0,-12 l-12,12"/></g>' +
        '<rect x="0" y="150" width="600" height="20" fill="#3a2418"/><path d="M0,150 L600,150" stroke="#a87a4a" stroke-width="2"/>' +
        '<path d="M0,160 L600,160 M60,150 L40,170 M160,150 L150,170 M260,150 L258,170 M360,150 L366,170 M460,150 L474,170 M560,150 L582,170" stroke="#1e120a" stroke-width="1.5"/>' +
        '<g id="ar-torch1" transform="translate(40,150)"><rect x="-3" y="-46" width="6" height="46" fill="#4a2c14"/><path class="fl" d="M0,-74 Q12,-58 0,-46 Q-12,-58 0,-74 Z" fill="#ffb347"/></g>' +
        '<g id="ar-torch2" transform="translate(560,150)"><rect x="-3" y="-46" width="6" height="46" fill="#4a2c14"/><path class="fl" d="M0,-74 Q12,-58 0,-46 Q-12,-58 0,-74 Z" fill="#ffb347"/></g>' +
        '<g id="ar-puddles"></g>' + HERO + '<g id="ar-foe"></g><path id="ar-slash" d="M380,40 Q470,70 520,150" fill="none" stroke="#fff" stroke-width="0" stroke-linecap="round"/>' +
      '</svg><div class="flashw"></div><div class="shout"></div><div class="combo"></div><div class="rage">Berserker streak!</div><div class="snd"></div>' +
      '<div class="hurt"></div><div class="lb t"></div><div class="lb b"></div><div class="slowtag">SLOW-MO</div><div class="warnx">INCOMING! PRESS SPACE</div>' +
      '<div class="ctl"><button class="blk" type="button" tabindex="-1">Block (Space)</button></div>';
    var split = document.createElement('div'); split.className = 'em-split';
    var work = document.createElement('div'); work.className = 'em-work';
    var fight = document.createElement('div'); fight.className = 'em-fight';
    gs.insertBefore(split, eq);
    ['eq-panel', 'feedback', 'choices-panel', 'next-wrap', 'next-prob-wrap'].forEach(function (id) { var n = document.getElementById(id); if (n) work.appendChild(n); });
    fight.appendChild(box); split.appendChild(work); split.appendChild(fight);
    armory(fight);
    var bb = box.querySelector('.blk'); bb.addEventListener('pointerdown', function (e) { e.preventDefault(); block(); });
    svg = box.querySelector('svg'); foeName = box.querySelector('.nm'); hpBox = box.querySelector('.hp'); shout = box.querySelector('.shout'); rage = box.querySelector('.rage');
    fx(function (A) { box.querySelector('.snd').appendChild(A.soundButton()); });
    var mb = document.createElement('button'); mb.type = 'button'; mb.tabIndex = -1; mb.className = 'mus';
    mb.style.cssText = 'font:600 12px Inter,system-ui,sans-serif;padding:5px 10px;min-height:30px;margin-left:6px;border-radius:6px;border:1px solid #888;background:rgba(255,255,255,.9);cursor:pointer';
    var musicOn = function () { try { return localStorage.getItem('em-music') !== 'off'; } catch (e) { return true; } };
    mb.textContent = 'Music: ' + (musicOn() ? 'on' : 'off');
    mb.onclick = function () { var on = !musicOn(); try { localStorage.setItem('em-music', on ? 'on' : 'off'); } catch (e) {} mb.textContent = 'Music: ' + (on ? 'on' : 'off'); if (on) MUS.start(); else MUS.stop(); };
    box.querySelector('.snd').appendChild(mb);
    if (!RM) [].forEach.call(box.querySelectorAll('.fl'), function (f, i) { try { f.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(.86,1.16)' }, { transform: 'scale(1.08,.92)' }, { transform: 'scale(1,1)' }], { duration: 520 + i * 90, iterations: Infinity }); f.style.transformOrigin = '0px -46px'; f.style.transformBox = 'view-box'; } catch (e) {} });
  }
  function el(id) { return svg.querySelector('#' + id) || (box && box.querySelector('#' + id)); }
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
  var heroHP = 100, wrongs = 0;
  function bars() { var bb = el('ar-bb'), hb = el('ar-hb'); if (!bb) return; var w = hpMax ? Math.round(100 * hp / hpMax) : 0;
    bb = box.querySelector('#ar-bb'); hb = box.querySelector('#ar-hb'); bb.style.width = w + '%'; bb.classList.toggle('low', w <= 34); hb.style.width = heroHP + '%'; hb.classList.toggle('low', heroHP <= 34); }
  function freeze() { if (RM) return; var f = box.querySelector('.flashw'); try { f.animate([{ opacity: .55 }, { opacity: 0 }], { duration: 120 }); } catch (e) {} }
  function combo(n) { var c = box.querySelector('.combo'); if (n < 2) return; c.innerHTML = n + ' HIT<span>COMBO</span>'; try { c.animate([{ opacity: 0, transform: 'translateX(-30px) skewX(-8deg)' }, { opacity: 1, transform: 'translateX(0) skewX(-8deg)', offset: .15 }, { opacity: 1, offset: .75 }, { opacity: 0 }], { duration: 1100 }); } catch (e) {} }
  function pips() { bars(); hpBox.innerHTML = ''; for (var i = 0; i < hpMax; i++) { var p = document.createElement('i'); if (i >= hp) p.className = 'gone'; hpBox.appendChild(p); } }

  function newBeast(prob, idx) {
    build(); if (!box) return;
    kind = KINDS[idx % KINDS.length]; hpMax = hp = (prob.steps || []).length || 1;
    var t = String(prob.title || 'Equation').replace(/\s*\(.*\)$/, '').replace(/:.*$/, '');
    foeName.textContent = kind.name; el('ar-foe').innerHTML = beastSVG(kind); heroHP = 100; wrongs = 0; pips();
    var rn = box.querySelector('#ar-rn'); if (rn) rn.textContent = idx + 1;
    say('ROUND ' + (idx + 1), '#ffe36b'); setTimeout(function () { say('FIGHT!', '#ff5a2a'); }, RM ? 0 : 900);
    el('ar-puddles').innerHTML = ''; [].forEach.call(svg.querySelectorAll('.ouch'), function (n) { n.remove(); });
    anim(el('ar-beast'), [{ transform: 'translate(640px,150px)' }, { transform: 'translate(450px,150px)' }], 520);
    var nb = el('ar-beast'); if (nb) nb.style.opacity = ''; beastAlive = true; drawWeapon();
    SND.roar(0.9 + Math.random() * 0.2); MUS.start();
    if (!RM) { var dr = svg.querySelector('#ar-beast .drool'); if (dr) try { dr.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(1.6)' }, { transform: 'scaleY(1)' }], { duration: 1400, iterations: Infinity }); dr.style.transformOrigin = '-8px -38px'; dr.style.transformBox = 'view-box'; } catch (e) {}
      [].forEach.call(svg.querySelectorAll('#ar-beast .eglow'), function (g) { try { g.animate([{ opacity: .15 }, { opacity: .5 }, { opacity: .15 }], { duration: 900, iterations: Infinity }); } catch (e) {} });
      var bbb = svg.querySelector('#ar-beast .bb'); if (bbb) try { bbb.animate([{ transform: 'translateY(0) scale(1,1)' }, { transform: 'translateY(2px) scale(1.03,.97)' }, { transform: 'translateY(0) scale(1,1)' }], { duration: 700, iterations: Infinity }); } catch (e) {} }
    planAttack(2600);
  }
  function strike(last) {
    if (!box) return; var hero = el('ar-hero'), sword = el('ar-sword'), beast = el('ar-beast'), slash = el('ar-slash');
    var berserk = (window.streak || 0) >= 3; rage.classList.toggle('on', berserk); rage.textContent = berserk ? 'Berserker streak ×' + window.streak + '!' : '';
    anim(hero, [{ transform: 'translate(150px,150px)' }, { transform: 'translate(300px,150px)', offset: .35 }, { transform: 'translate(300px,150px)', offset: .6 }, { transform: 'translate(150px,150px)' }], 620);
    anim(sword, [{ transform: 'rotate(-28deg)' }, { transform: 'rotate(-110deg)', offset: .22 }, { transform: 'rotate(55deg)', offset: .42 }, { transform: 'rotate(-28deg)' }], 620);
    fx(function (A) { A.sfx.whoosh(); });
    setTimeout(function () {
      if (!RM && slash.animate) slash.animate([{ strokeWidth: 0, opacity: 1 }, { strokeWidth: berserk ? 16 : 10, opacity: 1, offset: .3 }, { strokeWidth: 0, opacity: 0 }], { duration: 260 });
      hp = Math.max(0, hp - 1); pips(); freeze(); combo(window.streak || 0);
      var p = beast ? at(beast) : at(box);
      var W = curW();
      fx(function (A) { A.sfx.clang(); A.sparks(p[0], p[1], { color: berserk ? '#ff7a3c' : W.spark, count: berserk ? 30 : 18, speed: 420 }); if (berserk) A.shake(box, 7, 260); });
      weaponHit(W, beast);
      if (last) { gore(true); return; }
      if (false) {
        say('K.O.!', '#ff3b1f'); if (!wrongs) setTimeout(function () { say('PERFECT!', '#ffe36b'); }, RM ? 0 : 1100);
        if (!RM) try { svg.animate([{ filter: 'saturate(1)' }, { filter: 'saturate(0) brightness(1.4)', offset: .1 }, { filter: 'saturate(.3)', offset: .6 }, { filter: 'saturate(1)' }], { duration: 1400 }); } catch (e) {}
        if (beast) { var xe = svgEl('path', { d: 'M-26,-88 l14,14 m0,-14 l-14,14 M12,-88 l14,14 m0,-14 l-14,14', stroke: '#111', 'stroke-width': 5, 'stroke-linecap': 'round' }); beast.appendChild(xe); tooth([440, 100]); tooth([460, 96]); }
        var pd = el('ar-puddles'); if (pd) { var pu = svgEl('ellipse', { cx: 455, cy: 150, rx: 8, ry: 3, fill: kind.goo, opacity: .9 }); pd.appendChild(pu); anim(pu, [{ rx: 8 }, { rx: 78 }], 700); pu.setAttribute('rx', 78);
          for (var c = 0; c < 4; c++) splat(400 + c * 35, 140 + Math.random() * 8, 6 + Math.random() * 5, kind.goo, pd); }
        fx(function (A) { A.sparks(p[0], p[1], { color: kind.goo, count: 44, speed: 520 }); A.sparks(p[0], p[1], { color: kind.c, count: 22, speed: 420 }); });
        fx(function (A) { A.boom(p[0], p[1], { color: kind.c, color2: '#FFC107', size: 1.6 }); A.sfx.boom(1.1); A.sfx.power(); A.shake(box, 10, 420); });
        if (beast) { if (!RM && beast.animate) beast.animate([{ opacity: 1, transform: 'translate(450px,150px) scale(1)' }, { opacity: 0, transform: 'translate(470px,120px) scale(1.5) rotate(18deg)' }], { duration: 420, fill: 'forwards' }); else beast.style.opacity = '0'; }
        anim(sword, [{ transform: 'rotate(-28deg)' }, { transform: 'rotate(-95deg)' }, { transform: 'rotate(-95deg)' }, { transform: 'rotate(-28deg)' }], 1300);
      } else {
        say(pick(berserk ? ['BRUTAL!', 'UNSTOPPABLE!', 'GOO EVERYWHERE!', 'DEVASTATING!'] : W.words));
        SND.grunt(); cancelAttack(); planAttack(3200);
        if (beast) { splat(-30 + Math.random() * 60, -100 + Math.random() * 70, berserk ? 13 : 9, kind.goo, beast); if (Math.random() < .6) tooth([450, 100]); }
        fx(function (A) { A.sparks(p[0], p[1], { color: kind.goo, count: berserk ? 26 : 16, speed: 360 }); });
        anim(beast, [{ transform: 'translate(450px,150px)' }, { transform: 'translate(478px,144px) rotate(8deg)', offset: .3 }, { transform: 'translate(450px,150px)' }], 360);
      }
    }, RM ? 0 : 250);
  }
  function struck() {     /* a wrong step: the beast lands a HEAVY hit (no score change) */
    if (!box) return; var beast = el('ar-beast'), hero = el('ar-hero'); rage.classList.remove('on'); cancelAttack();
    wrongs++;
    if (beast && beastAlive) maul(HARM[lvl()].wrong, 'heavy');
    /* the step is still shown after a miss (as before), so the beast still loses that point */
    setTimeout(function () { hp = Math.max(0, hp - 1); pips(); if (hp === 0 && beastAlive) gore(false); else planAttack(3600); }, 1100);
  }

  /* ---------------- sounds (original Web Audio, follow the Sound on/off button) ---------------- */
  var SND = (function () {
    var ac = null, out = null;
    function ctx() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); out = ac.createGain(); out.gain.value = .55; out.connect(ac.destination); } catch (e) { ac = null; } } if (ac && ac.state === 'suspended') ac.resume(); return ac; }
    function muted() { return !!(window.AFX && AFX.muted); }
    function noise(sec) { var b = ac.createBuffer(1, Math.max(1, ac.sampleRate * sec), ac.sampleRate), d = b.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; var s = ac.createBufferSource(); s.buffer = b; return s; }
    function dist(k) { var w = ac.createWaveShaper(), c = new Float32Array(512); for (var i = 0; i < 512; i++) { var x = i / 256 - 1; c[i] = (1 + k) * x / (1 + k * Math.abs(x)); } w.curve = c; return w; }
    function env(g, t0, a, peak, dur) { g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + a); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); }
    function voice(f0, f1, dur, gain, type, formant, wob) {   /* a throaty animal voice: buzzy osc + distortion + formant filter + breath noise */
      if (muted() || !ctx()) return; var t0 = ac.currentTime + .01;
      var o = ac.createOscillator(); o.type = type || 'sawtooth'; o.frequency.setValueAtTime(f0, t0); o.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
      var o2 = ac.createOscillator(); o2.type = 'square'; o2.frequency.setValueAtTime(f0 * .5, t0); o2.frequency.exponentialRampToValueAtTime(f1 * .5, t0 + dur);
      if (wob) { var l = ac.createOscillator(), lg = ac.createGain(); l.frequency.value = wob; lg.gain.value = f0 * .08; l.connect(lg); lg.connect(o.frequency); l.start(t0); l.stop(t0 + dur + .1); }
      var bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 2.2; bp.frequency.setValueAtTime(formant || 700, t0); bp.frequency.linearRampToValueAtTime((formant || 700) * .6, t0 + dur);
      var lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400;
      var g = ac.createGain(); env(g, t0, .05, gain, dur); var d = dist(18);
      o.connect(d); o2.connect(d); d.connect(bp); bp.connect(lp); lp.connect(g); g.connect(out);
      var n = noise(dur), nb = ac.createBiquadFilter(), ng = ac.createGain(); nb.type = 'bandpass'; nb.frequency.value = (formant || 700) * 1.6; nb.Q.value = 1; env(ng, t0, .03, gain * .7, dur * .9);
      n.connect(nb); nb.connect(ng); ng.connect(out);
      o.start(t0); o2.start(t0); n.start(t0); o.stop(t0 + dur + .05); o2.stop(t0 + dur + .05);
    }
    return {
      roar: function (s) { s = s || 1; voice(150 * s, 62 * s, 1.25, .5, 'sawtooth', 620, 23); setTimeout(function () { voice(95 * s, 55 * s, .7, .35, 'sawtooth', 420, 31); }, 380); },
      growl: function () { voice(80, 70, .9, .3, 'sawtooth', 360, 38); },
      grunt: function () { voice(150 + Math.random() * 40, 85, .28, .5, 'sawtooth', 560, 0); },
      cry: function (slow) { var d = slow ? 2.4 : 1.4; voice(520, 110, d, .45, 'sawtooth', 1100, 7); setTimeout(function () { voice(300, 70, d * .7, .3, 'triangle', 800, 11); }, d * 350); },
      squish: function () { if (muted() || !ctx()) return; var t0 = ac.currentTime, n = noise(.35), f = ac.createBiquadFilter(), g = ac.createGain(); f.type = 'lowpass'; f.frequency.setValueAtTime(1800, t0); f.frequency.exponentialRampToValueAtTime(200, t0 + .3); env(g, t0, .01, .6, .35); n.connect(f); f.connect(g); g.connect(out); n.start(t0);
        var o = ac.createOscillator(), og = ac.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(240, t0); o.frequency.exponentialRampToValueAtTime(50, t0 + .25); env(og, t0, .01, .5, .28); o.connect(og); og.connect(out); o.start(t0); o.stop(t0 + .3); },
      slashZ: function () { if (muted() || !ctx()) return; var t0 = ac.currentTime, n = noise(.25), f = ac.createBiquadFilter(), g = ac.createGain(); f.type = 'highpass'; f.frequency.setValueAtTime(800, t0); f.frequency.exponentialRampToValueAtTime(5000, t0 + .2); env(g, t0, .01, .35, .22); n.connect(f); f.connect(g); g.connect(out); n.start(t0); },
      thunder: function () { if (muted() || !ctx()) return; var t0 = ac.currentTime, n = noise(1.2), f = ac.createBiquadFilter(), g = ac.createGain(); f.type = 'lowpass'; f.frequency.setValueAtTime(3000, t0); f.frequency.exponentialRampToValueAtTime(120, t0 + 1); env(g, t0, .005, .8, 1.2); n.connect(f); f.connect(g); g.connect(out); n.start(t0); },
      ctx: ctx
    };
  })();

  /* ---------------- dramatic music (original): war drums, drone, minor-key strings, choir ---------------- */
  var MUS = (function () {
    var ac = null, bus = null, timer = null, next = 0, step = 0, drone = [], BPM = 96, on = false, heat = 0;
    var NOTES = { D2: 73.42, A2: 110, D3: 146.83, Eb3: 155.56, F3: 174.61, G3: 196, A3: 220, Bb3: 233.08, C4: 261.63, D4: 293.66, Eb4: 311.13, F4: 349.23 };
    var RIFF = ['D3', 'D3', 'Eb3', 'D3', 'F3', 'D3', 'Eb3', 'C4', 'D3', 'D3', 'Eb3', 'D3', 'A3', 'G3', 'F3', 'Eb3'];
    var CH = [['D3', 'F3', 'A3'], ['Bb3', 'D4', 'F4'], ['G3', 'Bb3', 'D4'], ['A3', 'C4', 'Eb4']];
    function want() { try { return localStorage.getItem('em-music') !== 'off'; } catch (e) { return true; } }
    function muted() { return !!(window.AFX && AFX.muted); }
    function drum(t, big) { var o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(big ? 95 : 140, t); o.frequency.exponentialRampToValueAtTime(big ? 38 : 60, t + .35);
      g.gain.setValueAtTime(big ? .9 : .45, t); g.gain.exponentialRampToValueAtTime(.001, t + (big ? .6 : .3)); o.connect(g); g.connect(bus); o.start(t); o.stop(t + .7);
      var b = ac.createBuffer(1, ac.sampleRate * .08, ac.sampleRate), d = b.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      var n = ac.createBufferSource(), ng = ac.createGain(), f = ac.createBiquadFilter(); n.buffer = b; f.type = 'lowpass'; f.frequency.value = 900; ng.gain.value = big ? .35 : .2; n.connect(f); f.connect(ng); ng.connect(bus); n.start(t); }
    function pluck(t, f, len, vol) { var o = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain(), lp = ac.createBiquadFilter(); o.type = 'sawtooth'; o2.type = 'sawtooth'; o.frequency.value = f; o2.frequency.value = f * 1.006;
      lp.type = 'lowpass'; lp.frequency.setValueAtTime(2200 + heat * 1500, t); lp.frequency.exponentialRampToValueAtTime(400, t + len); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .015); g.gain.exponentialRampToValueAtTime(.0001, t + len);
      o.connect(lp); o2.connect(lp); lp.connect(g); g.connect(bus); o.start(t); o2.start(t); o.stop(t + len + .05); o2.stop(t + len + .05); }
    function choir(t, chord, len) { chord.forEach(function (nm) { [1, 1.004, .996].forEach(function (dt) { var o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter(); o.type = 'triangle'; o.frequency.value = NOTES[nm] * dt;
      f.type = 'bandpass'; f.frequency.value = 800; f.Q.value = .8; g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.05, t + len * .35); g.gain.linearRampToValueAtTime(.0001, t + len); o.connect(f); f.connect(g); g.connect(bus); o.start(t); o.stop(t + len + .1); }); }); }
    function tick() {
      var spb = 60 / BPM / 2;   /* eighth notes */
      while (next < ac.currentTime + .25) {
        var s = step % 32, bar = Math.floor(step / 8) % 4;
        if (s % 8 === 0) drum(next, true); if (s % 8 === 3 || s % 8 === 6) drum(next, false); if (heat > .5 && s % 2 === 1) drum(next, false);
        pluck(next, NOTES[RIFF[step % 16]], spb * .9, .07 + heat * .04);
        if (step % 8 === 0) choir(next, CH[bar], spb * 8);
        next += spb; step++;
      }
    }
    function start() {
      if (on || !want() || muted()) return; try { ac = SND.ctx(); } catch (e) {} if (!ac) return;
      on = true; bus = ac.createGain(); bus.gain.setValueAtTime(.0001, ac.currentTime); bus.gain.exponentialRampToValueAtTime(.22, ac.currentTime + 1.5);
      var lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200; bus.connect(lp); lp.connect(ac.destination);
      drone = [NOTES.D2, NOTES.D2 * 1.5, NOTES.A2 * 1.004].map(function (f) { var o = ac.createOscillator(), g = ac.createGain(), f2 = ac.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.value = f; f2.type = 'lowpass'; f2.frequency.value = 260; g.gain.value = .12; o.connect(f2); f2.connect(g); g.connect(bus); o.start(); return o; });
      next = ac.currentTime + .1; step = 0; timer = setInterval(tick, 90);
    }
    function stop() { if (!on) return; on = false; clearInterval(timer); try { var b = bus, t = ac.currentTime; b.gain.cancelScheduledValues(t); b.gain.setValueAtTime(b.gain.value, t); b.gain.exponentialRampToValueAtTime(.0001, t + .6); var dr = drone; setTimeout(function () { dr.forEach(function (o) { try { o.stop(); } catch (e) {} }); b.disconnect(); }, 800); } catch (e) {} }
    setInterval(function () { if (on && muted()) stop(); }, 500);
    return { start: start, stop: stop, heat: function (h) { heat = h; } };
  })();

  /* ---------------- weapons ---------------- */
  var WEAPONS = [
    { id: 'sword', name: 'Rusty Sword', need: 0, spark: '#FFC107', words: ['SLASH!', 'SPLAT!', 'SPLURCH!', 'GREAT HIT!'],
      svg: '<rect x="-3" y="-4" width="10" height="8" rx="2" fill="#5a3a1c"/><rect x="5" y="-12" width="5" height="24" rx="2" fill="#b8860b" stroke="#5a4000" stroke-width="1.2"/><path d="M10,-6 L60,-4 L70,0 L60,4 L10,6 Z" fill="#c9cfd8" stroke="#5c6880" stroke-width="2"/><path d="M22,-3 l6,3 M40,2 l5,-3" stroke="#8a5a2a" stroke-width="2"/>' },
    { id: 'axe', name: 'Battle Axe', need: 3, spark: '#ff9a3c', words: ['CHOP!', 'CLEAVE!', 'HACK!', 'SPLAT!'],
      svg: '<rect x="-3" y="-3" width="62" height="6" rx="2" fill="#6b4423" stroke="#2b1a0c" stroke-width="1.5"/><path d="M44,-4 Q52,-30 72,-24 Q64,-8 72,8 Q56,14 46,4 Z" fill="#aab3c2" stroke="#3a4252" stroke-width="2"/><path d="M60,-22 Q68,-8 64,6" fill="none" stroke="#fff" stroke-width="1.5" opacity=".7"/>' },
    { id: 'flame', name: 'Flame Blade', need: 8, spark: '#ff5a1f', words: ['SCORCHED!', 'SIZZLE!', 'TORCHED!', 'BURN!'],
      svg: '<rect x="-3" y="-4" width="10" height="8" rx="2" fill="#3a1a0c"/><rect x="5" y="-12" width="5" height="24" rx="2" fill="#c0392b" stroke="#5a0a00" stroke-width="1.2"/><path d="M10,-6 L62,-5 L74,0 L62,5 L10,6 Z" fill="#ff7a1f" stroke="#7a1a00" stroke-width="2"/><path class="wfl" d="M14,-6 Q24,-18 30,-7 Q38,-20 44,-6 Q54,-18 60,-5" fill="#ffd23c" opacity=".9"/>' },
    { id: 'frost', name: 'Frost Hammer', need: 14, spark: '#9ee8ff', words: ['SHATTER!', 'FROZEN!', 'CRUNCH!', 'SMASH!'],
      svg: '<rect x="-3" y="-3" width="58" height="6" rx="2" fill="#4a5a6a" stroke="#1a2430" stroke-width="1.5"/><rect x="50" y="-18" width="24" height="36" rx="4" fill="#bfefff" stroke="#2a7fa8" stroke-width="2.5"/><path d="M54,-12 l16,0 M54,0 l16,0 M54,12 l16,0" stroke="#5ec8f0" stroke-width="1.5"/>' },
    { id: 'thunder', name: 'Thunder Spear', need: 22, spark: '#fff36b', words: ['ZAP!', 'KRAKOOM!', 'THUNDERSTRUCK!', 'FRIED!'],
      svg: '<rect x="-3" y="-2.5" width="70" height="5" rx="2" fill="#2e3a5a" stroke="#101626" stroke-width="1.2"/><path d="M66,-8 L90,0 L66,8 L70,0 Z" fill="#fff36b" stroke="#8a7a00" stroke-width="1.5"/><path d="M20,-6 l6,4 l-5,2 l6,4" fill="none" stroke="#fff36b" stroke-width="2"/>' },
    { id: 'scythe', name: 'Shadow Scythe', need: 32, spark: '#c06bff', words: ['REAPED!', 'DOOMED!', 'SHADOW CUT!', 'GONE DARK!'],
      svg: '<rect x="-3" y="-2.5" width="72" height="5" rx="2" fill="#1a1024" stroke="#000" stroke-width="1.2"/><path d="M66,-2 Q60,-40 22,-44 Q52,-30 58,4 Z" fill="#2a1240" stroke="#c06bff" stroke-width="2.2"/><circle cx="66" cy="0" r="4" fill="#c06bff"/>' }
  ];
  function kos() { try { return +localStorage.getItem('em-kos') || 0; } catch (e) { return 0; } }
  function curW() { var id = 'sword'; try { id = localStorage.getItem('em-weapon') || 'sword'; } catch (e) {} var w = WEAPONS.filter(function (x) { return x.id === id && kos() >= x.need; })[0]; return w || WEAPONS[0]; }
  function drawWeapon() { var g = svg && svg.querySelector('#ar-wpn'); if (!g) return; var W = curW(); g.innerHTML = W.svg;
    if (!RM && W.id === 'flame') { var f = g.querySelector('.wfl'); try { f.animate([{ opacity: .5 }, { opacity: 1 }, { opacity: .6 }], { duration: 300, iterations: Infinity }); } catch (e) {} }
    var ar = document.querySelector('.em-armory'); if (ar) [].forEach.call(ar.querySelectorAll('.w'), function (b) { b.classList.toggle('on', b.dataset.id === W.id); }); }
  function armory(host) {
    var a = document.createElement('div'); a.className = 'em-armory';
    host.appendChild(a); paintArmory();
  }
  function paintArmory() {
    var a = document.querySelector('.em-armory'); if (!a) return; var k = kos(), W = curW();
    var nextW = WEAPONS.filter(function (w) { return w.need > k; })[0];
    a.innerHTML = '<div class="ah"><span>Armory · Beasts defeated: ' + k + '</span><span>' + (nextW ? 'Next: ' + nextW.name + ' at ' + nextW.need : 'All weapons unlocked') + '</span></div><div class="wl"></div>';
    var wl = a.querySelector('.wl');
    WEAPONS.forEach(function (w) {
      var b = document.createElement('button'); b.type = 'button'; b.tabIndex = -1; b.dataset.id = w.id; var locked = k < w.need;
      b.className = 'w' + (locked ? ' lock' : '') + (w.id === W.id ? ' on' : '');
      b.innerHTML = '<svg viewBox="-6 -46 100 60"><g transform="rotate(-12)">' + w.svg + '</g></svg>' + w.name + '<small>' + (locked ? 'Defeat ' + w.need : 'Ready') + '</small>';
      b.onclick = function () { if (locked) return; try { localStorage.setItem('em-weapon', w.id); } catch (e) {} drawWeapon(); fx(function (A) { A.sfx.clang(); }); };
      wl.appendChild(b);
    });
  }
  function addKO() {
    var before = kos(), after = before + 1; try { localStorage.setItem('em-kos', after); } catch (e) {}
    var got = WEAPONS.filter(function (w) { return w.need > before && w.need <= after; })[0];
    if (got) { try { localStorage.setItem('em-weapon', got.id); } catch (e) {} setTimeout(function () { say('NEW WEAPON: ' + got.name.toUpperCase() + '!', '#7CFC9A'); fx(function (A) { A.sfx.power(); }); drawWeapon(); }, RM ? 0 : 3300); }
    paintArmory();
  }
  function weaponHit(W, beast) {
    if (!beast) return; var p = at(beast);
    if (W.id === 'flame') { splat(-20 + Math.random() * 40, -90 + Math.random() * 50, 10, '#2a0a00', beast); fx(function (A) { A.sparks(p[0], p[1] - 20, { color: '#ffd23c', count: 22, speed: 300 }); }); }
    if (W.id === 'frost') { anim(beast.querySelector('.bb'), [{ filter: 'hue-rotate(0deg) brightness(1)' }, { filter: 'hue-rotate(160deg) brightness(1.6)', offset: .2 }, { filter: 'hue-rotate(0deg) brightness(1)' }], 700); fx(function (A) { A.sparks(p[0], p[1], { color: '#e6fbff', count: 26, speed: 380 }); }); }
    if (W.id === 'thunder') { var bolt = svgEl('path', { d: 'M450,-70 L438,-20 L458,-24 L440,30 L462,26 L446,90', fill: 'none', stroke: '#fff36b', 'stroke-width': 6, 'stroke-linejoin': 'bevel' }); svg.appendChild(bolt); SND.thunder(); freeze(); setTimeout(function () { bolt.remove(); }, RM ? 300 : 220); }
    if (W.id === 'scythe') fx(function (A) { A.sparks(p[0], p[1], { color: '#2a0040', count: 30, speed: 260 }); A.sparks(p[0], p[1], { color: '#c06bff', count: 16, speed: 420 }); });
    if (W.id === 'axe') fx(function (A) { A.shake(box, 6, 200); });
    SND.slashZ();
  }

  /* ---------------- beast attacks + Space to block ---------------- */
  var HARM = [ { wrong: 30, claw: 12, gap: [11000, 15000], wind: 1300 },   /* Apprentice */
               { wrong: 35, claw: 15, gap: [9000, 12500], wind: 1150 },    /* Journeyman */
               { wrong: 40, claw: 18, gap: [7000, 10500], wind: 1000 },    /* Master */
               { wrong: 40, claw: 18, gap: [7000, 10500], wind: 1000 } ];  /* Mixed */
  function lvl() { return Math.max(0, Math.min(3, window.selectedLevel || 0)); }
  var beastAlive = false, atkT = 0, hitT = 0, winding = false, blocked = false;
  function active() { var gs = document.getElementById('game-screen'); return !!(box && beastAlive && gs && gs.style.display !== 'none' && !document.hidden); }
  function cancelAttack() { clearTimeout(atkT); clearTimeout(hitT); winding = false; if (box) { box.querySelector('.warnx').classList.remove('on'); box.querySelector('.blk').classList.remove('warn'); } MUS.heat(0); }
  function planAttack(delay) { clearTimeout(atkT); var g = HARM[lvl()].gap; atkT = setTimeout(windUp, delay != null ? delay : g[0] + Math.random() * (g[1] - g[0])); }
  function windUp() {
    if (!active()) { planAttack(); return; }
    var beast = el('ar-beast'), H = HARM[lvl()]; winding = true; blocked = false; MUS.heat(1);
    box.querySelector('.warnx').classList.add('on'); box.querySelector('.blk').classList.add('warn');
    SND.growl();
    anim(beast, [{ transform: 'translate(450px,150px)' }, { transform: 'translate(480px,150px) scale(1.12)' }], H.wind);
    var bb = beast && beast.querySelector('.aura'); anim(bb, [{ opacity: .3 }, { opacity: 1, transform: 'scale(1.3)' }], H.wind);
    hitT = setTimeout(function () { attackLands(); }, H.wind);
  }
  function attackLands() {
    box.querySelector('.warnx').classList.remove('on'); box.querySelector('.blk').classList.remove('warn');
    winding = false; MUS.heat(0);
    if (!active()) { planAttack(); return; }
    if (blocked) { planAttack(); return; }
    maul(HARM[lvl()].claw, 'claw'); planAttack();
  }
  function block() {
    if (!box || !beastAlive) return;
    var shield = el('ar-shield'), hero = el('ar-hero');
    anim(shield, [{ transform: 'translate(-30px,-56px) scale(1)' }, { transform: 'translate(10px,-62px) scale(1.6)', offset: .25 }, { transform: 'translate(10px,-62px) scale(1.6)', offset: .75 }, { transform: 'translate(-30px,-56px) scale(1)' }], 520);
    if (!winding) return;           /* raising the shield early does nothing */
    blocked = true; clearTimeout(hitT); winding = false; MUS.heat(0);
    box.querySelector('.warnx').classList.remove('on'); box.querySelector('.blk').classList.remove('warn');
    var beast = el('ar-beast');
    anim(beast, [{ transform: 'translate(480px,150px) scale(1.12)' }, { transform: 'translate(260px,150px)', offset: .35 }, { transform: 'translate(300px,150px) rotate(-10deg)', offset: .5 }, { transform: 'translate(450px,150px)' }], 700);
    setTimeout(function () { var p = at(hero); say(pick(['BLOCKED!', 'DENIED!', 'NOT TODAY!', 'PARRY!']), '#9ec5ff'); fx(function (A) { A.sfx.clang(); A.sparks(p[0] + 20, p[1] - 30, { color: '#e6f2ff', count: 26, speed: 460 }); A.shake(box, 5, 200); }); freeze(); SND.grunt(); }, RM ? 0 : 240);
    planAttack();
  }
  function maul(dmg, how) {      /* the beast lunges and rakes the hero */
    var beast = el('ar-beast'), hero = el('ar-hero');
    anim(beast, [{ transform: 'translate(450px,150px)' }, { transform: 'translate(230px,150px) scale(1.12)', offset: .35 }, { transform: 'translate(250px,150px)', offset: .55 }, { transform: 'translate(450px,150px)' }], how === 'heavy' ? 760 : 600);
    SND.roar(how === 'heavy' ? 1.15 : 1.35);
    setTimeout(function () {
      heroHP = Math.max(0, heroHP - dmg); bars(); freeze();
      var hu = box.querySelector('.hurt'); hu.classList.add('on'); setTimeout(function () { hu.classList.remove('on'); }, 60);
      say(how === 'heavy' ? pick(['MAULED!', 'CRUSHED!', 'SAVAGE HIT!', 'RAKED!']) : pick(['CLAWED!', 'BITTEN!', 'OUCH!']), '#ff3b1f');
      var p = at(hero); fx(function (A) { A.sfx.thud(); A.sparks(p[0], p[1] - 10, { color: '#c0151b', count: how === 'heavy' ? 28 : 16, speed: 380 }); A.shake(box, how === 'heavy' ? 14 : 8, how === 'heavy' ? 420 : 260); });
      if (hero) { var cl = svgEl('g', { 'class': 'ouch', transform: 'translate(' + (-10 + Math.random() * 14) + ',' + (-70 - Math.random() * 20) + ') rotate(-28)' });
        for (var k = 0; k < 3; k++) cl.appendChild(svgEl('path', { d: 'M' + (k * 7 - 7) + ',-12 q2,12 0,24', stroke: '#c0151b', 'stroke-width': 3.2, fill: 'none', 'stroke-linecap': 'round' })); hero.appendChild(cl);
        anim(hero, [{ transform: 'translate(150px,150px)' }, { transform: 'translate(118px,150px) rotate(-8deg)', offset: .3 }, { transform: 'translate(150px,150px)' }], 420); }
      if (heroHP <= 0) knockdown();
    }, RM ? 0 : (how === 'heavy' ? 280 : 220));
  }
  function knockdown() {
    var hero = el('ar-hero'); cancelAttack();
    say('HERO DOWN!', '#ff3b1f'); fx(function (A) { A.sfx.lose(); });
    if (!RM && hero && hero.animate) hero.animate([{ transform: 'translate(150px,150px) rotate(0deg)' }, { transform: 'translate(120px,150px) rotate(-80deg)', offset: .25 }, { transform: 'translate(120px,150px) rotate(-80deg)', offset: .75 }, { transform: 'translate(150px,150px) rotate(0deg)' }], { duration: 2000 });
    setTimeout(function () { heroHP = 60; bars(); say('GET UP!', '#ffe36b'); fx(function (A) { A.sfx.power(); }); planAttack(4000); }, RM ? 200 : 1700);
  }
  document.addEventListener('keydown', function (e) {
    if (e.code !== 'Space' && e.key !== ' ') return;
    var tg = e.target, tag = tg && tg.tagName; if (tag === 'INPUT' || tag === 'TEXTAREA' || (tg && tg.isContentEditable)) return;
    var gs = document.getElementById('game-screen'); if (!box || !gs || gs.style.display === 'none') return;
    e.preventDefault(); e.stopPropagation(); if (!e.repeat) block();
  }, true);
  document.addEventListener('keyup', function (e) {    /* a button would otherwise act on Space keyup: never let Space pick an answer */
    if (e.code !== 'Space' && e.key !== ' ') return; var gs = document.getElementById('game-screen'); var tag = e.target && e.target.tagName;
    if (box && gs && gs.style.display !== 'none' && tag !== 'INPUT' && tag !== 'TEXTAREA') { e.preventDefault(); e.stopPropagation(); }
  }, true);
  document.addEventListener('visibilitychange', function () { if (document.hidden) { cancelAttack(); MUS.stop(); } else if (beastAlive) { planAttack(3000); MUS.start(); } });

  /* ---------------- the death: slow motion, cut in two, goo, eyeballs ---------------- */
  function gore(clean) {
    var beast = el('ar-beast'); if (!beast || !beastAlive) return; beastAlive = false; cancelAttack(); addKO();
    var S = RM ? 1 : 3, p = at(beast), inner = beast.innerHTML, k = kind;
    box.classList.add('slow'); freeze(); SND.cry(true); SND.squish();
    fx(function (A) { A.sfx.boom(1.1); A.sparks(p[0], p[1], { color: k.goo, count: 50, speed: 260 }); A.sparks(p[0], p[1], { color: k.c, count: 22, speed: 200 }); A.shake(box, 10, 420); });
    var wrap = svgEl('g', { transform: 'translate(450,150)' }), top = svgEl('g', { 'clip-path': 'url(#ar-cut-a)' }), bot = svgEl('g', { 'clip-path': 'url(#ar-cut-b)' });
    var ti = svgEl('g', {}), bi = svgEl('g', {}); ti.innerHTML = inner; bi.innerHTML = inner; top.appendChild(ti); bot.appendChild(bi);
    var tw = svgEl('g', {}), bw = svgEl('g', {}); tw.appendChild(top); bw.appendChild(bot); wrap.appendChild(bw); wrap.appendChild(tw);
    beast.style.opacity = '0'; beast.parentNode.appendChild(wrap);
    var gash = svgEl('path', { d: 'M-120,-56 L120,-94', stroke: k.goo, 'stroke-width': 7, 'stroke-linecap': 'round' }); bw.appendChild(gash);
    var dur = 700 * S;
    if (!RM && tw.animate) {
      tw.animate([{ transform: 'translate(0px,0px) rotate(0deg)' }, { transform: 'translate(40px,-60px) rotate(25deg)', offset: .45 }, { transform: 'translate(90px,40px) rotate(95deg)' }], { duration: dur, easing: 'cubic-bezier(.3,.1,.6,1)', fill: 'forwards' });
      bw.animate([{ transform: 'translate(0px,0px) rotate(0deg)' }, { transform: 'translate(-10px,0px) rotate(-6deg)', offset: .5 }, { transform: 'translate(-24px,14px) rotate(-14deg) scale(1,.8)' }], { duration: dur, easing: 'ease-in', fill: 'forwards' });
    } else { tw.setAttribute('transform', 'translate(90,40) rotate(95)'); }
    for (var i = 0; i < 14; i++) (function (i) {       /* goo spray from the cut */
      var dx = -40 + Math.random() * 200, up = 40 + Math.random() * 90, r = 3 + Math.random() * 6, x0 = (Math.random() * 160 - 80), y0 = -76 + x0 * -.16;
      var d = svgEl('circle', { r: r, fill: k.goo, stroke: 'rgba(0,0,0,.3)', 'stroke-width': 1 }); wrap.appendChild(d);
      if (RM || !d.animate) { d.remove(); return; }
      d.animate([{ transform: 'translate(' + x0 + 'px,' + y0 + 'px)' }, { transform: 'translate(' + (x0 + dx * .5) + 'px,' + (y0 - up) + 'px)', offset: .4 }, { transform: 'translate(' + (x0 + dx) + 'px,0px)' }], { duration: dur * (.7 + Math.random() * .5), easing: 'ease-in', fill: 'forwards' }).onfinish = function () { d.remove(); splat(450 + x0 + dx, 148, r * 1.4, k.goo, el('ar-puddles')); };
    })(i);
    for (var e2 = 0; e2 < 2; e2++) (function (e2) {     /* the eyeballs pop out and bounce */
      var eye = svgEl('g', {}); eye.appendChild(svgEl('circle', { r: 7, fill: '#fff8e6', stroke: '#000', 'stroke-width': 1.5 })); eye.appendChild(svgEl('circle', { r: 3, fill: k.eye, cx: -2 })); eye.appendChild(svgEl('circle', { r: 1.4, fill: '#000', cx: -2.4 }));
      wrap.appendChild(eye); if (RM || !eye.animate) { eye.remove(); return; }
      var x0 = e2 ? 16 : -16, dx = e2 ? 120 : -70;
      eye.animate([{ transform: 'translate(' + x0 + 'px,-98px) rotate(0deg)' }, { transform: 'translate(' + (x0 + dx * .4) + 'px,-170px) rotate(300deg)', offset: .35 }, { transform: 'translate(' + (x0 + dx * .7) + 'px,-6px) rotate(600deg)', offset: .7 }, { transform: 'translate(' + (x0 + dx * .85) + 'px,-30px) rotate(700deg)', offset: .85 }, { transform: 'translate(' + (x0 + dx) + 'px,-6px) rotate(760deg)' }], { duration: dur * 1.1, easing: 'ease-in', fill: 'forwards' });
    })(e2);
    tooth([440, 100]); tooth([460, 96]);
    setTimeout(function () {
      box.classList.remove('slow'); SND.squish(); fx(function (A) { A.sfx.thud(); A.shake(box, 8, 300); });
      var pd = el('ar-puddles'); if (pd) { var pu = svgEl('ellipse', { cx: 455, cy: 152, rx: 8, ry: 4, fill: k.goo, opacity: .9 }); pd.insertBefore(pu, pd.firstChild); anim(pu, [{ rx: 8 }, { rx: 92 }], 600); pu.setAttribute('rx', 92); }
      say('K.O.!', '#ff3b1f'); if (clean && !wrongs) setTimeout(function () { say('PERFECT!', '#ffe36b'); }, RM ? 0 : 1100);
      fx(function (A) { A.sfx.power(); });
      setTimeout(function () { try { wrap.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 900, fill: 'forwards' }); } catch (e) {} }, 1600);
    }, RM ? 100 : dur);
  }

  var _load = window.loadProblem, _choice = window.handleChoice, _results = window.showResults;
  window.loadProblem = function () { var r = _load.apply(this, arguments); try { newBeast(window.problems[window.probIdx], window.probIdx); } catch (e) {} return r; };
  window.handleChoice = function (btn, isCorrect, step) {
    var last = false; try { last = window.stepIdx >= window.problems[window.probIdx].steps.length - 1; } catch (e) {}
    var r = _choice.apply(this, arguments);
    try { if (isCorrect) strike(last); else struck(); } catch (e) {}
    return r;
  };
  if (/[?&]debug/.test(location.search)) window.__EM = { windUp: windUp, block: block, gore: gore, hero: function () { return heroHP; }, kos: kos, alive: function () { return beastAlive; } };
  if (typeof _results === 'function') window.showResults = function () { try { beastAlive = false; cancelAttack(); MUS.stop(); } catch (e) {} var r = _results.apply(this, arguments);
    try { fx(function (A) { A.sfx.win(); A.confetti(innerWidth / 2, innerHeight * .3, { count: 110, colors: ['#FFC107', '#e0452f', '#2f5a8a', '#7CFC9A', '#ffffff'] }); }); } catch (e) {} return r; };
})();
