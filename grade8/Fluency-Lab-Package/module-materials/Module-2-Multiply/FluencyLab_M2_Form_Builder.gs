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
  form.setDescription('Pick an answer for each.');
  form.setIsQuiz(true);
  form.setProgressBar(true);
  form.setShuffleQuestions(false);
  form.addTextItem().setTitle('Your name').setRequired(true);

  var RIGHT = 'Correct.';

  var Q = [
    ["7 × 8", ["56", "54", "63", "48"], 0, "7 × 8 = 56"],
    ["9 × 6", ["54", "56", "45", "63"], 0, "9 × 6 = 54"],
    ["8 × 8", ["64", "56", "72", "48"], 0, "8 × 8 = 64"],
    ["12 × 7", ["84", "72", "96", "77"], 0, "12 × 7 = 84"],
    ["34 × 6", ["204", "184", "244", "210"], 0, "6 × 4 = 24, carry 2. 6 × 3 + 2 = 20"],
    ["47 × 8", ["376", "326", "356", "386"], 0, "8 × 7 = 56, carry 5. 8 × 4 + 5 = 37"],
    ["128 × 4", ["512", "488", "502", "412"], 0, "4 × 8 = 32, carry 3. 4 × 2 + 3 = 11, carry 1. 4 × 1 + 1 = 5"],
    ["23 × 14", ["322", "115", "312", "422"], 0, "23 × 4 = 92. 23 × 10 = 230. 92 + 230 = 322"],
    ["47 × 38", ["1786", "517", "1416", "1886"], 0, "47 × 8 = 376. 47 × 30 = 1410. 376 + 1410 = 1786"],
    ["56 × 24", ["1344", "336", "1244", "1444"], 0, "56 × 4 = 224. 56 × 20 = 1120. 224 + 1120 = 1344"],
    ["63 × 45", ["2835", "567", "2735", "2935"], 0, "63 × 5 = 315. 63 × 40 = 2520. 315 + 2520 = 2835"],
    ["36 × 24", ["864", "216", "764", "964"], 0, "36 × 4 = 144. 36 × 20 = 720. 144 + 720 = 864"],
    ["29 × 6", ["174", "124", "1,254", "164"], 0, "6 × 9 = 54, carry 5. 6 × 2 + 5 = 17"]
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
