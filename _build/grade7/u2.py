from lib import Q, F, Fr
from figs import bars, table, AMB2, SAND

UNIT = dict(
    n=2, title='Expressions', short='Expressions', icon='🧮',
    tag='Combine like terms, distribute, factor, and write expressions that tell a story.',
    desc='Combine like terms, use the distributive property, factor out a GCF, and rewrite expressions to see what they mean.',
    stds=[('NC.7.EE.1', 'Add, subtract, expand and factor linear expressions with rational coefficients.'),
          ('NC.7.EE.2', 'Rewrite an expression in a different form to see how the quantities are related.')],
    ican=['I can name the terms, coefficients, constants and like terms in an expression',
          'I can combine like terms, even with fractions, decimals and negatives',
          'I can use the distributive property to expand an expression',
          'I can factor an expression by taking out the greatest common factor (GCF)',
          'I can add and subtract expressions, and rewrite an expression to show what it means'],
    vocab=[('Expression', 'numbers, variables and operations with no equal sign, like 3x + 5'), ('Term', 'a part of an expression joined by + or −'),
           ('Coefficient', 'the number multiplied by a variable; in −4x it is −4'), ('Constant', 'a term with no variable'),
           ('Like terms', 'terms with the same variable part, like 2x and −7x'), ('Distributive property', 'a(b + c) = ab + ac'),
           ('Factor', 'write an expression as a product, like 6x + 9 = 3(2x + 3)'), ('Equivalent expressions', 'expressions that are equal for every value of the variable')],
)
T = []
T.append(dict(
    title='Terms and Like Terms', nav='Like Terms', std='NC.7.EE.1',
    words=[('Term', 'a part of an expression joined by + or −. 4x − 7 + y has 3 terms.'), ('Coefficient', 'the number in front of a variable. In −3x, it is −3.'),
           ('Constant', 'a number with no variable. In 5x + 8, it is 8.'), ('Like terms', 'terms with the same variable part: 2x and −5x, or 6 and −1.')],
    big='To simplify, <b>combine like terms</b>: add or subtract the coefficients. The variable part stays the same. Keep each sign with the term after it.',
    table=(['Expression', 'Terms', 'Coefficient of x', 'Constant'], [['5x − 3', '5x, −3', '{{5}}', '{{−3}}'], ['−x + ' + F('1', '2'), '−x, ' + F('1', '2'), '{{−1}}', '{{' + F('1', '2') + '}}'], ['0.4x + 2y − 6', '0.4x, 2y, −6', '{{0.4}}', '{{−6}}']]),
    examples=[dict(title='Example: simplify 7x + 4 − 3x − 9', steps=['Find like terms: 7x and −3x. 4 and −9.', 'Combine the x-terms: 7x − 3x = 4x', 'Combine the constants: 4 − 9 = −5', '<b>4x − 5</b>']),
              dict(title='Example: simplify ' + F('1', '2') + 'x + 3 − ' + F('3', '4') + 'x', steps=['x-terms: ' + F('1', '2') + 'x − ' + F('3', '4') + 'x = ' + F('2', '4') + 'x − ' + F('3', '4') + 'x', '= −' + F('1', '4') + 'x', '<b>−' + F('1', '4') + 'x + 3</b>'])],
    warn='x and x² are NOT like terms. And x means 1x, so 5x + x = 6x, not 5x.',
    np=[Q(1, 'Simplify: 6y + 2 − 4y + 5. What is the coefficient of y in your answer?', ans=2, hint='Combine 6y and −4y.', sol='6y − 4y = 2y. 2 + 5 = 7. The answer is 2y + 7, so the coefficient is 2.'),
        Q(2, 'Simplify: −2.5m + 4 + 1.5m − 7', ch=['−m − 3', '−4m − 3', 'm − 3', '−m + 11'], why={'−4m − 3': 'Different signs: −2.5 + 1.5 is a subtraction, 2.5 − 1.5 = 1.', 'm − 3': '−2.5m is farther from 0 than 1.5m, so the m-term is negative.', '−m + 11': 'Keep the sign with the 7: 4 − 7, not 4 + 7.'}, hint='m-terms: −2.5m + 1.5m. Constants: 4 − 7.', sol='−2.5m + 1.5m = −1m = −m. 4 − 7 = −3. Answer: −m − 3.'),
        Q(3, 'Jo says 3x + 4y simplifies to 7xy. Which is true?', ch=['3x and 4y are not like terms, so it cannot be simplified.', 'Jo is right.', 'It simplifies to 7x.', 'It simplifies to 12xy.'], why={'Jo is right.': 'Try x = 1, y = 1: 3 + 4 = 7, but 7xy = 7. Try x = 2, y = 1: 6 + 4 = 10, but 7xy = 14. Not equal.', 'It simplifies to 7x.': 'The y-term cannot join the x-term.', 'It simplifies to 12xy.': 'That multiplies the terms. You only combine LIKE terms by adding.'}, hint='Do 3x and 4y have the same variable part?', sol='3x and 4y have different variables, so they are not like terms. 3x + 4y is already simplified.')]))
T.append(dict(
    title='The Distributive Property', nav='Distribute', std='NC.7.EE.1',
    words=[('Distributive property', 'a(b + c) = ab + ac. Multiply the outside number by EVERY term inside.'), ('Expand', 'rewrite a product as a sum, like 3(x + 2) = 3x + 6.')],
    big='Multiply the number outside the parentheses by each term inside. Watch the signs: a negative outside changes the sign of every term inside.',
    fig=bars([('3(x + 2)', [(1, 'x + 2', SAND), (1, 'x + 2', SAND), (1, 'x + 2', SAND)], 3), ('3x + 6', [(1, 'x', SAND), (1, 'x', SAND), (1, 'x', SAND), (1, '2', AMB2), (1, '2', AMB2), (1, '2', AMB2)], 6)], title='3 groups of x + 2 is 3 x plus 3 twos'),
    figcap='3 groups of (x + 2) = 3 x\'s and 3 twos = 3x + 6.',
    fill=['4(x + 5) = 4x + {{20}}', '−2(3x − 7) = {{−6x}} + {{14}}', F('1', '2') + '(8x − 6) = {{4x}} − {{3}}'],
    examples=[dict(title='Example: −' + F('3', '4') + '(8x − 12)', steps=['Multiply −' + F('3', '4') + ' × 8x = −6x', 'Multiply −' + F('3', '4') + ' × (−12) = +9', '<b>−6x + 9</b>']),
              dict(title='Example: 5 − 2(x − 4)', steps=['Distribute the −2 (the sign goes with it): −2 × x = −2x and −2 × (−4) = +8', '5 − 2x + 8', 'Combine constants: <b>−2x + 13</b>'])],
    warn='Multiply EVERY term inside. 3(x + 4) is 3x + 12, not 3x + 4. And in 5 − 2(x − 4), the 2 is negative.',
    np=[Q(1, 'Expand: 6(2x + 3). What is the constant term?', ans=18, hint='Multiply 6 × 3.', sol='6(2x + 3) = 12x + 18. The constant is 18.'),
        Q(2, 'Expand: −4(2.5x − 3)', ch=['−10x + 12', '−10x − 12', '−10x − 3', '10x + 12'], why={'−10x − 12': '−4 × (−3) is positive.', '−10x − 3': 'Multiply the −3 by −4 too.', '10x + 12': '−4 × 2.5x is negative.'}, hint='Multiply −4 by 2.5x, then −4 by −3.', sol='−4 × 2.5x = −10x. −4 × (−3) = 12. Answer: −10x + 12.'),
        Q(3, 'Which expression is equivalent to 9 − 3(2x − 1)?', ch=['−6x + 12', '6x + 6', '12x − 6', '−6x + 8'], why={'6x + 6': 'That subtracts 9 − 3 first. Multiply before you subtract.', '12x − 6': 'The −3 belongs to the parentheses, not the 9.', '−6x + 8': '−3 × (−1) = +3, so 9 + 3 = 12.'}, hint='Distribute −3: −3 × 2x and −3 × (−1). Then combine with 9.', sol='−3(2x − 1) = −6x + 3. 9 − 6x + 3 = −6x + 12.')]))
T.append(dict(
    title='Factoring with the GCF', nav='Factor', std='NC.7.EE.1',
    words=[('Greatest common factor (GCF)', 'the biggest number that divides every term.'), ('Factor (verb)', 'write as a product. Factoring undoes distributing.')],
    big='To factor, find the GCF of the terms. Write it outside the parentheses. Inside, write what is left after dividing each term by the GCF. Check by distributing.',
    fill=['12x + 18: the GCF of 12 and 18 is {{6}}, so 12x + 18 = 6({{2x + 3}})', '15x − 10 = {{5}}(3x − 2)', 'With a negative GCF: −8x + 20 = −4({{2x − 5}})'],
    examples=[dict(title='Example: factor 24x − 36', steps=['GCF of 24 and 36 is 12.', '24x ÷ 12 = 2x and −36 ÷ 12 = −3', '<b>12(2x − 3)</b>. Check: 12 × 2x − 12 × 3 = 24x − 36 ✓'])],
    warn='Use the GREATEST common factor. 24x − 36 = 2(12x − 18) is true, but it is not fully factored.',
    np=[Q(1, 'Factor 9x + 21 = 3(□x + 7). What number goes in the box?', ans=3, hint='9x ÷ 3 = ?', sol='9x ÷ 3 = 3x. So 9x + 21 = 3(3x + 7).'),
        Q(2, 'Which shows 20x − 30 factored completely?', ch=['10(2x − 3)', '5(4x − 6)', '2(10x − 15)', '10(2x − 30)'], why={'5(4x − 6)': '4x − 6 can still be factored by 2. Use the GREATEST common factor.', '2(10x − 15)': '10x − 15 can still be factored by 5.', '10(2x − 30)': 'Divide BOTH terms by 10: −30 ÷ 10 = −3.'}, hint='The GCF of 20 and 30 is 10.', sol='GCF = 10. 20x ÷ 10 = 2x, −30 ÷ 10 = −3. Answer: 10(2x − 3).'),
        Q(3, 'Factor out −6: −6x + 9 = −3(2x − □). Which number goes in the box? (Look carefully: the GCF used is −3.)', ans=3, hint='9 ÷ (−3) = −3, so inside the parentheses it is − 3.', sol='−6x ÷ (−3) = 2x. 9 ÷ (−3) = −3. So −6x + 9 = −3(2x − 3).')]))
T.append(dict(
    title='Adding and Subtracting Expressions', nav='Add & Subtract', std='NC.7.EE.1',
    words=[('Sum of expressions', 'add them, then combine like terms.'), ('Difference of expressions', 'subtract EVERY term of the second expression.')],
    big='To add expressions, combine like terms. To subtract an expression, distribute the minus sign to every term in the parentheses (add the opposite), then combine.',
    fill=['(3x + 5) + (2x − 8) = {{5x − 3}}', '(3x + 5) − (2x − 8) = 3x + 5 − 2x {{+ 8}} = {{x + 13}}'],
    examples=[dict(title='Example: (' + F('3', '4') + 'x − 2) − (' + F('1', '2') + 'x − 5)', steps=['Change the signs in the second parentheses: ' + F('3', '4') + 'x − 2 − ' + F('1', '2') + 'x + 5', 'x-terms: ' + F('3', '4') + 'x − ' + F('2', '4') + 'x = ' + F('1', '4') + 'x', 'Constants: −2 + 5 = 3', '<b>' + F('1', '4') + 'x + 3</b>'])],
    warn='The minus sign goes to EVERY term: −(2x − 8) = −2x + 8. Many students forget to change the second sign.',
    np=[Q(1, 'Add: (4x − 1) + (6x + 9). What is the constant in the answer?', ans=8, hint='−1 + 9', sol='4x + 6x = 10x. −1 + 9 = 8. Answer: 10x + 8.'),
        Q(2, 'Subtract: (5y + 2) − (3y − 4)', ch=['2y + 6', '2y − 2', '8y − 2', '2y − 6'], why={'2y − 2': 'Subtracting −4 means adding 4: 2 + 4.', '8y − 2': 'Subtract the y-terms: 5y − 3y.', '2y − 6': 'The −(−4) is +4, and 2 + 4 = 6 is positive.'}, hint='Change every sign in the second parentheses: 5y + 2 − 3y + 4.', sol='5y − 3y = 2y. 2 + 4 = 6. Answer: 2y + 6.'),
        Q(3, 'Find the mistake: (8x − 3) − (2x − 5) = 8x − 3 − 2x − 5 = 6x − 8. What went wrong?', ch=['The −5 should become +5. The answer is 6x + 2.', 'The x-terms should add: 10x − 8.', 'Nothing is wrong.', 'The −3 should become +3. The answer is 6x − 2.'], why={'The x-terms should add: 10x − 8.': 'Subtracting 2x means 8x − 2x.', 'Nothing is wrong.': 'Check the second term inside the parentheses. Did its sign change?', 'The −3 should become +3. The answer is 6x − 2.': 'The −3 is in the FIRST expression. Only the second expression changes signs.'}, hint='Subtract EVERY term of the second expression.', sol='−(2x − 5) = −2x + 5. 8x − 2x = 6x and −3 + 5 = 2. Answer: 6x + 2.')]))
T.append(dict(
    title='Rewriting Expressions to Show Meaning', nav='Meaning', std='NC.7.EE.2',
    words=[('Equivalent expressions', 'expressions that are equal for every value of the variable.')],
    big='Different forms of the same expression can tell different stories. Adding 5% to a price p is p + 0.05p. Rewritten, it is 1.05p: the new price is 105% of the old price.',
    fill=['p + 0.05p = {{1.05}}p', 'A 20% discount: p − 0.2p = {{0.8}}p, which means you pay {{80}}% of the price.', 'Perimeter of a rectangle: 2L + 2W = {{2}}(L + W)'],
    examples=[dict(title='Example: a square garden with side s has a 2 ft path around it. The fence is 4(s + 4) ft. Write it another way.', steps=['Distribute: 4(s + 4) = 4s + 16', '4s is the garden\'s perimeter. 16 is the extra fence for the path.', '<b>4s + 16</b> shows the extra 16 ft clearly.'])],
    warn='Two expressions are equivalent only if they are equal for EVERY value of the variable, not just one.',
    np=[Q(1, 'A shirt costs p dollars. The tax is 7%. The total is p + 0.07p. Write it as one term: the total = □p. What goes in the box?', ans=1.07, hint='p is 1p. 1 + 0.07 = ?', sol='p + 0.07p = 1.07p.'),
        Q(2, 'A store marks every item down 25%. Which expression shows the sale price of an item that costs c dollars?', ch=['0.75c', '0.25c', 'c − 25', '1.25c'], why={'0.25c': 'That is the amount you SAVE, not what you pay.', 'c − 25': 'That takes off $25, not 25%.', '1.25c': 'That ADDS 25%. A markdown takes away.'}, hint='c − 0.25c = ?', sol='c − 0.25c = 0.75c. You pay 75% of the price.'),
        Q(3, 'Two expressions show the cost of a field trip for n students: 12n + 60 and 12(n + 5). What does the 5 in 12(n + 5) most likely mean?', ch=['5 more people (like adults) also pay $12 each', 'Each student pays $5', 'The bus costs $5', 'There are 5 students'], why={'Each student pays $5': 'Each person pays the 12. The 5 is added to n, the number of students.', 'The bus costs $5': 'The extra cost is 12 × 5 = 60, not 5.', 'There are 5 students': 'n is the number of students. The 5 is added to it.'}, hint='12(n + 5) means 12 dollars for each of (n + 5) people.', sol='12(n + 5) = 12n + 60. The 5 is 5 extra people who each pay $12, for an extra $60.')]))

PART2 = [
    ('A. Simplify and Expand', 'NC.7.EE.1', [
        Q(1, 'Simplify: 3a − 8 + 5a + 2. What is the coefficient of a?', ans=8, hint='3a + 5a'),
        Q(2, 'Expand and simplify: 2(3x − 4) + 5x', ch=['11x − 8', '11x − 4', '6x − 3', '11x + 8'], why={'11x − 4': 'Multiply the −4 by 2 too.', '6x − 3': 'Distribute first: 2 × 3x = 6x, then add 5x.', '11x + 8': '2 × (−4) is negative.'}, hint='2(3x − 4) = 6x − 8. Then add 5x.'),
        Q(3, 'Simplify: ' + F('2', '3') + '(9x + 6) − (4x − 1)', ch=['2x + 5', '2x + 3', '10x + 5', '2x + 7'], why={'2x + 3': 'Check the sign: −(4x − 1) gives +1, not −1. Redo the constants.', '10x + 5': 'Subtract the x-terms: 6x − 4x.', '2x + 7': 'You kept 6 instead of multiplying it. What is 2/3 × 6?'}, hint='2/3 × 9x = 6x, 2/3 × 6 = 4. Then subtract each term of (4x − 1).', sol='6x + 4 − 4x + 1 = 2x + 5.')]),
    ('B. Factor', 'NC.7.EE.1', [
        Q(1, 'What is the GCF of 14x and 35?', ans=7, hint='List the factors of 14 and 35.'),
        Q(2, 'Factor completely: 18x + 27', ch=['9(2x + 3)', '3(6x + 9)', '9(2x + 27)', '18(x + 9)'], why={'3(6x + 9)': '6x + 9 still has a common factor of 3.', '9(2x + 27)': 'Divide 27 by 9 too.', '18(x + 9)': '18 does not divide 27.'}, hint='GCF of 18 and 27 is 9.'),
        Q(3, 'Which is NOT equivalent to 12x − 8?', ch=['4(3x − 8)', '4(3x − 2)', '2(6x − 4)', '−4(−3x + 2)'], why={'4(3x − 2)': 'Distribute: 12x − 8. It IS equivalent.', '2(6x − 4)': 'Distribute: 12x − 8. It IS equivalent.', '−4(−3x + 2)': 'Distribute: 12x − 8. It IS equivalent.'}, hint='Distribute each choice. Which one does not give 12x − 8?')]),
    ('C. Expressions in Context', 'NC.7.EE.2', [
        Q(1, 'A rectangle is (x + 3) long and 4 wide. Its area is 4(x + 3). If x = 5, what is the area?', ans=32, hint='4(5 + 3)'),
        Q(2, 'Tickets cost $8 each plus a $2 fee each. Which expression is the cost of t tickets?', ch=['10t', '8t + 2', '8 + 2t', '16t'], why={'8t + 2': 'The $2 fee is for EACH ticket: 2t.', '8 + 2t': 'Each ticket costs 8, so 8t.', '16t': 'Add the costs: 8 + 2.'}, hint='Each ticket costs 8 + 2. Then multiply by t.', sol='8t + 2t = 10t.'),
        Q(3, 'A phone costs p dollars. It is on sale for 30% off, then a 6% tax is added to the sale price. Which expression is the final cost?', ch=['1.06(0.7p)', '0.7p + 0.06', 'p − 0.3 + 0.06', '1.36p'], why={'0.7p + 0.06': 'The tax is 6% OF the sale price, so multiply by 1.06.', 'p − 0.3 + 0.06': 'Those take off 30 cents and add 6 cents, not percents.', '1.36p': '30% off makes the price smaller, not bigger.'}, hint='Sale price: 0.7p. Then add 6%: multiply by 1.06.', sol='Sale price = 0.7p. With tax: 1.06 × 0.7p = 0.742p.')]),
]

PRACTICE = dict(title='Unit 2 Practice — Expressions', sub='Like terms · Distribute · Factor · Add & subtract · Meaning', secs=[
    ('A. Combine Like Terms', 'NC.7.EE.1', 'Like terms have the same variable part. Add or subtract their coefficients.', [
        Q(1, 'Simplify: 9x − 2x + 4. What is the coefficient of x?', ans=7, hint='9 − 2'),
        Q(1, 'Simplify: −3y + 7 + 5y − 10. What is the constant?', ans=-3, hint='7 − 10'),
        Q(2, 'Simplify: 0.6n − 1.2 + 0.9n + 3', ch=['1.5n + 1.8', '1.5n − 4.2', '0.3n + 1.8', '3.3n'], why={'1.5n − 4.2': 'Keep the sign of each constant: −1.2 + 3 = 1.8.', '0.3n + 1.8': 'Add the n-terms: 0.6 + 0.9.', '3.3n': 'n-terms and constants are not like terms.'}, hint='n-terms: 0.6n + 0.9n. Constants: −1.2 + 3.'),
        Q(3, 'Simplify: ' + F('2', '5') + 'k − 3 − k + ' + F('1', '2'), ch=['−' + F('3', '5') + 'k − 2' + F('1', '2'), F('3', '5') + 'k − 2' + F('1', '2'), '−' + F('3', '5') + 'k − 3' + F('1', '2'), F('7', '5') + 'k − 2' + F('1', '2')], why={F('3', '5') + 'k − 2' + F('1', '2'): '2/5 − 1 is negative.', '−' + F('3', '5') + 'k − 3' + F('1', '2'): '−3 + 1/2 = −2 1/2.', F('7', '5') + 'k − 2' + F('1', '2'): '−k means subtract 1k.'}, hint='−k is −1k. 2/5 − 5/5 = ?')]),
    ('B. Distributive Property', 'NC.7.EE.1', 'Multiply the outside number by every term inside. A negative outside changes every sign.', [
        Q(1, 'Expand 7(x − 3). What is the constant?', ans=-21, hint='7 × (−3)'),
        Q(2, 'Expand: −5(2x + 4)', ch=['−10x − 20', '−10x + 20', '10x − 20', '−10x + 4'], why={'−10x + 20': '−5 × 4 is negative.', '10x − 20': '−5 × 2x is negative.', '−10x + 4': 'Multiply the 4 by −5 too.'}, hint='−5 × 2x and −5 × 4'),
        Q(2, 'Expand ' + F('3', '4') + '(12x − 8). What is the coefficient of x?', ans=9, hint='3/4 × 12'),
        Q(3, 'Simplify: 4(x + 2) − 3(x − 1)', ch=['x + 11', 'x + 5', 'x + 7', '7x + 11'], why={'x + 5': '−3 × (−1) = +3, so 8 + 3.', 'x + 7': 'Check both constants. What is 4 × 2? What is −3 × (−1)? Add them.', '7x + 11': 'You added the x-terms. The second part is minus 3(x − 1), so subtract: 4x − 3x.'}, hint='4x + 8 − 3x + 3')]),
    ('C. Factor', 'NC.7.EE.1', 'Find the GCF, put it outside, divide each term by it. Check by distributing.', [
        Q(1, 'What is the GCF of 16x and 40?', ans=8, hint='Biggest number that divides 16 and 40.'),
        Q(2, 'Factor: 21x − 14', ch=['7(3x − 2)', '7(3x − 14)', '3(7x − 14)', '14(x − 1)'], why={'7(3x − 14)': 'You took out the 7 but left −14 as it was. Divide every term by the GCF. What is −14 ÷ 7?', '3(7x − 14)': '3 does not divide 14.', '14(x − 1)': '14 does not divide 21x.'}, hint='GCF of 21 and 14.'),
        Q(3, 'Factor with a negative GCF: −10x − 25 = −5(2x + □). What number goes in the box?', ans=5, hint='−25 ÷ (−5)')]),
    ('D. Add and Subtract Expressions', 'NC.7.EE.1', 'Subtracting an expression: change the sign of EVERY term in it, then combine.', [
        Q(1, 'Add: (2x + 7) + (5x − 3). What is the coefficient of x?', ans=7, hint='2x + 5x'),
        Q(2, 'Subtract: (9m − 4) − (2m + 6)', ch=['7m − 10', '7m + 2', '11m − 10', '7m − 2'], why={'7m + 2': '−(2m + 6) = −2m − 6, so −4 − 6.', '11m − 10': 'You added the m-terms. The minus sign goes to 2m too: 9m − 2m.', '7m − 2': 'Subtract 6: −4 − 6 = −10.'}, hint='9m − 4 − 2m − 6'),
        Q(3, 'The perimeter of a triangle is 12x + 5. Two sides are 3x + 1 and 4x − 2. Which is the third side?', ch=['5x + 6', '5x + 4', '19x + 4', '5x + 8'], why={'5x + 4': 'Subtracting 4x − 2 means you ADD 2. Redo the constants: 5 − 1, then subtract −2.', '19x + 4': 'Subtract the two sides from the perimeter, do not add them.', '5x + 8': 'You added the 1 instead of subtracting it. Redo the constants: 5 − 1, then subtract −2.'}, hint='12x + 5 − (3x + 1) − (4x − 2)')]),
    ('E. Expressions with Meaning', 'NC.7.EE.2', 'Rewrite to see the story: p + 0.1p = 1.1p means 110% of p.', [
        Q(1, 'A price p goes up 15%. The new price is p + 0.15p = □p. What goes in the box?', ans=1.15, hint='1 + 0.15'),
        Q(2, 'Which is equivalent to b − 0.4b?', ch=['0.6b', '0.4b', 'b − 0.4', '1.4b'], why={'0.4b': 'b − 0.4b is 1b − 0.4b.', 'b − 0.4': 'The 0.4 is 0.4 OF b.', '1.4b': 'You added. b − 0.4b means take 0.4b away from 1b.'}, hint='1 − 0.4'),
        Q(3, 'Sam earns $10 an hour plus a $3 bonus each hour on weekends. Which expression shows his pay for h weekend hours, and what does it show?', ch=['13h: he earns $13 for each weekend hour', '10h + 3: he earns a $3 bonus once', '3h: he only earns the bonus', '10 + 3h: he earns $10 once'], why={'10h + 3: he earns a $3 bonus once': 'The bonus is each hour, so it is 3h.', '3h: he only earns the bonus': 'He also earns $10 each hour.', '10 + 3h: he earns $10 once': 'The $10 is each hour too.'}, hint='10h + 3h = ?')]),
])
