/************************************************************************
 *  FLUENCY LAB — Module 8 Fluency Check (Expressions & Order of Operations)
 *  Auto-builds a self-grading Google Form quiz with step-by-step
 *  feedback on every wrong answer.
 *
 *  HOW TO RUN: script.google.com → New project → paste all → Save →
 *  Run → choose buildM8Form → Allow → View ▸ Execution log for links.
 ************************************************************************/

function buildM8Form() {
  var form = FormApp.create('Fluency Lab · Module 8 Fluency Check — Expressions & Order of Operations');
  form.setDescription('Follow GEMS: Groups, Exponents, Multiply/Divide, Add/Subtract. '+
    'You will see your score and the worked steps for anything you miss.');
  form.setIsQuiz(true);
  form.setProgressBar(true);
  form.setShuffleQuestions(false);
  form.addTextItem().setTitle('Your name').setRequired(true);

  var RIGHT = 'Correct — right order, right answer.';

  var Q = [
    ['Evaluate  4^2', ['16','8','12','42'], 0, '4² = 4×4 = 16 (not 4×2).'],
    ['Evaluate  2^3', ['8','6','9','23'], 0, '2³ = 2×2×2 = 8.'],
    ['3 + 4 × 2', ['11','14','10','24'], 0, 'Multiply first: 4×2=8, then 3+8 = 11.'],
    ['20 − 3 × 4', ['8','68','48','12'], 0, 'Multiply first: 3×4=12, then 20−12 = 8.'],
    ['(3 + 4) × 2', ['14','11','9','24'], 0, 'Parentheses first: (3+4)=7, then ×2 = 14.'],
    ['(10 − 4) ÷ 3', ['2','6','1','9'], 0, 'Parentheses first: (10−4)=6, then ÷3 = 2.'],
    ['2 + 3^2', ['11','25','10','8'], 0, 'Exponent first: 3²=9, then 2+9 = 11.'],
    ['5^2 − 10', ['15','0','40','20'], 0, '5²=25, then 25−10 = 15.'],
    ['Evaluate  2x + 1  when  x = 3', ['7','8','6','9'], 0, '2×3 + 1 = 6 + 1 = 7.'],
    ['Evaluate  5x − 4  when  x = 2', ['6','14','9','11'], 0, '5×2 − 4 = 10 − 4 = 6.'],
    ['Evaluate  3a + b  when  a = 4, b = 5', ['17','27','12','21'], 0, '3×4 + 5 = 12 + 5 = 17.'],
    ['Evaluate  2a − b  when  a = 6, b = 3', ['9','15','3','12'], 0, '2×6 − 3 = 12 − 3 = 9.'],
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
