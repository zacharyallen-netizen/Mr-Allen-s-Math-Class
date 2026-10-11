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
    ('A', 'A number written the ordinary way, such as 45,000.'),
    ('B', 'The decimal factor in a × 10ⁿ — at least 1 and less than 10.'),
    ('C', 'Shows a small number between 0 and 1 (move the decimal left).'),
    ('D', 'A number written as a × 10ⁿ, where 1 ≤ a &lt; 10.'),
    ('E', 'In a power of ten, the 10 that is multiplied repeatedly.'),
    ('F', 'Shows a large number, 10 or greater (move the decimal right).'),
]
vocab_key = {'scientific notation':'D','coefficient':'B','standard form':'A','base':'E','positive exponent':'F','negative exponent':'C'}

refbox = """    <div class="refbox">
      <p class="rl">Parts of a number in scientific notation — reference</p>
      <div class="mono5x">3.4 × 10<sup>5</sup></div>
      <div class="parts">
        <span class="p"><b>coefficient</b>the decimal factor (1 to under 10)</span>
        <span class="p"><b>base</b>always 10</span>
        <span class="p"><b>exponent</b>how many places the decimal moves</span>
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
 {'id':9,'lvl':'target','op':'Multiply','expr':'(5 '+X+' '+sup(6)+')(4 '+X+' '+sup(3)+')','disp':'2 '+X+' '+sup(10),'chk':['sci',2e10]},
 {'id':10,'lvl':'target','op':'Compare','expr':'How many times larger is 6 '+X+' '+sup(8)+' than 2 '+X+' '+sup(3)+'?','disp':'3 '+X+' '+sup(5),'chk':['sci',3e5]},
 {'id':11,'lvl':'target','op':'Divide','expr':'(9 '+X+' '+sup(-2)+') ÷ (3 '+X+' '+sup(4)+')','disp':'3 '+X+' '+sup(-6),'chk':['sci',3e-6]},
 {'id':12,'lvl':'target','op':'Multiply','expr':'(2.5 '+X+' '+sup(5)+')(2 '+X+' '+sup(-8)+')','disp':'5 '+X+' '+sup(-3),'chk':['sci',5e-3]},
 # ---- 5.0 advanced ----
 {'id':13,'lvl':'advanced','op':'Add','expr':'(4 '+X+' '+sup(5)+') + (3 '+X+' '+sup(5)+')','disp':'7 '+X+' '+sup(5),'chk':['sci',7e5]},
 {'id':14,'lvl':'advanced','op':'Add','expr':'(5 '+X+' '+sup(6)+') + (3 '+X+' '+sup(5)+')','disp':'5.3 '+X+' '+sup(6),'chk':['sci',5.3e6]},
 {'id':15,'lvl':'advanced','op':'Subtract','expr':'(8.4 '+X+' '+sup(-3)+') − (2.1 '+X+' '+sup(-3)+')','disp':'6.3 '+X+' '+sup(-3),'chk':['sci',6.3e-3]},
 {'id':16,'lvl':'advanced','op':'Apply','expr':'A proton’s mass ≈ 1.67 '+X+' '+sup(-27)+' kg. Find the mass of 2,000 protons.','disp':'3.34 '+X+' '+sup(-24)+' kg','chk':['sci',3.34e-24]},
 {'id':17,'lvl':'advanced','op':'Apply','expr':'Light travels 3 '+X+' '+sup(8)+' m/s. How far in 2 '+X+' '+sup(2)+' seconds?','disp':'6 '+X+' '+sup(10)+' m','chk':['sci',6e10]},
 {'id':18,'lvl':'advanced','op':'Apply','expr':'A server holds 4.5 '+X+' '+sup(12)+' bytes. Each video is 9 '+X+' '+sup(5)+' bytes. How many videos fit?','disp':'5 '+X+' '+sup(6),'chk':['sci',5e6]},
]

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
    'prompt':'Match each vocabulary term to its definition, then write each number as directed.',
    'vocab_html':vocab_table(terms,defs),'refbox':refbox},
   {'num':'4.0','name':'Target Content','level':'target','code':'NC.8.EE.4',
    'obj':'Perform operations with numbers in scientific notation and compare their sizes.',
    'can':'I can multiply and divide numbers in scientific notation and tell how many times larger one is than another.',
    'prompt':'Multiply, divide, or compare. Write each answer in correct scientific notation.'},
   {'num':'5.0','name':'Advanced Content','level':'advanced','code':'NC.8.EE.4',
    'obj':'Add and subtract in scientific notation and solve multi-step real-world problems.',
    'can':'I can add and subtract in scientific notation and solve real-world problems, writing answers in scientific notation.',
    'prompt':'Solve. Write each answer in correct scientific notation.'},
 ],
 'qs':qs,
}

out = build(cfg)
print("built", out)
