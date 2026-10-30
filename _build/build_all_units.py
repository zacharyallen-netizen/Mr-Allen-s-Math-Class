#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys; sys.path.insert(0,'/home/claude/mr-allen-s-math-class/_build')
from build_pretest import build
from pretest_svg import *

MINUS='−'  # − for display
X='×'
PI='π'
def sup(n): return '<sup>%s</sup>' % n
def neg(n):  # display negative with real minus
    return (MINUS+str(abs(n))) if (isinstance(n,(int,float)) and n<0) else str(n)

def vocab_table(terms, defs):
    opts=''.join('<option>%s</option>'%L for L in 'ABCDEF'[:len(defs)])
    rows=[]
    for i in range(len(terms)):
        term=terms[i]; L,dtext=defs[i]
        left=('<td class="term"><select data-term="%s"><option value="">–</option>%s</select>'
              '<span class="word">%s</span><span class="fb"></span></td>')%(term.lower(),opts,term)
        right='<td class="def"><b>%s.</b> %s</td>'%(L,dtext)
        rows.append('      <tr>%s\n          %s</tr>'%(left,right))
    return '    <table class="vocab" id="vocab">\n'+'\n'.join(rows)+'\n    </table>'

def refbox(title, inner):
    return ('    <div class="refbox"><p class="rl">%s</p>%s</div>')%(title,inner)

CFGS=[]

# ============================================================ UNIT 3 — Linear Equations
terms=['coefficient','constant','inverse operations','solution','distributive property','like terms']
defs=[('A','Terms with the same variable raised to the same power.'),
      ('B','The value of the variable that makes the equation true.'),
      ('C','A number multiplied by a variable.'),
      ('D','Operations that undo each other, such as + and −.'),
      ('E','A term with no variable — just a number.'),
      ('F','Multiplying a factor across each term inside parentheses.')]
key={'coefficient':'C','constant':'E','inverse operations':'D','solution':'B','distributive property':'F','like terms':'A'}
rb=refbox('Keep the equation balanced — worked example',
      '<p style="text-align:center;font-size:17px;margin:6px 0">2x + 5 = 13  →  <i>subtract 5</i>  →  2x = 8  →  <i>divide by 2</i>  →  <b>x = 4</b></p>'
      '<p class="tag">Whatever you do to one side, do to the other.</p>')
qs=[
 {'id':1,'lvl':'basic','op':'Solve','expr':'x + 7 = 12','disp':'x = 5','chk':['val',5],'lab':'x ='},
 {'id':2,'lvl':'basic','op':'Solve','expr':'x − 4 = 9','disp':'x = 13','chk':['val',13],'lab':'x ='},
 {'id':3,'lvl':'basic','op':'Solve','expr':'3x = 21','disp':'x = 7','chk':['val',7],'lab':'x ='},
 {'id':4,'lvl':'basic','op':'Solve','expr':'x ÷ 5 = 6','disp':'x = 30','chk':['val',30],'lab':'x ='},
 {'id':5,'lvl':'basic','op':'Solve','expr':'2x + 3 = 11','disp':'x = 4','chk':['val',4],'lab':'x ='},
 {'id':6,'lvl':'basic','op':'Solve','expr':'4x + 5 = 25','disp':'x = 5','chk':['val',5],'lab':'x ='},
 {'id':7,'lvl':'target','op':'Solve','expr':'2(x + 3) = 14','disp':'x = 4','chk':['val',4],'lab':'x ='},
 {'id':8,'lvl':'target','op':'Solve','expr':'3(x − 2) = 9','disp':'x = 5','chk':['val',5],'lab':'x ='},
 {'id':9,'lvl':'target','op':'Solve','expr':'5x + 2 = 3x + 10','disp':'x = 4','chk':['val',4],'lab':'x ='},
 {'id':10,'lvl':'target','op':'Solve','expr':'7x − 4 = 2x + 11','disp':'x = 3','chk':['val',3],'lab':'x ='},
 {'id':11,'lvl':'target','op':'Solve','expr':'2(x + 4) = 3x + 5','disp':'x = 3','chk':['val',3],'lab':'x ='},
 {'id':12,'lvl':'target','op':'Solve','expr':'3(2x − 1) = 4x + 7','disp':'x = 5','chk':['val',5],'lab':'x ='},
 {'id':13,'lvl':'advanced','op':'Solve','expr':'<span class="frac"><span class="num">1</span><span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">/</span><span class="den">2</span></span>x + 3 = 9','disp':'x = 12','chk':['val',12],'lab':'x ='},
 {'id':14,'lvl':'advanced','op':'Solve','expr':'0.2x + 1 = 3','disp':'x = 10','chk':['val',10],'lab':'x ='},
 {'id':15,'lvl':'advanced','op':'Solve','expr':'<span class="frac"><span class="num">2</span><span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">/</span><span class="den">3</span></span>x = 8','disp':'x = 12','chk':['val',12],'lab':'x ='},
 {'id':16,'lvl':'advanced','op':'Solve','expr':'3x + 5 = 3x + 5','disp':'infinitely many solutions','chk':['text',['infinitely many','infinitely many solutions','infinite','infinite solutions','all real numbers','all reals','identity']],'lab':'Answer:'},
 {'id':17,'lvl':'advanced','op':'Solve','expr':'2x + 4 = 2x − 1','disp':'no solution','chk':['text',['no solution','no solutions','none','no soln','empty','empty set']],'lab':'Answer:'},
 {'id':18,'lvl':'advanced','op':'Solve','expr':'5(x + 2) − 3 = 2(x + 5)','disp':'x = 1','chk':['val',1],'lab':'x ='},
]
CFGS.append(dict(file='Unit3_PreTest.html',unit='unit3',unitlabel='Unit 3',
  title='Unit 3 Pre-Test — Linear Equations',h1='Unit 3 Pre-Test',sub='Solving Linear Equations',
  std='Standard assessed: NC.8.EE.7',vocab_key=key,
  bands=[
   dict(num='3.0',name='Basic Understanding',level='basic',code='NC.8.EE.7',
     obj='Solve linear equations in one variable.',
     can='I can solve one-step and two-step equations using inverse operations.',
     prompt='Match each vocabulary term to its definition, then solve each equation.',
     vocab_html=vocab_table(terms,defs),refbox=rb),
   dict(num='4.0',name='Target Content',level='target',code='NC.8.EE.7',
     obj='Solve equations with the distributive property and variables on both sides.',
     can='I can solve multi-step equations, including variables on both sides.',
     prompt='Solve each equation. Show your work.'),
   dict(num='5.0',name='Advanced Content',level='advanced',code='NC.8.EE.7',
     obj='Solve equations with fractions or decimals and identify special solutions.',
     can='I can solve equations with rational coefficients and recognize equations with one, none, or infinitely many solutions.',
     prompt='Solve. If there is no solution or infinitely many, write that instead.'),
  ],qs=qs))

# ============================================================ UNIT 4 — Angles & Geometry
terms=['supplementary angles','complementary angles','vertical angles','transversal','corresponding angles','exterior angle']
defs=[('A','Two angles whose measures add to 90°.'),
      ('B','Opposite angles formed by two intersecting lines; they are equal.'),
      ('C','A line that crosses two or more other lines.'),
      ('D','Two angles whose measures add to 180°.'),
      ('E','Angles in the same corner at each crossing. They are equal when the lines are parallel.'),
      ('F','The angle formed outside a triangle when one side is extended.')]
key={'supplementary angles':'D','complementary angles':'A','vertical angles':'B','transversal':'C','corresponding angles':'E','exterior angle':'F'}
rb=refbox('Angle facts — reference',
      '<p style="text-align:center;font-size:15px;margin:6px 0">Straight line = <b>180°</b>  ·  Triangle angles sum to <b>180°</b>  ·  Right angle = <b>90°</b></p>'
      '<p class="tag">Exterior angle of a triangle = sum of the two remote interior angles.</p>')
D='°'
qs=[
 {'id':1,'lvl':'basic','op':'Supplementary','expr':'Two angles are supplementary. One is 125'+D+'. Find the other.','disp':'55'+D,'chk':['num',55,0.5],'lab':'x ='},
 {'id':2,'lvl':'basic','op':'Complementary','expr':'Two angles are complementary. One is 35'+D+'. Find the other.','disp':'55'+D,'chk':['num',55,0.5],'lab':'x ='},
 {'id':3,'lvl':'basic','op':'Vertical','expr':'Two lines cross. One angle is 70'+D+'. Find its vertical angle.','disp':'70'+D,'chk':['num',70,0.5],'lab':'x ='},
 {'id':4,'lvl':'basic','op':'Linear pair','expr':'Angles on a straight line are 140'+D+' and x. Find x.','disp':'40'+D,'chk':['num',40,0.5],'lab':'x ='},
 {'id':5,'lvl':'basic','op':'Complementary','expr':'Two angles are complementary. One is 62'+D+'. Find the other.','disp':'28'+D,'chk':['num',28,0.5],'lab':'x ='},
 {'id':6,'lvl':'basic','op':'Linear pair','expr':'Two angles form a linear pair. One is 95'+D+'. Find the other.','disp':'85'+D,'chk':['num',85,0.5],'lab':'x ='},
 {'id':7,'lvl':'target','op':'Corresponding','expr':'Parallel lines cut by a transversal. Find the corresponding angle to 110'+D+'.','disp':'110'+D,'chk':['num',110,0.5],'lab':'x ='},
 {'id':8,'lvl':'target','op':'Alt. interior','expr':'Alternate interior angles; one is 75'+D+'. Find the other.','disp':'75'+D,'chk':['num',75,0.5],'lab':'x ='},
 {'id':9,'lvl':'target','op':'Same-side interior','expr':'Same-side interior angles; one is 65'+D+'. Find the other.','disp':'115'+D,'chk':['num',115,0.5],'lab':'x ='},
 {'id':10,'lvl':'target','op':'Alt. exterior','expr':'A transversal makes an 80'+D+' angle. Find its alternate exterior angle.','disp':'80'+D,'chk':['num',80,0.5],'lab':'x ='},
 {'id':11,'lvl':'target','op':'Solve','expr':'Angles 2x and 50'+D+' are corresponding. Find x.','disp':'x = 25','chk':['num',25,0.5],'lab':'x ='},
 {'id':12,'lvl':'target','op':'Solve','expr':'Same-side interior angles 3x and 60'+D+' add to 180'+D+'. Find x.','disp':'x = 40','chk':['num',40,0.5],'lab':'x ='},
 {'id':13,'lvl':'advanced','op':'Triangle sum','expr':'A triangle has angles 65'+D+' and 80'+D+'. Find the third angle.','disp':'35'+D,'chk':['num',35,0.5],'lab':'x ='},
 {'id':14,'lvl':'advanced','op':'Triangle sum','expr':'A triangle has angles 90'+D+' and 37'+D+'. Find the third angle.','disp':'53'+D,'chk':['num',53,0.5],'lab':'x ='},
 {'id':15,'lvl':'advanced','op':'Exterior angle','expr':'Remote interior angles are 55'+D+' and 70'+D+'. Find the exterior angle.','disp':'125'+D,'chk':['num',125,0.5],'lab':'x ='},
 {'id':16,'lvl':'advanced','op':'Exterior angle','expr':'An exterior angle is 120'+D+'; one remote interior is 45'+D+'. Find the other remote.','disp':'75'+D,'chk':['num',75,0.5],'lab':'x ='},
 {'id':17,'lvl':'advanced','op':'Solve','expr':'A triangle has angles x, 2x, and 3x. Find x.','disp':'x = 30','chk':['num',30,0.5],'lab':'x ='},
 {'id':18,'lvl':'advanced','op':'Isosceles','expr':'An isosceles triangle has a vertex angle of 40'+D+'. Find one base angle.','disp':'70'+D,'chk':['num',70,0.5],'lab':'x ='},
]
CFGS.append(dict(file='Unit4_PreTest.html',unit='unit4',unitlabel='Unit 4',
  title='Unit 4 Pre-Test — Angles & Geometry',h1='Unit 4 Pre-Test',sub='Angle Relationships & Triangles',
  std='Standard assessed: NC.8.G.5',vocab_key=key,
  bands=[
   dict(num='3.0',name='Basic Understanding',level='basic',code='NC.8.G.5',
     obj='Understand angle relationships at a point and on a line.',
     can='I can find missing angles using supplementary, complementary, vertical, and linear-pair relationships.',
     prompt='Match each vocabulary term to its definition, then find each missing angle.',
     vocab_html=vocab_table(terms,defs),refbox=rb),
   dict(num='4.0',name='Target Content',level='target',code='NC.8.G.5',
     obj='Find angles formed when parallel lines are cut by a transversal.',
     can='I can use corresponding, alternate, and same-side interior angle relationships to find unknown angles.',
     prompt='Find each unknown. Where a variable is given, solve for x.'),
   dict(num='5.0',name='Advanced Content',level='advanced',code='NC.8.G.5',
     obj='Apply the triangle angle-sum and exterior-angle theorems.',
     can='I can use the triangle angle sum and exterior-angle relationship to solve multi-step problems.',
     prompt='Find each unknown angle or value.'),
  ],qs=qs))

# ============================================================ UNIT 5 — Pythagorean Theorem
terms=['hypotenuse','legs','Pythagorean theorem','right triangle','square root','converse']
defs=[('A','The two sides that form the right angle.'),
      ('B','a² + b² = c², relating the sides of a right triangle.'),
      ('C','The side opposite the right angle; the longest side.'),
      ('D','A triangle that contains one 90° angle.'),
      ('E','A number that, multiplied by itself, gives a given value.'),
      ('F','If a² + b² = c², then the triangle is a right triangle.')]
key={'hypotenuse':'C','legs':'A','pythagorean theorem':'B','right triangle':'D','square root':'E','converse':'F'}
rb=refbox('Pythagorean theorem — reference',
      '<p style="text-align:center;font-size:20px;margin:6px 0"><b>a² + b² = c²</b></p>'
      '<p class="tag"><b>c</b> is the hypotenuse (opposite the right angle); <b>a</b> and <b>b</b> are the legs.</p>')
qs=[
 {'id':1,'lvl':'basic','op':'Find c','expr':'Legs 3 and 4. Find the hypotenuse.','disp':'5','chk':['num',5,0.05],'lab':'c ='},
 {'id':2,'lvl':'basic','op':'Find c','expr':'Legs 6 and 8. Find the hypotenuse.','disp':'10','chk':['num',10,0.05],'lab':'c ='},
 {'id':3,'lvl':'basic','op':'Find c','expr':'Legs 5 and 12. Find the hypotenuse.','disp':'13','chk':['num',13,0.05],'lab':'c ='},
 {'id':4,'lvl':'basic','op':'Find c','expr':'Legs 8 and 15. Find the hypotenuse.','disp':'17','chk':['num',17,0.05],'lab':'c ='},
 {'id':5,'lvl':'basic','op':'Find c','expr':'Legs 9 and 12. Find the hypotenuse.','disp':'15','chk':['num',15,0.05],'lab':'c ='},
 {'id':6,'lvl':'basic','op':'Find c','expr':'Legs 7 and 24. Find the hypotenuse.','disp':'25','chk':['num',25,0.05],'lab':'c ='},
 {'id':7,'lvl':'target','op':'Find a leg','expr':'One leg 6, hypotenuse 10. Find the other leg.','disp':'8','chk':['num',8,0.05],'lab':'a ='},
 {'id':8,'lvl':'target','op':'Find a leg','expr':'One leg 5, hypotenuse 13. Find the other leg.','disp':'12','chk':['num',12,0.05],'lab':'a ='},
 {'id':9,'lvl':'target','op':'Find a leg','expr':'One leg 9, hypotenuse 15. Find the other leg.','disp':'12','chk':['num',12,0.05],'lab':'a ='},
 {'id':10,'lvl':'target','op':'Nearest tenth','expr':'Legs 2 and 3. Find the hypotenuse to the nearest tenth.','disp':'3.6','chk':['num',3.6,0.0499],'lab':'c ≈'},
 {'id':11,'lvl':'target','op':'Nearest tenth','expr':'Legs 5 and 7. Find the hypotenuse to the nearest tenth.','disp':'8.6','chk':['num',8.6,0.0499],'lab':'c ≈'},
 {'id':12,'lvl':'target','op':'Nearest tenth','expr':'One leg 4, hypotenuse 9. Find the other leg to the nearest tenth.','disp':'8.1','chk':['num',8.1,0.0499],'lab':'a ≈'},
 {'id':13,'lvl':'advanced','op':'Distance','expr':'Find the distance between (0, 0) and (6, 8).','disp':'10','chk':['num',10,0.05],'lab':'d ='},
 {'id':14,'lvl':'advanced','op':'Distance','expr':'Find the distance between (1, 2) and (4, 6).','disp':'5','chk':['num',5,0.05],'lab':'d ='},
 {'id':15,'lvl':'advanced','op':'Apply','expr':'A 13 ft ladder reaches 12 ft up a wall. How far is the base from the wall?','disp':'5 ft','chk':['num',5,0.05],'lab':'distance ='},
 {'id':16,'lvl':'advanced','op':'Apply','expr':'A rectangle is 9 by 12. Find the length of its diagonal.','disp':'15','chk':['num',15,0.05],'lab':'d ='},
 {'id':17,'lvl':'advanced','op':'Distance','expr':'Find the distance between (−2, −1) and (3, 11).','disp':'13','chk':['num',13,0.05],'lab':'d ='},
 {'id':18,'lvl':'advanced','op':'Apply','expr':'A park is a right triangle with legs 20 m and 21 m. Find the longest side.','disp':'29 m','chk':['num',29,0.05],'lab':'longest side ='},
]
CFGS.append(dict(file='Unit5_PreTest.html',unit='unit5',unitlabel='Unit 5',
  title='Unit 5 Pre-Test — Pythagorean Theorem',h1='Unit 5 Pre-Test',sub='The Pythagorean Theorem',
  std='Standards assessed: NC.8.G.6, NC.8.G.7, NC.8.G.8',vocab_key=key,
  bands=[
   dict(num='3.0',name='Basic Understanding',level='basic',code='NC.8.G.7',
     obj='Apply the Pythagorean theorem to find the hypotenuse.',
     can='I can use a² + b² = c² to find the hypotenuse of a right triangle.',
     prompt='Match each vocabulary term to its definition, then find each hypotenuse.',
     vocab_html=vocab_table(terms,defs),refbox=rb),
   dict(num='4.0',name='Target Content',level='target',code='NC.8.G.7',
     obj='Find a missing leg and estimate non-perfect square roots.',
     can='I can find a missing leg and round answers to the nearest tenth when needed.',
     prompt='Find each missing side. Round to the nearest tenth where asked.'),
   dict(num='5.0',name='Advanced Content',level='advanced',code='NC.8.G.8',
     obj='Apply the theorem to the coordinate plane and real-world problems.',
     can='I can find the distance between two points and solve real-world right-triangle problems.',
     prompt='Solve each problem.'),
  ],qs=qs))

# ============================================================ UNIT 6 — Functions & Slope
terms=['function','slope','y-intercept','ordered pair','linear function','input']
defs=[('A','Where a graph crosses the y-axis (the value of y when x = 0).'),
      ('B','A relation in which each input has exactly one output.'),
      ('C','A point written (x, y) that gives a location on the graph.'),
      ('D','The steepness of a line, found as rise over run.'),
      ('E','A function whose graph is a straight line.'),
      ('F','The x-value that is put into a function.')]
key={'function':'B','slope':'D','y-intercept':'A','ordered pair':'C','linear function':'E','input':'F'}
rb=refbox('Slope-intercept form — reference',
      '<p style="text-align:center;font-size:20px;margin:6px 0"><b>y = mx + b</b></p>'
      '<p class="tag"><b>m</b> = slope (rise over run)  ·  <b>b</b> = y-intercept (where x = 0)</p>')
qs=[
 {'id':1,'lvl':'basic','op':'Function?','expr':'Is this a function?  (1, 2), (2, 4), (3, 6)','disp':'yes','chk':['text',['yes','y','yes it is']],'lab':'Answer:'},
 {'id':2,'lvl':'basic','op':'Function?','expr':'Is this a function?  (1, 2), (1, 3), (2, 5)','disp':'no','chk':['text',['no','n','no it is not']],'lab':'Answer:'},
 {'id':3,'lvl':'basic','op':'Slope','expr':'In y = 3x + 5, what is the slope?','disp':'3','chk':['val',3],'lab':'m ='},
 {'id':4,'lvl':'basic','op':'y-intercept','expr':'In y = 3x + 5, what is the y-intercept?','disp':'5','chk':['val',5],'lab':'b ='},
 {'id':5,'lvl':'basic','op':'Slope','expr':'In y = −2x + 7, what is the slope?','disp':MINUS+'2','chk':['val',-2],'lab':'m ='},
 {'id':6,'lvl':'basic','op':'y-intercept','expr':'In y = ½x − 4, what is the y-intercept?','disp':MINUS+'4','chk':['val',-4],'lab':'b ='},
 {'id':7,'lvl':'target','op':'Slope','expr':'Find the slope through (0, 1) and (2, 5).','disp':'2','chk':['val',2],'lab':'m ='},
 {'id':8,'lvl':'target','op':'Slope','expr':'Find the slope through (1, 3) and (4, 12).','disp':'3','chk':['val',3],'lab':'m ='},
 {'id':9,'lvl':'target','op':'Slope','expr':'Find the slope through (2, 7) and (5, 1).','disp':MINUS+'2','chk':['val',-2],'lab':'m ='},
 {'id':10,'lvl':'target','op':'y-intercept','expr':'A line has slope 4 and passes through (0, −3). Find the y-intercept.','disp':MINUS+'3','chk':['val',-3],'lab':'b ='},
 {'id':11,'lvl':'target','op':'From a table','expr':'x: 0, 1, 2 and y: 5, 8, 11. Find the slope.','disp':'3','chk':['val',3],'lab':'m ='},
 {'id':12,'lvl':'target','op':'From a table','expr':'x: 0, 1, 2 and y: 5, 8, 11. Find the y-intercept.','disp':'5','chk':['val',5],'lab':'b ='},
 {'id':13,'lvl':'advanced','op':'Write equation','expr':'A line has slope 3 and passes through (0, 2). Write y = mx + b.','disp':'y = 3x + 2','chk':['linear',3,2],'lab':'y ='},
 {'id':14,'lvl':'advanced','op':'Write equation','expr':'A line has slope −4 and passes through (0, −1). Write y = mx + b.','disp':'y = −4x − 1','chk':['linear',-4,-1],'lab':'y ='},
 {'id':15,'lvl':'advanced','op':'Compare','expr':'Function A: y = 2x + 3.  Function B: slope 5. Which has the greater slope? (A or B)','disp':'B','chk':['text',['b','function b','b)']],'lab':'Answer:'},
 {'id':16,'lvl':'advanced','op':'Rate','expr':'In y = 0.5x + 10, how much does y increase when x goes up by 1?','disp':'0.5','chk':['val',0.5],'lab':'y increases by'},
 {'id':17,'lvl':'advanced','op':'Slope','expr':'Find the slope through (1, 5) and (3, 11).','disp':'3','chk':['val',3],'lab':'m ='},
 {'id':18,'lvl':'advanced','op':'y-intercept','expr':'A line has slope 2 and passes through (3, 11). Find the y-intercept.','disp':'5','chk':['val',5],'lab':'b ='}, {'id':19,'lvl':'advanced','op':'System','expr':'Lines A and B are graphed. Write the solution of the system as an ordered pair.','disp':'(2, 2)','chk':['coord',2,2],'lab':'solution ='},
 {'id':20,'lvl':'advanced','op':'System','expr':'Lines A and B are graphed. How many solutions does this system have?','disp':'none','chk':['text',['none','no solution','0','zero','no solutions']],'lab':'Answer:'},
]
CFGS.append(dict(file='Unit6_PreTest.html',unit='unit6',unitlabel='Unit 6',
  title='Unit 6 Pre-Test — Functions & Slope',h1='Unit 6 Pre-Test',sub='Functions & Linear Relationships',
  std='Standards assessed: NC.8.F.1–F.5 · NC.8.EE.8',vocab_key=key,
  bands=[
   dict(num='3.0',name='Basic Understanding',level='basic',code='NC.8.F.1',
     obj='Identify functions and read slope and y-intercept from an equation.',
     can='I can decide whether a relation is a function and read slope and y-intercept from y = mx + b.',
     prompt='Match each vocabulary term to its definition, then answer each question.',
     vocab_html=vocab_table(terms,defs),refbox=rb),
   dict(num='4.0',name='Target Content',level='target',code='NC.8.F.4',
     obj='Find slope and y-intercept from two points and from a table.',
     can='I can find the slope and y-intercept from two points or a table of values.',
     prompt='Find each slope or y-intercept.'),
   dict(num='5.0',name='Advanced Content',level='advanced',code='NC.8.F.2 · NC.8.EE.8',
     obj='Write equations, compare functions, interpret slope, and solve a system by graphing.',
     can='I can write a linear equation, compare two functions, interpret slope as a rate of change, and read the solution of a system from its graph.',
     prompt='Answer each question.'),
  ],qs=qs))

# ============================================================ UNIT 7 — Data Analysis
terms=['scatterplot','positive association','negative association','outlier','line of best fit','cluster']
defs=[('A','As one variable increases, the other tends to increase.'),
      ('B','A data point that lies far away from the rest of the data.'),
      ('C','A graph that plots paired data as points.'),
      ('D','As one variable increases, the other tends to decrease.'),
      ('E','A straight line drawn to model the trend in a scatterplot.'),
      ('F','A group of data points bunched closely together.')]
key={'scatterplot':'C','positive association':'A','negative association':'D','outlier':'B','line of best fit':'E','cluster':'F'}
twoway=('<table style="width:100%;border-collapse:collapse;margin:4px 0;font-size:13px;text-align:center">'
 '<tr style="background:#1E2D4F;color:#fff"><th style="padding:5px;border:1px solid #b7ae97"></th><th style="padding:5px;border:1px solid #b7ae97">Likes Pizza</th><th style="padding:5px;border:1px solid #b7ae97">Does Not</th><th style="padding:5px;border:1px solid #b7ae97">Total</th></tr>'
 '<tr><td style="padding:5px;border:1px solid #b7ae97;font-weight:700">Boys</td><td style="padding:5px;border:1px solid #b7ae97">12</td><td style="padding:5px;border:1px solid #b7ae97">8</td><td style="padding:5px;border:1px solid #b7ae97">20</td></tr>'
 '<tr><td style="padding:5px;border:1px solid #b7ae97;font-weight:700">Girls</td><td style="padding:5px;border:1px solid #b7ae97">15</td><td style="padding:5px;border:1px solid #b7ae97">5</td><td style="padding:5px;border:1px solid #b7ae97">20</td></tr>'
 '<tr style="background:#f4f1e8"><td style="padding:5px;border:1px solid #b7ae97;font-weight:700">Total</td><td style="padding:5px;border:1px solid #b7ae97">27</td><td style="padding:5px;border:1px solid #b7ae97">13</td><td style="padding:5px;border:1px solid #b7ae97">40</td></tr></table>')
rb_tw=refbox('Two-way table — use for the questions below', twoway)
qs=[
 {'id':1,'lvl':'basic','op':'Association','expr':'As study time increases, test scores increase. Positive or negative association?','disp':'positive','chk':['text',['positive','positive association','pos']],'lab':'Answer:'},
 {'id':2,'lvl':'basic','op':'Association','expr':'As a car’s age increases, its value decreases. Positive or negative?','disp':'negative','chk':['text',['negative','negative association','neg']],'lab':'Answer:'},
 {'id':3,'lvl':'basic','op':'Vocabulary','expr':'A point lying far from the pattern is called a(n) ___.','disp':'outlier','chk':['text',['outlier','outliers','an outlier']],'lab':'Answer:'},
 {'id':4,'lvl':'basic','op':'Vocabulary','expr':'A graph of paired data points is called a ___.','disp':'scatterplot','chk':['text',['scatterplot','scatter plot','scatter-plot']],'lab':'Answer:'},
 {'id':5,'lvl':'basic','op':'Association','expr':'If x and y show no pattern at all, there is ___ association.','disp':'no','chk':['text',['no','none','no association','no linear association']],'lab':'Answer:'},
 {'id':6,'lvl':'basic','op':'Vocabulary','expr':'A line drawn to model the trend of a scatterplot is the line of ___.','disp':'best fit','chk':['text',['best fit','line of best fit','bestfit']],'lab':'Answer:'},
 {'id':7,'lvl':'target','op':'Predict','expr':'Line of best fit y = 2x + 5. Predict y when x = 10.','disp':'25','chk':['val',25],'lab':'y ='},
 {'id':8,'lvl':'target','op':'Predict','expr':'Line of best fit y = 2x + 5. Predict y when x = 0.','disp':'5','chk':['val',5],'lab':'y ='},
 {'id':9,'lvl':'target','op':'Interpret','expr':'In y = 2x + 5, by how much does y increase for each increase of 1 in x?','disp':'2','chk':['val',2],'lab':'y increases by'},
 {'id':10,'lvl':'target','op':'Two-way table','expr':'From the table, how many students like pizza in all?','disp':'27','chk':['val',27],'lab':'students ='},
 {'id':11,'lvl':'target','op':'Two-way table','expr':'From the table, how many girls were surveyed?','disp':'20','chk':['val',20],'lab':'girls ='},
 {'id':12,'lvl':'target','op':'Two-way table','expr':'From the table, how many students were surveyed in total?','disp':'40','chk':['val',40],'lab':'students ='},
 {'id':13,'lvl':'advanced','op':'Relative freq.','expr':'From the table, what percent of boys like pizza?','disp':'60%','chk':['num',60,0.5],'lab':'percent ='},
 {'id':14,'lvl':'advanced','op':'Relative freq.','expr':'From the table, what percent of girls like pizza?','disp':'75%','chk':['num',75,0.5],'lab':'percent ='},
 {'id':15,'lvl':'advanced','op':'Predict','expr':'Best-fit line for plant height: y = 3x + 2. Predict the height at x = 6 weeks.','disp':'20','chk':['val',20],'lab':'y ='},
 {'id':16,'lvl':'advanced','op':'Vocabulary','expr':'A scatterplot rises left to right, but one point sits far below the rest. That point is a(n) ___.','disp':'outlier','chk':['text',['outlier','outliers','an outlier']],'lab':'Answer:'},
 {'id':17,'lvl':'advanced','op':'Interpret','expr':'Value vs. age: y = −4x + 50, where y is the value in hundreds of dollars. By how many hundreds of dollars does the value drop each year?','disp':'4 hundred dollars ($400)','chk':['text',['4','4 hundred','4 hundreds','4 hundred dollars','4 hundreds of dollars','four','four hundred','400','$400','400 dollars','$400 dollars','$ 400','$400.00','400.00']],'lab':'Answer:'},
 {'id':18,'lvl':'advanced','op':'Predict','expr':'Line of best fit y = 1.5x + 10. Predict y when x = 8.','disp':'22','chk':['val',22],'lab':'y ='},
]
CFGS.append(dict(file='Unit7_PreTest.html',unit='unit7',unitlabel='Unit 7',
  title='Unit 7 Pre-Test — Data Analysis',h1='Unit 7 Pre-Test',sub='Scatterplots & Two-Way Tables',
  std='Standards assessed: NC.8.SP.1–SP.4',vocab_key=key,
  bands=[
   dict(num='3.0',name='Basic Understanding',level='basic',code='NC.8.SP.1',
     obj='Describe patterns of association in bivariate data.',
     can='I can describe associations in scatterplots and name their key features.',
     prompt='Match each vocabulary term to its definition, then answer each question.',
     vocab_html=vocab_table(terms,defs)),
   dict(num='4.0',name='Target Content',level='target',code='NC.8.SP.3, NC.8.SP.4',
     obj='Use a line of best fit to predict, and read two-way tables.',
     can='I can use a line of best fit to make predictions and read values from a two-way table.',
     prompt='Use the line of best fit and the two-way table to answer each question.',
     refbox=rb_tw),
   dict(num='5.0',name='Advanced Content',level='advanced',code='NC.8.SP.4',
     obj='Interpret relative frequencies and the meaning of slope in context.',
     can='I can find relative frequencies from a two-way table and interpret slope in a real situation.',
     prompt='Use the two-way table above and each best-fit line to answer.'),
  ],qs=qs))

# ============================================================ UNIT 8 — Transformations
terms=['translation','reflection','rotation','dilation','congruent','image']
defs=[('A','A flip of a figure over a line.'),
      ('B','A slide; every point moves the same distance and direction.'),
      ('C','A turn of a figure about a fixed point.'),
      ('D','An enlargement or reduction by a scale factor.'),
      ('E','Same size and same shape.'),
      ('F','The resulting figure after a transformation.')]
key={'translation':'B','reflection':'A','rotation':'C','dilation':'D','congruent':'E','image':'F'}
rb=refbox('Coordinate rules — reference',
      '<p style="font-size:13px;margin:6px 0;line-height:1.7">'
      'Reflect over x-axis: (x, y) → (x, −y)  ·  Reflect over y-axis: (x, y) → (−x, y)<br>'
      'Rotate 180°: (x, y) → (−x, −y)  ·  Rotate 90° CCW: (x, y) → (−y, x)  ·  Rotate 90° CW: (x, y) → (y, −x)<br>'
      'Dilation (center origin), scale k: (x, y) → (kx, ky)</p>')
qs=[
 {'id':1,'lvl':'basic','op':'Name it','expr':'Which transformation is a slide?','disp':'translation','chk':['text',['translation','a translation','slide']],'lab':'Answer:'},
 {'id':2,'lvl':'basic','op':'Name it','expr':'Which transformation is a flip?','disp':'reflection','chk':['text',['reflection','a reflection','flip']],'lab':'Answer:'},
 {'id':3,'lvl':'basic','op':'Name it','expr':'Which transformation is a turn?','disp':'rotation','chk':['text',['rotation','a rotation','turn']],'lab':'Answer:'},
 {'id':4,'lvl':'basic','op':'Translate','expr':'Translate (2, 3) right 4 units. New point?','disp':'(6, 3)','chk':['coord',6,3],'lab':'='},
 {'id':5,'lvl':'basic','op':'Translate','expr':'Translate (1, 5) down 2 units. New point?','disp':'(1, 3)','chk':['coord',1,3],'lab':'='},
 {'id':6,'lvl':'basic','op':'Translate','expr':'Translate (−2, 1) left 3 and up 2. New point?','disp':'(−5, 3)','chk':['coord',-5,3],'lab':'='},
 {'id':7,'lvl':'target','op':'Reflect','expr':'Reflect (4, 2) over the x-axis.','disp':'(4, −2)','chk':['coord',4,-2],'lab':'='},
 {'id':8,'lvl':'target','op':'Reflect','expr':'Reflect (3, 5) over the y-axis.','disp':'(−3, 5)','chk':['coord',-3,5],'lab':'='},
 {'id':9,'lvl':'target','op':'Reflect','expr':'Reflect (−2, 4) over the x-axis.','disp':'(−2, −4)','chk':['coord',-2,-4],'lab':'='},
 {'id':10,'lvl':'target','op':'Rotate','expr':'Rotate (3, 0) 90° counterclockwise about the origin.','disp':'(0, 3)','chk':['coord',0,3],'lab':'='},
 {'id':11,'lvl':'target','op':'Rotate','expr':'Rotate (2, 5) 180° about the origin.','disp':'(−2, −5)','chk':['coord',-2,-5],'lab':'='},
 {'id':12,'lvl':'target','op':'Reflect','expr':'Reflect (6, −1) over the y-axis.','disp':'(−6, −1)','chk':['coord',-6,-1],'lab':'='},
 {'id':13,'lvl':'advanced','op':'Dilate','expr':'Dilate (2, 4) by scale factor 3 (center origin).','disp':'(6, 12)','chk':['coord',6,12],'lab':'='},
 {'id':14,'lvl':'advanced','op':'Dilate','expr':'Dilate (10, 5) by scale factor ½ (center origin).','disp':'(5, 2.5)','chk':['coord',5,2.5],'lab':'='},
 {'id':15,'lvl':'advanced','op':'Scale','expr':'A dilation with scale factor 2 makes the image ___ (larger or smaller).','disp':'larger','chk':['text',['larger','bigger','enlarged']],'lab':'Answer:'},
 {'id':16,'lvl':'advanced','op':'Congruence','expr':'After a translation, the image is ___ to the original (congruent or similar).','disp':'congruent','chk':['text',['congruent']],'lab':'Answer:'},
 {'id':17,'lvl':'advanced','op':'Similarity','expr':'After a dilation with scale factor ≠ 1, the image is ___ to the original.','disp':'similar','chk':['text',['similar']],'lab':'Answer:'},
 {'id':18,'lvl':'advanced','op':'Rotate','expr':'Rotate (1, 2) 90° clockwise about the origin.','disp':'(2, −1)','chk':['coord',2,-1],'lab':'='},
]
CFGS.append(dict(file='Unit8_PreTest.html',unit='unit8',unitlabel='Unit 8',
  title='Unit 8 Pre-Test — Transformations',h1='Unit 8 Pre-Test',sub='Transformations on the Coordinate Plane',
  std='Standards assessed: NC.8.G.2–G.4',vocab_key=key,
  bands=[
   dict(num='3.0',name='Basic Understanding',level='basic',code='NC.8.G.2',
     obj='Identify transformations and translate figures.',
     can='I can name translations, reflections, and rotations and translate a point.',
     prompt='Match each vocabulary term to its definition, then find each image point.',
     vocab_html=vocab_table(terms,defs),refbox=rb),
   dict(num='4.0',name='Target Content',level='target',code='NC.8.G.3',
     obj='Reflect and rotate points on the coordinate plane.',
     can='I can find the image of a point after a reflection or rotation.',
     prompt='Find each image point. Write your answer as (x, y).'),
   dict(num='5.0',name='Advanced Content',level='advanced',code='NC.8.G.4',
     obj='Dilate figures and describe congruence and similarity.',
     can='I can dilate a point by a scale factor and tell whether figures are congruent or similar.',
     prompt='Find each image point or answer each question.'),
  ],qs=qs))

# ============================================================ UNIT 9 — Volume
terms=['radius','diameter','cylinder','cone','sphere','volume']
defs=[('A','The distance from the center of a circle to its edge.'),
      ('B','The amount of space a solid figure holds.'),
      ('C','A solid with two parallel circular bases.'),
      ('D','The distance across a circle through its center.'),
      ('E','A solid with one circular base that narrows to a point.'),
      ('F','A perfectly round solid, like a ball.')]
key={'radius':'A','diameter':'D','cylinder':'C','cone':'E','sphere':'F','volume':'B'}
rb=refbox('Volume formulas — reference',
      '<p style="text-align:center;font-size:15px;margin:6px 0;line-height:1.9">'
      'Cylinder: <b>V = '+PI+'r²h</b>  ·  Cone: <b>V = ⅓'+PI+'r²h</b>  ·  Sphere: <b>V = ⁴⁄₃'+PI+'r³</b></p>'
      '<p class="tag">Leave answers <b>in terms of '+PI+'</b> (for example, 12'+PI+') unless told to round.</p>')
qs=[
 {'id':1,'lvl':'basic','op':'Cylinder','expr':'r = 3, h = 5. Find the volume (in terms of π).','disp':'45π','chk':['pi',45],'lab':'V ='},
 {'id':2,'lvl':'basic','op':'Cylinder','expr':'r = 2, h = 10. Find the volume.','disp':'40π','chk':['pi',40],'lab':'V ='},
 {'id':3,'lvl':'basic','op':'Cylinder','expr':'r = 5, h = 4. Find the volume.','disp':'100π','chk':['pi',100],'lab':'V ='},
 {'id':4,'lvl':'basic','op':'Cone','expr':'r = 3, h = 4. Find the volume.','disp':'12π','chk':['pi',12],'lab':'V ='},
 {'id':5,'lvl':'basic','op':'Cone','expr':'r = 6, h = 5. Find the volume.','disp':'60π','chk':['pi',60],'lab':'V ='},
 {'id':6,'lvl':'basic','op':'Cone','expr':'r = 3, h = 10. Find the volume.','disp':'30π','chk':['pi',30],'lab':'V ='},
 {'id':7,'lvl':'target','op':'Find the radius','expr':'A cylinder has volume 100π and height 4. Find the radius.','disp':'5','chk':['val',5],'lab':'r ='},
 {'id':8,'lvl':'target','op':'Find the height','expr':'A cylinder has volume 48π and radius 4. Find the height.','disp':'3','chk':['val',3],'lab':'h ='},
 {'id':9,'lvl':'target','op':'Find the height','expr':'A cylinder has volume 200π and radius 10. Find the height.','disp':'2','chk':['val',2],'lab':'h ='},
 {'id':10,'lvl':'target','op':'Find the radius','expr':'A cone has volume 12π and height 4. Find the radius.','disp':'3','chk':['val',3],'lab':'r ='},
 {'id':11,'lvl':'target','op':'Find the height','expr':'A cone has volume 54π and radius 9. Find the height.','disp':'2','chk':['val',2],'lab':'h ='},
 {'id':12,'lvl':'target','op':'Find the height','expr':'A cone has volume 30π and radius 3. Find the height.','disp':'10','chk':['val',10],'lab':'h ='},
 {'id':13,'lvl':'advanced','op':'Sphere','expr':'r = 3. Find the volume.','disp':'36'+PI,'chk':['pi',36],'lab':'V ='},
 {'id':14,'lvl':'advanced','op':'Sphere','expr':'r = 6. Find the volume.','disp':'288'+PI,'chk':['pi',288],'lab':'V ='},
 {'id':15,'lvl':'advanced','op':'Sphere','expr':'A sphere has diameter 6. Find the volume.','disp':'36'+PI,'chk':['pi',36],'lab':'V ='},
 {'id':16,'lvl':'advanced','op':'Apply','expr':'A can (cylinder) has r = 3 cm and h = 10 cm. Find the volume in terms of '+PI+'.','disp':'90'+PI+' cm³','chk':['pi',90],'lab':'V ='},
 {'id':17,'lvl':'advanced','op':'Compare','expr':'A cone and a cylinder have the same radius and height. The cone’s volume is what fraction of the cylinder’s?','disp':'⅓','chk':['frac',1,3],'lab':'Answer:'},
 {'id':18,'lvl':'advanced','op':'Compare','expr':'A sphere has r = 3. A cylinder has r = 3, h = 6. Which has the greater volume?','disp':'the cylinder','chk':['text',['cylinder','the cylinder','cyl']],'lab':'Answer:'},
]
CFGS.append(dict(file='Unit9_PreTest.html',unit='unit9',unitlabel='Unit 9',
  title='Unit 9 Pre-Test — Volume',h1='Unit 9 Pre-Test',sub='Volume of Cylinders, Cones & Spheres',
  std='Standard assessed: NC.8.G.9',vocab_key=key,
  bands=[
   dict(num='3.0',name='Basic Understanding',level='basic',code='NC.8.G.9',
     obj='Find the volume of a cylinder and a cone from the formula.',
     can='I can substitute into V = '+PI+'r²h and V = ⅓'+PI+'r²h to find a volume.',
     prompt='Match each vocabulary term to its definition, then find each volume.',
     vocab_html=vocab_table(terms,defs),refbox=rb),
   dict(num='4.0',name='Target Content',level='target',code='NC.8.G.9',
     obj='Work backwards from a known volume to find a missing dimension.',
     can='I can rearrange the volume formula to find a missing radius or height.',
     prompt='The volume is given. Find the missing measurement.'),
   dict(num='5.0',name='Advanced Content',level='advanced',code='NC.8.G.9',
     obj='Find the volume of a sphere and solve multi-step problems.',
     can='I can find the volume of a sphere and compare volumes of different solids.',
     prompt='Solve each problem. Leave answers in terms of '+PI+' unless told otherwise.'),
  ],qs=qs))


import u4viz as V4
def relabel(svg, lab):
    """Swap the unknown's default x° label for an expression like 2x."""
    return svg.replace('>x°</text>', '>%s</text>' % lab)
def tri_xyz():
    """Triangle with angles x, 2x, 3x = 30°, 60°, 90°, every angle marked as an unknown expression (no right-angle box)."""
    A,B,C=V4._tri_fit(30,60,150,98,115,132)
    s=V4.poly([A,B,C])
    s+=V4.unknown(B,V4._ang(B,C),V4._ang(B,A),22,'x')
    s+=V4.unknown(C,V4._ang(C,A),V4._ang(C,B),20,'2x')
    # plain arc at the 3x vertex (no right-angle box: students must use x + 2x + 3x = 180)
    s+=V4.wedge(A,V4._ang(A,B),V4._ang(A,C),14)+V4.T(A[0],A[1]-10,'3x',V4.GOLD,'middle',13.5)
    return V4.svg(230,152,s,'Diagram: triangle with angles x, 2x and 3x')
def isosceles_n(vertex):
    base=(180-vertex)/2.0
    A,B,C=V4._tri_fit(base,base,120,104,115,138)
    s=V4.poly([A,B,C])
    s+=V4.given(A,V4._ang(A,B),V4._ang(A,C),22,vertex)
    s+=V4.unknown(B,V4._ang(B,C),V4._ang(B,A),22)
    for P1,P2 in ((A,B),(A,C)):   # tick marks on the equal sides
        mx,my=(P1[0]+P2[0])/2,(P1[1]+P2[1])/2
        dx,dy=P2[0]-P1[0],P2[1]-P1[1]; L=(dx*dx+dy*dy)**0.5; nx,ny=-dy/L*6,dx/L*6
        s+=V4.Ln(mx-nx,my-ny,mx+nx,my+ny,V4.NAVY,2)
    return V4.svg(230,160,s,'Diagram: isosceles triangle, vertex angle %d°' % vertex)
# ---- attach geometry diagrams (one per question) ----
DIAS = {
 'Unit4_PreTest.html': {
   1:V4.supp(125,'Diagram: supplementary angles, given 125°'),2:V4.comp(35,'Diagram: complementary angles, given 35°'),
   3:V4.vertical(70,'Diagram: vertical angles, given 70°'),4:V4.supp(140,'Diagram: linear pair, given 140°'),
   5:V4.comp(62,'Diagram: complementary angles, given 62°'),6:V4.supp(95,'Diagram: linear pair, given 95°'),
   7:V4.transversal('Corresponding',110,'Diagram: corresponding angles, given 110°'),
   8:V4.transversal('Alternate Interior',75,'Diagram: alternate interior angles, given 75°'),
   9:V4.transversal('Co-Interior',65,'Diagram: same-side interior angles, given 65°'),
   10:V4.transversal('Alternate Exterior',80,'Diagram: alternate exterior angles, given 80°'),
   11:relabel(V4.transversal('Corresponding',50,'Diagram: corresponding angles 50° and 2x'),'2x'),
   12:relabel(V4.transversal('Co-Interior',60,'Diagram: same-side interior angles 60° and 3x'),'3x'),
   13:V4.angle_sum(65,80,'Diagram: triangle with 65° and 80°'),14:V4.angle_sum(90,37,'Diagram: right triangle with 37°'),
   15:V4.exterior(55,70,125,'ext','Diagram: remote interior angles 55° and 70°'),
   16:V4.exterior(0,45,120,'remote','Diagram: exterior angle 120°, remote interior 45°'),
   17:tri_xyz(),18:isosceles_n(40),
 },
 'Unit5_PreTest.html': {
   1:rtri(3,4,'3','4','c = ?'),2:rtri(6,8,'6','8','c = ?'),3:rtri(5,12,'5','12','c = ?'),
   4:rtri(8,15,'8','15','c = ?'),5:rtri(9,12,'9','12','c = ?'),6:rtri(7,24,'7','24','c = ?'),
   7:rtri(6,8,'6','?','10'),8:rtri(5,12,'5','?','13'),9:rtri(9,12,'9','?','15'),
   10:rtri(2,3,'2','3','c = ?'),11:rtri(5,7,'5','7','c = ?'),12:rtri(4,8.06,'4','?','9'),
   13:coord_dist(0,0,6,8),14:coord_dist(1,2,4,6),15:ladder('13 ft','?','12 ft',5,12),
   16:rect_diag(9,12,'9','12','d = ?'),17:coord_dist(-2,-1,3,11),18:rtri(20,21,'20','21','c = ?'),
 },
 'Unit8_PreTest.html': {
   1:concept_slide(),2:concept_flip(),3:concept_turn(),
   4:coord_point(2,3),5:coord_point(1,5),6:coord_point(-2,1),
   7:coord_point(4,2,axis='x'),8:coord_point(3,5,axis='y'),9:coord_point(-2,4,axis='x'),
   10:coord_point(3,0,center=True),11:coord_point(2,5,center=True),12:coord_point(6,-1,axis='y'),
   13:coord_point(2,4,center=True),14:coord_point(10,5,center=True),15:concept_similar(),
   16:concept_congruent(),17:concept_similar(),18:coord_point(1,2,center=True),
 },
 'Unit9_PreTest.html': {
   1:cylinder_n(3,5,'r = 3','h = 5'),2:cylinder_n(2,10,'r = 2','h = 10'),3:cylinder_n(5,4,'r = 5','h = 4'),
   4:cone_n(3,4,'r = 3','h = 4'),5:cone_n(6,5,'r = 6','h = 5'),6:cone_n(3,10,'r = 3','h = 10'),
   7:cylinder_n(5,4,'r = ?','h = 4'),8:cylinder_n(4,3,'r = 4','h = ?'),9:cylinder_n(10,2,'r = 10','h = ?'),
   10:cone_n(3,4,'r = ?','h = 4'),11:cone_n(9,2,'r = 9','h = ?'),12:cone_n(3,10,'r = 3','h = ?'),
   13:sphere('r = 3',R=32),14:sphere('r = 6',R=52),15:sphere('d = 6',is_diam=True,R=32),
   16:cylinder_n(3,10,'r = 3 cm','h = 10 cm'),17:cone_vs_cyl(),18:sphere_vs_cyl(),
 },
 'Unit6_PreTest.html': {
   1:points_plot([(1,2),(2,4),(3,6)]),2:points_plot([(1,2),(1,3),(2,5)]),
   3:line_graph(3,5),4:line_graph(3,5),5:line_graph(-2,7),6:line_graph(0.5,-4),
   7:line_graph(2,1,[(0,1),(2,5)]),8:line_graph(3,0,[(1,3),(4,12)]),9:line_graph(-2,11,[(2,7),(5,1)]),
   10:line_graph(4,-3,[(0,-3)]),11:line_graph(3,5,[(0,5),(1,8),(2,11)]),12:line_graph(3,5,[(0,5),(1,8),(2,11)]),
   13:line_graph(3,2,[(0,2)]),14:line_graph(-4,-1,[(0,-1)]),15:line_graph2(2,3,5,0),
   16:line_graph(0.5,10),17:line_graph(3,2,[(1,5),(3,11)]),18:line_graph(2,5,[(3,11)]),
   19:line_graph2_read(0.5,1,-0.5,3),20:line_graph2(0.5,2,0.5,-2),
 },
 'Unit7_PreTest.html': {
   1:scatter_eq(6,40,10,100,1,'hours studied','test score',fit=False),
   2:scatter_eq(-2.5,22,8,24,2,'age (years)','value ($1000s)',fit=False,noise=2),
   3:scatter_eq(1,1,10,12,3,'x','y',fit=False,outlier=(3,10.5),noise=1),
   4:scatter_eq(0.8,2,10,12,4,'x','y',fit=False,noise=1.2),
   5:scatter_eq(None,0,10,10,5,'shoe size','minutes of TV',fit=False,n=12),
   6:scatter_eq(0.9,1,10,11,6,'x','y',fit=False,noise=1.1,caption='a line can model this trend'),
   7:scatter_eq(2,5,12,30,7,'x','y',noise=2.5,show_eq='y = 2x + 5'),
   8:scatter_eq(2,5,10,26,8,'minutes','pages read',noise=2,show_eq='y = 2x + 5'),
   9:scatter_eq(2,5,8,22,9,'cups sold','cost ($)',noise=1.8,show_eq='y = 2x + 5'),
   15:scatter_eq(3,2,8,26,15,'weeks','height (cm)',noise=2.2,show_eq='y = 3x + 2'),
   16:scatter_eq(1.2,1,10,14,16,'x','y',fit=False,outlier=(7,1.5),noise=1),
   17:scatter_eq(-4,50,10,52,17,'age (years)','value ($100s)',noise=4,show_eq='y = −4x + 50'),
   18:scatter_eq(1.5,10,10,26,18,'x','y',noise=2,show_eq='y = 1.5x + 10'),
 },
}
for cfg in CFGS:
    dmap=DIAS.get(cfg['file'])
    if not dmap: continue
    for q in cfg['qs']:
        if q['id'] in dmap: q['svg']=dmap[q['id']]

# ---- standards for bands that list two (the tracker records one per question) ----
QSTD = {
 'Unit6_PreTest.html': {13:'NC.8.F.2',14:'NC.8.F.2',15:'NC.8.F.2',16:'NC.8.F.2',17:'NC.8.F.2',18:'NC.8.F.2',
                        19:'NC.8.EE.8',20:'NC.8.EE.8'},          # band: NC.8.F.2 · NC.8.EE.8 (19–20 are systems)
 'Unit7_PreTest.html': {7:'NC.8.SP.3',8:'NC.8.SP.3',9:'NC.8.SP.3',
                        10:'NC.8.SP.4',11:'NC.8.SP.4',12:'NC.8.SP.4'}, # band: NC.8.SP.3, NC.8.SP.4 (10–12 two-way table)
}
for cfg in CFGS:
    for q in cfg['qs']:
        if q['id'] in QSTD.get(cfg['file'], {}): q['std'] = QSTD[cfg['file']][q['id']]

# ---- build all ----
for cfg in CFGS:
    out=build(cfg)
    nsvg=sum(1 for q in cfg['qs'] if q.get('svg'))
    print('built', out.split('/')[-1], '(', len(cfg['qs']), 'questions,', nsvg, 'diagrams )')
print('DONE', len(CFGS), 'pre-tests')
