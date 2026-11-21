#!/usr/bin/env python3
"""Build the 5th grade Squeaky Cheeks: Class Cup page from Mr. Allen's 8th grade game.
Usage: python3 build.py ORIGINAL_8TH_GRADE.html OUT.html   (q5.js and cup.js must sit next to this script)"""
import sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
src, out = sys.argv[1], sys.argv[2]
s = open(src).read()
q5 = open(os.path.join(HERE, 'q5.js')).read()
cup = open(os.path.join(HERE, 'cup.js')).read()

def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:90], s.count(old))
    s = s.replace(old, new)

# ---- head / dependencies (no 8th grade logging, no site bar) ----
rep('<title>Squeaky Cheeks</title>', '<title>Squeaky Cheeks: Class Cup (5th Grade)</title>')
rep('''<script src="../tracker-config.js"></script>
<script src="../arcade-send.js" data-game="Squeaky Cheeks" data-unit="F"></script>
<script src="../site-bar.js"></script>
''', '')
rep('<a class="back" href="arcade.html">← The Arcade</a>', '')
rep('/* Layout: pixel room (canvas, left) + "gas station" math panel (right); stacks on phones.',
'''/* 5th grade CLASS CUP copy of Mr. Allen's Squeaky Cheeks (grade8/squeaky-cheeks.html, Nov 2026).
   Topics: NC.5.NF.4 (multiply fractions, area with fractional sides, scaling, word problems), NC.5.MD.4-5 (volume).
   One self-contained file: no student names, no outside scripts. The class leaderboard works only when this file runs
   inside the teacher's Google Apps Script web app (google.script.run); anywhere else it is a practice copy.
   Layout: pixel room (canvas, left) + "gas station" math panel (right); stacks on phones.''')

# ---- css ----
rep('@keyframes wiggle', '''/* 5th grade additions */
.prob .ptxt{font-size:17px;font-weight:500;line-height:1.4;text-align:left;display:block}
.prob .ptxt b{color:var(--ink)}
.prob .ptxt .fr{font-size:.95em;vertical-align:middle;margin:0 .1em}
.prob .gold{color:#ffd36b}.prob .blue{color:#9ad0ff}
.prob.small{font-size:17px;justify-content:flex-start}
.mx{display:inline-flex;align-items:center;gap:.08em}
#fig{display:flex;justify-content:center}
#fig .fig{width:100%;max-width:300px;height:auto;background:#1b1829;border-radius:10px;border:2px solid var(--edge)}
.unit{font-size:15px;color:var(--muted);font-weight:600}
.box.sm.whole{width:2em}
.alab{font-size:11px;color:var(--muted);text-align:center;margin-top:-6px}
.choices{display:flex;flex-direction:column;gap:8px;width:100%}
.ch{font-weight:600;font-size:16px;text-align:left;padding:10px 12px;border-radius:10px;border:2px solid var(--edge);background:#231f37;cursor:pointer;min-height:44px}
.ch kbd{font:600 11px var(--f-body);background:var(--panel2);border:1px solid var(--edge);border-radius:4px;padding:1px 6px;margin-right:8px}
.ch:hover{border-color:var(--sky)}
.ch.no{opacity:.45;text-decoration:line-through}
.ch.yes{border-color:var(--stink);background:#2b3a22}
.fb .note{display:block;color:var(--ink);font-weight:500;font-size:14.5px;margin-top:4px}
.fb .ans{display:block;color:var(--muted);font-weight:500;font-size:14.5px;margin-top:4px}
/* class cup */
.cup{display:flex;align-items:center;gap:10px;background:var(--panel);border:2px solid var(--edge);border-radius:12px;padding:6px 10px;font-size:13px;flex:1 1 360px;min-width:0}
.cup .ct{font-family:var(--f-pix);font-size:9px;color:var(--bean);white-space:nowrap}
.cup .tug{flex:1;display:flex;flex-direction:column;gap:3px;min-width:0}
.cup .names{display:flex;justify-content:space-between;gap:8px;font-weight:600}
.cup .names b{font-family:var(--f-pix);font-size:10px}
.cup .bar{height:10px;border-radius:5px;background:#7cc4ff;overflow:hidden;border:2px solid #0f0d18}
.cup .bar i{display:block;height:100%;background:var(--cheek);transition:width .6s}
.cup .me{font-size:12px;color:var(--muted);white-space:nowrap}
.cup button{font:600 12px var(--f-body);color:var(--sky);background:none;border:0;cursor:pointer;padding:2px;text-decoration:underline}
.c0{color:var(--cheek)}.c1{color:#7cc4ff}
.homes{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
.home{font-family:var(--f-pix);font-size:15px;padding:22px 12px;border-radius:12px;border:3px solid var(--edge);background:#231f37;cursor:pointer;line-height:1.5}
.home:hover,.home:focus-visible{border-color:var(--stink);outline:none}
.home small{display:block;font-family:var(--f-body);font-size:13px;color:var(--muted);margin-top:6px}
.bigcup{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.bigcup div{background:#231f37;border-radius:12px;padding:16px;text-align:center}
.bigcup b{display:block;font-family:var(--f-pix);font-size:clamp(22px,6vw,56px);margin:8px 0}
.bigcup span{font-size:clamp(14px,2.2vw,22px);font-weight:600}
.bigcup em{display:block;font-style:normal;color:var(--muted);font-size:14px}
.std{font-size:12px;color:var(--muted)}
body.boardmode .wrap,body.boardmode #title,body.boardmode #won,body.boardmode #homeroom{display:none!important}

@keyframes wiggle''')

# ---- top bar + panel ----
rep('''    <div class="sp"></div>
    <button class="btn" id="bSound"''', '''    <div class="cup" id="cup" hidden></div>
    <div class="sp"></div>
    <button class="btn" id="bSound"''')
rep('''      <div class="prob" id="prob" aria-live="polite"></div>
      <div class="answer" id="answer"></div>''', '''      <div class="prob" id="prob" aria-live="polite"></div>
      <div id="fig"></div>
      <div class="answer" id="answer"></div>''')
rep('<span class="ph">Fart menu</span>', '<span class="ph">Toot menu</span>')

# ---- title card ----
rep('''Clear out enough people to win the room.</p>''', '''Clear out enough people to win the room.</p>
    <div id="titleCup"></div>''')
rep('''      <div><b>1. Answer</b>Type the answer and press Enter. 5 right fills your gas meter.</div>''',
'''      <div><b>1. Answer</b>Use the picture to help. Type the answer and press Enter. 5 right fills your gas meter.</div>''')
rep('''    <p>A wrong answer gives a sad little <b>pfft</b> and the fancy guests titter politely. That problem comes back later.</p>''',
'''    <p>A wrong answer gives a sad little <b>pfft</b>, tells you what went wrong, and that problem comes back later. Fractions can be typed as a fraction (like 7/4) or a mixed number (like 1 3/4). Any equal fraction counts.</p>
    <p class="std">Pick any room. Rooms 1–2: volume (NC.5.MD.4, NC.5.MD.5). Rooms 3–5: multiplying fractions and area (NC.5.NF.4).</p>''')

# ---- homeroom + board overlays ----
rep('''<div class="overlay" id="won" hidden>''', '''<div class="overlay" id="homeroom" hidden>
  <div class="card">
    <h2>Which homeroom are you in?</h2>
    <p>Every right answer earns <b>1 point</b> for your homeroom. Clearing a room earns <b>10 bonus points</b>. Only class totals are kept. Your name is never saved.</p>
    <div class="homes" id="homeList"></div>
  </div>
</div>

<div class="overlay" id="board" hidden>
  <div class="card" style="width:min(1100px,100%)">
    <h1>Class <span>Cup</span></h1>
    <div class="bigcup" id="boardCup"></div>
    <p id="boardNote">Updates by itself every 15 seconds.</p>
  </div>
</div>

<div class="overlay" id="won" hidden>''')

# ---- storage key + every room open ----
rep("localStorage.getItem('squeaky-cheeks')", "localStorage.getItem('squeaky-cheeks-5')")
rep("localStorage.setItem('squeaky-cheeks',JSON.stringify(save))", "localStorage.setItem('squeaky-cheeks-5',JSON.stringify(save))")
rep("const roomOpen=n=>n===1||save.cleared[n-1]||(save.open||0)>=n;", "const roomOpen=n=>true;   /* 5th grade copy: teachers pick the topic, so every room is open */")
rep("const LEVELS=[{kind:'int'},{kind:'int'},{kind:'int'},{kind:'frac'},{kind:'frac'}];\n", "")

# ---- room names / topics ----
rep("$('#lvlTxt').textContent=`Level ${n} · ${['Add & subtract integers','All four operations','Bigger integers','Fractions, same denominator','Fractions, different denominators'][n-1]}`;",
    "$('#lvlTxt').textContent=`Room ${n} · ${Q5.ROOM_TOPICS[n-1]}`;")
rep("<span>${['Add & subtract integers','All four operations','Bigger integers','Fractions, same denominator','Fractions, different denominators'][i]}</span>",
    "<span>${Q5.ROOM_TOPICS[i]}</span><span class=\"std\">${Q5.ROOM_STD[i]}</span>")
rep("${save.cleared[n]?'<span class=\"done\">Cleared ✓</span>':open?'':`<span>Clear Room ${n-1} to unlock</span>`}", "${save.cleared[n]?'<span class=\"done\">Cleared ✓</span>':''}")
rep("${first&&n<5?`<b>Room ${n+1}: ${ROOMS[n].name}</b> is now unlocked. The crowd there is tougher, so you may need a bigger toot from the fart menu.`:''}",
    "${n<5?`Next up: <b>Room ${n+1}: ${ROOMS[n].name}</b> (${Q5.ROOM_TOPICS[n]}). The crowd there is tougher, so you may need a bigger toot from the toot menu.`:''}${Cup.on()&&Cup.home()?` <b>+10 points for ${Cup.home()}!</b>`:''}")
rep("  try{if(window.ArcadeSend)ArcadeSend.round({level:'Room '+n+': '+G.T.name,score:save.beans,details:G.right+'/'+tot+' problems right, '+G.out+' people cleared, '+G.toots+' toots'})}catch(e){}\n",
    "  Cup.add(10);Cup.flush();\n")

# ---- math section ----
i = s.index('/* ================= math ================= */'); j = s.index('/* ================= panel UI ================= */')
s = s[:i] + open(os.path.join(HERE, 'math_ui.js')).read() + s[j:]

# ---- keyboard ----
rep("  if(e.key==='Escape'&&G.q.stage==='bonus'){e.preventDefault();skipBonus();return}",
    "  if(e.key==='Escape'&&G.q.stage==='bonus'){e.preventDefault();skipBonus();return}\n  if(G.q.p&&G.q.p.kind==='choice'&&G.q.stage!=='bonus'&&/^[1-9]$/.test(e.key)&&!(t&&t.tagName==='INPUT')){e.preventDefault();submit(+e.key-1);return}")
rep("    if(t.id==='an'&&!$('#ad').value){$('#ad').focus();return}", """    if(t.id==='aw'&&!t.value){$('#an').focus();return}
    if(t.id==='aw'&&($('#an').value||$('#ad').value)){$(!$('#an').value?'#an':'#ad').focus();if($('#an').value&&$('#ad').value)submit();return}
    if(t.id==='an'&&!$('#ad').value){$('#ad').focus();return}""")
rep("const order=['an','ad','bw','bn','bd'];", "const order=['aw','an','ad','bw','bn','bd'];")
rep("v=t.id==='a0'?v.replace(/[^\\d-]/g,'').replace(/(?!^)-/g,''):v.replace(/\\D/g,'');", "v=v.replace(/\\D/g,'');")
rep("  if(!G||!$('#title').hidden||!$('#won').hidden)return;", "  if(!G||!$('#title').hidden||!$('#won').hidden||!$('#homeroom').hidden)return;")

# ---- start a room: ask for the homeroom first ----
rep("function startRoom(n){ac();$('#title').hidden=true;$('#won').hidden=true;newGame(n)}",
    "function startRoom(n){ac();if(Cup.need()){Cup.ask(()=>startRoom(n));return}$('#title').hidden=true;$('#won').hidden=true;newGame(n)}")

# ---- Q5 bank before the game; Cup inside it ----
rep("<script>\n(function(){\nconst $=s=>document.querySelector(s);", "<script>\n" + q5 + "\n</script>\n<script>\n(function(){\nconst $=s=>document.querySelector(s);")
rep("/* ================= boot ================= */", "/* ================= class cup ================= */\n" + cup + "\n/* ================= boot ================= */")
rep("room=asked>=1&&asked<=5?asked:1;for(let n=5;n>=1;n--)if(!asked&&roomOpen(n)&&!save.cleared[n]){room=n;break}",
    "room=asked>=1&&asked<=5?asked:1;if(!asked)for(let n=1;n<=5;n++)if(!save.cleared[n]){room=n;break}   /* start at the first room not cleared yet */")
rep("renderRooms();newGame(room);", "renderRooms();newGame(room);Cup.start();")
rep("if(/[?&]debug\\b/.test(location.search)){window.__G=()=>G;", "if(/[?&]debug\\b/.test(location.search)){window.__G=()=>G;window.__Q=()=>G&&G.q.p;window.__submit=i=>submit(i);window.__Cup=Cup;")

# nothing from the 8th grade site may remain
for bad in ['arcade-send', 'tracker-config', 'site-bar', 'ArcadeSend', 'genInt', 'genFrac']:
    assert bad not in s, bad
open(out, 'w').write(s)
print('built', out, len(s), 'bytes')
