from lib import Q, F, Fr
from figs import numline, bars, table, RUST, OLV, BLU, AMB

UNIT = dict(
    n=1, title='Operations with Rational Numbers', short='Rational Numbers', icon='➕',
    tag='Add, subtract, multiply and divide integers, fractions and decimals. Signs matter!',
    desc='Add, subtract, multiply and divide positive and negative numbers, and change fractions to decimals.',
    stds=[('NC.7.NS.1', 'Add and subtract rational numbers; show them on a number line.'),
          ('NC.7.NS.2', 'Multiply and divide rational numbers; change a fraction to a decimal with long division.'),
          ('NC.7.NS.3', 'Solve real-world problems with the four operations on rational numbers.')],
    ican=['I can add and subtract integers and other rational numbers, and show it on a number line',
          'I can find the distance between two numbers on a number line',
          'I can multiply and divide positive and negative numbers',
          'I can change a fraction to a decimal and tell if it ends or repeats',
          'I can solve real-world problems with positive and negative numbers'],
    vocab=[('Integer', 'a whole number or its opposite: … −2, −1, 0, 1, 2 …'), ('Rational number', 'a number that can be written as a fraction of two integers'),
           ('Opposites', 'two numbers the same distance from 0 on different sides, like 5 and −5'), ('Absolute value', 'the distance from a number to 0; |−7| = 7'),
           ('Additive inverse', 'the opposite of a number; a number plus its additive inverse is 0'), ('Terminating decimal', 'a decimal that ends, like 0.375'),
           ('Repeating decimal', 'a decimal with digits that repeat forever, like 0.333…')],
)

T = []
T.append(dict(
    title='Adding Integers and Rational Numbers', nav='Adding', std='NC.7.NS.1',
    words=[('Opposites', 'two numbers the same distance from 0 on different sides, like 4 and −4.'),
           ('Absolute value', 'how far a number is from 0. |−6| = 6 and |6| = 6.'),
           ('Additive inverse', 'a number plus its opposite makes 0. 8 + (−8) = 0.')],
    big='To add on a number line, start at the first number. Move RIGHT to add a positive. Move LEFT to add a negative.',
    fig=numline(-6, 6, pts=[(3, '', RUST), (-2, 'end', OLV)], jumps=[(3, -2, '+ (−5)', RUST)], title='Start at 3, move 5 left, end at −2'),
    figcap='3 + (−5): start at 3, move 5 to the left. You land on −2.',
    fill=['Same signs: <b>add</b> the absolute values and keep the sign. −4 + (−3) = {{−7}}',
          'Different signs: <b>subtract</b> the absolute values. Keep the sign of the number that is farther from 0. −9 + 4 = {{−5}}',
          'A number plus its opposite is always {{0}}.'],
    examples=[dict(title='Example 1: −2.5 + (−1.5)', steps=['Same signs (both negative).', 'Add the absolute values: 2.5 + 1.5 = 4', 'Keep the sign: <b>−4</b>']),
              dict(title='Example 2: ' + F('3', '4') + ' + (−2)', steps=['Different signs. Write 2 as ' + F('8', '4') + '.', 'Subtract the absolute values: ' + F('8', '4') + ' − ' + F('3', '4') + ' = ' + F('5', '4'), '−2 is farther from 0, so the answer is negative: <b>−' + F('5', '4') + ' = −1' + F('1', '4') + '</b>'])],
    warn='Do not just look at the first sign. In −9 + 4, the answer takes the sign of −9 because 9 is bigger than 4.',
    np=[Q(1, 'Find the sum: −8 + (−6)', ans=-14, hint='Same signs: add 8 + 6 and keep the negative sign.', sol='Same signs. 8 + 6 = 14. Keep the sign: −14.'),
        Q(2, 'Find the sum: −3.7 + 5.2', ans=1.5, hint='Different signs: subtract 5.2 − 3.7. Which number is farther from 0?', sol='5.2 − 3.7 = 1.5. 5.2 is farther from 0 and positive, so +1.5.'),
        Q(3, 'The temperature was −12°F. It rose 15°F, then fell 7°F. What is the temperature now (in °F)?', ans=-4, hint='Write it as −12 + 15 + (−7). Add from left to right.', sol='−12 + 15 = 3. Then 3 + (−7) = −4. It is −4°F.')]))
T.append(dict(
    title='Subtracting Rational Numbers', nav='Subtracting', std='NC.7.NS.1',
    words=[('Difference', 'the answer to a subtraction problem.'),
           ('Distance between two numbers', 'the absolute value of their difference: |a − b|.')],
    big='Subtracting is the same as adding the opposite. <span class="m">a − b = a + (−b)</span>. Keep, change, change: keep the first number, change − to +, change the second number to its opposite.',
    fig=numline(-8, 4, pts=[(-5, 'start', RUST), (2, 'end', OLV)], jumps=[(-5, 2, '7 units', BLU)], title='Distance from −5 to 2 is 7'),
    figcap='The distance between −5 and 2 is |2 − (−5)| = |7| = 7 units.',
    fill=['6 − (−4) = 6 + {{4}} = {{10}}',
          '−3 − 5 = −3 + {{(−5)}} = {{−8}}',
          'The distance between −5 and 2 is |2 − (−5)| = {{7}}'],
    examples=[dict(title='Example: −7 − (−10)', steps=['Keep −7. Change − to +. Change −10 to +10.', '−7 + 10', 'Different signs: 10 − 7 = 3. 10 is farther from 0, so the answer is positive: <b>3</b>']),
              dict(title='Example: How far apart are −4.5 and 3?', steps=['Distance = |3 − (−4.5)|', '= |3 + 4.5| = |7.5|', '= <b>7.5 units</b>'])],
    warn='Subtracting a negative makes the number BIGGER. 5 − (−2) = 7, not 3.',
    np=[Q(1, 'Find the difference: 4 − 11', ans=-7, hint='Add the opposite: 4 + (−11).', sol='4 + (−11) = −7.'),
        Q(2, 'Find the difference: −2.5 − (−6)', ans=3.5, hint='Keep, change, change: −2.5 + 6.', sol='−2.5 + 6 = 3.5.'),
        Q(3, 'A diver is at −35 ft. A bird flies 20 ft above the water. How many feet apart are they?', ans=55, hint='Distance = |20 − (−35)|.', sol='|20 − (−35)| = |20 + 35| = 55 feet.')]))
T.append(dict(
    title='Multiplying and Dividing Rational Numbers', nav='Multiply & Divide', std='NC.7.NS.2',
    words=[('Product', 'the answer to a multiplication problem.'), ('Quotient', 'the answer to a division problem.'),
           ('Undefined', 'has no answer. Dividing by 0 is undefined.')],
    big='Multiply or divide the absolute values. Then pick the sign: <b>same signs → positive</b>, <b>different signs → negative</b>.',
    table=(['Signs', 'Product or quotient', 'Example'], [['+ and +', '{{positive}}', '6 × 3 = 18'], ['− and −', '{{positive}}', '−6 × (−3) = 18'], ['+ and −', '{{negative}}', '6 × (−3) = −18'], ['− and +', '{{negative}}', '−18 ÷ 3 = −6']]),
    fill=['−' + F('2', '3') + ' = ' + F('−2', '3') + ' = ' + F('2', '−3') + '. A negative fraction can show its sign in {{3}} places.',
          'An even number of negative factors gives a {{positive}} product.'],
    examples=[dict(title='Example: (−' + F('3', '4') + ') × ' + F('8', '9'), steps=['Different signs → the answer is negative.', F('3', '4') + ' × ' + F('8', '9') + ' = ' + F('24', '36'), 'Simplify: <b>−' + F('2', '3') + '</b>']),
              dict(title='Example: −4.8 ÷ (−0.6)', steps=['Same signs → the answer is positive.', '4.8 ÷ 0.6 = 48 ÷ 6 = 8', '<b>8</b>'])],
    warn='Dividing by 0 is undefined: 7 ÷ 0 has no answer. But 0 ÷ 7 = 0.',
    np=[Q(1, 'Find the product: −7 × 6', ans=-42, hint='Different signs give a negative product.', sol='7 × 6 = 42. Different signs → −42.'),
        Q(2, 'Find the quotient: −' + F('5', '6') + ' ÷ (−' + F('1', '3') + ')', ans=Fr(5, 2), show='5/2', hint='Multiply by the reciprocal: −5/6 × (−3/1). Same signs → positive.', sol='−5/6 × (−3) = 15/6 = 5/2 (or 2.5).'),
        Q(3, 'Is (−2) × (−3) × (−1) × (−4) × (−5) positive or negative?', ch=['The product is negative.', 'The product is positive.'], why={'The product is positive.': 'Count the negative factors. There are 5. Is 5 an even or an odd count?'}, hint='Count the negative factors. Even → positive. Odd → negative.', sol='There are 5 negative factors (odd), so the product is negative: −120.')]))
T.append(dict(
    title='Fractions to Decimals', nav='Fractions → Decimals', std='NC.7.NS.2',
    words=[('Terminating decimal', 'a decimal that ends, like 0.25.'), ('Repeating decimal', 'a decimal with a digit or group of digits that repeats forever, like 0.666…'),
           ('Bar notation', 'a bar over the digits that repeat: 0.6̅ = 0.666…')],
    big='A fraction means division: ' + F('a', 'b') + ' = a ÷ b. Use long division. If you get a remainder of 0, the decimal <b>terminates</b>. If a remainder repeats, the decimal <b>repeats</b>.',
    fill=[F('3', '8') + ' = 3 ÷ 8 = {{0.375}} (terminates)', F('2', '3') + ' = 2 ÷ 3 = {{0.6̅}} (repeats)', F('5', '11') + ' = {{0.4̅5̅}} (the block 45 repeats)'],
    examples=[dict(title='Example: write ' + F('7', '12') + ' as a decimal', steps=['7 ÷ 12. 12 does not go into 7, so write 7.000…', '70 ÷ 12 = 5 R 10. 100 ÷ 12 = 8 R 4. 40 ÷ 12 = 3 R 4.', 'The remainder 4 repeats, so the 3 repeats: <b>0.583̅</b>'])],
    warn='The bar goes only over the digits that repeat. 0.583̅ means 0.58333…, not 0.583583…',
    np=[Q(1, 'Write ' + F('9', '20') + ' as a decimal.', ans=0.45, hint='Divide 9 by 20. Or make the bottom 100: 9/20 = 45/100.', sol='9/20 = 45/100 = 0.45'),
        Q(2, 'Which is the decimal for ' + F('4', '9') + '?', ch=['0.4̅', '0.49', '0.4', '2.25'], why={'0.49': 'That just puts the 4 and 9 side by side. Divide 4 by 9.', '0.4': 'The 4 does not stop. 4 ÷ 9 = 0.444… It repeats.', '2.25': 'That is 9 ÷ 4. The top number goes inside the division: 4 ÷ 9.'}, hint='4 ÷ 9. Watch the remainders.', sol='4 ÷ 9 = 0.444… = 0.4̅'),
        Q(3, 'Which fraction does NOT make a terminating decimal?', ch=[F('5', '6'), F('3', '8'), F('7', '20'), F('9', '25')], why={F('3', '8'): '3 ÷ 8 = 0.375. It ends.', F('7', '20'): '7 ÷ 20 = 0.35. It ends.', F('9', '25'): '9 ÷ 25 = 0.36. It ends.'}, hint='Divide each one. Which one never gets a remainder of 0?', sol='5 ÷ 6 = 0.8333… The 3 repeats forever.')]))
T.append(dict(
    title='Solving Problems with Rational Numbers', nav='Word Problems', std='NC.7.NS.3',
    words=[('Deposit', 'money put in (positive).'), ('Withdrawal', 'money taken out (negative).'), ('Elevation', 'height above (+) or below (−) sea level.')],
    big='Decide what each number means. Gains, deposits and going up are positive. Losses, withdrawals and going down are negative. Then add, subtract, multiply or divide.',
    fill=['A loss of $12 each day for 5 days: 5 × (−12) = {{−60}} dollars', 'Going from 40 ft below sea level to 15 ft above: 15 − (−40) = {{55}} ft'],
    examples=[dict(title='Example: A stock lost $1.25 each day for 4 days. Then it gained $3.50. What is the total change?', steps=['Loss for 4 days: 4 × (−1.25) = −5', 'Then the gain: −5 + 3.50 = −1.50', 'Total change: <b>−$1.50</b> (a $1.50 loss)'])],
    warn='Read for the question. "How far apart" means distance (always positive). "What is the change" can be negative.',
    np=[Q(1, 'Ava has $45. She spends $18.75, then earns $12. How many dollars does she have now?', ans=38.25, hint='45 − 18.75 + 12', sol='45 − 18.75 = 26.25. 26.25 + 12 = 38.25. She has $38.25.'),
        Q(2, 'A submarine is at −240 ft. It rises ' + F('1', '4') + ' of that distance. What is its new elevation (in ft)?', ans=-180, hint='It rises 1/4 × 240 = 60 ft. Rising is +.', sol='1/4 of 240 = 60. −240 + 60 = −180 ft.'),
        Q(3, 'A cave is 132 ft deep (−132 ft). A climber goes down in 4 equal steps to the bottom. Mia says each step is +33 ft. What is her mistake?',
          ch=['Going down is negative, so each step is −33 ft.', 'She should multiply: 132 × 4 = 528 ft.', 'She should add: −132 + 4 = −128 ft.', 'Nothing. +33 ft is right.'],
          why={'She should multiply: 132 × 4 = 528 ft.': '4 equal steps means split 132 into 4 parts. That is division.', 'She should add: −132 + 4 = −128 ft.': 'The 4 is the number of steps, not a distance.', 'Nothing. +33 ft is right.': 'The climber goes DOWN. Down is negative.'},
          hint='Is going down positive or negative?', sol='−132 ÷ 4 = −33. Each step is −33 ft (33 ft down).')]))

PART2 = [
    ('A. Add and Subtract', 'NC.7.NS.1', [
        Q(1, 'Find: −15 + 9', ans=-6, hint='Different signs: 15 − 9. Which is farther from 0?'),
        Q(2, 'Find: −' + F('2', '5') + ' − ' + F('3', '10'), ans=Fr(-7, 10), show='−7/10', hint='Make the bottoms match: −4/10 − 3/10.', sol='−4/10 − 3/10 = −7/10 (or −0.7).'),
        Q(3, 'Which expression has the same value as 8 − (−3)?', ch=['8 + 3', '8 − 3', '−8 + 3', '−8 − 3'], why={'8 − 3': 'Subtracting −3 is the same as ADDING 3.', '−8 + 3': 'Keep the first number the same: 8, not −8.', '−8 − 3': 'Keep 8 the same, then add the opposite of −3.'}, hint='Keep, change, change.', sol='8 − (−3) = 8 + 3 = 11.')]),
    ('B. Multiply and Divide', 'NC.7.NS.2', [
        Q(1, 'Find: −56 ÷ 8', ans=-7, hint='Different signs → negative.'),
        Q(2, 'Find: (−1.5)(−4)(−2)', ans=-12, hint='Three negative factors. Odd → negative.', sol='1.5 × 4 × 2 = 12. Three negatives → −12.'),
        Q(3, 'Write ' + F('5', '12') + ' as a decimal.', ch=['0.416̅', '0.4̅1̅6̅', '0.512', '2.4'], why={'0.4̅1̅6̅': 'Only the 6 repeats. 5 ÷ 12 = 0.41666…', '0.512': 'Do not write the digits side by side. Divide 5 by 12.', '2.4': 'That is 12 ÷ 5. Divide the top by the bottom.'}, hint='Divide 5 by 12 and watch for a remainder that repeats.', sol='5 ÷ 12 = 0.41666… = 0.416̅')]),
    ('C. Real-World Problems', 'NC.7.NS.3', [
        Q(1, 'The low was −5°C and the high was 9°C. How many degrees warmer was the high?', ans=14, hint='9 − (−5)'),
        Q(2, 'A hiker starts at 120 m. She goes down 15.5 m each hour for 3 hours. What is her elevation (in m)?', ans=73.5, hint='120 + 3 × (−15.5)', sol='3 × (−15.5) = −46.5. 120 − 46.5 = 73.5 m.'),
        Q(3, 'Leo owes his brother $24. He pays it back in equal amounts over 6 weeks. Which expression shows the change in his debt each week?', ch=['24 ÷ 6 = 4 (the debt goes down $4)', '−24 × 6 = −144', '24 − 6 = 18', '6 ÷ 24 = 0.25'], why={'−24 × 6 = −144': 'Equal parts over 6 weeks means divide, not multiply.', '24 − 6 = 18': 'Subtracting 6 does not split the debt into 6 equal parts.', '6 ÷ 24 = 0.25': 'The total goes first: 24 ÷ 6.'}, hint='Split 24 into 6 equal parts.', sol='24 ÷ 6 = 4. The debt goes down $4 each week.')]),
]

PRACTICE = dict(title='Unit 1 Practice — Operations with Rational Numbers', sub='Add · Subtract · Multiply · Divide · Fractions to decimals · Word problems', secs=[
    ('A. Adding Rational Numbers', 'NC.7.NS.1', 'Same signs: add and keep the sign. Different signs: subtract and keep the sign of the number farther from 0.', [
        Q(1, 'Find: −12 + (−9)', ans=-21, hint='Same signs: add 12 + 9, keep the negative.'),
        Q(1, 'Find: 7 + (−13)', ans=-6, hint='Different signs: 13 − 7. 13 is farther from 0.'),
        Q(2, 'Find: −4.6 + 2.15', ans=-2.45, hint='4.6 − 2.15. Which is farther from 0?'),
        Q(2, 'Find: ' + F('1', '2') + ' + (−' + F('5', '6') + ')', ans=Fr(-1, 3), show='−1/3', hint='Common denominator: 3/6 + (−5/6).'),
        Q(3, 'Which situation is shown by −6 + 6 = 0?', ch=['You earn $6, then spend $6.', 'You earn $6, then earn $6 more.', 'You spend $6, then spend $6 more.', 'You owe $6 and owe $6 more.'], why={'You earn $6, then earn $6 more.': 'That is 6 + 6 = 12.', 'You spend $6, then spend $6 more.': 'That is −6 + (−6) = −12.', 'You owe $6 and owe $6 more.': 'Owing more makes it more negative: −12.'}, hint='Opposites add to 0.')]),
    ('B. Subtracting Rational Numbers', 'NC.7.NS.1', 'Add the opposite: a − b = a + (−b). Distance between a and b = |a − b|.', [
        Q(1, 'Find: −8 − 5', ans=-13, hint='−8 + (−5)'),
        Q(1, 'Find: 3 − (−9)', ans=12, hint='3 + 9'),
        Q(2, 'Find: −1.2 − (−3.7)', ans=2.5, hint='−1.2 + 3.7'),
        Q(2, 'What is the distance between −' + F('3', '4') + ' and 2' + F('1', '4') + ' on a number line?', ans=3, hint='|2 1/4 − (−3/4)| = 2 1/4 + 3/4'),
        Q(3, 'Find the mistake: Jay wrote −4 − (−10) = −14. What did he do wrong?', ch=['He added −10 instead of adding its opposite. The answer is 6.', 'He should have multiplied. The answer is 40.', 'Nothing. −14 is right.', 'The answer should be −6.'], why={'He should have multiplied. The answer is 40.': 'This is subtraction, not multiplication.', 'Nothing. −14 is right.': 'Subtracting −10 means adding +10.', 'The answer should be −6.': 'Check: −4 + 10. 10 is farther from 0 and positive.'}, hint='Keep, change, change: −4 + 10.')]),
    ('C. Multiplying and Dividing', 'NC.7.NS.2', 'Same signs → positive. Different signs → negative. To divide by a fraction, multiply by its reciprocal.', [
        Q(1, 'Find: −9 × (−8)', ans=72, hint='Same signs → positive.'),
        Q(1, 'Find: 63 ÷ (−7)', ans=-9, hint='Different signs → negative.'),
        Q(2, 'Find: −' + F('4', '5') + ' × ' + F('15', '16'), ans=Fr(-3, 4), show='−3/4', hint='Simplify first: 4/16 = 1/4 and 15/5 = 3.'),
        Q(2, 'Find: −2.4 ÷ 0.3', ans=-8, hint='24 ÷ 3. Different signs → negative.'),
        Q(3, 'Which is equal to −' + F('6', '7') + '?', ch=[F('−6', '7'), F('−6', '−7'), F('6', '7'), '−(' + F('−6', '7') + ')'], why={F('−6', '−7'): 'Two negatives make a positive: (−6)/(−7) = 6/7.', F('6', '7'): 'This is positive.', '−(' + F('−6', '7') + ')': 'The opposite of a negative is positive.'}, hint='Count the negative signs. One negative sign → negative.')]),
    ('D. Fractions to Decimals', 'NC.7.NS.2', 'Divide the top by the bottom. A remainder of 0 → the decimal ends. A remainder that repeats → the decimal repeats.', [
        Q(1, 'Write ' + F('3', '5') + ' as a decimal.', ans=0.6, hint='3 ÷ 5'),
        Q(2, 'Write ' + F('11', '8') + ' as a decimal.', ans=1.375, hint='11 ÷ 8'),
        Q(2, 'Which is the decimal for ' + F('1', '6') + '?', ch=['0.16̅', '0.1̅6̅', '0.16', '6.0'], why={'0.1̅6̅': 'Only the 6 repeats: 0.1666…', '0.16': 'The 6 keeps going. It repeats.', '6.0': 'That is 6 ÷ 1. Divide 1 by 6.'}, hint='1 ÷ 6 = 0.1666…'),
        Q(3, 'Which list has only repeating decimals?', ch=[F('1', '3') + ', ' + F('2', '9') + ', ' + F('5', '6'), F('1', '4') + ', ' + F('2', '9') + ', ' + F('5', '6'), F('1', '3') + ', ' + F('3', '5') + ', ' + F('5', '6'), F('1', '8') + ', ' + F('1', '2') + ', ' + F('7', '10')], why={F('1', '4') + ', ' + F('2', '9') + ', ' + F('5', '6'): '1/4 = 0.25. It ends.', F('1', '3') + ', ' + F('3', '5') + ', ' + F('5', '6'): '3/5 = 0.6. It ends.', F('1', '8') + ', ' + F('1', '2') + ', ' + F('7', '10'): 'All three of these end.'}, hint='Divide each fraction. Does it end or repeat?')]),
    ('E. Word Problems', 'NC.7.NS.3', 'Decide which numbers are negative (losses, going down). Then pick the operation.', [
        Q(1, 'A football team loses 7 yards on each of 3 plays. What is the total change in yards?', ans=-21, hint='3 × (−7)'),
        Q(2, 'A bank account has −$32.50. Then $60 is deposited. What is the balance in dollars?', ans=27.5, hint='−32.50 + 60'),
        Q(2, 'The temperature dropped 18°F over 4 hours at the same rate. What was the change each hour (in °F)?', ans=-4.5, hint='−18 ÷ 4'),
        Q(3, 'A recipe needs ' + F('3', '4') + ' cup of flour per batch. Kim has 4' + F('1', '2') + ' cups. How many full batches can she make?', ans=6, hint='4 1/2 ÷ 3/4 = 9/2 × 4/3'),
        Q(3, 'Point A is at −6.5. Point B is 9 units to the right of A. Where is B?', ans=2.5, hint='Right means add: −6.5 + 9.')]),
])
