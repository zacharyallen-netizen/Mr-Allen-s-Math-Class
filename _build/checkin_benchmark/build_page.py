"""Builds grade8/checkin_benchmark_review.html — the interactive NC Check-In Benchmark Review.
Content (notes, strategies, questions, diagrams) is shared with checkin_pdf.py so the page and the PDF match.
Results go to the Benchmark Tracker (benchmark-config.js) in the same payload format as q1_benchmark_review.html.
Run: python3 _build/checkin_benchmark/build_page.py"""
import os, re, json
D = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(D, "..", ".."))
src = open(os.path.join(D, "checkin_pdf.py")).read().split("footer = lambda")[0]
ns = {"__file__": os.path.join(D, "checkin_pdf.py")}
exec(src, ns)
Q, notes, strategies = ns["Q"], ns["notes"], ns["strategies"]

L = "ABCDEF"
STD_NAMES = {"NC.8.NS.1": "Rational and irrational numbers", "NC.8.EE.1": "Exponent rules",
             "NC.8.EE.7": "Equations and inequalities", "NC.8.F.1": "What is a function?",
             "NC.8.G.3": "Transformations with coordinates"}
LABELS = ["Select all irrational", "9's rule: 0.36(rep) to a fraction", "Fraction equal to 0.27(rep)",
          "True statement about rational/irrational", "Exponent rules: numeric value", "Power, product and zero exponent",
          "Select all equal to 1/16", "Simplify with variables", "Solve: distribute, variables on both sides",
          "How many solutions?", "Solve with fractions", "Word problem: inequality (T-shirts)",
          "Which table is a function?", "Which graph is a function?", "Select all ordered pairs that are functions",
          "Value of k that makes it NOT a function", "Translation: find B'", "Reflection over the y-axis",
          "Rotation 90 degrees counterclockwise", "Dilation by 1/2: select all true"]

def fr(a, b): return f'<span class="fr"><span>{a}</span><span>{b}</span></span>'

# Specific, kind feedback for each wrong choice (house rule: name the mistake).
WRONG = {
 0: {"pick": {0: "√49 = 7, so it is rational.", 2: "0.3737… repeats, so it is rational.", 4: "−5/8 is already a fraction, so it is rational."},
     "miss": {1: "√20 is irrational. 20 is not a perfect square.", 3: "π is irrational. Its decimal never ends and never repeats.",
              5: "0.1010010001… never repeats the same block, so it is irrational."}},
 2: {0: "27/100 = 0.27. That decimal stops. 0.2727… keeps going.", 2: "2/7 = 0.285714…, not 0.2727….", 3: "27/90 = 0.3. Two digits repeat, so put 27 over 99: 27/99 = 3/11."},
 3: {0: "Not every fraction stops. 1/3 = 0.333… repeats.", 1: "0.161616… repeats, so it is rational. It equals 16/99.", 3: "22/7 is close to π, but not equal. π is irrational."},
 4: {0: "A negative exponent does not make the number negative. 3⁻⁴ = 1/81.", 2: "Subtract the bottom exponent too: −2 − 2 = −4. So the answer is 3⁻⁴ = 1/81.", 3: "The exponent is negative, so flip it: 3⁻⁴ = 1/3⁴ = 1/81."},
 6: {"pick": {2: "−16 is negative. 1/16 is positive.", 4: "−4⁻² means −(4⁻²) = −1/16. The negative sign is outside the power.", 5: "2⁸ ÷ 2⁴ = 2⁴ = 16, not 1/16."},
     "miss": {0: "4⁻² = 1/4² = 1/16. It belongs.", 1: "2⁻⁴ = 1/2⁴ = 1/16. It belongs.", 3: "(−4)⁻² = 1/(−4)² = 1/16. A negative number squared is positive."}},
 7: {1: "y⁻² has a negative exponent. Move it to the bottom: x¹³/y².", 2: "Power to a power means MULTIPLY: (x⁵)³ = x¹⁵, not x⁸.", 3: "When you divide, SUBTRACT the exponents: x¹⁵ ÷ x² = x¹³."},
 9: {0: "No solution happens when you get a FALSE statement, like 6 = 5. Here you get −6 = −6. That is true.", 1: "The x terms cancel: 6x − 6 = 6x − 6. Both sides are the same, so every x works.", 2: "The x terms cancel: 6x − 6 = 6x − 6. Both sides are the same, so every x works."},
 11: {1: "4.25 is not a whole T-shirt. Jordan can only buy whole shirts, so the answer is 4.", 2: "5 shirts cost $60. $34 + $60 = $94. That is more than $85.", 3: "Do not forget the $34 jacket. $85 − $34 = $51 left. 51 ÷ 12 = 4.25, so 4 shirts."},
 12: {0: "In this table, x = 1 has two outputs: 4 and 6.", 2: "In this table, x = −1 has two outputs: 3 and 4.", 3: "In this table, x = 5 has four different outputs."},
 13: {0: "A vertical line crosses the circle in two places.", 1: "A vertical line crosses this sideways U in two places.", 3: "This graph is a vertical line. The input x = 2 has many outputs."},
 14: {"pick": {1: "B is not a function: x = 2 goes to 1 AND to 3.", 3: "D is not a function: x = 1 goes to 1 AND to −1."},
      "miss": {0: "A is a function: every x is different (1, 2, 3).", 2: "C is a function: the y repeats (5, 5, 5), but every x is different. That is OK.", 4: "E is a function: the y-value 2 repeats, but every x is different."}},
 15: {0: "k = 1 is a new input, so it is still a function. Look for an x that is ALREADY used.", 1: "k = 3 is a new input, so it is still a function. Look for an x that is ALREADY used.", 3: "k = 8 is a new input, so it is still a function. Look for an x that is ALREADY used."},
 16: {1: "You moved right. Left means subtract from x: 5 − 4 = 1.", 2: "You moved up. Down means subtract from y: 1 − 3 = −2.", 3: "(2, −3) is where A goes. The question asks about B."},
 17: {0: "That is a reflection over the x-axis. Over the y-axis, the x changes sign.", 2: "Both signs changed. That is a 180° rotation.", 3: "You swapped x and y. A reflection over the y-axis does not swap them."},
 18: {1: "That is 90° clockwise. Counterclockwise uses (x, y) → (−y, x).", 2: "That is a 180° rotation. Both signs flipped.", 3: "That is a reflection over the x-axis."},
 19: {"pick": {1: "Z(2, 4) times ½ is (1, 2). (4, 8) would be scale factor 2.", 3: "A dilation changes size. The image is similar, not congruent."},
      "miss": {0: "W(2, 1) times ½ is (1, 0.5). This one is true.", 2: "The sides 4 and 3 times ½ are 2 and 1.5. This one is true.", 4: "A dilation never changes angles. They stay 90°. This one is true."}},
}
# Numeric entry: exact answers and detectable mistakes, as [num, den] fractions
NUMKEY = {
 1: {"ans": [4, 11], "simplest": True, "hints": [[[36, 100], "0.36 stops, but 0.3636… repeats. Use the 9's rule: two repeating digits → 36/99. Then simplify."],
      [[36, 90], "Two digits repeat, so use two 9's: 99, not 90. 36/99 = 4/11."], [[4, 9], "Both digits repeat. The block is 36, so start with 36/99. Then simplify to 4/11."],
      [[99, 36], "Flip it: the repeating digits go on TOP. 36/99 = 4/11."], [[364, 1000], "That decimal stops. Use the 9's rule: 36/99 = 4/11."],
      [[12, 33], "Right value, but keep simplifying: 12 ÷ 3 = 4 and 33 ÷ 3 = 11. 4/11."]]},
 5: {"ans": [4, 1], "hints": [[[64, 1], "(2³)² = 2⁶ = 64 is only the first step. Now multiply by 2⁻⁴: 2⁶⁻⁴ = 2² = 4."],
      [[0, 1], "7⁰ is 1, not 0. So the answer is 4 × 1 = 4."], [[28, 1], "7⁰ is 1, not 7. So the answer is 4 × 1 = 4."],
      [[2, 1], "Power to a power: MULTIPLY. (2³)² = 2⁶. Then 2⁶ · 2⁻⁴ = 2² = 4."], [[1, 4], "6 + (−4) = 2, a positive exponent. 2² = 4."]]},
 8: {"ans": [5, 1], "hints": [[[11, 4], "Distribute to BOTH terms: 4(x − 3) = 4x − 12, not 4x − 3."],
      [[5, 2], "Subtract 2x from both sides (do not add it): 6x − 2x = 4x. Then 4x = 20."],
      [[-5, 1], "Check the signs. 4x − 12 = 8, so 4x = 20 and x = 5."], [[20, 1], "One more step: 4x = 20, so x = 20 ÷ 4 = 5."]]},
 10: {"ans": [18, 1], "hints": [[[54, 1], "One more step: 3x = 54, so x = 54 ÷ 3 = 18."],
      [[3, 1], "Multiply EVERY term by 6, including the 4 and the 5: 4x − 24 = x + 30."],
      [[-18, 1], "Check the signs. 3x = 54, so x = 18."]]},
}

qdata, qblocks = [], []
for i, q in enumerate(Q):
    multi = q["typ"].startswith("Select")
    kind = "num" if q["entry"] else ("multi" if multi else "mc")
    keytxt = re.sub(r"\s+", " ", q["ans"].replace("&nbsp;", " ")).strip()
    item = {"id": str(i + 1), "std": "NC.8." + q["std"], "label": LABELS[i], "kind": kind, "correct": q["correct"],
            "key": keytxt, "why": q["why"]}
    if kind == "num": item.update(NUMKEY[i])
    else: item["fb"] = WRONG.get(i, {})
    if kind != "num": item["opts"] = [re.sub("<[^>]+>", "", o).strip() for o in q["opts"]]
    qdata.append(item)
    qtype = {"mc": "Multiple choice", "multi": "Select all that apply", "num": "Type your answer"}[kind]
    stem = q["stem"]
    if kind == "num":
        body = (f'<div class="row"><label class="lab" for="in{i}">Your answer</label>'
                f'<input class="box wide" id="in{i}" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type your answer"></div>'
                f'<p class="typehelp">Fractions: <code>4/11</code> · Mixed numbers: <code>1 2/3</code> · Negatives: <code>-4</code></p>')
    else:
        cls = "col" if q["cols"] == 1 else ("grid4" if q["cols"] == 4 else "")
        body = f'<div class="chips {cls}"{" data-multi" if multi else ""}>' + "".join(
            f'<button type="button" class="chip" data-v="{j}" aria-pressed="false"><span class="L">{L[j]}</span><span class="cv">{o}</span></button>'
            for j, o in enumerate(q["opts"])) + "</div>"
    if q["fig"]:
        body = f'<div class="withfig"><div class="wf-main">{body}</div><div class="wf-fig" aria-hidden="true">{q["fig"]}</div></div>'
    qblocks.append((q["std"], f'''
  <div class="q" id="q{i+1}" data-i="{i}">
    <div class="q-top"><span class="qn">{i+1}</span><div class="q-text"><div class="q-type">{qtype}</div><div class="stem">{stem}</div></div></div>
    <div class="q-body">{body}
      <div class="qact"><button type="button" class="btn sm chk" data-i="{i}">Check my answer</button><span class="nudge" aria-live="polite"></span></div>
    </div>
    <div class="res" aria-live="polite"></div>
  </div>'''))

TIPS = {
 "NS.1": "A <b>rational</b> number can be written as a fraction. Its decimal stops or repeats. An <b>irrational</b> number's decimal never stops and never repeats.",
 "EE.1": "Multiply → <b>ADD</b> exponents. Divide → <b>SUBTRACT</b>. Power to a power → <b>MULTIPLY</b>. Anything to the 0 power is 1. A negative exponent means <b>flip</b>.",
 "EE.7": "Distribute. Combine like terms. Get the variable on one side. Then check. For inequalities, multiply or divide by a negative → <b>flip the sign</b>.",
 "F.1": "A function gives each input <b>exactly one</b> output. If an x repeats with a <b>different</b> y, it is NOT a function. A repeated y is OK.",
 "G.3": "Translate: add or subtract. Reflect over x-axis: (x, −y). Over y-axis: (−x, y). Rotate 90° counterclockwise: (−y, x). 180°: (−x, −y). Dilate: multiply both by k.",
}
TITLES = {"NS.1": "Rational &amp; Irrational Numbers", "EE.1": "Integer Exponents", "EE.7": "Equations &amp; Inequalities",
          "F.1": "Functions", "G.3": "Transformations"}
parts = []
for n, s in enumerate(["NS.1", "EE.1", "EE.7", "F.1", "G.3"], 1):
    parts.append(f'<section class="part"><div class="part-h"><span class="tag">Part {n}</span><h2>{TITLES[s]}</h2><span class="std">NC.8.{s}</span></div>'
                 f'<div class="tip"><b class="lbl">REMEMBER</b> {TIPS[s]}</div>' + "".join(b for st, b in qblocks if st == s) + "</section>")

note_parts = notes().split('<div class="pb"></div>')[1:]
note_ids = ["NS.1", "EE.1", "EE.7", "F.1", "G.3"]
strat_html = strategies().replace('<div class="pb"></div>', '')

def fixfont(h): return h.replace('font-family="Source Serif 4"', 'font-family="Source Serif 4, Georgia, serif"').replace('font-family="Inter"', 'font-family="Inter, system-ui, sans-serif"')

CSS = open(os.path.join(D, "page.css")).read()
JS = open(os.path.join(D, "page.js")).read().replace("__QDATA__", json.dumps(qdata, ensure_ascii=False)).replace("__STDNAMES__", json.dumps(STD_NAMES))

page = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NC Check-In Benchmark Review — Mr. Allen's Math Class</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,600&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<style>
{CSS}
</style>
</head>
<body>
<!-- SITE-BAR -->
<script src="../site-bar.js"></script>
<div class="wrap">
<a class="back-link" href="benchmarks.html">← Benchmarks</a>

<header class="hdr">
  <div class="eyebrow">NC Check-In Benchmark</div>
  <h1>NC Check-In Benchmark Review</h1>
  <p class="lede">Read the test strategies. Review the notes. Then do the 20 practice questions. Tap <b>Check my answer</b> after each one to see if you got it right. When you finish, tap <b>Submit</b>. Mr. Allen gets your results.</p>
  <p class="stds">NC.8.NS.1 · NC.8.EE.1 · NC.8.EE.7 · NC.8.F.1 · NC.8.G.3</p>
  <div class="links"><a href="NC_CheckIn_Benchmark_Review.pdf">Printable packet (PDF)</a></div>
</header>

<nav class="steps" role="tablist" aria-label="Sections">
  <button type="button" role="tab" class="step" data-tab="tStrat" aria-selected="true"><span class="sn1">1</span>Strategies</button>
  <button type="button" role="tab" class="step" data-tab="tNotes" aria-selected="false"><span class="sn1">2</span>Notes</button>
  <button type="button" role="tab" class="step" data-tab="tPrac" aria-selected="false"><span class="sn1">3</span>Practice</button>
</nav>

<section class="tabp" id="tStrat" role="tabpanel">
{fixfont(strat_html)}
<div class="next"><button type="button" class="btn" data-go="tNotes">Next: Notes →</button></div>
</section>

<section class="tabp" id="tNotes" role="tabpanel" hidden>
  <div class="ntabs" role="tablist" aria-label="Notes by standard">
    {"".join(f'<button type="button" class="ntab" data-n="n{k.replace(".", "")}" aria-selected="{"true" if k == "NS.1" else "false"}">{k}{" <em>new</em>" if k in ("F.1", "G.3") else ""}</button>' for k in note_ids)}
  </div>
  {"".join(f'<div class="note" id="n{k.replace(".", "")}"{"" if k == "NS.1" else " hidden"}>{fixfont(v)}</div>' for k, v in zip(note_ids, note_parts))}
  <div class="next"><button type="button" class="btn" data-go="tPrac">Start the practice →</button></div>
</section>

<section class="tabp" id="tPrac" role="tabpanel" hidden>
<div class="namebox">
  <label for="sname">Your first and last name</label>
  <input id="sname" type="text" autocomplete="name" placeholder="First and last name">
  <p class="help">Type it the same way every time, so Mr. Allen can find your work.</p>
  <span class="lbl2" id="clslabel">Your class</span>
  <div class="classes" role="group" aria-labelledby="clslabel">
    <button type="button" class="cls" aria-pressed="false">A1</button>
    <button type="button" class="cls" aria-pressed="false">A2</button>
    <button type="button" class="cls" aria-pressed="false">A4</button>
    <button type="button" class="cls" aria-pressed="false">B5</button>
    <button type="button" class="cls" aria-pressed="false">B6</button>
  </div>
</div>

<div class="prog" aria-live="polite"><span id="progtxt">0 of 20 checked</span><span class="pbar"><i id="pbar"></i></span><span id="progok">0 right</span></div>

{"".join(parts)}

<section class="submit" id="submitbox" aria-live="polite">
  <h2>Submit to Mr. Allen</h2>
  <p class="msg" id="smsg">Your FIRST check on each question is your score. Questions you did not check get graded when you submit.</p>
  <div class="btns"><button type="button" class="btn" id="sbtn">Submit</button></div>
  <div class="score" id="scorebox">
    <div class="big" id="bigscore"></div>
    <table class="bystd" id="bystd"></table>
    <div class="qgrid" id="qgrid"></div>
    <p class="msg" id="sendmsg"></p>
    <div class="btns">
      <button type="button" class="btn ghost" id="resend" hidden>Try sending again</button>
      <button type="button" class="btn ghost" id="again">Start a new attempt</button>
    </div>
  </div>
</section>
</section>
</div>

<script src="../benchmark-config.js"></script>
<script>
{JS}
</script>
</body>
</html>
'''
open(os.path.join(REPO, "grade8", "checkin_benchmark_review.html"), "w").write(page)
print("ok", len(page))
