/* ================= math (5th grade: questions come from Q5) ================= */
const frH=Q5.frH;
const gen=lv=>Q5.gen(lv);
function fracBoxes(pre,label){return `<span class="fbox"><input class="box sm" id="${pre}n" type="text" inputmode="numeric" autocomplete="off" aria-label="${label} numerator" maxlength="3"><span class="bar"></span><input class="box sm" id="${pre}d" type="text" inputmode="numeric" autocomplete="off" aria-label="${label} denominator" maxlength="3"></span>`}
function mixedBoxes(pre,label){return `<span class="mixed"><input class="box sm whole" id="${pre}w" type="text" inputmode="numeric" autocomplete="off" aria-label="${label}: whole number part, leave blank if none" maxlength="3">${fracBoxes(pre,label)}</span>`}
function readInt(id){const el=$('#'+id);if(!el)return null;const v=(el.value||'').replace(/[−–]/g,'-').trim();if(!/^[+-]?\d+$/.test(v))return null;return parseInt(v,10)}
function refocus(){if(!G)return;
  if(G.q.p&&G.q.p.kind==='choice'&&G.q.stage!=='bonus'){const b=document.querySelector('#answer .ch:not(.no)');if(b)b.focus({preventScroll:true});return}
  const sel=G.q.stage==='bonus'?'#bonusA input':'#answer input';const ins=[...document.querySelectorAll(sel)];
  /* a fraction answer starts in the numerator box (the whole-number box is optional) */
  const empty=ins.find(i=>!i.value&&i.id!=='aw')||ins.find(i=>!i.value)||ins[0];
  if(empty)empty.focus({preventScroll:true})}
function flashFb(t,cls){const f=$('#fb');f.className='fb '+(cls||'');f.innerHTML=t}
function nextQ(){
  const Q=G.q;let p=null;
  if(Q.queue.length&&Q.queue[0].due<=Q.seen)p=Q.queue.shift().p;
  if(!p){for(let k=0;k<20;k++){p=gen(G.n);if(p.key!==Q.lastKey)break}}
  Q.lastKey=p.key;Q.seen++;Q.p=p;Q.stage='main';Q.busy=false;
  if($('#fb').classList.contains('bad'))flashFb('','');   /* the last mistake note was read; start clean */
  const txt=/ptxt/.test(p.html);
  $('#prob').className='prob'+(txt?' small':'');
  $('#prob').innerHTML=p.html+(txt?'':'<span class="eq">?</span>');$('#prob').dataset.seq=Q.seen;
  $('#fig').innerHTML=p.fig||'';
  $('#bonus').hidden=true;
  const unit=p.unit?`<span class="unit">${p.unit}</span>`:'';
  if(p.kind==='num'){$('#answer').innerHTML='<input class="box" id="a0" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" aria-label="Your answer" maxlength="5">'+unit;
    $('#keys').innerHTML='<kbd>Enter</kbd> checks · <kbd>T</kbd> toots'}
  else if(p.kind==='choice'){$('#answer').innerHTML='<div class="choices">'+p.choices.map((c,i)=>`<button type="button" class="ch" data-i="${i}"><kbd>${i+1}</kbd>${c}</button>`).join('')+'</div>';
    $('#keys').innerHTML='Tap an answer or press <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> · <kbd>T</kbd> toots'}
  else{$('#answer').innerHTML=mixedBoxes('a','Answer')+unit+'<div class="alab" style="flex-basis:100%">whole number (if any) · fraction</div>';
    $('#keys').innerHTML='<kbd>/</kbd> moves to the next box · <kbd>Enter</kbd> checks · <kbd>T</kbd> toots'}
  refocus();
}
/* the value in the mixed-number boxes: {v:[N,D], w, n, d}, or what is missing */
function readMixed(pre){
  const w=readInt(pre+'w'),n=readInt(pre+'n'),d=readInt(pre+'d');
  if(w===null&&n===null&&d===null)return {empty:true};
  if(n===null&&d===null)return {v:[w,1],w,n:null,d:null};
  if(n===null)return {focus:pre+'n'};if(d===null)return {focus:pre+'d'};
  if(d===0)return {zero:true};
  return {v:[(w||0)*d+n,d],w,n,d};
}
function submit(choiceIdx){
  if(!G||G.won||G.q.busy)return;const Q=G.q;
  if(Q.stage==='bonus')return submitBonus();
  const p=Q.p;let ok;
  if(p.kind==='num'){const v=readInt('a0');if(v===null){refocus();return}ok=v===p.ans;Q.given=[v,1]}
  else if(p.kind==='choice'){if(choiceIdx==null||choiceIdx>=p.choices.length)return;const b=document.querySelector(`#answer .ch[data-i="${choiceIdx}"]`);if(!b||b.classList.contains('no'))return;
    ok=choiceIdx===p.ans;Q.given=choiceIdx;b.classList.add(ok?'yes':'no')}
  else{const r=readMixed('a');if(r.empty){refocus();return}if(r.focus){$('#'+r.focus).focus();return}
    if(r.zero){flashFb('A denominator can’t be 0.','bad');return}
    ok=Q5.eqv(r.v,p.ans);Q.given=r}
  if(ok)right();else wrong();
}
function addBeans(k){save.beans+=k;G.beansHere+=k;persist();renderShop()}
function right(){
  G.right++;addBeans(1);SND.ding();Cup.add(1);
  G.gasPips++;if(G.gasPips>=5){G.gasPips=0;G.gas++;SND.charge();flashFb('Gas meter full! +1 toot. Walk to a crowd and press T.','ok');floatText(G.player.x,G.player.y-30,'+1 GAS','#d6ff9e')}
  else flashFb(pick(['Right!','Yes!','Correct!','Nice!']),'ok');
  renderMeter();
  if(G.q.p.kind==='frac'&&offerBonus())return;
  G.q.busy=true;setTimeout(()=>{if(G&&!G.won)nextQ()},RM?40:(G.q.p.kind==='choice'?700:260));
}
function wrong(){
  G.wrong++;const Q=G.q,p=Q.p;pfft();
  if(!p.retry){p.retry=true;Q.queue.push({p,due:Q.seen+3})}
  let note='';try{note=p.kind==='choice'?p.why(Q.given):p.why(Q.given.v||Q.given)}catch(e){}
  if(p.kind==='choice'){const b=document.querySelector(`#answer .ch[data-i="${p.ans}"]`);if(b)b.classList.add('yes')}
  flashFb(`pfft. Not quite.${note?`<span class="note">${note}</span>`:''}${p.kind==='choice'?'':`<span class="ans">Answer: ${p.show}</span>`}`,'bad');
  const long=(note+(p.show||'')).replace(/<[^>]+>/g,'').length;
  Q.busy=true;setTimeout(()=>{if(G&&!G.won)nextQ()},RM?900:Math.min(7500,(note?4200:2600)+Math.max(0,long-90)*25));
}
/* bonus beans after a right fraction answer: whole number / mixed number / simplest form */
function offerBonus(){
  const Q=G.q,[N,D]=Q.p.ans,g=Q5.gcd(N,D),rn=N/g,rd=D/g,r=Q.given;
  const hasFrac=r.n!==null&&r.n!==0;
  let type=null;
  if(rd===1){if(hasFrac)type='whole'}
  else if(rn>rd){if(!r.w||r.n>=r.d||Q5.gcd(r.n,r.d)!==1)type='mixed'}
  else if(hasFrac&&Q5.gcd(r.n,r.d)!==1)type='simplify';
  if(!type)return false;
  const notSimple=r.n!==null&&r.n%r.d!==0&&Q5.gcd(r.n%r.d,r.d)!==1;
  Q.stage='bonus';Q.btype=type;Q.bans={rn,rd,w:Math.floor(rn/rd),fn:rn%rd,needSimp:notSimple};
  $('#bonus').hidden=false;
  if(type==='whole'){$('#bonusT').textContent='Bonus beans: it’s a whole number. Which one?';$('#bonusA').innerHTML='<input class="box" id="bw" type="text" inputmode="numeric" autocomplete="off" aria-label="Whole number" maxlength="3">'}
  else if(type==='mixed'){$('#bonusT').textContent=Q.bans.needSimp?'Bonus beans: write it as a mixed number. Simplest form = double beans.':'Bonus beans: write it as a mixed number in simplest form.';
    $('#bonusA').innerHTML=`<span class="mixed"><input class="box sm" id="bw" type="text" inputmode="numeric" autocomplete="off" aria-label="Whole number part" maxlength="2">${fracBoxes('b','Fraction part')}</span>`}
  else{$('#bonusT').textContent='Bonus beans: simplify it.';$('#bonusA').innerHTML=fracBoxes('b','Simplified')}
  $('#keys').innerHTML='<kbd>Enter</kbd> checks the bonus · <kbd>Esc</kbd> skips it';
  refocus();return true;
}
function submitBonus(){
  const Q=G.q,t=Q.btype,A=Q.bans;let earned=0,ok=false,show='';
  if(t==='whole'){const w=readInt('bw');if(w===null)return skipBonus();ok=w===A.w;earned=ok?1:0;show=String(A.w)}
  else if(t==='mixed'){const w=readInt('bw'),n=readInt('bn'),d=readInt('bd');
    if(w===null&&n===null&&d===null)return skipBonus();
    if(w===null){$('#bw').focus();return}if(n===null){$('#bn').focus();return}if(d===null){$('#bd').focus();return}
    ok=d>0&&n>0&&n<d&&w===A.w&&n*A.rd===A.fn*d;if(ok)earned=(A.needSimp&&Q5.gcd(n,d)===1)?2:1;show=`${A.w} ${frH(A.fn,A.rd)}`}
  else{const n=readInt('bn'),d=readInt('bd');if(n===null&&d===null)return skipBonus();if(n===null){$('#bn').focus();return}if(d===null){$('#bd').focus();return}
    ok=n===A.rn&&d===A.rd;earned=ok?1:0;show=frH(A.rn,A.rd)}
  Q.busy=true;
  if(ok){addBeans(earned*2);SND.bean();flashFb(`Bonus! +${earned*2} beans`,'ok');setTimeout(()=>{if(G&&!G.won)nextQ()},RM?40:500)}
  else{flashFb(`Bonus answer: ${show}`,'bad');setTimeout(()=>{if(G&&!G.won)nextQ()},RM?400:1400)}
}
function skipBonus(){G.q.busy=true;nextQ()}
$('#answer').addEventListener('click',e=>{const b=e.target.closest('.ch');if(b)submit(+b.dataset.i)});

