# Fluency Lab worksheets — clean-up brief (one module per builder)

Folder: /home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/module-materials/Module-N-<Name>/
These are printable Word worksheets (teachers also open them in Google Docs). There is no generator script;
they were made once. Edit ONLY the student worksheets in your module folder (every .docx except
*_Routine.docx). Leave *_Routine.docx and *_Form_Builder.gs alone. Do NOT git commit or push.
Scratch folder: /home/claude/mr-allen-s-math-class/_build/fluency_review/ws-mN/ (keep a copy of every original there).
Read the docx skill first: /mnt/skills/public/docx/SKILL.md

Students: 8th graders far below grade level. Teacher: "Little things are very confusing to young monkey brains."

## Rules (all of them)
1. **Fractions are ALWAYS stacked**: one number or expression clearly on top of the other with a bar between.
   Never "2/3", "x/5" or "1/2 + 1/3" written on one line — in problems, worked examples, answers, hints, the
   "mistake" box, everywhere. Answer spaces for a fraction are stacked too (a blank over a blank).
   Module 4 (Fractions) already draws stacked fractions with small 2-row tables — reuse that exact technique
   (copy its XML pattern) so every module looks the same. Ratios written with a colon (3 : 4) are fine.
   Mixed numbers: whole number then a stacked fraction.
2. **No word problems. At all. Ever.** Only numbers and symbols (Module 8 may use letters like x, a, b).
   No units, money, people, objects, "miles", "$", "pens", "recipe", etc.
3. **No multi-step calculations** (more than one operation in one problem, like −2 + 7 − 3), except Module 8
   (Expressions & Order of Operations), where that is the skill. One skill's own method is fine.
   The "Keep Module N warm" spiral boxes follow the same rules.
4. **Minimum words.** Title, Name/Date, support badge, then very short section labels ("Worked example",
   "Your turn", "On your own", "Mixed review"). Any refresher line ≤ 8 words. "Find the mistake" box:
   show the wrong work, then "What went wrong? ____" and "Correct answer: ____" — no long paragraph.
   Closing line ≤ 6 words or remove it.
5. Every answer must be mathematically right (recompute each in code). Keep the existing look: same fonts,
   colors, header band, badge, table layout, file names, page size. Keep the same number of problems unless a
   removed word problem has no sensible numeric replacement (then replace it with a same-skill numeric one).
6. Module 7 (Ratios) must match the new online levels: simplify a ratio; equivalent ratios (2 : 3 = ? : 12);
   unit rate as numbers only (180 : 3 = ? : 1); proportions with the missing number in any of the four spots
   (stacked fractions). No "split in a ratio", no cost problems, no unit words.

## Verify (mandatory)
- Convert every edited .docx to PDF with `soffice --headless --convert-to pdf`, rasterize with pdftoppm, and LOOK at
  every page with the Read tool: stacked fractions clear and aligned, nothing clipped, page count not worse.
- Text check: no digit/letter "/" digit/letter pattern left in visible text; no word-problem words; list every
  problem with its answer and confirm each in code.
- Open with python-docx to make sure each file still opens.

## Report back (≤ 200 words)
Files changed, what you replaced (word/multi-step problems), anything you were unsure about, preview image paths.
