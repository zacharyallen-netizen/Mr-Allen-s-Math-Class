/* Skill Builders · Grade 7 · Unit 5 · Percents (NC.7.RP.3) · Score 3 core skills */
(function () {
  var D = SB.D, C = SB.C, B = SB.G7.board;
  var RP3 = 'NC.7.RP.3';

  function barAnim() {
    var s = '', x0 = 70, W = 500;
    s += D.rect(x0, 30, W, 46, { fill: '#FCEBC8', c: C.navy, w: 2 }) + D.txt(x0 + W / 2, 60, '$60 = 100%', { s: 18 });
    for (var i = 1; i < 10; i++) s += D.line(x0 + i * W / 10, 90, x0 + i * W / 10, 136, { c: '#DCCAA9', w: 1.5, id: 'tk' + i, hide: true });
    s += D.rect(x0, 90, W, 46, { c: C.navy, w: 2 });
    s += D.rect(x0, 90, W * 0.3, 46, { fill: C.gold2, c: C.navy, w: 2, id: 'sh', hide: true });
    s += D.txt(x0 + W * 0.15, 120, '30% = $18', { s: 16, id: 'shl', hide: true });
    var ticks = {}; for (var j = 1; j < 10; j++) ticks['tk' + j] = { o: 1 };
    return B('Find a percent of a number', s, [{ t: '10% of 60 = 6' }, { t: '30% = 3 × 6 = 18' }, { t: '0.30 × 60 = 18', c: C.green }], [
      'What is <b>30% of $60</b>? The whole bar is $60. That is 100%.',
      'Cut the bar into 10 equal parts. Each part is <b>10%</b>, and 60 ÷ 10 = 6.',
      '30% is 3 parts: 3 × 6 = <b>18</b>.',
      'Fast way: change 30% to a decimal, <b>0.30</b>, and multiply: 0.30 × 60 = <b>18</b>.'], { th: 150, extra: { 1: ticks, 2: { sh: { o: 1 }, shl: { o: 1 } } } });
  }
  function saleAnim() {
    return B('Discount and tax', '', [{ t: 'Price: $40' }, { t: '25% off: 0.75 × 40 = 30' }, { t: '6% tax: 1.06 × 30 = 31.80' }, { t: 'Total: $31.80', c: C.green, s: 26 }], [
      'A $40 shoe is <b>25% off</b>. Then 6% tax is added. What do you pay?',
      'Start with the price, <b>$40</b>.',
      '25% off means you pay <b>75%</b>. 0.75 × 40 = <b>$30</b>.',
      'Tax ADDS 6%: you pay <b>106%</b> of the sale price. 1.06 × 30 = 31.80.',
      'You pay <b>$31.80</b>. Take off the discount first, then add tax.']);
  }

  SB.unit({
    n: 5, title: 'Percents', std: 'NC.7.RP.3', std0: RP3, sendUnit: '7-5', pagePre: 'Grade 7 · ',
    lessons: [
      { id: 'g7-5a', title: 'Find a percent of a number', std: RP3, anim: barAnim(),
        hook: 'A sign says 30% off a $60 game. How much do you save? Let\'s find out!',
        big: '<b>Percent</b> means out of 100. To find a percent of a number, change the percent to a decimal and <b>multiply</b>. 30% of 60 = 0.30 × 60.',
        words: [['Percent', 'out of 100: 30% = 30/100 = 0.30'], ['Part', 'the piece you are finding'], ['Whole', 'the full amount, 100%']],
        watch: 'Move the decimal point 2 places to change a percent: 5% = 0.05, not 0.5.',
        walk: { prob: 'Find 15% of 80.', steps: [
          { q: 'Change 15% to a decimal.', ch: ['0.15', ['1.5', 'Move the point 2 places left.', 'What is 15 ÷ 100?'], ['15', 'A percent must be divided by 100.', 'What does percent mean?']], ln: '0.15 × 80' },
          { q: '0.15 × 80 = ?', ch: ['12', ['120', 'Check the decimal: 0.1 × 80 is only 8.', 'Is 15% of 80 more or less than 80?'], ['1.2', 'Too small: 10% of 80 is already 8.', 'What is 10% of 80?']], ln: '= 12' }] },
        checks: [
          { id: 'g75c1', std: RP3, q: 'What is 25% of 48?', ans: 12, hint: '0.25 × 48, or 48 ÷ 4', miss: [[1200, 'Change 25% to 0.25 first.', 'What is 25% as a decimal?'], [36, 'That is 75%. 25% is one quarter.', 'What is 48 ÷ 4?']], sol: ['0.25 × 48 = 12'] },
          { id: 'g75c2', std: RP3, q: 'What is 5% of 200?', ans: 10, hint: '0.05 × 200', miss: [[100, '5% is 0.05, not 0.5.', 'Move the point how many places?'], [1000, 'Change 5% to 0.05 first.', 'What is 5 ÷ 100?']], sol: ['0.05 × 200 = 10'] }
        ],
        can: 'find a percent of a number.',
        recap: ['Percent → decimal: ÷ 100', 'Multiply by the whole', '10% is a handy start'] },

      { id: 'g7-5b', title: 'Discounts, tax and tips', std: RP3, anim: saleAnim(),
        hook: 'Ever wonder why the price at the register is different from the tag? Tax!',
        big: 'A <b>discount</b> takes a percent OFF: pay (100% − discount). <b>Tax</b> and <b>tips</b> ADD a percent: pay (100% + tax). 20% off → × 0.80. 7% tax → × 1.07.',
        words: [['Discount', 'a percent off the price'], ['Tax', 'a percent added to the price'], ['Tip', 'a percent added for service']],
        watch: 'The discount is not the sale price. 20% off $50 saves $10, so you pay $40.',
        walk: { prob: 'A $30 meal. You leave a 20% tip. What is the total?', steps: [
          { q: 'Find the tip: 20% of 30.', ch: ['0.20 × 30 = 6', ['20 × 30 = 600', 'Change 20% to 0.20.', 'What is 20% as a decimal?'], ['30 ÷ 20 = 1.5', 'Multiply by 0.20.', 'Multiply or divide?']], ln: 'tip = 6' },
          { q: 'Total = meal + tip.', ch: ['36', ['6', '6 is just the tip.', 'Did you add the meal?'], ['24', 'A tip ADDS to the bill.', 'Add or subtract?']], ln: '30 + 6 = 36' }] },
        checks: [
          { id: 'g75c3', std: RP3, q: 'A $50 jacket is 20% off. What is the sale price in dollars?', ans: 40, hint: 'Pay 80%: 0.80 × 50', miss: [[10, 'That is how much you SAVE.', 'What do you pay?'], [60, 'A discount takes money OFF.', 'Add or subtract?']], sol: ['0.80 × 50 = 40'] },
          { id: 'g75c4', std: RP3, q: 'A $20 shirt has 5% tax. What is the total?', keep: 1, ch: ['$21', ['$1', '$1 is only the tax.', 'Did you add the price?'], ['$25', '5% of 20 is not 5.', 'What is 0.05 × 20?']], hint: '1.05 × 20' }
        ],
        can: 'find prices with discounts, tax and tips.',
        recap: ['Discount: × (1 − rate)', 'Tax or tip: × (1 + rate)', 'Discount first, then tax'] }
    ],
    practice: [
      { id: 'g75p1', std: RP3, q: 'What is 40% of 70?', ans: 28, hint: '0.4 × 70', miss: [[2800, 'Change 40% to 0.4.', 'What is 40 ÷ 100?'], [42, 'That is 60%.', 'What is 0.4 × 70?']], sol: ['0.4 × 70 = 28'] },
      { id: 'g75p2', std: RP3, q: 'What is 10% of 350?', ans: 35, hint: 'Move the decimal one place left.', miss: [[3.5, 'That is 1%.', 'What is 0.1 × 350?'], [3500, '10% makes it smaller.', 'More or less than 350?']], sol: ['0.1 × 350 = 35'] },
      { id: 'g75p3', std: RP3, q: 'What is 75% of 64?', ans: 48, hint: '0.75 × 64, or 3/4 of 64', miss: [[16, 'That is 25%.', 'What is 3/4 of 64?'], [4800, 'Change 75% to 0.75.', 'What is 75 ÷ 100?']], sol: ['0.75 × 64 = 48'] },
      { id: 'g75p4', std: RP3, q: 'A $80 bike is 25% off. What is the sale price in dollars?', ans: 60, hint: '0.75 × 80', miss: [[20, 'That is the discount.', 'What do you pay?'], [100, 'A discount takes money off.', 'Add or subtract?']], sol: ['0.75 × 80 = 60'] },
      { id: 'g75p5', std: RP3, q: 'A $40 dinner. You tip 15%. How much is the tip in dollars?', ans: 6, hint: '0.15 × 40', miss: [[46, 'That is the total. The question asks for the tip.', 'Tip or total?'], [600, 'Change 15% to 0.15.', 'What is 15 ÷ 100?']], sol: ['0.15 × 40 = 6'] },
      { id: 'g75p6', std: RP3, q: 'A $25 game has 8% tax. What is the total?', keep: 1, ch: ['$27', ['$2', '$2 is only the tax.', 'Did you add the price?'], ['$33', '8% of 25 is not 8.', 'What is 0.08 × 25?']], hint: '1.08 × 25' },
      { id: 'g75p7', std: RP3, q: 'A $90 coat is 10% off. What do you SAVE in dollars?', ans: 9, hint: '0.10 × 90', miss: [[81, 'That is what you pay. The question asks what you save.', 'Save or pay?'], [80, '10% of 90 is 9, not 10.', 'What is 0.1 × 90?']], sol: ['0.10 × 90 = 9'] },
      { id: 'g75p8', std: RP3, q: 'Which shows a $50 price after a 30% discount?', keep: 1, ch: ['0.70 × 50', ['0.30 × 50', 'That is the discount, not the price.', 'What percent do you PAY?'], ['1.30 × 50', 'That ADDS 30%.', 'Add or take off?']], hint: 'You pay 100% − 30%.' }
    ]
  });
})();
