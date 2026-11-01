p='Grade_8_Math_Review_Quest.html'; s=open(p).read()
new=open('eog_math_review_game.html').read()
lib=new[new.index('    // ===== VISUALS START ====='):new.index('    // ===== VISUALS END =====')+len('    // ===== VISUALS END =====')]
fr=new[new.index('    // Free-response checking'):new.index('    function answer(choice) {')]
def R(a,b):
    global s
    assert s.count(a)==1,a[:70]; s=s.replace(a,b)
R('''    body {
      margin: 0;
      min-height: 100vh;''','''    body {
      margin: 0;
      min-height: 100vh;
      padding-bottom: 92px; /* room for the fixed home button */''')
R('''    .hidden { display: none !important; }''','''    .hidden { display: none !important; }
    /* Pictures: "giv" parts show before answering, "ans" parts only after. */
    #game:not(.revealed) .ans { display: none; }
    #game.revealed .giv { display: none; }
    .visual { padding: 12px; }
    .answer-btn .choice-art { display: block; margin-top: 8px; }
    .answer-btn .choice-art svg { width: 100%; max-width: 300px !important; }''')
R('<p>Built from the released EOG questions. Play solo, split into teams, grab streak bonuses, and jump back to the original PDF page whenever a diagram matters.</p>',
  '<p>Built from the released EOG questions (Form 3). Play solo, split into teams, and grab streak bonuses. Every question has its own picture, and the picture fills in with the solution after you answer.</p>')
R('<div class="note" id="note">Correct answers are worth 100 points. A streak adds bonus XP. Diagram questions include a source button so students can inspect the released-form image.</div>',
  '<div class="note" id="note">Correct answers are worth 100 points. A streak adds bonus XP. After you answer, the picture shows how to solve it.</div>')
R('''    const PDF = "Released Questions 3.pdf";''','''    // "Released Questions 3.pdf" is not in this site, so nothing here links to it. Items that used
    // to need its diagrams now state their own facts and draw their own pictures (makeVisuals below).
    // The "Page" badge is the page in the released form, for the teacher's reference only.
    const PDF = "";''')
a=s.index('    const state = {')
s=s[:a]+lib+'''
    const VIS = makeVisuals({
      ink: "#1d2330", main: "#0f766e", muted: "#667085", grid: "#e3e8f0", soft: "#eef6f5",
      gold: "#b7791f", hl: "#d69e2e", goldSoft: "#fff3c4", goldText: "#7c4a03",
      blue: "#1d4ed8", green: "#15803d", greenSoft: "#dcfce7", rose: "#be123c", roseSoft: "#ffe3ea"
    });

'''+s[a:]
R('''      els.note.textContent = q.source
        ? "This item uses a source diagram or a table from the released form. Open the source page if your class needs the exact visual."
        : q.hint;
      renderVisual(q);''','''      els.note.textContent = q.hint;
      els.game.classList.remove("revealed");
      renderVisual(q);''')
R('''            <span>${text}</span>''','''            <span>${text}${VIS.choice(q.n, letter) ? `<span class="choice-art">${VIS.choice(q.n, letter)}</span>` : ""}</span>''')
a=s.index('    function renderVisual(q) {'); b=s.index('    function answer(choice) {')
s=s[:a]+'''    function renderVisual(q) {
      // Each question draws its own picture; the solution parts appear after answering.
      const html = VIS.main(q.n);
      els.visual.classList.toggle("hidden", !html);
      els.visual.innerHTML = html;
    }

'''+fr+s[b:]
R('''    function answerFree() {
      const q = state.active[state.index];
      const choice = els.freeInput.value;
      const correct = normalize(choice) === normalize(q.answer);''','''    function answerFree() {
      if (state.answered) return;
      const q = state.active[state.index];
      const choice = els.freeInput.value;
      const correct = freeMatches(choice, q);''')
R('''      state.answered = true;
      const base''','''      state.answered = true;
      els.game.classList.add("revealed");
      const base''')
R('Correct answer: <b>${q.answer}</b>. ${q.hint}`;',"Correct answer: <b>${showAnswer(q)}</b>. Look at the picture to see how — you've got this!`;")
R('''      if (!correct && q.source) els.sourceBtn.classList.remove("hidden");
''','')
R('''    $("sourceAll").addEventListener("click", () => openSource(1));''','''    if (PDF) { $("sourceAll").addEventListener("click", () => openSource(1)); } else { $("sourceAll").style.display = "none"; }''')
open(p,'w').write(s)
