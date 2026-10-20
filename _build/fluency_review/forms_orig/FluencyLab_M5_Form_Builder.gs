/************************************************************************
 *  FLUENCY LAB — Module 5 Fluency Check (Decimals & Percents)
 *  Auto-builds a self-grading Google Form quiz with step-by-step
 *  feedback on every wrong answer.
 *
 *  HOW TO RUN: script.google.com → New project → paste all → Save →
 *  Run → choose buildM5Form → Allow → View ▸ Execution log for links.
 ************************************************************************/

function buildM5Form() {
  var form = FormApp.create('Fluency Lab · Module 5 Fluency Check — Decimals & Percents');
  form.setDescription('Line up the decimal points to add or subtract; count decimal places to multiply; '+
    'move the point two places to convert percents. You will see your score and the worked steps for anything you miss.');
  form.setIsQuiz(true);
  form.setProgressBar(true);
  form.setShuffleQuestions(false);
  form.addTextItem().setTitle('Your name').setRequired(true);

  var RIGHT = 'Correct — place value kept straight.';

  var Q = [
    ['4.3 + 1.19', ['5.49','5.22','4.49','6.49'], 0, 'Line up the points: 4.30 + 1.19 = 5.49.'],
    ['6.52 − 1.4', ['5.12','5.48','4.12','6.38'], 0, 'Line up the points: 6.52 − 1.40 = 5.12.'],
    ['0.6 × 7', ['4.2','42','0.42','4.9'], 0, '6×7=42, and 0.6 has one decimal place, so 0.6×7 = 4.2.'],
    ['2.5 × 4', ['10','1.0','100','12'], 0, '25×4=100; one decimal place → 10.0 = 10.'],
    ['Write 0.35 as a percent', ['35%','3.5%','350%','0.35%'], 0, 'Multiply by 100: 0.35 = 35%.'],
    ['Write 8% as a decimal', ['0.08','0.8','8.0','0.008'], 0, 'Divide by 100: 8% = 0.08.'],
    ['Write 3/4 as a decimal', ['0.75','0.34','0.7','1.33'], 0, 'Top ÷ bottom: 3 ÷ 4 = 0.75.'],
    ['Write 1/5 as a decimal', ['0.2','0.15','0.5','0.25'], 0, '1 ÷ 5 = 0.2.'],
    ['25% of 80', ['20','25','40','16'], 0, '0.25 × 80 = 20.'],
    ['10% of 350', ['35','3.5','350','105'], 0, '0.10 × 350 = 35.'],
    ['50% of 46', ['23','46','92','25'], 0, 'Half of 46 is 23.'],
    ['A $40 shirt is 25% off. How much is taken off?', ['$10','$25','$15','$30'], 0, '25% of 40 = 0.25 × 40 = $10 off.'],
  ];

  Q.forEach(function (q, n) {
    var item = form.addMultipleChoiceItem();
    item.setTitle((n + 1) + ')   ' + q[0]).setRequired(true).setPoints(1);
    var choices = q[1].map(function (txt, i) { return item.createChoice(String(txt), i === q[2]); });
    item.setChoices(choices);
    item.setFeedbackForIncorrect(FormApp.createFeedback().setText(q[3]).build());
    item.setFeedbackForCorrect(FormApp.createFeedback().setText(RIGHT).build());
  });

  Logger.log('EDIT  (you): ' + form.getEditUrl());
  Logger.log('SHARE (students): ' + form.getPublishedUrl());
}
