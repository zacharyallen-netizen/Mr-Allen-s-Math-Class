/************************************************************************
 *  FLUENCY LAB — Module 1 Fluency Check (Add & Subtract)
 *  Auto-builds a self-grading Google Form quiz with step-by-step
 *  feedback on every wrong answer.
 *
 *  HOW TO RUN (about 2 minutes, one time):
 *   1. Go to  script.google.com  →  New project.
 *   2. Delete the sample code, paste ALL of this file, click Save.
 *   3. Click  Run  (the ▶ button).  Choose  buildM1Form.
 *   4. Google asks permission the first time → Review permissions →
 *      pick your account → Allow.  (It only edits Forms you own.)
 *   5. Open  View ▸ Execution log.  It prints two links:
 *        • EDIT link  — open to tweak the form
 *        • SHARE link — give this to students
 *
 *  The form is created in quiz mode: it grades itself, shows each
 *  student their score, and shows the worked fix when they miss.
 *  To send results into the tracker: in the form, Responses ▸ Link to
 *  Sheets, then copy the score column into the Dashboard check column.
 *
 *  The wrong answers are not random — each is a REAL common error
 *  (forgot to carry, "subtracted up", botched a borrow across zero),
 *  so the response data tells you WHICH mistake a student is making.
 *
 *  ---- ANSWER KEY (for your reference) ----
 *   1) 34 + 52   = 86        7) 72 − 48   = 24
 *   2) 47 + 38   = 85        8) 431 − 176 = 255
 *   3) 56 + 27   = 83        9) 402 − 167 = 235
 *   4) 256 + 187 = 443      10) 500 − 146 = 354
 *   5) 368 + 254 = 622      11) 604 − 238 = 366
 *   6) 58 − 23   = 35       12) 503 − 167 = 336 (word problem)
 ************************************************************************/

function buildM1Form() {
  var form = FormApp.create('Fluency Lab · Module 1 Fluency Check — Add & Subtract');
  form.setDescription('One column at a time. Pick an answer for each.');
  form.setIsQuiz(true);
  form.setProgressBar(true);
  form.setShuffleQuestions(false);

  // Name (not graded)
  form.addTextItem().setTitle('Your name').setRequired(true);

  var RIGHT = 'Correct.';

  // [prompt, [choices], correctIndex, incorrectFeedback]
  var Q = [
    ["34 + 52", ["86", "76", "96", "85"], 0, "4 + 2 = 6. 3 + 5 = 8"],
    ["47 + 38", ["75", "85", "715", "815"], 1, "7 + 8 = 15, carry 1. 1 + 4 + 3 = 8"],
    ["56 + 27", ["83", "73", "713", "93"], 0, "6 + 7 = 13, carry 1. 1 + 5 + 2 = 8"],
    ["256 + 187", ["443", "333", "433", "4313"], 0, "6 + 7 = 13, carry 1. 1 + 5 + 8 = 14, carry 1. 1 + 2 + 1 = 4"],
    ["368 + 254", ["622", "512", "632", "5112"], 0, "8 + 4 = 12, carry 1. 1 + 6 + 5 = 12, carry 1. 1 + 3 + 2 = 6"],
    ["58 − 23", ["35", "81", "25", "45"], 0, "8 − 3 = 5. 5 − 2 = 3"],
    ["72 − 48", ["24", "36", "34", "26"], 0, "Borrow: 12 − 8 = 4. 6 − 4 = 2"],
    ["431 − 176", ["255", "345", "265", "355"], 0, "Borrow: 11 − 6 = 5. Borrow: 12 − 7 = 5. 3 − 1 = 2"],
    ["402 − 167", ["235", "365", "245", "335"], 0, "Borrow across the 0: 12 − 7 = 5. 9 − 6 = 3. 3 − 1 = 2"],
    ["500 − 146", ["354", "446", "364", "344"], 0, "Borrow across the 0s: 10 − 6 = 4. 9 − 4 = 5. 4 − 1 = 3"],
    ["604 − 238", ["366", "434", "376", "356"], 0, "Borrow across the 0: 14 − 8 = 6. 9 − 3 = 6. 5 − 2 = 3"],
    ["503 − 167", ["336", "464", "346", "326"], 0, "Borrow across the 0: 13 − 7 = 6. 9 − 6 = 3. 4 − 1 = 3"],
    ["485 + 678", ["1,163", "1,053", "1,153", "10,513"], 0, "5 + 8 = 13, carry 1. 1 + 8 + 7 = 16, carry 1. 1 + 4 + 6 = 11"],
    ["317 − 189", ["128", "272", "138", "228"], 0, "Borrow: 17 − 9 = 8. Borrow: 10 − 8 = 2. 2 − 1 = 1"]
  ];

  Q.forEach(function (q, n) {
    var item = form.addMultipleChoiceItem();
    item.setTitle((n + 1) + ')   ' + q[0]).setRequired(true).setPoints(1);
    var choices = q[1].map(function (txt, i) { return item.createChoice(String(txt), i === q[2]); });
    item.setChoices(choices);
    item.setFeedbackForIncorrect(FormApp.createFeedback().setText(q[3]).build());
    item.setFeedbackForCorrect(FormApp.createFeedback().setText(RIGHT).build());
  });

  Logger.log('================  Fluency Lab Module 1 form created  ================');
  Logger.log('EDIT  (you): ' + form.getEditUrl());
  Logger.log('SHARE (students): ' + form.getPublishedUrl());
  Logger.log('Total points: ' + Q.length);
}
