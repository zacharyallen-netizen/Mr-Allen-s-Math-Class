/************************************************************************
 *  FLUENCY LAB — Module 7 Fluency Check (Ratios & Proportions)
 *  Auto-builds a self-grading Google Form quiz with step-by-step
 *  feedback on every wrong answer.
 *
 *  HOW TO RUN: script.google.com → New project → paste all → Save →
 *  Run → choose buildM7Form → Allow → View ▸ Execution log for links.
 ************************************************************************/

function buildM7Form() {
  var form = FormApp.create('Fluency Lab · Module 7 Fluency Check — Ratios & Proportions');
  form.setDescription('Pick an answer for each.');
  form.setIsQuiz(true);
  form.setProgressBar(true);
  form.setShuffleQuestions(false);
  form.addTextItem().setTitle('Your name').setRequired(true);

  var RIGHT = 'Correct.';

  var Q = [
    ["Simplify 12 : 8", ["3 : 2", "2 : 3", "4 : 2", "6 : 4"], 0, "÷ 4: 12 : 8 = 3 : 2"],
    ["Simplify 30 : 24", ["5 : 4", "6 : 5", "5 : 3", "10 : 8"], 0, "÷ 6: 30 : 24 = 5 : 4"],
    ["2 : 3 = ? : 12", ["8", "6", "9", "4"], 0, "3 × 4 = 12, so 2 × 4 = 8"],
    ["4 : 5 = 16 : ?", ["20", "24", "25", "18"], 0, "4 × 4 = 16, so 5 × 4 = 20"],
    ["180 : 3 = ? : 1", ["60", "54", "45", "90"], 0, "180 ÷ 3 = 60"],
    ["12 : 4 = ? : 1", ["3", "4", "2", "8"], 0, "12 ÷ 4 = 3"],
    ["?⁄₄ = ⁶⁄₈", ["3", "2", "4", "6"], 0, "8 ÷ 2 = 4, so 6 ÷ 2 = 3"],
    ["?⁄₁₀ = ⁹⁄₁₅", ["6", "9", "5", "4"], 0, "⁹⁄₁₅ = ³⁄₅ = ⁶⁄₁₀"],
    ["⁶⁄₈ = ³⁄?", ["4", "6", "5", "2"], 0, "6 ÷ 2 = 3, so 8 ÷ 2 = 4"],
    ["⁴⁄? = ¹²⁄₁₅", ["5", "3", "9", "4"], 0, "12 ÷ 3 = 4, so 15 ÷ 3 = 5"],
    ["⁹⁄₁₂ = ?⁄₄", ["3", "1", "6", "9"], 0, "12 ÷ 3 = 4, so 9 ÷ 3 = 3"],
    ["?⁄₉ = ⁸⁄₁₂", ["6", "5", "8", "4"], 0, "⁸⁄₁₂ = ²⁄₃ = ⁶⁄₉"]
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
