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
C5. The FIRST wrong-answer note names the mistake but does not give the answer (the answer may show after the 2nd miss).
C6. This holds at every stage of the step tool: "Write an equation" (template after the 2nd miss, "Show me the equation" after
    the 3rd), squares and roots, π, and solve-for-y. A true move that goes the wrong way is not praised.

## D. Layout and flow
D1. One problem on the screen at a time (practice, pre-tests, notes practice, homework), with Back/Next.
D2. Nothing overlaps, nothing is cut off, no sideways scrolling on a 1366-wide laptop or a 375-wide phone.
D3. Figures match the numbers (angles drawn to scale, acute looks acute).
D4. No page errors in the browser console.
D5. No emoji in headings (site look).
D6. The step-by-step tool never jumps or centers the page (Nov 13, 2026): it scrolls only as far as needed to show the next
    thing to use, keeping the line just worked on in view (`calm()` in step-work.js; no plain `.focus()` that scrolls).

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
G2. Unit pages have NO big gold "Start here / Keep going / Next" button and no fold; the "Start here: do these in order" strip stays.
G3. Units 3 and 4 keep their own pages. The combined Units 3–4 page holds ONLY the Units 3–4 Pre-Test and the Units 3–4 Tutorial.
G4. Every page with the top bar has the ♪ Music button (top right); it opens the small pop-out player (drift.html?mini=1).
