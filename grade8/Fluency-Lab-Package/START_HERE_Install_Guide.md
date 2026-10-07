# Fluency Lab — Install & File Guide

A complete math fluency program for eighth-grade remediation: eight skill modules from multi-digit
addition through expressions and order of operations.

**The good news about setup:** the entire student experience needs **no scripts, no accounts, and no
data entry**. It's just web pages. Your site runs on GitHub Pages, which is the easiest possible host
for this. Everything beyond the basic setup is optional.

---

## ⭐ The only setup you actually need (about 5 minutes, no coding)

### Step 1 — Put the folder on your site
The `fluency-lab` folder in this package already contains the whole student program (a landing page,
8 practice tools, and 8 self-grading skill-check quizzes). You just add that folder to your GitHub repo.

1. Go to your repository: **github.com/zacharyallen-netizen/Mr-Allen-s-Math-Class**
2. Click **Add file -> Upload files**.
3. Drag the whole **`fluency-lab`** folder into the upload box.
   *(If your browser won't take a folder, type `fluency-lab/` into the filename box first, then drag in
   all the `.html` files.)*
4. Type a short message like `Add Fluency Lab` and click **Commit changes**.
5. Wait about a minute, then open:
   **https://zacharyallen-netizen.github.io/Mr-Allen-s-Math-Class/fluency-lab/index.html**

### Step 2 — Add one link so students can find it
On your Home page (or 8th Grade Math page), add a link like the quick-links you already have:
```html
<a href="fluency-lab/index.html">🧠 Fluency Lab — build your math facts &amp; skills</a>
```
*(From a page inside a subfolder, use the full path
`/Mr-Allen-s-Math-Class/fluency-lab/index.html`.)*

**That's the whole install.** Students can now:
- **Practice** any skill — endless, adaptive, instant feedback.
- Take a **Skill check** — a 12-question quiz that grades itself on the spot and shows the worked steps
  for anything missed.

No logins, nothing collected, works on phones, and works offline once a page has loaded.

---

## Everything below is OPTIONAL

You can stop after the two steps above and have a fully working program. The rest adds grading records
and printable practice if you want them.

### Optional A — Worksheets for class or Google Classroom
The `module-materials` folder has guided and lighter worksheets plus a mixed review for each module
(`.docx`). They open in Word or upload to Google Docs. In Google Classroom:
1. **Classwork -> Create -> Assignment.**
2. **Add -> Upload** the `.docx` (or pull it from Drive).
3. Choose **"Make a copy for each student"** (to type in) or **"Students can view"** (to print).
4. **Differentiate easily:** in the **"For"** box at the top, assign the **Guided** version to the
   students who need more support and the **Light** version to everyone else.

### Optional B — A data dashboard (Google Sheets)
`teacher-planning/FluencyLab_Tracker.xlsx` turns weekly scores into a color-coded mastery dashboard
with growth trends and a pre/post effect-size analysis.
1. Upload it to Google Drive -> right-click -> **Open with -> Google Sheets**.
2. On the **Mastery Dashboard** tab, type each student's weekly score into the shaded cells. Everything
   else updates automatically. (Your 61 students are already loaded on the **Roster** tab.)

### Optional C — Auto-graded quizzes inside the Classroom gradebook (Google Forms)
**You do not need this** — the website Skill checks already grade instantly. Use this only if you want
scores to flow automatically into your Google Classroom gradebook. It's **copy-and-paste, not writing
code**: each `FluencyLab_M#_Form_Builder.gs` file builds the Form for you.
1. Go to **script.google.com -> New project**.
2. Delete the sample text, paste in the whole `.gs` file, click **Save**, then **Run**, and pick the
   `build...Form` function.
3. Click **Allow** when Google asks (it only makes a Form in your account).
4. **View -> Execution log** shows a link to the finished Form. Attach it in Classroom
   (**Create -> Assignment -> Add -> Google Drive**) and turn on **grade importing** if offered.

### Optional D — The planning documents
`teacher-planning/FluencyLab_Proposal.docx` and `FluencyLab_Scope_and_Sequence.docx` are the research
case and full module map — for you and administrators, not the student site.

---

## What's in the package

```
Fluency-Lab-Package/
├── START_HERE_Install_Guide.md
├── fluency-lab/              <- upload this whole folder (Step 1)
│   ├── index.html            (landing page)
│   ├── fluency-lab-*.html    (8 practice tools)
│   └── quiz-*.html           (8 self-grading skill-check quizzes)
├── teacher-planning/         (proposal, scope & sequence, tracker)
└── module-materials/         (routines, worksheets, optional Form builders, by module)
```

**Web pages (17):** `index.html`; 8 practice tools (`fluency-lab-add-subtract.html`, `-multiply`,
`-divide`, `-fractions`, `-decimals`, `-integers`, `-ratios`, `-expressions`); 8 skill checks
(`quiz-add-subtract.html`, `quiz-multiply.html`, …, `quiz-expressions.html`).

---

## Quick-start checklist

- [ ] Upload the `fluency-lab` folder to your GitHub repo and confirm it loads.
- [ ] Add a Fluency Lab link to your Home and/or 8th Grade Math page.
- [ ] (Optional) Post the worksheets in Google Classroom — Guided to some students, Light to others.
- [ ] (Optional) Open the tracker in Google Sheets to record scores.
- [ ] (Optional) Build the Google Forms quizzes only if you want gradebook auto-import.
- [ ] Try it with one module first; adjust pacing before rolling out the rest.
