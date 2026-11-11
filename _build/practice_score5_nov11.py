#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Score 5 problems added to the practice pages, Nov 11, 2026 (Zach: "add at least two to three more Score 5 questions").
Written from his proficiency scales (Drive folder "8th Math Proficiency Scales"): Score 5 = explain or justify, combine
several skills in one multi-step problem, or say what an answer means in a real situation. Every answer is a number or
a tap; each wrong choice is a common mistake and carries its own note ("why").

Adds to window.PRACTICE inside each page (three per page, at the end of the section named by its letter). Safe to run
again: a problem whose question is already on the page is replaced, not added twice. The printed worksheets (PDFs) are
NOT changed by this script.      python3 _build/practice_score5_nov11.py
"""
import os, re, json
from fractions import Fraction as F
G = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'grade8')
def fr(a, b): return '<span class="fr"><span>%s</span><span>%s</span></span>' % (a, b)
def mc(q, right, *wrong):
    """right = text; wrong = (text, why). The order on the page is set here (right answer is not always first)."""
    texts = [right] + [w[0] for w in wrong]; k = sum(ord(c) for c in q) % len(texts); order = texts[k:] + texts[:k]
    return dict(q=q, ans=right, lv=5, choices=order, why={w[0]: w[1] for w in wrong})
def num(q, ans): return dict(q=q, ans=str(ans), lv=5)
def auto(q, ans): return dict(q=q, ans=ans, lv=5)            # tap-answers.js builds the choices and notes from the answer

# ---- every number answer is checked here ----
assert F(2, 3) * (-6 + 6) - 2 == -6 + 4 and F(3, 4) * (12 + 8) - 1 == 12 + 2
assert 25 + 15 * 5 == 20 * 5 and 40 + 10 * 4 == 20 * 4
assert (3 * 30 + 20) + (2 * 30 + 10) == 180 and max(3 * 30 + 20, 2 * 30 + 10) == 110 and (4 * 30 + 10) + (30 + 20) == 180 and max(130, 50) == 130
assert 2 * 30 + (30 + 15) == 105 and max(60, 45) == 60 and 3 * 25 + (25 + 20) == 120 and max(75, 45) == 75
assert 3 ** 2 + 4 ** 2 + 12 ** 2 == 13 ** 2 and 2 ** 2 + 3 ** 2 + 6 ** 2 == 7 ** 2
assert 13 ** 2 - 5 ** 2 == 12 ** 2 and 13 ** 2 - 12 ** 2 == 5 ** 2 and 12 - 5 == 7 and 25 ** 2 - 7 ** 2 == 24 ** 2 and 25 ** 2 - 15 ** 2 == 20 ** 2 and 24 - 20 == 4
assert 9 ** 2 + 12 ** 2 == 225 != 16 ** 2 and 10 ** 2 + 24 ** 2 == 26 ** 2 == 676
assert F(15 - 7, 6 - 2) == 2 and 7 - 2 * 2 == 3 and F(14 - 20, 4) == F(-3, 2) and 30 + 10 * 2 == 25 * 2
assert 100 ** (1 / 3.0) < 5.3 < 30 ** 0.5 and 200 ** (1 / 3.0) < 6.5 < 50 ** 0.5 and abs(6.3 ** 2 - 39.69) < 1e-9 and abs(8.7 ** 2 - 75.69) < 1e-9
assert 4.5e9 * 2e6 == 9e15 and 2.5e4 * 4e2 == 1e7 and abs(3e8 * 3.6e3 * 2 - 2.16e12) < 1 and abs(3.4e2 * 3.6e3 * 3 - 3.672e6) < 1e-3 and 8e5 * 3e2 == 2.4e8 and 6e4 * 5e1 == 3e6
# (2x^3 y)^2 (3x^-4 y^5) = 12 x^2 y^7 ; (3x^2 y^3)^2 (2x^-1 y^4) = 18 x^3 y^10 ; (4a^5b^2)(3a^-2 b)/(6a^3b^4) = 2/b ; (6a^4 b)(2a^-1 b^3)/(4a^3 b^6) = 3/b^2
assert (4 * 3, 6 - 4, 2 + 5) == (12, 2, 7) and (9 * 2, 4 - 1, 6 + 4) == (18, 3, 10) and (F(12, 6), 5 - 2 - 3, 2 + 1 - 4) == (2, 0, -1) and (F(12, 4), 4 - 1 - 3, 1 + 3 - 6) == (3, 0, -2)

W_FRAC = ('Rational. Any number written as a fraction is rational.', 'A fraction is rational only when the top and the bottom are both INTEGERS.')
ADD = {
 'unit1-practice-1.html': [
  ('B', mc('Is ' + fr('3π', '4') + ' rational or irrational? Pick the best reason.', 'Irrational. π is irrational, so 3π/4 is not a ratio of two integers.', W_FRAC,
      ('Rational. 3 and 4 are integers.', 'The top is 3π, not 3. π is irrational, so the top is not an integer.'), ('Irrational. Every fraction is irrational.', 'Fractions of integers, like 3/4, are rational. This one is irrational because of π.'))),
  ('D', mc('Kai estimates √40 ≈ 6.3. Which check shows the estimate is good?', '6.3² = 39.69, which is very close to 40.', ('6.3 × 2 = 12.6, which is not close to 40.', 'Squaring means 6.3 × 6.3, not 6.3 × 2.'),
      ('40 ÷ 2 = 20, so 6.3 is too low.', '√40 is not 40 ÷ 2. To check a square root, square your estimate.'), ('6² = 36 and 7² = 49, so any number from 6 to 7 is a good estimate.', 'That only shows √40 is between 6 and 7. Squaring 6.3 shows how CLOSE it is.'))),
  ('E', auto('Order from least to greatest: √30, ∛100, 5.3', '∛100, 5.3, √30')),
 ],
 'unit1-practice-2.html': [
  ('B', mc('Is ' + fr('√2', '2') + ' rational or irrational? Pick the best reason.', 'Irrational. √2 is irrational, so √2/2 is not a ratio of two integers.', W_FRAC,
      ('Rational. It equals 1.', 'Only 2/2 equals 1. √2/2 is about 0.707.'), ('Irrational. Every fraction is irrational.', 'Fractions of integers, like 1/2, are rational. This one is irrational because of √2.'))),
  ('D', mc('Mia estimates √75 ≈ 8.7. Which check shows the estimate is good?', '8.7² = 75.69, which is very close to 75.', ('8.7 × 2 = 17.4, which is not close to 75.', 'Squaring means 8.7 × 8.7, not 8.7 × 2.'),
      ('75 ÷ 2 = 37.5, so 8.7 is too low.', '√75 is not 75 ÷ 2. To check a square root, square your estimate.'), ('8² = 64 and 9² = 81, so any number from 8 to 9 is a good estimate.', 'That only shows √75 is between 8 and 9. Squaring 8.7 shows how CLOSE it is.'))),
  ('E', auto('Order from least to greatest: √50, ∛200, 6.5', '∛200, 6.5, √50')),
 ],
 'unit2-practice-exponents-1.html': [
  ('B', mc('Which shows why 5⁰ = 1?', '5³ ÷ 5³ = 5⁰, and a number divided by itself is 1.', ('5 × 0 = 0, and 0 + 1 = 1.', 'An exponent does not mean "multiply by the exponent". Use the quotient rule: 5³ ÷ 5³ = 5⁰.'),
      ('5¹ = 5, so 5⁰ is 5 − 4 = 1.', 'Going down one exponent DIVIDES by 5. It does not subtract. 5 ÷ 5 = 1.'), ('It is only a rule to memorize. There is no reason.', 'There is a reason. 5³ ÷ 5³ = 5⁰ by the quotient rule, and that division equals 1.'))),
  ('B', mc('Simplify: (2x³y)² · (3x⁻⁴y⁵)', '12x²y⁷', ('6x²y⁷', 'Square the 2 as well: 2² = 4. Then 4 × 3 = 12.'), ('12x¹⁰y⁷', 'The exponent is −4, so add a negative: 6 + (−4) = 2.'), ('12x²y¹⁰', 'For y, ADD the exponents when you multiply: 2 + 5 = 7. Do not multiply them.'))),
  ('B', mc('Simplify: (4a⁵b²)(3a⁻²b) ÷ (6a³b⁴)', '2/b', ('2b', 'The b exponent is 3 − 4 = −1. A negative exponent moves b to the bottom.'), ('6/b', 'Divide the front numbers: 12 ÷ 6 = 2. Do not subtract them.'), ('2a⁶/b', 'When you divide, SUBTRACT the exponents: a³ ÷ a³ = a⁰ = 1.'))),
 ],
 'unit2-practice-exponents-2.html': [
  ('B', mc('Lena says 2⁻³ = −8. Which fixes her mistake?', 'A negative exponent means a reciprocal: 2⁻³ = 1/2³ = 1/8', ('Lena is right. A negative exponent makes the answer negative.', 'A negative exponent does NOT make the answer negative. It moves the power to the bottom of a fraction.'),
      ('Multiply instead: 2 × (−3) = −6', 'An exponent means repeated multiplication. It never means base × exponent.'), ('Flip the base: (1/2)³ = 1/6', 'Flipping is right, but (1/2)³ = 1/2 × 1/2 × 1/2 = 1/8, not 1/6.'))),
  ('B', mc('Simplify: (3x²y³)² · (2x⁻¹y⁴)', '18x³y¹⁰', ('6x³y¹⁰', 'Square the 3 as well: 3² = 9. Then 9 × 2 = 18.'), ('18x⁵y¹⁰', 'The exponent is −1, so add a negative: 4 + (−1) = 3.'), ('18x³y⁹', 'Power of a power: MULTIPLY 3 × 2 = 6 first. Then 6 + 4 = 10.'))),
  ('B', mc('Simplify: (6a⁴b)(2a⁻¹b³) ÷ (4a³b⁶)', '3/b²', ('3b²', 'The b exponent is 4 − 6 = −2. A negative exponent moves b² to the bottom.'), ('8/b²', 'Divide the front numbers: 12 ÷ 4 = 3. Do not subtract them.'), ('3a⁶/b²', 'When you divide, SUBTRACT the exponents: a³ ÷ a³ = a⁰ = 1.'))),
 ],
 'unit2-practice-sci-notation-1.html': [
  ('C', auto('A server stores 4.5 × 10⁹ photos. Each photo uses 2 × 10⁶ bytes. How many bytes in all? (scientific notation)', '9 × 10¹⁵')),
  ('C', mc('Light travels 3 × 10⁸ meters each second. There are 3.6 × 10³ seconds in an hour. How many meters does light travel in 2 hours?', '2.16 × 10¹²', ('1.08 × 10¹²', 'That is the distance for ONE hour. The question asks about 2 hours.'),
      ('2.16 × 10²⁴', 'To multiply powers of 10, ADD the exponents: 8 + 3 = 11. Do not multiply them.'), ('21.6 × 10¹¹', 'That is not in scientific notation yet. The first number must be less than 10: 2.16 × 10¹².'))),
  ('C', mc('A city has 8 × 10⁵ people. Each person uses about 3 × 10² liters of water a day. Sam says the city uses 2.4 × 10³ liters a day. Is that reasonable?', 'No. 8 × 3 = 24 and 10⁵ × 10² = 10⁷, so it is 2.4 × 10⁸ liters.',
      ('Yes. 5 − 2 = 3, so the exponent is 3.', 'To MULTIPLY powers of 10, add the exponents: 5 + 2 = 7. Subtract only when you divide.'), ('No. It is 24 × 10⁷ liters, and that is the final answer.', '24 × 10⁷ is not in scientific notation. Write it as 2.4 × 10⁸.'),
      ('Yes. One person uses 300 liters, and 2.4 × 10³ is more than 300.', 'The city has 800,000 people. 2,400 liters is only enough for 8 of them.'))),
 ],
 'unit2-practice-sci-notation-2.html': [
  ('C', auto('A farm has 2.5 × 10⁴ trees. Each tree grows about 4 × 10² apples. How many apples in all? (scientific notation)', '1 × 10⁷')),
  ('C', mc('Sound travels 3.4 × 10² meters each second. There are 3.6 × 10³ seconds in an hour. How many meters does sound travel in 3 hours?', '3.672 × 10⁶', ('1.224 × 10⁶', 'That is the distance for ONE hour. The question asks about 3 hours.'),
      ('3.672 × 10⁵', '3.4 × 3.6 = 12.24. Moving the decimal to get 1.224 raises the exponent from 5 to 6.'), ('36.72 × 10⁵', 'That is not in scientific notation yet. The first number must be less than 10: 3.672 × 10⁶.'))),
  ('C', mc('A stadium holds 6 × 10⁴ fans. Each ticket costs 5 × 10¹ dollars. Ava says a sold-out game brings in 3 × 10⁵ dollars. Is that reasonable?', 'No. 6 × 5 = 30 and 10⁴ × 10¹ = 10⁵, so it is 30 × 10⁵ = 3 × 10⁶ dollars.',
      ('Yes. 6 × 5 = 30, so it starts with 3, and the exponent is 4 + 1 = 5.', '30 × 10⁵ must be rewritten. 30 = 3 × 10, so the exponent goes up to 6.'), ('No. It is 3 × 10⁴ dollars, because 4 × 1 = 4.', 'To multiply powers of 10, ADD the exponents: 4 + 1 = 5. Do not multiply them.'),
      ('Yes. 60,000 fans times $50 is about $300,000.', '60,000 × 50 = 3,000,000. Count the zeros again.'))),
 ],
 'unit3-practice-1.html': [
  ('C', num('Solve: ' + fr(2, 3) + '(x + 6) − 2 = x + 4', -6)),
  ('D', mc('Why does 3(x + 2) = 3x + 10 have no solution?', 'After you distribute, both sides have 3x, but 6 does not equal 10.', ('Both sides have 3x, so every number works.', 'Every number works only when the plain numbers match too. Here 6 does not equal 10.'),
      ('It does have a solution: x = 4/3.', 'Distribute first: 3x + 6 = 3x + 10. The x-terms cancel, so there is no x left to solve for.'), ('An equation with parentheses never has a solution.', 'Parentheses do not decide it. Distribute, then compare the two sides.'))),
  ('F', num('Plan A: $25 to join a gym plus $15 each month. Plan B: $20 each month with no joining fee. After how many months do the two plans cost the same?', 5)),
 ],
 'unit3-practice-2.html': [
  ('C', num('Solve: ' + fr(3, 4) + '(x + 8) − 1 = x + 2', 12)),
  ('D', mc('Why does 4(x − 1) + 2 = 4x − 2 have infinitely many solutions?', 'After you simplify, both sides are exactly the same: 4x − 2.', ('The x-terms are the same, so there is no solution.', 'No solution needs DIFFERENT plain numbers. Here they match too: −2 and −2.'),
      ('x = 0 is the only solution.', '0 works, but so does every other number. Try x = 5: both sides equal 18.'), ('Any equation with 4x on both sides has infinitely many solutions.', 'The plain numbers matter too. 4x − 2 = 4x + 1 has NO solution.'))),
  ('F', num('Plan A: $40 to join a club plus $10 each month. Plan B: $20 each month with no joining fee. After how many months do the two plans cost the same?', 4)),
 ],
 'unit4-practice-1.html': [
  ('C', num('Two parallel lines are cut by a transversal. Two same-side interior angles are (3x + 20)° and (2x + 10)°. Find the LARGER angle, in degrees.', 110)),
  ('D', num('Two angles of a triangle are (2x)° and (x + 15)°. The exterior angle at the third vertex is 105°. Find the larger of those two angles, in degrees.', 60)),
  ('D', mc('Why do the three angles of every triangle add to 180°?', 'Draw a line through the top vertex, parallel to the base. The three angles on that straight line match the triangle’s three angles.',
      ('A triangle has 3 angles, and 3 × 60° = 180°.', 'Only an equilateral triangle has three 60° angles. The sum is 180° for EVERY triangle.'), ('A triangle is half of a circle, and half of 360° is 180°.', 'A triangle is not half of a circle. Use a line parallel to the base and alternate interior angles.'),
      ('Every triangle has one 90° angle and two 45° angles.', 'Most triangles have no right angle at all. Their angles still add to 180°.'))),
 ],
 'unit4-practice-2.html': [
  ('C', num('Two parallel lines are cut by a transversal. Two same-side interior angles are (4x + 10)° and (x + 20)°. Find the LARGER angle, in degrees.', 130)),
  ('D', num('Two angles of a triangle are (3x)° and (x + 20)°. The exterior angle at the third vertex is 120°. Find the larger of those two angles, in degrees.', 75)),
  ('D', mc('Why does an exterior angle of a triangle equal the two remote interior angles added together?', 'The exterior angle and the angle next to it add to 180°. The three inside angles also add to 180°. So the exterior angle equals the other two.',
      ('The exterior angle is always the biggest angle.', 'Being the biggest is not a reason. Use the two facts that add to 180°: a straight line and the triangle sum.'), ('The exterior angle and the remote angles are vertical angles.', 'Vertical angles come from two crossing lines. This uses a straight line (180°) and the triangle sum (180°).'),
      ('Every exterior angle is 120°.', 'Exterior angles come in many sizes. They are all 120° only in an equilateral triangle.'))),
 ],
 'unit5-practice-1.html': [
  ('C', mc('A triangle has sides 9, 12 and 16. Is it a right triangle? Pick the best reason.', 'No. 9² + 12² = 225, but 16² = 256.', ('Yes. 9 + 12 is more than 16.', 'That only shows the sides can make a triangle. For a right triangle, check a² + b² = c².'),
      ('Yes. 9, 12 and 15 make a right triangle, and 16 is close to 15.', 'Close is not enough. The two sides of a² + b² = c² must be exactly equal.'), ('No. 9² + 16² does not equal 12².', 'Your answer is right, but the check is not. The LONGEST side is c: compare 9² + 12² with 16².'))),
  ('D', num('A box is 3 cm wide, 4 cm long and 12 cm tall. Find the length of the longest diagonal inside the box, in cm. (Find the diagonal of the bottom first.)', 13)),
  ('D', num('A 13 ft ladder leans on a wall with its base 5 ft from the wall. The base slides out until it is 12 ft from the wall. How many feet does the top of the ladder slide DOWN?', 7)),
 ],
 'unit5-practice-2.html': [
  ('C', mc('A triangle has sides 10, 24 and 26. Is it a right triangle? Pick the best reason.', 'Yes. 10² + 24² = 676, and 26² = 676.', ('No. 10 + 24 = 34, not 26.', 'Add the SQUARES of the two shorter sides, not the sides themselves.'),
      ('Yes. All three sides are even numbers.', 'Even sides do not make a right triangle. Check a² + b² = c².'), ('No. 10² + 26² does not equal 24².', 'The LONGEST side is c. Compare 10² + 24² with 26².'))),
  ('D', num('A box is 2 cm wide, 3 cm long and 6 cm tall. Find the length of the longest diagonal inside the box, in cm. (Find the diagonal of the bottom first.)', 7)),
  ('D', num('A 25 ft ladder leans on a wall with its base 7 ft from the wall. The base slides out until it is 15 ft from the wall. How many feet does the top of the ladder slide DOWN?', 4)),
 ],
 'unit6-practice.html': [
  ('C', num('A line passes through (2, 7) and (6, 15). Use algebra to find its y-intercept.', 3)),
  ('D', mc('A candle is 20 cm tall. After 4 hours it is 14 cm tall. It burns at a steady rate. Which equation gives its height y (in cm) after x hours?', 'y = −1.5x + 20', ('y = 1.5x + 20', 'The candle gets SHORTER, so the rate of change is negative.'),
      ('y = −6x + 20', '6 cm is the change over all 4 hours. Divide by 4 to get the change for ONE hour.'), ('y = −1.5x + 14', 'The starting value is the height at 0 hours: 20 cm, not 14 cm.'))),
  ('E', num('Plan A costs $30 to start plus $10 each month. Plan B costs nothing to start, and its line passes through (0, 0) and (2, 50). After how many months do the two plans cost the same?', 2)),
 ],
}
tot = 0
for fn, items in ADD.items():
    p = os.path.join(G, fn); s = open(p, encoding='utf-8').read(); m = re.search(r'window\.PRACTICE\s*=\s*', s); a = m.end(); d, n = json.JSONDecoder().raw_decode(s[a:])
    for letter, prob in items:
        sec = [x for x in d['data']['secs'] if x['title'].startswith(letter + '.')] or d['data']['secs'][-1:]; assert len(sec) == 1, (fn, letter); probs = sec[0]['probs']   # no such section: the last one
        probs[:] = [x for x in probs if x['q'] != prob['q']]
        prob = dict(prob); prob['n'] = max([x['n'] for x in probs] or [0]) + 1
        if prob.get('choices'): assert prob['ans'] in prob['choices'] and len(set(prob['choices'])) == len(prob['choices']), (fn, prob['q'])
        probs.append({k: prob[k] for k in ('n', 'q', 'ans', 'lv', 'choices', 'why') if k in prob}); tot += 1
    s = s[:a] + json.dumps(d, ensure_ascii=False) + s[a + n:]; open(p, 'w', encoding='utf-8').write(s)
    lv = [x.get('lv') for sec in d['data']['secs'] for x in sec['probs']]; print(fn.ljust(40), 'problems', len(lv), '| Score 3/4/5:', [lv.count(i) for i in (3, 4, 5)])
print('added', tot)
