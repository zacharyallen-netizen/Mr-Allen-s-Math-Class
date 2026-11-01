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
  form.setDescription('Order: ( ), powers, × ÷, + −. Pick an answer for each.');
  form.setIsQuiz(true);
  form.setProgressBar(true);
  form.setShuffleQuestions(false);
  form.addTextItem().setTitle('Your name').setRequired(true);

  var RIGHT = 'Correct.';

  var Q = [
    ["4²", ["16", "8", "12", "42"], 0, "4 × 4 = 16"],
    ["2³", ["8", "6", "9", "23"], 0, "2 × 2 × 2 = 8"],
    ["3 + 4 × 2", ["11", "14", "10", "24"], 0, "× first: 4 × 2 = 8. 3 + 8 = 11"],
    ["20 − 3 × 4", ["8", "68", "48", "12"], 0, "× first: 3 × 4 = 12. 20 − 12 = 8"],
    ["(3 + 4) × 2", ["14", "11", "9", "24"], 0, "( ) first: 3 + 4 = 7. 7 × 2 = 14"],
    ["(10 − 4) ÷ 3", ["2", "6", "1", "9"], 0, "( ) first: 10 − 4 = 6. 6 ÷ 3 = 2"],
    ["2 + 3²", ["11", "25", "10", "8"], 0, "Power first: 3² = 9. 2 + 9 = 11"],
    ["5² − 10", ["15", "0", "40", "20"], 0, "Power first: 5² = 25. 25 − 10 = 15"],
    ["2x + 1, x = 3", ["7", "8", "6", "9"], 0, "2 × 3 + 1 = 6 + 1 = 7"],
    ["5x − 4, x = 2", ["6", "14", "9", "11"], 0, "5 × 2 − 4 = 10 − 4 = 6"],
    ["3a + b, a = 4, b = 5", ["17", "27", "12", "21"], 0, "3 × 4 + 5 = 12 + 5 = 17"],
    ["2a − b, a = 6, b = 3", ["9", "15", "3", "12"], 0, "2 × 6 − 3 = 12 − 3 = 9"],
    ["24 ÷ 4 × 2", ["12", "3", "48", "10"], 0, "Left to right: 24 ÷ 4 = 6. 6 × 2 = 12"],
    ["15 − 6 + 2", ["11", "7", "23", "13"], 0, "Left to right: 15 − 6 = 9. 9 + 2 = 11"]
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
