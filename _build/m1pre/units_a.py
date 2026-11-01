#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""NC Math 1 pre-tests, Units 1–4 (configs)."""
from m1common import *
import m1svg as S

CFGS = []

# ======================================================================= UNIT 1
q = []
q.append(Q(1, 'basic', 'A-REI.3', 'Solve', '2x + 5 = 13', 'x = 4', ['n', 4],
           S.tape([(3, 'x', 'q'), (3, 'x', 'q'), (2.4, '5', 'g')], '13 in all', 'Bar model for 2x + 5 = 13 (not to scale)', top_label='not to scale'),
           'x =', 'Undo the + 5 first (subtract 5 from both sides). Then divide both sides by 2.'))
q.append(Q(2, 'basic', 'A-REI.3', 'Solve', fr('x', '3') + ' ' + MI + ' 4 = 2', 'x = 18', ['n', 18],
           S.chain(['?', '?', '2'], ['÷ 3', '− 4'], 'Flow chart: start with x, divide by 3, subtract 4, end at 2', W=230),
           'x =', 'Work backwards: add 4 (get 6), then multiply by 3.'))
q.append(Q(3, 'basic', 'N-RN.2', 'Simplify', 'x' + sup(3) + ' · x' + sup(4), 'x' + sup(7), ['expr', 'x^7', ['x'], {'form': 'mono'}],
           S.tape([(3, 'x · x · x', 'g'), (4, 'x · x · x · x', 'g')], 'x^? in all', 'x cubed times x to the fourth written out as factors'),
           'Answer:', 'Same base, multiplying: keep the base and ADD the exponents (3 + 4).', 'type like x^5'))
q.append(Q(4, 'basic', 'A-SSE.1', 'Parts of an expression', 'In 4x' + sup(2) + ' ' + MI + ' 7x + 9, what is the <b>coefficient</b> of x?',
           MI + '7', ['n', -7],
           S.term_cards(['4x^2', '−7x', '+9'], 'The three terms of 4x squared minus 7x plus 9', qidx=(1,), notes={1: 'coefficient = ?'}),
           'Answer:', 'A term keeps the sign in front of it. The term is −7x, so the coefficient is −7.'))
q.append(Q(5, 'basic', 'A-REI.3', 'Solve the inequality', 'x + 4 &gt; 10', 'x &gt; 6', ['ineq', 'x', '>', 6],
           S.numline(0, 12, 'Number line from 0 to 12 for graphing the answer', lab_every=2, title='Graph your answer here'),
           'Answer:', 'Subtract 4 from both sides. Adding or subtracting never flips the sign.', 'type like x>2'))
q.append(Q(6, 'basic', 'N-RN.2', 'Simplify', fr('x' + sup(8), 'x' + sup(2)), 'x' + sup(6), ['expr', 'x^6', ['x'], {'form': 'mono'}],
           S.card([('frac', '', 'x·x·x·x·x·x·x·x', 'x·x', ' = x^?')], 'x to the eighth over x squared written out as factors', W=250),
           'Answer:', 'Same base, dividing: keep the base and SUBTRACT the exponents (8 − 2). Each x on the bottom cancels one x on top.', 'type like x^5'))
# target
q.append(Q(7, 'target', 'A-REI.3', 'Solve', '3(x ' + MI + ' 2) + 4x = 22', 'x = 4', ['n', 4],
           S.balance('3(x − 2) + 4x', '22', 'Balance: 3(x − 2) + 4x on the left, 22 on the right'),
           'x =', 'Distribute first: 3x − 6 + 4x = 22. Combine: 7x − 6 = 22. Then add 6 and divide by 7.'))
q.append(Q(8, 'target', 'A-REI.3', 'Solve the inequality', MI + '3x + 4 ≥ 13', 'x ≤ ' + MI + '3', ['ineq', 'x', '<=', -3],
           S.numline(-6, 2, 'Number line from −6 to 2 for graphing the answer', title='Graph your answer here'),
           'Answer:', 'Subtract 4: −3x ≥ 9. Dividing by a negative FLIPS the sign: x ≤ −3.', 'type like x<=5'))
q.append(Q(9, 'target', 'A-CED.4', 'Literal equation', 'The perimeter of a rectangle is P = 2l + 2w. Solve for <i>l</i>.',
           'l = ' + fr('P ' + MI + ' 2w', '2') + '  (or l = ' + fr('P', '2') + ' ' + MI + ' w)', ['expr', '(p-2*w)/2', ['p', 'w']],
           S.rect_fig('l = ?', 'w', 'perimeter P', 'Rectangle with width w, length unknown, perimeter P', wq=True),
           'l =', 'Undo + 2w (subtract 2w from both sides), then divide both sides by 2.', 'type like (P-2w)/2'))
q.append(Q(10, 'target', 'A-REI.1', 'Justify the step', '2(x + 3) = 14  →  2x + 6 = 14<br><span style="font-size:16px">Which property makes this step true?</span>',
           'the distributive property', ['words', [['distributive', 'distribute', 'distributing', 'distribution']], ['commutative', 'associative', 'identity']],
           S.area_model([('x', 2), ('3', 1.2)], [('2', 1.2)], [['2x', '6']], 'Area model: 2 times (x + 3) splits into 2x and 6'),
           'Answer:', 'Multiplying 2 by each term inside the ( ) is the distributive property.'))
q.append(Q(11, 'target', 'A-CED.1', 'Write and solve', 'A gym charges $20 to join plus $15 each month. Kai paid $95 in all. How many months did he pay for?',
           '5 months', ['n', 5],
           S.tape([(3, '$20', 'g'), (2, '$15', 'g'), (2, '$15', 'g'), (1.3, '…', 'n'), (2, '$15', 'g')], '$95 in all',
                  'Bar model: $20 plus some $15 months makes $95', top_label='? months of $15'),
           'months =', 'Write 15m + 20 = 95. Subtract 20 (75), then divide by 15.'))
q.append(Q(12, 'target', 'N-RN.2', 'Simplify', '(2x' + sup(3) + ')' + sup(2), '4x' + sup(6), ['expr', '4*x^6', ['x'], {'form': 'mono'}],
           S.tape([(3, '2x^3', 'g'), (3, '2x^3', 'g')], '(2x^3)^2 = two factors of 2x^3', 'Two factors of 2x cubed'),
           'Answer:', 'Square every factor: 2² = 4 and (x³)² = x⁶ (multiply the exponents).', 'type like 3x^4'))
# advanced
q.append(Q(13, 'advanced', 'A-REI.3', 'Solve', fr('x', '2') + ' + 3 = ' + fr('x', '3') + ' + 5', 'x = 12', ['n', 12],
           S.balance('½x + 3', '⅓x + 5', 'Balance: one half x plus 3 on the left, one third x plus 5 on the right'),
           'x =', 'Multiply every term by 6 to clear fractions: 3x + 18 = 2x + 30. Then x = 12.'))
q.append(Q(14, 'advanced', 'A-SSE.1', 'Interpret', 'A model is P = 200(0.9)' + sup('t') + '. By what <b>percent</b> does P go down each year?',
           '10%', ['n', 10],
           S.seq_bars([200, 180, 162], 'Bars for P at t = 0, 1, 2: 200, 180, 162', n_labels=['t = 0', '1', '2'], W=220),
           'percent =', '0.9 means 90% is left each year, so it goes down 100% − 90% = 10%.'))
q.append(Q(15, 'advanced', 'A-CED.4', 'Literal equation', 'Solve y = mx + b for x.',
           'x = ' + fr('y ' + MI + ' b', 'm'), ['expr', '(y-b)/m', ['y', 'b', 'm']],
           S.chain(['?', '?', 'y'], ['× m', '+ b'], 'Flow chart: start with x, multiply by m, add b, end at y', W=230),
           'x =', 'Undo in reverse order: subtract b, then divide by m.', 'type like (y-b)/m'))
q.append(Q(16, 'advanced', 'A-CED.1', 'Write and solve', 'Concert tickets cost $8 each plus one $4 fee. Mia has $60. What is the <b>greatest</b> number of tickets she can buy?',
           '7 tickets', ['n', 7],
           S.tape([(2.2, '$4 fee', 'g'), (2, '$8', 'g'), (2, '$8', 'g'), (1.3, '…', 'n'), (2, '$8', 'g')], 'at most $60',
                  'Bar model: $4 fee plus some $8 tickets, at most $60', top_label='? tickets at $8'),
           'tickets =', '8t + 4 ≤ 60 → 8t ≤ 56 → t ≤ 7.'))
q.append(Q(17, 'advanced', 'N-RN.2', 'Negative exponents', 'Simplify ' + nw('(2x' + sup(3) + ')' + sup(MI + '2')) + '. Write your answer with <b>positive</b> exponents only.',
           fr('1', '4x' + sup(6)), ['expr', '1/(4*x^6)', ['x'], {'need': '^(?!.*\\^\\(?-)(?!.*\\)\\^)'}],
           S.card([('frac', 'a^−n = ', '1', 'a^n', '')], 'Reminder card: a to the negative n equals 1 over a to the n', W=200),
           'Answer:', 'A negative exponent means “one over”: (2x³)⁻² = 1 ÷ (2x³)². Then square every factor: 2² = 4 and (x³)² = x⁶.', 'type like 1/(3x^4)'))
q.append(Q(18, 'advanced', 'A-REI.3', 'How many solutions?', '4(x + 1) ' + MI + ' x = 3x + 4', 'infinitely many solutions', INF,
           S.balance('4(x + 1) − x', '3x + 4', 'Balance: 4(x + 1) − x on the left, 3x + 4 on the right'),
           'Answer:', 'Simplify the left side: 4x + 4 − x = 3x + 4. Both sides match, so every x works.', 'how many?'))
CFGS.append(unit_cfg(1, 'Equations, Inequalities & Reasoning', 'Equations, Inequalities &amp; Reasoning', [
    band('basic', ['A-SSE.1', 'A-REI.3', 'N-RN.2'], 'Read expressions, solve one- and two-step equations, and use simple exponent rules.',
         'I can name parts of an expression, solve simple equations and inequalities, and use exponent rules.',
         'Answer each question. Use the picture to help you.',
         typing_box([('x = 4', '4'), ('negative', '-7'), ('power', 'x^5'), ('inequality', 'x>2 or x<=-3')])),
    band('target', ['A-REI.1', 'A-REI.3', 'A-CED.1', 'A-CED.4', 'N-RN.2'], 'Solve multi-step equations and inequalities, justify steps, and rearrange formulas.',
         'I can solve multi-step equations and inequalities, explain each step, write equations from words, and solve a formula for one letter.',
         'Solve each problem. Show your work on paper.'),
    band('advanced', ['A-SSE.1', 'A-REI.3', 'A-CED.1', 'A-CED.4', 'N-RN.2'], 'Solve harder equations, interpret models, and use negative exponents.',
         'I can clear fractions, find special solutions, interpret parts of a model, and rewrite negative exponents as positive ones.',
         'Solve each problem. Some answers are words.'),
], q, 'Standards assessed: NC.M1.A-SSE.1 · A-CED.1 · A-CED.4 · A-REI.1 · A-REI.3 · N-RN.2'))

# ======================================================================= UNIT 2
q = []
q.append(Q(1, 'basic', 'F-IF.1', 'Function?', 'Is this relation a function? Write yes or no.', 'no (input 2 has two outputs)', NO,
           S.mapping([1, 2, 3], [4, 5, 6, 7], [(1, 4), (2, 5), (2, 7), (3, 6)], 'Mapping: 1 to 4, 2 to 5, 2 to 7, 3 to 6'),
           'Answer:', 'In a function each input has exactly ONE output. Look at input 2.'))
q.append(Q(2, 'basic', 'F-IF.2', 'Evaluate', 'f(x) = 3x ' + MI + ' 2. Find f(4).', '10', ['n', 10],
           S.machine('4', '3x − 2', '?', 'Function machine: input 4, rule 3x − 2, output unknown'),
           'f(4) =', 'Replace x with 4: 3(4) − 2 = 12 − 2.'))
p = S.Plane(-3, 4, -3, 7, W=220); p.line(2, 1); p.pt(-1, -1); p.pt(1, 3); p.label(1.5, 0.9, 'y = 2x + 1', 0, 0, S.NAVY, 11)
q.append(Q(3, 'basic', 'F-IF.4', 'Key feature', 'Use the graph. What is the <b>y-intercept</b>?', '1  (the point (0, 1))', ['any', ['n', 1], ['pt', 0, 1]],
           p.render('Graph of the line y = 2x + 1'), 'Answer:', 'The y-intercept is where the line crosses the y-axis (where x = 0).'))
q.append(Q(4, 'basic', 'F-IF.6', 'Rate of change', 'Use the table. What is the rate of change (slope)?', MI + '2', ['n', -2],
           S.table([['x', '0', '1', '2', '3'], ['y', '7', '5', '3', '1']], 'Table: x 0, 1, 2, 3 and y 7, 5, 3, 1'),
           'Answer:', 'Each time x goes up 1, y goes DOWN 2. Rate = change in y ÷ change in x.'))
p = S.Plane(-2, 6, -2, 5, W=230); p.line(0.5, 1); p.label(3.2, 1.2, 'y = f(x)', 0, 0, S.NAVY, 11)
q.append(Q(5, 'basic', 'F-IF.2', 'Read the graph', 'The graph shows y = f(x). Find f(4).', '3', ['n', 3],
           p.render('Graph of a line y = f(x)'), 'f(4) =', 'Go to x = 4, then up to the line. Read the y-value.'))
p = S.Plane(-3, 4, -4, 5, W=220); p.pt(0, -2); p.seg(0, -2, 1, -2, S.GOLD, 2, '4 3'); p.seg(1, -2, 1, 1, S.GOLD, 2, '4 3')
p.label(0.5, -2, 'run 1', 0, 14, S.GOLDT, 10.5, 'middle'); p.label(1, -0.5, 'rise 3', 5, 4, S.GOLDT, 10.5)
q.append(Q(6, 'basic', 'A-CED.2', 'Write the equation', 'Write the equation of the line with slope 3 and y-intercept ' + MI + '2.', 'y = 3x ' + MI + ' 2',
           ['expr', '3*x-2', ['x']], p.render('Point (0, −2) with a slope step: run 1, rise 3'),
           'y =', 'Use y = mx + b. Here m = 3 and b = −2.', 'type like 4x+1'))
# target
p = S.Plane(-4, 5, -2, 7, W=220); p.seg(-3, -1, 4, 6); p.pt(-3, -1); p.pt(4, 6)
q.append(Q(7, 'target', 'F-IF.5', 'Domain', 'The graph has a closed dot at each end. What is the <b>domain</b>?', MI + '3 ≤ x ≤ 4',
           ['ineq2', 'x', -3, True, 4, True], p.render('Line segment from (−3, −1) to (4, 6) with closed dots'),
           'Answer:', 'Domain = the x-values, from the left end to the right end.', 'type like -1<=x<=5'))
p = S.Plane(-5, 3, -3, 4, W=220); p.seg(-4, 2, 2, -1); p.pt(-4, 2); p.pt(2, -1, hollow=True)
q.append(Q(8, 'target', 'F-IF.5', 'Range', 'Closed dot on the left, open dot on the right. What is the <b>range</b>?', MI + '1 &lt; y ≤ 2',
           ['ineq2', 'y', -1, False, 2, True], p.render('Segment from closed dot (−4, 2) to open dot (2, −1)'),
           'Answer:', 'Range = the y-values, bottom to top. An open dot means that value is NOT included (use &lt;).', 'type like -3<y<=1'))
q.append(Q(9, 'target', 'F-IF.6', 'Average rate of change', 'A car has gone 110 miles after 2 hours and 290 miles after 5 hours. Find the average rate of change in miles per hour.',
           '60 miles per hour', ['n', 60],
           S.scatter([(2, 110), (5, 290)], (0, 6), (0, 300), 'Points (2, 110) and (5, 290) on a time-distance graph', xlab='hours', ylab='miles',
                     xstep=1, ystep=50, W=240, H=190),
           'rate =', '(290 − 110) ÷ (5 − 2) = 180 ÷ 3.'))
q.append(Q(10, 'target', 'F-IF.7', 'Intercepts', 'Find the <b>x-intercept</b> of 2x + 3y = 12.', '(6, 0)', ['any', ['n', 6], ['pt', 6, 0]],
           S.table([['x', '0', '?'], ['y', '?', '0']], 'Table: when x is 0, y is unknown; when y is 0, x is unknown', colw=46),
           'Answer:', 'At the x-intercept y = 0: 2x + 0 = 12, so x = 6.'))
q.append(Q(11, 'target', 'F-LE.5', 'Interpret', 'A taxi ride costs C = 2.5m + 40 dollars for m miles. What does the ride cost for <b>each mile</b>?',
           '$2.50 per mile', ['n', 2.5],
           S.table([['m', '0', '10', '20'], ['C', '40', '65', '90']], 'Table: m 0, 10, 20 and C 40, 65, 90'),
           'dollars =', 'The number multiplied by m is the rate: the cost for each mile.'))
p = S.Plane(-1, 5, -1, 11, W=200, maxH=250, lab=1, ylab_every=2); p.pt(1, 5); p.pt(3, 9); p.label(1, 5, '(1, 5)', 8, 4, S.NAVY, 11); p.label(3, 9, '(3, 9)', 8, 4, S.NAVY, 11)
q.append(Q(12, 'target', 'A-CED.2', 'Write the equation', 'Write the equation of the line through (1, 5) and (3, 9).', 'y = 2x + 3',
           ['expr', '2*x+3', ['x']], p.render('Points (1, 5) and (3, 9)'), 'y =', 'Slope = (9 − 5) ÷ (3 − 1) = 2. Then 5 = 2(1) + b gives b = 3.', 'type like 4x+1'))
# advanced
p = S.Plane(0, 30, 0, 700, W=250, H=190, square=False, step=5, ystep=100, lab=10, ylab_every=200, xlab='t (minutes)', ylab='V (gallons)', padL=40, padB=34, rot_ylab=True)
p.pt(0, 600); p.label(0, 600, 'start: 600', 7, 4, S.NAVY, 11)
q.append(Q(13, 'advanced', 'A-CED.2', 'Write a function', 'A pool holds 600 gallons. It drains 25 gallons each minute. Write V(t), the gallons left after t minutes.',
           'V(t) = 600 ' + MI + ' 25t', ['expr', '600-25*t', ['t']], p.render('Graph axes for V and t with the starting point (0, 600)'),
           'V(t) =', 'Start at 600 and take away 25 for each minute: 600 − 25t.', 'type like 100-5t'))
q.append(Q(14, 'advanced', 'F-IF.5', 'Domain in context', 'For the pool, V(t) = 600 ' + MI + ' 25t. What is a reasonable <b>domain</b>? (Time starts at 0 and stops when the pool is empty.)',
           '0 ≤ t ≤ 24', ['ineq2', 't', 0, True, 24, True],
           S.tape([(2, '25', 'g'), (2, '25', 'g'), (2, '25', 'g'), (1.3, '…', 'n'), (2, '25', 'g')], '600 gallons',
                  'Bar model: 600 gallons in blocks of 25', top_label='one block drains each minute'),
           'Answer:', 'Empty when 600 − 25t = 0, so t = 24. Time runs from 0 to 24.', 'type like 0<=t<=10'))
q.append(Q(15, 'advanced', 'F-IF.2', 'Use function notation', 'f(x) = 2x ' + MI + ' 7. Find x when f(x) = 9.', 'x = 8', ['n', 8],
           S.machine('?', '2x − 7', '9', 'Function machine: input unknown, rule 2x − 7, output 9'),
           'x =', 'Set 2x − 7 = 9. Add 7 (16), then divide by 2.'))
p = S.Plane(-1, 5, -3, 7, W=200, maxH=230); p.line(-2, 6); p.label(2.6, 5, 'y = f(x)', 0, 0, S.NAVY, 11)
q.append(Q(16, 'advanced', 'F-IF.4', 'Positive or negative', 'Use the graph of f. For which x-values is f(x) &gt; 0?', 'x &lt; 3',
           ['ineq', 'x', '<', 3], p.render('Graph of a decreasing line y = f(x)'),
           'Answer:', 'f(x) &gt; 0 means the line is ABOVE the x-axis. That happens left of the x-intercept, x = 3.', 'type like x>1'))
p = S.Plane(-3, 3, -4, 9, W=200, maxH=240); p.line(3, 2); p.label(0.5, -2.5, 'y = 3x + 2', 0, 0, S.NAVY, 11)
q.append(Q(17, 'advanced', 'F-LE.5', 'Change a parameter', 'f(x) = 3x + 2 is graphed. The 2 is changed to 7. Does the graph move <b>up or down</b>, and by how many units?',
           'up 5 units', ['words', [['up', 'upward', 'upwards', 'higher', 'raised', 'rises'], ['5', 'five']], ['down', 'downward', 'downwards', 'lower', 'left', 'right']],
           p.render('Graph of y = 3x + 2'), 'Answer:', 'Changing b moves the y-intercept: from 2 to 7 is up 5. The slope stays the same.', 'like: down 2'))
q.append(Q(18, 'advanced', 'F-IF.6', 'Average rate of change', 'Find the average rate of change from x = 2 to x = 6.', '2.75  (' + fr('11', '4') + ')', ['n', 2.75],
           S.table([['x', '0', '2', '4', '6'], ['y', '3', '4', '8', '15']], 'Table: x 0, 2, 4, 6 and y 3, 4, 8, 15', hl_cols=(2, 4)),
           'Answer:', '(15 − 4) ÷ (6 − 2) = 11 ÷ 4.'))
CFGS.append(unit_cfg(2, 'Functions & Linear Functions', 'Functions &amp; Linear Functions', [
    band('basic', ['F-IF.1', 'F-IF.2', 'F-IF.4', 'F-IF.6', 'A-CED.2'], 'Recognize functions, use f(x) notation, and read lines.',
         'I can tell if a relation is a function, evaluate f(x), read the slope and y-intercept, and write y = mx + b.',
         'Answer each question. Use the picture to help you.',
         typing_box([('number', '-2'), ('point', '(0, 1)'), ('equation', 'y=3x-2'), ('interval', '-3<=x<=4')])),
    band('target', ['F-IF.5', 'F-IF.6', 'F-IF.7', 'F-LE.5', 'A-CED.2'], 'Find domain, range, intercepts, and rates of change; write linear equations.',
         'I can find domain and range, intercepts, and average rate of change, and write the equation of a line.',
         'Solve each problem. Show your work on paper.'),
    band('advanced', ['F-IF.2', 'F-IF.4', 'F-IF.5', 'F-IF.6', 'A-CED.2', 'F-LE.5'], 'Model with linear functions and explain what the numbers mean.',
         'I can write a function for a situation, give a sensible domain, and explain how changing a number changes the graph.',
         'Solve each problem. Some answers are words.'),
], q, 'Standards assessed: NC.M1.F-IF.1 · F-IF.2 · F-IF.4 · F-IF.5 · F-IF.6 · F-IF.7 · A-CED.2 · F-LE.5'))

# ======================================================================= UNIT 3
q = []
p = S.Plane(-2, 4, -4, 6, W=200, maxH=230); p.line(2, -1); p.label(1.2, -2.8, 'y = 2x − 1', 0, 0, S.NAVY, 11)
q.append(Q(1, 'basic', 'A-REI.10', 'Solution?', 'Is the point (2, 3) a solution of y = 2x ' + MI + ' 1? Write yes or no.', 'yes', YES,
           p.render('Graph of the line y = 2x − 1'), 'Answer:', 'Substitute: 2(2) − 1 = 3. The point makes the equation true, so it is on the line.'))
p = S.Plane(-2, 4, -2, 6, W=200, maxH=220); p.line(1, 2); p.line(-2, 5, S.BLUE2); p.label(-1.9, 3.6, 'y = x + 2', 0, 0, S.NAVY, 11); p.label(-1.9, -1.3, 'y = −2x + 5', 0, 0, S.BLUE2, 11)
q.append(Q(2, 'basic', 'A-REI.6', 'Solve by graphing', 'Use the graph. What is the solution of the system?', '(1, 3)', ['pt', 1, 3],
           p.render('Two lines: y = x + 2 and y = −2x + 5'), 'Answer:', 'The solution is the point where the two lines cross. Read x, then y.', 'type like (2, 5)'))
q.append(Q(3, 'basic', 'A-REI.6', 'Substitution', 'Solve the system.<br>y = 2x<br>x + y = 12', '(4, 8)', ['pt', 4, 8],
           S.tape([(3, 'x', 'q'), (6, 'y = 2x', 'q')], '12 in all', 'Bar model: x plus y equals 12, where y is two x'),
           'Answer:', 'Replace y with 2x: x + 2x = 12, so 3x = 12 and x = 4. Then y = 2(4).', 'type like (2, 5)'))
p = S.Plane(-4, 3, -3, 5, W=200, maxH=220); p.line(1, 2, S.NAVY, 2.2, '6 4'); p.pt(0, 0); p.label(0, 0, '(0, 0)', 7, -7, S.NAVY, 11); p.label(-3.9, 3.5, 'y = x + 2', 0, 0, S.NAVY, 11)
q.append(Q(4, 'basic', 'A-REI.12', 'Inequality', 'Is (0, 0) a solution of y &gt; x + 2? Write yes or no.', 'no', NO,
           p.render('Dashed line y = x + 2 and the point (0, 0)'), 'Answer:', 'Test it: is 0 &gt; 0 + 2? 0 &gt; 2 is false.'))
q.append(Q(5, 'basic', 'A-REI.6', 'Elimination', 'Solve the system.<br>x + y = 7<br>x ' + MI + ' y = 1', '(4, 3)', ['pt', 4, 3],
           S.eq_stack(['x + y = 7', 'x − y = 1'], 'Add the two equations; the sum is unknown'),
           'Answer:', 'Add the equations: 2x = 8, so x = 4. Then 4 + y = 7.', 'type like (2, 5)'))
p = S.Plane(-1, 5, -1, 10, W=190, maxH=240, ylab_every=2); p.line(2, 1); p.vline(3, S.GOLD, 1.8, '5 4'); p.label(3.1, 0.6, 'x = 3', 0, 0, S.GOLDT, 11)
p.label(-0.8, 6, 'y = 2x + 1', 0, 0, S.NAVY, 11)
q.append(Q(6, 'basic', 'A-REI.10', 'Point on a line', 'The point (3, k) is on the line y = 2x + 1. Find k.', 'k = 7', ['n', 7],
           p.render('Line y = 2x + 1 with a dashed line at x = 3'), 'k =', 'Every point on the line makes the equation true: k = 2(3) + 1.'))
# target
q.append(Q(7, 'target', 'A-REI.6', 'Elimination', 'Solve the system.<br>2x + 3y = 12<br>x ' + MI + ' 3y = ' + MI + '3', '(3, 2)', ['pt', 3, 2],
           S.eq_stack(['2x + 3y = 12', 'x − 3y = −3'], 'Add the two equations; the sum is unknown'),
           'Answer:', 'Adding cancels y: 3x = 9, so x = 3. Then 3 − 3y = −3 gives y = 2.', 'type like (2, 5)'))
q.append(Q(8, 'target', 'A-REI.6', 'Substitution', 'Solve the system.<br>y = 3x ' + MI + ' 5<br>2x + y = 10', '(3, 4)', ['pt', 3, 4],
           S.term_cards(['2x', '+', 'y', '= 10'], 'In 2x + y = 10, replace y using y = 3x − 5', qidx=(2,), notes={2: 'y = 3x − 5'}),
           'Answer:', '2x + (3x − 5) = 10 → 5x = 15 → x = 3. Then y = 3(3) − 5.', 'type like (2, 5)'))
q.append(Q(9, 'target', 'A-REI.6', 'How many solutions?', 'How many solutions does this system have?<br>y = 2x + 3<br>y = 2x ' + MI + ' 1',
           'no solution (parallel lines)', NOSOL,
           S.table([['line', 'slope', 'y-int'], ['A', '?', '?'], ['B', '?', '?']], 'Table to compare the slope and y-intercept of each line', colw=56, first_w=50),
           'Answer:', 'Same slope (2) but different y-intercepts: the lines are parallel and never meet.', 'how many?'))
q.append(Q(10, 'target', 'A-CED.3', 'Write a system', 'Adult tickets cost $8. Student tickets cost $5. 20 tickets sold for $130 in all. How many <b>adult</b> tickets were sold?',
           '10 adult tickets', ['n', 10],
           S.table([['', 'adult', 'student', 'total'], ['tickets', 'a', 's', '20'], ['dollars', '8a', '5s', '130']], 'Table: a + s = 20 tickets, 8a + 5s = 130 dollars', colw=56, first_w=62),
           'adult =', 'a + s = 20 and 8a + 5s = 130. Substitute s = 20 − a: 8a + 100 − 5a = 130, so 3a = 30.'))
p = S.Plane(-2, 6, -2, 6, W=210, maxH=220); p.shade(-1, 4, False); p.line(-1, 4); p.label(1.4, 5.3, 'y = −x + 4', 0, 0, S.NAVY, 11)
q.append(Q(11, 'target', 'A-REI.12', 'Read the graph', 'Write the inequality shown by the graph. (The line is solid. The shading is below.)', 'y ≤ ' + MI + 'x + 4',
           ['lineineq', '<=', -1, 4], p.render('Solid line y = −x + 4 with shading below'),
           'Answer:', 'Solid line → ≤ or ≥. Shaded below → y ≤.', 'type like y>=2x-1'))
q.append(Q(12, 'target', 'A-REI.5', 'Elimination step', 'x + 2y = 7<br>3x ' + MI + ' y = 7<br>Multiply the second equation by 2, then add the equations. What new equation do you get?',
           '7x = 21', ['eqn', ['7x=21', '21=7x', '7x+0y=21']],
           S.eq_stack(['x + 2y = 7', '3x − y = 7'], 'Multiply the second equation by 2, then add', notes=[None, '× 2']),
           'Answer:', '2(3x − y = 7) gives 6x − 2y = 14. Add x + 2y = 7: the y-terms cancel, 7x = 21.', 'type like 5x=10'))
# advanced
q.append(Q(13, 'advanced', 'A-REI.6', 'How many solutions?', 'How many solutions does this system have?<br>2x ' + MI + ' y = 3<br>4x ' + MI + ' 2y = 6',
           'infinitely many solutions (same line)', INF,
           S.table([['line', 'slope', 'y-int'], ['A', '?', '?'], ['B', '?', '?']], 'Table to compare the slope and y-intercept of each line', colw=56, first_w=50),
           'Answer:', 'Solve each for y: both are y = 2x − 3. Same line, so every point on it works.', 'how many?'))
p = S.Plane(-2, 5, -4, 6, W=210, maxH=240); p.line(1, -3, S.NAVY, 2.2, '6 4'); p.line(-2, 4, S.BLUE2, 2.4); p.pt(2, 1); p.label(2, 1, '(2, 1)', 6, 16, S.NAVY, 11)
p.label(3.4, 2.4, 'y > x − 3', 0, 0, S.NAVY, 10.5); p.label(0.1, 5.5, 'y ≤ −2x + 4', 0, 0, S.BLUE2, 10.5)
q.append(Q(14, 'advanced', 'A-REI.12', 'System of inequalities', 'Is (2, 1) a solution of the system?<br>y &gt; x ' + MI + ' 3<br>y ≤ ' + MI + '2x + 4', 'no',
           NO, p.render('Boundary lines y = x − 3 (dashed) and y = −2x + 4 (solid) with the point (2, 1)'),
           'Answer:', 'It must make BOTH true. 1 &gt; −1 is true, but 1 ≤ 0 is false.'))
q.append(Q(15, 'advanced', 'A-CED.3', 'Constraint', 'Shirts cost $12. Hats cost $8. Ana can spend <b>at most</b> $96. She buys 5 shirts. What is the greatest number of hats she can buy?',
           '4 hats', ['n', 4],
           S.tape([(5, '5 shirts × $12', 'g'), (4, '? hats × $8', 'q')], 'at most $96', 'Bar model: 5 shirts at $12 plus some hats at $8, at most $96'),
           'hats =', '12(5) + 8h ≤ 96 → 8h ≤ 36 → h ≤ 4.5. She can only buy whole hats.'))
q.append(Q(16, 'advanced', 'A-REI.6', 'Elimination', 'Solve the system.<br>3x + 2y = 16<br>2x ' + MI + ' 3y = ' + MI + '11', '(2, 5)', ['pt', 2, 5],
           S.eq_stack(['3x + 2y = 16', '2x − 3y = −11'], 'Multiply each equation by a number, then add', notes=['?', '?']),
           'Answer:', 'Multiply the first by 3 and the second by 2: 9x + 6y = 48 and 4x − 6y = −22. Add: 13x = 26.', 'type like (2, 5)'))
q.append(Q(17, 'advanced', 'A-REI.11', 'f(x) = g(x)', 'f(x) = 2x + 1 and g(x) = ' + MI + 'x + 7. For what value of x is f(x) = g(x)?', 'x = 2', ['n', 2],
           S.table([['x', '0', '1', '2', '3'], ['f(x)', '1', '3', '?', '?'], ['g(x)', '7', '6', '?', '?']], 'Table of f and g for x = 0 to 3 with some values unknown', colw=40, first_w=50),
           'x =', 'Set 2x + 1 = −x + 7. Then 3x = 6. (Or fill in the table and look for equal outputs.)'))
q.append(Q(18, 'advanced', 'A-CED.3', 'Write a system', 'Two numbers add to 30. Their difference is 8. What is the <b>larger</b> number?', '19', ['n', 19],
           S.tape([(3, 'small', 'q'), (3, 'small', 'q'), (1.8, '8', 'g')], '30 in all', 'Bar model: the larger number is the smaller plus 8', top_label='larger = small + 8'),
           'Answer:', 'L + S = 30 and L − S = 8. Add: 2L = 38.'))
CFGS.append(unit_cfg(3, 'Linear Systems', 'Systems of Equations &amp; Inequalities', [
    band('basic', ['A-REI.6', 'A-REI.10', 'A-REI.12'], 'Check solutions and solve simple systems.',
         'I can tell if a point is a solution, read a solution from a graph, and solve simple systems.',
         'Answer each question. Use the picture to help you.',
         typing_box([('point', '(2, 5)'), ('number', '-3'), ('yes / no', 'yes'), ('inequality', 'y<=-x+4')])),
    band('target', ['A-REI.5', 'A-REI.6', 'A-REI.12', 'A-CED.3'], 'Solve systems by substitution and elimination and write systems from words.',
         'I can solve systems with substitution or elimination, tell how many solutions there are, and write a system for a situation.',
         'Solve each problem. Show your work on paper.'),
    band('advanced', ['A-REI.6', 'A-REI.11', 'A-REI.12', 'A-CED.3'], 'Solve harder systems and use constraints.',
         'I can solve any linear system, test systems of inequalities, and use constraints in real situations.',
         'Solve each problem. Some answers are words.'),
], q, 'Standards assessed: NC.M1.A-CED.3 · A-REI.5 · A-REI.6 · A-REI.10 · A-REI.11 · A-REI.12'))

# ======================================================================= UNIT 4
q = []
q.append(Q(1, 'basic', 'F-BF.2', 'Next term', 'What is the next term?  5, 8, 11, 14, …', '17', ['n', 17],
           S.seq_bars([5, 8, 11, 14, '?'], 'Bars for the sequence 5, 8, 11, 14 and an unknown 5th term'),
           'Answer:', 'Each term adds 3.'))
q.append(Q(2, 'basic', 'F-BF.2', 'Common difference', 'What is the common difference <i>d</i>?  20, 16, 12, 8, …', MI + '4', ['n', -4],
           S.chain(['20', '16', '12', '8'], ['?', '?', '?'], 'Sequence 20, 16, 12, 8 with unknown jumps'),
           'd =', 'd = next term − term before: 16 − 20 = −4. The terms go down, so d is negative.'))
q.append(Q(3, 'basic', 'F-BF.2', 'Next term', 'What is the next term?  3, 6, 12, 24, …', '48', ['n', 48],
           S.seq_bars([3, 6, 12, 24, '?'], 'Bars for the sequence 3, 6, 12, 24 and an unknown 5th term'),
           'Answer:', 'Each term is multiplied by 2.'))
q.append(Q(4, 'basic', 'F-BF.2', 'Common ratio', 'What is the common ratio <i>r</i>?  81, 27, 9, 3, …', fr('1', '3'), ['n', 1 / 3, 0.004],
           S.chain(['81', '27', '9', '3'], ['?', '?', '?'], 'Sequence 81, 27, 9, 3 with unknown multipliers'),
           'r =', 'r = next term ÷ term before: 27 ÷ 81 = 1/3.', 'type like 1/2'))
q.append(Q(5, 'basic', 'F-LE.1', 'Linear or exponential?', 'Is this table linear or exponential?', 'exponential (×3 each time)',
           ['words', [['exponential', 'exp', 'expo', 'exponetial', 'exponental', 'exponentially']], ['linear', 'lin', 'liner']],
           S.table([['x', '0', '1', '2', '3'], ['y', '2', '6', '18', '54']], 'Table: x 0, 1, 2, 3 and y 2, 6, 18, 54'),
           'Answer:', 'Linear adds the same amount each step. Here y is multiplied by 3 each step.'))
q.append(Q(6, 'basic', 'F-IF.7', 'Evaluate', 'f(x) = 3 · 2' + sup('x') + '. Find f(3).', '24', ['n', 24],
           S.table([['x', '0', '1', '2', '3'], ['f(x)', '3', '?', '?', '?']], 'Table of f(x) = 3 times 2 to the x for x = 0 to 3', first_w=50),
           'f(3) =', '2³ = 8 first (exponent before multiplying), then 3 · 8.'))
# target
q.append(Q(7, 'target', 'F-BF.2', 'Explicit formula', 'An arithmetic sequence has a' + sub('1') + ' = 5 and d = 3. Find a' + sub('20') + '.', '62', ['n', 62],
           S.seq_bars([5, 8, 11, 14, '?'], 'Bars for terms 1 to 4 and an unknown 20th term', n_labels=['n = 1', '2', '3', '4', '20']),
           'a₂₀ =', 'a<sub>n</sub> = a<sub>1</sub> + (n − 1)d = 5 + 19(3).'))
q.append(Q(8, 'target', 'F-IF.3', 'Recursive rule', 'a' + sub('1') + ' = 10 and a' + sub('n') + ' = a' + sub('n−1') + ' ' + MI + ' 4. Find a' + sub('4') + '.', MI + '2', ['n', -2],
           S.chain(['10', '?', '?', '?'], ['− 4', '− 4', '− 4'], 'Recursive chain: 10, then subtract 4 three times'),
           'a₄ =', '10 → 6 → 2 → −2. Subtract 4 each step.'))
q.append(Q(9, 'target', 'F-BF.2', 'Geometric term', 'A geometric sequence has a' + sub('1') + ' = 3 and r = 2. Find a' + sub('7') + '.', '192', ['n', 192],
           S.seq_bars([3, 6, 12, '?'], 'Bars for terms 1 to 3 and an unknown 7th term', n_labels=['n = 1', '2', '3', '7'], W=220),
           'a₇ =', 'a<sub>n</sub> = a<sub>1</sub> · r<sup>n − 1</sup> = 3 · 2⁶ = 3 · 64.'))
q.append(Q(10, 'target', 'F-BF.1a', 'Write a model', '200 bacteria double every hour. Write P(t), the number after t hours.', 'P(t) = 200(2)' + sup('t'),
           ['expr', '200*2^t', ['t']],
           S.table([['t (hours)', '0', '1', '2'], ['P', '200', '400', '800']], 'Table: t 0, 1, 2 and P 200, 400, 800', first_w=70, colw=46),
           'P(t) =', 'Start value × (growth factor)<sup>t</sup>. Doubling means the factor is 2.', 'type like 50(3)^t'))
q.append(Q(11, 'target', 'F-IF.8b', 'Growth or decay', 'y = 400(0.85)' + sup('t') + '. By what <b>percent</b> does y decrease each year?', '15%', ['n', 15],
           S.seq_bars([400, 340, 289], 'Bars for y at t = 0, 1, 2: 400, 340, 289', n_labels=['t = 0', '1', '2'], W=210),
           'percent =', '0.85 = 85% is kept each year, so 100% − 85% = 15% is lost.'))
p = S.Plane(0, 5, 0, 60, W=230, H=200, square=False, step=1, ystep=10, lab=1, ylab_every=10, padL=30)
p.line(10, 0); p.curve(lambda x: 2 ** x, 0, 5, S.BLUE2); p.label(3.6, 36, 'f(x) = 10x', -4, -2, S.NAVY, 11, 'end'); p.label(4.6, 24, 'g(x) = 2^x', 4, 8, S.BLUE2, 11, 'end')
q.append(Q(12, 'target', 'F-LE.3', 'Compare growth', 'f(x) = 10x and g(x) = 2' + sup('x') + ' are graphed for 0 ≤ x ≤ 5. Which is greater when x = 10: f or g?', 'g (1024 &gt; 100)',
           ['words', [['g', 'exponential', '2^x', '2x']], ['f', 'linear', '10x']], p.render('Graphs of f(x) = 10x and g(x) = 2 to the x from 0 to 5'),
           'Answer:', 'f(10) = 100 but g(10) = 2¹⁰ = 1024. Exponential growth passes linear growth.'))
# advanced
p = S.Plane(0, 5, 0, 24, W=200, H=200, square=False, step=1, ystep=2, lab=1, ylab_every=4, xlab='n', ylab='a_n', padL=30)
for i, v in enumerate([7, 11, 15, 19]): p.pt(i + 1, v)
q.append(Q(13, 'advanced', 'F-IF.3', 'Explicit formula', 'Write an explicit formula for a' + sub('n') + ':  7, 11, 15, 19, …', 'a' + sub('n') + ' = 4n + 3  (or 7 + 4(n ' + MI + ' 1))',
           ['expr', '4*n+3', ['n']], p.render('Points (1, 7), (2, 11), (3, 15), (4, 19)'),
           'aₙ =', 'a<sub>n</sub> = 7 + 4(n − 1). This simplifies to 4n + 3.', 'type like 2n+5'))
q.append(Q(14, 'advanced', 'F-BF.2', 'Explicit formula', 'Write an explicit formula for a' + sub('n') + ':  2, 6, 18, 54, …', 'a' + sub('n') + ' = 2(3)' + sup('n − 1'),
           ['expr', '2*3^(n-1)', ['n']], S.seq_bars([2, 6, 18, 54], 'Bars for the sequence 2, 6, 18, 54'),
           'aₙ =', 'Geometric: a<sub>n</sub> = a<sub>1</sub> · r<sup>n − 1</sup> with a<sub>1</sub> = 2 and r = 3.', 'like 5(2)^(n-1)'))
q.append(Q(15, 'advanced', 'F-BF.1a', 'Write a model', 'A car is worth $20,000. It loses 12% of its value each year. Write V(t), its value after t years.',
           'V(t) = 20000(0.88)' + sup('t'), ['expr', '20000*0.88^t', ['t']],
           S.chain(['$20,000', '?', '?'], ['− 12%', '− 12%'], 'Value chain: $20,000 then lose 12% each year', W=240, boxw=62),
           'V(t) =', 'Losing 12% leaves 88% = 0.88 each year: V(t) = 20000(0.88)<sup>t</sup>.', 'like 500(0.9)^t'))
q.append(Q(16, 'advanced', 'F-LE.5', 'Interpret', 'P(t) = 1500(1.04)' + sup('t') + ' models a town’s population. What is the yearly growth rate as a percent?', '4%', ['n', 4],
           S.term_cards(['1500', '(1.04)^t'], 'Parts of the model: 1500 and 1.04 to the t', qidx=(1,), notes={1: 'growth rate = ?'}),
           'percent =', '1.04 = 1 + 0.04, so the population grows 4% each year.'))
q.append(Q(17, 'advanced', 'F-LE.1', 'Linear or exponential?', 'A plant is 12 cm tall. It grows 1.5 cm each week. Is its height linear or exponential?', 'linear (adds 1.5 each week)',
           ['words', [['linear', 'lin', 'liner', 'linearly']], ['exponential', 'exp', 'expo', 'exponentially']],
           S.seq_bars([12, 13.5, 15, 16.5], 'Bars for height at weeks 0 to 3: 12, 13.5, 15, 16.5', n_labels=['week 0', '1', '2', '3']),
           'Answer:', 'It ADDS the same amount each week. Equal differences → linear.'))
p = S.Plane(-4, 3, 0, 28, W=220, H=210, square=False, step=1, ystep=2, lab=1, ylab_every=4, padL=30)
for x in range(0, 4): p.pt(x, 3 * 2 ** x)
p.label(-3.9, 20, 'f(x) = 3(2)^x', 0, 0, S.NAVY, 11)
q.append(Q(18, 'advanced', 'F-IF.7', 'End behavior', 'f(x) = 3(2)' + sup('x') + '. As x gets very negative (x → ' + MI + '∞), f(x) gets close to what number?', '0', ['n', 0, 1e-9],
           p.render('Points of f(x) = 3 times 2 to the x for x = 0, 1, 2, 3'),
           'Answer:', 'Go left: 3, 1.5, 0.75, 0.375, … The values halve each step and get closer to 0.'))
CFGS.append(unit_cfg(4, 'Sequences & Exponential Functions', 'Sequences &amp; Exponential Functions', [
    band('basic', ['F-BF.2', 'F-LE.1', 'F-IF.7'], 'Find patterns in arithmetic and geometric sequences.',
         'I can find the next term, the common difference, and the common ratio, and tell linear from exponential.',
         'Answer each question. Use the picture to help you.',
         typing_box([('number', '-4'), ('fraction', '1/3'), ('power', '2^t'), ('model', '200(2)^t')])),
    band('target', ['F-IF.3', 'F-IF.8b', 'F-BF.1a', 'F-BF.2', 'F-LE.3'], 'Use sequence formulas and build exponential models.',
         'I can use explicit and recursive rules, write growth models, find percent change, and compare linear and exponential growth.',
         'Solve each problem. Show your work on paper.'),
    band('advanced', ['F-IF.3', 'F-IF.7', 'F-BF.1a', 'F-BF.2', 'F-LE.1', 'F-LE.5'], 'Write formulas and interpret exponential models.',
         'I can write explicit formulas, model growth and decay, explain the numbers in a model, and describe end behavior.',
         'Solve each problem. Some answers are words.'),
], q, 'Standards assessed: NC.M1.F-IF.3 · F-IF.7 · F-IF.8b · F-BF.1a · F-BF.2 · F-LE.1 · F-LE.3 · F-LE.5'))
