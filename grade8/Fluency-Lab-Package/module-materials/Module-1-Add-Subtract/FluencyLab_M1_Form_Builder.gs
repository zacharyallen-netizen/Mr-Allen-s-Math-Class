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
  form.setDescription(
    'Work each problem on paper using the standard algorithm (stack it, right to left, ' +
    'carry or borrow when you need to). Pick your answer. You will see your score at the end — ' +
    'and the worked steps for anything you miss. You are racing your own best, nobody else.');
  form.setIsQuiz(true);
  form.setProgressBar(true);
  form.setShuffleQuestions(false);

  // Name (not graded)
  form.addTextItem().setTitle('Your name').setRequired(true);

  var RIGHT = 'Correct — clean work with the standard algorithm.';

  // [prompt, [choices], correctIndex, incorrectFeedback]
  var Q = [
    ['34 + 52 =', ['86','76','96','85'], 0,
      'Line up ones under ones and tens under tens, then add each column: 4 + 2 = 6, 3 + 5 = 8  →  86.'],
    ['47 + 38 =', ['75','85','715','815'], 1,
      'Ones: 7 + 8 = 15 → write 5 and CARRY the 1. Tens: 1 + 4 + 3 = 8  →  85.'],
    ['56 + 27 =', ['83','73','713','93'], 0,
      'Ones: 6 + 7 = 13 → write 3, carry 1. Tens: 1 + 5 + 2 = 8  →  83. Don\u2019t forget the carry.'],
    ['256 + 187 =', ['443','333','433','4313'], 0,
      'Carry twice: 6 + 7 = 13 (write 3, carry 1); 1 + 5 + 8 = 14 (write 4, carry 1); 1 + 2 + 1 = 4  →  443.'],
    ['368 + 254 =', ['622','512','632','5112'], 0,
      'Ones: 8 + 4 = 12 (carry 1); tens: 1 + 6 + 5 = 12 (carry 1); hundreds: 1 + 3 + 2 = 6  →  622.'],
    ['58 \u2212 23 =', ['35','81','25','45'], 0,
      'Subtract each column, top minus bottom: 8 \u2212 3 = 5, 5 \u2212 2 = 3  →  35. (This one is subtraction, not addition.)'],
    ['72 \u2212 48 =', ['24','36','34','26'], 0,
      '2 \u2212 8 won\u2019t go, so borrow: 12 \u2212 8 = 4; the tens drop to 6; 6 \u2212 4 = 2  →  24. Always top minus bottom.'],
    ['431 \u2212 176 =', ['255','345','265','355'], 0,
      'Borrow where needed: 11 \u2212 6 = 5; then 2 \u2212 7 borrow → 12 \u2212 7 = 5; 3 \u2212 1 = 2  →  255. Never \u201Csubtract up.\u201D'],
    ['402 \u2212 167 =', ['235','365','245','335'], 0,
      'Borrow THROUGH the 0: hundreds 4 → 3, tens 0 → 10, then 10 → 9 and ones 2 → 12. Now 12 \u2212 7 = 5; 9 \u2212 6 = 3; 3 \u2212 1 = 2  →  235.'],
    ['500 \u2212 146 =', ['354','446','364','344'], 0,
      'Borrow through both zeros: ones 10 \u2212 6 = 4; tens 9 \u2212 4 = 5; hundreds 4 \u2212 1 = 3  →  354.'],
    ['604 \u2212 238 =', ['366','434','376','356'], 0,
      '0 tens can\u2019t give — borrow through: ones 14 \u2212 8 = 6; tens 9 \u2212 3 = 6; hundreds 5 \u2212 2 = 3  →  366.'],
    ['A class library had 503 books. 167 were checked out. How many remain?',
      ['336','464','346','326'], 0,
      '503 \u2212 167: borrow through the 0 → ones 13 \u2212 7 = 6; tens 9 \u2212 6 = 3; hundreds 4 \u2212 1 = 3  →  336 books.'],
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
