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
  form.setDescription('Pick an answer for each.');
  form.setIsQuiz(true);
  form.setProgressBar(true);
  form.setShuffleQuestions(false);
  form.addTextItem().setTitle('Your name').setRequired(true);

  var RIGHT = 'Correct.';

  var Q = [
    ["−7 + (−5)", ["−12", "12", "−2", "2"], 0, "Same signs: 7 + 5 = 12. Keep the −"],
    ["−8 + 3", ["−5", "5", "−11", "11"], 0, "Different signs: 8 − 3 = 5. −8 is farther from 0"],
    ["6 + (−9)", ["−3", "3", "−15", "15"], 0, "Different signs: 9 − 6 = 3. −9 is farther from 0"],
    ["5 − (−3)", ["8", "2", "−8", "−2"], 0, "5 + 3 = 8"],
    ["−4 − 6", ["−10", "2", "10", "−2"], 0, "−4 + (−6) = −10"],
    ["−2 − (−9)", ["7", "−11", "−7", "11"], 0, "−2 + 9 = 7"],
    ["(−4) × 6", ["−24", "24", "−10", "10"], 0, "Different signs"],
    ["(−3) × (−7)", ["21", "−21", "10", "−10"], 0, "Same signs"],
    ["(−40) ÷ 8", ["−5", "5", "−32", "32"], 0, "Different signs"],
    ["(−56) ÷ (−7)", ["8", "−8", "49", "−49"], 0, "Same signs"],
    ["(−6) × (−8)", ["48", "−48", "−14", "14"], 0, "Same signs"],
    ["4 − 11", ["−7", "7", "15", "−15"], 0, "4 + (−11) = −7"],
    ["−5 + (−9)", ["−14", "4", "−4", "14"], 0, "Same signs: 5 + 9 = 14. Keep the −"]
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
