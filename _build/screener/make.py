"""Quick Check screeners (Nov 19, 2026, Zach: "A short diagnostic screening does sound like a good idea"; plan item 3:
"Add a short diagnostic screener at the start of each unit").

One page per unit, grade8/unitN-screener.html: 5 questions on the skills a student needs BEFORE the unit (earlier
grades), one at a time, tap answers. Every wrong choice is a common mistake with its own note; Hint on every question;
3 tries (the answer shows after the 3rd miss). The end screen lists "Ready" skills (right on the first try) and
"Warm up on these first" skills, each with a link to practice (Fluency Lab or Skill Builders). Results go to Mr. Allen
through Send my work (kind practice, page "Unit N · Quick Check"), like other practice pages.

Every answer is checked below with exact arithmetic. Rerun after editing:   python3 _build/screener/make.py
Bump V after changing grade8/screener/screener.js or .css.
"""
import os, json, math
from fractions import Fraction as F

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
G8 = os.path.join(ROOT, 'grade8')
V = '20261119a'
FL = 'Fluency-Lab-Package/fluency-lab/fluency-lab-%s.html'
def fl(skill, name): return {'h': FL % skill, 't': 'Fluency Lab: ' + name}
def sb(n, name): return {'h': f'skill-builders-unit{n}.html', 't': 'Skill Builders: ' + name}

def q(skill, text, right, wrong, hint, review):
    """wrong = [(choice, why the choice is a mistake), ...]"""
    assert len(wrong) == 3 and len({right, *[w for w, _ in wrong]}) == 4, text
    return {'skill': skill, 'q': text, 'right': right, 'wrong': [{'t': w, 'why': y} for w, y in wrong], 'hint': hint, 'review': review}

U = {}
TITLE = {1: 'Real Numbers', 2: 'Exponents & Scientific Notation', 3: 'Linear Equations', 4: 'Angles & Geometry',
         5: 'Pythagorean Theorem', 6: 'Functions, Slope & Systems', 7: 'Data Analysis & Statistics', 8: 'Transformations', 9: 'Volume'}

# ── Unit 1 ──
assert 7 * 7 == 49 and math.isqrt(36) ** 2 == 36 and all(math.isqrt(n) ** 2 != n for n in (24, 50, 18))
assert F(3, 4) == F(75, 100) and max(F('0.6'), F('0.58'), F('0.509'), F('0.06')) == F('0.6') and -3 < -1
U[1] = [
 q('Squaring a number', 'What is 7²?', '49', [('14', 'That is 7 × 2. The small 2 means 7 × 7.'), ('72', 'The 2 is an exponent, not a digit. 7² means 7 × 7.'), ('77', '7² means 7 times itself, not two 7s side by side.')],
   '7² means 7 × 7.', fl('multiply', 'Multiplication')),
 q('Perfect squares', 'Which number is a perfect square?', '36', [('24', 'No whole number times itself makes 24. 4 × 4 = 16 and 5 × 5 = 25.'), ('50', 'No whole number times itself makes 50. 7 × 7 = 49.'), ('18', 'No whole number times itself makes 18. 4 × 4 = 16 and 5 × 5 = 25.')],
   'A perfect square is a whole number times itself, like 5 × 5 = 25.', sb(1, 'Squares and square roots')),
 q('Fractions to decimals', 'Write ¾ as a decimal.', '0.75', [('0.34', 'Do not just put the digits after the point. Divide 3 by 4.'), ('1.33', 'That is 4 ÷ 3. Divide the top by the bottom: 3 ÷ 4.'), ('0.3', 'Divide 3 by 4 all the way: 3 ÷ 4 = 0.75.')],
   'Divide the top number by the bottom number.', fl('fractions', 'Fractions')),
 q('Comparing decimals', 'Which number is the greatest?', '0.6', [('0.58', 'Compare the tenths first: 5 tenths is less than 6 tenths.'), ('0.509', 'More digits does not mean bigger. Compare the tenths: 5 is less than 6.'), ('0.06', '0.06 is 6 hundredths. That is less than 6 tenths.')],
   'Line up the decimal points. Compare the tenths place first.', fl('decimals', 'Decimals')),
 q('Negative numbers', 'Which number is less: −3 or −1?', '−3', [('−1', 'On a number line, −3 is farther left than −1, so −3 is less.'), ('They are equal', 'They are different numbers. Picture them on a number line.'), ('You cannot compare negatives', 'You can. Numbers farther left on the number line are less.')],
   'Picture a number line. Numbers on the left are less.', fl('integers', 'Integers')),
]
# ── Unit 2 ──
assert 2 ** 4 == 16 and 10 ** 3 == 1000 and (-3) * (-4) == 12 and F('4.2') * 100 == 420 and F('0.005') == F(5, 1000)
U[2] = [
 q('What an exponent means', 'What is 2⁴?', '16', [('8', 'That is 2 × 4. The 4 means multiply 2 by itself 4 times.'), ('6', 'That is 2 + 4. An exponent means repeated multiplication.'), ('24', 'The 4 is an exponent, not a digit. 2⁴ = 2 × 2 × 2 × 2.')],
   '2⁴ means 2 × 2 × 2 × 2.', sb(2, 'What an exponent means')),
 q('Powers of 10', 'What is 10³?', '1,000', [('30', 'That is 10 × 3. 10³ means 10 × 10 × 10.'), ('100', 'That is 10². 10³ has three 10s multiplied.'), ('10,000', 'That has one zero too many. 10³ has 3 zeros.')],
   'For a power of 10, the exponent tells how many zeros.', sb(2, 'What an exponent means')),
 q('Multiplying integers', 'What is (−3)(−4)?', '12', [('−12', 'A negative times a negative is positive.'), ('−7', 'That adds the numbers. The parentheses side by side mean multiply.'), ('7', 'Multiply, do not add: 3 × 4 = 12, and neg × neg is positive.')],
   'Two negatives multiplied make a positive.', fl('integers', 'Integers')),
 q('Multiplying by 100', 'What is 4.2 × 100?', '420', [('4.200', 'Adding zeros after the decimal does not change the number. Move the point 2 places right.'), ('42', 'That moves the point only 1 place. 100 has 2 zeros.'), ('0.042', 'That moves the point the wrong way. Multiplying by 100 makes the number bigger.')],
   'Multiplying by 100 moves the decimal point 2 places to the right.', fl('decimals', 'Decimals')),
 q('Decimal place value', 'Which means the same as 0.005?', '5 thousandths', [('5 hundredths', '5 hundredths is 0.05. Count the places: 0.005 has 3.'), ('5 tenths', '5 tenths is 0.5. The 5 in 0.005 is 3 places after the point.'), ('5 ten-thousandths', 'That is 0.0005, one place too far.')],
   'Count the places after the decimal point: tenths, hundredths, thousandths.', fl('decimals', 'Decimals')),
]
# ── Unit 3 ──
assert -5 + 9 == 4 and 3 * 7 == 21 and -6 - 4 == -10
U[3] = [
 q('One-step equations', 'Solve: x + 9 = 4', 'x = −5', [('x = 13', 'That adds 9. To undo + 9, subtract 9 from both sides.'), ('x = 5', 'Check the sign: 4 − 9 is negative.'), ('x = −13', 'Subtract 9 from 4: 4 − 9 = −5.')],
   'Undo + 9 by subtracting 9 from both sides.', sb(3, 'One- and two-step equations')),
 q('One-step equations', 'Solve: 3x = 21', 'x = 7', [('x = 18', 'That subtracts 3. 3x means 3 times x, so divide by 3.'), ('x = 63', 'That multiplies. To undo × 3, divide by 3.'), ('x = 24', 'That adds 3. Divide both sides by 3.')],
   '3x means 3 times x. Do the opposite: divide.', sb(3, 'One- and two-step equations')),
 q('Distributing', 'Which is the same as 4(x + 2)?', '4x + 8', [('4x + 2', 'Multiply the 4 by EACH term inside, the 2 too.'), ('x + 8', 'Multiply the 4 by the x too.'), ('4x + 6', 'That adds 4 and 2. The 4 multiplies: 4 × 2 = 8.')],
   'Multiply the outside number by each term inside the parentheses.', sb(3, 'Distribute and combine like terms')),
 q('Combining like terms', 'Simplify: 5x + 3 − 2x', '3x + 3', [('6x', 'Only like terms combine. 3 has no x, so it stays apart.'), ('7x + 3', 'It is minus 2x, so subtract: 5x − 2x = 3x.'), ('3x − 3', 'The + 3 does not change. Only 5x − 2x combines.')],
   'Combine the x-terms. Numbers without x stay separate.', fl('expressions', 'Expressions')),
 q('Subtracting integers', 'What is −6 − 4?', '−10', [('−2', 'You are moving 4 more to the left from −6.'), ('10', 'Start at −6 and go 4 more to the left. You end up below zero.'), ('2', 'Start at −6 and move 4 left on the number line.')],
   'Start at −6. Subtracting 4 moves 4 to the left.', fl('integers', 'Integers')),
]
# ── Unit 4 ──
assert 180 - 130 == 50 and 180 - 50 - 60 == 70 and 2 * 35 + 10 == 80
U[4] = [
 q('Angles on a straight line', 'Two angles make a straight line. One angle is 130°. What is the other?', '50°', [('130°', 'They are not equal. Angles on a straight line add to 180°.'), ('230°', 'That uses 360°. A straight line is 180°.'), ('40°', 'That uses 90°. A straight line is 180°.')],
   'Angles that make a straight line add to 180°.', sb(4, 'Angle pairs')),
 q('Triangle angle sum', 'The three angles of any triangle add to…', '180°', [('360°', '360° is all the way around a point. A triangle’s angles add to 180°.'), ('90°', '90° is one right angle. All three angles add to 180°.'), ('100°', 'Tear the corners off a triangle and they make a straight line: 180°.')],
   'The three angles of a triangle make a straight line when put together.', sb(4, 'Angles in a triangle')),
 q('Missing angle in a triangle', 'A triangle has angles of 50° and 60°. What is the third angle?', '70°', [('110°', 'That is 50 + 60. Subtract that from 180.'), ('250°', 'That subtracts from 360. A triangle adds to 180.'), ('10°', 'That is 60 − 50. Subtract both angles from 180.')],
   'Add the two angles, then subtract from 180°.', sb(4, 'Angles in a triangle')),
 q('Two-step equations', 'Solve: 2x + 10 = 80', 'x = 35', [('x = 45', 'Undo + 10 by SUBTRACTING 10, not adding.'), ('x = 140', 'After 2x = 70, divide by 2. Do not multiply.'), ('x = 70', 'That stops at 2x = 70. Divide by 2 to finish.')],
   'Undo + 10 first, then undo × 2.', sb(3, 'One- and two-step equations')),
 q('Kinds of angles', 'An angle measures 120°. What kind of angle is it?', 'Obtuse', [('Acute', 'Acute angles are less than 90°.'), ('Right', 'A right angle is exactly 90°.'), ('Straight', 'A straight angle is exactly 180°.')],
   'Compare 120° with 90° and 180°.', sb(4, 'Angle pairs')),
]
# ── Unit 5 ──
assert 6 ** 2 + 8 ** 2 == 100 and math.isqrt(81) == 9 and 7 ** 2 < 50 < 8 ** 2 and 9 - 3 == 6
U[5] = [
 q('Adding squares', 'What is 6² + 8²?', '100', [('28', 'That is 6 × 2 + 8 × 2. Square each number: 6 × 6 and 8 × 8.'), ('196', 'That is (6 + 8)². Square each number first, then add.'), ('14', 'That is 6 + 8. Square each number first.')],
   'Find 6 × 6 and 8 × 8, then add.', sb(5, 'Legs, hypotenuse and a² + b² = c²')),
 q('Square roots', 'What is √81?', '9', [('40.5', 'That is 81 ÷ 2. A square root asks what number times itself is 81.'), ('6,561', 'That is 81². The square root goes the other way.'), ('18', 'Check: 18 × 18 is much more than 81.')],
   'What number times itself makes 81?', sb(1, 'Square roots and cube roots')),
 q('The hypotenuse', 'Which side of a right triangle is the hypotenuse?', 'The side across from the right angle', [('The shortest side', 'The hypotenuse is the LONGEST side.'), ('The side on the bottom', 'Any side can be on the bottom. Look for the side across from the square corner.'), ('A side that touches the right angle', 'Those two sides are the legs.')],
   'Find the square corner. Look across from it.', sb(5, 'Legs, hypotenuse and a² + b² = c²')),
 q('Estimating square roots', '√50 is between which two whole numbers?', '7 and 8', [('6 and 7', '7 × 7 = 49, which is still less than 50. Go one higher.'), ('25 and 26', 'That is half of 50. Think of a number times itself.'), ('49 and 64', 'Those are the perfect squares. Their square roots are 7 and 8.')],
   'Which perfect squares are just below and just above 50?', sb(1, 'Estimate roots and order numbers')),
 q('Distance on a grid', 'How far is it from (2, 3) to (2, 9)?', '6', [('12', 'That adds 3 + 9. Subtract to find the distance.'), ('9', 'That is the y value of one point. Find the difference: 9 − 3.'), ('0', 'The x values match, but the y values are different. Find 9 − 3.')],
   'The x values match, so subtract the y values.', sb(5, 'Distance on the coordinate plane')),
]
# ── Unit 6 ──
assert 2 * 4 + 3 == 11 and all(5 * x == y for x, y in [(1, 5), (2, 10), (3, 15), (4, 20)]) and F(12, 4) == 3 and 6 - (-2) == 8
U[6] = [
 q('Evaluating expressions', 'Find the value of 2x + 3 when x = 4.', '11', [('27', '2x means 2 times x, not 2 next to 4. 2 × 4 = 8.'), ('9', '2x means 2 TIMES x: 2 × 4, not 2 + 4.'), ('14', 'Multiply first, then add: 2 × 4 + 3.')],
   'Put 4 in for x. 2x means 2 × x.', fl('expressions', 'Expressions')),
 q('Plotting points', 'Which point is 3 to the right of the origin and 2 down?', '(3, −2)', [('(−2, 3)', 'The x value (left/right) comes first.'), ('(3, 2)', 'Down means the y value is negative.'), ('(−3, 2)', 'Right is positive x. Down is negative y.')],
   'Write (left/right, up/down). Right is +, down is −.', sb(5, 'Distance on the coordinate plane')),
 q('Finding a rule', 'x: 1, 2, 3, 4 and y: 5, 10, 15, 20. Which rule fits every pair?', 'y = 5x', [('y = x + 4', 'That works for x = 1 only. Check every pair: 2 + 4 is not 10.'), ('y = x + 5', 'Check x = 1: 1 + 5 = 6, not 5.'), ('y = 20x', 'Check x = 1: 20 × 1 = 20, not 5.')],
   'Test the rule on EVERY pair in the table.', sb(6, 'y = mx + b from a table or graph')),
 q('Unit rate', '4 notebooks cost $12. How much is one notebook?', '$3', [('$48', 'That multiplies. Split $12 into 4 equal parts.'), ('$8', 'That subtracts. Divide $12 by 4.'), ('$0.33', 'That is 4 ÷ 12. Divide the cost by the number of notebooks.')],
   'Divide the total cost by the number of notebooks.', fl('ratios', 'Ratios')),
 q('Subtracting a negative', 'What is 6 − (−2)?', '8', [('4', 'Subtracting a negative is the same as adding.'), ('−8', 'Subtracting a negative makes the number bigger: 6 + 2.'), ('−4', 'Change − (−2) to + 2.')],
   'Subtracting a negative is the same as adding a positive.', fl('integers', 'Integers')),
]
# ── Unit 7 ──
assert F(2 + 4 + 9, 3) == 5 and F(12, 40) == F(30, 100) and 30 - 18 == 12
U[7] = [
 q('Finding the mean', 'What is the mean of 2, 4 and 9?', '5', [('15', 'That is the total. Divide it by how many numbers there are (3).'), ('4', '4 is the middle number (the median). The mean is total ÷ 3.'), ('3', 'That is how many numbers there are. Add them, then divide by 3.')],
   'Add the numbers, then divide by how many numbers there are.', fl('divide', 'Division')),
 q('Percent of a group', '12 out of 40 students walk to school. What percent is that?', '30%', [('12%', 'Percent means out of 100. 12 out of 40 is not 12 out of 100.'), ('40%', 'That is the total. Find 12 ÷ 40.'), ('3.3%', 'That is 40 ÷ 12. Divide the part by the whole: 12 ÷ 40.')],
   'Divide the part by the whole, then change to a percent.', fl('ratios', 'Ratios')),
 q('Reading a table', 'A class has 30 students. 18 play a sport. How many do not play a sport?', '12', [('48', 'That adds. The 18 are part of the 30, so subtract.'), ('18', 'That is how many DO play a sport.'), ('30', 'That is the whole class. Take away the 18 who play.')],
   'The students who play and the students who do not make the whole class.', fl('add-subtract', 'Adding & subtracting')),
 q('Ratios', 'A shelter has 3 cats and 5 dogs. What is the ratio of cats to ALL the pets?', '3 to 8', [('3 to 5', 'That is cats to dogs. All the pets = 3 + 5.'), ('5 to 8', 'That is dogs to all pets. The question asks about cats.'), ('8 to 3', 'The order matters: cats first, then all pets.')],
   'All the pets = cats + dogs.', fl('ratios', 'Ratios')),
 q('Reading a point', 'On a graph of (hours studied, test score), what does the point (4, 70) mean?', 'Studied 4 hours, scored 70', [('Studied 70 hours, scored 4', 'The first number goes with the first label: hours.'), ('Scored 74', 'The two numbers are separate facts. Do not add them.'), ('4 students scored 70', 'The 4 is hours studied, not a number of students.')],
   'The order in the label (hours, score) matches the order in the point.', sb(7, 'Scatter plots and correlation')),
]
# ── Unit 8 ──
assert (2 + 4, 1) == (6, 1) and (3, -4) == (3, -1 * 4) and 5 * 3 == 15 and (4 * 2, -2 * 2) == (8, -4)
U[8] = [
 q('Quadrants', 'Which quadrant is (−3, 5) in?', 'Quadrant II', [('Quadrant I', 'In Quadrant I, both numbers are positive. Here x is negative.'), ('Quadrant III', 'In Quadrant III, both numbers are negative. Here y is positive.'), ('Quadrant IV', 'Quadrant IV has positive x and negative y.')],
   'Left (x negative) and up (y positive).', sb(8, 'Translations (slides)')),
 q('Moving a point', 'Move the point (2, 1) right 4 units. Where does it land?', '(6, 1)', [('(2, 5)', 'That moves it UP 4. Right changes the x value.'), ('(−2, 1)', 'That moves it LEFT 4. Right means add to x.'), ('(6, 5)', 'Only x changes when you move right.')],
   'Right and left change the x value. Up and down change y.', sb(8, 'Translations (slides)')),
 q('Reflecting over an axis', 'Reflect (3, 4) over the x-axis. What is the new point?', '(3, −4)', [('(−3, 4)', 'That flips over the y-axis. Over the x-axis, the y value changes sign.'), ('(−3, −4)', 'Only one number changes sign.'), ('(4, 3)', 'Reflecting does not swap the numbers.')],
   'Flipping over the x-axis (the horizontal line) changes up into down.', sb(8, 'Reflections (flips)')),
 q('Scale factor', 'A side is 5 cm long. It grows by a scale factor of 3. How long is it now?', '15 cm', [('8 cm', 'That adds 3. A scale factor multiplies.'), ('53 cm', 'That writes the numbers side by side. Multiply 5 × 3.'), ('1.67 cm', 'That divides. A scale factor of 3 makes it bigger.')],
   'Multiply the length by the scale factor.', sb(8, 'Dilations, congruent and similar')),
 q('Multiplying coordinates', 'Multiply both numbers in (4, −2) by 2.', '(8, −4)', [('(8, −2)', 'Multiply BOTH numbers by 2.'), ('(6, 0)', 'That adds 2. Multiply each number by 2.'), ('(2, −1)', 'That divides by 2. Multiply instead.')],
   'Multiply the x value by 2, then the y value by 2.', sb(8, 'Dilations, congruent and similar')),
]
# ── Unit 9 ──
assert 10 / 2 == 5 and 4 ** 3 == 64 and 3 * 4 * 5 == 60 and 2 * (12 + 15 + 20) == 94
assert F('3.14') * 9 == F('28.26') and F('3.14') * 6 == F('18.84') and F('3.14') * 36 == F('113.04') and round(37.68, 1) == 37.7
U[9] = [
 q('Radius and diameter', 'A circle has a diameter of 10 cm. What is its radius?', '5 cm', [('20 cm', 'That doubles it. The radius is HALF the diameter.'), ('10 cm', 'That is the diameter. The radius is half of it.'), ('31.4 cm', 'That is the distance around (circumference).')],
   'The radius is half of the diameter.', fl('divide', 'Division')),
 q('Cubing a number', 'What is 4³?', '64', [('12', 'That is 4 × 3. 4³ means 4 × 4 × 4.'), ('16', 'That is 4². 4³ has three 4s multiplied.'), ('7', 'That is 4 + 3. An exponent means repeated multiplication.')],
   '4³ means 4 × 4 × 4.', sb(2, 'What an exponent means')),
 q('Volume of a box', 'A box is 3 cm by 4 cm by 5 cm. What is its volume?', '60 cm³', [('12 cm³', 'That adds the sides. Volume multiplies: 3 × 4 × 5.'), ('94 cm³', 'That is the surface area (the outside). Volume = length × width × height.'), ('20 cm³', 'That is only 4 × 5. Multiply all three sides.')],
   'Volume = length × width × height.', fl('multiply', 'Multiplication')),
 q('Area of a circle', 'Use 3.14 for π. What is the area of a circle with radius 3 cm?', '28.26 cm²', [('18.84 cm²', 'That is 2 × π × r, the distance around. Area = π × r × r.'), ('9.42 cm²', 'That is π × 3. Square the radius first: π × 3 × 3.'), ('113.04 cm²', 'That uses the diameter (6). Use the radius: 3.')],
   'Area = π × r × r. Square the radius first.', fl('decimals', 'Decimals')),
 q('Rounding', 'Round 37.68 to the nearest tenth.', '37.7', [('37.6', 'Look at the hundredths digit: 8 is 5 or more, so round up.'), ('38', 'That rounds to the nearest whole number. Keep one place after the point.'), ('37.68', 'That is not rounded. Keep only the tenths place.')],
   'Look at the digit after the tenths place. 5 or more rounds up.', fl('decimals', 'Decimals')),
]

# links must exist
for n, qs in U.items():
    assert len(qs) == 5, n
    for x in qs: assert os.path.exists(os.path.join(G8, x['review']['h'])), x['review']['h']
    for x in qs:
        for w in x['wrong']: assert len(w['why']) <= 120 and w['why'].endswith('.'), w

PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Unit {n} Quick Check — Mr. Allen's Math Class</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,600&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../site.css">
<link rel="stylesheet" href="screener/screener.css?v={V}">
<!-- Built by _build/screener/make.py (do not edit by hand). -->
<script src="../brand.js"></script>
</head>
<body>
<script src="../site-config.js"></script>
<script src="../site-bar.js"></script>
<div class="page-wrap">
<a href="unit{n}.html" class="back-link">← Back to Unit {n}</a>
<div id="scr" class="scr"></div>
<div id="ss-mount"></div>
</div>
<script>window.SCREENER = {data};</script>
<script src="../tracker-config.js"></script>
<script src="../score-send.js?v=20261117a"></script>
<script> ScoreSend.setup({{ kind:'practice', unit:'{n}', page:'Unit {n} · Quick Check', mount:'#ss-mount', band:3, noun:'question' }}); </script>
<script src="screener/screener.js?v={V}"></script>
</body>
</html>
"""
for n, qs in U.items():
    data = json.dumps({'unit': n, 'title': TITLE[n], 'qs': qs}, ensure_ascii=False)
    open(os.path.join(G8, f'unit{n}-screener.html'), 'w', encoding='utf-8').write(PAGE.format(n=n, V=V, data=data))
print('ok', {n: len(q) for n, q in U.items()})
