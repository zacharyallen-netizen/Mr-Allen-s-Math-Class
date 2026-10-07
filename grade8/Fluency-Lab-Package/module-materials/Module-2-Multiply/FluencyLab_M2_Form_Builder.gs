/************************************************************************
 *  FLUENCY LAB — Module 2 Fluency Check (Multiplication)
 *  Auto-builds a self-grading Google Form quiz with step-by-step
 *  feedback on every wrong answer.
 *
 *  HOW TO RUN (about 2 minutes, one time):
 *   1. Go to  script.google.com  →  New project.
 *   2. Delete the sample code, paste ALL of this file, click Save.
 *   3. Click  Run  →  choose  buildM2Form.
 *   4. Review permissions → your account → Allow (it only edits your Forms).
 *   5. Open  View ▸ Execution log  for the EDIT and SHARE links.
 *
 *  Quiz mode: it grades itself and shows the worked fix on every miss.
 *  The wrong answers are real errors — a shaky fact, a dropped carry,
 *  and (the big one) forgetting the place-value shift on the second
 *  partial product — so the data shows WHICH mistake each student makes.
 *
 *  ---- ANSWER KEY ----
 *   1) 7 × 8    = 56      7) 128 × 4 = 512
 *   2) 9 × 6    = 54      8) 23 × 14 = 322
 *   3) 8 × 8    = 64      9) 47 × 38 = 1786
 *   4) 12 × 7   = 84     10) 56 × 24 = 1344
 *   5) 34 × 6   = 204    11) 63 × 45 = 2835
 *   6) 47 × 8   = 376    12) 36 × 24 = 864  (word problem)
 ************************************************************************/

function buildM2Form() {
  var form = FormApp.create('Fluency Lab · Module 2 Fluency Check — Multiplication');
  form.setDescription(
    'Facts first, then the big ones. For multi-digit problems, use the standard algorithm on paper — ' +
    'and remember the second partial product is the TENS (the place-value shift). You will see your ' +
    'score and the worked steps for anything you miss. Racing your own best.');
  form.setIsQuiz(true);
  form.setProgressBar(true);
  form.setShuffleQuestions(false);
  form.addTextItem().setTitle('Your name').setRequired(true);

  var RIGHT = 'Correct — fast and clean.';

  var Q = [
    ['7 \u00D7 8 =', ['56','54','63','48'], 0,
      '7 \u00D7 8 = 56. Tip: double 7 three times \u2014 7 \u2192 14 \u2192 28 \u2192 56. Lock it in.'],
    ['9 \u00D7 6 =', ['54','56','45','63'], 0,
      '9 \u00D7 6 = 54. \u00D79 trick: 10 \u00D7 6 = 60, minus 6 = 54.'],
    ['8 \u00D7 8 =', ['64','56','72','48'], 0,
      '8 \u00D7 8 = 64. One of the squares worth memorizing cold.'],
    ['12 \u00D7 7 =', ['84','72','96','77'], 0,
      '12 \u00D7 7 = 84. Think (10 \u00D7 7) + (2 \u00D7 7) = 70 + 14 = 84.'],
    ['34 \u00D7 6 =', ['204','184','244','210'], 0,
      'Ones: 6 \u00D7 4 = 24 \u2192 write 4, carry 2. Tens: 6 \u00D7 3 = 18, + 2 = 20  →  204. Don\u2019t drop the carry.'],
    ['47 \u00D7 8 =', ['376','326','356','386'], 0,
      'Ones: 8 \u00D7 7 = 56 \u2192 write 6, carry 5. Tens: 8 \u00D7 4 = 32, + 5 = 37  →  376.'],
    ['128 \u00D7 4 =', ['512','488','502','412'], 0,
      '4 \u00D7 8 = 32 (write 2, carry 3); 4 \u00D7 2 = 8, + 3 = 11 (write 1, carry 1); 4 \u00D7 1 = 4, + 1 = 5  →  512.'],
    ['23 \u00D7 14 =', ['322','115','312','422'], 0,
      'Two partial products: 23 \u00D7 4 = 92, then 23 \u00D7 10 = 230 (the tens \u2014 the shift). Add: 92 + 230 = 322.'],
    ['47 \u00D7 38 =', ['1786','517','1416','1886'], 0,
      'Two partials: 47 \u00D7 8 = 376, then 47 \u00D7 30 = 1410 (NOT 141 \u2014 that\u2019s the place-value shift). 376 + 1410 = 1786.'],
    ['56 \u00D7 24 =', ['1344','336','1244','1444'], 0,
      '56 \u00D7 4 = 224, then 56 \u00D7 20 = 1120 (the shift). 224 + 1120 = 1344.'],
    ['63 \u00D7 45 =', ['2835','567','2735','2935'], 0,
      '63 \u00D7 5 = 315, then 63 \u00D7 40 = 2520 (the shift, not 252). 315 + 2520 = 2835.'],
    ['A theater has 36 rows of 24 seats. How many seats in all?',
      ['864','216','764','964'], 0,
      '36 \u00D7 24: 36 \u00D7 4 = 144, then 36 \u00D7 20 = 720 (the shift). 144 + 720 = 864 seats.'],
  ];

  Q.forEach(function (q, n) {
    var item = form.addMultipleChoiceItem();
    item.setTitle((n + 1) + ')   ' + q[0]).setRequired(true).setPoints(1);
    var choices = q[1].map(function (txt, i) { return item.createChoice(String(txt), i === q[2]); });
    item.setChoices(choices);
    item.setFeedbackForIncorrect(FormApp.createFeedback().setText(q[3]).build());
    item.setFeedbackForCorrect(FormApp.createFeedback().setText(RIGHT).build());
  });

  Logger.log('================  Fluency Lab Module 2 form created  ================');
  Logger.log('EDIT  (you): ' + form.getEditUrl());
  Logger.log('SHARE (students): ' + form.getPublishedUrl());
  Logger.log('Total points: ' + Q.length);
}
