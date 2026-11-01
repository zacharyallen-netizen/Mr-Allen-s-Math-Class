import re,sys
D='/home/claude/mr-allen-s-math-class/grade8/'
CHK_ANCHOR="  const buttons = box.querySelectorAll('.chk-btn');\n"
CHK_ADD="  if(window.ssRec) ssRec(qid, chosen === correct);   // Send-my-work tracker (first click = first try)\n"
VAL_ANCHOR="  if(v===''){fb.classList.add('w');fb.innerHTML='Type your answer first.';return;}\n"
VAL_ADD="  if(window.ssRec) ssRec(qid, list.some(a=>norm(a)===norm(v)));   // Send-my-work tracker\n"
U3_ANCHOR="  const cv=canon(v);\n"
U3_ADD="  if(window.ssRec) ssRec(qid, list.some(a=>canon(a)===cv));   // Send-my-work tracker\n"

def tail(unit,page,mount,stdjs,default):
    return f'''<script src="../tracker-config.js"></script>
<script src="../score-send.js"></script>
<script>
/* Send-my-work tracker: practice problems and quick checks only (not the note fill-ins). */
if(window.ScoreSend) ScoreSend.setup({{ kind:'practice', unit:'{unit}', page:'{page}', mount:'{mount}', std:'{default}', band:4 }});
function ssStd(id){{ {stdjs} }}
function ssRec(qid, ok){{
  if(!window.ScoreSend) return;
  var q=document.querySelector('#'+qid+' .chk-q'), label='';
  if(q){{ q=q.cloneNode(true); q.querySelectorAll('.badge,svg,button').forEach(function(e){{e.remove();}}); label=q.textContent.replace(/\\s+/g,' ').trim(); }}
  ScoreSend.record(qid, !!ok, {{ std:ssStd(qid), band:4, label:label }});
}}
</script>
</body>'''

PAGES={
 'Unit_1_Real_Numbers_Guided_Notes.html':('1','Unit 1 · Real Numbers Guided Notes quick checks','#ss-mount',
   "return ({chk1a:'NC.8.NS.1',chk5a:'NC.8.NS.1',chk4a:'NC.8.NS.2'})[id]||'NC.8.EE.2';",'NC.8.EE.2'),
 'Unit_2_Exponent_Rules_Guided_Notes.html':('2','Unit 2 · Exponent Rules Guided Notes practice','#practice',
   "return 'NC.8.EE.1';",'NC.8.EE.1'),
 'Unit_2_Scientific_Notation_Guided_Notes.html':('2','Unit 2 · Scientific Notation Guided Notes practice','#practice',
   "return /^u2pC/.test(id)?'NC.8.EE.4':'NC.8.EE.3';",'NC.8.EE.3'),
 'Unit_2_Exponents_Guided_Notes.html':('2','Unit 2 · Exponents Guided Notes practice','#practice',
   "return /^u2pB/.test(id)?'NC.8.EE.3':/^u2pC/.test(id)?'NC.8.EE.4':'NC.8.EE.1';",'NC.8.EE.1'),
 'Unit_3_Equations_Guided_Notes.html':('3','Unit 3 · Equations Guided Notes practice','#practice',
   "return 'NC.8.EE.7';",'NC.8.EE.7'),
 'Unit_4_Geometry_Guided_Notes.html':('4','Unit 4 · Geometry Guided Notes practice','#practice',
   "return 'NC.8.G.5';",'NC.8.G.5'),
 'Unit_5_Pythagorean_Guided_Notes.html':('5','Unit 5 · Pythagorean Guided Notes practice','#practice',
   "return /^chk54|^u5pE/.test(id)?'NC.8.G.6':/^u5pD/.test(id)?'NC.8.G.8':'NC.8.G.7';",'NC.8.G.7'),
}
for f,(unit,page,mount,stdjs,default) in PAGES.items():
    s=open(D+f,encoding='utf-8').read()
    assert 'score-send.js' not in s, f
    assert s.count(CHK_ANCHOR)==1, f
    s=s.replace(CHK_ANCHOR,CHK_ANCHOR+CHK_ADD)
    if f.startswith('Unit_3'):
        assert s.count(U3_ANCHOR)==1; s=s.replace(U3_ANCHOR,U3_ANCHOR+U3_ADD)
    else:
        assert s.count(VAL_ANCHOR)==1, f; s=s.replace(VAL_ANCHOR,VAL_ANCHOR+VAL_ADD)
    if mount=='#ss-mount':
        a='<div style="text-align:center;margin-top:26px">\n  <a href="unit1.html" class="back-link">'
        assert s.count(a)==1; s=s.replace(a,'<div id="ss-mount"></div>\n\n'+a)
    assert s.count('</body>')==1
    s=s.replace('</body>',tail(unit,page,mount,stdjs,default))
    open(D+f,'w',encoding='utf-8').write(s)
    print('wired',f)
