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
  form.setDescription('Simplest form. Pick an answer for each.');
  form.setIsQuiz(true);
  form.setProgressBar(true);
  form.setShuffleQuestions(false);
  form.addTextItem().setTitle('Your name').setRequired(true);

  var RIGHT = 'Correct.';

  // [prompt, [choices], correctIndex, incorrectFeedback]
  var Q = [
    ["Simplify ⁶⁄₈", ["³⁄₄", "⁶⁄₈", "³⁄₈", "⁴⁄₆"], 0, "÷ 2: ⁶⁄₈ = ³⁄₄"],
    ["Simplify ¹⁰⁄₁₅", ["²⁄₃", "⁵⁄₇", "¹⁰⁄₁₅", "³⁄₅"], 0, "÷ 5: ¹⁰⁄₁₅ = ²⁄₃"],
    ["²⁄₃ = ?⁄₁₂", ["8", "6", "4", "9"], 0, "3 × 4 = 12, so 2 × 4 = 8"],
    ["³⁄₈ + ²⁄₈", ["⁵⁄₈", "⁵⁄₁₆", "⁶⁄₈", "¹⁄₄"], 0, "3 + 2 = 5"],
    ["⁵⁄₆ − ¹⁄₆", ["²⁄₃", "⁶⁄₆", "⁴⁄₁₂", "¹⁄₃"], 0, "5 − 1 = 4 → ⁴⁄₆ = ²⁄₃"],
    ["³⁄₄ + ¹⁄₄", ["1", "⁴⁄₈", "¹⁄₂", "⁴⁄₁₆"], 0, "3 + 1 = 4 → ⁴⁄₄ = 1"],
    ["¹⁄₂ + ¹⁄₃", ["⁵⁄₆", "²⁄₅", "²⁄₆", "³⁄₅"], 0, "³⁄₆ + ²⁄₆ = ⁵⁄₆"],
    ["⁵⁄₆ − ¹⁄₄", ["⁷⁄₁₂", "⁴⁄₂", "¹⁄₃", "⁶⁄₁₀"], 0, "¹⁰⁄₁₂ − ³⁄₁₂ = ⁷⁄₁₂"],
    ["²⁄₃ × ⁴⁄₅", ["⁸⁄₁₅", "⁶⁄₈", "⁸⁄₈", "²⁄₁₅"], 0, "2 × 4 = 8. 3 × 5 = 15"],
    ["³⁄₄ × ²⁄₉", ["¹⁄₆", "⁶⁄₁₃", "⁵⁄₁₃", "²⁷⁄₈"], 0, "⁶⁄₃₆ = ¹⁄₆"],
    ["¹⁄₂ ÷ ¹⁄₄", ["2", "¹⁄₈", "¹⁄₂", "8"], 0, "¹⁄₂ × ⁴⁄₁ = ⁴⁄₂ = 2"],
    ["²⁄₃ ÷ ⁴⁄₉", ["³⁄₂", "⁸⁄₂₇", "⁶⁄₁₂", "²⁄₃"], 0, "²⁄₃ × ⁹⁄₄ = ¹⁸⁄₁₂ = ³⁄₂"],
    ["Write 2 ³⁄₄ as an improper fraction", ["¹¹⁄₄", "⁹⁄₄", "⁶⁄₄", "²³⁄₄"], 0, "2 × 4 + 3 = 11"],
    ["Write ¹⁷⁄₅ as a mixed number", ["3 ²⁄₅", "2 ³⁄₅", "3 ¹⁄₅", "17 ¹⁄₅"], 0, "17 ÷ 5 = 3 r 2"],
    ["⁴⁄₉ × ³⁄₈", ["¹⁄₆", "¹²⁄₇₂", "⁷⁄₁₇", "²⁄₃"], 0, "¹²⁄₇₂ = ¹⁄₆"],
    ["³⁄₄ ÷ ¹⁄₂", ["1 ¹⁄₂", "³⁄₈", "²⁄₃", "1 ¹⁄₄"], 0, "³⁄₄ × ²⁄₁ = ⁶⁄₄ = 1 ¹⁄₂"]
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
