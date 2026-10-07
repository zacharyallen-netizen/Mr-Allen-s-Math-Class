/************************************************************************
 *  FLUENCY LAB — Module 4 Fluency Check (Fractions)
 *  Auto-builds a self-grading Google Form quiz with step-by-step
 *  feedback on every wrong answer.
 *
 *  HOW TO RUN (about 2 minutes, one time):
 *   1. Go to  script.google.com  →  New project.
 *   2. Delete the sample code, paste ALL of this file, click Save.
 *   3. Click  Run  →  choose  buildM4Form.
 *   4. Review permissions → your account → Allow.
 *   5. Open  View ▸ Execution log  for the EDIT and SHARE links.
 *
 *  Quiz mode: grades itself and shows the worked fix on every miss.
 *  Wrong answers are real errors — adding the bottoms, finding a common
 *  denominator to multiply, flipping the wrong way — so the data shows
 *  the mistake. Answers are shown in simplest form.
 *
 *  ---- ANSWER KEY (simplest form) ----
 *   1) simplify 6/8      = 3/4        7) 1/2 + 1/3   = 5/6
 *   2) simplify 10/15    = 2/3        8) 5/6 − 1/4   = 7/12
 *   3) 2/3 = ?/12 (num)  = 8          9) 2/3 × 4/5   = 8/15
 *   4) 3/8 + 2/8         = 5/8       10) 3/4 × 2/9   = 1/6
 *   5) 5/6 − 1/6         = 2/3       11) 1/2 ÷ 1/4   = 2
 *   6) 3/4 + 1/4         = 1         12) 2/3 ÷ 4/9   = 3/2
 ************************************************************************/

function buildM4Form() {
  var form = FormApp.create('Fluency Lab · Module 4 Fluency Check — Fractions');
  form.setDescription(
    'Use the real methods: a common denominator to add or subtract, multiply straight across, ' +
    'and to divide, multiply by the reciprocal (flip the second). Give answers in simplest form. ' +
    'You will see your score and the worked steps for anything you miss. Racing your own best.');
  form.setIsQuiz(true);
  form.setProgressBar(true);
  form.setShuffleQuestions(false);
  form.addTextItem().setTitle('Your name').setRequired(true);

  var RIGHT = 'Correct — the real method, in simplest form.';

  // [prompt, [choices], correctIndex, incorrectFeedback]
  var Q = [
    ['Simplify  6/8', ['3/4','6/8','3/8','4/6'], 0,
      'Divide top and bottom by their greatest common factor (2): 6\u00F72=3, 8\u00F72=4 \u2192 3/4.'],
    ['Simplify  10/15', ['2/3','5/7','10/15','3/5'], 0,
      'Greatest common factor of 10 and 15 is 5: 10\u00F75=2, 15\u00F75=3 \u2192 2/3.'],
    ['2/3  =  ?/12   (what is the missing top number?)', ['8','6','4','9'], 0,
      'To turn 3 into 12 you multiply by 4, so multiply the top too: 2\u00D74 = 8.'],
    ['3/8 + 2/8', ['5/8','5/16','6/8','1/4'], 0,
      'Same denominator: add the tops, keep the bottom. 3+2 = 5 \u2192 5/8 (already simplest).'],
    ['5/6 \u2212 1/6', ['2/3','4/6','4/12','1/3'], 0,
      'Same denominator: 5\u22121 = 4 \u2192 4/6, which simplifies to 2/3.'],
    ['3/4 + 1/4', ['1','4/8','1/2','4/4'], 0,
      '3+1 = 4 \u2192 4/4 = 1 whole.'],
    ['1/2 + 1/3', ['5/6','2/5','2/6','3/5'], 0,
      'Common denominator 6: 1/2 = 3/6, 1/3 = 2/6. Add the tops: 3+2 = 5 \u2192 5/6. (Never add the bottoms.)'],
    ['5/6 \u2212 1/4', ['7/12','4/2','1/3','6/10'], 0,
      'Common denominator 12: 5/6 = 10/12, 1/4 = 3/12. 10\u22123 = 7 \u2192 7/12.'],
    ['2/3 \u00D7 4/5', ['8/15','6/8','8/8','2/15'], 0,
      'Multiply straight across: 2\u00D74 = 8 over 3\u00D75 = 15 \u2192 8/15. No common denominator for multiplying.'],
    ['3/4 \u00D7 2/9', ['1/6','6/13','5/13','6/36'], 0,
      '3\u00D72 = 6 over 4\u00D79 = 36 \u2192 6/36, which simplifies to 1/6.'],
    ['1/2 \u00F7 1/4', ['2','1/8','1/2','8'], 0,
      'Flip the second and multiply: 1/2 \u00D7 4/1 = 4/2 = 2. Dividing by 1/4 asks how many quarters are in a half \u2014 two.'],
    ['2/3 \u00F7 4/9', ['3/2','8/27','6/12','2/3'], 0,
      'Flip the second and multiply: 2/3 \u00D7 9/4 = 18/12 = 3/2.'],
  ];

  Q.forEach(function (q, n) {
    var item = form.addMultipleChoiceItem();
    item.setTitle((n + 1) + ')   ' + q[0]).setRequired(true).setPoints(1);
    var choices = q[1].map(function (txt, i) { return item.createChoice(String(txt), i === q[2]); });
    item.setChoices(choices);
    item.setFeedbackForIncorrect(FormApp.createFeedback().setText(q[3]).build());
    item.setFeedbackForCorrect(FormApp.createFeedback().setText(RIGHT).build());
  });

  Logger.log('================  Fluency Lab Module 4 form created  ================');
  Logger.log('EDIT  (you): ' + form.getEditUrl());
  Logger.log('SHARE (students): ' + form.getPublishedUrl());
  Logger.log('Total points: ' + Q.length);
}
