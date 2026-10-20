#!/usr/bin/env python3
import sys; sys.path.insert(0, '/home/claude/mr-allen-s-math-class/_build')
from build_pretest import build

def vocab_table(terms, defs):
    opts = ''.join('<option>%s</option>' % L for L in 'ABCDEF'[:len(defs)])
    rows = []
    for i in range(len(terms)):
        term = terms[i]
        left = ('<td class="term"><select data-term="%s"><option value="">–</option>%s</select>'
                '<span class="word">%s</span><span class="fb"></span></td>') % (term.lower(), opts, term)
        L, dtext = defs[i]
        right = '<td class="def"><b>%s.</b> %s</td>' % (L, dtext)
        rows.append('      <tr>%s\n          %s</tr>' % (left, right))
    return '    <table class="vocab" id="vocab">\n' + '\n'.join(rows) + '\n    </table>'

terms = ['scientific notation', 'coefficient', 'standard form', 'base', 'positive exponent', 'negative exponent']
defs = [
    ('A', 'A number written the ordinary way. <span class="ex">Example: 2,700 or 0.05</span>'),
    ('B', 'The decimal factor in a × 10ⁿ — at least 1 and less than 10. <span class="ex">Example: the 8.3 in 8.3 × 10⁶</span>'),
    ('C', 'Shows a small number between 0 and 1 (move the decimal left). <span class="ex">Example: the −2 in 5 × 10⁻² = 0.05</span>'),
    ('D', 'A number written as a × 10ⁿ, where 1 ≤ a &lt; 10. <span class="ex">Example: 8.3 × 10⁶</span>'),
    ('E', 'In a power of ten, the number that is multiplied repeatedly. <span class="ex">Example: the 10 in 10⁴ = 10 · 10 · 10 · 10</span>'),
    ('F', 'Shows a large number, 10 or greater (move the decimal right). <span class="ex">Example: the 6 in 8.3 × 10⁶ = 8,300,000</span>'),
]
vocab_key = {'scientific notation':'D','coefficient':'B','standard form':'A','base':'E','positive exponent':'F','negative exponent':'C'}

refbox = """    <div class="refbox fillparts">
      <p class="rl">Parts of a number in scientific notation — fill in the blanks</p>
      <div class="mono5x">3.4 × 10<sup>5</sup></div>
      <div class="parts">
        <span class="p"><input class="partin" data-ans="coefficient" autocomplete="off" spellcheck="false" aria-label="What is the 3.4 called?"><small>the 3.4</small><span class="pfb"></span></span>
        <span class="p"><input class="partin" data-ans="base" autocomplete="off" spellcheck="false" aria-label="What is the 10 called?"><small>the 10</small><span class="pfb"></span></span>
        <span class="p"><input class="partin" data-ans="exponent|power|positive exponent" autocomplete="off" spellcheck="false" aria-label="What is the 5 called?"><small>the 5</small><span class="pfb"></span></span>
      </div>
      <p class="tag">A positive exponent makes a <b>large</b> number; a negative exponent makes a <b>small</b> one.</p>
    </div>"""

X = '×'
def sup(n): return '10<sup>%s</sup>' % n

qs = [
 # ---- 3.0 basic ----
 {'id':1,'lvl':'basic','op':'Write in scientific notation','expr':'45,000','disp':'4.5 '+X+' '+sup(4),'chk':['sci',45000]},
 {'id':2,'lvl':'basic','op':'Write in standard form','expr':'3 '+X+' '+sup(4),'disp':'30,000','chk':['val',30000]},
 {'id':3,'lvl':'basic','op':'Write in scientific notation','expr':'0.0062','disp':'6.2 '+X+' '+sup(-3),'chk':['sci',0.0062]},
 {'id':4,'lvl':'basic','op':'Write in standard form','expr':'7.1 '+X+' '+sup(-2),'disp':'0.071','chk':['val',0.071]},
 {'id':5,'lvl':'basic','op':'Write in scientific notation','expr':'580,000','disp':'5.8 '+X+' '+sup(5),'chk':['sci',580000]},
 {'id':6,'lvl':'basic','op':'Fix the notation','expr':'Is 12.5 '+X+' '+sup(6)+' correct? Write the correct form.','disp':'1.25 '+X+' '+sup(7),'chk':['sci',12500000]},
 # ---- 4.0 target ----
 {'id':7,'lvl':'target','op':'Multiply','expr':'(3 '+X+' '+sup(4)+')(2 '+X+' '+sup(3)+')','disp':'6 '+X+' '+sup(7),'chk':['sci',6e7]},
 {'id':8,'lvl':'target','op':'Divide','expr':'(8 '+X+' '+sup(9)+') ÷ (4 '+X+' '+sup(5)+')','disp':'2 '+X+' '+sup(4),'chk':['sci',2e4]},
 {'id':9,'lvl':'target','op':'Compare','expr':'A blue whale has a mass of about 1.5 '+X+' '+sup(5)+' kg. A dog has a mass of about 3 '+X+' '+sup(1)+' kg. How many times greater is the whale’s mass?','disp':'5 '+X+' '+sup(3)+' (5,000 times)','chk':['sci',5e3]},
 {'id':10,'lvl':'target','op':'Compare','expr':'How many times larger is 6 '+X+' '+sup(8)+' than 2 '+X+' '+sup(3)+'?','disp':'3 '+X+' '+sup(5),'chk':['sci',3e5]},
 {'id':11,'lvl':'target','op':'Divide','expr':'(9 '+X+' '+sup(-2)+') ÷ (3 '+X+' '+sup(4)+')','disp':'3 '+X+' '+sup(-6),'chk':['sci',3e-6]},
 {'id':12,'lvl':'target','op':'Multiply','expr':'(2.5 '+X+' '+sup(5)+')(2 '+X+' '+sup(-8)+')','disp':'5 '+X+' '+sup(-3),'chk':['sci',5e-3]},
 # ---- 5.0 advanced ----
 {'id':13,'lvl':'advanced','op':'Multiply, then fix the form','expr':'(4 '+X+' '+sup(-3)+')(6 '+X+' '+sup(-5)+')','disp':'24 '+X+' '+sup(-8)+' → 2.4 '+X+' '+sup(-7),'chk':['sci',2.4e-7]},
 {'id':14,'lvl':'advanced','op':'Divide, then fix the form','expr':'(1.2 '+X+' '+sup(-4)+') ÷ (4 '+X+' '+sup(-9)+')','disp':'0.3 '+X+' '+sup(5)+' → 3 '+X+' '+sup(4),'chk':['sci',3e4]},
 {'id':15,'lvl':'advanced','op':'Multi-step, then fix the form','expr':'<span class="frac"><span class="num">(7.5 '+X+' '+sup(-6)+')(4 '+X+' '+sup(3)+')</span><span class="den">2.5 '+X+' '+sup(-4)+'</span></span>','disp':'12 '+X+' '+sup(1)+' → 1.2 '+X+' '+sup(2),'chk':['sci',120]},
 {'id':16,'lvl':'advanced','op':'Apply','expr':'A red blood cell is about 8 '+X+' '+sup(-6)+' meter wide. A grain of sand is about 6.4 '+X+' '+sup(-4)+' meter wide. How many times wider is the grain of sand than the red blood cell? Write your answer in scientific notation.','disp':'0.8 '+X+' '+sup(2)+' → 8 '+X+' '+sup(1)+' (80 times)','chk':['sci',80]},
 {'id':17,'lvl':'advanced','op':'Apply','expr':'One bacterium has a mass of about 2 '+X+' '+sup(-12)+' gram. A sample has 6 '+X+' '+sup(8)+' bacteria. What is the total mass of the sample, in grams?','disp':'12 '+X+' '+sup(-4)+' → 1.2 '+X+' '+sup(-3)+' g','chk':['sci',1.2e-3]},
 {'id':18,'lvl':'advanced','op':'Apply','expr':'A hard drive holds 2 '+X+' '+sup(12)+' bytes. One song file uses about 4 '+X+' '+sup(6)+' bytes. How many song files can the hard drive hold?','disp':'0.5 '+X+' '+sup(6)+' → 5 '+X+' '+sup(5)+' songs','chk':['sci',5e5]},
]

from build_pretest import ENGINE
PARTS_CHECK = """
  document.querySelectorAll('.partin').forEach(inp=>{
    const fb=inp.parentElement.querySelector('.pfb'); levels.basic[1]++;
    if(inp.value.trim()===''){fb.textContent='';fb.className='pfb';return;}
    const good=inp.dataset.ans.split('|').some(a=>normText(a)===normText(inp.value));
    if(good)levels.basic[0]++; fb.textContent=good?'✓':'✗ '+inp.dataset.ans.split('|')[0]; fb.className='pfb '+(good?'ok':'no');
  });
"""
ENG = ENGINE.replace("  QS.forEach(q=>{\n    const inp=document.getElementById('i'+q.id), fb=document.getElementById('fb'+q.id), div=document.getElementById('q'+q.id);\n    levels[q.lvl][1]++;", PARTS_CHECK + "  QS.forEach(q=>{\n    const inp=document.getElementById('i'+q.id), fb=document.getElementById('fb'+q.id), div=document.getElementById('q'+q.id);\n    levels[q.lvl][1]++;", 1)
ENG = ENG.replace("function reveal(){", "function reveal(){\n  document.querySelectorAll('.partin').forEach(i=>{i.value=i.dataset.ans.split('|')[0];const fb=i.parentElement.querySelector('.pfb');fb.textContent='';});", 1)
ENG = ENG.replace("function reset(){", "function reset(){\n  document.querySelectorAll('.partin').forEach(i=>{i.value='';const fb=i.parentElement.querySelector('.pfb');fb.textContent='';fb.className='pfb';});", 1)
assert ENG.count('.partin') == 3, 'engine patch failed'
EXTRA_CSS = """
.def .ex{display:block;font-size:.9em;color:#5a5440;font-style:italic;margin-top:2px}
.fillparts .parts{gap:22px}
.fillparts .p{display:flex;flex-direction:column;align-items:center;gap:3px}
.partin{font:inherit;font-size:15px;width:9.5em;text-align:center;padding:5px 6px;border:1.5px solid #cfc6aa;border-radius:6px;background:#fff;color:var(--navy);font-weight:700}
.partin:focus{outline:2px solid var(--gold);outline-offset:1px}
.fillparts small{font-size:12px;color:#6b6754}
.pfb{font-family:var(--mono);font-size:12px;min-height:1em}.pfb.ok{color:#15803D}.pfb.no{color:#B42318}
.qgrid[data-level=advanced] .q .expr{font-size:17px;line-height:1.45}
@media print{
  .partin{border:0;border-bottom:1.5px solid #333;border-radius:0;background:transparent}
  .pfb{display:none}
  .qgrid[data-level=basic] .q{min-height:1.15in}
  .qgrid[data-level=target] .q{min-height:1.9in}
  .qgrid[data-level=advanced] .q{min-height:2.3in}
  .q,.refbox,table.vocab tr{break-inside:avoid;page-break-inside:avoid}
  .stripe:has(.qgrid[data-level=basic]) ~ .band{break-before:page}
  .band{break-after:avoid}
  .q{display:flex;flex-direction:column}.q .ans{margin-top:auto}
}
"""

cfg = {
 'file':'Unit2_PreTest_ScientificNotation.html',
 'unit':'unit2','unitlabel':'Unit 2',
 'title':'Unit 2 Pre-Test — Scientific Notation',
 'h1':'Unit 2 Pre-Test','sub':'Scientific Notation','std':'Standards assessed: NC.8.EE.3, NC.8.EE.4',
 'vocab_key':vocab_key,
 'bands':[
   {'num':'3.0','name':'Basic Understanding','level':'basic','code':'NC.8.EE.3',
    'obj':'Express very large and very small quantities in scientific notation and standard form.',
    'can':'I can write numbers in scientific notation and in standard form, and recognize correct form.',
    'prompt':'Match each vocabulary term to its definition, fill in the parts of a number in scientific notation, then write each number as directed.',
    'vocab_html':vocab_table(terms,defs),'refbox':refbox},
   {'num':'4.0','name':'Target Content','level':'target','code':'NC.8.EE.4',
    'obj':'Perform operations with numbers in scientific notation and compare their sizes.',
    'can':'I can multiply and divide numbers in scientific notation and tell how many times larger one is than another.',
    'prompt':'Multiply, divide, or compare. Write each answer in correct scientific notation.'},
   {'num':'5.0','name':'Advanced Content','level':'advanced','code':'NC.8.EE.4',
    'obj':'Multiply and divide numbers in scientific notation, including negative exponents, and solve multi-step real-world problems.',
    'can':'I can multiply and divide with negative exponents, fix the form of my answer, and solve real-world problems in scientific notation.',
    'prompt':'Solve. Show your work. Write each answer in correct scientific notation (the first number must be at least 1 and less than 10).'},
 ],
 'qs':qs,
 'engine':ENG,
 'extra_css':EXTRA_CSS,
}

out = build(cfg)
print("built", out)
