# Update your Score Tracker to version 3

About 5 minutes. **Your web address stays the same**, so nothing on the website needs to change.

> **Keep the script file private.** `ScoreTracker_v3_PASTE_THIS.txt` has your class list in it.
> Paste it into Google only. Do not upload it to the website or to GitHub.

## Steps

1. Open your Sheet **Fluency Lab — Student Scores**. Click **Extensions → Apps Script**.
   (Or go to script.google.com and open your Score Tracker project. It is the same project.)
2. Click inside the code. Press **Ctrl + A** (Mac: **⌘ + A**), then **Delete**.
3. Open `ScoreTracker_v3_PASTE_THIS.txt`, copy everything, and paste it into the empty editor.
   Click the disk icon to **Save**.
4. In the dropdown at the top, choose **setup**, then press **Run**.
   If Google asks for permission, approve it (**Advanced → Go to … → Allow**).
   This adds the new tabs and rebuilds the reports. It does not change or delete any rows you already have.
5. Click **Deploy → Manage deployments**. Click the pencil **✎** next to your Web app.
   Under **Version**, choose **New version**. Click **Deploy**.

**Use "Manage deployments", not "New deployment".** Editing the deployment you already have and
choosing "New version" keeps the same web address (it ends in `/exec`). The website has that address in
`tracker-config.js` and `fluency-config.js`, so it keeps sending with no changes.
"New deployment" would make a new address, and the website would stop reaching your Sheet.

**To check it worked:** open your Web app address in a browser. It should say
"Score tracker v3 is running."

## What is new in your Sheet

| Tab | What it shows |
|---|---|
| Roster | Your students: Student, Period, Also typed as. Filled in for you the first time. After that, **you edit it** (add a student, fix a period). |
| Check names | Names students typed that do not match anyone on the Roster, with how many times and when last seen. |
| Flashpoint | The Fluency Lab game: for each student and level, the best number right out of 20 and the stars. Green = 2+ stars (the next level is unlocked). |
| Summary | Now has a Period column and lists every student, sorted by period then name, even with no scores yet. |

## Fixing a name

Students sometimes type a nickname or a misspelling. To fix one:

1. Open **Check names** and find the typed name (for example `Jordn Rivers`).
2. On the **Roster** tab, type it into **Also typed as** next to the right student.
   Put a comma between spellings: `Jordn Rivers, J Rivrs`.
3. At the next refresh (every hour, or choose **refreshReports** and press **Run**), that student's work joins up
   on every report, including work sent before you added the spelling.

Most names match on their own: capitals, dots and extra words do not matter ("Jordan Rivers check 2" counts as
Jordan Rivers). If a typed name could be two students, it is not matched. It goes on Check names for you to decide.

## Good to know

- Your students' names never go to the website. The website can only add rows to your Sheet; it cannot read anything back.
- Flashpoint rounds show up only when a student taps **Send my work** after a round. Rounds sent from now on also
  include the points and stars; older rounds get their stars worked out from the number right.
