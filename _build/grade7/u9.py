from lib import Q, F, Fr
from figs import spinner, table, AMB, AMB2, RUST, BLU, OLV

assert Fr(3, 8) == Fr(3, 8) and Fr(1, 6) * 300 == 50 and Fr(18, 60) == Fr(3, 10) and Fr(3, 10) * 500 == 150
assert Fr(2, 5) * 200 == 80 and Fr(4, 10) == Fr(2, 5) and Fr(1, 4) * 80 == 20
assert Fr(3, 6) == Fr(1, 2) and Fr(5, 12) == Fr(5, 12) and Fr(2, 8) == Fr(1, 4)
assert 2 * 3 == 6 and 3 * 4 == 12 and Fr(1, 6) * Fr(1, 2) == Fr(1, 12) and Fr(1, 36) * 6 == Fr(1, 6)
assert 4 * 3 * 2 == 24 and Fr(3, 36) == Fr(1, 12) and Fr(1, 2) ** 3 == Fr(1, 8)
assert Fr(45, 50) * 100 == 90 and Fr(7, 20) == Fr(35, 100) and Fr(1, 4) * 120 == 30 and Fr(6, 36) == Fr(1, 6)

UNIT = dict(
    n=9, title='Probability', short='Probability', icon='🎲',
    tag='Find the chance of events, from one spin to compound events, and use experiments and simulations.',
    desc='Use the 0 to 1 probability scale, find experimental and theoretical probability, make predictions, and find probabilities of compound events with lists, tables and tree diagrams.',
    stds=[('NC.7.SP.5', 'Understand that probability is a number from 0 to 1; near 0 is unlikely, 1/2 is neither, near 1 is likely.'),
          ('NC.7.SP.6', 'Collect data from a chance process to approximate probability; predict relative frequency.'),
          ('NC.7.SP.7', 'Develop a probability model and use it to find probabilities; compare with observed frequencies.'),
          ('NC.7.SP.8', 'Find probabilities of compound events with organized lists, tables, tree diagrams and simulation.')],
    ican=['I can describe how likely an event is with a number from 0 to 1',
          'I can find experimental probability and use it to make predictions',
          'I can find theoretical probability with a probability model',
          'I can list a sample space with a list, table or tree diagram and find compound probabilities',
          'I can compare experimental and theoretical results and design a simulation'],
    vocab=[('Probability', 'a number from 0 to 1 that tells how likely an event is'), ('Outcome', 'one possible result'),
           ('Event', 'one or more outcomes'), ('Sample space', 'the list of ALL possible outcomes'),
           ('Experimental probability', 'times it happened ÷ total trials'), ('Theoretical probability', 'favorable outcomes ÷ all equally likely outcomes'),
           ('Compound event', 'two or more events together, like a coin AND a number cube'), ('Simulation', 'an experiment that models a real situation')],
)
T = []
T.append(dict(
    title='The Probability Scale', nav='Likely?', std='NC.7.SP.5',
    words=[('Impossible', 'probability 0.'), ('Certain', 'probability 1.'), ('Equally likely', 'probability 1/2.')],
    big='Probability is a number from <b>0</b> (impossible) to <b>1</b> (certain). Near 0 is unlikely. 1/2 is as likely as not. Near 1 is likely. It can be a fraction, a decimal or a percent.',
    table=(['Event', 'Probability', 'Words'], [['Roll a 7 on a 1–6 number cube', '0', '{{impossible}}'], ['Flip a coin: heads', '1/2', '{{equally likely}}'], ['Roll a number less than 7', '1', '{{certain}}'], ['Spin red on a spinner that is 90% red', '0.9', '{{likely}}']]),
    examples=[dict(title='Example: a bag has 1 red and 9 blue marbles. Is picking red likely?', steps=['P(red) = 1/10 = 0.1', '0.1 is near 0.', '<b>Unlikely</b>'])],
    warn='A probability can never be more than 1 or less than 0. If you get 5/3, check your work.',
    np=[Q(1, 'A bag has 3 green and 5 yellow marbles. What is P(green)? (Type a fraction.)', ans=Fr(3, 8), show='3/8', hint='green ÷ all marbles', sol='3 green out of 8 marbles: 3/8.'),
        Q(2, 'Which probability means an event is LIKELY?', ch=['0.85', '0.5', '0.15', '1.5'],
          why={'0.5': '0.5 is as likely as not, not likely.', '0.15': '0.15 is near 0, so it is unlikely.', '1.5': 'A probability can not be more than 1.'},
          hint='Likely is near 1.', sol='0.85 is close to 1, so the event is likely.'),
        Q(3, 'A spinner has 4 equal parts: red, red, blue, yellow. Which word fits spinning red?', fig=spinner([('R', 1, RUST), ('R', 1, RUST), ('B', 1, BLU), ('Y', 1, AMB)]), ch=['equally likely as not', 'unlikely', 'likely', 'certain'],
          why={'unlikely': 'Red is 2 of 4 parts. That is half, not near 0.', 'likely': '2 of 4 is half. Likely means MORE than half.', 'certain': 'Blue and yellow can happen too.'},
          hint='P(red) = 2/4.', sol='P(red) = 2/4 = 1/2: as likely as not.')]))
T.append(dict(
    title='Experimental Probability', nav='Experiments', std='NC.7.SP.6',
    words=[('Trial', 'one try of an experiment.'), ('Experimental probability', 'times it happened ÷ number of trials.'), ('Relative frequency', 'another name for experimental probability.')],
    big='<b>Experimental P = times it happened ÷ total trials</b>. Use it to predict: multiply the probability by the number of future trials. The more trials, the closer it usually gets to the theoretical probability.',
    fig=table(['Color', 'Red', 'Blue', 'Green'], [['Times spun', 18, 30, 12]]),
    figcap='60 spins in all.',
    fill=['P(red) = 18/60 = {{3/10}}', 'Predict red in 500 spins: (3/10) × 500 = {{150}}'],
    examples=[dict(title='Example: a basketball player made 40 of 50 free throws. Predict how many of 200 she will make.', steps=['P(make) = 40/50 = 0.8', '0.8 × 200 = 160', '<b>About 160 free throws</b>'])],
    warn='A prediction is an estimate. Real results will be close, not exact.',
    np=[Q(1, 'A coin landed heads 28 times in 50 flips. What is the experimental P(heads) as a decimal?', ans=0.56, hint='28 ÷ 50', sol='28 ÷ 50 = 0.56.'),
        Q(2, 'Tia hit the target 4 times in 10 throws. About how many hits in 200 throws?', ch=['80', '40', '20', '120'],
          why={'40': 'You multiplied by 10. Use the rate 4/10 of 200.', '20': '200 ÷ 10 = 20 sets of 10 throws. Each set has 4 hits.', '120': 'That is the number of MISSES.'},
          hint='4/10 × 200', sol='0.4 × 200 = 80 hits.'),
        Q(3, 'A number cube was rolled 300 times. A 5 came up 72 times. Theory says P(5) = 1/6. How many MORE 5s came up than theory predicts?', ans=22, hint='Theory: (1/6) × 300.', sol='Theory: 50. Actual: 72. 72 − 50 = 22 more.')]))
T.append(dict(
    title='Theoretical Probability', nav='Theory', std='NC.7.SP.7',
    words=[('Theoretical probability', 'favorable outcomes ÷ total outcomes, when all outcomes are equally likely.'), ('Probability model', 'a list of outcomes and their probabilities.')],
    big='<b>P(event) = favorable outcomes ÷ total outcomes</b> (when every outcome is equally likely). In a model, all the probabilities add to 1. P(not A) = 1 − P(A).',
    fig=spinner([('1', 1, RUST), ('2', 1, BLU), ('3', 1, OLV), ('4', 1, AMB), ('5', 1, RUST), ('6', 1, BLU), ('7', 1, OLV), ('8', 1, AMB)]),
    figcap='An 8-part spinner with equal parts.',
    fill=['P(even) = 4/8 = {{1/2}}', 'P(greater than 5) = {{3/8}}', 'P(not 8) = 1 − 1/8 = {{7/8}}'],
    examples=[dict(title='Example: a letter is picked at random from MATH. What is P(vowel)?', steps=['Outcomes: M, A, T, H (4)', 'Vowels: A (1)', '<b>P(vowel) = 1/4</b>'])],
    warn='Only use favorable ÷ total when the outcomes are EQUALLY likely. A spinner with one huge part is not.',
    np=[Q(1, 'A number cube (1–6) is rolled. What is P(number greater than 4)? (Type a fraction.)', ans=Fr(1, 3), show='1/3', hint='Which numbers are greater than 4?', sol='5 and 6: 2 out of 6 = 1/3.'),
        Q(2, 'P(rain) = 0.35. What is P(no rain)?', ch=['0.65', '0.35', '1.35', '0.5'],
          why={'0.35': 'That is P(rain). No rain is everything else.', '1.35': 'Subtract from 1, do not add.', '0.5': 'Rain and no rain are not equally likely here.'},
          hint='P(not A) = 1 − P(A)', sol='1 − 0.35 = 0.65.'),
        Q(3, 'A bag has red, blue and green tiles. P(red) = 1/4 and P(blue) = 1/3. There are 24 tiles. How many are green?', ans=10, hint='P(green) = 1 − 1/4 − 1/3.', sol='P(green) = 12/12 − 3/12 − 4/12 = 5/12. (5/12) × 24 = 10 tiles.')]))
T.append(dict(
    title='Compound Events', nav='Compound', std='NC.7.SP.8',
    words=[('Compound event', 'two or more things happen, like a coin flip AND a roll.'), ('Sample space', 'every possible outcome. Make it with a list, a table or a tree diagram.')],
    big='Find the sample space first. Count all outcomes, count the ones you want, then divide. Quick count: (choices for the 1st) × (choices for the 2nd) × …',
    fig=table(['', 'H', 'T'], [['1', '1H', '1T'], ['2', '2H', '2T'], ['3', '3H', '3T'], ['4', '4H', '4T'], ['5', '5H', '5T'], ['6', '6H', '6T']]),
    figcap='Roll a number cube and flip a coin: 6 × 2 = 12 outcomes.',
    fill=['Number of outcomes: {{12}}', 'P(even and heads) = {{3/12}} = 1/4', 'Three coin flips: 2 × 2 × 2 = {{8}} outcomes'],
    examples=[dict(title='Example: roll two number cubes. What is P(sum is 7)?', steps=['Sample space: 6 × 6 = 36 outcomes.', 'Sum 7: (1,6) (2,5) (3,4) (4,3) (5,2) (6,1) = 6 outcomes', '<b>P = 6/36 = 1/6</b>'])],
    warn='Count every outcome, including the "flipped" ones: (2, 5) and (5, 2) are different outcomes.',
    np=[Q(1, 'A shirt comes in 3 colors and 4 sizes. How many choices are there?', ans=12, hint='3 × 4', sol='3 × 4 = 12.'),
        Q(2, 'Flip a coin 3 times. What is P(all heads)?', ch=['1/8', '1/3', '1/6', '1/2'],
          why={'1/3': 'There are 3 flips, but there are 2 × 2 × 2 outcomes.', '1/6': 'You added 2 + 2 + 2. Multiply: 2 × 2 × 2.', '1/2': 'That is the chance for ONE flip. All three must be heads.'},
          hint='Count the outcomes: 2 × 2 × 2.', sol='8 outcomes, only HHH works: 1/8.'),
        Q(3, 'Roll two number cubes. What is P(the sum is 4)? (Type a fraction.)', ans=Fr(1, 12), show='1/12', hint='List the pairs that add to 4. There are 36 outcomes.', sol='(1,3) (2,2) (3,1): 3 of 36 = 1/12.')]))
T.append(dict(
    title='Simulations and Comparing Results', nav='Simulations', std='NC.7.SP.8',
    words=[('Simulation', 'an experiment that acts out a real situation with coins, number cubes, spinners or random numbers.')],
    big='Pick a tool whose chances MATCH the real situation. Run many trials. Use the results as an estimate. If experimental and theoretical results are far apart, run more trials or check the model.',
    table=(['Real situation', 'Chance', 'Tool'], [['A team wins half its games', '1/2', '{{a coin}}'], ['1 in 6 cereal boxes has a prize', '1/6', '{{a number cube}}'], ['A player makes 3 of 4 shots', '3/4', '{{a 4-part spinner}}']]),
    examples=[dict(title='Example: 1 in 6 boxes has a prize. Simulate how many boxes you buy to get a prize.', steps=['Roll a number cube. A 6 = prize.', 'Count the rolls until you get a 6. That is one trial.', 'Do many trials and find the average.', '<b>Most trials take about 6 boxes, but some take 1 and some take 15!</b>'])],
    warn='A simulation tool must have the SAME probability as the real thing. A coin cannot model a 1/6 chance.',
    np=[Q(1, 'A spinner was spun 120 times. Theory says P(blue) = 1/4. How many blues does theory predict?', ans=30, hint='(1/4) × 120', sol='120 ÷ 4 = 30.'),
        Q(2, 'Which tool can simulate a 1/6 chance that a box has a prize?', ch=['a number cube, with 6 = prize', 'a coin, with heads = prize', 'a 4-part spinner, with red = prize', 'a deck of cards, with red = prize'],
          why={'a coin, with heads = prize': 'A coin has a 1/2 chance, not 1/6.', 'a 4-part spinner, with red = prize': 'One of 4 parts is a 1/4 chance.', 'a deck of cards, with red = prize': 'Half the cards are red: a 1/2 chance.'},
          hint='Which tool gives a 1 out of 6 chance?', sol='A number cube has 6 equally likely sides. One side = 1/6.'),
        Q(3, 'Ben flips a coin 10 times and gets 7 heads. Which is the best explanation?', ch=['With few trials, results can be far from 1/2. More flips should get closer.', 'The coin must be unfair.', 'P(heads) is really 0.7.', 'Heads is more likely after a tail.'],
          why={'The coin must be unfair.': '10 flips is too few to tell. Fair coins often give 7 of 10.', 'P(heads) is really 0.7.': '0.7 is the EXPERIMENTAL result from only 10 flips.', 'Heads is more likely after a tail.': 'A coin does not remember. Each flip is still 1/2.'},
          hint='What happens to experimental results with more trials?', sol='Small samples vary a lot. With many more flips, the results usually get close to 1/2.')]))

PART2 = [
    ('A. Probability Basics', 'NC.7.SP.5', [
        Q(1, 'A bag has 2 red, 3 blue and 5 white cubes. What is P(blue)? (Type a fraction.)', ans=Fr(3, 10), show='3/10', hint='blue ÷ all cubes'),
        Q(2, 'P(event) = 0.02. Which word fits?', ch=['very unlikely', 'likely', 'equally likely', 'impossible'],
          why={'likely': '0.02 is very close to 0.', 'equally likely': 'That would be 0.5.', 'impossible': 'Impossible is exactly 0. 0.02 can still happen.'}, hint='Is 0.02 near 0, 1/2 or 1?'),
        Q(3, 'A spinner: P(red) = 0.3, P(blue) = 0.45. The rest is green. What is P(green)?', ans=0.25, hint='1 − 0.3 − 0.45')]),
    ('B. Experiments and Predictions', 'NC.7.SP.6', [
        Q(1, 'A player made 45 of 50 shots. What PERCENT is that?', ans=90, hint='45 ÷ 50'),
        Q(2, 'In 20 spins, green came up 7 times. About how many greens in 200 spins?', ans=70, hint='7/20 × 200'),
        Q(3, 'A spinner is 1/4 blue. In 80 spins it landed blue 26 times. How many more than expected?', ans=6, hint='Expected: (1/4) × 80.')]),
    ('C. Compound Events', 'NC.7.SP.8', [
        Q(1, 'A meal is 1 of 4 sandwiches, 1 of 3 drinks and 1 of 2 desserts. How many meals?', ans=24, hint='4 × 3 × 2'),
        Q(2, 'Roll two number cubes. What is P(both are 6)? (Type a fraction.)', ans=Fr(1, 36), show='1/36', hint='36 outcomes. How many are (6, 6)?'),
        Q(3, 'Flip a coin and roll a number cube. What is P(tails and a number less than 3)?', ch=['1/6', '1/3', '5/12', '1/12'],
          why={'1/3': 'That is P(less than 3) alone. Tails must also happen.', '5/12': 'You may have counted 3 numbers. Less than 3 means 1 or 2.', '1/12': 'Count again: T1 and T2 are both good outcomes.'}, hint='Outcomes: T1, T2 out of 12.')]),
]

PRACTICE = dict(title='Unit 9 Practice — Probability', sub='Probability scale · Experiments · Theory · Compound events · Simulations', secs=[
    ('A. The Probability Scale', 'NC.7.SP.5', '0 = impossible, 1/2 = as likely as not, 1 = certain.', [
        Q(1, 'A bag has 5 red and 0 blue marbles. What is P(blue)?', ans=0, hint='There are no blue marbles.'),
        Q(2, 'Which number can NOT be a probability?', ch=['4/3', '0', '0.99', '1'],
          why={'0': '0 is a probability: impossible.', '0.99': '0.99 is between 0 and 1: very likely.', '1': '1 is a probability: it means certain.'}, hint='Probabilities go from 0 to 1.')]),
    ('B. Experimental Probability', 'NC.7.SP.6', 'times it happened ÷ trials. Predict by multiplying.', [
        Q(1, 'A tack landed point up 12 times in 40 drops. What is the experimental P(point up) as a decimal?', ans=0.3, hint='12 ÷ 40'),
        Q(2, 'Leo made 3 of every 5 shots. About how many will he make in 60 shots?', ch=['36', '24', '12', '180'],
          why={'24': 'That is the number of misses. Use 3/5.', '12': '60 ÷ 5 = 12 groups of 5. Each group has 3 makes.', '180': 'You multiplied 60 × 3. Use 3/5 of 60.'}, hint='(3/5) × 60'),
        Q(3, 'A cube was rolled 120 times. It showed 1 thirty-five times. Theory says 1/6. How many more than theory predicts?', ans=15, hint='(1/6) × 120 = 20')]),
    ('C. Theoretical Probability', 'NC.7.SP.7', 'favorable ÷ total, when outcomes are equally likely.', [
        Q(1, 'Pick a letter at random from PROBABILITY (11 letters). What is P(B)? (Type a fraction.)', ans=Fr(2, 11), show='2/11', hint='Count the Bs.'),
        Q(2, 'P(win) = 3/8. What is P(not win)?', ch=['5/8', '3/8', '8/3', '1/8'],
          why={'3/8': 'That is P(win). Not winning is everything else.', '8/3': 'A probability cannot be more than 1.', '1/8': 'Subtract 3/8 from 1 = 8/8.'}, hint='1 − 3/8'),
        Q(3, 'A bag has 6 red, 4 blue and some green marbles. P(green) = 1/3. How many green marbles?', ans=5, hint='Red + blue = 10 = 2/3 of the bag.')]),
    ('D. Compound Events', 'NC.7.SP.8', 'Build the sample space. Count. Divide.', [
        Q(1, 'Flip a coin and spin a 3-part spinner (A, B, C). How many outcomes?', ans=6, hint='2 × 3'),
        Q(2, 'Roll two number cubes. What is P(sum is 7)?', ch=['1/6', '1/12', '7/36', '1/36'],
          why={'1/12': 'Count every pair: (1,6) and (6,1) are both outcomes.', '7/36': 'The sum is 7, but there are 6 pairs that make it.', '1/36': 'More than one pair adds to 7.'}, hint='List the pairs that add to 7.'),
        Q(3, 'Flip 4 coins. How many outcomes have exactly 3 heads?', ans=4, hint='The one tail can be in any of the 4 spots.')]),
    ('E. Simulations', 'NC.7.SP.8', 'The tool must match the real chance.', [
        Q(1, 'In 40 trials of a simulation, 10 trials needed 3 or more boxes. What is the estimated probability, as a decimal?', ans=0.25, hint='10 ÷ 40'),
        Q(2, 'A player makes 1 out of 2 free throws. Which tool fits?', ch=['a coin', 'a number cube', 'a 5-part spinner', 'a 10-sided number cube'],
          why={'a number cube': 'Each side is a 1/6 chance, not 1/2.', 'a 5-part spinner': 'Each part is 1/5. 1/2 can not be made with 5 equal parts.', 'a 10-sided number cube': 'It works only if you use 5 sides. A simpler tool has exactly 1/2.'}, hint='Which tool has a 1/2 chance with one side?')]),
])
