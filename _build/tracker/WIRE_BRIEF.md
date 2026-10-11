# Wiring brief — send pre-test and practice results to Mr. Allen's Sheet

Repo: /home/claude/mr-allen-s-math-class (static site). Do NOT git commit/push. Edit ONLY your assigned files.
Never remove or weaken existing content or checking. The page must work exactly as before for a student who never taps Send.

## The shared pieces (already built — read them first)
- /tracker-config.js   (ENDPOINT + CLASS_CODE)       /score-send.js   (the Send panel + API)
Include them once per page, right before </body> (adjust ../ for depth):
    <script src="../tracker-config.js"></script>
    <script src="../score-send.js"></script>
    <script> ScoreSend.setup({ kind:'practice', unit:'7', page:'Unit 7 · Practice 1', mount:'#…', std:'NC.8.SP.1', band:4 }); </script>
API (see the header comment in score-send.js):
    ScoreSend.record(id, isCorrect, { std:'NC.8.SP.2', band:4, label:'short question text' })
      → call it EVERY time the page checks an answer (the first call per id = first try; later calls update "final").
    ScoreSend.reset()      → when a pre-test is Reset / restarted.
    ScoreSend.revealed()   → when answers are shown BEFORE the student checked (pre-test "Show answers").
Guard calls so a page never breaks:  if (window.ScoreSend) ScoreSend.record(...)

## What to record
- Real math problems the student solves and checks (practice problems, quick checks, pre-test questions, games that are
  listed as practice on a unit page). Do NOT record note-taking fill-in-the-blanks, vocabulary matching, or "reveal step" clicks.
- id: stable and unique within the page (e.g. 'A1', 'p3', 'q12'). Same id every time that question is checked.
- std: the NC Math 8 standard the item assesses, exactly like 'NC.8.EE.7'. Valid codes:
  NC.8.NS.1–2, NC.8.EE.1–8, NC.8.F.1–5, NC.8.G.1–9, NC.8.SP.1–4. Choose per item from what it actually asks
  (e.g. distance on the coordinate plane → NC.8.G.8; converse → NC.8.G.6; slope from a graph → NC.8.EE.6 or F.4 as the page frames it).
  Unit → usual standards: U1 NS.1, NS.2, EE.2 · U2 EE.1, EE.3, EE.4 · U3 EE.7 · U4 G.5 · U5 G.6, G.7, G.8 ·
  U6 F.1–F.5, EE.5, EE.6, EE.8 · U7 SP.1–SP.4 · U8 G.1–G.4 · U9 G.9.
- band: pre-tests use their own bands (basic=3, target=4, advanced=5). Practice = 4 unless the page itself labels an item as
  basic/advanced (then 3/5).
- Multiple-choice: record on the first choice the student clicks (that is their first try).

## Where the panel goes (mount)
At the END of the practice set / pre-test, where a student finishes (not hidden in a closed tab — if practice lives in a tab,
mount inside that tab's panel at its end, or at the end of the page if the tab system hides it). One panel per page.

## Verify (mandatory)
Playwright: require('/home/claude/.npm-global/lib/node_modules/playwright'). For EACH page:
1. Intercept the endpoint so nothing is really sent:
     await page.route('**/script.google.com/**', async route => { captured.push(route.request().postData());
       await route.fulfill({ status:200, contentType:'application/json', body: JSON.stringify({ok:true,name:'Test Student',n:1,right:1}) }); });
2. Answer several items (some right, some wrong first, then right), type a name "Test Student", tap "Send my work".
3. Save the captured body to <your folder>/payloads/<page>.json and run:
     node /home/claude/mr-allen-s-math-class/_build/tracker/check_payload.js <your folder>/payloads/*.json
   Every payload must print OK (accepted by the real tracker, every item has a valid standard).
4. No page errors (ignore /fonts\.googleapis|fonts\.gstatic|ERR_TUNNEL|Failed to load resource|AudioContext|net::ERR/),
   no horizontal scroll at 390 and 1280; existing checking/feedback still works; the panel looks right (screenshot it at 390 and 1280 and LOOK).
5. Print (page.pdf / print media): the panel does not print.
Final message (≤ 200 words): pages wired (count), items recorded per page, any page you could not wire and why.
