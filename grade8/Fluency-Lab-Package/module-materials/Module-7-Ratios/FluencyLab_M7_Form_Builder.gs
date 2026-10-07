/************************************************************************
 *  FLUENCY LAB — Module 7 Fluency Check (Ratios & Proportions)
 *  Auto-builds a self-grading Google Form quiz with step-by-step
 *  feedback on every wrong answer.
 *
 *  HOW TO RUN: script.google.com → New project → paste all → Save →
 *  Run → choose buildM7Form → Allow → View ▸ Execution log for links.
 ************************************************************************/

function buildM7Form() {
  var form = FormApp.create('Fluency Lab · Module 7 Fluency Check — Ratios & Proportions');
  form.setDescription('Reason with unit rates and scale factors; cross-multiplication is a shortcut for that, not magic. '+
    'Ratios are written a:b. You will see your score and the worked steps for anything you miss.');
  form.setIsQuiz(true);
  form.setProgressBar(true);
  form.setShuffleQuestions(false);
  form.addTextItem().setTitle('Your name').setRequired(true);

  var RIGHT = 'Correct — reasoning holds.';

  var Q = [
    ['Simplify the ratio 12:8', ['3:2','2:3','4:2','6:4'], 0, 'Divide both by 4: 12:8 = 3:2.'],
    ['Simplify the ratio 30:24', ['5:4','6:5','5:3','10:8'], 0, 'Divide both by 6: 30:24 = 5:4.'],
    ['2:3 = ?:12  (find the missing number)', ['8','6','9','4'], 0, '3×4=12, so 2×4=8.'],
    ['4:5 = 16:?  (find the missing number)', ['20','24','25','18'], 0, '4×4=16, so 5×4=20.'],
    ['180 miles in 3 hours is how many miles per hour?', ['60','54','45','90'], 0, '180 ÷ 3 = 60 mph.'],
    ['$12 for 4 pens is how much per pen?', ['$3','$4','$2','$8'], 0, '12 ÷ 4 = $3 per pen.'],
    ['Solve: x/4 = 6/8', ['3','2','4','6'], 0, '6/8 = 3/4, so x/4 = 3/4 → x = 3.'],
    ['Solve: x/10 = 9/15', ['6','9','5','4'], 0, '9/15 = 3/5 = 6/10 → x = 6.'],
    ['Split 30 in the ratio 2:3. What is the smaller part?', ['12','18','15','10'], 0, '2+3=5 shares; 30÷5=6; smaller = 2×6 = 12.'],
    ['Split 40 in the ratio 3:5. What is the larger part?', ['25','15','24','20'], 0, '3+5=8 shares; 40÷8=5; larger = 5×5 = 25.'],
    ['If 3 notebooks cost $9, how much do 5 cost?', ['$15','$12','$18','$14'], 0, 'One costs 9÷3=$3; 5 × $3 = $15.'],
    ['A recipe for 4 uses 6 cups. How many cups for 6?', ['9','8','12','10'], 0, 'Per person: 6÷4 = 1.5 cups; ×6 = 9.'],
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
