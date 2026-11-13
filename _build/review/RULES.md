# Mr. Allen's review rules (the checklist every review and every automatic check uses)

Collected from Zach's own words. Every fix he asks for adds a rule here, so it cannot come back.
A page FAILS if any rule fails anywhere on it (screen, key view `?key=1`, or printed PDF).

## A. Worked steps (equations and inequalities)
A1. Each step is a new line, written horizontally, one move per line.
A2. Lines line up on the = (or <, >, ≤, ≥) sign.
A3. A move done to both sides (add/subtract) is written UNDER THE MATCHING LIKE TERM on BOTH sides
    (x-term under x-term, number under number). Never tacked on at the end of a side.
A4. Terms that cancel are shown cancelling (crossed out, with the move under them).
A5. Dividing/multiplying both sides is shown on both sides (fraction bar under each side, or the reciprocal in front).
A6. Inequality: when multiplying/dividing by a negative, the sign flip is shown and said.
A7. Every line is mathematically equivalent to the one before (exact check), and the final answer is right.
A8. Labels name the move in plain words ("Subtract 3x"), at a 5th-grade reading level.

## B. Answers and choices
B1. Every answer is a number box or a multiple-choice tap (no typed words/sentences/expressions as the ANSWER).
B2. A choice with more than one value says WHAT EACH VALUE IS (e.g. "x = 25; 4x° = 100°, (2x + 30)° = 80°"),
    using the names printed in the problem. No unlabeled "12 and 2" or "6, 8 and 13".
B3. Exactly one choice is right (unless "select all"), and it is marked right by the page.
B4. Every wrong choice is a common mistake, and picking it shows a note that NAMES that mistake.
B5. Every problem has a Hint button, and the answer is checked right away.
B6. Choices are readable: not cut off, not overlapping, no raw code/HTML, no "undefined"/"NaN".

## C. Help when a student is stuck (no loops)
C1. A wrong answer gets feedback that names the specific mistake (not just "try again").
C2. Repeating the SAME wrong answer/move must not get the same message forever: by the 2nd miss the student
    is shown the correct next move; by the 3rd, a way forward ("Show me this step"), recorded for the teacher.
C3. The step-by-step tool never shows the final answer before the student finishes, but it never leaves a student stuck.
C4. When "Show me this step" is used, the teacher's sheet says "(used step help)" for that question.
C5. The first two wrong-answer notes name the mistake but do not give the answer (3 tries; the answer may show after the 3rd miss, Nov 13, 2026).
C6. This holds at every stage of the step tool: "Write an equation" (template after the 2nd miss, "Show me the equation" after
    the 3rd), squares and roots, π, and solve-for-y. A true move that goes the wrong way is not praised.

## D. Layout and flow
D1. One problem on the screen at a time (practice, pre-tests, notes practice, homework), with Back/Next.
D2. Nothing overlaps, nothing is cut off, no sideways scrolling on a 1366-wide laptop or a 375-wide phone.
D3. Figures match the numbers (angles drawn to scale, acute looks acute).
D4. No page errors in the browser console.
D5. No emoji in headings (site look).
D6. The step-by-step tool never jumps or centers the page (Nov 13, 2026): it scrolls only as far as needed to show the next
    thing to use, keeping the line just worked on in view (`calmScroll()` in step-work.js; no plain `.focus()` that scrolls).

## E. Math content
E1. Every answer, key and explanation is mathematically correct.
E2. Repeating decimals → fractions use the 9's rule only.
E3. Exponent answers use positive exponents.
E4. NC standard codes are real (no NC.8.G.1).
E5. Printed PDFs and answer keys match the interactive page (same problems, same answers).

## F. Sending work
F1. "Send my work" / homework Send still sends name, answers and right/wrong to the Sheet.
F2. Student names never appear in the repo.

## G. Names and layout decisions (Nov 13, 2026)
G1. Homework is called **"Targeted Practice"** everywhere students see it ("Targeted Practice 3.1 — One- and Two-Step Equations").
    The numbers match the printed sheets. Data sent to the Sheet still says kind "homework" (Sheet tabs unchanged).
G2. Unit pages have NO big gold "Start here / Keep going / Next" button and no fold. (Nov 13, 2026: the "Start here" strip was replaced too, see G9.)
G3. Units 3 and 4 keep their own pages. The combined Units 3–4 page holds ONLY the Units 3–4 Pre-Test and the Units 3–4 Tutorial.
G4. Every page with the top bar has the ♪ Music button (top right); it opens the small pop-out player (drift.html?mini=1).
G5. One problem on the screen (Nov 13, 2026): no "Show all problems" switch for students (one-at-a-time.js ignores a saved "all";
    ?all=1 is for teachers/tests) and no "See the whole page" on Targeted Practice.
G6. A finished step-by-step puts the answer in the answer box AND checks it (matching tap choice is tapped). No
    "Put this answer in the answer box" button, no scrolling to the top.
G7. Step-by-step screens stay short (Nov 13, 2026): only the last two lines of work show ("Show all my steps" opens the
    rest), no "Colors" key, no "I read this as" line, wrong-line feedback = one sentence + "Tell me more", and the
    problem's own answer box is hidden while the step-by-step work is open.

## H. Tries and saved work (Nov 13, 2026)
H1. Students get 3 tries before an answer (or Show answer) appears: practice, pre-tests, notes, EOG sets, targets.
H2. Student work is saved: save-work.js (loaded by score-send.js and Targeted Practice) keeps every answer action on the
    Chromebook and in the Student Work Sheet ("Saved Work" tab; StudentWork.gs kind 'save' / 'load') and plays it back
    when the page is opened again on any Chromebook with the same name.
G8. After a right line, the praise comes FIRST, above "What will you do next?" (Nov 13, 2026). When the work is solved,
    the Solved box and "Correct! Your answer … is checked" are on screen without scrolling up.
G9. The top of each unit page shows "What you will learn": learning targets (the notes' "I can" list) + standards with a short
    meaning (_build/unit_start_here.py). The notes hide their own "I can" box on screen (it still prints). No "Start here" strip.
G10. The side menu (side-nav.js) is the site menu on every page (?nav=top on one browser brings back the top bar for checking).
G11. Unit 5: the 5.1–5.4 practice page is listed as "Targeted Practice Problems 5.x — topic" after each Targeted Practice 5.x and
     opens on that topic (page.html#s0p1 …). Unit 6: the interactive practice and review pages sit inside Targeted Practice in order.

## I. Arcade games (Nov 13, 2026)
I1. Equation Master: the equation work is on the LEFT and the fight on the RIGHT (side by side; phones: fight on top, small).
    The fight is cartoon gory (goo splats, flying teeth, K.O. puddle); it never changes questions, feedback or scores.
    It looks like a classic 2-D arcade fighting game (health bars, ROUND n / FIGHT!, combo counter, K.O., PERFECT!), but
    nothing is copied from a real game: no names, characters, logos or catchphrases.
I2. Zero Pair Run is called "Tiles for Miles" everywhere students see it (file name unchanged).
I3. Squeaky Cheeks: the other guests are fancy and polite (monocles, top hats, pearls; "I say!", *titters*); only the player is gassy.
I4. Neon Integer Assault "next level" look (synthwave grid, wave boss whose shield = open equations, laser trails, shatter,
    OVERDRIVE at 6 in a row) is looks only; the game sizes itself to the space beside the side menu.
    The boxes with right answers look like every other box (no green glow).
I5. Equation Master monsters are evil looking and attack every few seconds; Space (or the Block button) blocks. Space never
    presses an answer button. Unblocked attacks and wrong steps hurt the hero (knocked down at 0, gets back up); the beast
    roars, grunts and wails; death = slow motion, cut in two, goo, eyeballs; 6 weapons unlock by beasts defeated (saved per
    device); original dramatic music with Music: on/off. None of this changes questions, feedback, score or what is sent.
