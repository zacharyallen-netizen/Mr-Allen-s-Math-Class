#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""NC Math 1 pre-tests, Units 5–8 (configs)."""
from m1common import *
import m1svg as S

CFGS = []

# data sets used by Unit 5 (also re-read by verify_keys.py)
U5 = dict(
    mean=[4, 7, 9, 10, 15], median=[3, 8, 5, 12, 9, 6], rng=[12, 18, 7, 25, 14],
    hist_bins=['60–69', '70–79', '80–89', '90–99'], hist_counts=[3, 6, 8, 4],
    box5=(2, 5, 8, 11, 15), iqr=[2, 4, 5, 7, 8, 10, 12, 15], box8=(12, 20, 24, 30, 48), skew=[10, 13, 16, 19, 52],
    assoc=[(1, 62), (2, 66), (2.5, 70), (3, 68), (4, 78), (5, 76), (5.5, 86), (6, 82), (7, 90)],
    pred=[(1, 44), (2, 44), (3, 48), (4, 49), (5, 53), (6, 54), (7, 58), (9, 61), (10, 66)],
    resid=[(1, 67), (2, 71), (3, 79), (5, 89), (6, 97)],
    neg=[(1, 45), (2, 42), (3, 35), (4, 40), (5, 28), (6, 32), (7, 22), (8, 19), (9, 23), (10, 12)],
    plant=[(1, 19), (2, 21), (3, 24), (4, 28), (5, 30), (6, 35), (7, 37), (8, 40)],
    battery=[(2, 88), (4, 83), (6, 82), (8, 77), (10, 76), (12, 71), (14, 70), (16, 66)],
    ice=[(2, 3), (3, 5), (4, 4), (5, 8), (6, 7), (7, 11), (8, 10), (9, 14), (10, 13)],
    boxA=(10, 20, 25, 30, 40), boxB=(12, 18, 26, 36, 38),
    sdA=[8, 9, 9, 10, 10, 10, 11, 11, 12], sdB=[4, 6, 7, 10, 10, 10, 13, 14, 16],
    strong=[(1, 20), (2, 28), (3, 25), (4, 36), (5, 33), (6, 45), (7, 40), (8, 52)],
)

# ======================================================================= UNIT 5
d = U5; q = []
q.append(Q(1, 'basic', 'S-ID.2', 'Mean', 'Find the mean of 4, 7, 9, 10, 15.', '9', ['n', 9],
           S.dotplot(d['mean'], 2, 16, 'Dot plot of 4, 7, 9, 10, 15', lab_every=2), 'mean =', 'Add all values (45) and divide by how many (5).'))
q.append(Q(2, 'basic', 'S-ID.2', 'Median', 'Find the median of 3, 8, 5, 12, 9, 6.', '7', ['n', 7],
           S.dotplot(d['median'], 2, 13, 'Dot plot of 3, 5, 6, 8, 9, 12'), 'median =', 'In order: 3, 5, 6, 8, 9, 12. Two middle values 6 and 8 → halfway is 7.'))
q.append(Q(3, 'basic', 'S-ID.2', 'Range', 'Find the range of 12, 18, 7, 25, 14.', '18', ['n', 18],
           S.dotplot(d['rng'], 5, 26, 'Dot plot of 7, 12, 14, 18, 25', lab_every=5), 'range =', 'Range = max − min = 25 − 7.'))
q.append(Q(4, 'basic', 'S-ID.1', 'Histogram', 'The histogram shows test scores. How many students are in the data set?', '21 students', ['n', 21],
           S.histogram(d['hist_bins'], d['hist_counts'], 'Histogram of scores: 3, 6, 8 and 4 students', xlab='test score', ymax=9, step=1),
           'students =', 'Add the heights of all the bars: 3 + 6 + 8 + 4.'))
q.append(Q(5, 'basic', 'S-ID.1', 'Box plot', 'Use the box plot. What is Q3 (the upper quartile)?', '11', ['n', 11],
           S.boxplots([d['box5']], 0, 16, 'Box plot on a scale from 0 to 16', step=1, lab_every=2), 'Q3 =',
           'Q3 is the RIGHT edge of the box.'))
q.append(Q(6, 'basic', 'S-ID.6', 'Association', 'Describe the association: positive, negative, or none?', 'positive',
           ['words', [['positive', 'pos', 'positively']], ['negative', 'neg', 'negatively', 'none', 'no association', 'no correlation', 'no relationship']],
           S.scatter(d['assoc'], (0, 8), (50, 100), 'Scatter plot of hours studied and test score', xlab='hours studied', ylab='test score', ystep=10),
           'Answer:', 'As x goes up, y tends to go up too. That is a positive association.'))
# target
q.append(Q(7, 'target', 'S-ID.2', 'IQR', 'Find the interquartile range (IQR) of 2, 4, 5, 7, 8, 10, 12, 15.', '6.5', ['n', 6.5],
           S.dotplot(d['iqr'], 0, 16, 'Dot plot of 2, 4, 5, 7, 8, 10, 12, 15', lab_every=2), 'IQR =',
           'Lower half 2, 4, 5, 7 → Q1 = 4.5. Upper half 8, 10, 12, 15 → Q3 = 11. IQR = Q3 − Q1.'))
q.append(Q(8, 'target', 'S-ID.3', 'Outlier?', 'Use the 1.5 × IQR rule. Is 48 an outlier? Write yes or no.', 'yes (upper fence = 30 + 15 = 45)', YES,
           S.boxplots([d['box8']], 10, 50, 'Box plot: min 12, Q1 20, median 24, Q3 30, max 48', step=5, lab_every=10, show_vals=True),
           'Answer:', 'IQR = 30 − 20 = 10. Upper fence = Q3 + 1.5(10) = 45. Is 48 past 45?'))
q.append(Q(9, 'target', 'S-ID.3', 'Best center', 'Data: 10, 13, 16, 19, 52. Which describes the center better: the mean or the median?', 'the median (52 is an outlier)',
           ['words', [['median']], ['mean', 'average']],
           S.dotplot(d['skew'], 5, 55, 'Dot plot of 10, 13, 16, 19, 52', step=5, lab_every=10), 'Answer:',
           'The outlier 52 pulls the mean up to 22. The median (16) is not pulled.'))
q.append(Q(10, 'target', 'S-ID.6', 'Predict', 'The trend line is ŷ = 2.5x + 40. Use the equation to predict y when x = 11.', '67.5', ['n', 67.5],
           S.scatter(d['pred'], (0, 12), (30, 80), 'Scatter plot with a trend line', line=(2.5, 40), ystep=10, xlab_every=2,
                     eq='ŷ = 2.5x + 40'), 'ŷ =', 'Substitute x = 11: 2.5(11) + 40 = 27.5 + 40.'))
q.append(Q(11, 'target', 'S-ID.6', 'Residual', 'The trend line is ŷ = 6x + 60. A student studied 4 hours and scored 82. Find the residual.', MI + '2', ['n', -2],
           S.scatter(d['resid'], (0, 7), (50, 110), 'Scatter plot with trend line; the point (4, 82) and its miss from the line', line=(6, 60), ystep=10,
                     resid=(4, 82), xlab='hours', ylab='score', eq='ŷ = 6x + 60'), 'residual =',
           'Residual = actual − predicted. Predicted = 6(4) + 60 = 84. So 82 − 84.'))
q.append(Q(12, 'target', 'S-ID.8', 'Correlation', 'Which value of r fits this scatter plot best?  ' + MI + '0.95,  ' + MI + '0.3,  0.3,  0.95', MI + '0.95', ['n', -0.95, 1e-9],
           S.scatter(d['neg'], (0, 11), (0, 50), 'Scatter plot with a strong downward pattern', ystep=10),
           'r =', 'The points fall from left to right (negative) and stay close to a line (strong).'))
# advanced
q.append(Q(13, 'advanced', 'S-ID.7', 'Interpret slope', 'ŷ = 3.2x + 15 predicts plant height (cm) after x weeks. Use the slope: how many cm does the model say the plant grows from week 2 to week 6?', '12.8 cm', ['n', 12.8],
           S.scatter(d['plant'], (0, 9), (0, 45), 'Scatter plot of plant height by week with a trend line', line=(3.2, 15), ystep=5, ylab_every=10,
                     xlab='weeks', ylab='height (cm)', eq='ŷ = 3.2x + 15'), 'cm =', 'The slope 3.2 is the growth for EACH week. Week 2 to week 6 is 4 weeks: 4 × 3.2.'))
q.append(Q(14, 'advanced', 'S-ID.7', 'Interpret intercepts', 'ŷ = ' + MI + '1.5x + 90 predicts phone battery (%) after x hours. The 90 means the battery starts at 90%. Use the model: after how many hours is the battery at 0%?', '60 hours', ['n', 60],
           S.scatter(d['battery'], (0, 18), (50, 100), 'Scatter plot of battery percent by hour with a trend line', line=(-1.5, 90), xstep=2, ystep=10,
                     xlab='hours', ylab='battery (%)'), 'hours =', 'Set ŷ = 0: −1.5x + 90 = 0, so 1.5x = 90 and x = 90 ÷ 1.5. (The graph stops at 18 hours, so use the equation.)'))
q.append(Q(15, 'advanced', 'S-ID.9', 'Causation?', 'Ice cream sales and sunburns have a strong positive correlation. Does eating ice cream <b>cause</b> sunburns? Write yes or no.',
           'no (hot, sunny weather drives both)', ['words', [['no', 'not', 'nope']], ['yes', 'yeah', 'yep']],
           S.scatter(d['ice'], (0, 11), (0, 16), 'Scatter plot of ice cream sales and sunburns', xstep=1, ystep=2, ylab_every=4,
                     xlab='ice cream sales', ylab='sunburns'), 'Answer:',
           'Correlation is not causation. A lurking variable — hot, sunny weather — pushes both up.'))
q.append(Q(16, 'advanced', 'S-ID.2', 'Compare spread', 'Which class has the greater spread, using the IQR: A or B?', 'B (IQR 18 vs. 10)',
           ['text', ['b', 'class b', 'b class', 'plot b', 'box plot b', 'b has more', 'b)']],
           S.boxplots([d['boxA'], d['boxB']], 5, 45, 'Two box plots on one scale: class A and class B', step=5, lab_every=10, names=['A', 'B']),
           'Answer:', 'IQR = width of the box. A: 30 − 20 = 10. B: 36 − 18 = 18.'))
q.append(Q(17, 'advanced', 'S-ID.2', 'Standard deviation', 'Both data sets have a mean of 10. Which has the greater standard deviation: A or B?', 'B (the data are farther from the mean)',
           ['text', ['b', 'set b', 'data set b', 'b)', 'plot b']],
           S.dotplot(d['sdA'], 2, 18, 'Dot plot A', lab_every=2, title='A') + '<br>' + S.dotplot(d['sdB'], 2, 18, 'Dot plot B', lab_every=2, title='B'),
           'Answer:', 'Standard deviation = typical distance from the mean. B’s dots are spread farther from 10.'))
q.append(Q(18, 'advanced', 'S-ID.8', 'Correlation strength', 'Set A is graphed. Its r = 0.93. Set B has r = ' + MI + '0.97. Which set has the <b>stronger</b> linear association: A or B?', 'B (|−0.97| is closer to 1)',
           ['text', ['b', 'set b', 'data set b', 'b)', 'b is stronger', 'set b is stronger']],
           S.scatter(d['strong'], (0, 9), (10, 60), 'Scatter plot of set A', ystep=10), 'Answer:',
           'Strength depends on how close r is to 1 OR −1. The sign only gives the direction. |−0.97| = 0.97 is closer to 1 than 0.93.'))
CFGS.append(unit_cfg(5, 'Statistics', 'Statistics: Center, Spread &amp; Regression', [
    band('basic', ['S-ID.1', 'S-ID.2', 'S-ID.6'], 'Read data displays and find center and spread.',
         'I can read dot plots, histograms, box plots, and scatter plots, and find the mean, median, and range.',
         'Answer each question. Use the picture to help you.',
         typing_box([('number', '6.5'), ('negative', '-2'), ('word', 'median'), ('letter', 'B')])),
    band('target', ['S-ID.2', 'S-ID.3', 'S-ID.6', 'S-ID.8'], 'Use IQR and outliers, predict with a trend line, and read residuals and r.',
         'I can find the IQR, test for outliers, predict with a trend line, find a residual, and match r to a scatter plot.',
         'Solve each problem. Show your work on paper.'),
    band('advanced', ['S-ID.2', 'S-ID.7', 'S-ID.8', 'S-ID.9'], 'Interpret models and compare data sets.',
         'I can use slope and intercepts in context, compare spread, compare correlation strength, and tell correlation from causation.',
         'Solve each problem. Some answers are words.'),
], q, 'Standards assessed: NC.M1.S-ID.1 · S-ID.2 · S-ID.3 · S-ID.6 · S-ID.7 · S-ID.8 · S-ID.9'))

# ======================================================================= UNIT 6
FX = lambda key, form='expand', **o: ['expr', key, ['x'], dict({'form': form}, **o)]
q = []
q.append(Q(1, 'basic', 'A-APR.1', 'Distribute', 'Multiply: 3(x + 4)', '3x + 12', FX('3*x+12'),
           S.area_model([('x', 2), ('+4', 1.2)], [('3', 1.2)], [['?', '?']], 'Area model: 3 times (x + 4), both parts unknown'),
           'Answer:', 'Multiply 3 by EACH term inside: 3 · x and 3 · 4.', 'type like 2x+8'))
q.append(Q(2, 'basic', 'A-APR.1', 'Add polynomials', '(2x' + sup(2) + ' + 3x ' + MI + ' 1) + (x' + sup(2) + ' ' + MI + ' 5x + 4)', '3x' + sup(2) + ' ' + MI + ' 2x + 3',
           FX('3*x^2-2*x+3'),
           S.tiles([('x2', 2), ('x', 3), ('1', -1), ('op', '+'), ('x2', 1), ('x', -5), ('1', 4)], 'Algebra tiles for both polynomials; red tiles are negative'),
           'Answer:', 'Combine like terms: x² terms 2 + 1, x terms 3 − 5, numbers −1 + 4.', 'type like x^2+4x-1'))
q.append(Q(3, 'basic', 'A-SSE.3', 'Factor (GCF)', 'Factor out the greatest common factor: ' + nw('6x + 15'), '3(2x + 5)',
           ['expr', '3*(2*x+5)', ['x'], {'form': 'fact', 'need': '(^3\\*?\\(|\\)\\*?3$)'}],
           S.area_model([('?', 2), ('?', 1.2)], [('?', 1.2)], [['6x', '15']], 'Area model: parts 6x and 15; the common side and the other sides are unknown'),
           'Answer:', 'The biggest number that divides 6 and 15 is 3. Then 6x ÷ 3 = 2x and 15 ÷ 3 = 5.', 'type like 2(x+4)'))
q.append(Q(4, 'basic', 'A-REI.4', 'Square roots', 'Solve: x' + sup(2) + ' = 49', 'x = 7 or x = ' + MI + '7  (±7)', ['set', [7, -7]],
           S.square_area('x^2 = 49', '?', 'Square with area 49; side unknown'),
           'x =', 'Two numbers square to 49: 7 and −7. Give both.', 'type like 3, -3'))
q.append(Q(5, 'basic', 'A-APR.3', 'Zero product', 'Solve: (x ' + MI + ' 3)(x + 5) = 0', 'x = 3 or x = ' + MI + '5', ['set', [3, -5]],
           S.term_cards(['(x − 3)', '(x + 5)'], 'Each factor can be zero', qidx=(0, 1), notes={0: '= 0 → x = ?', 1: '= 0 → x = ?'}),
           'x =', 'Set each factor equal to 0: x − 3 = 0 and x + 5 = 0.', 'type like 2, -4'))
q.append(Q(6, 'basic', 'A-APR.1', 'Multiply', '(x + 3)(x + 2)', 'x' + sup(2) + ' + 5x + 6', FX('x^2+5*x+6'),
           S.area_model([('x', 1.6), ('+3', 1.2)], [('x', 1.6), ('+2', 1)], [['?', '?'], ['?', '?']], 'Area model for (x + 3)(x + 2) with four unknown parts'),
           'Answer:', 'Fill the 4 boxes: x², 3x, 2x, 6. Then combine 3x + 2x.', 'type like x^2+4x+3'))
# target
q.append(Q(7, 'target', 'A-SSE.3', 'Factor', 'Factor: x' + sup(2) + ' + 7x + 12', '(x + 3)(x + 4)', ['expr', '(x+3)*(x+4)', ['x'], {'form': 'fact'}],
           S.xpuzzle('12', '7', 'Puzzle: two numbers that multiply to 12 and add to 7'),
           'Answer:', 'Find two numbers that multiply to 12 and add to 7: 3 and 4.', 'type like (x+1)(x+5)'))
q.append(Q(8, 'target', 'A-SSE.3', 'Factor', 'Factor: x' + sup(2) + ' ' + MI + ' 3x ' + MI + ' 18', '(x ' + MI + ' 6)(x + 3)', ['expr', '(x-6)*(x+3)', ['x'], {'form': 'fact'}],
           S.xpuzzle('−18', '−3', 'Puzzle: two numbers that multiply to −18 and add to −3'),
           'Answer:', 'Multiply to −18 and add to −3: −6 and 3.', 'type like (x+1)(x-5)'))
q.append(Q(9, 'target', 'A-SSE.3', 'Difference of squares', 'Factor: x' + sup(2) + ' ' + MI + ' 49', '(x + 7)(x ' + MI + ' 7)', ['expr', '(x+7)*(x-7)', ['x'], {'form': 'fact'}],
           S.diff_squares('x^2 − 49', '7^2', 'A big square x by x with a 7 by 7 square cut from the corner'),
           'Answer:', 'a² − b² = (a + b)(a − b). Here a = x and b = 7.', 'type like (x+2)(x-2)'))
q.append(Q(10, 'target', 'A-REI.4', 'Solve by factoring', 'Solve: x' + sup(2) + ' ' + MI + ' 5x + 6 = 0', 'x = 2 or x = 3', ['set', [2, 3]],
           S.xpuzzle('6', '−5', 'Puzzle: two numbers that multiply to 6 and add to −5'),
           'x =', '(x − 2)(x − 3) = 0, so x − 2 = 0 or x − 3 = 0.', 'type like 1, 4'))
q.append(Q(11, 'target', 'A-APR.3', 'Zeros', 'Find the zeros of ' + nw('f(x) = (x + 1)(x ' + MI + ' 4)') + '.', 'x = ' + MI + '1 and x = 4', ['set', [-1, 4]],
           S.sketch_parabola('Sketch of the parabola crossing the x-axis at two unknown points', fn=lambda x: (x + 1) * (x - 4), xr=(-3, 6), yr=(-7.5, 4.5), roots=(-1, 4)),
           'x =', 'A zero makes a factor equal 0: x + 1 = 0 → x = −1, and x − 4 = 0 → x = 4.', 'type like 2, -6'))
q.append(Q(12, 'target', 'A-APR.1', 'Multiply', '(2x + 1)(x ' + MI + ' 3)', '2x' + sup(2) + ' ' + MI + ' 5x ' + MI + ' 3', FX('2*x^2-5*x-3'),
           S.area_model([('x', 1.6), ('−3', 1.2)], [('2x', 1.6), ('+1', 1)], [['?', '?'], ['?', '?']], 'Area model for (2x + 1)(x − 3) with four unknown parts'),
           'Answer:', 'Boxes: 2x², −6x, x, −3. Combine −6x + x = −5x.', 'type like 3x^2+x-2'))
# advanced
q.append(Q(13, 'advanced', 'A-SSE.3', 'Factor (a ≠ 1)', 'Factor: 2x' + sup(2) + ' + 5x ' + MI + ' 3', '(2x ' + MI + ' 1)(x + 3)', ['expr', '(2*x-1)*(x+3)', ['x'], {'form': 'fact'}],
           S.area_model([('?', 1.6), ('?', 1.2)], [('?', 1.6), ('?', 1)], [['2x^2', '?'], ['?', '−3']], 'Area model: corner parts 2x squared and −3, all sides unknown'),
           'Answer:', 'Try factors of 2x² and −3 until the inside + outside terms make 5x: (2x − 1)(x + 3).', 'like (2x+1)(x-4)'))
q.append(Q(14, 'advanced', 'A-REI.4', 'Square roots', 'Solve: ' + nw('x' + sup(2) + ' + 6x + 9 = 25') + '. (Hint: the left side is a perfect square.)', 'x = 2 or x = ' + MI + '8', ['set', [2, -8]],
           S.complete_square(3, 'x squared plus two 3x strips and a corner square make x² + 6x + 9; the corner is unknown'),
           'x =', 'x² + 6x + 9 = (x + 3)². Take square roots of (x + 3)² = 25: x + 3 = 5 or x + 3 = −5. (Or factor x² + 6x − 16 = 0.)', 'type like 1, -7'))
q.append(Q(15, 'advanced', 'A-REI.4', 'Solve by factoring', 'Solve by factoring: ' + nw('2x' + sup(2) + ' ' + MI + ' 7x + 3 = 0') + '.',
           'x = ' + fr('1', '2') + ' or x = 3', ['set', [0.5, 3]],
           S.xpuzzle('6', '−7', 'Puzzle: a times c is 6; two numbers that multiply to 6 and add to −7'),
           'x =', 'Factor: (2x − 1)(x − 3) = 0. Then 2x − 1 = 0 gives x = ½, and x − 3 = 0 gives x = 3.', 'type like 1/3, 5'))
q.append(Q(16, 'advanced', 'F-IF.8a', 'Use the factors', nw('y = x' + sup(2) + ' ' + MI + ' 6x + 5') + ' = ' + nw('(x ' + MI + ' 1)(x ' + MI + ' 5)') + '. Use the factors to find the <b>minimum value</b> of y.', MI + '4  (at x = 3)', ['n', -4],
           S.sketch_parabola('Sketch of an upward parabola with two unknown zeros and an unknown minimum', fn=lambda x: (x - 1) * (x - 5), xr=(-1.5, 6.5), yr=(-5.5, 6), roots=(1, 5), vertex_lbl='min = ?'),
           'min =', 'The zeros are 1 and 5. The vertex is halfway between them, at x = 3. Then y = (3 − 1)(3 − 5) = 2 · (−2).'))
p = S.Plane(-4, 7, -3, 3, W=260); p.pt(-2, 0); p.pt(5, 0); p.label(-2, 0, '(−2, 0)', 0, -10, S.NAVY, 11, 'middle'); p.label(5, 0, '(5, 0)', 0, -10, S.NAVY, 11, 'middle')
q.append(Q(17, 'advanced', 'A-APR.3', 'Build from zeros', 'A quadratic has zeros x = ' + MI + '2 and x = 5, and a = 1. Write it in standard form.', 'x' + sup(2) + ' ' + MI + ' 3x ' + MI + ' 10',
           FX('x^2-3*x-10'), p.render('The zeros (−2, 0) and (5, 0) on a grid'),
           'y =', 'Zeros −2 and 5 give factors (x + 2)(x − 5). Multiply them out.', 'type like x^2+x-6'))
q.append(Q(18, 'advanced', 'F-IF.8a', 'Factored form', 'A ball’s height is ' + nw('h(t) = ' + MI + '16t' + sup(2) + ' + 32t') + ' = ' + nw(MI + '16t(t ' + MI + ' 2)') + '. After how many seconds does it land ' + nw('(t &gt; 0)') + '?', '2 seconds', ['n', 2],
           S.arc_sketch('Sketch of the ball’s path from the ground back to the ground at an unknown time', q_at='end'),
           't =', 'It lands when h(t) = 0: −16t = 0 or t − 2 = 0. Use t &gt; 0.'))
CFGS.append(unit_cfg(6, 'Quadratic Expressions & Equations', 'Quadratic Expressions &amp; Equations', [
    band('basic', ['A-APR.1', 'A-APR.3', 'A-SSE.3', 'A-REI.4'], 'Multiply and add polynomials, factor out a GCF, and solve simple quadratics.',
         'I can multiply and add polynomials, factor out a common factor, and solve with square roots or zero products.',
         'Answer each question. Use the picture to help you.',
         typing_box([('power', 'x^2+5x+6'), ('factored', '(x+3)(x+4)'), ('two answers', '3, -5'), ('fraction', '1/2')])),
    band('target', ['A-APR.1', 'A-APR.3', 'A-SSE.3', 'A-REI.4'], 'Factor trinomials and differences of squares, and solve by factoring.',
         'I can factor x² + bx + c and a² − b², multiply binomials, and use factors to find zeros.',
         'Solve each problem. Show your work on paper.'),
    band('advanced', ['A-APR.3', 'A-SSE.3', 'A-REI.4', 'F-IF.8a'], 'Factor with a ≠ 1, solve harder quadratics by factoring and square roots, and use factors to find key features.',
         'I can factor harder trinomials, solve by factoring or by taking square roots, and use factors to find zeros and the minimum.',
         'Solve each problem. Give every solution.'),
], q, 'Standards assessed: NC.M1.A-APR.1 · A-APR.3 · A-SSE.3 · A-REI.4 · F-IF.8a'))

# ======================================================================= UNIT 7
q = []
q.append(Q(1, 'basic', 'F-IF.7', 'Direction', 'Does y = ' + MI + '2x' + sup(2) + ' + 3 open up or down?', 'down (a = −2 is negative)',
           ['words', [['down', 'downward', 'downwards']], ['up', 'upward', 'upwards']],
           S.term_cards(['−2x^2', '+3'], 'The terms of −2x squared plus 3', qidx=(0,), notes={0: 'a = ?'}),
           'Answer:', 'Look at a, the number in front of x². If a is negative, the parabola opens down.'))
p = S.Plane(-1, 5, -2, 6, W=240); p.curve(lambda x: -(x - 2) ** 2 + 5, -1, 5)
q.append(Q(2, 'basic', 'F-IF.4', 'Vertex', 'What is the vertex of the parabola?', '(2, 5)', ['pt', 2, 5], p.render('Graph of a parabola that opens down'),
           'Answer:', 'The vertex is the turning point: the very top (or bottom) of the parabola.', 'type like (1, 4)'))
p = S.Plane(-5, 3, -5, 4, W=240); p.curve(lambda x: x * x + 2 * x - 3, -5, 3)
q.append(Q(3, 'basic', 'F-IF.4', 'Axis of symmetry', 'What is the axis of symmetry of the parabola?', 'x = ' + MI + '1', ['n', -1],
           p.render('Graph of a parabola that opens up'), 'x =', 'The axis of symmetry is the vertical line through the vertex. It is halfway between the zeros.'))
q.append(Q(4, 'basic', 'F-IF.7', 'y-intercept', 'Find the y-intercept of f(x) = x' + sup(2) + ' ' + MI + ' 6x + 5.', '5  (the point (0, 5))', ['any', ['n', 5], ['pt', 0, 5]],
           S.machine('0', 'x^2 − 6x + 5', '?', 'Function machine: input 0, rule x squared minus 6x plus 5'),
           'Answer:', 'The y-intercept is f(0). Every x-term becomes 0, so only the constant is left.'))
q.append(Q(5, 'basic', 'F-IF.7', 'Table of values', 'f(x) = x' + sup(2) + ' + 2x ' + MI + ' 1. Find f(3).', '14', ['n', 14],
           S.table([['x', '1', '2', '3'], ['f(x)', '2', '7', '?']], 'Table: f(1) = 2, f(2) = 7, f(3) unknown', first_w=50),
           'f(3) =', '3² + 2(3) − 1 = 9 + 6 − 1. Square first.'))
p = S.Plane(-2, 4, -3, 5, W=240); p.curve(lambda x: (x - 1) ** 2 - 2, -2, 4)
q.append(Q(6, 'basic', 'F-IF.4', 'Max or min?', 'Is the vertex of this parabola a maximum or a minimum?', 'minimum',
           ['words', [['minimum', 'min', 'minimun', 'minium']], ['maximum', 'max', 'maximun']], p.render('Graph of a parabola that opens up'),
           'Answer:', 'It opens up, so the vertex is the lowest point: a minimum.'))
# target
q.append(Q(7, 'target', 'F-IF.7', 'Find the vertex', 'Find the vertex of y = x' + sup(2) + ' ' + MI + ' 6x + 8.', '(3, ' + MI + '1)', ['pt', 3, -1],
           S.card(['a = 1,  b = −6,  c = 8', ('frac', 'x = ', '−b', '2a', ' = ?')], 'Vertex formula card: x equals negative b over 2a, with a = 1 and b = −6', W=230),
           'Answer:', 'x = −(−6) ÷ 2(1) = 3. Then y = 9 − 18 + 8 = −1.', 'type like (2, -4)'))
p = S.Plane(-2, 6, -1, 7, W=240); p.curve(lambda x: x * x, -2.7, 2.7, S.MUTED, 2, dash='5 4'); p.label(3.2, 1.2, 'y = x^2 (parent)', 0, 0, S.MUTED, 11)
q.append(Q(8, 'target', 'F-IF.7', 'Vertex form', 'y = (x ' + MI + ' 4)' + sup(2) + ' + 1 is the parent graph y = x' + sup(2) + ' moved. What is its vertex?', '(4, 1)', ['pt', 4, 1],
           p.render('Dashed parent graph y = x squared'), 'Answer:', 'In y = (x − h)² + k the vertex is (h, k). Watch the sign: x − 4 means h = 4.', 'type like (2, -4)'))
q.append(Q(9, 'target', 'F-IF.4', 'Range', 'What is the range of ' + nw('y = ' + MI + '(x ' + MI + ' 1)' + sup(2) + ' + 6') + '?', 'y ≤ 6', ['ineq', 'y', '<=', 6],
           S.sketch_parabola('Sketch of a parabola that opens down with an unknown maximum', fn=lambda x: -(x - 1) ** 2 + 6, xr=(-3, 5), yr=(-3.5, 8), vertex_lbl='max = ?'),
           'Answer:', 'It opens down (a = −1), so 6 is the highest y-value. Every y-value is 6 or less.', 'type like y>=-2'))
p = S.Plane(-4, 2, -1, 7, W=240); p.curve(lambda x: (x + 1) ** 2 + 1, -4, 2, S.BLUE2); p.label(-3.8, 2, 'g(x)', 0, 0, S.BLUE2, 11.5)
q.append(Q(10, 'target', 'F-IF.9', 'Compare', 'f(x) = x' + sup(2) + ' ' + MI + ' 4x + 7. The function g is graphed. Which function has the smaller minimum value: f or g?', 'g (min 1 &lt; 3)',
           ['words', [['g']], ['f']], p.render('Graph of g, a parabola that opens up'),
           'Answer:', 'f has vertex x = 2 and f(2) = 3. g’s lowest point is at y = 1.'))
p = S.Plane(-1, 5, -4, 2, W=240); p.pt(2, -3); p.label(2, -3, 'vertex (2, −3)', 8, 4, S.NAVY, 11)
q.append(Q(11, 'target', 'A-CED.2', 'Write the equation', 'Write the equation of the parabola with vertex (2, ' + MI + '3) and a = 1. Use vertex form.', 'y = (x ' + MI + ' 2)' + sup(2) + ' ' + MI + ' 3',
           ['expr', '(x-2)^2-3', ['x'], {'form': 'paren'}], p.render('Vertex point (2, −3) on a grid'),
           'y =', 'Vertex form is y = a(x − h)² + k with (h, k) = (2, −3).', 'like (x-1)^2+4'))
q.append(Q(12, 'target', 'F-BF.1b', 'Add functions', nw('f(x) = x' + sup(2) + ' ' + MI + ' 3') + ' and ' + nw('g(x) = 2x + 1') + '. Write ' + nw('(f + g)(x)') + '.', 'x' + sup(2) + ' + 2x ' + MI + ' 2',
           ['expr', 'x^2+2*x-2', ['x'], {'form': 'expand'}],
           S.table([['x', '0', '1', '2'], ['f(x)', '−3', '−2', '1'], ['g(x)', '1', '3', '5'], ['(f + g)(x)', '?', '?', '?']], 'Table of f, g, and f + g for x = 0, 1, 2', first_w=80),
           '(f + g)(x) =', 'Add the two rules and combine like terms: x² − 3 + 2x + 1.', 'like x^2+3x+1'))
# advanced
q.append(Q(13, 'advanced', 'A-CED.1', 'Area equation', 'A rectangle’s length is 3 more than its width. Its area is 40. Find the width.', '5', ['n', 5],
           S.rect_fig('w + 3', 'w = ?', 'Area = 40', 'Rectangle with width w, length w + 3 and area 40', hq=True),
           'w =', 'w(w + 3) = 40 → w² + 3w − 40 = 0 → (w + 8)(w − 5) = 0. A width cannot be negative.'))
q.append(Q(14, 'advanced', 'F-IF.4', 'Maximum', 'h(t) = ' + MI + '16t' + sup(2) + ' + 64t + 5 is a ball’s height in feet. What is its <b>maximum</b> height?', '69 feet', ['n', 69],
           S.arc_sketch('Sketch of the ball’s path starting at 5 ft with an unknown maximum', start_lbl='5 ft', q_at='top'),
           'feet =', 'Vertex t = −64 ÷ (2 · −16) = 2. Then h(2) = −64 + 128 + 5.'))
q.append(Q(15, 'advanced', 'F-BF.1b', 'Multiply functions', 'L(x) = x + 5 and W(x) = x ' + MI + ' 2 are a rectangle’s length and width. Write A(x) = L(x) · W(x) in standard form.', 'x' + sup(2) + ' + 3x ' + MI + ' 10',
           ['expr', 'x^2+3*x-10', ['x'], {'form': 'expand'}],
           S.area_model([('x', 1.6), ('+5', 1.2)], [('x', 1.6), ('−2', 1)], [['?', '?'], ['?', '?']], 'Area model for (x + 5)(x − 2) with four unknown parts'),
           'A(x) =', 'Boxes: x², 5x, −2x, −10. Combine 5x − 2x.', 'like x^2+2x-8'))
q.append(Q(16, 'advanced', 'F-IF.9', 'Compare', 'f(x) = ' + MI + 'x' + sup(2) + ' + 4x. The table shows g. Which has the greater maximum: f or g?', 'g (max 5 &gt; 4)',
           ['words', [['g']], ['f']],
           S.table([['x', '0', '1', '2', '3', '4'], ['g(x)', '1', '4', '5', '4', '1']], 'Table of g: x 0 to 4 and g 1, 4, 5, 4, 1', first_w=50),
           'Answer:', 'f’s vertex: x = −4 ÷ (2 · −1) = 2, f(2) = 4. The table shows g reaches 5.'))
p = S.Plane(-1, 7, -9, 3, W=240, maxH=330); p.pt(1, 0); p.pt(5, 0); p.pt(3, -8)
p.label(1, 0, '(1, 0)', 0, -10, S.NAVY, 11, 'middle'); p.label(5, 0, '(5, 0)', 0, -10, S.NAVY, 11, 'middle'); p.label(3, -8, '(3, −8)', 8, 4, S.NAVY, 11)
q.append(Q(17, 'advanced', 'A-CED.2', 'Write the equation', 'A parabola has zeros 1 and 5 and passes through (3, ' + MI + '8). Write its equation in standard form.', 'y = 2x' + sup(2) + ' ' + MI + ' 12x + 10',
           ['expr', '2*x^2-12*x+10', ['x'], {'form': 'expand'}], p.render('Points (1, 0), (5, 0) and (3, −8)'),
           'y =', 'y = a(x − 1)(x − 5). Put in (3, −8): a(2)(−2) = −8, so a = 2. Then multiply out.', 'like 3x^2-6x+1'))
p = S.Plane(-3, 5, -10, 3, W=240, maxH=340, ylab_every=2); p.curve(lambda x: x * x - 2 * x - 8, -3, 5)
q.append(Q(18, 'advanced', 'F-IF.4', 'Decreasing', 'y = x' + sup(2) + ' ' + MI + ' 2x ' + MI + ' 8. For which x-values is the function <b>decreasing</b>?', 'x &lt; 1',
           ['ineq', 'x', '<', 1, True], p.render('Graph of y = x squared minus 2x minus 8'),
           'Answer:', 'Read left to right. The graph goes down until the vertex at x = 1.', 'type like x>3'))
CFGS.append(unit_cfg(7, 'Quadratic Functions', 'Quadratic Functions', [
    band('basic', ['F-IF.4', 'F-IF.7'], 'Read the key features of a parabola.',
         'I can tell which way a parabola opens and find its vertex, axis of symmetry, y-intercept, and maximum or minimum.',
         'Answer each question. Use the picture to help you.',
         typing_box([('point', '(2, 5)'), ('line', 'x=-1'), ('expression', 'x^2+2x-2'), ('inequality', 'y<=6')])),
    band('target', ['F-IF.4', 'F-IF.7', 'F-IF.9', 'A-CED.2', 'F-BF.1b'], 'Use forms of quadratics, compare functions, and combine functions.',
         'I can find the vertex from standard or vertex form, give the range, compare two quadratics, write an equation, and add functions.',
         'Solve each problem. Show your work on paper.'),
    band('advanced', ['F-IF.4', 'F-IF.9', 'A-CED.1', 'A-CED.2', 'F-BF.1b'], 'Model with quadratics and build new functions.',
         'I can solve area and height problems, multiply functions, compare maximums, and write a quadratic from its zeros and a point.',
         'Solve each problem. Some answers are words.'),
], q, 'Standards assessed: NC.M1.F-IF.4 · F-IF.7 · F-IF.9 · A-CED.1 · A-CED.2 · F-BF.1b'))

# ======================================================================= UNIT 8
def seg_plane(xr, yr, pts, labels=None, seg=True, W=250, maxH=300, lab=1, **kw):
    p = S.Plane(xr[0], xr[1], yr[0], yr[1], W=W, maxH=maxH, lab=lab, ylab_every=lab, **kw)
    if seg and len(pts) == 2: p.seg(pts[0][0], pts[0][1], pts[1][0], pts[1][1])
    for (x, y) in pts: p.pt(x, y)
    for i, (x, y) in enumerate(pts):
        if labels and labels[i]:
            t, dx, dy, an = labels[i]
            p.label(x, y, t, dx, dy, S.NAVY, 11, an)
    return p
q = []
p = seg_plane((0, 10), (0, 11), [(2, 4), (8, 10)], [('A(2, 4)', 8, 6, 'start'), ('B(8, 10)', -8, -8, 'end')], lab=2); p.q(0.2, 10.6, 'M = ?', 34, 12)
q.append(Q(1, 'basic', 'G-GPE.6', 'Midpoint', 'Find the midpoint M of A(2, 4) and B(8, 10).', '(5, 7)', ['pt', 5, 7], p.render('Segment from A(2, 4) to B(8, 10)'),
           'M =', 'Average the x’s and the y’s: ((2 + 8) ÷ 2, (4 + 10) ÷ 2).', 'type like (3, 6)'))
p = seg_plane((0, 6), (0, 9), [(1, 2), (4, 8)], [('(1, 2)', -8, 4, 'end'), ('(4, 8)', -8, 4, 'end')])
p.seg(1, 2, 4, 2, S.GOLD, 2, '5 4'); p.seg(4, 2, 4, 8, S.GOLD, 2, '5 4'); p.q(2.5, 2, 'run ?', 6, 18, 10.5); p.q(4, 5, 'rise ?', 30, 0, 10.5)
q.append(Q(2, 'basic', 'G-GPE.5', 'Slope', 'Find the slope of the line through (1, 2) and (4, 8).', '2', ['n', 2], p.render('Segment from (1, 2) to (4, 8) with a slope triangle'),
           'm =', 'Slope = rise ÷ run = (8 − 2) ÷ (4 − 1).'))
p = seg_plane((0, 6), (0, 6), [(1, 1), (4, 5)], [('(1, 1)', 8, 14, 'start'), ('(4, 5)', 8, 4, 'start')])
p.seg(1, 1, 4, 1, S.MUTED, 1.6, '5 4'); p.seg(4, 1, 4, 5, S.MUTED, 1.6, '5 4'); p.q(2.6, 3.4, 'd = ?', -18, -6, 11)
q.append(Q(3, 'basic', 'G-GPE.4', 'Distance', 'Find the distance between (1, 1) and (4, 5).', '5', ['n', 5], p.render('Segment from (1, 1) to (4, 5) with dashed legs'),
           'd =', 'The legs are 3 and 4. d = √(3² + 4²) = √25.'))
p = S.Plane(-3, 3, -5, 6, W=230); p.line(3, -1); p.label(0.2, -3.6, 'y = 3x − 1', 0, 0, S.NAVY, 11)
q.append(Q(4, 'basic', 'G-GPE.5', 'Parallel slope', 'A line is parallel to y = 3x ' + MI + ' 1. What is its slope?', '3', ['n', 3], p.render('Graph of y = 3x − 1'),
           'm =', 'Parallel lines have the SAME slope.'))
p = S.Plane(-2, 5, -1, 5, W=240); p.line(2 / 3, 1); p.label(1.2, 4.5, 'slope = 2/3', 0, 0, S.NAVY, 11)
q.append(Q(5, 'basic', 'G-GPE.5', 'Perpendicular slope', 'A line has slope ' + fr('2', '3') + '. What is the slope of a line perpendicular to it?', MI + fr('3', '2'), ['n', -1.5],
           p.render('A line with slope two thirds'), 'm =', 'Perpendicular slopes are opposite reciprocals: flip the fraction and change the sign.', 'type like -4/5'))
p = seg_plane((-4, 6), (-1, 4), [(-3, 2), (5, 2)], [('A(−3, 2)', 0, -10, 'middle'), ('B(5, 2)', 0, -10, 'middle')])
q.append(Q(6, 'basic', 'G-GPE.4', 'Length', 'Find the length of segment AB with A(' + MI + '3, 2) and B(5, 2).', '8', ['n', 8], p.render('Horizontal segment from A(−3, 2) to B(5, 2)'),
           'AB =', 'Same y-value, so count across: 5 − (−3).'))
# target
p = seg_plane((0, 11), (0, 11), [(1, 2), (4, 6)], [('A(1, 2)', 8, 12, 'start'), ('M(4, 6)', 8, 12, 'start')], lab=2); p.q(0.2, 10.6, 'B = ?', 34, 12)
q.append(Q(7, 'target', 'G-GPE.6', 'Endpoint', 'M(4, 6) is the midpoint of AB. A is (1, 2). Find B.', '(7, 10)', ['pt', 7, 10], p.render('Segment from A(1, 2) to its midpoint M(4, 6)'),
           'B =', 'From A to M is +3 across and +4 up. Do the same move again from M.', 'type like (3, 6)'))
p = seg_plane((-3, 7), (-5, 5), [(-2, -4), (6, 4)], [('A(−2, −4)', 8, 6, 'start'), ('B(6, 4)', -8, -8, 'end')]); p.q(-2.6, 4.4, 'AP : PB = 1 : 3', 52, 8, 10.5)
q.append(Q(8, 'target', 'G-GPE.6', 'Partition', 'Point P is on AB so that AP : PB = 1 : 3. A is (' + MI + '2, ' + MI + '4) and B is (6, 4). Find P.', '(0, ' + MI + '2)', ['pt', 0, -2],
           p.render('Segment from A(−2, −4) to B(6, 4)'), 'P =', 'P is 1/4 of the way from A to B. Change in x is 8 and change in y is 8, so move 2 and 2.', 'type like (3, 6)'))
p = seg_plane((-3, 3), (-1, 4), [(-2, 3), (2, 0)], [('(−2, 3)', 8, 4, 'start'), ('(2, 0)', 0, -10, 'middle')])
q.append(Q(9, 'target', 'G-GPE.4', 'Distance', 'Find the distance between (' + MI + '2, 3) and (2, 0).', '5', ['n', 5], p.render('Segment from (−2, 3) to (2, 0)'),
           'd =', 'Change in x = 4, change in y = −3. d = √(16 + 9).'))
p = S.Plane(-2, 5, -3, 8, W=230); p.line(2, 1); p.pt(3, 4); p.label(3, 4, '(3, 4)', 8, 6, S.NAVY, 11); p.label(2.5, 1.0, 'y = 2x + 1', 0, 0, S.NAVY, 11)
q.append(Q(10, 'target', 'G-GPE.5', 'Parallel line', 'Write the equation of the line parallel to ' + nw('y = 2x + 1') + ' that passes through (3, 4).', 'y = 2x ' + MI + ' 2', ['expr', '2*x-2', ['x']],
           p.render('Line y = 2x + 1 and the point (3, 4)'), 'y =', 'Same slope, 2. Then 4 = 2(3) + b, so b = −2.', 'type like 3x-1'))
p = S.Plane(-1, 7, -1, 7, W=240); p.line(-0.5, 3); p.pt(2, 5); p.label(2, 5, '(2, 5)', 8, 4, S.NAVY, 11); p.label(3.5, 3.6, 'y = −½x + 3', 0, 0, S.NAVY, 11)
q.append(Q(11, 'target', 'G-GPE.5', 'Perpendicular line', 'Write the equation of the line perpendicular to y = ' + MI + fr('1', '2') + 'x + 3 that passes through (2, 5).', 'y = 2x + 1',
           ['expr', '2*x+1', ['x']], p.render('Line y = −½x + 3 and the point (2, 5)'),
           'y =', 'The perpendicular slope is 2 (opposite reciprocal of −½). Then 5 = 2(2) + b.', 'type like 3x-1'))
p = S.Plane(0, 8, 0, 6, W=250); p.poly([(1, 1), (1, 5), (7, 5), (7, 1)], S.FILLN, S.NAVY, 2.2)
for (x, y, t, dx, dy, an) in [(1, 1, 'A(1, 1)', -4, 14, 'middle'), (1, 5, 'B(1, 5)', 0, -8, 'middle'), (7, 5, 'C(7, 5)', 0, -8, 'middle'), (7, 1, 'D(7, 1)', 0, 14, 'middle')]:
    p.pt(x, y); p.label(x, y, t, dx, dy, S.NAVY, 10.5, an)
q.append(Q(12, 'target', 'G-GPE.4', 'Perimeter', 'Find the perimeter of rectangle ABCD.', '20', ['n', 20], p.render('Rectangle A(1, 1), B(1, 5), C(7, 5), D(7, 1)'),
           'P =', 'Side lengths: AB = 4 and BC = 6. Perimeter = 4 + 6 + 4 + 6.'))
# advanced
p = S.Plane(-1, 7, -1, 6, W=250); p.poly([(0, 0), (6, 0), (2, 5)], S.FILLN, S.NAVY, 2.2)
for (x, y, t, dx, dy, an) in [(0, 0, '(0, 0)', 4, -6, 'start'), (6, 0, '(6, 0)', 0, -8, 'end'), (2, 5, '(2, 5)', 8, 4, 'start')]:
    p.pt(x, y); p.label(x, y, t, dx, dy, S.NAVY, 10.5, an)
q.append(Q(13, 'advanced', 'G-GPE.4', 'Area', 'Find the area of the triangle with vertices (0, 0), (6, 0), and (2, 5).', '15', ['n', 15], p.render('Triangle (0, 0), (6, 0), (2, 5)'),
           'Area =', 'Base = 6 (on the x-axis). Height = 5. Area = ½ · base · height.'))
p = S.Plane(-1, 5, -1, 5, W=240); p.poly([(0, 0), (4, 0), (2, 4)], S.FILLN, S.NAVY, 2.2)
for (x, y, t, dx, dy, an) in [(0, 0, 'A(0, 0)', 4, -6, 'start'), (4, 0, 'B(4, 0)', 0, -8, 'end'), (2, 4, 'C(2, 4)', 8, 4, 'start')]:
    p.pt(x, y); p.label(x, y, t, dx, dy, S.NAVY, 10.5, an)
q.append(Q(14, 'advanced', 'G-GPE.4', 'Classify', 'Classify triangle ABC by its sides: scalene, isosceles, or equilateral?', 'isosceles (AC = BC = √20)',
           ['words', [['isosceles', 'isoceles', 'isoscles']], ['scalene', 'equilateral']], p.render('Triangle A(0, 0), B(4, 0), C(2, 4)'),
           'Answer:', 'AB = 4. AC = √(4 + 16) = √20. BC = √(4 + 16) = √20. Two sides are equal.'))
p = S.Plane(0, 5, 0, 7, W=230); p.poly([(1, 1), (4, 3), (2, 6)], S.FILLN, S.NAVY, 2.2)
for (x, y, t, dx, dy, an) in [(1, 1, 'A(1, 1)', 6, 14, 'start'), (4, 3, 'B(4, 3)', 8, 4, 'start'), (2, 6, 'C(2, 6)', 8, 0, 'start')]:
    p.pt(x, y); p.label(x, y, t, dx, dy, S.NAVY, 10.5, an)
q.append(Q(15, 'advanced', 'G-GPE.4', 'Right triangle?', 'Is triangle ABC a right triangle? Write yes or no.', 'yes (slopes of AB and BC are ' + fr('2', '3') + ' and ' + MI + fr('3', '2') + ')', YES,
           p.render('Triangle A(1, 1), B(4, 3), C(2, 6)'), 'Answer:', 'Find slopes: AB = 2/3 and BC = −3/2. Opposite reciprocals → perpendicular → a right angle at B.'))
p = S.Plane(-1, 5, -3, 4, W=240); p.line(2 / 3, 1); p.line(2 / 3, -8 / 3, S.BLUE2)
for (x, y) in [(0, 1), (3, 3)]: p.pt(x, y)
for (x, y) in [(1, -2), (4, 0)]: p.pt(x, y, S.BLUE2)
p.label(0, 1, '(0, 1)', -6, -6, S.NAVY, 10.5, 'end'); p.label(3, 3, '(3, 3)', -6, -6, S.NAVY, 10.5, 'end')
p.label(1, -2, '(1, −2)', 8, 12, S.BLUE2, 10.5); p.label(4, 0, '(4, 0)', 8, 12, S.BLUE2, 10.5)
q.append(Q(16, 'advanced', 'G-GPE.5', 'Compare lines', 'One line goes through (0, 1) and (3, 3). Another goes through (1, ' + MI + '2) and (4, 0). Are they parallel, perpendicular, or neither?',
           'parallel (both slopes are ' + fr('2', '3') + ')', ['words', [['parallel']], ['perpendicular', 'neither']],
           p.render('Two lines, each through two labeled points'), 'Answer:', 'Slope 1 = 2/3. Slope 2 = 2/3. Equal slopes → parallel.'))
p = seg_plane((-4, 7), (0, 8), [(-3, 1), (6, 7)], [('A(−3, 1)', 8, 14, 'start'), ('B(6, 7)', -8, -8, 'end')]); p.q(-3.6, 7.6, 'AP : PB = 2 : 1', 52, 8, 10.5)
q.append(Q(17, 'advanced', 'G-GPE.6', 'Partition', 'P is on AB so that AP : PB = 2 : 1. A is (' + MI + '3, 1) and B is (6, 7). Find P.', '(3, 5)', ['pt', 3, 5],
           p.render('Segment from A(−3, 1) to B(6, 7)'), 'P =', 'P is 2/3 of the way from A. Change: 9 across, 6 up. Two-thirds: 6 across, 4 up.', 'type like (3, 6)'))
p = S.Plane(-1, 5, -1, 4, W=240); p.line(-0.75, 3); p.label(2.6, 3.0, '3x + 4y = 12', 0, 0, S.NAVY, 11)
q.append(Q(18, 'advanced', 'G-GPE.5', 'Perpendicular slope', 'What is the slope of a line perpendicular to 3x + 4y = 12?', fr('4', '3'), ['n', 4 / 3, 0.004],
           p.render('Graph of the line 3x + 4y = 12'), 'm =', 'Solve for y: y = −¾x + 3. The slope is −3/4, so the perpendicular slope is 4/3.', 'type like 2/5'))
CFGS.append(unit_cfg(8, 'Coordinate Geometry', 'Coordinate Geometry', [
    band('basic', ['G-GPE.4', 'G-GPE.5', 'G-GPE.6'], 'Find midpoints, slopes, and lengths on the coordinate plane.',
         'I can find a midpoint, a slope, a distance, and the slopes of parallel and perpendicular lines.',
         'Answer each question. Use the picture to help you.',
         typing_box([('point', '(5, 7)'), ('fraction', '-3/2'), ('root', 'sqrt(20)'), ('equation', 'y=2x-2')])),
    band('target', ['G-GPE.4', 'G-GPE.5', 'G-GPE.6'], 'Partition segments, write parallel and perpendicular lines, and find perimeter.',
         'I can find an endpoint, partition a segment, write equations of parallel and perpendicular lines, and find a perimeter.',
         'Solve each problem. Show your work on paper.'),
    band('advanced', ['G-GPE.4', 'G-GPE.5', 'G-GPE.6'], 'Use coordinates to prove facts about figures.',
         'I can find area, classify triangles, prove a right angle with slopes, compare lines, and partition in any ratio.',
         'Solve each problem. Some answers are words.'),
], q, 'Standards assessed: NC.M1.G-GPE.4 · G-GPE.5 · G-GPE.6'))
