/* Skill Builders · Grade 7 · Unit 8 · Statistics (NC.7.SP.1–4) · Score 3 core skills */
(function () {
  var D = SB.D, C = SB.C, B = SB.G7.board;
  var SP1 = 'NC.7.SP.1', SP2 = 'NC.7.SP.2', SP4 = 'NC.7.SP.4';

  function sampleAnim() {
    var s = '', k = 0;
    for (var r = 0; r < 5; r++) for (var c = 0; c < 12; c++) {
      var pick = [3, 10, 17, 26, 33, 41, 48, 55].indexOf(k) >= 0, x = 70 + c * 42, y = 40 + r * 34;
      s += D.circ(x, y, 11, { fill: k % 4 === 0 ? C.gold2 : '#E9DCC4', c: C.navy, w: 1 });
      if (pick) s += D.circ(x, y, 16, { fill: 'none', c: C.green, w: 3, id: 'p' + k, hide: true });
      k++;
    }
    var show = {}; [3, 10, 17, 26, 33, 41, 48, 55].forEach(function (i) { show['p' + i] = { o: 1 }; });
    return B('Random samples', s, [{ t: 'sample: 2 of 8 are gold = 25%' }, { t: '25% of 600 ≈ 150', c: C.green }], [
      'The <b>population</b> is everyone: here, 60 students. We can not ask all 600 students in the school.',
      'Pick a <b>random sample</b>: every student has the same chance. Here we picked 8.',
      'In the sample, 2 of 8 like gold best. That is <b>25%</b>.',
      'Predict for the whole school of 600: 25% of 600 is about <b>150</b> students.'], { th: 200, extra: { 1: show } });
  }
  function centerAnim() {
    return B('Mean and median', '', [{ t: 'data: 2, 4, 4, 6, 9' }, { t: 'median: 2, 4, (4), 6, 9 → 4' }, { t: 'mean: 25 ÷ 5 = 5', c: C.green }, { t: 'range: 9 − 2 = 7', c: C.blue }], [
      'Here are 5 quiz scores.',
      'Put them in order: <b>2, 4, 4, 6, 9</b>.',
      'The <b>median</b> is the middle number: <b>4</b>.',
      'The <b>mean</b> shares it out evenly: add them (25), then divide by 5. The mean is <b>5</b>.',
      'The <b>range</b> shows the spread: biggest − smallest = 9 − 2 = <b>7</b>.']);
  }

  SB.unit({
    n: 8, title: 'Statistics', std: 'NC.7.SP.1–4', std0: SP1, sendUnit: '7-8', pagePre: 'Grade 7 · ',
    lessons: [
      { id: 'g7-8a', title: 'Samples and predictions', std: SP2, anim: sampleAnim(),
        hook: 'How do they know which show is most popular without asking everyone in the country? Samples!',
        big: 'A <b>sample</b> is part of a <b>population</b>. A <b>random</b> sample (everyone has the same chance) is fair. Use the sample\'s fraction to predict for the whole group.',
        words: [['Population', 'the whole group'], ['Sample', 'part of the group'], ['Random', 'everyone has the same chance'], ['Biased', 'not fair; leans one way']],
        watch: 'Asking only your friends, or only one club, is NOT random.',
        walk: { prob: 'In a random sample, 6 of 30 students walk to school. About how many of 300 walk?', steps: [
          { q: 'What fraction walk in the sample?', ch: ['6/30 = 1/5', ['30/6 = 5', 'Walkers go on top.', 'Part ÷ whole?'], ['6/300', 'Use the sample: 6 out of 30.', 'How many were asked?']], ln: '6/30 = 1/5' },
          { q: '1/5 of 300 = ?', ch: ['60', ['1,500', 'Divide by 5, do not multiply.', 'What is 300 ÷ 5?'], ['6', 'Scale up to 300.', 'How many groups of 30 in 300?']], ln: '300 ÷ 5 = 60' }] },
        checks: [
          { id: 'g78c1', std: SP2, q: 'In a random sample, 10 of 40 like soccer best. About how many of 400 students?', ans: 100, hint: '10/40 = 1/4. 1/4 of 400.', miss: [[10, 'Scale up to 400.', 'How many 40s in 400?'], [1600, 'Take 1/4 of 400.', 'Multiply or divide by 4?']], sol: ['10/40 = 1/4', '400 ÷ 4 = 100'] },
          { id: 'g78c2', std: SP1, q: 'Which sample is random?', keep: 1, ch: ['Pick names out of a hat with every student\'s name', ['Ask the soccer team', 'Only soccer players could be picked.', 'Does everyone have a chance?'], ['Ask your 5 best friends', 'Friends are often alike.', 'Does everyone have a chance?']], hint: 'Random = everyone has the same chance.' }
        ],
        can: 'tell a random sample and use it to predict.',
        recap: ['Random sample = fair', 'Find the sample fraction', 'Multiply by the population'] },

      { id: 'g7-8b', title: 'Mean, median and range', std: SP4, anim: centerAnim(),
        hook: 'What is a "typical" score? There is more than one way to say it!',
        big: '<b>Median</b>: the middle number in order. <b>Mean</b>: add them all, then divide by how many. <b>Range</b>: biggest − smallest (the spread).',
        words: [['Mean', 'sum ÷ count'], ['Median', 'middle value in order'], ['Range', 'biggest − smallest']],
        watch: 'Put the numbers in ORDER before you find the median.',
        walk: { prob: 'Find the median of 7, 3, 9, 5, 1.', steps: [
          { q: 'First, put them in order.', ch: ['1, 3, 5, 7, 9', ['7, 3, 9, 5, 1', 'That is not in order yet.', 'Smallest to biggest?']], ln: '1, 3, 5, 7, 9' },
          { q: 'Which is the middle number?', ch: ['5', ['9', 'That is in the middle of the list before ordering.', 'Middle of the ORDERED list?'], ['25', 'That is the sum.', 'Middle or total?']], ln: 'median = 5' }] },
        checks: [
          { id: 'g78c3', std: SP4, q: 'Find the mean of 4, 6, 8, 10, 12.', ans: 8, hint: 'Add, then divide by 5.', miss: [[40, 'That is the sum. Divide by 5.', 'How many numbers?'], [6, 'Divide the sum by 5.', 'What is 40 ÷ 5?']], sol: ['4 + 6 + 8 + 10 + 12 = 40', '40 ÷ 5 = 8'] },
          { id: 'g78c4', std: SP4, q: 'Find the range of 12, 5, 20, 9.', ans: 15, hint: '20 − 5', miss: [[8, 'Use the biggest and the smallest.', 'Biggest − smallest?'], [46, 'That is the sum.', 'Subtract, do not add.']], sol: ['20 − 5 = 15'] }
        ],
        can: 'find the mean, median and range.',
        recap: ['Median: middle in order', 'Mean: sum ÷ count', 'Range: biggest − smallest'] }
    ],
    practice: [
      { id: 'g78p1', std: SP2, q: 'Sample: 3 of 20 people chose blue. About how many of 200 people?', ans: 30, hint: '3/20 of 200', miss: [[3, 'Scale up to 200.', 'How many 20s in 200?'], [60, '3/20, not 3/10.', 'What is 200 ÷ 20?']], sol: ['200 ÷ 20 = 10', '3 × 10 = 30'] },
      { id: 'g78p2', std: SP2, q: 'Sample: 8 of 50 phones are broken. About how many of 500?', ans: 80, hint: '8/50 of 500', miss: [[8, 'Scale up to 500.', 'How many 50s in 500?']], sol: ['500 ÷ 50 = 10', '8 × 10 = 80'] },
      { id: 'g78p3', std: SP1, q: 'To find the favorite lunch of the school, which is best?', keep: 1, ch: ['Ask 50 students picked at random', ['Ask 50 students in the pizza line', 'They probably like pizza.', 'Is it fair?'], ['Ask 3 students', 'Too small.', 'Is 3 enough?']], hint: 'Random and big enough.' },
      { id: 'g78p4', std: SP4, q: 'Find the median of 8, 2, 6, 4, 10.', ans: 6, hint: 'Order: 2, 4, 6, 8, 10.', miss: [[30, 'That is the sum.', 'Middle or total?'], [4, 'Put them in order first.', 'Smallest to biggest?']], sol: ['2, 4, 6, 8, 10', 'median = 6'] },
      { id: 'g78p5', std: SP4, q: 'Find the mean of 3, 5, 7, 9.', ans: 6, hint: 'Sum 24 ÷ 4', miss: [[24, 'Divide the sum by 4.', 'How many numbers?'], [8, 'Divide 24 by 4.', 'What is 24 ÷ 4?']], sol: ['24 ÷ 4 = 6'] },
      { id: 'g78p6', std: SP4, q: 'Find the range of 15, 22, 8, 30.', ans: 22, hint: '30 − 8', miss: [[75, 'That is the sum.', 'Subtract?'], [7, 'Use biggest and smallest.', 'Biggest − smallest?']], sol: ['30 − 8 = 22'] },
      { id: 'g78p7', std: SP4, q: 'Median of 1, 3, 5, 7?', keep: 1, ch: ['4', ['5', 'There are 2 middle numbers: 3 and 5.', 'What is halfway between 3 and 5?'], ['16', 'That is the sum.', 'Middle or total?']], hint: 'Two middle numbers: find halfway.' },
      { id: 'g78p8', std: SP1, q: 'Which sample is biased?', keep: 1, ch: ['Asking people at a gym how often they exercise', ['Drawing 40 names from all students', 'That is random.', 'Does everyone have a chance?'], ['Using a computer to pick 100 random addresses', 'That is random.', 'Does everyone have a chance?']], hint: 'Biased = leans one way.' }
    ]
  });
})();
