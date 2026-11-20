from lib import Q, F, Fr
from figs import graph, dnl, table

assert Fr(1, 2) / Fr(1, 4) == 2 and Fr(3, 4) / Fr(1, 2) == Fr(3, 2) and Fr(2, 3) / Fr(1, 6) == 4
assert Fr(18, 3) == 6 and 6 * 5 == 30 and Fr(Fr(5, 2), Fr(5, 6)) == 3
assert Fr(28, 4) == 7 and Fr(36, 8) == Fr(9, 2)
assert 2.5 * 8 == 20 and Fr(84, 12) == 7 and Fr(7, 1) * 15 == 105
assert Fr(105, 7) == 15 and Fr(36, 3) == 12 and Fr(13, 4) * 16 == 52
assert Fr(9, 6) == Fr(3, 2) and Fr(Fr(3, 4), Fr(1, 3)) == Fr(9, 4) and Fr(14, Fr(7, 2)) == 4
assert Fr(36, 1) / Fr(9, 4) == 16 and Fr(45, 3) == 15 and 15 * 8 == 120
assert Fr(3, 2) / Fr(3, 8) == 4 and Fr(48, 6) == 8 and 8 * 11 == 88 and Fr(1, 4) / Fr(1, 6) == Fr(3, 2)
assert Fr(450, 6) == 75 and Fr(6, 1) * Fr(5, 2) == 15 and Fr(126, 9) == 14

UNIT = dict(
    n=4, title='Proportional Relationships', short='Proportions', icon='⚖',
    tag='Find unit rates (even with fractions), spot proportional relationships, and write y = kx.',
    desc='Compute unit rates with fractions, decide if a table or graph is proportional, find the constant of proportionality, and write and use y = kx.',
    stds=[('NC.7.RP.1', 'Compute unit rates with ratios of fractions, including lengths, areas and other quantities.'),
          ('NC.7.RP.2', 'Recognize and represent proportional relationships in tables, graphs, equations and words; find the constant of proportionality; explain what a point means.')],
    ican=['I can find a unit rate, even when the numbers are fractions',
          'I can tell from a table if two quantities are proportional and find the constant of proportionality',
          'I can tell from a graph if a relationship is proportional and explain what (1, r) and (0, 0) mean',
          'I can write an equation y = kx for a proportional relationship',
          'I can use a constant of proportionality to solve real-world problems'],
    vocab=[('Ratio', 'a comparison of two quantities, like 3 to 4'), ('Rate', 'a ratio of two different units, like 60 miles in 2 hours'),
           ('Unit rate', 'a rate for ONE unit, like 30 miles per 1 hour'), ('Complex fraction', 'a fraction with a fraction in the top, bottom or both'),
           ('Proportional', 'two quantities with the same ratio y/x every time'), ('Constant of proportionality (k)', 'the unit rate k = y/x in y = kx'),
           ('Origin', 'the point (0, 0) on a graph')],
)
T = []
T.append(dict(
    title='Unit Rates with Fractions', nav='Unit Rates', std='NC.7.RP.1',
    words=[('Unit rate', 'how much for ONE unit: miles per 1 hour, dollars per 1 pound.'), ('Complex fraction', 'a fraction with fractions inside it, like (1/2) ÷ (1/4).')],
    big='Unit rate = first amount ÷ second amount. With fractions, divide by multiplying by the <b>reciprocal</b>: ' + F('a', 'b') + ' ÷ ' + F('c', 'd') + ' = ' + F('a', 'b') + ' × ' + F('d', 'c') + '.',
    fig=dnl([0, Fr(1, 2), 1, Fr(3, 2), 2], [0, Fr(1, 4), Fr(1, 2), Fr(3, 4), 1], 'miles', 'hours', title='double number line: 2 miles each hour'),
    figcap='Walk 1/2 mile in 1/4 hour. Keep going: 2 miles in 1 hour. The unit rate is 2 miles per hour.',
    fill=['1/2 mile in 1/4 hour: (1/2) ÷ (1/4) = (1/2) × {{4}} = {{2}} miles per hour', '3/4 cup of flour for 1/2 batch: (3/4) ÷ (1/2) = {{1 1/2}} cups per batch'],
    examples=[dict(title='Example: Mia paints 2/3 of a wall in 1/6 of an hour. How many walls per hour?', steps=['Walls ÷ hours: ' + F('2', '3') + ' ÷ ' + F('1', '6'), 'Multiply by the reciprocal: ' + F('2', '3') + ' × ' + F('6', '1') + ' = ' + F('12', '3'), '<b>4 walls per hour</b>'])],
    warn='Put the units in the right order. "Miles per hour" means miles ÷ hours, not hours ÷ miles.',
    np=[Q(1, 'A car goes 150 miles in 3 hours. What is the unit rate in miles per hour?', ans=50, hint='150 ÷ 3', sol='150 ÷ 3 = 50 miles per hour.'),
        Q(2, 'A snail crawls 3/4 of a foot in 1/2 of a minute. What is its speed in feet per minute?', ch=['1 1/2 feet per minute', '3/8 foot per minute', '2/3 foot per minute', '1 1/4 feet per minute'],
          why={'3/8 foot per minute': 'You multiplied 3/4 × 1/2. To find a rate, DIVIDE: feet ÷ minutes.', '2/3 foot per minute': 'That is minutes ÷ feet. Put feet on top.', '1 1/4 feet per minute': 'You added 3/4 + 1/2. Divide instead.'},
          hint='Feet ÷ minutes = (3/4) ÷ (1/2) = (3/4) × 2.', sol='(3/4) ÷ (1/2) = (3/4) × 2 = 6/4 = 1 1/2 feet per minute.'),
        Q(3, 'Ty mows 5/2 acres in 5/6 of an hour. Lu mows 2 acres in 3/4 of an hour. How many acres per hour does the FASTER mower cut?', ans=3, hint='Find both unit rates: acres ÷ hours.', sol='Ty: (5/2) ÷ (5/6) = (5/2) × (6/5) = 3. Lu: 2 ÷ (3/4) = 8/3 ≈ 2.67. Ty is faster: 3 acres per hour.')]))
T.append(dict(
    title='Proportional Tables', nav='Tables', std='NC.7.RP.2',
    words=[('Proportional', 'y ÷ x is the SAME for every pair (and 0 x gives 0 y).'), ('Constant of proportionality (k)', 'that same value of y ÷ x. It is the unit rate.')],
    big='To test a table, find <b>y ÷ x</b> for every row. If every answer is the same, the table is proportional, and that number is <b>k</b>.',
    table=(['x (hours)', 'y (dollars)', 'y ÷ x'], [['2', '18', '{{9}}'], ['3', '27', '{{9}}'], ['5', '45', '{{9}}'], ['', 'Proportional?', '{{Yes, k = 9}}']]),
    examples=[dict(title='Example: is this table proportional?', fig=table(['Tickets', 'Cost ($)'], [[2, 16], [4, 30], [6, 44]]), steps=['16 ÷ 2 = 8', '30 ÷ 4 = 7.5', 'The ratios are not the same.', '<b>Not proportional</b> (maybe there is a fee).'])],
    warn='Check EVERY row, not just one. One matching ratio does not prove a table is proportional.',
    np=[Q(1, 'Pounds of apples and cost: 2 lb → $5, 4 lb → $10, 6 lb → $15. What is the constant of proportionality (dollars per pound)?', ans=2.5, hint='Cost ÷ pounds.', sol='5 ÷ 2 = 2.5, 10 ÷ 4 = 2.5, 15 ÷ 6 = 2.5. k = 2.5 dollars per pound.'),
        Q(2, 'Is this table proportional?', fig=table(['x', 'y'], [[3, 12], [5, 20], [8, 30]]), ch=['No, because 30 ÷ 8 is not 4.', 'Yes, because y gets bigger when x gets bigger.', 'Yes, because 12 ÷ 3 = 4.', 'No, because the x values skip numbers.'],
          why={'Yes, because y gets bigger when x gets bigger.': 'Growing together is not enough. Every y ÷ x must be the same.', 'Yes, because 12 ÷ 3 = 4.': 'You checked one row. Check every row.', 'No, because the x values skip numbers.': 'x values can skip. Check y ÷ x for every row.'},
          hint='Find y ÷ x for every row.', sol='12 ÷ 3 = 4, 20 ÷ 5 = 4, but 30 ÷ 8 = 3.75. Not proportional.'),
        Q(3, 'A recipe uses 3/4 cup of sugar for every 1/3 cup of butter. It is proportional. How many cups of sugar go with 4 cups of butter?', ans=9, hint='k = (3/4) ÷ (1/3) cups of sugar per cup of butter. Then multiply by 4.', sol='k = (3/4) × 3 = 9/4. Sugar = (9/4) × 4 = 9 cups.')]))
T.append(dict(
    title='Proportional Graphs', nav='Graphs', std='NC.7.RP.2',
    words=[('Origin', 'the point (0, 0).'), ('(1, r)', 'the point where x = 1. Its y-value r is the unit rate.')],
    big='A proportional graph is a <b>straight line through the origin</b>. The point (1, r) shows the unit rate. The point (0, 0) means 0 of one thing goes with 0 of the other.',
    fig=graph(6, 18, 1, 3, pts=[(1, 3, '(1, 3)'), (4, 12, '(4, 12)')], line=3, xl='hours', yl='miles', title='straight line through the origin with the point (1, 3)'),
    figcap='Straight line through (0, 0). The point (1, 3) means 3 miles in 1 hour: k = 3.',
    fill=['A proportional graph is a {{straight}} line through the {{origin}}.', 'On the graph above, (4, 12) means {{12}} miles in {{4}} hours.'],
    examples=[dict(title='Example: what does the point (5, 40) mean on a graph of hours worked (x) and dollars earned (y)?', steps=['x = 5 hours, y = 40 dollars.', '<b>She earns $40 for 5 hours of work.</b>', 'Unit rate: 40 ÷ 5 = 8, so the point (1, 8) is also on the line.'])],
    warn='A straight line that does NOT go through (0, 0) is not proportional. A curve is not proportional.',
    np=[Q(1, 'The graph shows cost (y) for pounds of grapes (x). The line passes through (0, 0) and (4, 12). What is the cost for 1 pound in dollars?', fig=graph(5, 15, 1, 3, pts=[(4, 12, '(4, 12)')], line=3, xl='pounds', yl='dollars', title='line through (0, 0) and (4, 12)'), ans=3, hint='The unit rate is y ÷ x.', sol='12 ÷ 4 = 3. The point (1, 3) is on the line: $3 per pound.'),
        Q(2, 'Which graph shows a proportional relationship?', ch=['a straight line through (0, 0)', 'a straight line through (0, 5)', 'a curve through (0, 0)', 'a set of points that go up, then down'],
          why={'a straight line through (0, 5)': 'It must go through the origin, (0, 0).', 'a curve through (0, 0)': 'A proportional graph is a STRAIGHT line.', 'a set of points that go up, then down': 'A proportional graph always goes the same direction, along a straight line.'},
          hint='Two things must be true about a proportional graph.', sol='A proportional graph is a straight line through the origin.'),
        Q(3, 'A proportional graph of minutes (x) and pages read (y) goes through (6, 15). Which point is also on the line, and what does it mean?', ch=['(1, 2.5): 2.5 pages in 1 minute', '(1, 6): 6 pages in 1 minute', '(2.5, 1): 1 page in 2.5 minutes', '(1, 15): 15 pages in 1 minute'],
          why={'(1, 6): 6 pages in 1 minute': 'The 6 is minutes. Find pages ÷ minutes.', '(2.5, 1): 1 page in 2.5 minutes': 'x is minutes. In this point x = 2.5 minutes, but 1 page takes 6 ÷ 15 = 0.4 minutes.', '(1, 15): 15 pages in 1 minute': '15 pages took 6 minutes, not 1.'},
          hint='The unit rate is y ÷ x = 15 ÷ 6.', sol='15 ÷ 6 = 2.5, so (1, 2.5): 2.5 pages each minute.')]))
T.append(dict(
    title='Equations y = kx', nav='y = kx', std='NC.7.RP.2',
    words=[('y = kx', 'the equation of a proportional relationship. k is the constant of proportionality.')],
    big='Find k (the unit rate, y ÷ x). Then write <b>y = kx</b>. Use it to find y for any x, or x for any y.',
    fill=['Gas costs $3.50 per gallon: y = {{3.5}}x', 'A table has (4, 28) and (6, 42): k = {{7}}, so y = {{7x}}'],
    examples=[dict(title='Example: a printer prints 84 pages in 12 minutes. Write the equation and find the pages in 15 minutes.', steps=['k = 84 ÷ 12 = 7 pages per minute', 'y = 7x (y = pages, x = minutes)', 'x = 15: y = 7(15) = 105', '<b>105 pages</b>'])],
    warn='k is y ÷ x, not x ÷ y. Check: put a point in. 84 = 7(12) ✓',
    np=[Q(1, 'A machine fills 36 bottles in 3 minutes. In y = kx (y = bottles, x = minutes), what is k?', ans=12, hint='Bottles ÷ minutes.', sol='36 ÷ 3 = 12, so y = 12x.'),
        Q(2, 'Which equation fits the table?', fig=table(['x', 'y'], [[2, 7], [4, 14], [10, 35]]), ch=['y = 3.5x', 'y = 2x', 'y = x + 5', 'y = 0.29x'],
          why={'y = 2x': '2 is an x value. k is y ÷ x.', 'y = x + 5': 'That works for (2, 7) only. Check (4, 14).', 'y = 0.29x': 'That is x ÷ y. Use y ÷ x.'},
          hint='Find y ÷ x.', sol='7 ÷ 2 = 3.5, 14 ÷ 4 = 3.5, 35 ÷ 10 = 3.5. y = 3.5x.'),
        Q(3, 'A plant grows ' + F('13', '4') + ' cm per week (y = ' + F('13', '4') + 'x). How many weeks until it has grown 52 cm?', ans=16, hint='52 = (13/4)x. Divide 52 by 13/4.', sol='x = 52 ÷ (13/4) = 52 × 4/13 = 16 weeks.')]))
T.append(dict(
    title='Solving Proportional Problems', nav='Solve Problems', std='NC.7.RP.2',
    words=[('Proportion', 'two equal ratios, like 3/4 = 9/12.')],
    big='Three ways to solve: <b>1</b> find the unit rate and multiply, <b>2</b> scale up a table or double number line, <b>3</b> write y = kx. Always check that your answer is reasonable.',
    fig=dnl([0, 3, 6, 9, 12], [0, 2, 4, 6, 8], 'cups of water', 'cups of rice', hide=[('t', 4)], title='double number line with a missing value'),
    figcap='3 cups of water for 2 cups of rice. For 8 cups of rice: k = 3/2, so (3/2) × 8 = 12 cups of water.',
    examples=[dict(title='Example: 6 cans of juice cost $4.50. How much do 10 cans cost?', steps=['Unit rate: 4.50 ÷ 6 = 0.75 dollars per can', 'y = 0.75x', '10 cans: 0.75 × 10 = 7.50', '<b>$7.50</b>. Reasonable: 10 cans cost more than 6 cans ✓'])],
    warn='Keep the same units on the top and bottom of both ratios.',
    np=[Q(1, 'A car uses 3 gallons of gas to go 45 miles. How many miles can it go on 8 gallons?', ans=120, hint='45 ÷ 3 = miles per gallon. Then multiply by 8.', sol='45 ÷ 3 = 15 miles per gallon. 15 × 8 = 120 miles.'),
        Q(2, 'A map shows 1/4 inch for every 1/6 mile. How many miles is 1 inch?', ch=['2/3 mile', '1 1/2 miles', '1/24 mile', '4 miles'],
          why={'1 1/2 miles': 'That is inches per mile. Find miles ÷ inches.', '1/24 mile': 'You multiplied 1/4 × 1/6. Divide miles by inches.', '4 miles': '4 is how many 1/4 inches are in 1 inch. Each one is 1/6 mile.'},
          hint='Miles ÷ inches = (1/6) ÷ (1/4).', sol='(1/6) ÷ (1/4) = (1/6) × 4 = 4/6 = 2/3 mile per inch.'),
        Q(3, 'Store A sells 6 lb of rice for $9. Store B sells 9 lb for $12.60. How many CENTS less per pound is the cheaper store?', ans=10, hint='Find each price per pound.', sol='A: 9 ÷ 6 = $1.50 per lb. B: 12.60 ÷ 9 = $1.40 per lb. B is $0.10 = 10 cents less per pound.')]))

PART2 = [
    ('A. Unit Rates', 'NC.7.RP.1', [
        Q(1, 'Lee reads 48 pages in 6 days. How many pages per day?', ans=8, hint='48 ÷ 6'),
        Q(2, 'A recipe uses 1 1/2 cups of milk for 3/8 of a batch. How many cups of milk for a whole batch?', ans=4, hint='(3/2) ÷ (3/8)'),
        Q(3, 'Which is the better buy?', ch=['12 oz for $3.00', '16 oz for $4.16', '8 oz for $2.20', 'They all cost the same per ounce.'],
          why={'16 oz for $4.16': '4.16 ÷ 16 = 0.26 dollars per ounce. Compare with the others.', '8 oz for $2.20': '2.20 ÷ 8 = 0.275 dollars per ounce. That is the most per ounce.', 'They all cost the same per ounce.': 'Find the cost per ounce for each one: they are different.'}, hint='Find dollars ÷ ounces for each.')]),
    ('B. Tables, Graphs and Equations', 'NC.7.RP.2', [
        Q(1, 'A proportional table has x = 9 and y = 6. What is k? (Type a fraction like 2/3 or a decimal.)', ans=Fr(2, 3), hint='k = y ÷ x', show='2/3'),
        Q(2, 'Which table is proportional?', ch=['(1, 4), (2, 8), (5, 20)', '(1, 4), (2, 6), (5, 12)', '(0, 3), (1, 6), (2, 9)', '(1, 4), (2, 8), (5, 21)'],
          why={'(1, 4), (2, 6), (5, 12)': '6 ÷ 2 = 3, not 4. The ratios change.', '(0, 3), (1, 6), (2, 9)': 'A proportional table goes through (0, 0). Here 0 gives 3.', '(1, 4), (2, 8), (5, 21)': 'Look closely at the last pair: 21 ÷ 5 = 4.2.'}, hint='Find y ÷ x for every pair.'),
        Q(3, 'On a graph of y = 2.5x for hours (x) and dollars (y), what does the point (6, 15) mean?', ch=['$15 for 6 hours', '$6 for 15 hours', '$2.50 for 6 hours', '6 dollars per hour'],
          why={'$6 for 15 hours': 'x comes first: x is hours.', '$2.50 for 6 hours': '2.5 is the cost for 1 hour.', '6 dollars per hour': 'The unit rate is k = 2.5. The point is a total.'}, hint='x = hours, y = dollars.')]),
    ('C. Real-World Problems', 'NC.7.RP.2', [
        Q(1, 'A worker earns $450 in 6 days. How much does she earn per day?', ans=75, hint='450 ÷ 6'),
        Q(2, '1 can of paint covers 2 1/2 square meters. How many square meters do 6 cans cover?', ans=15, hint='6 × 2 1/2'),
        Q(3, 'A runner keeps the same pace. She runs 9 km in 63 minutes. How many minutes for 2 km?', ans=14, hint='Minutes per km = 63 ÷ 9.')]),
]

PRACTICE = dict(title='Unit 4 Practice — Proportional Relationships', sub='Unit rates · Tables · Graphs · y = kx · Problems', secs=[
    ('A. Unit Rates with Fractions', 'NC.7.RP.1', 'Divide the first amount by the second. Divide fractions by multiplying by the reciprocal.', [
        Q(1, 'A faucet fills 18 liters in 3 minutes. How many liters per minute?', ans=6, hint='18 ÷ 3'),
        Q(2, 'A turtle walks 1/4 mile in 1/6 hour. How many miles per hour?', ch=['1 1/2 miles per hour', '2/3 mile per hour', '1/24 mile per hour', '4 miles per hour'],
          why={'2/3 mile per hour': 'That is hours ÷ miles. Put miles on top.', '1/24 mile per hour': 'You multiplied. A rate DIVIDES.', '4 miles per hour': 'Divide by 1/6 means × 6, then multiply by 1/4 too.'}, hint='(1/4) ÷ (1/6) = (1/4) × 6.'),
        Q(2, 'A 3/4 lb bag of trail mix costs $3. What is the price per pound in dollars?', ans=4, hint='3 ÷ (3/4)'),
        Q(3, 'Jay types 2/3 of a page in 1/6 hour. Kim types 1 1/2 pages in 1/2 hour. How many MORE pages per hour does the faster typist type?', ans=1, hint='Jay: (2/3) ÷ (1/6). Kim: (3/2) ÷ (1/2).')]),
    ('B. Proportional Tables', 'NC.7.RP.2', 'Proportional: y ÷ x is the same in every row. That value is k.', [
        Q(1, 'What is k for this proportional table?', fig=table(['x', 'y'], [[4, 28], [6, 42], [9, 63]]), ans=7, hint='y ÷ x'),
        Q(2, 'Is the table proportional?', fig=table(['Pizzas', 'Cost ($)'], [[1, 12], [2, 22], [3, 32]]), ch=['No, because 22 ÷ 2 is not 12.', 'Yes, k = 12.', 'Yes, the cost goes up by 10 each time.', 'No, because pizzas are whole numbers.'],
          why={'Yes, k = 12.': 'Check the second row: 22 ÷ 2.', 'Yes, the cost goes up by 10 each time.': 'Going up by the same amount is not enough. y ÷ x must stay the same.', 'No, because pizzas are whole numbers.': 'Whole numbers can be proportional. Check y ÷ x.'}, hint='Find cost ÷ pizzas in every row.'),
        Q(3, 'In a proportional table, 5 shirts cost $60. How much do 12 shirts cost (in dollars)?', ans=144, hint='k = 60 ÷ 5.')]),
    ('C. Proportional Graphs', 'NC.7.RP.2', 'A straight line through the origin. (1, r) shows the unit rate.', [
        Q(1, 'The line goes through (0, 0) and (3, 18). What is the unit rate?', fig=graph(4, 24, 1, 6, pts=[(3, 18, '(3, 18)')], line=6, title='line through (0, 0) and (3, 18)'), ans=6, hint='y ÷ x'),
        Q(2, 'What does (0, 0) mean on a graph of tickets (x) and cost (y)?', ch=['0 tickets cost $0.', 'Each ticket costs $0.', 'The tickets are free after the first one.', 'The graph starts at 1 ticket.'],
          why={'Each ticket costs $0.': 'The unit rate is the y at x = 1, not at x = 0.', 'The tickets are free after the first one.': 'Every point on the line has the same unit rate.', 'The graph starts at 1 ticket.': '(0, 0) is a point on the graph, so it starts at 0.'}, hint='x = 0 tickets, y = 0 dollars.'),
        Q(3, 'A graph of y = kx goes through (8, 6). What is the y-value at x = 1? (Type a decimal or a fraction.)', ans=Fr(3, 4), hint='k = 6 ÷ 8.', show='3/4')]),
    ('D. Equations y = kx', 'NC.7.RP.2', 'k = y ÷ x. Then y = kx.', [
        Q(1, 'Rope costs $1.25 per foot. Using y = 1.25x, what does 20 feet cost (in dollars)?', ans=25, hint='1.25 × 20'),
        Q(2, 'Which equation fits: 4 hours of work pays $54?', ch=['y = 13.5x', 'y = 4x', 'y = 54x', 'y = 0.074x'],
          why={'y = 4x': '4 is the number of hours. k = dollars ÷ hours.', 'y = 54x': '54 is the pay for 4 hours, not 1 hour.', 'y = 0.074x': 'That is hours ÷ dollars. Use dollars ÷ hours.'}, hint='k = 54 ÷ 4.'),
        Q(3, 'y = ' + F('5', '2') + 'x. What is x when y = 35?', ans=14, hint='35 ÷ (5/2) = 35 × 2/5.')]),
    ('E. Solve Proportional Problems', 'NC.7.RP.2', 'Find the unit rate, then multiply. Check that it is reasonable.', [
        Q(1, 'A car goes 88 miles on 4 gallons. How many miles on 11 gallons?', ans=242, hint='88 ÷ 4 = miles per gallon.'),
        Q(2, 'Ms. Diaz drives 1/2 hour to go 1/3 of the way to the beach. At the same rate, how many hours does the WHOLE trip take?', ans=Fr(3, 2), show='3/2', hint='Hours ÷ fraction of the trip: (1/2) ÷ (1/3).'),
        Q(3, 'Gym A: $90 for 6 visits. Gym B: $126 for 9 visits. How many dollars less per visit is the cheaper gym?', ans=1, hint='Find dollars per visit for each.')]),
])
