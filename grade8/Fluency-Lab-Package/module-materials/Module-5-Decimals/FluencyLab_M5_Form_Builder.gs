/************************************************************************
 *  FLUENCY LAB — Module 5 Fluency Check (Decimals & Percents)
 *  Auto-builds a self-grading Google Form quiz with step-by-step
 *  feedback on every wrong answer.
 *
 *  HOW TO RUN: script.google.com → New project → paste all → Save →
 *  Run → choose buildM5Form → Allow → View ▸ Execution log for links.
 ************************************************************************/

function buildM5Form() {
  var form = FormApp.create('Fluency Lab · Module 5 Fluency Check — Decimals & Percents');
  form.setDescription('Pick an answer for each.');
  form.setIsQuiz(true);
  form.setProgressBar(true);
  form.setShuffleQuestions(false);
  form.addTextItem().setTitle('Your name').setRequired(true);

  var RIGHT = 'Correct.';

  var Q = [
    ["4.3 + 1.19", ["5.49", "5.22", "4.49", "6.49"], 0, "4.30 + 1.19 = 5.49"],
    ["6.52 − 1.4", ["5.12", "5.48", "4.12", "6.38"], 0, "6.52 − 1.40 = 5.12"],
    ["0.6 × 7", ["4.2", "42", "0.42", "4.9"], 0, "6 × 7 = 42. 1 decimal place"],
    ["2.5 × 4", ["10", "1.0", "100", "12"], 0, "25 × 4 = 100. 1 decimal place. → 10.0 = 10"],
    ["Write 0.35 as a percent", ["35%", "3.5%", "350%", "0.35%"], 0, "Move the point 2 right"],
    ["Write 8% as a decimal", ["0.08", "0.8", "8.0", "0.008"], 0, "Move the point 2 left"],
    ["Write ³⁄₄ as a decimal", ["0.75", "0.34", "0.7", "1.33"], 0, "3 ÷ 4 = 0.75"],
    ["Write ¹⁄₅ as a decimal", ["0.2", "0.15", "0.5", "0.25"], 0, "1 ÷ 5 = 0.2"],
    ["25% of 80", ["20", "25", "40", "16"], 0, "0.25 × 80 = 20"],
    ["10% of 350", ["35", "3.5", "350", "105"], 0, "0.10 × 350 = 35"],
    ["50% of 46", ["23", "46", "92", "25"], 0, "0.5 × 46 = 23"],
    ["25% of 40", ["10", "25", "15", "30"], 0, "0.25 × 40 = 10"],
    ["0.4 × 0.3", ["0.12", "1.2", "0.012", "12"], 0, "4 × 3 = 12. 2 decimal places"],
    ["7.2 ÷ 4", ["1.8", "18", "0.18", "2.8"], 0, "72 ÷ 4 = 18. The point goes straight up"],
    ["4.8 ÷ 0.6", ["8", "0.8", "80", "0.08"], 0, "Move both points 1 right: 48 ÷ 6 = 8"],
    ["Write ¹⁄₆ as a decimal", ["0.16̅", "0.16", "0.1̅6̅", "0.6"], 0, "1 ÷ 6 = 0.1666… Only the 6 repeats"]
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
