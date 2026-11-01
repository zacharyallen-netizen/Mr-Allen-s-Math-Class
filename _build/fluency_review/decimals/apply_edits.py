import sys
P = '/home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/fluency-lab/fluency-lab-decimals.html'
s = open(P, encoding='utf-8').read()

def R(old, new, count=1):
    global s
    n = s.count(old)
    if n != count:
        sys.exit(f'expected {count} match(es), found {n}:\n{old[:200]}')
    s = s.replace(old, new)

# ---------- CSS: hide empty step label, small helper for hidden slash ----------
R("""  .pips{display:inline-flex;""",
  """  .say .where:empty{display:none}
  .sr{display:none}
  .pips{display:inline-flex;""")

# ---------- start screen ----------
R("""    <div class="sub">Decimals &amp; Percents · Module 5</div>
    <ul class="how">
      <li>To add or subtract, <b>line up the points</b>. Then work one column at a time, from the right.</li>
      <li>To multiply, <b>ignore the point</b>. Put it back at the end.</li>
      <li>Only <b>one box</b> opens at a time. It glows.</li>
      <li>You are only racing <b>your own best score</b>.</li>
    </ul>
    <div class="example">
      <div class="ttl">Here is one worked out: 4.56 + 2.39</div>
      <div id="exPaper"></div>
      <div class="excap">The points line up in one column. The point drops straight down.<br>6 + 9 = 15: keep the 5, <b>carry the 1</b>. 5 + 3 + 1 = 9. 4 + 2 = 6. The answer is <b>6.95</b>.</div>
    </div>""",
  """    <div class="sub">Decimals &amp; Percents</div>
    <ul class="how">
      <li><b>Line up</b> the points.</li>
      <li>Fill the <b>glowing box</b>.</li>
    </ul>
    <div class="example">
      <div class="ttl">Example: 4.56 + 2.39</div>
      <div id="exPaper"></div>
      <div class="excap">Add from the right.<br>6 + 9 = 15: <b>carry the 1</b>.</div>
    </div>""")

# ---------- play area: drop the recap line and the Check: line ----------
R("""        <div class="did" id="did"></div>
""", "")
R("""        <div class="checkline" id="checkline"></div>
""", "")

# ---------- level 4 labels: same short form as level 5 ----------
R("""display:`<span class="lbl">Write</span> ${d.toFixed(2)} <span class="lbl">as a percent</span>`""",
  """display:`${d.toFixed(2)} <span class="lbl">as a percent</span>`""")
R("""display:`<span class="lbl">Write</span> ${p}% <span class="lbl">as a decimal</span>`""",
  """display:`${p}% <span class="lbl">as a decimal</span>`""")

# fraction keeps a hidden "/" so the saved label reads 1/3, not 13
R("""const FRC=(n,d)=>`<span class="frac"><span>${n}</span><span>${d}</span></span>`;""",
  """const FRC=(n,d)=>`<span class="frac"><span>${n}</span><span class="sr">/</span><span>${d}</span></span>`;""")

# ---------- + and − ----------
R("""    mv.push({kind:'tap',where:'Line up the points',button:'Line up',
      say:`The points are not lined up yet.`,sub:`Press <b>Line up</b> to slide <b>${x.toFixed(1)}</b> over.`,""",
  """    mv.push({kind:'tap',where:'',button:'Line up',
      say:`Line up the points.`,""")
R("""        B.shift=null; B.ptCls={}; draw(); return `Now the points are in one column. ${x.toFixed(1)} has an empty spot.`; }});
    mv.push({key:`${row}:${W-1}`,col:W-1,w:1,expect:0,where:'Line up the points',
      say:`Fill the empty spot with a <b>0</b>.`,sub:`<b>${x.toFixed(1)}</b> and <b>${x.toFixed(2)}</b> are the same amount.`,
      hint:`Type a 0. It holds the place.`,wrong:`${x.toFixed(1)} = ${x.toFixed(2)}`,""",
  """        B.shift=null; B.ptCls={}; draw(); return ''; }});
    mv.push({key:`${row}:${W-1}`,col:W-1,w:1,expect:0,where:'',
      say:`Type <b>0</b> in the empty spot.`,
      hint:`${x.toFixed(1)} = ${x.toFixed(2)}`,""")
R("""  mv.push({kind:'tap',where:'Point down',button:'Point down',col:-1,
    say:`The point in the answer goes straight down.`,sub:`Press <b>Point down</b>.`,
    run:async()=>{ draw(); await flyEl(qg(`bot:${W-3}`),qg(`ans:${W-3}`),'.',42); B.pt.ans=W-3; draw();
      return `The point is in the answer.`; }});
  const first=`Work like whole numbers, from the right.`;
""",
  """  mv.push({kind:'tap',where:'',button:'Point down',col:-1,
    say:`Bring the point straight down.`,
    run:async()=>{ draw(); await flyEl(qg(`bot:${W-3}`),qg(`ans:${W-3}`),'.',42); B.pt.ans=W-3; draw();
      return ''; }});
""")
R("""      const say=terms.length>1?`Add the <b>${name(gi)}</b>: <b>${expr}</b>`
        :terms.length===0?`Nothing to add in the <b>${name(gi)}</b>. Write a <b>0</b>.`
        :cin&&terms[0]===cin?`Only the carried <b>${cin}</b> is in the <b>${name(gi)}</b>. Write it down.`
        :`Nothing to add to the <b>${terms[0]}</b>. Bring it down.`;
      mv.push({key:`ans:${gi}`,col:gi,w:terms.length>1?2:1,expect:sum,where:`${name(gi)} column`,
        say,sub:cin&&terms.length>1?`The small <b>${cin}</b> is the carry.`:c===0?first:'',
        wrong:terms.length>1?`${expr} = ${sum}`:`It is just ${sum}`,partial:sum>=10?String(sum%10):null,
        hint:terms.length>1?'Not quite. Add the yellow numbers again, one at a time.':'Not quite. Copy the number down.',
        after:async()=>{
          if(sum>=10&&!last){ B.ans[gi]=sum%10; await flyK(`ans:${gi}`,`small:${gi-1}`,String(carryOut),24); B.small[gi-1]=carryOut;
            return `${sum} is too big for one box. Keep the <b>${sum%10}</b>. Carry the <b>${carryOut}</b>.`; }
          if(sum>=10&&last){ B.ans[gi]=sum%10; B.ans[gi-1]=Math.floor(sum/10); return `Last column, so write all of <b>${sum}</b>.`; }
          B.ans[gi]=sum; return ''; }});""",
  """      const say=terms.length>1?`Add the <b>${name(gi)}</b>: <b>${expr}</b>`
        :terms.length===0?`Write a <b>0</b>.`
        :`Bring down the <b>${terms[0]}</b>.`;
      mv.push({key:`ans:${gi}`,col:gi,w:terms.length>1?2:1,expect:sum,where:'',
        say,partial:sum>=10?String(sum%10):null,
        hint:terms.length>1?'Add the yellow numbers again.':'Copy the number down.',
        after:async()=>{
          if(sum>=10&&!last){ B.ans[gi]=sum%10; await flyK(`ans:${gi}`,`small:${gi-1}`,String(carryOut),24); B.small[gi-1]=carryOut; return ''; }
          if(sum>=10&&last){ B.ans[gi]=sum%10; B.ans[gi-1]=Math.floor(sum/10); return ''; }
          B.ans[gi]=sum; return ''; }});""")
R("""        mv.push({kind:'tap',where:`${name(gi)} column`,col:gi,button:'Borrow',
          say:again?`This digit lent 1 already, so it is <b>${was}</b> now. <b>${was}</b> is smaller than <b>${bot}</b>, so we <b>borrow</b> again.`
                   :`<b>${was}</b> is smaller than <b>${bot}</b>. We need to <b>borrow</b>.`,
          sub:`Press <b>Borrow</b> to watch it happen.`+(zeros.length?` The 0 next to it has nothing to lend, so we go to the <b>${lendWas}</b>.`:''),
          run:async(show)=>{
            B.struck[j]=true; B.small[j]=jNew; draw(); show(`The <b>${lendWas}</b> lends 1 and becomes <b>${jNew}</b>.`); await wait(1100);
            for(const k of zeros){ B.struck[k]=true; B.small[k]=10; draw(); show(`The 0 gets 10…`); await wait(900);
              B.small[k]=9; draw(); show(`…then it lends 1, so it is <b>9</b>.`); await wait(1000); }
            await flyK(`top:${gi-1}`,`small:${gi}`,'+10',24);
            B.struck[gi]=true; B.small[gi]=gNew; draw();
            return `The <b>${was}</b> becomes <b>${gNew}</b>. Now we can subtract.`; }});""",
  """        mv.push({kind:'tap',where:'',col:gi,button:'Borrow',
          say:`<b>${was}</b> is less than <b>${bot}</b>. Borrow.`,
          run:async()=>{
            B.struck[j]=true; B.small[j]=jNew; draw(); await wait(1100);
            for(const k of zeros){ B.struck[k]=true; B.small[k]=10; draw(); await wait(900);
              B.small[k]=9; draw(); await wait(1000); }
            await flyK(`top:${gi-1}`,`small:${gi}`,'+10',24);
            B.struck[gi]=true; B.small[gi]=gNew; draw();
            return ''; }});""")
R("""      const t=now[gi], diff=t-bot, lentEarlier=lent[gi]&&!borrowedHere;
      const leadZero=(c===n-1&&diff===0&&gi<W-3);       // a 0 in front of the ones place is not written
      mv.push({key:`ans:${gi}`,col:gi,w:1,expect:diff,where:`${name(gi)} column`,
        say:(hasBot&&bot!==0)?`Subtract the <b>${name(gi)}</b>: <b>${t} − ${bot}</b>`:`Nothing to take away. Bring down the <b>${t}</b>.`,
        sub:lentEarlier?`This digit lent 1 already. Use the small <b>${t}</b> on top.`:(c===0&&!borrowedHere)?first:'',
        hint:(hasBot&&bot!==0)?'Not quite. Tip: count up from the bottom number to the top number.':'Not quite. Copy the top number down.',
        wrong:(hasBot&&bot!==0)?`${t} − ${bot} = ${diff}`:`It is just ${diff}`,
        after:async()=>{ B.ans[gi]=diff;
          if(leadZero){ draw(); await wait(500); B.fade.add(`ans:${gi}`); return `We don’t write a 0 at the front of a number, so it disappears.`; }
          return ''; }});""",
  """      const t=now[gi], diff=t-bot;
      const leadZero=(c===n-1&&diff===0&&gi<W-3);       // a 0 in front of the ones place is not written
      mv.push({key:`ans:${gi}`,col:gi,w:1,expect:diff,where:'',
        say:(hasBot&&bot!==0)?`Subtract the <b>${name(gi)}</b>: <b>${t} − ${bot}</b>`:`Bring down the <b>${t}</b>.`,
        hint:(hasBot&&bot!==0)?`Count up from ${bot} to ${t}.`:'Copy the top number down.',
        after:async()=>{ B.ans[gi]=diff;
          if(leadZero){ draw(); await wait(500); B.fade.add(`ans:${gi}`); }
          return ''; }});""")

# ---------- × ----------
R("""    mv.push({key:`ans:${gi}`,col:gi,w:2,expect:v,where:'Multiply',hot:[`top:${gi}`,`bot:${W-1}`],
      say:cin?`Multiply <b>${da} × ${d}</b>, then add the carried <b>${cin}</b>`:`Multiply: <b>${da} × ${d}</b>`,
      sub:c===0?`Ignore the point${pb?'s':''} for now. Multiply like whole numbers.`:'',
      wrong:`${expr} = ${v}`,partial:v>=10?String(v%10):null,hint:'Not quite. Multiply the yellow numbers again.',
      after:async()=>{
        if(v>=10&&!last){ B.ans[gi]=v%10; await flyK(`ans:${gi}`,`small:${gi-1}`,String(carryOut),24); B.small[gi-1]=carryOut;
          return `${v} is too big for one box. Keep the <b>${v%10}</b>. Carry the <b>${carryOut}</b>.`; }
        if(v>=10&&last){ B.ans[gi]=v%10; B.ans[gi-1]=Math.floor(v/10); return `Last digit, so write all of <b>${v}</b>.`; }
        B.ans[gi]=v; return ''; }});""",
  """    mv.push({key:`ans:${gi}`,col:gi,w:2,expect:v,where:'',hot:[`top:${gi}`,`bot:${W-1}`],
      say:cin?`<b>${da} × ${d}</b>, then add the carried <b>${cin}</b>.`:`Multiply <b>${da} × ${d}</b>. Ignore the point${pb?'s':''}.`,
      partial:v>=10?String(v%10):null,hint:cin?`${da} × ${d} = ${da*d}. Then add ${cin}.`:'Multiply the yellow numbers again.',
      after:async()=>{
        if(v>=10&&!last){ B.ans[gi]=v%10; await flyK(`ans:${gi}`,`small:${gi-1}`,String(carryOut),24); B.small[gi-1]=carryOut; return ''; }
        if(v>=10&&last){ B.ans[gi]=v%10; B.ans[gi-1]=Math.floor(v/10); return ''; }
        B.ans[gi]=v; return ''; }});""")
R("""  const mv=[], aT=p.a.toFixed(1), bT=pb?p.b.toFixed(1):String(p.b); let carry=0;""",
  """  const mv=[]; let carry=0;""")
R("""  mv.push({key:'pl',expect:P,w:1,where:'Put the point back',hot:after,
    say:pb?`Count the digits after the points in <b>${aT}</b> and <b>${bT}</b>.`:`Count the digits after the point in <b>${aT}</b>.`,
    sub:`The answer gets that many digits after its point.`,
    hint:'Not quite. Count only the yellow digits.',wrong:pb?`1 + 1 = 2`:`${aT} has 1 digit after the point`,
    after:async()=>{ B.ptCls={top:'',bot:''}; B.hot=new Set(); draw();
      await flyEl(qk(`ans:${W-1}`),qg(`ans:${W-1-P}`),'.',42); B.pt.ans=W-1-P; draw();
      let note=`${P} place${P>1?'s':''}: the point goes <b>${P}</b> digit${P>1?'s':''} in from the right.`;
      if(B.ans[W-1-P]==null){ await wait(400); B.ans[W-1-P]=0; B.ph=`ans:${W-1-P}`; note+=` Nothing is in the ones place, so write a <b>0</b> there.`; }
      return note; }});""",
  """  mv.push({key:'pl',expect:P,w:1,where:'',hot:after,
    say:`Count the digits after the point${pb?'s':''}.`,
    hint:'Count only the yellow digits.',
    after:async()=>{ B.ptCls={top:'',bot:''}; B.hot=new Set(); draw();
      await flyEl(qk(`ans:${W-1}`),qg(`ans:${W-1-P}`),'.',42); B.pt.ans=W-1-P; draw();
      if(B.ans[W-1-P]==null){ await wait(400); B.ans[W-1-P]=0; B.ph=`ans:${W-1-P}`; }
      return ''; }});""")

# ---------- ÷ by a whole number ----------
R("""  mv.push({kind:'tap',where:'Point up',button:'Point up',
    say:`The point in the answer goes straight up.`,sub:`Press <b>Point up</b>.`,
    run:async()=>{ draw(); await flyEl(qg(`div:${W-2}`),qg(`q:${W-2}`),'.',42); B.pt.q=W-2; draw();
      return `The point is in the answer.`; }});
  let rem=0, started=false, skip='', from=0;
  for(let i=0;i<W;i++){
    const cur=rem*10+D[i];
    if(!started && cur<p.d && i<W-1){ skip=`${p.d} does not fit in ${D[i]}. Use <b>${cur*10+D[i+1]}</b>.`; rem=cur; continue; }""",
  """  mv.push({kind:'tap',where:'',button:'Point up',
    say:`Bring the point straight up.`,
    run:async()=>{ draw(); await flyEl(qg(`div:${W-2}`),qg(`q:${W-2}`),'.',42); B.pt.q=W-2; draw();
      return ''; }});
  let rem=0, started=false, from=0;
  for(let i=0;i<W;i++){
    const cur=rem*10+D[i];
    if(!started && cur<p.d && i<W-1){ rem=cur; continue; }""")
R("""    const nextD=D[i+1], i0=i;
    mv.push({key:`q:${i}`,w:1,expect:q,where:'Divide',hot,
      say:`How many <b>${p.d}s</b> fit in <b>${cur}</b>?`,sub:skip||(!mv.some(x=>x.key&&x.key.startsWith('q:'))?'Divide like whole numbers, one digit at a time.':''),
      hint:`Not quite. Count by ${p.d}s: ${p.d}, ${2*p.d}, ${3*p.d}, …`,
      wrong:q>1?`${p.d} × ${q} = ${q*p.d}. That is the most that fits in ${cur}`:q===1?`${p.d} fits in ${cur} only once`:`${p.d} does not fit in ${cur}, so it is 0`,
      after:async()=>{ B.q[i0]=q;
        if(i0===W-1) return '';
        if(r>0){ draw(); await flyEl(qk(`q:${i0}`),qk(`div:${i0+1}`),String(r),20); B.rem[i0+1]=r;
          return (q===1?`One ${p.d} fits. ${cur} − ${p.d}`:`${p.d} × ${q} = ${q*p.d}. ${cur} − ${q*p.d}`)+` = <b>${r}</b> left over. It goes next to the <b>${nextD}</b>.`; }
        return (q===1?`One ${p.d} fits`:`${p.d} × ${q} = ${q*p.d}`)+`. Nothing left over.`; }});
    skip=''; rem=r; from=i+1;""",
  """    const i0=i;
    mv.push({key:`q:${i}`,w:1,expect:q,where:'',hot,
      say:`How many <b>${p.d}s</b> fit in <b>${cur}</b>?`,
      hint:`Count by ${p.d}s: ${p.d}, ${2*p.d}, ${3*p.d}, …`,
      after:async()=>{ B.q[i0]=q;
        if(i0===W-1) return '';
        if(r>0){ draw(); await flyEl(qk(`q:${i0}`),qk(`div:${i0+1}`),String(r),20); B.rem[i0+1]=r; }
        return ''; }});
    rem=r; from=i+1;""")

# ---------- LINE work ----------
R("""  L.push(WL(`${PN(A,'na')}<span class="opx">÷</span>${PN(Bn,'nb')}`));
  if(S.moved) L.push(WL(`${EQ}${V(K('q'))}`));
  return L; }""",
  """  L.push(WL(`${PN(A,'na')}<span class="opx">÷</span>${PN(Bn,'nb')}${S.moved?EQ+V(K('q')):''}`));
  return L; }""")
# long division rows: only the row being worked on (and, while a number flies, the row it flies from)
R("""  t.rows.forEach((r,i)=>{ if(!(O==='q'+i||S['q'+i]!=null||('w'+i in S))) return;""",
  """  let cr=-1; t.rows.forEach((r,i)=>{ if(O==='q'+i||O==='r'+i||S['q'+i]!=null||('w'+i in S)) cr=i; });
  t.rows.forEach((r,i)=>{ if(S.done||O==='rep'||S.rep!=null||!(i===cr||i===S.prevRow)) return;""")
R("""    L.push(WL(`${w}<span class="opx">÷</span>${p.fd}${EQ}${V(K('q'+i))}<span class="opx${(O==='r'+i||S['r'+i]!=null)?'':' ghost'}" style="${(O==='r'+i||S['r'+i]!=null)?'':'visibility:hidden'}">r</span>${V(K('r'+i))}`,'small'+(cur?'':' past')));
  });
  if(O==='rep'||S.rep!=null) L.push(WL(`repeats: ${V(K('rep'))}`,'small'));""",
  """    L.push(WL(`${w}<span class="opx">÷</span>${p.fd}${EQ}${V(K('q'+i))}<span class="opx${(O==='r'+i||S['r'+i]!=null)?'':' ghost'}" style="${(O==='r'+i||S['r'+i]!=null)?'':'visibility:hidden'}">r</span>${V(K('r'+i))}`,'small'+(cur?'':' past')));
  });
  if(O==='rep') L.push(WL(`repeats: ${V(K('rep'))}`,'small'));""")
R("""function pofLines(p){ const L=[WL(`${p.p}%${EQ}${V(K('dec'))}`, S.dec!=null?'small':'')];
  if(S.dec!=null) L.push(WL(`${fmt(p.p/100)} × ${p.base}${EQ}${V(K('ans'))}`));
  return L; }""",
  """function pofLines(p){   // once 25% is 0.25, the 25% line is gone: only 0.25 × 80 is left
  if(S.dec==null) return [WL(`${p.p}%${EQ}${V(K('dec'))}`)];
  return [WL(`${fmt(p.p/100)} × ${p.base}${EQ}${V(K('ans'))}`)]; }""")

R("""    mv.push({kind:'tap',where:'Make it a whole number',button:'Move points',hot:['na','nb'],
      say:`Make <b>${bT}</b> a whole number. Move both points <b>1 place right</b>.`,
      sub:`That is × 10 for both numbers. The answer stays the same.`,
      run:async()=>{ draw(); await Promise.all([hop('na',{pt:aT.indexOf('.')},1),hop('nb',{pt:1},1)]); S.moved=1; JUST=new Set(); draw();
        return `${aT} ÷ ${bT} is the same as <b>${ai} ÷ ${bi}</b>.`; }});
    mv.push({key:'q',expect:p.q,w:String(p.q).length,where:'Divide',say:`Divide: <b>${ai} ÷ ${bi}</b>`,
      hint:`Not quite. Think: ${bi} × ? = ${ai}.`,wrong:`${ai} ÷ ${bi} = ${p.q}`});""",
  """    mv.push({kind:'tap',where:'',button:'Move points',hot:['na','nb'],
      say:`Move both points <b>1 place right</b>.`,
      run:async()=>{ draw(); await Promise.all([hop('na',{pt:aT.indexOf('.')},1),hop('nb',{pt:1},1)]); S.moved=1; JUST=new Set(); draw();
        return ''; }});
    mv.push({key:'q',expect:p.q,w:String(p.q).length,where:'',say:`Divide: <b>${ai} ÷ ${bi}</b>`,
      hint:`Think: ${bi} × ? = ${ai}`});""")
R("""const ai=Math.round(p.a*10), bi=Math.round(p.b*10), aT=p.a.toFixed(1), bT=p.b.toFixed(1);""",
  """const ai=Math.round(p.a*10), bi=Math.round(p.b*10), aT=p.a.toFixed(1);""")
R("""      mv.push({key:'q'+i,expect:r.dig,w:1,where:'Divide',hot:i===0?['w0']:['w'+i],
        say:`How many <b>${p.fd}s</b> fit in <b>${r.w}</b>?`,
        sub:i===0?`${p.fd} does not fit in ${p.fn}, so the answer starts <b>0.</b> Put a 0 on the ${p.fn} to make <b>${r.w}</b>.`:'',
        hint:`Not quite. Count by ${p.fd}s: ${p.fd}, ${2*p.fd}, ${3*p.fd}, …`,
        wrong:r.dig>1?`${p.fd} × ${r.dig} = ${p.fd*r.dig}. That is the most that fits in ${r.w}`:`${p.fd} fits in ${r.w} only once`,
        fly:['q'+i,'a'+i]});
      mv.push({key:'r'+i,expect:r.rem,w:1,where:'Left over',hot:['q'+i],
        say:`What is left over? <b>${r.w} − ${p.fd*r.dig}</b>`,sub:(r.dig>1?`${p.fd} × ${r.dig} = ${p.fd*r.dig}. `:'')+(i===0?`(<b>r</b> means left over.)`:''),
        hint:'Not quite. Subtract again.',wrong:`${r.w} − ${p.fd*r.dig} = ${r.rem}`,
        after:async()=>{
          if(r.rem===0) return `Nothing left over, so the decimal stops here.`;
          if(last) return `<b>${r.rem}</b> again! We had it before, so the same digit will come back forever.`;
          S['w'+(i+1)]=null; draw(); await flyEl(qk('r'+i),qk('w'+(i+1)),String(r.rem*10),22); S['w'+(i+1)]=r.rem*10;
          return `${r.rem} left over. Put a 0 on it: <b>${r.rem*10}</b>.`; }});
    });
    if(p.kind==='f2r') mv.push({key:'rep',expect:+t.rep,w:1,where:'It repeats',
      say:`Which digit keeps repeating?`,sub:`We draw a bar over it.`,hint:'Not quite. Look at the answer digits.',wrong:`The ${t.rep} repeats: 0.${t.lead}${t.rep}${t.rep}${t.rep}…`,
      after:async()=>{ S.bar=1; return `0.${t.lead}${t.rep}${t.rep}${t.rep}… is written with a bar over the <b>${t.rep}</b>.`; }});""",
  """      mv.push({key:'q'+i,expect:r.dig,w:1,where:'',hot:i===0?['w0']:['w'+i],
        say:`How many <b>${p.fd}s</b> fit in <b>${r.w}</b>?`,
        hint:`Count by ${p.fd}s: ${p.fd}, ${2*p.fd}, ${3*p.fd}, …`,
        fly:['q'+i,'a'+i]});
      mv.push({key:'r'+i,expect:r.rem,w:1,where:'',hot:['q'+i],
        say:`Left over: <b>${r.w} − ${p.fd*r.dig}</b>`,
        hint:'Subtract again.',
        after:async()=>{
          if(r.rem===0||last) return '';
          S.prevRow=i; S['w'+(i+1)]=null; draw(); await flyEl(qk('r'+i),qk('w'+(i+1)),String(r.rem*10),22); S['w'+(i+1)]=r.rem*10;
          delete S.prevRow; return ''; }});
    });
    if(p.kind==='f2r') mv.push({key:'rep',expect:+t.rep,w:1,where:'',
      say:`Which digit repeats?`,hint:'Look at the digits after the point.',
      after:async()=>{ S.bar=1; return ''; }});""")
R("""    mv.push({key:'pc',expect:p.ans,w:2,where:'Decimal → percent',hot:['nd'],
      say:`Move the point <b>2 places right</b>: <b>${dT} × 100</b>`,sub:`Percent means "out of 100."`,
      hint:`Not quite. ${dT} × 100: the point moves 2 places right.`,wrong:`${dT} × 100 = ${p.ans}`,""",
  """    mv.push({key:'pc',expect:p.ans,w:2,where:'',hot:['nd'],
      say:`Move the point <b>2 places right</b>.`,
      hint:`Count 2 places to the right.`,""")
R("""    mv.push({key:'dec',expect:p.ans,w:3,dec:true,where:'Percent → decimal',hot:['np'],
      say:`Move the point <b>2 places left</b>: <b>${p.p} ÷ 100</b>`,
      sub:`The point in <b>${p.p}</b> is hiding at the end: <b>${p.p}.</b>`+(p.p<10?` Fill empty places with 0.`:''),
      hint:`Not quite. Start at ${p.p}. and move the point 2 places left.`,wrong:`${p.p} ÷ 100 = ${fmt(p.ans)}`,""",
  """    mv.push({key:'dec',expect:p.ans,w:3,dec:true,where:'',hot:['np'],
      say:`Move the point <b>2 places left</b>.`,
      sub:p.p<10?`Fill empty places with 0.`:'',
      hint:`Count 2 places to the left.`,""")
R("""    mv.push({key:'dec',expect:dec,w:3,dec:true,where:'Percent → decimal',
      say:`First write <b>${p.p}%</b> as a decimal: <b>${p.p} ÷ 100</b>`,sub:`Move the point 2 places left.`,
      hint:`Not quite. ${p.p} ÷ 100: the point moves 2 places left.`,wrong:`${p.p} ÷ 100 = ${fmt(dec)}`});
    mv.push({key:'ans',expect:p.ans,w:3,dec:true,where:'Multiply',
      say:`Now multiply: <b>${fmt(dec)} × ${p.base}</b>`,sub:`That is the same as <b>${p.p} × ${p.base} ÷ 100</b>.`,
      hint:`Not quite. Try ${p.p} × ${p.base}, then ÷ 100.`,wrong:`${fmt(dec)} × ${p.base} = ${fmt(p.ans)}`});""",
  """    mv.push({key:'dec',expect:dec,w:3,dec:true,where:'',
      say:`Write <b>${p.p}%</b> as a decimal.`,
      hint:`Move the point 2 places left.`});
    mv.push({key:'ans',expect:p.ans,w:3,dec:true,where:'',
      say:`Multiply: <b>${fmt(dec)} × ${p.base}</b>`,
      hint:`Multiply again. Watch the point.`});""")

# ---------- check line removed ----------
s_start = s.index("function checkLine(p){")
s_end = s.index("/* ════════ playing one problem ════════ */")
s = s[:s_start] + s[s_end:]
R("""/* ---- the answer, and the exact "does it make sense?" line ---- */""",
  """/* ---- the answer, and the finished problem ---- */""")
R("""  $('checkline').classList.remove('show'); $('checkline').innerHTML='';
""", "")

# ---------- one instruction at a time ----------
R("""  $('where').innerHTML=whereHTML(m.where);
  $('did').innerHTML=note?'✓ '+note:'';
  $('msg').innerHTML=m.say;""",
  """  $('where').innerHTML=whereHTML(m.where);
  $('msg').innerHTML=m.say;""")
R("""  return `<span>${w}</span><span class="pips\"""",
  """  return `<span>${w||''}</span><span class="pips\"""")
R("""  const note=await m.run(t=>{ $('sub').innerHTML=t; });""",
  """  const note=await m.run();""")
R("""    if(m.partial && v===m.partial) $('fb').innerHTML=`Close! Type the <b>whole</b> answer (both digits). We carry next.`;
    else if(M.tries===1) $('fb').innerHTML=m.hint||'Not quite. Try again.';
    else { $('fb').innerHTML=`${m.wrong}. Type <b>${fmt(m.expect)}</b> to keep going.`; box.placeholder=fmt(m.expect); }""",
  """    if(m.partial && v===m.partial && M.tries===1) $('fb').innerHTML=`Type <b>both</b> digits.`;
    else if(M.tries===1) $('fb').innerHTML=m.hint||'Try again.';
    else { $('fb').innerHTML=`Type <b>${fmt(m.expect)}</b>.`; box.placeholder=fmt(m.expect); }""")
R("""  if(v===''||v==='.'){ $('fb').textContent='Type a number in the glowing box.';""",
  """  if(v===''||v==='.'){ $('fb').textContent='Type a number first.';""")
R("""  if(k===pt) B.ptCls.ans='fade';
  const full=digs.slice(0,pt+1)+'.'+digs.slice(pt+1);
  return `<b>${full}</b> is the same as <b>${fmt(full)}</b>. Zeros at the end, after the point, can go.`;
}""",
  """  if(k===pt) B.ptCls.ans='fade';
  return '';
}""")
R("""  const digs=B.ans.map(d=>d==null?'':d).join(''); let k=W-1, dropped=0;""",
  """  let k=W-1, dropped=0;""")
R("""function finish(note){
  O=null; HOT=[]; if(B){ B.col=-1; B.hot=new Set(); }
  const t=tidyEnd(); draw();
  const right=!M.err, p=current;
  $('where').textContent='Done'; $('did').innerHTML='';
  $('msg').innerHTML=(right?'✓ Solved it! ':'✓ Done. ')+`<b>${exprText(p)}</b>`;
  $('sub').innerHTML=[note,t].filter(Boolean).join(' ');
  $('fb').textContent=''; $('fb').className='fb';
  $('checkline').innerHTML=checkLine(p); $('checkline').classList.add('show');
  concludeProblem(right, $('go'));""",
  """function finish(){
  O=null; HOT=[]; if(B){ B.col=-1; B.hot=new Set(); } else S.done=1;
  tidyEnd(); draw();
  const right=!M.err, p=current;
  $('where').innerHTML='';
  $('msg').innerHTML=`✓ <b>${exprText(p)}</b>`;
  $('sub').innerHTML='';
  $('fb').textContent=''; $('fb').className='fb';
  concludeProblem(right, $('go'));""")
R("""  if(M.i>=M.mv.length) finish(note); else showMove(note);
}
async function runAfter""",
  """  if(M.i>=M.mv.length) finish(); else showMove();
}
async function runAfter""")
R("""  const note=await runAfter(m);
  M.busy=false; M.i++; G.si=M.i;
  if(M.i>=M.mv.length) finish(note); else showMove(note);""",
  """  await runAfter(m);
  M.busy=false; M.i++; G.si=M.i;
  if(M.i>=M.mv.length) finish(); else showMove();""")
R("""function showMove(note){""", """function showMove(){""")

# ---------- summary ----------
R("""pb.textContent='Personal best this visit: '+sessionBest+'/10';""",
  """pb.textContent='Best this visit: '+sessionBest+'/10';""")
R("""  $('s-note').textContent=correctCount>=9?'Excellent! The point lands in the right place every time.':correctCount>=7?'Strong set. A few more first-try answers and you level up.':correctCount>=5?'Good work. Line up the points, and count the decimal places.':'Every problem showed you the steps. Go again — it gets easier.';}""",
  """  $('s-note').textContent=correctCount>=9?'Excellent set!':correctCount>=7?'Strong set.':correctCount>=5?'Good work. Keep going.':'Go again. It gets easier.';}""")

open(P, 'w', encoding='utf-8').write(s)
print('ok')
