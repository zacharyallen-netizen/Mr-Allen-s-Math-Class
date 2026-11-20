from lib import Q, F, Fr
from figs import ineq, bars, AMB2, SAND
from math import ceil, floor

# every number answer below is computed or checked here
assert Fr(43 - 8, 5) == 7 and (2 - -4) * 3 == 18
assert Fr(35, -5) + 3 == -4 and Fr(34 - 10, 2) - 3 == 9
assert Fr(9 - 3, Fr(1, 2)) == 12 and (40 - Fr(775, 100) - Fr(1425, 100)) / 3 == 6
assert Fr(17 + 3, 4) == 5 and Fr(19 - 4, -3) == -5 and Fr(10 - 6, -2) == -2
assert Fr(35 - 20, Fr(1, 10)) == 150 and ceil(Fr(150 - 40, 12)) == 10
assert Fr(49, 7) == 7 and Fr(6, -2) - 4 == -7 and Fr(11 - 2, Fr(3, 4)) == 12
assert Fr(13 - 5, 2) == 4 and Fr(12, -4) == -3 and 5 - 2 * -3 == 11
assert Fr(61 - 5, 8) == 7 and Fr(2000 - 180, 35) == 52 and 60 * Fr(3, 4) - 5 == 40
assert Fr(47 - 11, 6) == 6 and (-3 - 2) * 5 == -25 and Fr(-8 - 4, -3) == 4 and Fr(Fr(28, 10) + Fr(12, 10), Fr(4, 10)) == 10
assert Fr(18, 3) + 4 == 10 and Fr(6, -2) - 1 == -4 and 10 * 2 - 6 == 14
assert Fr(25 - 4, Fr(7, 2)) == 6 and Fr(5 + 3, Fr(2, 5)) == 20 and Fr(54 - 6, 6) == 8
assert (1 + 3) * 2 == 8 and Fr(24 - 9, -5) == -3 and floor(Fr(50 - 8, 12)) == 3 and floor(Fr(200 - 35, 9)) + 1 == 19

UNIT = dict(
    n=3, title='Equations and Inequalities', short='Equations', icon='⚖️',
    tag='Solve two-step equations and inequalities, graph the answers, and use them to solve real problems.',
    desc='Solve px + q = r and p(x + q) = r, solve and graph inequalities, and write equations and inequalities for word problems.',
    stds=[('NC.7.EE.3', 'Solve multi-step real-world problems with rational numbers in any form; check that answers make sense.'),
          ('NC.7.EE.4', 'Write and solve equations (px + q = r, p(x + q) = r) and inequalities (px + q > r, px + q < r) and graph the solutions.')],
    ican=['I can solve two-step equations like 3x + 7 = 22 and x/4 − 2 = 5',
          'I can solve equations with parentheses like 4(x − 2) = 20',
          'I can solve equations with fractions and decimals, and write equations for word problems',
          'I can solve an inequality, flip the sign when I multiply or divide by a negative, and graph it',
          'I can write and solve an inequality for a word problem and explain what the answer means'],
    vocab=[('Equation', 'a math sentence that says two things are equal'), ('Solution', 'a value of the variable that makes the sentence true'),
           ('Inverse operations', 'operations that undo each other, like + and −, or × and ÷'), ('Two-step equation', 'an equation that takes two moves to solve, like 3x + 7 = 22'),
           ('Inequality', 'a math sentence with <, >, ≤ or ≥'), ('Open circle', 'on a graph, the number is NOT a solution (< or >)'),
           ('Closed circle', 'on a graph, the number IS a solution (≤ or ≥)'), ('At least / at most', 'at least means ≥; at most means ≤')],
)
T = []
T.append(dict(
    title='Two-Step Equations', nav='Two-Step', std='NC.7.EE.4',
    words=[('Inverse operations', 'operations that undo each other: + and −, × and ÷.'), ('Solution', 'the value of x that makes the equation true.')],
    big='Keep the equation balanced: whatever you do to one side, do to the other. Undo in <b>reverse order</b>: first undo the + or −, then undo the × or ÷. Check by putting your answer back in.',
    fig=bars([('3x + 7', [(1, 'x', SAND), (1, 'x', SAND), (1, 'x', SAND), (1.4, '7', AMB2)], 4.4), ('22', [(4.4, '22', '#fff')], 4.4)], title='bar model: three x and 7 is the same as 22'),
    figcap='3x + 7 = 22. Take away the 7: three x\'s are 15. One x is 5.',
    fill=['To solve 3x + 7 = 22, first {{subtract 7}} from both sides, then {{divide by 3}}.', 'To solve x/4 − 2 = 5, first {{add 2}}, then {{multiply by 4}}.'],
    examples=[dict(title='Example: 3x + 7 = 22', vw='3x + 7 = 22'),
              dict(title='Example: x/4 − 2 = 5', steps=['Undo − 2: add 2 to both sides. x/4 = 7', 'Undo ÷ 4: multiply both sides by 4. x = 28', 'Check: 28 ÷ 4 − 2 = 7 − 2 = 5 ✓ <b>x = 28</b>'])],
    warn='Undo the + or − FIRST. In 2x + 6 = 20, dividing only the 2x by 2 breaks the balance.',
    np=[Q(1, 'Solve: 5x + 8 = 43', ans=7, hint='Subtract 8 from both sides. Then divide by 5.', sol='5x + 8 − 8 = 43 − 8, so 5x = 35. Then x = 35 ÷ 5 = 7.'),
        Q(2, 'Solve: x/3 − 4 = 2', ch=['x = 18', 'x = 2', 'x = −6', 'x = 6'],
          why={'x = 2': 'You divided by 3. Undo ÷ 3 by MULTIPLYING by 3.', 'x = −6': 'You subtracted 4. Undo − 4 by ADDING 4 to both sides.', 'x = 6': 'That is x/3, not x. You still need to undo the ÷ 3.'},
          hint='Add 4 to both sides first. Then multiply by 3.', sol='x/3 − 4 + 4 = 2 + 4, so x/3 = 6. Multiply by 3: x = 18.'),
        Q(3, 'Kim solved 2x + 6 = 20 like this: x + 6 = 10, so x = 4. What went wrong?', ch=['She divided only 2x by 2, not the 6. The answer is x = 7.', 'Nothing. x = 4 is right.', 'She should subtract 2 first. The answer is x = 9.', 'She should add 6. The answer is x = 13.'],
          why={'Nothing. x = 4 is right.': 'Check it: 2(4) + 6 = 14, not 20.', 'She should subtract 2 first. The answer is x = 9.': 'The 2 is multiplied by x. You cannot subtract it.', 'She should add 6. The answer is x = 13.': 'The equation has + 6. Undo + 6 by subtracting.'},
          hint='Check her answer: put x = 4 into 2x + 6. Do you get 20?', sol='Dividing must happen to EVERY term. Subtract 6 first: 2x = 14, so x = 7.')]))
T.append(dict(
    title='Equations with Parentheses', nav='Parentheses', std='NC.7.EE.4',
    words=[('p(x + q) = r', 'an equation with a number times a group.')],
    big='Two ways work. <b>Way 1:</b> distribute, then solve the two-step equation. <b>Way 2:</b> divide both sides by the number outside first. Pick the easier way.',
    fill=['Way 1: 4(x − 2) = 20 → 4x − {{8}} = 20 → 4x = {{28}} → x = {{7}}', 'Way 2: 4(x − 2) = 20 → x − 2 = {{5}} → x = {{7}}'],
    examples=[dict(title='Example (distribute first): 4(x − 2) = 20', vw='4(x − 2) = 20'),
              dict(title='Example (divide first): −3(x + 5) = 12', steps=['Divide both sides by −3: x + 5 = −4', 'Subtract 5: x = −9', 'Check: −3(−9 + 5) = −3(−4) = 12 ✓ <b>x = −9</b>'])],
    warn='When you distribute, multiply EVERY term inside. −3(x + 5) is −3x − 15, not −3x + 5.',
    np=[Q(1, 'Solve: 2(x + 6) = 30', ans=9, hint='Divide both sides by 2. Then subtract 6.', sol='x + 6 = 15, so x = 9.'),
        Q(2, 'Solve: −5(x − 3) = 35', ch=['x = −4', 'x = 10', 'x = −10', 'x = −6.4'],
          why={'x = 10': '35 ÷ (−5) is negative. Check the sign after you divide.', 'x = −10': 'You subtracted 3. Undo − 3 by ADDING 3.', 'x = −6.4': 'You multiplied −5 by x but not by −3. Multiply BOTH terms inside.'},
          hint='Divide both sides by −5 first: x − 3 = ?', sol='Divide by −5: x − 3 = −7. Add 3: x = −4.'),
        Q(3, 'A rectangle is 5 cm wide and (x + 3) cm long. Its perimeter is 34 cm, so 2(x + 3) + 10 = 34. What is x?', ans=9, hint='Subtract 10. Then divide by 2. Then subtract 3.', sol='2(x + 3) = 24, so x + 3 = 12, and x = 9. The length is 12 cm.')]))
T.append(dict(
    title='Equations with Fractions, Decimals and Word Problems', nav='Word Problems', std='NC.7.EE.3',
    words=[('Variable', 'a letter that stands for the number you do not know yet.'), ('Reasonable', 'the answer makes sense in the story (no −3 tickets!).')],
    big='Fractions and decimals do not change the steps. For word problems: <b>1</b> name the variable, <b>2</b> find the rate (× x) and the one-time amount (+ or −), <b>3</b> write the equation, <b>4</b> solve, <b>5</b> check that the answer makes sense.',
    fill=['A gym costs $25 to join plus $12 a month. Total $97: {{12}}m + {{25}} = 97', 'The rate goes with the variable. The one-time amount is the {{constant}}.'],
    examples=[dict(title='Example: 0.75x + 4.5 = 12', vw='0.75x + 4.5 = 12'),
              dict(title='Example: a gym costs $25 to join plus $12 a month. Maya paid $97. How many months?', steps=['Let m = number of months.', 'Rate: $12 each month → 12m. One time: $25.', '12m + 25 = 97', '12m = 72, so m = 6', 'Check: 12(6) + 25 = 97 ✓ <b>6 months</b>'])],
    warn='Read for the RATE ("each", "per", "every"). The rate is multiplied by the variable. The one-time fee is not.',
    np=[Q(1, 'Solve: 0.5x + 3 = 9', ans=12, hint='Subtract 3. Then divide by 0.5 (the same as multiply by 2).', sol='0.5x = 6, so x = 6 ÷ 0.5 = 12.'),
        Q(2, 'A taxi charges $3.50 plus $2.25 per mile. A ride cost $19.25. Which equation fits? (m = miles)', ch=['2.25m + 3.50 = 19.25', '3.50m + 2.25 = 19.25', '2.25(m + 3.50) = 19.25', '2.25m − 3.50 = 19.25'],
          why={'3.50m + 2.25 = 19.25': 'The PER-mile cost goes with m. Which number is per mile?', '2.25(m + 3.50) = 19.25': 'That charges $2.25 on the $3.50 too. The $3.50 is added once.', '2.25m − 3.50 = 19.25': 'The $3.50 is added to the cost, not taken away.'},
          hint='Rate × miles + one-time charge = total.', sol='$2.25 per mile → 2.25m. Plus $3.50 once. Total 19.25. (Solving: m = 7 miles.)'),
        Q(3, 'Jen has $40. She buys a $7.75 binder and 3 notebooks that cost the same. She has $14.25 left. How much is one notebook (in dollars)?', ans=6, hint='40 − 7.75 − 3n = 14.25. Or: how much did she spend in all?', sol='She spent 40 − 14.25 = 25.75. Take away the binder: 25.75 − 7.75 = 18. Each notebook: 18 ÷ 3 = $6.')]))
T.append(dict(
    title='Solving and Graphing Inequalities', nav='Inequalities', std='NC.7.EE.4',
    words=[('Inequality', 'a sentence with <, >, ≤ or ≥. It has MANY solutions.'), ('Open circle', 'for < or >: the number itself is NOT a solution.'), ('Closed circle', 'for ≤ or ≥: the number IS a solution.')],
    big='Solve an inequality like an equation, with one new rule: when you <b>multiply or divide by a negative number, flip the inequality sign</b>. Then graph: circle at the number, shade toward the solutions.',
    fig=ineq(-2, 8, 3, '>'), figcap='x > 3: open circle at 3 (3 is not a solution), shaded to the right.',
    table=(['Inequality', 'Say it', 'Circle', 'Shade'], [['x > 3', 'more than 3', '{{open}}', '{{right}}'], ['x ≤ −1', 'at most −1', '{{closed}}', '{{left}}'], ['x ≥ 4', 'at least 4', '{{closed}}', '{{right}}'], ['x < 0', 'less than 0', '{{open}}', '{{left}}']]),
    examples=[dict(title='Example: 3x + 2 > 11', vw='3x + 2 > 11'),
              dict(title='Example: −2x + 5 ≤ 13 (divide by a negative)', vw='−2x + 5 ≤ 13')],
    warn='Only multiplying or dividing by a NEGATIVE flips the sign. Adding or subtracting a negative does not.',
    np=[Q(1, 'Solve: 4x − 3 < 17. The answer is x < □. What number goes in the box?', ans=5, hint='Add 3. Then divide by 4. Dividing by a positive does not flip.', sol='4x < 20, so x < 5.'),
        Q(2, 'Solve: −3x + 4 ≥ 19', ch=['x ≤ −5', 'x ≥ −5', 'x ≤ 5', 'x ≤ −15'],
          why={'x ≥ −5': 'You divided by −3 but did not flip the sign.', 'x ≤ 5': '15 ÷ (−3) is negative.', 'x ≤ −15': 'You stopped too soon. Divide both sides by −3.'},
          hint='Subtract 4. Then divide by −3 and FLIP the sign.', sol='−3x ≥ 15. Divide by −3 and flip: x ≤ −5.'),
        Q(3, 'Which graph shows the solutions of 6 − 2x > 10?', ch=['open circle at −2, shaded to the left', 'open circle at −2, shaded to the right', 'closed circle at −2, shaded to the left', 'open circle at 2, shaded to the left'],
          why={'open circle at −2, shaded to the right': 'You divided by −2. Did you flip the sign?', 'closed circle at −2, shaded to the left': 'The sign is > (not ≥), so −2 is not a solution.', 'open circle at 2, shaded to the left': '4 ÷ (−2) is negative.'},
          hint='Solve first: subtract 6, then divide by −2 and flip.', sol='−2x > 4. Divide by −2 and flip: x < −2. Open circle at −2, shade left.')]))
T.append(dict(
    title='Inequality Word Problems', nav='Inequality Stories', std='NC.7.EE.4',
    words=[('At least', '≥ (that much or more)'), ('At most / no more than', '≤ (that much or less)'), ('More than', '>'), ('Less than / fewer than', '<')],
    big='Write the inequality from the story, solve it, then ask: <b>does the answer make sense?</b> If you can only buy whole things, round to a whole number the story allows.',
    fill=['"You can spend at most $60" uses the sign {{≤}}.', '"She needs at least 80 points" uses the sign {{≥}}.'],
    examples=[dict(title='Example: you have $60. Tickets cost $11 each and snacks cost $9. How many tickets can you buy?', steps=['Let t = tickets. Cost: 11t + 9. At most $60: <b>11t + 9 ≤ 60</b>', '11t ≤ 51, so t ≤ 4.6...', 'You cannot buy part of a ticket. 5 tickets cost $64, too much.', '<b>At most 4 tickets</b> (0, 1, 2, 3 or 4)'])],
    warn='Round to fit the story. "At most 4.6 tickets" means 4. "At least 9.2 weeks" means 10 weeks.',
    np=[Q(1, 'A phone plan costs $20 plus $0.10 per text. You can spend at most $35. What is the greatest number of texts you can send?', ans=150, hint='0.10t + 20 ≤ 35', sol='0.10t ≤ 15, so t ≤ 150. At most 150 texts.'),
        Q(2, 'Leo has 32 points and earns 6 points per quiz. He needs MORE than 80 points. Which inequality fits? (q = quizzes)', ch=['6q + 32 > 80', '6q + 32 < 80', '6q + 32 ≥ 80', '32q + 6 > 80'],
          why={'6q + 32 < 80': '"More than" points the other way.', '6q + 32 ≥ 80': '≥ means "at least". The story says MORE than.', '32q + 6 > 80': 'The 6 points come with each quiz, so 6 goes with q.'},
          hint='Points per quiz × q + points he has. "More than" is >.', sol='6q + 32 > 80.'),
        Q(3, 'Ana has $40 and saves $12 each week. She needs at least $150 for a bike. What is the fewest whole weeks she must save?', ans=10, hint='12w + 40 ≥ 150. Then think: is 9 weeks enough?', sol='12w ≥ 110, so w ≥ 9.17. 9 weeks gives $148, not enough. She needs 10 weeks.')]))

PART2 = [
    ('A. Solve Equations', 'NC.7.EE.4', [
        Q(1, 'Solve: 7x − 9 = 40', ans=7, hint='Add 9. Then divide by 7.'),
        Q(2, 'Solve: −2(x + 4) = 6', ch=['x = −7', 'x = 1', 'x = −1', 'x = 7'],
          why={'x = 1': 'After dividing, x + 4 = −3. Undo + 4 by SUBTRACTING 4.', 'x = −1': '6 ÷ (−2) is negative, not 3.', 'x = 7': 'Check: −2(7 + 4) = −22, not 6. Watch both signs.'}, hint='Divide both sides by −2 first.'),
        Q(3, 'Solve: ' + F('3', '4') + 'x + 2 = 11', ans=12, hint='Subtract 2. Then multiply by 4/3 (the reciprocal).')]),
    ('B. Solve Inequalities', 'NC.7.EE.4', [
        Q(1, 'Solve: 2x + 5 > 13. The answer is x > □. What number goes in the box?', ans=4, hint='Subtract 5. Then divide by 2.'),
        Q(2, 'Solve: −4x − 1 < 11', ch=['x > −3', 'x < −3', 'x > 3', 'x > −2.5'],
          why={'x < −3': 'You divided by −4. Did you flip the sign?', 'x > 3': '12 ÷ (−4) is negative.', 'x > −2.5': 'Undo − 1 by ADDING 1, not subtracting.'}, hint='Add 1. Then divide by −4 and flip.'),
        Q(3, 'Is x = −3 a solution of 5 − 2x ≥ 11?', ch=['Yes, because 11 ≥ 11 is true.', 'No, because 11 is not greater than 11.', 'No, because x must be positive.', 'Yes, because 5 − 2 = 3.'],
          why={'No, because 11 is not greater than 11.': 'The ≥ sign means greater than OR EQUAL to.', 'No, because x must be positive.': 'Negative numbers can be solutions too. Put −3 in and check.', 'Yes, because 5 − 2 = 3.': '2x means 2 times x. Put in x = −3: 5 − 2(−3).'}, hint='Put −3 in for x: 5 − 2(−3) = ?')]),
    ('C. Real-World Problems', 'NC.7.EE.3', [
        Q(1, 'Tickets cost $8 each plus a $5 fee for the whole order. The total is $61. How many tickets?', ans=7, hint='8t + 5 = 61'),
        Q(2, 'A truck can carry at most 2,000 lb. The driver weighs 180 lb. Each box weighs 35 lb. What is the greatest number of boxes?', ans=52, hint='35b + 180 ≤ 2000'),
        Q(3, 'A $60 jacket is 25% off. Then you use a $5 coupon. How much do you pay (in dollars)?', ans=40, hint='25% off means you pay 75%: 0.75 × 60. Then subtract 5.')]),
]

PRACTICE = dict(title='Unit 3 Practice — Equations and Inequalities', sub='Two-step · Parentheses · Word problems · Inequalities · Inequality stories', secs=[
    ('A. Two-Step Equations', 'NC.7.EE.4', 'Undo + or − first, then × or ÷. Check your answer.', [
        Q(1, 'Solve: 6x + 11 = 47', ans=6, hint='Subtract 11. Then divide by 6.'),
        Q(1, 'Solve: x/5 + 2 = −3', ans=-25, hint='Subtract 2. Then multiply by 5.'),
        Q(2, 'Solve: −8 = 4 − 3x', ch=['x = 4', 'x = −4', 'x = −12', 'x = 4/3'],
          why={'x = −4': '−12 ÷ (−3) is positive.', 'x = −12': 'That is −3x. Divide by −3 to find x.', 'x = 4/3': 'Subtract 4 from −8 first, not add it.'}, hint='Subtract 4 from both sides: −12 = −3x.'),
        Q(3, 'Solve: 0.4x − 1.2 = 2.8', ans=10, hint='Add 1.2. Then divide by 0.4.')]),
    ('B. Equations with Parentheses', 'NC.7.EE.4', 'Distribute, or divide by the outside number first.', [
        Q(1, 'Solve: 3(x − 4) = 18', ans=10, hint='Divide by 3: x − 4 = 6.'),
        Q(2, 'Solve: 6 = −2(x + 1)', ch=['x = −4', 'x = −2', 'x = 2', 'x = −3.5'],
          why={'x = −2': 'After dividing, −3 = x + 1. Undo + 1 by SUBTRACTING 1.', 'x = 2': '6 ÷ (−2) is negative.', 'x = −3.5': 'You multiplied −2 by x but not by 1.'}, hint='Divide both sides by −2.'),
        Q(3, 'Solve: ' + F('1', '2') + '(x + 6) = 10', ans=14, hint='Multiply both sides by 2: x + 6 = 20.')]),
    ('C. Word Problems', 'NC.7.EE.3', 'Rate × variable + one-time amount = total.', [
        Q(1, 'Jo ran 4 miles, then biked 3.5 miles each day for d days. She went 25 miles in all. How many days did she bike?', ans=6, hint='3.5d + 4 = 25'),
        Q(2, 'A phone plan is $15 per month. The phone costs $40 once. Sam paid $145 in all. Which equation fits? (m = months)', ch=['15m + 40 = 145', '40m + 15 = 145', '15(m + 40) = 145', '15m − 40 = 145'],
          why={'40m + 15 = 145': 'The MONTHLY cost goes with m.', '15(m + 40) = 145': 'That charges $15 on the $40 too. The phone is paid once.', '15m − 40 = 145': 'The phone adds to the cost.'}, hint='Monthly cost × m + one-time cost = total.'),
        Q(2, 'Solve: ' + F('2', '5') + 'x − 3 = 5', ans=20, hint='Add 3. Then multiply by 5/2.'),
        Q(3, 'A rectangle\'s length is 3 more than twice its width. The perimeter is 54. What is the width?', ans=8, hint='Length = 2w + 3. Perimeter: 2(2w + 3) + 2w = 54.')]),
    ('D. Inequalities', 'NC.7.EE.4', 'Flip the sign when you multiply or divide by a negative.', [
        Q(1, 'Solve: x/2 − 3 ≥ 1. The answer is x ≥ □. What number goes in the box?', ans=8, hint='Add 3. Then multiply by 2.'),
        Q(2, 'Solve: 9 − 5x > 24', ch=['x < −3', 'x > −3', 'x < 3', 'x > 3'],
          why={'x > −3': 'You divided by −5. Did you flip the sign?', 'x < 3': '15 ÷ (−5) is negative.', 'x > 3': 'Two mistakes: the sign of the number and the flip.'}, hint='Subtract 9. Then divide by −5 and flip.'),
        Q(2, 'Which inequality matches the graph?', fig=ineq(-4, 4, -1, '≥', title='closed circle at −1, shaded right'), ch=['x ≥ −1', 'x > −1', 'x ≤ −1', 'x ≥ 1'],
          why={'x > −1': 'The circle is filled in, so −1 IS a solution.', 'x ≤ −1': 'The shading goes right, toward bigger numbers.', 'x ≥ 1': 'Look again at where the circle is: left of 0.'}, hint='Closed or open circle? Which way is the shading?'),
        Q(3, 'Which number is NOT a solution of 3x − 7 < 8?', ch=['5', '4.9', '0', '−2'],
          why={'4.9': '3(4.9) − 7 = 7.7, which is less than 8. It works.', '0': '3(0) − 7 = −7, which is less than 8. It works.', '−2': '3(−2) − 7 = −13, which is less than 8. It works.'}, hint='Solve: x < ?. Or test each number.')]),
    ('E. Inequality Word Problems', 'NC.7.EE.4', 'Solve, then round to fit the story.', [
        Q(1, 'You have $50. A pizza costs $12 and delivery is $8. What is the greatest number of pizzas you can order?', ans=3, hint='12p + 8 ≤ 50'),
        Q(2, 'A team needs at least 24 points to win the prize. Which sign belongs in "points □ 24"?', ch=['≥', '>', '≤', '<'],
          why={'>': '"At least 24" includes 24 itself.', '≤': 'That means at most 24.', '<': 'That means fewer than 24.'}, hint='"At least" means that much or more.'),
        Q(3, 'Kai earns $9 an hour and already has $35. He wants MORE than $200. What is the fewest whole hours he must work?', ans=19, hint='9h + 35 > 200. Is 18 hours enough?')]),
])
