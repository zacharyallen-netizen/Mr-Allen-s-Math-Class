/* ============================================================
   IC Imagine · NC Math 1 — script.js
   Shared interactions for guided notes + practice.
   ============================================================ */

/* ---------- GUIDED NOTES: reveal worked-example steps ---------- */
function reveal(step){ step.classList.add('revealed'); }
function revealAll(id){
  document.querySelectorAll('.steps[data-example="'+id+'"] .step')
    .forEach(function(s){ s.classList.add('revealed'); });
}

/* ---------- fill-in blanks ---------- */
function _showBlank(b){
  if(b.dataset.shown) return;
  b.dataset.shown='1';
  if(b.dataset.ans!=null && b.dataset.ans!=='') b.textContent=b.dataset.ans;
  b.classList.add('revealed');
}
function rb(b){ _showBlank(b); }

/* ---------- short-answer / literal reveal ---------- */
function sa(btn){
  var a=btn.parentElement.querySelector('.sa-ans');
  if(a) a.classList.add('show');
}

/* ---------- reveal EVERYTHING on the page (answer key for printing) ---------- */
function revealPage(){
  document.querySelectorAll('.step').forEach(function(s){ s.classList.add('revealed'); });
  document.querySelectorAll('.blank').forEach(_showBlank);
  document.querySelectorAll('.sa-ans').forEach(function(a){ a.classList.add('show'); });
}

/* ---------- normalize typed math answers ---------- */
function _norm(s){
  return (s||'').toString().trim().toLowerCase()
    .replace(/\u2212/g,'-')                 /* − minus sign -> hyphen */
    .replace(/\u2264/g,'<=').replace(/\u2265/g,'>=')  /* ≤ ≥ */
    .replace(/\s+/g,'');
}

/* ---------- scoring ---------- */
var _started={}, _correct=0, _answered=0;
function _updateScore(){
  var b=document.getElementById('score');
  if(b) b.innerHTML='Score: <b>'+_correct+'</b> / '+_answered;
}

/* ---------- PRACTICE: multiple choice ----------
   chk(qid, correctText, chosenText)  — one call per option button. */
function chk(qid, correct, chosen){
  var card=document.getElementById(qid);
  if(!card || card.dataset.done) return;
  card.dataset.done='1';
  var ok=_norm(chosen)===_norm(correct);
  card.querySelectorAll('.chk-btn').forEach(function(b){
    b.style.pointerEvents='none';
    var t=_norm(b.textContent);
    if(t===_norm(correct)) b.classList.add('correct');
    else if(t===_norm(chosen) && !ok) b.classList.add('wrong');
  });
  var fb=document.getElementById('fb-'+qid);
  if(fb) fb.classList.add('show');
  _answered++; if(ok) _correct++; _updateScore();
}

/* ---------- PRACTICE: typed answer ----------
   chkVal(qid, [accepted, ...])  — reads #<qid>-in */
function chkVal(qid, accepted){
  var card=document.getElementById(qid);
  var inp=document.getElementById(qid+'-in');
  var fb=document.getElementById('fb-'+qid);
  if(!card || !inp || card.dataset.solved) return;
  var val=_norm(inp.value);
  if(!val){ if(fb){ fb.textContent='Type your answer first.'; fb.className='chk-fb x show'; } return; }
  var ok=accepted.some(function(a){ return _norm(a)===val; });
  if(!_started[qid]){ _started[qid]=1; _answered++; }
  if(ok){
    _correct++; card.dataset.solved='1'; inp.disabled=true;
    if(fb){ fb.textContent='\u2713 Correct!'; fb.className='chk-fb c show'; }
  }else{
    if(fb){ fb.textContent='Not quite \u2014 check your work and try again.'; fb.className='chk-fb x show'; }
  }
  _updateScore();
}

/* ---------- NOTES: matching game ----------
   Left items carry data-key; right items pass their correct left-key to mSel. */
var _msel={};
function mSel(grp, el, key){
  if(el.dataset.side==='L'){
    if(el.dataset.matched) return;
    document.querySelectorAll('.match-item[data-grp="'+grp+'"][data-side="L"]')
      .forEach(function(i){ if(!i.dataset.matched) i.classList.remove('sel'); });
    el.classList.add('sel'); _msel[grp]=el;
  }else{
    var left=_msel[grp];
    if(!left || left.dataset.matched || el.dataset.matched) return;
    if(left.dataset.key===key){
      left.dataset.matched='1'; el.dataset.matched='1';
      left.classList.add('matched'); left.classList.remove('sel'); el.classList.add('matched');
      _msel[grp]=null; _matchStatus(grp);
    }else{
      el.classList.add('wrong');
      setTimeout(function(){ el.classList.remove('wrong'); },600);
    }
  }
}
function _matchStatus(grp){
  var tot=document.querySelectorAll('.match-item[data-grp="'+grp+'"][data-side="L"]').length;
  var done=document.querySelectorAll('.match-item[data-grp="'+grp+'"][data-side="L"][data-matched]').length;
  var s=document.getElementById('st-'+grp);
  if(s) s.textContent=done+' of '+tot+' matched';
}
function mReset(grp){
  document.querySelectorAll('.match-item[data-grp="'+grp+'"]').forEach(function(i){
    delete i.dataset.matched; i.classList.remove('matched','sel','wrong');
  });
  _msel[grp]=null; _matchStatus(grp);
}

/* ---------- CLASS INFORMATION: auto-activate download cards + Enter-to-check ---------- */
document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.doc-card').forEach(function(c){
    var f=c.getAttribute('data-file'); if(!f) return;
    fetch(f,{method:'HEAD'}).then(function(r){
      if(r.ok){ c.classList.remove('pending'); var s=c.querySelector('.doc-status'); if(s) s.textContent='Download \u2192'; }
    }).catch(function(){});
    c.addEventListener('click',function(e){ if(c.classList.contains('pending')) e.preventDefault(); });
  });
  document.querySelectorAll('.val-chk input').forEach(function(inp){
    inp.addEventListener('keydown',function(e){
      if(e.key==='Enter'){ var b=inp.parentElement.querySelector('button'); if(b) b.click(); }
    });
  });
});
