"""Step-by-step data for the Units 3-4 Pre-Test (online version A): keys pt1 … pt18.
Same format, colors and checks as the tutorial (u34_tut_steps.py): every line is verified with Fraction arithmetic.
"""
from u34_tut_steps import add, S, undo_plus, undo_minus, divide, sub_x, dist, CLASSIFY, SEQ

REL3 = lambda right, w1, w2: [(right, True, '')] + [w1, w2]
PAIR_Q = 'Look at the diagram. What kind of pair are the angles?'
RULE_Q = 'Which rule do you use?'

# ── 3.0 ──
add('pt1', ('one', 6), start='2x + 5 = 17', check='2(6) + 5 = 17 ✓', steps=[
    undo_plus(5, '[v:2x]', '[k:17]', '[v:2x]', '[k:12]', k=2),
    divide(2, 12, 6)])
SEQ['pt1']['steps'][0]['note'] += ' 17 − 5 = 12.'
add('pt2', ('ineq', '>', -5), start='x + 9 > 4', graph=dict(v=-5, closed=False, dir='right'), check='Test x = 0: 0 + 9 = 9, and 9 > 4 ✓', steps=[
    S([('Subtract 9 from both sides', True, ''), ('Add 9 to both sides', False, 'The 9 is being added. To undo adding, subtract 9.'),
       ('Subtract 9 and flip the sign', False, 'Only flip when you multiply or divide by a negative. Subtracting never flips the sign.')],
      'Subtract 9 from both sides.', 'x > [k:-5]', ['x [c:+ 9 [o:- 9]] > [k:4] [o:- 9]'], '+ 9 and − 9 cancel. 4 − 9 = −5. Subtracting does not flip the sign.')])
add('pt3', ('all',), start='3x + 4 = 3x + 4', check='Try x = 10: 3(10) + 4 = 34 on both sides ✓', steps=[
    S([('Subtract 3x from both sides', True, ''), ('Divide both sides by 3', False, 'Move the x-terms to one side first.'),
       ('Add 3x to both sides', False, 'Adding gives 6x on each side. Subtract 3x so the x-terms cancel.')],
      'Subtract 3x from both sides.', '4 = 4', ['[c:3x [o:- 3x]] + 4 = [c:3x [o:- 3x]] + 4'], '3x − 3x = 0 on BOTH sides. The x-terms are gone.'),
    CLASSIFY['all']('4 = 4')])
add('pt4', ('one', 112), given='Parallel lines are cut by a transversal. The angles are 112° and x°.', check='Corresponding angles are equal: 112° = 112° ✓', steps=[
    S(REL3('Corresponding', ('Same-Side Interior', False, 'Look again: the two angles are in the SAME spot at each crossing. That is corresponding.'),
           ('Alternate Interior', False, 'Alternate angles are on opposite sides of the transversal. These are in the same spot.')),
      'They are in the same position at each crossing. Corresponding angles are EQUAL.', 'x = [k:112]', ask=PAIR_Q)])
add('pt5', ('one', 58), given='Parallel lines are cut by a transversal. The angles are 58° and x°.', check='Alternate interior angles are equal: 58° = 58° ✓', steps=[
    S(REL3('Alternate Interior', ('Same-Side Interior', False, 'The angles are on OPPOSITE sides of the transversal, so they are alternate.'),
           ('Corresponding', False, 'The angles are not in the same spot. Both are between the lines, on opposite sides of t.')),
      'Both are between the lines, on opposite sides of t. Alternate interior angles are EQUAL.', 'x = [k:58]', ask=PAIR_Q)])
add('pt6', ('one', 65), given='A triangle has angles 70°, 45° and x°.', check='70 + 45 + 65 = 180 ✓', steps=[
    S(REL3('Triangle Sum Theorem', ('Exterior Angle Theorem', False, 'All three angles are INSIDE the triangle. There is no exterior angle.'),
           ('Linear pair', False, 'These angles are not on a straight line. They are the three angles of a triangle.')),
      'All three angles are inside the triangle. They add to 180°.', '[k:70] + [k:45] + x = 180', ask=RULE_Q),
    S([('Add 70 + 45', True, ''), ('Divide both sides by 3', False, 'x is not multiplied by 3. Add the numbers you know first.'),
       ('Add 180 to both sides', False, 'That moves away from x alone. Add the numbers you know first.')],
      'Combine the numbers on the left.', '[k:115] + x = 180', ['[k:70 + 45] + x = 180'], 'The purple numbers: 70 + 45 = 115.'),
    S([('Subtract 115 from both sides', True, ''), ('Add 115 to both sides', False, 'To undo + 115, subtract 115.'),
       ('Divide both sides by 115', False, 'x is not multiplied by 115. Subtract.')],
      'Subtract 115 from both sides.', 'x = [k:65]', ['[c:[k:115] [o:- 115]] + x = 180 [o:- 115]'], '115 − 115 = 0. 180 − 115 = 65.')])
# ── 4.0 ──
add('pt7', ('one', 5), start='5x - 7 = 2x + 8', check='5(5) − 7 = 18 and 2(5) + 8 = 18 ✓', steps=[
    sub_x('2x', '', '', '[v:5x] [o:- 2x] - 7 = [c:2x [o:- 2x]] + 8', '[v:3x] - 7 = 8', '2x − 2x cancel on the right. On the left, 5x − 2x = 3x.', 5),
    undo_minus(7, '[v:3x]', '[k:8]', '[v:3x]', '[k:15]', k=3),
    divide(3, 15, 5)])
SEQ['pt7']['steps'][1]['note'] += ' 8 + 7 = 15.'
add('pt8', ('one', 9), start='3(x - 4) = x + 6', check='3(9 − 4) = 15 and 9 + 6 = 15 ✓', steps=[
    S([('Distribute the 3 to both terms', True, ''), ('Add 4 to both sides', False, 'The 4 is inside the parentheses with the x. Distribute the 3 first.'),
       ('Divide both sides by x', False, 'Never divide by x. Distribute the 3 first.')],
      'Distribute: multiply the 3 by EACH term inside.', '[v:3x] - [k:12] = x + 6', ['[d:3] · x - [d:3] · 4 = x + 6'], '3 · x = 3x and 3 · 4 = 12.'),
    S([('Subtract x from both sides', True, ''), ('Add x to both sides', False, 'Adding x puts more x on the left. Subtract x so the x-terms are on one side.'),
       ('Divide both sides by 3', False, 'Divide last. First get all the x-terms on one side.')],
      'Subtract x from both sides.', '[v:2x] - 12 = 6', ['[v:3x] [o:- x] - 12 = [c:x [o:- x]] + 6'], 'x − x cancel on the right. On the left, 3x − x = 2x.'),
    undo_minus(12, '[v:2x]', '[k:6]', '[v:2x]', '[k:18]', k=2),
    divide(2, 18, 9)])
SEQ['pt8']['steps'][2]['note'] += ' 6 + 12 = 18.'
add('pt9', ('ineq', '≥', -4), start='-2x + 3 ≤ 11', graph=dict(v=-4, closed=True, dir='right'), check='Test x = 0: −2(0) + 3 = 3, and 3 ≤ 11 ✓', steps=[
    S([('Subtract 3 from both sides', True, ''), ('Add 3 to both sides', False, 'The 3 is being added. To undo adding, subtract 3.'),
       ('Divide both sides by −2', False, 'Undo the + 3 before you divide.')],
      'Subtract 3 from both sides.', '[v:-2x] ≤ [k:8]', ['[v:-2x] [c:+ 3 [o:- 3]] ≤ [k:11] [o:- 3]'], '+ 3 and − 3 cancel. 11 − 3 = 8.'),
    divide(-2, 8, -4, rel='≤')])
add('pt10', ('one', 108), given='Parallel lines are cut by a transversal. The angles are 72° and x°.', check='72 + 108 = 180 ✓', steps=[
    S(REL3('Same-Side Interior', ('Corresponding', False, 'Corresponding angles are in the same spot at each crossing. These are both between the lines, on the same side of t.'),
           ('Alternate Interior', False, 'Both angles are on the SAME side of the transversal, so they are not alternate.')),
      'Both are between the lines, on the same side of t. Same-side interior angles ADD to 180°.', '[k:72] + [v:x] = 180', ask=PAIR_Q),
    S([('Subtract 72 from both sides', True, ''), ('Set x = 72', False, 'Same-side interior angles are not equal. They add to 180°.'),
       ('Add 72 to both sides', False, 'To undo + 72, subtract 72.')],
      'Subtract 72 from both sides.', 'x = [k:108]', ['[c:[k:72] [o:- 72]] + [v:x] = 180 [o:- 72]'], '72 − 72 = 0. 180 − 72 = 108.')])
add('pt11', ('one', 20), given='Corresponding angles measure (3x + 10)° and 70°.', check='3(20) + 10 = 70 ✓', steps=[
    S(REL3('Corresponding', ('Same-Side Interior', False, 'The angles are in the SAME spot at each crossing. That is corresponding.'),
           ('Linear pair', False, 'A linear pair is side by side on one line. These angles are at different crossings.')),
      'Corresponding angles are EQUAL.', '[v:3x] + 10 = [k:70]', ask=PAIR_Q),
    undo_plus(10, '[v:3x]', '[k:70]', '[v:3x]', '[k:60]', k=3),
    divide(3, 60, 20)])
SEQ['pt11']['steps'][1]['note'] += ' 70 − 10 = 60.'
add('pt12', ('one', 115), given='The remote interior angles are 48° and 67°. The exterior angle is x°.', check='The inside angle at that corner is 65°, and 65 + 115 = 180 ✓', steps=[
    S(REL3('Exterior Angle Theorem', ('Triangle Sum Theorem', False, 'x is OUTSIDE the triangle. Use the exterior angle theorem.'),
           ('Linear pair', False, 'You do not know the inside angle next to x. Use the two remote angles.')),
      'x is an exterior angle. It equals the sum of the two remote interior angles.', 'x = [k:48] + [k:67]', ask=RULE_Q),
    S([('Add 48 + 67', True, ''), ('Subtract 67 from 180', False, 'That finds the inside angle next to x, not x.'),
       ('Subtract 48 from 67', False, 'The exterior angle is the SUM of the remote angles. Add.')],
      'Add the two remote angles.', 'x = [k:115]', ['x = [k:48 + 67]'])])
# ── 5.0 ──
add('pt13', ('none',), start='2(3x + 1) = 6x - 5', steps=[
    dist(2, '[d:2] · 3x + [d:2] · 1 = 6x - 5', '6x + 2 = 6x - 5'),
    S([('Subtract 6x from both sides', True, ''), ('Divide both sides by 6', False, 'Move the x-terms to one side first.'),
       ('Add 6x to both sides', False, 'Adding gives 12x on each side. Subtract 6x so the x-terms cancel.')],
      'Subtract 6x from both sides.', '2 = -5', ['[c:6x [o:- 6x]] + 2 = [c:6x [o:- 6x]] - 5'], '6x − 6x = 0 on BOTH sides. The x-terms are gone.'),
    CLASSIFY['none']('2 = −5')])
add('pt14', ('one', 6), start='4(x + 2) - x = 2(x + 7)', check='4(6 + 2) − 6 = 26 and 2(6 + 7) = 26 ✓', steps=[
    S([('Distribute on both sides', True, ''), ('Subtract 2 from both sides', False, 'The 2s are inside parentheses. Distribute first.'),
       ('Divide both sides by 4', False, 'Only part of the left side is multiplied by 4. Distribute first.')],
      'Distribute on both sides.', '4x + 8 - x = 2x + 14', ['[d:4] · x + [d:4] · 2 - x = [d:2] · x + [d:2] · 7'], '4(x + 2) = 4x + 8 and 2(x + 7) = 2x + 14.'),
    S([('Combine like terms: 4x − x', True, ''), ('Combine 4x and 8 to get 12x', False, '4x and 8 are not like terms. Only combine x-terms with x-terms.'),
       ('Subtract 8 from both sides', False, 'Combine like terms on the left first so it is simpler.')],
      'Combine like terms on the left.', '[v:3x] + 8 = 2x + 14', ['[v:4x] + 8 [v:- x] = 2x + 14'], 'The blue x-terms: 4x − x = 3x.'),
    sub_x('2x', '', '', '[v:3x] [o:- 2x] + 8 = [c:2x [o:- 2x]] + 14', '[v:x] + 8 = 14', '2x − 2x cancel on the right. On the left, 3x − 2x = x.', 3),
    S([('Subtract 8 from both sides', True, ''), ('Add 8 to both sides', False, 'The 8 is being added to x. To undo adding, subtract.'),
       ('Add 14 to both sides', False, 'The 8 is being added to x. Subtract 8 from both sides.')],
      'Subtract 8 from both sides.', 'x = [k:6]', ['x [c:+ 8 [o:- 8]] = [k:14] [o:- 8]'], '+ 8 and − 8 cancel. 14 − 8 = 6.')])
add('pt15', ('ineq', '<', -5), start='3(x - 2) > 5x + 4', graph=dict(v=-5, closed=False, dir='left'), check='Test x = −6: 3(−8) = −24 and 5(−6) + 4 = −26. −24 > −26 ✓', steps=[
    S([('Distribute the 3', True, ''), ('Add 2 to both sides', False, 'The 2 is inside the parentheses. Distribute first.'),
       ('Divide both sides by 5', False, 'Only part of the right side is multiplied by 5. Distribute first.')],
      'Distribute: multiply the 3 by EACH term inside.', '3x - 6 > 5x + 4', ['[d:3] · x - [d:3] · 2 > 5x + 4'], '3 · x = 3x and 3 · 2 = 6.'),
    sub_x('5x', '', '', '[v:3x] [o:- 5x] - 6 > [c:5x [o:- 5x]] + 4', '[v:-2x] - 6 > 4', '5x − 5x cancel on the right. On the left, 3x − 5x = −2x.', 3),
    undo_minus(6, '[v:-2x]', '[k:4]', '[v:-2x]', '[k:10]', k=-2, rel='>'),
    divide(-2, 10, -5, rel='>')])
SEQ['pt15']['steps'][2]['note'] += ' 4 + 6 = 10.'
add('pt16', ('one', 20), given='Alternate exterior angles measure (4x − 15)° and (2x + 25)°.', check='4(20) − 15 = 65 and 2(20) + 25 = 65 ✓', steps=[
    S(REL3('Alternate Exterior', ('Same-Side Exterior', False, 'The angles are on OPPOSITE sides of the transversal.'),
           ('Alternate Interior', False, 'The angles are OUTSIDE the parallel lines, so they are exterior.')),
      'Both are outside the lines, on opposite sides of t. Alternate exterior angles are EQUAL.', '[v:4x] - 15 = [v:2x] + 25', ask=PAIR_Q),
    sub_x('2x', '', '', '[v:4x] [o:- 2x] - 15 = [c:2x [o:- 2x]] + 25', '[v:2x] - 15 = 25', '2x − 2x cancel on the right. On the left, 4x − 2x = 2x.', 4),
    undo_minus(15, '[v:2x]', '[k:25]', '[v:2x]', '[k:40]', k=2),
    divide(2, 40, 20)])
SEQ['pt16']['steps'][2]['note'] += ' 25 + 15 = 40.'
add('pt17', ('one', 30), given='A triangle has angles (x + 10)°, (2x)° and (3x − 10)°.', check='The angles are 40°, 60° and 80°. 40 + 60 + 80 = 180 ✓', steps=[
    S(REL3('Triangle Sum Theorem', ('Exterior Angle Theorem', False, 'All three angles are INSIDE the triangle.'),
           ('Set two angles equal', False, 'Nothing says two angles are equal. The three angles add to 180°.')),
      'The three interior angles add to 180°.', '(x + 10) + 2x + (3x - 10) = 180', ask=RULE_Q),
    S([('Combine like terms', True, ''), ('Combine 2x and 10 to get 12x', False, '2x and 10 are not like terms. Combine x-terms with x-terms and numbers with numbers.'),
       ('Divide both sides by 3', False, 'Combine like terms first.')],
      'Combine like terms: blue x-terms together, purple numbers together.', '[v:6x] = 180',
      ['[v:x] [k:+ 10] [v:+ 2x] [v:+ 3x] [k:- 10] = 180'], 'x + 2x + 3x = 6x. 10 − 10 = 0, so the numbers cancel.'),
    divide(6, 180, 30)])
add('pt18', ('one', 18), given='An exterior angle measures (5x − 6)°. The remote interior angles are (2x + 9)° and 39°.', check='5(18) − 6 = 84 and (2(18) + 9) + 39 = 84 ✓', steps=[
    S(REL3('Exterior Angle Theorem', ('Triangle Sum Theorem', False, 'One angle is OUTSIDE the triangle. Use the exterior angle theorem.'),
           ('Set the two remote angles equal', False, 'The remote angles are not equal. They add up to the exterior angle.')),
      'The exterior angle equals the sum of the two remote interior angles.', '[v:5x] - 6 = (2x + 9) + 39', ask=RULE_Q),
    S([('Combine the numbers on the right: 9 + 39', True, ''), ('Combine 2x and 9 to get 11x', False, '2x and 9 are not like terms.'),
       ('Divide both sides by 5', False, 'Simplify the right side first.')],
      'Combine like terms on the right.', '[v:5x] - 6 = 2x [k:+ 48]', ['[v:5x] - 6 = 2x [k:+ 9 + 39]'], 'The purple numbers: 9 + 39 = 48.'),
    sub_x('2x', '', '', '[v:5x] [o:- 2x] - 6 = [c:2x [o:- 2x]] + 48', '[v:3x] - 6 = 48', '2x − 2x cancel on the right. On the left, 5x − 2x = 3x.', 5),
    undo_minus(6, '[v:3x]', '[k:48]', '[v:3x]', '[k:54]', k=3),
    divide(3, 54, 18)])
SEQ['pt18']['steps'][3]['note'] += ' 48 + 6 = 54.'

PT = {k: v for k, v in SEQ.items() if k.startswith('pt')}
assert len(PT) == 18

if __name__ == '__main__':
    from u34_tut_steps import plain
    for k, s in PT.items():
        last = s['steps'][-1]
        print(f'{k:5} {len(s["steps"])} steps → {plain(last["res"]) if last.get("res") else plain(last["concl"])}')
