#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Squeaky Cheeks: big silly upgrades, Nov 12, 2026 (Zach: "Do all the upgrades and make it as juvenile as possible (in a PG way)").
Math, gas meter, beans, room goals and Send are unchanged. Adds:
  1. Bigger toots: a puff burst, flying "P F R T !" letters, beans popping out, the player hops forward, a green screen flash,
     a big wobbly banner (BUTT TRUMPET! AIR BISCUIT! ...), flies buzzing around the cloud, plants wilt for a few seconds.
  2. Chain reactions: people running for the door BONK into others (stars, "OOF!", a little stink rubs off), and some panic-toot
     on the way out ("oops!"), which can make more people run.
  3. A busier room: people wave, dance (party rooms), burp (others laugh "excuse YOU"), sneeze, yawn, look at phones, pinch their
     noses when it smells; doors bang open and someone peeks in ("*sniff* NOPE!"); babies giggle and toot back.
  4. Bigger people (1.35x) and a CLOSE-UP face cam in the corner when someone runs.
  5. Combo meter: every person who runs right after a toot adds to the combo; 3 / 5 / 8 / 12 = STINKY COMBO! / MEGA STINK! /
     GAS-TASTROPHE!! / LEGENDARY GAS!!! with confetti and a toot-trumpet fanfare. Best combo shows on the win screen.
After it ran, the old floating "N× COMBO STINK!" text was removed by hand (the COMBO meter shows it).
Reduced motion: fewer particles, no flash or shake. Refuses to run twice (marker SQ-UPGRADE-NOV12)."""
import os, re
P = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'grade8', 'squeaky-cheeks.html')
s = open(P, encoding='utf-8').read()
assert 'SQ-UPGRADE-NOV12' not in s, 'already applied'


def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (s.count(old), old[:80])
    s = s.replace(old, new)


# ---------- state ----------
rep("player:{x:160,y:170,tx:160,ty:170,face:1,walk:0,blush:0,puff:0,laugh:0,wiggle:0},",
    "player:{x:160,y:170,tx:160,ty:170,face:1,walk:0,blush:0,puff:0,laugh:0,wiggle:0,hop:0},")
rep("toots:0,", "toots:0,parts:[],flash:0,banner:null,combo:{n:0,t:0,best:0},cam:null,flies:[],wilt:0,peekT:rf(6,10),bonkCD:0,")
rep("laugh:0,point:0,faint:0};\n}", "laugh:0,point:0,faint:0,act:'',actT:0,nextAct:rf(1.5,6),bump:0,spin:0,pinch:0};\n}")

# ---------- busier room: shorter waits, more chatter ----------
rep("n.wait=rf(1,4);", "n.wait=rf(.6,2.6);")
rep("if(moveTo(n,dt,1)){n.state='hang';n.wait=rf(4,9)}", "if(moveTo(n,dt,1)){n.state='hang';n.wait=rf(3,6)}")
rep("if(n.talk<=0){n.talk=rf(1.2,3.5);", "if(n.talk<=0){n.talk=rf(.9,2.6);")

# ---------- helpers (after floatText) ----------
rep("function floatText(x,y,txt,col){G.texts.push({x,y,txt,col:col||'#fff',t:1.2})}",
r"""function floatText(x,y,txt,col){G.texts.push({x,y,txt,col:col||'#fff',t:1.2})}
/* ===== SQ-UPGRADE-NOV12: particles, banners, combos, chain reactions, idle antics ===== */
const CONF=['#ff5c8a','#ffd23f','#3bceac','#7cc4ff','#c99ae8','#9be15d','#ff924c'];
const MAXP=RM?60:320;
function part(o){if(G.parts.length<MAXP)G.parts.push(Object.assign({t:0,vx:0,vy:0,g:0,life:1,size:2},o))}
function burst(x,y,n,col,spd,opt){opt=opt||{};if(RM)n=Math.ceil(n/3);for(let i=0;i<n;i++){const a=rf(0,Math.PI*2),sp=rf(.35,1)*spd;
  part({kind:opt.kind||'puff',x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp*.7-(opt.up||0),g:opt.g||0,life:rf(.55,1)*(opt.life||1),size:opt.size||rf(2,4),col:col||pick(CONF),txt:opt.txt?pick(opt.txt):''})}}
function banner(txt,col,big){G.banner={txt,col:col||'#d6ff9e',t:0,life:big?1.9:1.3,big:!!big}}
function confetti(n){if(RM)n=Math.ceil(n/3);for(let i=0;i<n;i++)part({kind:'confetti',x:rf(0,W),y:rf(-12,TOPWALL),vx:rf(-22,22),vy:rf(10,45),g:35,life:rf(1.6,2.6),size:2,col:pick(CONF)})}
function comboHit(){const C=G.combo;if(C.t<=0)C.n=0;C.n++;C.t=Math.max(C.t,1.9);C.best=Math.max(C.best,C.n);
  const ms={3:['STINKY COMBO!',1],5:['MEGA STINK x5!',2],8:['GAS-TASTROPHE!!',3],12:['LEGENDARY GAS!!!',3]}[C.n];
  if(ms){banner(ms[0],pick(['#ffd23f','#ff7aa2','#7cc4ff']),true);SND.fanfare(ms[1]);confetti(18*ms[1]);
    if(!RM){G.flash=Math.max(G.flash,.25);G.shake=Math.max(G.shake,2+ms[1])}}}
function panicToot(n){if(!G||G.won||n.state==='gone')return;
  const f={col:'175,215,95',linger:0,pow:.7,r:20};
  G.clouds.push({x:n.x,y:n.y-2,r:4,R:20,t:0,life:1.3,f,hit:new Set()});
  floatText(n.x,n.y-30,pick(['pfft!','oops!','*squeak*','pbbt!','not me!']),'#ffe08a');
  burst(n.x,n.y-6,8,'rgb(175,215,95)',30,{kind:'puff',size:3});SND.tinytoot();
  let more=0;for(const o of G.npcs){if(o===n||o.state==='gone'||o.state==='flee'||o.state==='enter')continue;if(Math.hypot(o.x-n.x,o.y-n.y)<24){o.stink+=.75;react(o);more++}}
  if(more)floatText(n.x,n.y-38,'CHAIN REACTION!','#ff7aa2');}
function idleAct(n){
  if(n.baby){n.act='crawl';n.actT=1.5;say(n,pick(['goo','ba!','*drool*','pbbbt!','hehe']),1.2);return}
  const party=/Party|Wedding|Cafeteria/.test(G.T.name);
  const k=pick(party?['wave','dance','dance','burp','achoo','yawn','phone']:['wave','burp','achoo','yawn','phone','phone','wave']);
  n.act=k;n.actT={wave:1.4,dance:2.6,burp:1,achoo:1,yawn:1.4,phone:3}[k];
  if(k==='wave')say(n,pick(['hi!','hey!','yo!','sup','HIII!']),1.2);
  else if(k==='burp'){say(n,pick(['BURP!','*BUUURP*','URRRP!']),1.3);SND.burp(n.pitch);
    for(const o of G.npcs)if(o!==n&&o.state!=='gone'&&o.state!=='flee'&&Math.hypot(o.x-n.x,o.y-n.y)<42&&Math.random()<.6)
      setTimeout(()=>{if(!G||o.state==='flee'||o.state==='gone')return;o.laugh=1.2;o.point=1.2;o.face=n.x>o.x?1:-1;say(o,pick(['ew!','excuse YOU','nice one','gross lol','10 out of 10','do it again']),1.3)},ri(250,600))}
  else if(k==='achoo'){say(n,pick(['ACHOO!','AH-CHOO!']),1.1);SND.achoo(n.pitch);burst(n.x+n.face*6,n.y-20,7,'#bfe8ff',38,{kind:'drop',size:1,life:.6})}
  else if(k==='yawn')say(n,'yaaawn',1.3);
  else if(k==='dance')say(n,pick(['♪','♪♪','woo!']),1.4);
}
function updFx(dt){
  for(let i=G.parts.length-1;i>=0;i--){const q=G.parts[i];q.t+=dt;q.vy+=q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.kind==='puff'){q.vx*=.95;q.vy*=.95}if(q.t>q.life)G.parts.splice(i,1)}
  for(let i=G.flies.length-1;i>=0;i--){const fl=G.flies[i];fl.t+=dt;fl.a+=fl.sp*dt;if(fl.t>fl.life)G.flies.splice(i,1)}
  if(G.banner){G.banner.t+=dt;if(G.banner.t>G.banner.life)G.banner=null}
  G.flash=Math.max(0,G.flash-dt*1.6);G.wilt=Math.max(0,G.wilt-dt);G.bonkCD-=dt;
  if(G.cam){G.cam.t-=dt;if(G.cam.t<=0||G.cam.n.state==='gone')G.cam=null}
  const C=G.combo;if(C.t>0){C.t-=dt;if(C.t<=0&&C.n>0){if(C.n>=2)banner('COMBO x'+C.n+'!','#ffe08a',C.n>=4);C.n=0}}
  const p=G.player;p.hop=Math.max(0,(p.hop||0)-dt);
  for(const n of G.npcs){n.bump=Math.max(0,n.bump-dt);n.spin=Math.max(0,n.spin-dt);n.pinch=Math.max(0,n.pinch-dt)}
  // doors bang open now and then: someone peeks in, sniffs, and leaves
  if(!G.won&&$('#title').hidden&&$('#won').hidden){G.peekT-=dt;if(G.peekT<=0){G.peekT=rf(8,14);const d=pick(G.doors);d.open=1;d.hold=.5;SND.creak();
    floatText(d.x,TOPWALL+6,pick(G.clouds.length?['*sniff* NOPE!','nope nope nope','EWW, NO!']:['hello?','wrong room','oops!','knock knock']),'#fff6e8');setTimeout(()=>{if(G)SND.slam()},650)}}
}""")

# ---------- NPC update: act timers, bumps, idle antics ----------
rep("if(n.laugh>0)n.laugh-=dt;if(n.point>0)n.point-=dt;if(n.faint>0)n.faint-=dt;",
    "if(n.laugh>0)n.laugh-=dt;if(n.point>0)n.point-=dt;if(n.faint>0)n.faint-=dt;\n  if(n.act){n.actT-=dt;if(n.actT<=0)n.act=''}")
rep("""  if(n.state==='flee'){
    const d=n.leaving;""",
"""  if(n.state==='flee'){
    for(const o of G.npcs){if(o===n||o.state==='gone'||o.state==='enter'||o.bump>0)continue;           // BONK: runners crash into people
      if(Math.abs(o.x-n.x)<7&&Math.abs(o.y-n.y)<5){o.bump=.9;o.spin=.6;n.bump=Math.max(n.bump,.3);
        if(o.state!=='flee'){o.tx=o.x+(o.x>n.x?14:-14);o.ty=o.y+rf(-6,6);o.state='wander';o.wait=.4;o.act='';o.stink+=.25;say(o,pick(['OOF!','HEY!','watch it!','MOVE!','RUDE!','my toe!']),1.1)}
        else say(o,'BONK!',.9);
        burst((o.x+n.x)/2,o.y-26,5,'#ffe08a',25,{kind:'star',life:.8,size:2});if(G.bonkCD<=0){SND.bonk();G.bonkCD=.25}}}
    const d=n.leaving;""")
rep("""  if(n.state==='wander'){
    if(moveTo(n,dt,n.stink>.3?1.4:1)){""",
"""  if(!n.act&&n.stink<.3&&n.state!=='tospot'){n.nextAct-=dt;if(n.nextAct<=0){n.nextAct=rf(3,8);idleAct(n)}}
  if(n.state==='wander'){
    if(moveTo(n,dt,n.stink>.3?1.4:1)){""")

# ---------- bigger toots ----------
rep("""  if(hits>=3)floatText(p.x,p.y-38,`${hits}× COMBO STINK!`,'#ffe08a');
  renderMeter();""",
"""  if(hits>=3)floatText(p.x,p.y-38,`${hits}× COMBO STINK!`,'#ffe08a');
  const big=f.r/24,cl=G.clouds[G.clouds.length-1];
  burst(p.x-p.face*4,p.y-6,Math.round(14*big),`rgb(${f.col})`,40*big,{kind:'puff',life:1.1,size:4});
  burst(p.x-p.face*4,p.y-10,ri(5,8),'#d6ff9e',55,{kind:'letter',up:40,g:60,life:1.3,txt:['P','F','R','T','B','!','Z']});
  burst(p.x-p.face*4,p.y-6,ri(2,4),'#8a5a2a',45,{kind:'bean',up:50,g:140,life:1.2});
  p.hop=.45;p.x=Math.max(10,Math.min(310,p.x+p.face*6));p.tx=p.x;                       // the toot launches you forward
  if(!RM)G.flash=Math.min(.5,.18+.08*big);
  banner(pick(['BRAAAP!','BUTT TRUMPET!','AIR BISCUIT!','STINK BOMB!','TUSHIE TUBA!','BOOTY BURP!','SILENT BUT DEADLY!','THE BEANS HAVE SPOKEN!','PANTS ALARM!']),'#d6ff9e',f.k==='thunder'||f.k==='foghorn');
  G.wilt=Math.max(G.wilt,3+big*2);
  for(let i=0;i<3+Math.round(big);i++)G.flies.push({c:cl,a:rf(0,7),r:rf(6,14)*Math.min(2,big),sp:rf(4,8)*(Math.random()<.5?-1:1),t:0,life:rf(3,6)});
  G.combo.t=Math.max(G.combo.t,2.6);SND.boing();
  renderMeter();""")

# ---------- reactions: juvenile lines, combo, face cam, panic toots, babies toot back, nose pinch ----------
rep("""line=pick({gross:['GROSS!','SO GROSS!','GROSS GROSS!'],eww:['EWWW!','EWW, NO!','ewwww'],retch:['*GAG*','hurk!','BLEGH!'],scream:['AAAAH!','MY EYES!','WHO DID THAT?!'],cough:['*cough*','old cheese?!','I’m out!','NOPE!']}[kind])}""",
    """line=pick({gross:['GROSS!','SO GROSS!','I CAN TASTE IT!'],eww:['EWWW!','EWW, NO!','SMELLS LIKE EGGS!'],retch:['*GAG*','BLEGH!','MY NOSE HAIRS!'],scream:['AAAAH!','MY EYES!','WHO DID THAT?!','ABANDON SHIP!'],cough:['*cough*','old cheese?!','NOPE!','WHO ATE CHILI?!']}[kind])}""")
rep("""    say(n,line,2.2);if(!n.baby&&Math.random()<.3)n.faint=.7;""",
    """    say(n,line,2.2);if(!n.baby&&Math.random()<.3)n.faint=.7;n.act='';
    comboHit();G.cam={n,t:1.7,line};
    if(!n.baby&&Math.random()<.32)setTimeout(()=>panicToot(n),ri(250,700));""")
rep("""    if(n.baby){say(n,pick(['?','uh-oh','*sniff*']),1.4);setTimeout(()=>vox('sniff'),ri(0,300))}""",
    """    if(n.baby){if(Math.random()<.5){say(n,pick(['hehe!','pbbbt!','again!']),1.4);n.laugh=1.2;setTimeout(()=>{if(!G)return;SND.tinytoot();burst(n.x,n.y-4,5,'rgb(200,230,140)',18,{kind:'puff',size:2})},350)}
      else{say(n,pick(['?','uh-oh','*sniff*']),1.4);setTimeout(()=>vox('sniff'),ri(0,300))}}""")
rep("""    else{const k=pick(['sniff','ugh','sniff']);say(n,""", """    else{const k=pick(['sniff','ugh','sniff']);n.pinch=1.8;n.act='';say(n,""")

# ---------- sounds ----------
rep("""  ding(){if(!live())return;""",
"""  bonk(){if(!live())return;const t=AC.currentTime;osc('sine',700,t,.18,.16,{to:180});noise(t,.05,.18,'bandpass',2500,2)},
  boing(){if(!live())return;const t=AC.currentTime+.05;osc('triangle',180,t,.35,.07,{to:520,vib:18,vd:40})},
  tinytoot(){if(!live())return;fart(AC.currentTime+.01,{dur:.16*rf(.8,1.2),f0:rf(260,340),f1:rf(380,480),flutter:60,wet:.3,amp:.2,lp:2200,squeak:Math.random()<.5?1:0})},
  burp(p){if(!live()||!voiceOk())return;const t=AC.currentTime+.02,f=(p||250)*.32;voice(t,{dur:.55,amp:.34,f0:[[0,f*1.2],[.2,f],[.55,f*.8]],fm:[[0,[520,900,2400]],[.55,[650,1050,2400]]],vib:28,vd:f*.25,breath:.35});fart(t,{dur:.5,f0:f*1.1,f1:f*.8,flutter:38,wet:.2,amp:.12,lp:900})},
  achoo(p){if(!live()||!voiceOk())return;const t=AC.currentTime+.02,f=(p||250)*.7;voice(t,{dur:.35,amp:.25,f0:[[0,f],[.35,f*1.35]],fm:[[0,[700,1200,2600]]],breath:.4});noise(t+.42,.22,.4,'highpass',2600,1,1500);voice(t+.42,{dur:.2,amp:.22,f0:[[0,f*1.4],[.2,f]],fm:[[0,[350,900,2400]]],breath:.8})},
  fanfare(lv){if(!live())return;const t=AC.currentTime+.05,notes=lv>=3?[262,330,392,523,392,523]:lv===2?[262,330,392,523]:[330,392,523];   // a toot-trumpet "ta-da"
    notes.forEach((n,i)=>fart(t+i*.16,{dur:i===notes.length-1?.5:.14,f0:n*.5,f1:n*.52,flutter:40,wet:.2,amp:.3,lp:2400,squeak:i===notes.length-1?1:0}));
    notes.forEach((n,i)=>osc('square',n*2,t+i*.16,.12,.03,{lp:3000}))},
  ding(){if(!live())return;""")

# ---------- drawing ----------
# plants wilt while the room stinks
rep("if(p.plant){R(x+2,y+6,w-4,h-4,'#9a5b3a');R(x,y-2,w,8,p.c);R(x+2,y-5,4,4,'#56b060');R(x+6,y-6,3,5,'#56b060')}",
    "if(p.plant){R(x+2,y+6,w-4,h-4,'#9a5b3a');if(G.wilt>0){R(x,y+1,w,5,'#8a8a3a');R(x-2,y+3,3,2,'#7a7a30');R(x+w-1,y+3,3,2,'#7a7a30')}else{R(x,y-2,w,8,p.c);R(x+2,y-5,4,4,'#56b060');R(x+6,y-6,3,5,'#56b060')}}")
# person poses
rep("""  const lf=o.laugh>0,ph=lf?Math.floor(o.laugh*13)%2:0,wg=isP&&o.wiggle>0?(Math.floor(o.wiggle*16)%2?1:-1):0,fw=o.faint>0?Math.round(Math.sin(o.faint*26)*2):0;
  const x=Math.round(o.x)+wg+fw,y=Math.round(o.y)-(lf?ph:0)-(wg?1:0),f=o.face||1;""",
"""  const lf=o.laugh>0,ph=lf?Math.floor(o.laugh*13)%2:0,wg=isP&&o.wiggle>0?(Math.floor(o.wiggle*16)%2?1:-1):0,fw=o.faint>0?Math.round(Math.sin(o.faint*26)*2):0;
  const dn=o.act==='dance'?Math.floor(o.actT*6)%2:0,hp=isP&&o.hop>0?Math.round(Math.sin(o.hop/.45*Math.PI)*6):0;
  const x=Math.round(o.x)+wg+fw,y=Math.round(o.y)-(lf?ph:0)-(wg?1:0)-dn-hp,f=o.spin>0?(Math.floor(o.spin*18)%2?1:-1):(o.face||1);
  const pinch=!isP&&o.state!=='flee'&&(o.pinch>0||o.stink>.35);""")
rep("""  else{R(x-5,y-10,1,5,shirt);R(x+4,y-10,1,5,shirt)}""",
"""  else if(o.act==='wave'){R(x-5,y-10,1,5,shirt);const wv=Math.floor(o.actT*8)%2;R(x+4,y-16,1,6,shirt);R(x+3+wv*2,y-18,2,2,o.skin||'#f7d1b5')}   // waving
  else if(o.act==='dance'){R(x-6,y-14+(dn?2:0),1,5,shirt);R(x+5,y-14+(dn?0:2),1,5,shirt)}                                         // dancing
  else if(pinch){R(x-5,y-10,1,5,shirt);R(x+(f>0?3:-4),y-14,1,4,shirt);R(x+(f>0?1:-2),y-15,2,1,o.skin||'#f7d1b5')}               // holding nose
  else if(o.act==='phone'){R(x-5,y-10,1,5,shirt);R(x+(f>0?2:-4),y-12,2,2,shirt);R(x+(f>0?3:-5),y-15,2,3,'#222');R(x+(f>0?3:-5),y-15,2,1,'#7cc4ff')}
  else{R(x-5,y-10,1,5,shirt);R(x+4,y-10,1,5,shirt)}""")
rep("""  else if(hs===3){R(x-3,y-21,6,1,hair)}""",
"""  else if(hs===3){R(x-3,y-21,6,1,hair)}""")
# after the face: dizzy stars, stink squiggles, yawn
rep("""  if(isP){const c=Math.min(3,1+Math.floor(o.puff*2.2));""",
"""  if(o.bump>0){const tt=performance.now()/120;for(let i=0;i<3;i++)R(x+Math.round(Math.cos(tt+i*2.1)*6),y-25+Math.round(Math.sin(tt+i*2.1)*2),1,1,'#ffe08a')}   // dizzy stars
  if(pinch){const tt=performance.now()/90;for(let i=0;i<3;i++)R(x-3+i*3+Math.round(Math.sin(tt+i)),y-25-((Math.floor(tt)+i)%3),1,1,'#7fbf3f')}                   // stink squiggles
  if(o.act==='yawn')R(x-1+ex,y-14,2,2,'#5a1420');
  if(isP){const c=Math.min(3,1+Math.floor(o.puff*2.2));""")
# bubbles sit higher (people are bigger now)
rep("let bx=Math.round(Math.max(2,Math.min(W-w-2,x-w/2))),by=Math.round(y-33);", "let bx=Math.round(Math.max(2,Math.min(W-w-2,x-w/2))),by=Math.round(y-42);")
rep("for(const n of G.npcs)if(n.state!=='gone'&&n.sayT>0&&n.say)bubble(n.x,n.baby?n.y+9:n.y,n.say);",
    "for(const n of G.npcs)if(n.state!=='gone'&&n.sayT>0&&n.say)bubble(n.x,n.baby?n.y+11:n.y,n.say);")
# bigger people + particles + flies + overlays
rep("""  for(const o of all)drawPerson(o,o===p);
  drawClouds();""",
"""  for(const o of all){cx.save();cx.translate(o.x,o.y);cx.scale(1.35,1.35);cx.translate(-o.x,-o.y);drawPerson(o,o===p);cx.restore()}   // bigger people
  drawClouds();drawParts();""")
rep("""for(const t of G.texts){cx.globalAlpha=Math.min(1,t.t*1.5);cx.font='6px "Press Start 2P",monospace';cx.textAlign='center';cx.textBaseline='alphabetic';cx.fillStyle='#000';cx.fillText(t.txt,Math.round(t.x)+.5,Math.round(t.y)+.5);cx.fillStyle=t.col;cx.fillText(t.txt,Math.round(t.x),Math.round(t.y));cx.globalAlpha=1}""",
"""for(const t of G.texts){cx.globalAlpha=Math.min(1,t.t*1.5);cx.font='6px "Press Start 2P",monospace';cx.textAlign='center';cx.textBaseline='alphabetic';cx.fillStyle='#000';cx.fillText(t.txt,Math.round(t.x)+.5,Math.round(t.y)+.5);cx.fillStyle=t.col;cx.fillText(t.txt,Math.round(t.x),Math.round(t.y));cx.globalAlpha=1}
  drawOverlays();""")
rep("let last=performance.now();",
r"""function drawParts(){
  for(const fl of G.flies){const c=fl.c,fx=c.x+Math.cos(fl.a)*fl.r,fy=c.y-8+Math.sin(fl.a*1.3)*fl.r*.5;R(fx,fy,1,1,'#222');if(Math.floor(fl.t*30)%2)R(fx-1,fy-1,1,1,'rgba(255,255,255,.8)');else R(fx+1,fy-1,1,1,'rgba(255,255,255,.8)')}
  for(const q of G.parts){const a=Math.max(0,1-q.t/q.life);
    if(q.kind==='puff'){cx.globalAlpha=.55*a;cx.fillStyle=q.col;cx.beginPath();cx.arc(q.x,q.y,q.size*(1+q.t*2),0,7);cx.fill();cx.globalAlpha=1}
    else if(q.kind==='letter'){cx.globalAlpha=a;cx.font='8px "Press Start 2P",monospace';cx.textAlign='center';cx.textBaseline='middle';cx.fillStyle='#1d1a2e';cx.fillText(q.txt,q.x+.7,q.y+.7);cx.fillStyle=q.col;cx.fillText(q.txt,q.x,q.y);cx.globalAlpha=1}
    else if(q.kind==='bean'){R(q.x-1,q.y-1,3,2,'#7a4a22');R(q.x-1,q.y-1,1,1,'#c08048')}
    else if(q.kind==='star'){cx.globalAlpha=a;R(q.x,q.y-1,1,3,q.col);R(q.x-1,q.y,3,1,q.col);cx.globalAlpha=1}
    else{cx.globalAlpha=a;R(q.x,q.y,q.size,q.size,q.col);cx.globalAlpha=1}}
}
function drawOverlays(){
  if(G.flash>0){cx.fillStyle=`rgba(170,230,90,${(G.flash*.6).toFixed(3)})`;cx.fillRect(-10,-10,W+20,H+20)}
  const C=G.combo;
  if(C.n>0&&C.t>0){R(4,TOPWALL+4,66,13,'rgba(29,26,46,.85)');cx.font='5px "Press Start 2P",monospace';cx.textAlign='left';cx.textBaseline='middle';cx.fillStyle='#ffe08a';cx.fillText('COMBO x'+C.n,8,TOPWALL+9);R(8,TOPWALL+13,Math.round(58*Math.min(1,C.t/2.6)),2,'#ff7aa2')}
  if(G.cam){const n=G.cam.n,bw=78,bh=62,bx=W-bw-5,by=H-bh-5;                                    // CLOSE-UP face cam
    R(bx-2,by-2,bw+4,bh+4,'#9be15d');R(bx,by,bw,bh,'#fff6e8');R(bx,by,bw,Math.round(bh*.55),G.T.wall);
    cx.save();cx.beginPath();cx.rect(bx,by,bw,bh);cx.clip();cx.translate(bx+bw/2,by+bh/2+4);const z=n.baby?4.4:3.4;cx.scale(z,z);cx.translate(-n.x,-(n.y-(n.baby?11:15)));drawPerson(n,false);cx.restore();
    R(bx,by+bh-12,bw,12,'#1d1a2e');cx.font='5px "Press Start 2P",monospace';cx.textAlign='center';cx.textBaseline='middle';cx.fillStyle='#ffe08a';cx.fillText(String(G.cam.line||'EWW!').slice(0,13),bx+bw/2,by+bh-6);
    R(bx+2,by+2,36,7,'#ff7aa2');cx.font='4px "Press Start 2P",monospace';cx.textAlign='left';cx.fillStyle='#fff';cx.fillText('CLOSE-UP',bx+4,by+6)}
  if(G.banner){const b=G.banner,k=Math.min(1,b.t/.15),a=Math.min(1,(b.life-b.t)/.3);
    cx.save();cx.globalAlpha=Math.max(0,a);cx.translate(W/2,TOPWALL+30);cx.rotate(Math.sin(b.t*18)*.06);
    const sc=(b.big?1.45:1.1)*(k<1?.6+k*.7:1);cx.scale(sc,sc);cx.font='8px "Press Start 2P",monospace';cx.textAlign='center';cx.textBaseline='middle';
    cx.lineWidth=3;cx.lineJoin='round';cx.strokeStyle='#1d1a2e';cx.strokeText(b.txt,0,0);cx.fillStyle=b.col;cx.fillText(b.txt,0,0);cx.restore()}
}
let last=performance.now();""")
rep("    updClouds(dt);", "    updClouds(dt);updFx(dt);")
# win screen: best combo
rep("<div><b>+${G.beansHere}</b>beans earned</div>`;", "<div><b>+${G.beansHere}</b>beans earned</div><div><b>x${G.combo.best}</b>best combo</div>`;")
open(P, 'w', encoding='utf-8').write(s)
print('ok')
