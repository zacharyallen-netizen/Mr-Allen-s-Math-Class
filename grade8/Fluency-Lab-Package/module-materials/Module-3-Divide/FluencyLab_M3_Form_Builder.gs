/************************************************************************
 *  FLUENCY LAB — Module 3 Fluency Check (Division)
 *  Auto-builds a self-grading Google Form quiz with step-by-step
 *  feedback on every wrong answer.
 *
 *  HOW TO RUN (about 2 minutes, one time):
 *   1. Go to  script.google.com  →  New project.
 *   2. Delete the sample code, paste ALL of this file, click Save.
 *   3. Click  Run  →  choose  buildM3Form.
 *   4. Review permissions → your account → Allow.
 *   5. Open  View ▸ Execution log  for the EDIT and SHARE links.
 *
 *  Quiz mode: grades itself and shows the worked fix on every miss.
 *  Wrong answers are real errors — a shaky fact, a dropped zero in the
 *  quotient, a mishandled remainder — so the data shows the mistake.
 *  Remainder answers are written as "64 r 1".
 *
 *  ---- ANSWER KEY ----
 *   1) 56 ÷ 7  = 8        7) 256 ÷ 4 = 64
 *   2) 72 ÷ 8  = 9        8) 824 ÷ 4 = 206   (zero in the quotient)
 *   3) 63 ÷ 9  = 7        9) 98 ÷ 4  = 24 r 2
 *   4) 84 ÷ 6  = 14      10) 139 ÷ 4 = 34 r 3
 *   5) 96 ÷ 4  = 24      11) 253 ÷ 6 = 42 r 1
 *   6) 252 ÷ 7 = 36      12) 196 ÷ 7 = 28  (word problem)
 ************************************************************************/

function buildM3Form() {
  var form = FormApp.create('Fluency Lab · Module 3 Fluency Check — Division');
  form.setDescription(
    'Facts first, then long division. Remember: division is multiplication backwards, and you can ' +
    'check any answer by multiplying back. Write remainders like  64 r 1. You will see your score and ' +
    'the worked steps for anything you miss. Racing your own best.');
  form.setIsQuiz(true);
  form.setProgressBar(true);
  form.setShuffleQuestions(false);
  form.addTextItem().setTitle('Your name').setRequired(true);

  var RIGHT = 'Correct — check by multiplying back and you’ll see it fits.';

  // [prompt, [choices], correctIndex, incorrectFeedback]
  var Q = [
    ['56 \u00F7 7 =', ['8','7','9','6'], 0,
      '56 \u00F7 7 = 8 because 7 \u00D7 8 = 56. Reach for the multiplication twin.'],
    ['72 \u00F7 8 =', ['9','8','7','6'], 0,
      '72 \u00F7 8 = 9 because 8 \u00D7 9 = 72.'],
    ['63 \u00F7 9 =', ['7','6','8','9'], 0,
      '63 \u00F7 9 = 7 because 9 \u00D7 7 = 63.'],
    ['84 \u00F7 6 =', ['14','13','16','12'], 0,
      '6 into 8 = 1 (6, leaves 2). Bring down 4 \u2192 24. 6 into 24 = 4. Answer 14. Check: 6 \u00D7 14 = 84.'],
    ['96 \u00F7 4 =', ['24','22','28','26'], 0,
      '4 into 9 = 2 (8, leaves 1). Bring down 6 \u2192 16. 4 into 16 = 4. Answer 24. Check: 4 \u00D7 24 = 96.'],
    ['252 \u00F7 7 =', ['36','34','38','42'], 0,
      '7 into 25 = 3 (21, leaves 4). Bring down 2 \u2192 42. 7 into 42 = 6. Answer 36. Check: 7 \u00D7 36 = 252.'],
    ['256 \u00F7 4 =', ['64','62','66','16'], 0,
      '4 into 25 = 6 (24, leaves 1). Bring down 6 \u2192 16. 4 into 16 = 4. Answer 64. Check: 4 \u00D7 64 = 256.'],
    ['824 \u00F7 4 =', ['206','26','216','260'], 0,
      '4 into 8 = 2; 4 into 2 = 0 \u2014 write the 0! Bring down 4 \u2192 24, 4 into 24 = 6. Answer 206, not 26. Don\u2019t drop the zero.'],
    ['98 \u00F7 4 =', ['24 r 2','24 r 1','23 r 2','24'], 0,
      '4 into 9 = 2 (8, leaves 1). Bring down 8 \u2192 18. 4 into 18 = 4 (16, leaves 2). Answer 24 r 2. Check: 4 \u00D7 24 + 2 = 98.'],
    ['139 \u00F7 4 =', ['34 r 3','34 r 1','33 r 3','35 r 1'], 0,
      '4 into 13 = 3 (12, leaves 1). Bring down 9 \u2192 19. 4 into 19 = 4 (16, leaves 3). Answer 34 r 3. Check: 4 \u00D7 34 + 3 = 139.'],
    ['253 \u00F7 6 =', ['42 r 1','42 r 2','41 r 1','43 r 1'], 0,
      '6 into 25 = 4 (24, leaves 1). Bring down 3 \u2192 13. 6 into 13 = 2 (12, leaves 1). Answer 42 r 1. Check: 6 \u00D7 42 + 1 = 253.'],
    ['A teacher shares 196 pencils equally among 7 tables. How many per table?',
      ['28','27','29','26'], 0,
      '196 \u00F7 7: 7 into 19 = 2 (14, leaves 5). Bring down 6 \u2192 56. 7 into 56 = 8. Answer 28. Check: 7 \u00D7 28 = 196.'],
  ];

  Q.forEach(function (q, n) {
    var item = form.addMultipleChoiceItem();
    item.setTitle((n + 1) + ')   ' + q[0]).setRequired(true).setPoints(1);
    var choices = q[1].map(function (txt, i) { return item.createChoice(String(txt), i === q[2]); });
    item.setChoices(choices);
    item.setFeedbackForIncorrect(FormApp.createFeedback().setText(q[3]).build());
    item.setFeedbackForCorrect(FormApp.createFeedback().setText(RIGHT).build());
  });

  Logger.log('================  Fluency Lab Module 3 form created  ================');
  Logger.log('EDIT  (you): ' + form.getEditUrl());
  Logger.log('SHARE (students): ' + form.getPublishedUrl());
  Logger.log('Total points: ' + Q.length);
}
