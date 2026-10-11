#!/usr/bin/env python3
"""Reusable builder for Mr. Allen's standards-based pre-tests.
Matches the Unit_2_Pretest.html worksheet style exactly (shared style block),
driven by a per-unit config. Data-driven answer checker via chk arrays."""
import json, os, html, re

SP = '/home/claude/mr-allen-s-math-class/_build'
REPO = '/home/claude/mr-allen-s-math-class/grade8'
STYLE = open(os.path.join(SP, 'pretest_style.css')).read()

ENGINE = r"""
/* ===== parsers ===== */
const SUP={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-','⁺':'+'};
function deSup(s){return s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]/g,c=>SUP[c]);}
function cleanNum(raw){
  let s=String(raw==null?'':raw).toLowerCase().trim();
  s=s.replace(/^[a-z]\s*=\s*/,'');                       // "x = 5" -> "5" (the box is labelled x =)
  s=s.replace(/(cm|mm|km|m|ft|in|yd)\s*(\^\s*[23]|[\u00b2\u00b3]|[23](?![0-9]))/g,'$1'); // cm³ / ft^2 -> unit only, before superscripts are expanded
  s=s.replace(/[%\u00b0]/g,'');                          // 60% -> 60, 55° -> 55
  s=deSup(s);
  s=s.replace(/[\u00bd\u2153\u2154\u00bc\u00be]/g,c=>({'\u00bd':'1/2','\u2153':'1/3','\u2154':'2/3','\u00bc':'1/4','\u00be':'3/4'})[c]); // ½ ⅓ ⅔ ¼ ¾
  s=s.replace(/−/g,'-');
  s=s.replace(/,/g,'').replace(/\$/g,'').replace(/≈|=/g,'');
  s=s.replace(/\b(square|cubic)\b/g,'');
  s=s.replace(/(units?|centimeters?|millimeters?|meters?|kilometers?|feet|foot|inches|inch|cm|mm|km|kg|ft|in|m|sec(onds?)?|degrees?|points?|people|persons?|videos?|files?|times|hours?|hr|miles?|mi|g)\b/g,'');
  s=s.replace(/°/g,'');
  s=s.replace(/\s+/g,'');
  return s;
}
function parseNumber(raw){
  let s=cleanNum(raw);
  if(s==='')return NaN;
  s=s.replace(/[×·∙•⋅]/g,'x').replace(/\*\*/g,'^').replace(/\*/g,'x');
  let m=s.match(/^(-?\d*\.?\d+)x?10\^?(-?\d+)$/); if(m)return parseFloat(m[1])*Math.pow(10,parseInt(m[2],10));
  m=s.match(/^(-?\d*\.?\d+)e(-?\d+)$/); if(m)return parseFloat(m[1])*Math.pow(10,parseInt(m[2],10));
  m=s.match(/^(-?\d+)\/(-?\d+)$/); if(m)return parseInt(m[1],10)/parseInt(m[2],10);
  m=s.match(/^(?:√|sqrt|root)\(?(-?\d*\.?\d+)\)?$/); if(m)return Math.sqrt(parseFloat(m[1]));
  m=s.match(/^-?\d*\.?\d+$/); if(m)return parseFloat(s);
  return NaN;
}
function parseSciParts(raw){
  let s=cleanNum(raw).replace(/[×·∙•⋅]/g,'x').replace(/\*\*/g,'^').replace(/\*/g,'x');
  let m=s.match(/^(-?\d*\.?\d+)x?10\^?(-?\d+)$/)||s.match(/^(-?\d*\.?\d+)e(-?\d+)$/);
  if(!m)return null;
  return {coeff:parseFloat(m[1]),exp:parseInt(m[2],10)};
}
function normText(raw){return String(raw==null?'':raw).toLowerCase().replace(/\s+/g,' ').trim().replace(/[.;,!]+$/,'');}
function near(a,b){ if(!isFinite(a))return false; if(b===0)return Math.abs(a)<1e-9; return Math.abs(a-b)<=Math.abs(b)*1e-4+1e-9; }
function runCheck(chk,raw){
  if(!chk)return false;
  const t=chk[0];
  if(t==='val'){const v=parseNumber(raw);return isFinite(v)&&near(v,chk[1]);}
  if(t==='num'){const v=parseNumber(raw);const tol=(chk[2]==null?0.01:chk[2]);return isFinite(v)&&Math.abs(v-chk[1])<=tol;}
  if(t==='sci'){const p=parseSciParts(raw);if(!p)return false;const okform=Math.abs(p.coeff)>=1&&Math.abs(p.coeff)<10;return okform&&near(p.coeff*Math.pow(10,p.exp),chk[1]);}
  if(t==='frac'){const v=parseNumber(raw);return isFinite(v)&&near(v,chk[1]/chk[2]);}
  if(t==='coord'){let s=String(raw==null?'':raw).replace(/−/g,'-').replace(/\s/g,'');const m=s.match(/^\(?(-?\d*\.?\d+),(-?\d*\.?\d+)\)?$/);return !!m&&near(parseFloat(m[1]),chk[1])&&near(parseFloat(m[2]),chk[2]);}
  if(t==='text'){const n=normText(raw);return chk[1].some(a=>normText(a)===n);}
  if(t==='contains'){const n=normText(raw);return chk[1].some(a=>n.includes(normText(a)));}
  if(t==='pi'){const s=cleanNum(raw);let m=s.match(/^(-?\d*\.?\d+)(?:pi|π)$/);if(m)return near(parseFloat(m[1]),chk[1]);if(/^(?:pi|π)$/.test(s))return near(1,chk[1]);const v=parseNumber(raw);return isFinite(v)&&Math.abs(v-chk[1]*Math.PI)<=Math.max(0.15,Math.abs(chk[1]*Math.PI)*0.01);}
  if(t==='linear'){let s=String(raw==null?'':raw).toLowerCase().replace(/−/g,'-').replace(/\s/g,'').replace(/·|\*/g,'').replace(/^y=/,'');const xm=s.match(/([+-]?\d*\.?\d*)x/);if(!xm)return false;let mc=xm[1];if(mc===''||mc==='+')mc='1';if(mc==='-')mc='-1';mc=parseFloat(mc);let rest=s.replace(/([+-]?\d*\.?\d*)x/,'');let bc=(rest===''?0:parseFloat(rest));if(isNaN(bc))bc=0;return near(mc,chk[1])&&near(bc,chk[2]);}
  return false;
}
/* ===== render ===== */
QS.forEach(q=>{
  const grid=document.querySelector('.qgrid[data-level="'+q.lvl+'"]'); if(!grid)return;
  const div=document.createElement('div'); div.className='q'; div.id='q'+q.id;
  div.innerHTML='<div><span class="n">'+q.id+'.</span>'+(q.op?' <span class="op">'+q.op+'</span>':'')+'</div>'
    +'<div class="expr">'+q.expr+'</div>'
    +(q.svg?'<div class="dia">'+q.svg+'</div>':'')
    +'<div class="ans"><label>'+(q.lab||'Answer:')+'</label><input id="i'+q.id+'" autocomplete="off" spellcheck="false"'+(q.ph?' placeholder="'+q.ph+'"':'')+'></div>'
    +'<div class="qfb" id="fb'+q.id+'"></div>';
  grid.appendChild(div);
});
/* ===== send to Mr. Allen (score-send.js): every graded question is recorded ===== */
const PT_BAND={basic:3,target:4,advanced:5};
function ptLabel(q){const d=document.createElement('div');d.innerHTML=(q.op?q.op+': ':'')+String(q.expr).replace(/<sup>/g,'^');return d.textContent.replace(/\s+/g,' ').trim().slice(0,80);}
function ptRecord(q,ok){if(!window.ScoreSend)return;try{ScoreSend.record('q'+q.id,ok,{std:PT_STD[q.id],band:PT_BAND[q.lvl],label:ptLabel(q)});}catch(e){}}
/* ===== check / reveal / reset ===== */
function check(){
  let levels={basic:[0,0],target:[0,0],advanced:[0,0]};
  if(typeof VOCAB==='object'&&VOCAB){
    document.querySelectorAll('#vocab select').forEach(sel=>{
      const term=sel.dataset.term, fb=sel.parentElement.querySelector('.fb');
      const good=sel.value===VOCAB[term];
      fb.textContent=sel.value?(good?'✓':'✗'):''; fb.className='fb '+(good?'ok':'no');
      levels.basic[1]++; if(good)levels.basic[0]++;
    });
  }
  QS.forEach(q=>{
    const inp=document.getElementById('i'+q.id), fb=document.getElementById('fb'+q.id), div=document.getElementById('q'+q.id);
    levels[q.lvl][1]++; div.classList.remove('correct','wrong');
    if(inp.value.trim()===''){fb.textContent='';fb.className='qfb';return;}
    if(runCheck(q.chk,inp.value)){levels[q.lvl][0]++;div.classList.add('correct');fb.innerHTML='✓ correct';fb.className='qfb ok';ptRecord(q,true);}
    else{div.classList.add('wrong');fb.innerHTML='✗ answer: <span class="key">'+q.disp+'</span>';fb.className='qfb no';ptRecord(q,false);}
  });
  const tot=levels.basic[0]+levels.target[0]+levels.advanced[0];
  const den=levels.basic[1]+levels.target[1]+levels.advanced[1];
  document.getElementById('scorebox').firstChild.textContent=tot+' / '+den+' correct ';
  document.getElementById('lvls').textContent='3.0 Basic '+levels.basic[0]+'/'+levels.basic[1]+'  ·  4.0 Target '+levels.target[0]+'/'+levels.target[1]+'  ·  5.0 Advanced '+levels.advanced[0]+'/'+levels.advanced[1];
}
function reveal(){
  if(typeof VOCAB==='object'&&VOCAB){
    document.querySelectorAll('#vocab select').forEach(sel=>{sel.value=VOCAB[sel.dataset.term];const fb=sel.parentElement.querySelector('.fb');fb.textContent='✓';fb.className='fb ok';});
  }
  QS.forEach(q=>{const fb=document.getElementById('fb'+q.id),div=document.getElementById('q'+q.id);div.classList.remove('wrong');div.classList.add('correct');fb.innerHTML='answer: <span class="key">'+q.disp+'</span>';fb.className='qfb ok';});
  document.getElementById('scorebox').firstChild.textContent='Answers shown '; document.getElementById('lvls').textContent='';
  if(window.ScoreSend)ScoreSend.revealed();
}
function reset(){
  if(typeof VOCAB==='object'&&VOCAB){document.querySelectorAll('#vocab select').forEach(s=>{s.value='';const fb=s.parentElement.querySelector('.fb');fb.textContent='';fb.className='fb';});}
  QS.forEach(q=>{document.getElementById('i'+q.id).value='';const fb=document.getElementById('fb'+q.id);fb.textContent='';fb.className='qfb';document.getElementById('q'+q.id).classList.remove('correct','wrong');});
  document.getElementById('scorebox').firstChild.textContent='Not checked yet '; document.getElementById('lvls').textContent='';
  if(window.ScoreSend)ScoreSend.reset();
}
document.getElementById('check').addEventListener('click',check);
document.getElementById('reveal').addEventListener('click',reveal);
document.getElementById('reset').addEventListener('click',reset);
document.querySelectorAll('.ans input').forEach(i=>i.addEventListener('keydown',e=>{if(e.key==='Enter')check();}));
"""

NAV = """<script src="../site-bar.js"></script>
<nav class="sb-local" aria-label="On this page"><a href="{unit}.html">← {unitlabel}</a></nav>"""

TRACKER = """<style>@media (max-width:760px){{body>#scoresend{{margin:24px 12px!important}}}}</style>
<script src="../tracker-config.js"></script>
<script src="../score-send.js"></script>
<script>if(window.ScoreSend)ScoreSend.setup({setup});</script>"""

# grade 8 codes (NC.8.EE.7) and Math 1 codes (NC.M1.A-REI.3, NC.M1.F-IF.8b)
STD_RE = re.compile(r'NC\.(?:8\.(?:NS|EE|F|G|SP)\.\d|M1\.[A-Z]{1,2}-[A-Z]{2,4}\.\d{1,2}[a-z]?)')
def band_codes(b):
    codes = STD_RE.findall(b['code'])
    assert codes, 'band has no NC standard: %r' % b['code']
    return codes

def question_stds(cfg):
    """Standard for each question: its own 'std' if set, else its band's standard.
    A band that lists two standards must name one on every question."""
    by_level = {b['level']: band_codes(b) for b in cfg['bands']}
    out = {}
    for q in cfg['qs']:
        codes = by_level[q['lvl']]
        std = q.get('std') or codes[0]
        assert q.get('std') or len(codes) == 1, '%s Q%s: band lists %s; set std on the question' % (cfg['file'], q['id'], codes)
        assert std in codes, '%s Q%s: %s is not in its band %s' % (cfg['file'], q['id'], std, codes)
        out[q['id']] = std
    return out

def band_html(b):
    s = '<div class="band"><span class="lvl">SCORE</span><span class="num">%s</span><span class="name">%s</span></div>\n' % (b['num'], b['name'])
    s += '<div class="stripe">\n'
    s += '  <p class="objline"><span class="code">%s</span> %s</p>\n' % (b['code'], b['obj'])
    s += '  <p class="can">• %s</p>\n' % b['can']
    s += '  <p class="prompt">%s</p>\n' % b['prompt']
    if b.get('vocab_html'): s += b['vocab_html'] + '\n'
    if b.get('refbox'): s += b['refbox'] + '\n'
    s += '  <div class="qgrid" data-level="%s"></div>\n</div>\n' % b['level']
    return s

def build(cfg):
    vocab_js = ('const VOCAB=%s;\n' % json.dumps(cfg['vocab_key'], ensure_ascii=False)) if cfg.get('vocab_key') else 'const VOCAB=null;\n'
    qs_js = 'const QS=' + json.dumps([{k: v for k, v in q.items() if k != 'std'} for q in cfg['qs']], ensure_ascii=False) + ';\n'
    qs_js += 'const PT_STD=' + json.dumps(question_stds(cfg)) + ';\n'
    # optional keys (Math 1): track_unit, track_page, engine, head_pre, extra_css, repo — defaults keep grade 8 output identical
    tracker = TRACKER.format(setup=json.dumps(dict(kind='pretest', unit=cfg.get('track_unit') or re.sub(r'\D', '', cfg['unit']), page=cfg.get('track_page') or cfg['title'],
                                                   mount='body', std=band_codes(cfg['bands'][0])[0], band=4), ensure_ascii=False))
    bands = '\n'.join(band_html(b) for b in cfg['bands'])
    nav = NAV.format(unit=cfg['unit'], unitlabel=cfg['unitlabel'])
    doc = """<!DOCTYPE html>
<html lang="en">
<head>
%(head_pre)s<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%(title)s</title>
%(style)s
<style>
@media print{.sitenav{display:none!important}}
.dia{text-align:center;margin:6px 0 10px}
.dia svg{max-width:100%%;height:auto;vertical-align:middle}
@media print{.dia svg{max-width:200px}.dia *{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
%(extra_css)s</style>
</head>
<body>
%(nav)s
<div class="sheet">
  <div class="masthead">
    <h1>%(h1)s</h1>
    <p class="sub">%(sub)s</p>
    <p class="std">%(std)s</p>
  </div>
  <hr class="rule-gold">
  <div class="idline">
    <span class="fld"><b>Name:</b><span class="blank"></span></span>
    <span class="fld"><b>Date:</b><span class="blank"></span></span>
    <span class="fld"><b>Period:</b><span class="blank"></span></span>
  </div>
%(bands)s
  <div class="controls">
    <button class="btn-primary" id="check">Check answers</button>
    <button class="btn-ghost" id="reveal">Show answers</button>
    <button class="btn-ghost" id="reset">Reset</button>
    <span class="scorebox" id="scorebox">Not checked yet
      <span class="lvls" id="lvls"></span></span>
  </div>
</div>
<script>
%(vocab)s%(qs)s%(engine)s
</script>
%(tracker)s
</body>
</html>""" % dict(title=html.escape(cfg['title']), style=STYLE, nav=nav, h1=cfg['h1'], sub=cfg['sub'], std=cfg['std'], bands=bands, vocab=vocab_js, qs=qs_js, engine=cfg.get('engine', ENGINE), tracker=tracker,
           head_pre=cfg.get('head_pre', ''), extra_css=cfg.get('extra_css', ''))
    out = os.path.join(cfg.get('repo', REPO), cfg['file'])
    open(out, 'w').write(doc)
    return out

def vocab_table(rows):
    """rows: list of (term, 'A'..) in display order, defs: list of (letter, text)."""
    pass

if __name__ == '__main__':
    print("builder module ready")
