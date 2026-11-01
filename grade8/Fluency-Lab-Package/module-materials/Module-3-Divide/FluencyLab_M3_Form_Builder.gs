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
  form.setDescription('Pick an answer for each.');
  form.setIsQuiz(true);
  form.setProgressBar(true);
  form.setShuffleQuestions(false);
  form.addTextItem().setTitle('Your name').setRequired(true);

  var RIGHT = 'Correct.';

  // [prompt, [choices], correctIndex, incorrectFeedback]
  var Q = [
    ["56 ÷ 7", ["8", "7", "9", "6"], 0, "7 × 8 = 56"],
    ["72 ÷ 8", ["9", "8", "7", "6"], 0, "8 × 9 = 72"],
    ["63 ÷ 9", ["7", "6", "8", "9"], 0, "9 × 7 = 63"],
    ["84 ÷ 6", ["14", "13", "16", "12"], 0, "8 ÷ 6 = 1 r 2. 24 ÷ 6 = 4"],
    ["96 ÷ 4", ["24", "22", "28", "26"], 0, "9 ÷ 4 = 2 r 1. 16 ÷ 4 = 4"],
    ["252 ÷ 7", ["36", "34", "38", "42"], 0, "25 ÷ 7 = 3 r 4. 42 ÷ 7 = 6"],
    ["256 ÷ 4", ["64", "62", "66", "16"], 0, "25 ÷ 4 = 6 r 1. 16 ÷ 4 = 4"],
    ["824 ÷ 4", ["206", "26", "216", "260"], 0, "8 ÷ 4 = 2. 2 ÷ 4 = 0 (write the 0). 24 ÷ 4 = 6"],
    ["98 ÷ 4", ["24 r 2", "24 r 1", "23 r 2", "24"], 0, "9 ÷ 4 = 2 r 1. 18 ÷ 4 = 4 r 2"],
    ["139 ÷ 4", ["34 r 3", "34 r 1", "33 r 3", "35 r 1"], 0, "13 ÷ 4 = 3 r 1. 19 ÷ 4 = 4 r 3"],
    ["253 ÷ 6", ["42 r 1", "42 r 2", "41 r 1", "43 r 1"], 0, "25 ÷ 6 = 4 r 1. 13 ÷ 6 = 2 r 1"],
    ["196 ÷ 7", ["28", "27", "29", "26"], 0, "19 ÷ 7 = 2 r 5. 56 ÷ 7 = 8"],
    ["157 ÷ 5", ["31 r 2", "31 r 1", "30 r 7", "32 r 3"], 0, "15 ÷ 5 = 3. 7 ÷ 5 = 1 r 2"]
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
