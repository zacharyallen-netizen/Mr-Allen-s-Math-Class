/************************************************************************
 *  FLUENCY LAB — Module 6 Fluency Check (Integers)
 *  Auto-builds a self-grading Google Form quiz with step-by-step
 *  feedback on every wrong answer.
 *
 *  HOW TO RUN: script.google.com → New project → paste all → Save →
 *  Run → choose buildM6Form → Allow → View ▸ Execution log for links.
 ************************************************************************/

function buildM6Form() {
  var form = FormApp.create('Fluency Lab · Module 6 Fluency Check — Integers');
  form.setDescription('Subtracting is adding the opposite; for × and ÷, same signs give positive and different signs give negative. '+
    'Type negatives with a minus sign. You will see your score and the worked steps for anything you miss.');
  form.setIsQuiz(true);
  form.setProgressBar(true);
  form.setShuffleQuestions(false);
  form.addTextItem().setTitle('Your name').setRequired(true);

  var RIGHT = 'Correct — sign and value both right.';

  var Q = [
    ['-7 + -5', ['-12','12','-2','2'], 0, 'Same sign: add the values (7+5=12), keep the sign → -12.'],
    ['-8 + 3', ['-5','5','-11','11'], 0, 'Different signs: 8-3=5, keep the sign of the bigger (negative) → -5.'],
    ['6 + (-9)', ['-3','3','-15','15'], 0, 'Different signs: 9-6=3, bigger is negative → -3.'],
    ['5 - (-3)', ['8','2','-8','-2'], 0, 'Subtracting a negative is adding: 5 + 3 = 8.'],
    ['-4 - 6', ['-10','2','10','-2'], 0, '-4 - 6 = -4 + (-6) = -10.'],
    ['-2 - (-9)', ['7','-11','-7','11'], 0, '-2 - (-9) = -2 + 9 = 7.'],
    ['(-4) × 6', ['-24','24','-10','10'], 0, 'Different signs → negative: -24.'],
    ['(-3) × (-7)', ['21','-21','10','-10'], 0, 'Same signs → positive: 21.'],
    ['(-40) ÷ 8', ['-5','5','-32','32'], 0, 'Different signs → negative: -5.'],
    ['(-56) ÷ (-7)', ['8','-8','49','-49'], 0, 'Same signs → positive: 8.'],
    ['-3 × 4 + 5', ['-7','-17','7','17'], 0, 'Multiply first: -3×4=-12, then +5 = -7.'],
    ['The temperature was 4° and dropped 11°. What is it now?', ['-7°','7°','15°','-15°'], 0, '4 - 11 = 4 + (-11) = -7°.'],
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
