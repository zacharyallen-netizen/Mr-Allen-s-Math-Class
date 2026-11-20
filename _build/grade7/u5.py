from lib import Q, F, Fr
from figs import bars, AMB2, SAND

P = lambda x: Fr(x) / 100
assert P(30) * 80 == 24 and Fr(18) / P(40) == 45 and Fr(12, 48) * 100 == 25
assert Fr(9) / P(15) == 60 and P(35) * 60 == 21 and 120 * P(75) == 90
assert (Fr(56) - 40) / 40 * 100 == 40 and Fr(68) * (1 - P(25)) == 51 and (Fr(50) - 35) / 50 * 100 == 30
assert Fr(80) * (1 + P(15)) == 92 and Fr(24) * P(18) == Fr(432, 100) and Fr(36) * (1 + P(15)) * 1 == Fr(414, 10)
assert Fr(45) * (1 + P(6)) == Fr(477, 10) and Fr(1200) * P(5) == 60 and Fr(80) * Fr(1 - P(20)) * (1 + P(5)) == Fr(672, 10)
assert Fr(500) * P(4) * 3 == 60 and Fr(2000) * P(3) * 5 + 2000 == 2300 and Fr(90) / (Fr(1500) * 2) * 100 == 3
assert abs(Fr(45) - 50) / 50 * 100 == 10 and abs(Fr(132) - 120) / 120 * 100 == 10 and abs(Fr(19) - 20) / 20 * 100 == 5
assert P(60) * 45 == 27 and Fr(14) / P(35) == 40 and (Fr(30) - 24) / 24 * 100 == 25
assert Fr(60) * P(8) == Fr(48, 10) and Fr(250) * P(4) * 2 == 20 and abs(Fr(9) - 12) / 12 * 100 == 25
assert Fr(40) * (1 - P(30)) == 28 and Fr(28) * (1 + P(5)) == Fr(294, 10) and Fr(85) * (1 + P(20)) == 102 and Fr(3000) * P(6) * Fr(1, 2) == 90
assert (Fr(1500) - 1200) / 1200 * 100 == 25 and Fr(55) * P(20) == 11 and Fr(48, 64) * 100 == 75 and abs(Fr(38) - 40) / 40 * 100 == 5

UNIT = dict(
    n=5, title='Percents', short='Percents', icon='%',
    tag='Solve percent problems: tax, tips, discounts, markups, percent change, simple interest and percent error.',
    desc='Find a percent of a number, the whole, or the percent; solve multi-step percent problems with tax, tips, discounts, markups, commission, interest and percent error.',
    stds=[('NC.7.RP.3', 'Use proportional relationships to solve multi-step ratio and percent problems: interest, tax, markups and markdowns, gratuities and commissions, fees, percent increase and decrease, percent error.'),
          ('NC.7.EE.3', 'Solve multi-step real-world problems with rational numbers; convert between forms and check that answers make sense.')],
    ican=['I can find a percent of a number, and find the whole or the percent when I know the other two',
          'I can find the percent increase or percent decrease',
          'I can find a total with tax, tip, fees, markups, discounts and commission',
          'I can find simple interest with I = Prt',
          'I can find the percent error of an estimate or a measurement'],
    vocab=[('Percent', 'per hundred; 35% = 35/100 = 0.35'), ('Part, percent, whole', 'part = percent × whole'),
           ('Tax', 'a percent of the price added to the cost'), ('Tip (gratuity)', 'a percent of the bill added for service'),
           ('Discount / markdown', 'a percent taken off the price'), ('Markup', 'a percent added to what the store paid'),
           ('Commission', 'a percent of sales that a salesperson earns'), ('Simple interest', 'I = Prt (principal × rate × time in years)'),
           ('Percent change', 'change ÷ original × 100'), ('Percent error', '|estimate − actual| ÷ actual × 100')],
)
T = []
T.append(dict(
    title='Part, Percent, Whole', nav='Percent Basics', std='NC.7.RP.3',
    words=[('Percent', 'out of 100. 30% = 30/100 = 0.30.'), ('Whole', 'the total amount (100%).'), ('Part', 'the piece that is a percent of the whole.')],
    big='<b>part = percent × whole</b>. Change the percent to a decimal. If you know the part and the percent, divide: whole = part ÷ percent. To find the percent, divide part ÷ whole.',
    fig=bars([('100%', [(10, '80', SAND)], 10), ('30%', [(3, '24', AMB2), (7, '', '#fff')], 10)], title='30 percent of 80 is 24'),
    figcap='30% of 80: 0.30 × 80 = 24.',
    table=(['Find', 'Example', 'Answer'], [['The part', '30% of 80', '{{24}}'], ['The whole', '18 is 40% of what?', '{{45}}'], ['The percent', '12 is what percent of 48?', '{{25}}%']]),
    examples=[dict(title='Example: 18 is 40% of what number?', steps=['18 = 0.40 × w', 'w = 18 ÷ 0.40', '<b>w = 45</b>. Check: 0.40 × 45 = 18 ✓'])],
    warn='Change the percent to a decimal before you multiply: 30% is 0.30, not 30.',
    np=[Q(1, 'What is 35% of 60?', ans=21, hint='0.35 × 60', sol='0.35 × 60 = 21.'),
        Q(2, '9 is 15% of what number?', ch=['60', '1.35', '135', '0.6'],
          why={'1.35': 'You found 15% of 9. Here 9 is the PART. Divide 9 by 0.15.', '135': 'You multiplied 9 × 15. Divide 9 by 0.15.', '0.6': 'You divided 9 by 15, not by 0.15.'},
          hint='part = percent × whole, so whole = 9 ÷ 0.15.', sol='9 ÷ 0.15 = 60. Check: 0.15 × 60 = 9.'),
        Q(3, 'A class has 120 students. 75% of them came to the game. How many did NOT come?', ans=30, hint='Find 75% of 120 first. Or: what percent did not come?', sol='100% − 75% = 25%. 0.25 × 120 = 30 students.')]))
T.append(dict(
    title='Percent Increase and Decrease', nav='Percent Change', std='NC.7.RP.3',
    words=[('Percent change', 'how much it changed compared with the ORIGINAL amount.')],
    big='<b>percent change = change ÷ original × 100</b>. If the amount went up, it is an increase. If it went down, it is a decrease. Always divide by the ORIGINAL (the starting) amount.',
    fill=['From 40 to 56: change = {{16}}, 16 ÷ 40 = {{0.4}} = {{40}}% increase', 'From 50 to 35: change = {{15}}, 15 ÷ 50 = {{30}}% decrease'],
    examples=[dict(title='Example: a $68 game is marked down 25%. What is the new price?', steps=['Way 1: 25% of 68 = 0.25 × 68 = 17. 68 − 17 = 51', 'Way 2: you pay 75%: 0.75 × 68 = 51', '<b>$51</b>'])],
    warn='Divide by the ORIGINAL amount, not the new amount. From 40 to 56 is a 40% increase, not 16 ÷ 56.',
    np=[Q(1, 'A price goes from $24 to $30. What is the percent increase?', ans=25, hint='Change = 6. Divide by the original, 24.', sol='6 ÷ 24 = 0.25 = 25%.'),
        Q(2, 'A $40 shirt is 30% off. What is the sale price?', ch=['$28', '$12', '$10', '$52'],
          why={'$12': 'That is the discount. Subtract it from $40.', '$10': 'You took off $30, not 30%.', '$52': 'A discount takes money OFF. You added.'},
          hint='You pay 70% of the price.', sol='0.70 × 40 = $28.'),
        Q(3, 'A town grew from 1,200 people to 1,500 people. Then it shrank back to 1,200. Which is true?', ch=['It went up 25%, then down 20%.', 'It went up 25%, then down 25%.', 'It went up 20%, then down 20%.', 'It went up 300%, then down 300%.'],
          why={'It went up 25%, then down 25%.': 'The decrease starts from 1,500, so divide 300 by 1,500.', 'It went up 20%, then down 20%.': 'The increase starts from 1,200, so divide 300 by 1,200.', 'It went up 300%, then down 300%.': '300 is the change in people, not the percent.'},
          hint='Each time, divide the change (300) by the starting number.', sol='Up: 300 ÷ 1,200 = 25%. Down: 300 ÷ 1,500 = 20%.')]))
T.append(dict(
    title='Tax, Tips, Fees, Markups and Commission', nav='Tax & Tips', std='NC.7.RP.3',
    words=[('Tax / tip / fee', 'a percent ADDED to the cost.'), ('Markup', 'a percent ADDED to what the store paid.'), ('Commission', 'a percent of sales that a worker EARNS.')],
    big='Find the percent of the amount, then add it (tax, tip, markup) or subtract it (discount). Shortcut: total with 6% tax = <b>1.06 × price</b>. With a 20% discount: <b>0.80 × price</b>.',
    fill=['$45 with 6% tax: 1.06 × 45 = {{47.70}}', 'An 18% tip on a $24 bill: 0.18 × 24 = {{4.32}}', 'A store pays $80 and marks it up 15%: 1.15 × 80 = {{92}}'],
    examples=[dict(title='Example: an $80 jacket is 20% off. Then 5% tax is added. What is the total?', steps=['Discount first: 0.80 × 80 = 64', 'Then tax: 1.05 × 64 = 67.20', '<b>$67.20</b>'])],
    warn='Take the discount off first, then find the tax on the SALE price. Do not just add and subtract the percents.',
    np=[Q(1, 'Ana sells $1,200 in shoes. She earns 5% commission. How much commission does she earn (in dollars)?', ans=60, hint='0.05 × 1200', sol='0.05 × 1,200 = $60.'),
        Q(2, 'A meal costs $36. You leave a 15% tip. What is the total?', ch=['$41.40', '$5.40', '$51', '$36.15'],
          why={'$5.40': 'That is the tip. Add it to the meal.', '$51': 'You added $15, not 15%.', '$36.15': 'You added 0.15 dollars. 15% of 36 is more than that.'},
          hint='Total = 1.15 × 36.', sol='0.15 × 36 = 5.40. 36 + 5.40 = $41.40.'),
        Q(3, 'A store buys a bike for $85 and marks it up 20%. Later the bike is 20% off. What is the sale price in dollars?', ans=Fr(816, 10), hint='First 1.20 × 85. Then 0.80 × that price.', sol='1.20 × 85 = 102. 0.80 × 102 = $81.60. Not $85: the 20% off is taken from a bigger number.')]))
T.append(dict(
    title='Simple Interest', nav='Interest', std='NC.7.RP.3',
    words=[('Principal (P)', 'the money you start with (save or borrow).'), ('Rate (r)', 'the yearly percent, as a decimal.'), ('Time (t)', 'in years.'), ('Simple interest (I)', 'I = P × r × t')],
    big='<b>I = Prt</b>. Interest is the extra money earned (or owed). The final balance is <b>P + I</b>. Time must be in years: 6 months = 0.5 year.',
    fill=['$500 at 4% for 3 years: I = 500 × {{0.04}} × 3 = {{60}}', 'The balance is 500 + 60 = {{560}}'],
    examples=[dict(title='Example: you save $2,000 at 3% simple interest for 5 years. What is the balance?', steps=['I = 2000 × 0.03 × 5 = 300', 'Balance = 2000 + 300', '<b>$2,300</b>'])],
    warn='Use the rate as a decimal (3% = 0.03), and time in years (18 months = 1.5 years).',
    np=[Q(1, 'Find the simple interest on $250 at 4% for 2 years (in dollars).', ans=20, hint='I = 250 × 0.04 × 2', sol='250 × 0.04 × 2 = $20.'),
        Q(2, 'You borrow $3,000 at 6% simple interest for 6 months. How much interest do you owe?', ch=['$90', '$1,080', '$180', '$108,000'],
          why={'$1,080': 'You used 6 for time. 6 months is 0.5 year.', '$180': 'That is the interest for 1 year. 6 months is half a year.', '$108,000': 'Use 6% as 0.06, and 6 months as 0.5 year.'},
          hint='t = 6 months = 0.5 year. I = 3000 × 0.06 × 0.5.', sol='3,000 × 0.06 × 0.5 = $90.'),
        Q(3, 'Lee earned $90 in simple interest on $1,500 in 2 years. What was the yearly interest rate, in percent?', ans=3, hint='90 = 1500 × r × 2. Solve for r.', sol='1500 × 2 = 3000. r = 90 ÷ 3000 = 0.03 = 3%.')]))
T.append(dict(
    title='Percent Error', nav='Percent Error', std='NC.7.RP.3',
    words=[('Percent error', 'how far off an estimate or measurement is, compared with the actual value.'), ('Absolute value', 'distance from 0, so the error is never negative.')],
    big='<b>percent error = |estimate − actual| ÷ actual × 100</b>. Always divide by the ACTUAL (true) value.',
    fill=['Guess 45, actual 50: |45 − 50| = {{5}}, 5 ÷ 50 = {{10}}%', 'Guess 132, actual 120: |132 − 120| = 12, 12 ÷ 120 = {{10}}%'],
    examples=[dict(title='Example: Max guesses a jar has 9 marbles. It has 12. What is his percent error?', steps=['Error: |9 − 12| = 3', '3 ÷ 12 = 0.25', '<b>25%</b>'])],
    warn='Divide by the ACTUAL value, not the guess.',
    np=[Q(1, 'Sam guesses a board is 19 inches. It is 20 inches. What is the percent error?', ans=5, hint='|19 − 20| ÷ 20', sol='1 ÷ 20 = 0.05 = 5%.'),
        Q(2, 'Jo estimates 40 people will come. 32 come. What is the percent error?', ch=['25%', '20%', '8%', '80%'],
          why={'20%': 'You divided by the estimate, 40. Divide by the ACTUAL, 32.', '8%': '8 is the difference, not the percent. Divide it by the actual.', '80%': 'That is 32 ÷ 40. Find the difference first.'},
          hint='|40 − 32| ÷ 32', sol='8 ÷ 32 = 0.25 = 25%.'),
        Q(3, 'Two students measure a 40 cm desk. Ava gets 38 cm. Ben gets 41 cm. How much bigger (in percentage points) is Ava\'s percent error than Ben\'s?', ans=2.5, hint='Ava: 2 ÷ 40. Ben: 1 ÷ 40.', sol='Ava: 2 ÷ 40 = 5%. Ben: 1 ÷ 40 = 2.5%. 5 − 2.5 = 2.5.')]))

PART2 = [
    ('A. Percent of a Number', 'NC.7.RP.3', [
        Q(1, 'What is 60% of 45?', ans=27, hint='0.6 × 45'),
        Q(2, '14 is 35% of what number?', ans=40, hint='14 ÷ 0.35'),
        Q(3, '48 of 64 students ride the bus. What percent ride the bus?', ans=75, hint='48 ÷ 64, then × 100.')]),
    ('B. Percent Change and Error', 'NC.7.RP.3', [
        Q(1, 'A plant grew from 40 cm to 56 cm. What is the percent increase?', ans=40, hint='16 ÷ 40'),
        Q(2, 'A $68 coat is 25% off. What is the sale price in dollars?', ans=51, hint='0.75 × 68'),
        Q(3, 'Which is the larger percent error?', ch=['Guessing 9 when the answer is 12', 'Guessing 45 when the answer is 50', 'Guessing 132 when the answer is 120', 'They are all the same.'],
          why={'Guessing 45 when the answer is 50': '5 ÷ 50 = 10%. Compare with the others.', 'Guessing 132 when the answer is 120': '12 ÷ 120 = 10%. Compare with the others.', 'They are all the same.': 'Find each one: |guess − actual| ÷ actual.'}, hint='Find each percent error.')]),
    ('C. Money Problems', 'NC.7.RP.3', [
        Q(1, 'An 8% tax on a $60 item. How much is the tax (in dollars)?', ans=4.8, hint='0.08 × 60'),
        Q(2, 'A $40 game is 30% off, then 5% tax is added. What is the total in dollars?', ans=29.4, hint='0.70 × 40 = 28. Then 1.05 × 28.'),
        Q(3, 'You save $3,000 at 6% simple interest. How much interest do you earn in 6 months (in dollars)?', ans=90, hint='t = 0.5 year.')]),
]

PRACTICE = dict(title='Unit 5 Practice — Percents', sub='Percent basics · Change · Tax, tips & discounts · Interest · Error', secs=[
    ('A. Part, Percent, Whole', 'NC.7.RP.3', 'part = percent × whole. Use the percent as a decimal.', [
        Q(1, 'What is 30% of 80?', ans=24, hint='0.3 × 80'),
        Q(2, '18 is 40% of what number?', ch=['45', '7.2', '720', '0.45'],
          why={'7.2': 'You found 40% of 18. Here 18 is the part.', '720': 'You multiplied 18 × 40. Divide 18 by 0.40.', '0.45': 'You divided 18 by 40, not by 0.40.'}, hint='whole = 18 ÷ 0.40'),
        Q(3, 'A test has 55 points. Mia lost 20% of the points. How many points did she get?', ans=44, hint='20% of 55 = 11 points lost.')]),
    ('B. Percent Increase and Decrease', 'NC.7.RP.3', 'change ÷ original × 100', [
        Q(1, 'From 50 to 35. What is the percent decrease?', ans=30, hint='15 ÷ 50'),
        Q(2, 'A $1,200 TV goes up to $1,500. What is the percent increase?', ch=['25%', '20%', '300%', '80%'],
          why={'20%': 'You divided by the NEW price. Divide by the original, $1,200.', '300%': '300 is the change in dollars. Divide it by the original.', '80%': 'That is 1,200 ÷ 1,500. Find the change first.'}, hint='300 ÷ 1200'),
        Q(3, 'A store pays $85 for a bike and marks it up 20%. What is the selling price in dollars?', ans=102, hint='1.20 × 85')]),
    ('C. Tax, Tips, Fees, Commission', 'NC.7.RP.3', 'Add tax, tips and fees. Subtract discounts. Do them in order.', [
        Q(1, 'An 18% tip on a $24 bill. How much is the tip in dollars?', ans=4.32, hint='0.18 × 24'),
        Q(2, '$45 with 6% sales tax. What is the total?', ch=['$47.70', '$2.70', '$51', '$45.06'],
          why={'$2.70': 'That is the tax. Add it to $45.', '$51': 'You added $6, not 6%.', '$45.06': 'You added 6 cents. 6% of 45 is more.'}, hint='1.06 × 45'),
        Q(2, 'An $80 jacket is 20% off. Then 5% tax is added. What is the total in dollars?', ans=67.2, hint='0.80 × 80 = 64. Then 1.05 × 64.'),
        Q(3, 'Kim earns $300 a week plus 4% commission on her sales. She sold $2,500 this week. What did she earn in all (in dollars)?', ans=400, hint='Commission: 0.04 × 2500. Add the $300.')]),
    ('D. Simple Interest', 'NC.7.RP.3', 'I = Prt. Rate as a decimal, time in years.', [
        Q(1, 'Find the interest on $500 at 4% for 3 years (in dollars).', ans=60, hint='500 × 0.04 × 3'),
        Q(2, 'What is the balance after $2,000 earns 3% simple interest for 5 years?', ch=['$2,300', '$300', '$2,060', '$32,000'],
          why={'$300': 'That is the interest. Add it to the $2,000.', '$2,060': 'That is only 1 year of interest. Multiply by 5 years.', '$32,000': 'Use 3% as 0.03.'}, hint='I = 2000 × 0.03 × 5. Then add it to 2000.'),
        Q(3, 'How many years does it take $800 to earn $120 at 5% simple interest?', ans=3, hint='120 = 800 × 0.05 × t')]),
    ('E. Percent Error', 'NC.7.RP.3', '|estimate − actual| ÷ actual × 100', [
        Q(1, 'Guess 45, actual 50. What is the percent error?', ans=10, hint='5 ÷ 50'),
        Q(2, 'Guess 132, actual 120. What is the percent error?', ch=['10%', '9.1%', '12%', '110%'],
          why={'9.1%': 'You divided by the guess, 132. Divide by the actual, 120.', '12%': '12 is the difference. Divide it by 120.', '110%': 'That is 132 ÷ 120. Find the difference first.'}, hint='12 ÷ 120'),
        Q(3, 'A scale says a 50 kg bag weighs 48 kg. What is the percent error?', ans=4, hint='|48 − 50| ÷ 50')]),
])
