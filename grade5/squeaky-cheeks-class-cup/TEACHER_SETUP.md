# Squeaky Cheeks: Class Cup — Teacher Setup Guide

**For:** Ms. Tesnar's and Ms. Covalt's 5th grade homerooms (Buncombe County Schools)
**Setup time:** about 15 minutes, one time, done by Ms. Tesnar
**Ms. Covalt only needs to post the link** in her Google Classroom.

---

## What this is

Squeaky Cheeks is a silly (PG) arcade game: students answer math problems to fill a "gas meter," then walk up to a crowd of fancy party guests and let a toot rip to clear the room. This 5th grade copy practices only two topics:

| Room | Topic | NC standard | Illustrative Math (Grade 5) |
|---|---|---|---|
| 1. Dentist's Waiting Room | Volume: count unit cubes, length × width × height | NC.5.MD.4, NC.5.MD.5 | Unit 1, Sections A–B |
| 2. School Cafeteria | Volume: base area × height, missing edge, figures made of two boxes | NC.5.MD.5 | Unit 1, Sections B–C |
| 3. Birthday Party | Fraction × whole number, fraction of a whole number, one-step word problems | NC.5.NF.4 | Unit 2, Section B |
| 4. Elevator Lobby | Fraction × fraction, area of rectangles with fraction side lengths | NC.5.NF.4 | Unit 2, Section C; Unit 3, Section A |
| 5. Pizza Parlor | Dividing with unit fractions: 1/2 ÷ 3 (sharing a fraction) and 3 ÷ 1/4 (how many fourths fit in 3), word problems, and "which equation matches?" | NC.5.NF.7 | Unit 3, Section B |
| 6. Fancy Wedding Reception | Mixed numbers, "bigger or smaller?" scaling, mixed review | NC.5.NF.4, NC.5.NF.7 (+ MD.5 review) | Unit 3, Sections A–C |

The problems follow the NCDPI 5th grade unpacking limits:
- Fraction × whole number uses denominators 2, 3, 4, 5, 6, 8, 10 and 12.
- Fraction × fraction and the area models use denominators 2, 3 and 4.
- Volume uses whole-number edges only. Figures made of two boxes have one-digit edges.
- Division is only a unit fraction ÷ a whole number, or a whole number ÷ a unit fraction (NC.5.NF.7). Every division problem shows a sharing or "how many fit?" model, and the feedback never uses the "flip and multiply" rule, which NC saves for 6th grade.

**Every problem shows a model** (cube drawing, area model, bar model, tape diagram or number line), because NC asks that models always be used in 5th grade. A wrong answer tells the student what the mistake was ("You multiplied the top AND bottom by 3…") and shows the right answer. That problem comes back a few questions later.

**The Class Cup:**
- Every right answer = **1 point** for the student's homeroom.
- Clearing a room = **10 bonus points**.
- The scoreboard at the top of the game shows both classes as a tug-of-war bar.
- There is also a big scoreboard for the projector.

**Only class totals are kept.** Students pick a homeroom button. They never type a name, and the game never reads their email.

---

## Why it runs from Google (and is safe for BCS)

The game is one file that runs **inside your own BCS Google account** as a Google Apps Script web app. That means:

- **No outside website, accounts, ads or tracking.** It runs on Google's servers in the district's Google Workspace. The only outside request is the game's fonts, which also come from Google (fonts.googleapis.com).
- **Only people signed in to a BCS Google account can open it** (you choose this in Part B).
- **No student information is collected.** The game sends only "which homeroom" and "how many points." Scores live in a Google Sheet in your Drive.
- The game saves beans and the chosen homeroom in the browser on that Chromebook. That browser storage never leaves the device.
- It posts to Google Classroom as a normal link.

There is also a **practice copy** on the class website. It has the same game but no Class Cup:
https://alexistesnar-alt.github.io/5th-Grade-Math-and-Science/squeaky-cheeks-class-cup/

---

## Part A — Make the scoreboard Sheet and the script (10 minutes)

1. Go to **sheets.google.com** signed in to **your BCS Google account**. Make a **Blank** spreadsheet. Name it **Squeaky Cheeks Class Cup**.
2. In the Sheet, click **Extensions → Apps Script**. A new tab opens with a file called **Code.gs**.
3. Delete everything in Code.gs. Open the file **Code.gs** (sent with this guide, or on GitHub at
   `squeaky-cheeks-class-cup/Code.gs`), copy all of it, and paste it in. Click **Save** (💾).
4. Next to **Files**, click **+ → HTML**. Name it exactly **Game** (no ".html", Apps Script adds it). Delete what is in it.
5. Open the file **index.html** (sent with this guide). Copy **all** of it (Ctrl+A, then Ctrl+C) and paste it into the Game file. Click **Save**.
   - From GitHub: open
     `https://raw.githubusercontent.com/alexistesnar-alt/5th-Grade-Math-and-Science/main/squeaky-cheeks-class-cup/index.html`,
     press Ctrl+A, Ctrl+C, then paste.
6. At the top, pick the function **setup** in the dropdown and click **Run**.
   - Google asks for permission: **Review permissions → choose your BCS account → Allow**. The script only asks for access to this one Sheet.
   - If you see "Google hasn't verified this app," click **Advanced → Go to (project name)**. This is your own script.
7. Go back to the Sheet. You now have the tabs **Totals**, **Daily**, **Past Contests** and **Read Me**. Reload the Sheet. A **Class Cup** menu appears at the top.

## Part B — Turn on the game link (3 minutes)

1. In the Apps Script tab, click **Deploy → New deployment**.
2. Click the gear ⚙ next to "Select type" and choose **Web app**.
3. Fill it in:
   - **Description:** Class Cup
   - **Execute as:** **Me**. This is required, so students never see a permission screen.
   - **Who has access:** **Anyone within Buncombe County Schools** (bcsemail.org). Students and teachers both use @bcsemail.org accounts, so this lets every student in. No one outside BCS can open it.
4. Click **Deploy**. Copy the **Web app URL**. It ends in **/exec**. This is the game link.

## Part C — Test it before students do (2 minutes)

1. Open the Web app URL. Click **Enter the room**, pick a homeroom, and answer a few problems.
2. Wait about 20 seconds. In the Sheet, the **Totals** tab should show the points.
3. **Best test:** ask one student, or use a student test account, to open the link on a student Chromebook. If they see "You need access," read Troubleshooting below.
4. Back in the Sheet, use **Class Cup → Start a new contest** to set both classes back to 0 before the real contest starts.

## Part D — Share it in Google Classroom

1. In Google Classroom, go to **Classwork → Create → Material** (or Assignment). Click **Link** and paste the Web app URL. Title it "Squeaky Cheeks: Class Cup."
2. **Ms. Tesnar** posts it in her class. **Ms. Covalt** posts the **same link** in her class. Email or Chat it to her. Both classes must use the same link so their points go to the same scoreboard.
3. *(Optional)* In the Sheet, click **Share** and add Ms. Covalt as a **Viewer** (to watch scores) or an **Editor** (so she can also start a new contest).

## Part E — Projector scoreboard

Open the game link with **?board=1** added to the end. For example:
`https://script.google.com/a/macros/bcsemail.org/s/XXXXXXXX/exec?board=1`

It shows only the two big class totals. It updates by itself every 15 seconds.

## Part F — Running the contest

- **Fair for different class sizes:** in the **Totals** tab, type each homeroom's number of students in the **Students** column. The game then also shows **points per student**. Leave it blank to show only totals.
- **Start a new contest** (a new week or unit): **Class Cup → Start a new contest**. Old scores are saved in **Past Contests**.
- **Which room to assign:** students can pick any room. Point them to the room for your current lesson (Rooms 1–2 = volume, Rooms 3–4 = multiplying fractions, Room 5 = dividing fractions, Room 6 = review).
- **Points are cheat-resistant:** only right answers earn points, and a game can send at most 60 points at a time. Points are sent every 20 seconds and when a room is cleared. If the internet drops, points wait on the Chromebook and are sent later.
- **The Daily tab** shows how many points each class earned each day. This is a quick way to see effort.

---

## Changing things later

| You want to… | Do this |
|---|---|
| Rename a homeroom | Change `CLASSES` at the top of **Code.gs** AND the name in column A of **Totals**, then deploy a new version (below). |
| Use a new version of the game | Paste the new **index.html** into the **Game** file and save, then deploy a new version (below). |
| Deploy a new version (keeps the same link) | **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy.** Students keep using the same link. |

---

## Troubleshooting

| What happens | Why / what to do |
|---|---|
| Student sees **"You need access"** or **"Sorry, unable to open the file"** | The Chromebook is signed in to a personal Google account. Have the student sign in with their @bcsemail.org account, or open the link in their school Chrome profile. |
| The page is **blocked by the web filter** | Ask BCS Technology to allow Google Apps Script web apps: `script.google.com` and `*.googleusercontent.com`. Many BCS tools already use these. |
| Points don't go up | Wait 20 seconds. The game says "saving…" if it can't reach Google; points wait on the Chromebook and send later. Check that you deployed with **Execute as: Me**. |
| Changes don't show up | Apps Script runs the deployed version. Use **Manage deployments → Edit → New version**. |
| No sound | Click the **Sound on/off** button. Chromebook volume and headphones apply. |
| Too silly for a student | The humor is PG: fancy guests fan the air and say "I say!" Students can turn sound off. |

---

## What's in the folder

| File | What it is |
|---|---|
| `index.html` | The game (also the practice copy on the class website). Paste it into the **Game** file in Apps Script. |
| `Code.gs` | The scoreboard script. Paste it into **Code.gs** in Apps Script. |
| `TEACHER_SETUP.md` | This guide. |
| `source/` | The question bank and build files. These are only needed to change the game. |
