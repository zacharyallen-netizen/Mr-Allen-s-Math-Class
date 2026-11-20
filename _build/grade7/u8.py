from lib import Q, F, Fr
from figs import dotplot, boxplot, table, RUST, BLU, OLV
from statistics import mean, median

def mad(d):
    m = Fr(sum(d), len(d)); return sum(abs(x - m) for x in d) / len(d)
def quart(d):
    d = sorted(d); n = len(d); lo, hi = d[:n // 2], d[(n + 1) // 2:]
    return Fr(median(lo)), Fr(median(hi))

D1 = [2, 4, 4, 5, 6, 6, 6, 7, 8, 9, 9]           # dot plot in topic 3
assert mean(D1) == 6 and median(D1) == 6 and max(D1) - min(D1) == 7
q1, q3 = quart(D1); assert q1 == 4 and q3 == 8
D2 = [3, 5, 6, 8, 8]; assert mean(D2) == 6 and mad(D2) == Fr(8, 5)
D3 = [10, 12, 14, 16, 18]; assert mad(D3) == Fr(12, 5) and mean(D3) == 14
assert Fr(12, 50) * 600 == 144 and Fr(9, 40) * 800 == 180 and Fr(18, 60) * 450 == 135
A = [4, 5, 5, 6, 6, 6, 7, 7, 8]; B = [8, 9, 9, 10, 10, 10, 11, 11, 12]
assert mean(A) == 6 and mean(B) == 10 and mad(A) == mad(B) and Fr(10 - 6) / mad(A) == 4 / mad(A)
assert mad(A) == Fr(8, 9)
assert median([12, 15, 15, 18, 20, 22, 30]) == 18 and sum([12, 15, 15, 18, 20, 22, 30]) == 132
assert mean([7, 9, 10, 10, 14]) == 10 and median([3, 8, 9, 12, 20, 21]) == Fr(21, 2) and mad([4, 6, 8, 10]) == 2
assert Fr(15, 75) * 900 == 180 and (20 - 14) / 2 == 3

UNIT = dict(
    n=8, title='Statistics', short='Statistics', icon='📊',
    tag='Use random samples to make predictions, and compare two groups with centers and spreads.',
    desc='Tell a fair sample from a biased one, use a sample to predict about a population, find mean, median, range, IQR and MAD, and compare two groups.',
    stds=[('NC.7.SP.1', 'Understand that statistics can be used to learn about a population from a sample; random samples are more likely to represent it.'),
          ('NC.7.SP.2', 'Use data from a random sample to draw inferences about a population; see how much samples vary.'),
          ('NC.7.SP.3', 'Judge how much two data sets overlap: compare the difference in centers to a measure of spread.'),
          ('NC.7.SP.4', 'Use measures of center and variability from random samples to compare two populations.')],
    ican=['I can tell if a sample is random and fair, or biased',
          'I can use a random sample to predict something about a whole population',
          'I can find the mean, median, range, IQR and MAD of a data set',
          'I can compare two data sets by their centers and spreads and say how much they overlap',
          'I can use samples to compare two populations and explain my answer'],
    vocab=[('Population', 'the whole group you want to know about'), ('Sample', 'a part of the population that you actually ask or measure'),
           ('Random sample', 'every member of the population has the same chance to be picked'), ('Biased sample', 'a sample that leans one way and does not represent the population'),
           ('Mean', 'the sum ÷ how many'), ('Median', 'the middle value in order'), ('Range', 'greatest − least'),
           ('Interquartile range (IQR)', 'Q3 − Q1, the spread of the middle half'), ('Mean absolute deviation (MAD)', 'the average distance of the data from the mean')],
)
T = []
T.append(dict(
    title='Populations and Samples', nav='Samples', std='NC.7.SP.1',
    words=[('Population', 'the WHOLE group.'), ('Sample', 'part of the group.'), ('Random sample', 'everyone has an equal chance to be picked.'), ('Biased', 'leans one way; not fair.')],
    big='We use a <b>sample</b> to learn about a <b>population</b> when we cannot ask everyone. A <b>random</b> sample that is big enough usually represents the population well. A biased sample does not.',
    table=(['Question: favorite school lunch?', 'Sample', 'Fair or biased?'], [['Ask 40 names drawn from a hat of all students', 'random', '{{fair}}'], ['Ask the first 40 students in the pizza line', 'convenience', '{{biased}}'], ['Ask the 10 members of the cooking club', 'small, one group', '{{biased}}']]),
    examples=[dict(title='Example: a town wants to know if people want a new park. Which sample is best?', steps=['Asking people AT the old park leans toward park lovers: biased.', 'Asking 5 neighbors is too small.', '<b>Best: pick 200 addresses at random from the whole town list.</b>'])],
    warn='A big sample can still be biased. Asking 500 people at a soccer game about favorite sports leans toward soccer.',
    np=[Q(1, 'A school has 600 students. Ms. Lee asks 50 of them. How many students are in the POPULATION?', ans=600, hint='The population is the whole group.', sol='The population is all 600 students. The 50 are the sample.'),
        Q(2, 'Which sample is random?', ch=['Pick 30 student ID numbers by a computer from all students', 'Ask the first 30 students who arrive', 'Ask 30 students on the basketball team', 'Ask 30 students who volunteer online'],
          why={'Ask the first 30 students who arrive': 'Early students may be alike (bus riders, morning clubs). Not everyone had the same chance.', 'Ask 30 students on the basketball team': 'Only one group could be picked.', 'Ask 30 students who volunteer online': 'People who choose to answer are often different from the rest.'},
          hint='Random = every student has the same chance.', sol='A computer picking from ALL students gives everyone the same chance.'),
        Q(3, 'A survey about bedtimes asks 200 students at a late-night school dance. Why is it biased?', ch=['Students at a late-night dance probably stay up later than most.', '200 students is too many.', 'It is not biased because it is a big sample.', 'Bedtimes cannot be surveyed.'],
          why={'200 students is too many.': 'Big samples are fine. The problem is WHO was asked.', 'It is not biased because it is a big sample.': 'Size does not fix who was picked.', 'Bedtimes cannot be surveyed.': 'They can, with a fair sample.'},
          hint='Who was asked? Are they like all students?', sol='Students at a late dance lean toward later bedtimes, so the sample is not like the population.')]))
T.append(dict(
    title='Making Predictions from a Sample', nav='Predictions', std='NC.7.SP.2',
    words=[('Inference', 'a conclusion about the population from a sample.')],
    big='Find the fraction (or percent) in the sample. Multiply it by the size of the population. Different random samples give a little different answers, so a prediction is an <b>estimate</b>.',
    fill=['12 of 50 sampled students walk to school. That is {{24}}%.', 'For all 600 students: 0.24 × 600 = {{144}} walkers (about).'],
    examples=[dict(title='Example: 9 of 40 light bulbs in a sample are broken. About how many of 800 bulbs are broken?', steps=['Sample fraction: 9/40 = 0.225', '0.225 × 800 = 180', '<b>About 180 broken bulbs</b>'])],
    warn='Use the sample fraction, then scale up to the WHOLE population, not to the number you have not asked.',
    np=[Q(1, 'In a random sample, 18 of 60 students like art best. About how many of 450 students like art best?', ans=135, hint='18/60 = 0.3. Then 0.3 × 450.', sol='0.3 × 450 = 135.'),
        Q(2, 'Two random samples of 50 students each: 20 and 24 like rap. What is the best estimate of the percent of all students who like rap?', ch=['about 44%', 'exactly 40%', 'exactly 48%', 'about 22%'],
          why={'exactly 40%': 'That uses only one sample, and a sample cannot be EXACT for the whole school.', 'exactly 48%': 'That uses only one sample. Combine both.', 'about 22%': '44 of 100 is 44%, not 22%.'},
          hint='Combine: 20 + 24 out of 100.', sol='44 of 100 = 44%. It is an estimate, so "about".'),
        Q(3, 'In a random sample of 75 fish, 15 are trout. A lake has about 900 fish. How many trout should you expect?', ans=180, hint='15/75 = 0.2', sol='0.2 × 900 = 180 trout.')]))
T.append(dict(
    title='Center and Spread', nav='Center & Spread', std='NC.7.SP.4',
    words=[('Mean', 'add, then divide by how many.'), ('Median', 'the middle when in order.'), ('IQR', 'Q3 − Q1.'), ('MAD', 'average distance from the mean.')],
    big='Centers: <b>mean</b> and <b>median</b>. Spreads: <b>range</b>, <b>IQR</b> and <b>MAD</b>. Use mean and MAD when the data is balanced. Use median and IQR when the data is lopsided or has an outlier.',
    fig=dotplot(D1, 0, 10, label='Books read this month'), figcap='11 students: 2, 4, 4, 5, 6, 6, 6, 7, 8, 9, 9.',
    fill=['Mean: 66 ÷ 11 = {{6}}', 'Median (6th value): {{6}}', 'Range: 9 − 2 = {{7}}', 'Q1 = 4, Q3 = 8, IQR = {{4}}'],
    examples=[dict(title='Example: find the MAD of 3, 5, 6, 8, 8', steps=['Mean: 30 ÷ 5 = 6', 'Distances from 6: 3, 1, 0, 2, 2', 'Average distance: 8 ÷ 5 = 1.6', '<b>MAD = 1.6</b>'])],
    warn='Put the data in order before you find the median or quartiles.',
    np=[Q(1, 'Find the mean of 7, 9, 10, 10, 14.', ans=10, hint='Add them, then divide by 5.', sol='50 ÷ 5 = 10.'),
        Q(2, 'Find the median of 12, 3, 20, 9, 21, 8.', ch=['10.5', '9', '12', '12.17'],
          why={'9': 'Put them in order first: 3, 8, 9, 12, 20, 21. There are two middle numbers.', '12': 'Put them in order first. With 6 numbers, use the two middle ones.', '12.17': 'That is the mean. The median is the middle.'},
          hint='Order: 3, 8, 9, 12, 20, 21. Middle two: 9 and 12.', sol='(9 + 12) ÷ 2 = 10.5.'),
        Q(3, 'Find the MAD of 4, 6, 8, 10.', ans=2, hint='Mean = 7. Distances: 3, 1, 1, 3.', sol='Mean = 7. Distances add to 8. 8 ÷ 4 = 2.')]))
T.append(dict(
    title='Comparing Two Data Sets', nav='Compare', std='NC.7.SP.3',
    words=[('Overlap', 'how much the two groups share the same values.'), ('Difference of means in MADs', '(difference of the means) ÷ MAD. Bigger = less overlap.')],
    big='To compare two groups, look at the <b>difference of the centers</b> and the <b>spread</b>. If the centers are far apart compared with the spread (2 or more MADs), the groups are really different.',
    fig=dotplot(A, 3, 13, label='Group A') + dotplot(B, 3, 13, label='Group B'),
    figcap='Mean of A = 6. Mean of B = 10. Both MADs ≈ 0.9. The means are about 4.5 MADs apart: very little overlap.',
    fill=['Difference of means: 10 − 6 = {{4}}', 'The MAD is about 0.9, so the means are about {{4.5}} MADs apart.'],
    examples=[dict(title='Example: two classes\' test scores have means 80 and 86. Both MADs are 3. How far apart are the means?', steps=['86 − 80 = 6', '6 ÷ 3 = 2', '<b>2 MADs apart</b>: a clear difference, but some overlap.'])],
    warn='A difference in means means more when the spread is SMALL. A 5-point difference is big if MAD = 1, and small if MAD = 10.',
    np=[Q(1, 'Group means are 14 and 20. Both MADs are 2. How many MADs apart are the means?', ans=3, hint='(20 − 14) ÷ 2', sol='6 ÷ 2 = 3 MADs.'),
        Q(2, 'Which pair of groups overlaps the MOST?', ch=['Means 50 and 52, MADs 8', 'Means 50 and 70, MADs 2', 'Means 50 and 60, MADs 1', 'Means 20 and 40, MADs 4'],
          why={'Means 50 and 70, MADs 2': '20 ÷ 2 = 10 MADs apart. That is very little overlap.', 'Means 50 and 60, MADs 1': '10 ÷ 1 = 10 MADs apart. Very little overlap.', 'Means 20 and 40, MADs 4': '20 ÷ 4 = 5 MADs apart. Not much overlap.'},
          hint='Find (difference of means) ÷ MAD for each. Smallest = most overlap.', sol='2 ÷ 8 = 0.25 MAD apart: lots of overlap.'),
        Q(3, 'Box plots: Team A median 18, IQR 6. Team B median 24, IQR 6. Which is the best statement?', fig=boxplot([('Team A', [10, 15, 18, 21, 26], RUST), ('Team B', [16, 21, 24, 27, 32], BLU)], 8, 34, 2), ch=['Team B usually scores more, but the teams overlap a lot.', 'Team B always scores more than Team A.', 'The teams score the same because the IQRs match.', 'Team A usually scores more.'],
          why={'Team B always scores more than Team A.': 'The plots overlap: Team A\'s best games (up to 26) beat Team B\'s low games (from 16).', 'The teams score the same because the IQRs match.': 'Same spread does not mean same center. Compare the medians.', 'Team A usually scores more.': 'Compare the medians: which is bigger?'},
          hint='Compare the medians. Then look at how much the plots overlap.', sol='Median B (24) > median A (18), a difference of 1 IQR. The plots overlap a lot.')]))
T.append(dict(
    title='Comparing Populations with Samples', nav='Compare Populations', std='NC.7.SP.4',
    words=[('Comparative inference', 'a conclusion that compares two populations using random samples from each.')],
    big='Take random samples from BOTH populations. Compare their centers (mean or median) and spreads. Say what is <b>likely</b> true, using the numbers.',
    fig=table(['', '7th graders', '8th graders'], [['Sample size', 20, 20], ['Median sleep (hours)', 8.5, 7.5], ['IQR (hours)', 1, 1]]),
    figcap='Random samples of 20 from each grade.',
    examples=[dict(title='Example: what can you say from the table?', steps=['Medians: 8.5 vs 7.5, a 1-hour difference.', 'IQRs are both 1, so the difference is 1 IQR.', '<b>7th graders likely sleep more than 8th graders, but many students in both grades sleep the same amount.</b>'])],
    warn='Use words like "likely" or "usually". A sample cannot prove that EVERY member is the same.',
    np=[Q(1, 'Random samples: 6th grade median reading time 20 min; 7th grade median 32 min. How many more minutes is the 7th grade median?', ans=12, hint='32 − 20', sol='32 − 20 = 12 minutes.'),
        Q(2, 'Two samples of plant heights: Sunny mean 30 cm, MAD 2. Shady mean 24 cm, MAD 2. Which inference is best?', ch=['Plants in the sun likely grow taller.', 'Every sunny plant is taller than every shady plant.', 'Sun makes no difference.', 'Shady plants likely grow taller.'],
          why={'Every sunny plant is taller than every shady plant.': 'A sample shows what is LIKELY, not what is true for every plant.', 'Sun makes no difference.': 'The means are 6 ÷ 2 = 3 MADs apart. That is a clear difference.', 'Shady plants likely grow taller.': 'Compare the means again: which is bigger?'},
          hint='Find how many MADs apart the means are.', sol='30 − 24 = 6, which is 3 MADs. Sunny plants are likely taller.'),
        Q(3, 'Sample A: 15 of 75 students walk to school. The school has 900 students. Sample B (another school of 900): 27 of 75 walk. About how many MORE students walk at the second school?', ans=144, hint='A: 0.2 × 900. B: 0.36 × 900.', sol='A: 180. B: 324. 324 − 180 = 144 more.')]))

PART2 = [
    ('A. Samples and Predictions', 'NC.7.SP.1', [
        Q(1, 'In a random sample, 12 of 50 students walk to school. About how many of 600 students walk?', ans=144, hint='12/50 = 0.24'),
        Q(2, 'Which question would get a biased answer if you only asked people at a gym?', ch=['How many days a week do you exercise?', 'What is your favorite color?', 'What month were you born in?', 'How many siblings do you have?'],
          why={'What is your favorite color?': 'Being at a gym is not tied to favorite colors.', 'What month were you born in?': 'Being at a gym has nothing to do with birth months.', 'How many siblings do you have?': 'Gym-goers are not likely to have more or fewer siblings.'}, hint='Which answer would people at a gym lean toward?'),
        Q(3, '9 of 40 bulbs in a random sample are broken. About how many of 800 bulbs are broken?', ans=180, hint='9/40 × 800')]),
    ('B. Center and Spread', 'NC.7.SP.4', [
        Q(1, 'Find the median of 12, 15, 15, 18, 20, 22, 30.', ans=18, hint='7 numbers: the 4th one.'),
        Q(2, 'Find the MAD of 10, 12, 14, 16, 18.', ans=2.4, hint='Mean 14. Distances 4, 2, 0, 2, 4.'),
        Q(3, 'Data: 12, 15, 15, 18, 20, 22, 30 (minutes). Which center is the better choice and why?', ch=['The median, because 30 pulls the mean up.', 'The mean, because it uses every number.', 'The range, because it is the biggest.', 'The mean, because there is no outlier.'],
          why={'The mean, because it uses every number.': 'Using every number means one far-off value (30) can pull it.', 'The range, because it is the biggest.': 'The range is a spread, not a center.', 'The mean, because there is no outlier.': 'Look at 30: it is far from the rest.'}, hint='Is the data lopsided? Is there a value far from the rest?')]),
    ('C. Compare Two Groups', 'NC.7.SP.3', [
        Q(1, 'Means 80 and 86. Both MADs are 3. How many MADs apart are the means?', ans=2, hint='6 ÷ 3'),
        Q(2, 'Group A mean 6, Group B mean 10, both MADs about 0.9. Which is true?', ch=['The groups barely overlap.', 'The groups overlap almost completely.', 'The groups are the same.', 'You cannot compare groups with means.'],
          why={'The groups overlap almost completely.': '4 ÷ 0.9 ≈ 4.5 MADs apart. That is a lot.', 'The groups are the same.': 'The means are different by 4.', 'You cannot compare groups with means.': 'Comparing means and MADs is exactly how we compare.'}, hint='(10 − 6) ÷ 0.9'),
        Q(3, 'Two samples: Bus A trips have a median of 25 min, IQR 4. Bus B: median 25 min, IQR 12. Which bus is more predictable?', ch=['Bus A, because its IQR is smaller.', 'Bus B, because its IQR is bigger.', 'They are the same because the medians match.', 'Bus B, because it is faster.'],
          why={'Bus B, because its IQR is bigger.': 'A bigger IQR means the times are more spread out.', 'They are the same because the medians match.': 'Same center, but compare the spreads.', 'Bus B, because it is faster.': 'The medians are the same, so neither is faster.'}, hint='Predictable = less spread.')]),
]

PRACTICE = dict(title='Unit 8 Practice — Statistics', sub='Samples · Predictions · Center & spread · Compare groups · Compare populations', secs=[
    ('A. Populations and Samples', 'NC.7.SP.1', 'Random: everyone has the same chance. Biased: leans one way.', [
        Q(1, 'A survey asks 80 of the 1,000 people in a town. How many people are in the sample?', ans=80, hint='The sample is the part you ask.'),
        Q(2, 'To learn the favorite sport of 7th graders, which sample is best?', ch=['40 names drawn at random from a list of all 7th graders', '40 students at a basketball game', 'The first 40 students in the gym', '4 friends'],
          why={'40 students at a basketball game': 'They lean toward basketball.', 'The first 40 students in the gym': 'Early gym students may be alike. Not everyone had a chance.', '4 friends': 'Too small, and friends are often alike.'}, hint='Random and big enough.')]),
    ('B. Predictions', 'NC.7.SP.2', 'Sample fraction × population.', [
        Q(1, 'A random sample of 40 shows 10 like science best. About how many of 320 students like science best?', ans=80, hint='10/40 = 0.25'),
        Q(2, 'Three random samples of 20: 6, 5 and 7 chose blue. What is the best estimate for the percent who chose blue?', ch=['30%', '25%', '35%', '18%'],
          why={'25%': 'That uses one sample only. Combine all three.', '35%': 'That uses one sample only. Combine all three.', '18%': '18 is the total count, not the percent. 18 of 60 is what percent?'}, hint='18 out of 60.'),
        Q(3, 'In a sample of 50 phones, 2 are broken. A store has 1,250 phones. About how many are broken?', ans=50, hint='2/50 = 0.04')]),
    ('C. Center and Spread', 'NC.7.SP.4', 'Mean, median, range, IQR, MAD.', [
        Q(1, 'Find the mean of 4, 8, 9, 11, 13.', ans=9, hint='45 ÷ 5'),
        Q(2, 'Find the range of 15, 3, 22, 9, 17.', ans=19, hint='22 − 3'),
        Q(2, 'Data: 2, 4, 4, 5, 6, 6, 6, 7, 8, 9, 9. What is the IQR?', fig=dotplot(D1, 0, 10), ch=['4', '7', '6', '8'],
          why={'7': 'That is the range (9 − 2). The IQR uses Q1 and Q3.', '6': 'That is the median.', '8': 'That is Q3. Subtract Q1.'}, hint='Q1 = 4 and Q3 = 8.'),
        Q(3, 'Find the MAD of 3, 5, 6, 8, 8.', ans=1.6, hint='Mean 6. Distances 3, 1, 0, 2, 2.')]),
    ('D. Compare Two Groups', 'NC.7.SP.3', '(difference of centers) ÷ spread. Bigger = less overlap.', [
        Q(1, 'Means 40 and 52. Both MADs are 4. How many MADs apart are the means?', ans=3, hint='12 ÷ 4'),
        Q(2, 'Which shows the LEAST overlap?', ch=['means 30 and 50, MADs 2', 'means 30 and 34, MADs 4', 'means 30 and 40, MADs 10', 'means 30 and 31, MADs 1'],
          why={'means 30 and 34, MADs 4': '4 ÷ 4 = 1 MAD apart.', 'means 30 and 40, MADs 10': '10 ÷ 10 = 1 MAD apart.', 'means 30 and 31, MADs 1': '1 ÷ 1 = 1 MAD apart.'}, hint='Divide the difference by the MAD for each.')]),
    ('E. Compare Populations', 'NC.7.SP.4', 'Use samples, centers and spreads. Say "likely".', [
        Q(1, 'Sample medians: Class A 72, Class B 81. How many points higher is Class B\'s median?', ans=9, hint='81 − 72'),
        Q(2, 'Random samples: 7th grade median sleep 8.5 h, 8th grade 7.5 h, both IQRs 1 h. Which is best?', ch=['7th graders likely sleep more than 8th graders.', 'Every 7th grader sleeps more than every 8th grader.', 'They sleep the same amount.', '8th graders likely sleep more.'],
          why={'Every 7th grader sleeps more than every 8th grader.': 'Samples show what is likely, not every person.', 'They sleep the same amount.': 'The medians differ by 1 hour, which is 1 IQR.', '8th graders likely sleep more.': 'Which median is bigger?'}, hint='Compare the medians.'),
        Q(3, 'Sample 1: 15 of 75 walk. Sample 2: 27 of 75 walk. Each school has 900 students. About how many more walk at school 2?', ans=144, hint='0.36 × 900 − 0.2 × 900')]),
])
