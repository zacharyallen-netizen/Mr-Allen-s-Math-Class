/* CLASS CUP: class totals only. Runs only inside the teacher's Google Apps Script web app (google.script.run).
   The student picks a homeroom (saved on this Chromebook). Right answers add points; points are sent in small batches
   (every 20 s, at the end of a room, and when the tab is hidden). Nothing about the student is sent: only
   {homeroom, points}. If the server can't be reached, points wait on this Chromebook and are sent later. */
const Cup=(function(){
  const GS=(()=>{try{return !!(window.google&&google.script&&google.script.run)}catch(e){return false}})();
  let classes=['Ms. Tesnar','Ms. Covalt'],board=null,sending=false,boardMode=false,failed=0;
  /* points not sent yet, per homeroom: {"Ms. Tesnar": 3} */
  let pend={};try{pend=JSON.parse(localStorage.getItem('sc5-pending')||'{}')||{};if(typeof pend!=='object'||Array.isArray(pend)||'h' in pend)pend={}}catch(e){pend={}}
  const savePend=()=>{try{localStorage.setItem('sc5-pending',JSON.stringify(pend))}catch(e){}};
  const on=()=>GS;
  const home=()=>save.home||'';
  const need=()=>GS&&!classes.includes(home());
  const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const fmt=n=>Number(n||0).toLocaleString('en-US');
  function run(fn,args,ok,bad){try{google.script.run.withSuccessHandler(ok).withFailureHandler(bad||(()=>{}))[fn](...args)}catch(e){bad&&bad(e)}}
  function add(k){if(!GS||!home())return;pend[home()]=(pend[home()]||0)+k;savePend();render()}
  function flush(){if(!GS||sending)return;const h=Object.keys(pend).find(k=>pend[k]>0);if(!h)return;const pts=Math.min(pend[h],60);sending=true;
    run('addPoints',[h,pts],b=>{sending=false;failed=0;pend[h]-=pts;if(pend[h]<=0)delete pend[h];savePend();setBoard(b);if(Object.keys(pend).length)setTimeout(flush,1200)},
      e=>{sending=false;failed++;
        /* the teacher renamed or removed this homeroom: those points can't go anywhere */
        if(/unknown homeroom/i.test(String(e&&e.message||e))){delete pend[h];savePend()}
        render()})}
  function refresh(){if(!GS)return;run('getBoard',[],setBoard,()=>{failed++;render()})}
  function setBoard(b){if(!b||!b.classes)return;board=b;const names=b.classes.map(c=>c.name);if(names.length)classes=names;render()}
  /* points shown include this Chromebook's points that are still waiting to be sent */
  function rows(){const list=(board&&board.classes)||classes.map(n=>({name:n,points:0,students:0}));
    return list.map(c=>({name:c.name,points:(+c.points||0)+(pend[c.name]||0),students:+c.students||0}))}
  function perStudent(r){return r.every(c=>c.students>0)}
  function render(){
    const el=$('#cup');if(!GS){el.hidden=true;$('#titleCup').innerHTML='<p class="std">Practice copy. The Class Cup contest runs from the link your teacher posts in Google Classroom.</p>';return}
    const r=rows(),a=r[0]||{points:0},b=r[1]||{points:0},tot=a.points+b.points,pct=tot?Math.round(a.points/tot*100):50;
    el.hidden=false;
    el.innerHTML=`<span class="ct">CLASS CUP</span><div class="tug"><div class="names"><span class="c0">${esc(a.name||'')} <b>${fmt(a.points)}</b></span><span class="c1"><b>${fmt(b.points)}</b> ${esc(b.name||'')}</span></div>
      <div class="bar" role="img" aria-label="${esc(a.name)} ${a.points} points, ${esc(b.name)} ${b.points} points"><i style="width:${pct}%"></i></div></div>
      <span class="me">${home()?'Playing for <b>'+esc(home())+'</b>':''}${failed>2?' · saving…':''}</span><button type="button" id="cupChange">${home()?'Change':'Pick homeroom'}</button>`;
    $('#cupChange').onclick=()=>ask(()=>{$('#homeroom').hidden=true;refocus()});
    $('#titleCup').innerHTML=`<div class="bigcup">${r.map((c,i)=>`<div><span class="c${i}">${esc(c.name)}</span><b class="c${i}">${fmt(c.points)}</b><em>points${perStudent(r)?` · ${(c.points/c.students).toFixed(1)} per student`:''}</em></div>`).join('')}</div>
      <p class="std">${home()?`You play for <b>${esc(home())}</b>. Every right answer = 1 point. Clearing a room = 10 points.`:'Pick your homeroom when you start.'}</p>`;
    if(boardMode){$('#boardCup').innerHTML=r.map((c,i)=>`<div><span class="c${i}">${esc(c.name)}</span><b class="c${i}">${fmt(c.points)}</b><em>points${perStudent(r)?` · ${(c.points/c.students).toFixed(1)} per student`:''}</em></div>`).join('');
      $('#boardNote').textContent=(board&&board.contest?board.contest+' · ':'')+'Updates by itself every 15 seconds.'}
  }
  function ask(then){
    $('#homeList').innerHTML=classes.map((c,i)=>`<button type="button" class="home c${i}" data-h="${esc(c)}">${esc(c)}<small>homeroom</small></button>`).join('');
    $('#homeroom').hidden=false;$('#homeList button').focus();
    $('#homeList').onclick=e=>{const b=e.target.closest('.home');if(!b)return;flush();save.home=b.dataset.h;persist();$('#homeroom').hidden=true;render();if(then)then()};
  }
  function start(){render();if(!GS)return;
    refresh();setInterval(flush,20000);setInterval(()=>{if(!document.hidden)refresh()},boardMode?15000:45000);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)flush()});
    flush();
    /* projector view: the web app link + ?board=1 */
    try{google.script.url.getLocation(loc=>{if(loc&&loc.parameter&&loc.parameter.board){boardMode=true;document.body.classList.add('boardmode');$('#board').hidden=false;render();setInterval(refresh,15000)}})}catch(e){}
  }
  return {on,home,need,add,flush,ask,start,render};
})();
