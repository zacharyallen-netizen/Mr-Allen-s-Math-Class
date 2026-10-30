"""Version 2 of the NC Check-In Benchmark Review (simpler: 10 questions, 2 per standard, worked example
above each question, 2–3 choices, one question at a time, read-aloud).
Builds:  grade8/checkin_benchmark_review_v2.html
         grade8/NC_CheckIn_Benchmark_Review_V2.pdf
         $KEY_DIR/NC_CheckIn_Review_V2_Answer_Key.pdf   (answer key stays OFF the public site)
Run: FONT_DIR=/tmp/fonts/gf/ofl python3 _build/checkin_benchmark/build_v2.py"""
import os, json, re
D = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(D, "..", ".."))
ns = {"__file__": os.path.join(D, "checkin_pdf.py")}
exec(open(os.path.join(D, "checkin_pdf.py")).read().split("# ---------------------------------------------------------------- NOTES")[0], ns)
grid, poly, combine, curve_graph = ns["grid"], ns["poly"], ns["combine"], ns["curve_graph"]
FONTS = os.environ.get("FONT_DIR", "/tmp/fonts/gf/ofl")
KEY_DIR = os.environ.get("KEY_DIR", "/home/claude")
BENCH = "NC Check-In Benchmark Review — Version 2"

def fr(a, b): return f'<span class="fr"><span>{a}</span><span>{b}</span></span>'
def sup(e): return f'<sup>{e}</sup>'
M = "−"

# ── visuals (each drawn from its own numbers)
def dot_square(n, label):
    u = 15; W = n * u + 20
    dots = "".join(f'<circle cx="{10 + u/2 + c*u}" cy="{10 + u/2 + r*u}" r="5" fill="#1E2D4F"/>' for r in range(n) for c in range(n))
    return (f'<svg viewBox="0 0 {W} {W + 22}" width="{W}" height="{W + 22}" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif">'
            f'<rect x="4" y="4" width="{W-8}" height="{W-8}" rx="6" fill="#FFF6D6" stroke="#E0A800"/>{dots}'
            f'<text x="{W/2}" y="{W + 16}" font-size="12" text-anchor="middle" fill="#1E2D4F">{label}</text></svg>')

def squares_strip(highlight_missing):
    sq = [1, 4, 9, 16, 25]; W = 330
    cells = "".join(f'<rect x="{8 + i*64}" y="8" width="56" height="40" rx="7" fill="#EEF1F7" stroke="#1E2D4F"/>'
                    f'<text x="{36 + i*64}" y="34" font-size="17" font-weight="600" text-anchor="middle" fill="#1E2D4F" font-family="Source Serif 4, Georgia, serif">{v}</text>' for i, v in enumerate(sq))
    return (f'<svg viewBox="0 0 {W} 72" width="{W}" height="72" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif">{cells}'
            f'<text x="{W/2}" y="66" font-size="12" text-anchor="middle" fill="#5B6475">Perfect squares: 1, 4, 9, 16, 25 … Is {highlight_missing} on the list?</text></svg>')

def twos(a, b):
    r = 13; gap = 30
    def grp(n, x0, col):
        return "".join(f'<circle cx="{x0 + i*gap}" cy="26" r="{r}" fill="{col}"/><text x="{x0 + i*gap}" y="31" font-size="13" font-weight="700" text-anchor="middle" fill="#fff">2</text>' for i in range(n))
    x2 = 20 + a * gap + 22
    W = x2 + b * gap + 10
    return (f'<svg viewBox="0 0 {W} 70" width="{W}" height="70" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif">'
            f'{grp(a, 20, "#1E2D4F")}<text x="{x2 - 18}" y="32" font-size="18" fill="#1E2D4F">·</text>{grp(b, x2, "#B07D00")}'
            f'<text x="{W/2}" y="64" font-size="12" text-anchor="middle" fill="#5B6475">{a} twos times {b} twos. Count all the twos.</text></svg>')

def bar_model(k, c, total):
    W = 340; u = (W - 20) / total
    xs = "".join(f'<rect x="{10 + i*(k and (W-20 - c*u)/k)}" y="10" width="{(W-20 - c*u)/k - 3}" height="36" rx="5" fill="#EEF1F7" stroke="#1E2D4F"/>'
                 f'<text x="{10 + i*((W-20 - c*u)/k) + ((W-20 - c*u)/k - 3)/2}" y="34" font-size="16" font-style="italic" text-anchor="middle" fill="#1E2D4F" font-family="Source Serif 4, Georgia, serif">x</text>' for i in range(k))
    cx = 10 + (W - 20 - c*u)
    return (f'<svg viewBox="0 0 {W} 92" width="{W}" height="92" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif">{xs}'
            f'<rect x="{cx}" y="10" width="{c*u}" height="36" rx="5" fill="#FFF6D6" stroke="#E0A800"/>'
            f'<text x="{cx + c*u/2}" y="34" font-size="16" font-weight="600" text-anchor="middle" fill="#1E2D4F">{c}</text>'
            f'<line x1="10" y1="58" x2="{W-10}" y2="58" stroke="#1E2D4F"/><line x1="10" y1="53" x2="10" y2="63" stroke="#1E2D4F"/><line x1="{W-10}" y1="53" x2="{W-10}" y2="63" stroke="#1E2D4F"/>'
            f'<text x="{W/2}" y="80" font-size="14" font-weight="600" text-anchor="middle" fill="#1E2D4F">all together = {total}</text></svg>')

def flip_pic():
    return ('<svg viewBox="0 0 300 80" width="300" height="80" xmlns="http://www.w3.org/2000/svg" font-family="Source Serif 4, Georgia, serif">'
            '<text x="40" y="48" font-size="26" font-weight="600" fill="#1E2D4F">2<tspan dy="-12" font-size="16">−3</tspan></text>'
            '<path d="M95 40 C130 10, 160 10, 195 40" fill="none" stroke="#B07D00" stroke-width="2.5" marker-end="url(#fa)"/>'
            '<defs><marker id="fa" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8z" fill="#B07D00"/></marker></defs>'
            '<text x="145" y="18" font-size="12" text-anchor="middle" fill="#8A6100" font-family="Inter, sans-serif">flip it</text>'
            '<text x="232" y="30" font-size="20" font-weight="600" text-anchor="middle" fill="#1E2D4F">1</text>'
            '<line x1="210" y1="38" x2="254" y2="38" stroke="#1E2D4F" stroke-width="2"/>'
            '<text x="228" y="62" font-size="20" font-weight="600" text-anchor="middle" fill="#1E2D4F">2<tspan dy="-9" font-size="13">3</tspan></text>'
            '<text x="150" y="76" font-size="11" text-anchor="middle" fill="#5B6475" font-family="Inter, sans-serif">The negative sign goes away when you flip.</text></svg>')

def pt(x, y, lab, col="#1E2D4F"):
    return lambda X, Y, u: f'<circle cx="{X(x)}" cy="{Y(y)}" r="5" fill="{col}"/><text x="{X(x)+7}" y="{Y(y)-7}" font-size="12" font-weight="700" fill="{col}">{lab}</text>'

def hl_xaxis():
    return lambda X, Y, u: f'<line x1="{X(-5)}" y1="{Y(0)}" x2="{X(5)}" y2="{Y(0)}" stroke="#E0A800" stroke-width="4" opacity=".7"/><text x="{X(5)-4}" y="{Y(0)+16}" font-size="11" text-anchor="end" fill="#8A6100" font-weight="700">x-axis (the mirror)</text>'

def vtab(xs, ys, bad=None):
    bad = bad or []
    tds = lambda vals: "".join(f'<td{" class=hit" if i in bad else ""}>{v}</td>' for i, v in enumerate(vals))
    return f'<table class="vt"><tr><th>x</th>{tds(xs)}</tr><tr><th>y</th>{"".join(f"<td>{v}</td>" for v in ys)}</tr></table>'

# ── the ten questions
Q = [
 dict(std="NS.1", title="Rational or irrational?",
      ex=f"√<span class='rad'>9</span> = 3. 3 is a whole number. So √<span class='rad'>9</span> is <b>rational</b>.",
      ex_say="Example. The square root of 9 is 3. 3 is a whole number. So the square root of 9 is rational.",
      stem="Is √<span class='rad'>25</span> rational or irrational?", say="Is the square root of 25 rational or irrational?",
      fig=dot_square(5, "25 dots make a 5 by 5 square"),
      opts=["Rational", "Irrational"], ans=0,
      fb={1: "25 is a perfect square. √25 = 5, a whole number. Whole numbers are rational."},
      why="√25 = 5, because 5 × 5 = 25. 5 is a whole number, so √25 is rational."),
 dict(std="NS.1", title="Find the irrational number",
      ex="π = 3.14159… It never ends and never repeats. So π is <b>irrational</b>.",
      ex_say="Example. Pi is 3.14159 and so on. It never ends and never repeats. So pi is irrational.",
      stem="Which number is <b>irrational</b>?", say="Which number is irrational?",
      fig=squares_strip(7),
      opts=["0.5", "√<span class='rad'>7</span>", fr(1, 4)], ans=1, say_opts=["0.5", "the square root of 7", "one fourth"],
      fb={0: "0.5 stops. It equals <span class='fr'><span>1</span><span>2</span></span>, so it is rational.", 2: "<span class='fr'><span>1</span><span>4</span></span> is a fraction, so it is rational."},
      why="7 is not a perfect square, so √7 = 2.6457… never ends and never repeats. It is irrational."),
 dict(std="EE.1", title="Multiply: add the exponents",
      ex=f"3{sup(2)} · 3{sup(5)} = 3{sup('2 + 5')} = <b>3{sup(7)}</b>. Same base → <b>add</b> the exponents.",
      ex_say="Example. 3 squared times 3 to the 5th equals 3 to the 2 plus 5, which is 3 to the 7th. Same base, so add the exponents.",
      stem=f"Simplify. <span class='expr'>2{sup(3)} · 2{sup(4)}</span>", say="Simplify 2 to the 3rd times 2 to the 4th.",
      fig=twos(3, 4),
      opts=[f"2{sup(7)}", f"2{sup(12)}", f"4{sup(7)}"], ans=0, say_opts=["2 to the 7th", "2 to the 12th", "4 to the 7th"],
      fb={1: "You multiplied 3 × 4. When you multiply powers with the same base, ADD: 3 + 4 = 7.", 2: "Keep the base the same. The base stays 2. Only the exponents add."},
      why=f"Same base, so add the exponents: 3 + 4 = 7. The answer is 2{sup(7)}."),
 dict(std="EE.1", title="Negative exponent: flip it",
      ex=f"3{sup(M + '2')} = {fr(1, '3' + sup(2))} = <b>{fr(1, 9)}</b>. A negative exponent means <b>flip</b>.",
      ex_say="Example. 3 to the negative 2 equals 1 over 3 squared, which is 1 ninth. A negative exponent means flip.",
      stem=f"What is <span class='expr'>2{sup(M + '3')}</span>?", say="What is 2 to the negative 3?",
      fig=flip_pic(),
      opts=[fr(1, 8), M + "8", M + "6"], ans=0, say_opts=["1 eighth", "negative 8", "negative 6"],
      fb={1: "A negative exponent does not make the number negative. It means flip: <span class='fr'><span>1</span><span>2³</span></span> = <span class='fr'><span>1</span><span>8</span></span>.", 2: "Do not multiply 2 × −3. Flip it: 2⁻³ = <span class='fr'><span>1</span><span>2³</span></span> = <span class='fr'><span>1</span><span>8</span></span>."},
      why=f"Flip it: 2{sup(M + '3')} = {fr(1, '2' + sup(3))}. 2 × 2 × 2 = 8, so the answer is {fr(1, 8)}."),
 dict(std="EE.7", title="Solve a two-step equation",
      ex="2x + 1 = 11<br>Subtract 1: 2x = 10<br>Divide by 2: <b>x = 5</b>",
      ex_say="Example. 2x plus 1 equals 11. Subtract 1. 2x equals 10. Divide by 2. x equals 5.",
      stem="Solve. <span class='expr'>3x + 4 = 19</span>", say="Solve. 3x plus 4 equals 19.",
      fig=bar_model(3, 4, 19),
      opts=["x = 5", "x = 7", "x = 15"], ans=0,
      fb={1: "Check it: 3(7) + 4 = 25, not 19. Subtract 4 first: 3x = 15. Then divide by 3.", 2: "3x = 15 is one step away. Divide by 3: x = 5."},
      why="Subtract 4 from both sides: 3x = 15. Divide both sides by 3: x = 5. Check: 3(5) + 4 = 19 ✓"),
 dict(std="EE.7", title="Variables on both sides",
      ex="4x + 1 = 2x + 9<br>Subtract 2x: 2x + 1 = 9<br>Subtract 1: 2x = 8<br>Divide by 2: <b>x = 4</b>",
      ex_say="Example. 4x plus 1 equals 2x plus 9. Subtract 2x. 2x plus 1 equals 9. Subtract 1. 2x equals 8. Divide by 2. x equals 4.",
      stem="Solve. <span class='expr'>5x − 2 = 3x + 8</span>", say="Solve. 5x minus 2 equals 3x plus 8.",
      fig=None,
      opts=["x = 5", "x = 3", "x = 10"], ans=0,
      fb={1: "After you subtract 3x, you get 2x − 2 = 8. ADD 2 to both sides: 2x = 10.", 2: "2x = 10 is one step away. Divide by 2: x = 5."},
      why="Subtract 3x: 2x − 2 = 8. Add 2: 2x = 10. Divide by 2: x = 5. Check: 5(5) − 2 = 23 and 3(5) + 8 = 23 ✓"),
 dict(std="F.1", title="Is the table a function?",
      ex="A function gives each x <b>only one</b> y. " + vtab([1, 2, 3], [4, 5, 6]) + "Each x is used once. This <b>is</b> a function.",
      ex_say="Example. A function gives each x only one y. In this table, each x is used once. This is a function.",
      stem="Is this table a function?" + vtab([1, 1, 2], [3, 4, 5]), say="Is this table a function? x is 1, 1, 2. y is 3, 4, 5.",
      fig=None,
      opts=["Yes", "No"], ans=1,
      fb={0: "Look at x = 1. It goes to 3 AND to 4. One x with two y's is NOT a function."},
      why="x = 1 has two outputs, 3 and 4. A function can give each x only one y, so this is NOT a function."),
 dict(std="F.1", title="Vertical line test",
      ex="Slide a straight up-and-down line across the graph. If it touches the graph <b>only once</b> everywhere, it <b>is</b> a function.",
      ex_say="Example. Slide a straight up and down line across the graph. If it touches the graph only once everywhere, it is a function.",
      stem="Which graph is a <b>function</b>?", say="Which graph is a function?",
      fig=None,
      opts=[curve_graph("line", u=11), curve_graph("circle", u=11), curve_graph("vertical", u=11)], ans=0,
      say_opts=["a slanted line", "a circle", "a straight up and down line"], grid=True,
      fb={1: "A vertical line touches the circle in 2 places. That is NOT a function.", 2: "This graph IS a vertical line. It touches itself everywhere. NOT a function."},
      why="Any vertical line crosses the slanted line only once, so it is a function. The circle and the vertical line fail the test."),
 dict(std="G.3", title="Slide a point (translation)",
      ex="Move (1, 1) right 2. Right means <b>add to x</b>. (1 + 2, 1) = <b>(3, 1)</b>.",
      ex_say="Example. Move the point 1, 1 right 2. Right means add to x. 1 plus 2 is 3. The new point is 3, 1.",
      stem="Point P is at (2, 3). Move it <b>right 4</b>. Where does it land?", say="Point P is at 2, 3. Move it right 4. Where does it land?",
      fig=grid(-5, 7, -2, 5, u=19, body=pt(2, 3, "P (2, 3)")),
      opts=["(6, 3)", "(2, 7)", f"({M}2, 3)"], ans=0, say_opts=["6, 3", "2, 7", "negative 2, 3"],
      fb={1: "You added 4 to y. That moves UP. Right changes x: 2 + 4 = 6.", 2: "You subtracted. That moves LEFT. Right means add: 2 + 4 = 6."},
      why="Right 4 means add 4 to x: 2 + 4 = 6. The y stays 3. The answer is (6, 3)."),
 dict(std="G.3", title="Flip over the x-axis (reflection)",
      ex=f"Reflect (3, 5) over the x-axis. The <b>y</b> changes sign. (3, 5) → <b>(3, {M}5)</b>.",
      ex_say="Example. Reflect the point 3, 5 over the x-axis. The y changes sign. 3, 5 becomes 3, negative 5.",
      stem="Point A is at (4, 2). Reflect it over the <b>x-axis</b>. Where does it land?", say="Point A is at 4, 2. Reflect it over the x-axis. Where does it land?",
      fig=grid(-5, 5, -4, 4, u=19, body=combine(hl_xaxis(), pt(4, 2, "A (4, 2)"))),
      opts=[f"(4, {M}2)", f"({M}4, 2)", "(2, 4)"], ans=0, say_opts=["4, negative 2", "negative 4, 2", "2, 4"],
      fb={1: "That is a flip over the y-axis. Over the x-axis, the y changes sign.", 2: "You swapped x and y. A reflection does not swap. Only the y changes sign."},
      why=f"Over the x-axis, x stays the same and y changes sign: (4, 2) → (4, {M}2). The point is now below the x-axis."),
]
for i, q in enumerate(Q):
    q["id"] = str(i + 1)
L = "ABC"
NAMES = {"NS.1": "Rational &amp; Irrational", "EE.1": "Exponents", "EE.7": "Equations", "F.1": "Functions", "G.3": "Transformations"}

NOTES = [
 ("NS.1", "Rational &amp; Irrational Numbers",
  "<b>Rational</b> = can be a fraction. The decimal <b>stops</b> or <b>repeats</b>.<br><b>Irrational</b> = the decimal <b>never stops</b> and <b>never repeats</b>.",
  f"<div class='two'><div><b>Rational</b><br>5 &nbsp; {fr(1, 2)} &nbsp; 0.25 &nbsp; 0.333… &nbsp; √<span class='rad'>16</span></div><div><b>Irrational</b><br>π &nbsp; √<span class='rad'>2</span> &nbsp; √<span class='rad'>7</span></div></div>",
  "Square root of a perfect square (1, 4, 9, 16, 25…) → rational. Not a perfect square → irrational.",
  "Rational numbers can be written as a fraction. The decimal stops or repeats. Irrational numbers never stop and never repeat. The square root of a perfect square is rational."),
 ("EE.1", "Exponent Rules",
  "An exponent tells how many times to multiply the base. 2<sup>3</sup> = 2 × 2 × 2 = 8.",
  f"<table class='rules'><tr><td>Multiply</td><td>add exponents</td><td>2{sup(3)} · 2{sup(4)} = 2{sup(7)}</td></tr><tr><td>Divide</td><td>subtract exponents</td><td>5{sup(6)} ÷ 5{sup(2)} = 5{sup(4)}</td></tr><tr><td>Zero</td><td>always 1</td><td>9{sup(0)} = 1</td></tr><tr><td>Negative</td><td>flip it</td><td>2{sup(M+'3')} = {fr(1, 8)}</td></tr></table>",
  "A negative exponent does NOT make a negative number.",
  "An exponent tells how many times to multiply. When you multiply, add the exponents. When you divide, subtract. Anything to the zero power is 1. A negative exponent means flip it."),
 ("EE.7", "Solving Equations",
  "Do the <b>opposite</b> operation to both sides until x is alone.",
  "<div class='steps2'><span>3x + 4 = 19</span><span>− 4 → 3x = 15</span><span>÷ 3 → <b>x = 5</b></span></div>",
  "Always check: put your answer back in. 3(5) + 4 = 19 ✓",
  "To solve, do the opposite operation to both sides until x is alone. Then check your answer by putting it back in."),
 ("F.1", "What Is a Function?",
  "A <b>function</b> gives each x <b>only one</b> y.",
  vtab([1, 2, 3], [4, 4, 6]) + "<div class='small c'>Function ✓ — each x is used once. (A y can repeat.)</div>" + vtab([1, 1, 2], [3, 4, 5], bad=[0, 1]) + "<div class='small c'>NOT a function ✗ — x = 1 goes to two y's.</div>",
  "Graph? Use the vertical line test: touches only once → function.",
  "A function gives each x only one y. If one x goes to two different y's, it is not a function. On a graph, use the vertical line test."),
 ("G.3", "Moving Points",
  "Use the rule. Then check on the grid.",
  f"<table class='rules'><tr><td>Right / left</td><td>change <b>x</b></td><td>(2, 3) right 4 → (6, 3)</td></tr><tr><td>Up / down</td><td>change <b>y</b></td><td>(2, 3) down 1 → (2, 2)</td></tr><tr><td>Flip over x-axis</td><td><b>y</b> changes sign</td><td>(4, 2) → (4, {M}2)</td></tr><tr><td>Flip over y-axis</td><td><b>x</b> changes sign</td><td>(4, 2) → ({M}4, 2)</td></tr></table>",
  "Right and up are plus. Left and down are minus.",
  "To move a point right or left, change x. Up or down, change y. To flip over the x-axis, y changes sign. To flip over the y-axis, x changes sign."),
]
STRATS = [
 ("Read it two times.", "Read the question. Then read it again, slowly."),
 ("Look at the example.", "Each question has an example. Do the same steps."),
 ("Cross out wrong answers.", "If you know an answer is wrong, cross it out."),
 ("Check your answer.", "Put your answer back in. Does it work?"),
 ("Do not leave it blank.", "Pick your best answer. Then go on."),
]

# ── shared styles (page + print)
BASE_CSS = """
:root{--navy:#1E2D4F;--ink:#1B2333;--muted:#5B6475;--gold:#FFC107;--gold-line:#E0A800;--gold-text:#8A6100;--gold-soft:#FFF6D6;
--bg:#F7F7F4;--line:#E3E5EA;--line-2:#D5D9E0;--ok:#15803D;--ok-bg:#E8F5EC;--no:#B42318;--no-bg:#FBEAE8;
--serif:"Source Serif 4",Georgia,"Times New Roman",serif;--sans:"Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;--mono:"JetBrains Mono",ui-monospace,Menlo,Consolas,monospace}
*{box-sizing:border-box}
sup{font-size:.68em;line-height:0;position:relative;vertical-align:baseline;top:-.55em}
.rad{border-top:2px solid currentColor;padding:1px 2px 0;margin-left:1px}
.fr{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 3px;line-height:1.2}
.fr>span:first-child{border-bottom:2px solid currentColor;padding:0 4px 1px}
.fr>span:last-child{padding:1px 4px 0}
.expr{font:600 1.25em var(--serif);color:var(--navy);white-space:nowrap;margin-left:4px}
table.vt{border-collapse:collapse;font:600 18px var(--serif);margin:10px auto}
table.vt th,table.vt td{border:2px solid var(--navy);padding:6px 14px;text-align:center}
table.vt th{background:var(--navy);color:#fff;font-style:italic}
table.vt td.hit{background:#FBEAE8;color:var(--no)}
table.rules{border-collapse:collapse;width:100%;font-size:16px}
table.rules td{border-bottom:1px solid var(--line);padding:9px 8px;vertical-align:middle}
table.rules td:first-child{font-weight:700;color:var(--navy)}
table.rules td:last-child{font:600 18px var(--serif);color:var(--navy)}
.two{display:flex;flex-wrap:wrap;gap:12px}.two>div{flex:1 1 200px;background:#fff;border:1px solid var(--line);border-radius:8px;padding:10px 12px;font:600 18px/1.7 var(--serif);color:var(--navy)}
.two b{font:700 14px var(--sans);text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
.steps2{display:flex;flex-direction:column;gap:6px;font:600 20px var(--serif);color:var(--navy)}
.steps2 span{background:#fff;border:1px solid var(--line);border-radius:8px;padding:8px 12px}
.small{font-size:14px;color:var(--muted)} .c{text-align:center}
"""

# ═════════════════════════ interactive page ═════════════════════════
def say_attr(t): return t.replace('"', "&quot;")
def opt_html(q, j, o):
    return (f'<button type="button" class="ch{" g" if q.get("grid") else ""}" data-j="{j}" aria-pressed="false"><span class="L">{L[j]}</span><span class="cv">{o}</span></button>')

def qcard(i, q):
    fig = f'<div class="fig" aria-hidden="true">{q["fig"]}</div>' if q["fig"] else ""
    sayq = q["say"] + " " + " ".join(f"{L[j]}: {re.sub('<[^>]+>', '', s)}." for j, s in enumerate(q.get("say_opts") or [re.sub('<[^>]+>', ' ', o) for o in q["opts"]]))
    return f'''
<article class="qc" id="qc{i}" data-i="{i}" hidden>
  <div class="qhead"><span class="tag">NC.8.{q["std"]}</span><span class="qof">Question {i+1} of {len(Q)}</span></div>
  <h2>{q["title"]}</h2>
  <div class="exbox"><div class="exlab">Example</div><div class="exbody">{q["ex"]}</div>
    <button type="button" class="listen" data-say="{say_attr(q["ex_say"])}">Listen</button></div>
  <div class="ask">{q["stem"]}</div>
  {fig}
  <div class="chs{" grid3" if q.get("grid") else ""}">{"".join(opt_html(q, j, o) for j, o in enumerate(q["opts"]))}</div>
  <div class="acts"><button type="button" class="listen" data-say="{say_attr(sayq)}">Listen to the question</button>
    <button type="button" class="btn chk">Check my answer</button><span class="nudge" aria-live="polite"></span></div>
  <div class="res" aria-live="polite"></div>
  <div class="nav2"><button type="button" class="btn ghost back"{" disabled" if i == 0 else ""}>← Back</button>
    <button type="button" class="btn nxt">{"Next →" if i < len(Q) - 1 else "Finish →"}</button></div>
</article>'''

def note_card(n):
    std, title, idea, ex, tip, say = n
    return f'''<section class="ncard"><div class="qhead"><span class="tag">NC.8.{std}</span></div><h2>{title}</h2>
<p class="idea">{idea}</p><div class="nex">{ex}</div><p class="tip"><b>Tip:</b> {tip}</p>
<button type="button" class="listen" data-say="{say_attr(say)}">Listen</button></section>'''

PAGE_CSS = BASE_CSS + """
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:18px/1.6 var(--sans);-webkit-font-smoothing:antialiased}
:focus-visible{outline:3px solid var(--gold-line);outline-offset:3px}
.wrap{max-width:760px;margin:0 auto;padding:28px 16px 96px}
.back-link{display:inline-flex;color:var(--muted);text-decoration:none;font-size:15px;font-weight:500;margin:0 0 18px}
.eyebrow{color:var(--gold-text);font:600 13px/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;margin:0 0 10px}
h1{font:600 clamp(28px,5vw,38px)/1.15 var(--serif);color:var(--navy);margin:0 0 6px}
.ver{display:inline-block;font:600 14px var(--sans);color:var(--navy);background:var(--gold-soft);border:1px solid var(--gold-line);border-radius:999px;padding:3px 12px;margin:0 0 12px}
.lede{color:var(--muted);margin:0}
.hdr{border-bottom:1px solid var(--line);padding:0 0 20px;margin:0 0 20px}
.links{margin-top:14px}.links a{font:600 15px var(--sans);color:var(--navy);text-decoration:none;border:1px solid var(--line-2);background:#fff;border-radius:8px;padding:12px 14px;display:inline-flex;min-height:44px;align-items:center}
.steps{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 20px}
.step{font:600 16px/1 var(--sans);color:var(--navy);background:#fff;border:1px solid var(--line-2);border-radius:999px;min-height:48px;padding:0 18px 0 8px;display:inline-flex;align-items:center;gap:10px;cursor:pointer}
.step .n{width:30px;height:30px;border-radius:50%;display:inline-grid;place-items:center;background:#EEF1F7;font:700 14px var(--sans)}
.step[aria-selected="true"]{background:var(--navy);border-color:var(--navy);color:#fff}
.step[aria-selected="true"] .n{background:var(--gold);color:var(--navy)}
h2{font:600 24px/1.25 var(--serif);color:var(--navy);margin:4px 0 12px}
.scard{display:flex;gap:14px;align-items:flex-start;background:#fff;border:1px solid var(--line);border-radius:10px;padding:16px;margin:0 0 12px}
.scard .num{flex:none;width:40px;height:40px;border-radius:50%;background:var(--navy);color:var(--gold);font:700 18px/40px var(--sans);text-align:center}
.scard b{font-size:19px;color:var(--navy)}
.ncard,.qc,.namebox,.submit{background:#fff;border:1px solid var(--line);border-radius:12px;padding:20px;margin:0 0 16px}
.qhead{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.tag{font:600 13px var(--mono);color:#fff;background:var(--navy);border-radius:6px;padding:4px 8px}
.qof{margin-left:auto;font:600 14px var(--sans);color:var(--muted)}
.idea{font-size:19px;margin:0 0 12px}
.nex{background:#FAFAF8;border:1px dashed var(--line-2);border-radius:10px;padding:12px}
.tip{margin:12px 0 10px;font-size:16px;color:var(--ink)}
.exbox{background:var(--gold-soft);border-left:5px solid var(--gold);border-radius:8px;padding:12px 14px;margin:0 0 16px}
.exlab{font:700 12px var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--gold-text);margin-bottom:4px}
.exbody{font-size:18px;line-height:1.7}
.ask{font-size:20px;font-weight:600;color:var(--ink);margin:0 0 12px}
.fig{display:flex;justify-content:center;margin:4px 0 14px}
svg{max-width:100%;height:auto}
.chs{display:flex;flex-direction:column;gap:10px}
.chs.grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}
.ch{display:flex;align-items:center;gap:14px;font:600 22px/1.3 var(--serif);color:var(--navy);background:#fff;border:2px solid var(--line-2);border-radius:12px;min-height:60px;padding:10px 16px;cursor:pointer;text-align:left;touch-action:manipulation;width:100%}
.ch.g{flex-direction:column;padding:10px 6px}
.ch .L{flex:none;width:32px;height:32px;border-radius:50%;border:2px solid var(--line-2);font:700 15px/28px var(--sans);text-align:center;color:var(--muted)}
.ch[aria-pressed="true"]{border-color:var(--navy);background:#EEF1F7}
.ch[aria-pressed="true"] .L{background:var(--navy);border-color:var(--navy);color:#fff}
.ch.right{border-color:var(--ok);background:var(--ok-bg)} .ch.right .L{background:var(--ok);border-color:var(--ok);color:#fff}
.ch.wrong{border-color:var(--no);background:var(--no-bg)} .ch.wrong .L{background:var(--no);border-color:var(--no);color:#fff}
.ch:disabled{cursor:default}
.acts{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:16px 0 0}
.btn{font:600 17px var(--sans);color:#fff;background:var(--navy);border:0;border-radius:10px;padding:12px 22px;min-height:52px;cursor:pointer}
.btn.ghost{background:#fff;color:var(--navy);border:1.5px solid var(--line-2)}
.btn:disabled{opacity:.45;cursor:default}
.listen{font:600 15px var(--sans);color:var(--navy);background:#fff;border:1.5px solid var(--line-2);border-radius:999px;min-height:44px;padding:0 16px;cursor:pointer;display:inline-flex;align-items:center;gap:8px}
.listen:before{content:"";width:0;height:0;border-left:10px solid var(--navy);border-top:6px solid transparent;border-bottom:6px solid transparent}
.listen.on{background:var(--navy);color:#fff}.listen.on:before{border-left-color:var(--gold)}
.exbox .listen{margin-top:8px;background:transparent}
.nudge{color:var(--no);font-weight:600;font-size:16px}
.res{display:none;margin:14px 0 0;border-radius:10px;padding:14px 16px;font-size:17px}
.res.show{display:block}.res.ok{background:var(--ok-bg);border-left:5px solid var(--ok)}.res.no{background:var(--no-bg);border-left:5px solid var(--no)}
.res .head{font:700 20px var(--sans)} .res.ok .head{color:var(--ok)} .res.no .head{color:var(--no)}
.res .why{margin-top:6px}
.nav2{display:flex;justify-content:space-between;gap:10px;margin:18px 0 0;border-top:1px solid var(--line);padding-top:16px}
.dots{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:0 0 14px}
.dot{width:40px;height:40px;border-radius:50%;border:2px solid var(--line-2);background:#fff;font:700 15px var(--sans);color:var(--navy);cursor:pointer}
.dot.cur{border-color:var(--navy);box-shadow:0 0 0 2px var(--gold)}
.dot.r{background:var(--ok);border-color:var(--ok);color:#fff}.dot.w{background:var(--no);border-color:var(--no);color:#fff}
.namebox label,.lbl2{display:block;font:600 17px var(--sans);color:var(--navy);margin:0 0 8px}
.namebox input{width:100%;max-width:420px;font:18px var(--sans);padding:12px 14px;border:1.5px solid var(--line-2);border-radius:8px;min-height:50px}
.lbl2{margin-top:16px}
.classes{display:flex;flex-wrap:wrap;gap:8px}
.cls{font:600 18px var(--mono);color:var(--navy);background:#fff;border:2px solid var(--line-2);border-radius:8px;min-width:64px;min-height:50px;cursor:pointer}
.cls[aria-pressed="true"]{background:var(--navy);border-color:var(--navy);color:#fff}
.submit h2{margin-top:0}
.msg{font-size:17px;color:var(--muted);margin:8px 0}.msg.warn{color:var(--no);font-weight:600}.msg.good{color:var(--ok);font-weight:600}
.score{display:none}.score.show{display:block}
.big{font:600 46px/1 var(--serif);color:var(--navy);margin:8px 0}.big small{font-size:20px;color:var(--muted)}
table.bystd{border-collapse:collapse;width:100%;font-size:16px;margin:10px 0}
table.bystd td{border-bottom:1px solid var(--line);padding:9px 6px}
table.bystd td.p{text-align:right;font:600 16px var(--mono)}
.btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}
.next{display:flex;justify-content:flex-end;margin-top:18px}
@media (max-width:560px){.chs.grid3{grid-template-columns:1fr}.qof{margin-left:0;width:100%}.wrap{padding-top:20px}}
"""

PAGE_JS = r"""
(function () {
  'use strict';
  var CFG = window.BENCHMARK_CONFIG || {};
  var BENCH = __BENCH__, QD = __QD__, NAMES = __NAMES__;
  var NAME_KEY = 'fluencyLabStudentName', CLASS_KEY = 'benchmarkClass', L = 'ABC';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k) || ''; localStorage.setItem(k, v); } catch (e) {} return ''; }
  function newSession() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  var session = newSession(), cur = 0, locked = false, lastPayload = null;
  var st = QD.map(function () { return { done: false, ok: false, answer: '' }; });

  // ── active-time clock: counts only while the page is on screen and the student did something in the last 60 seconds
  var TM = { test: 0, study: 0, q: {}, cur: null, last: Date.now(), on: true };
  ['pointerdown', 'pointermove', 'keydown', 'input', 'wheel', 'scroll', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, function () { TM.last = Date.now(); }, { passive: true, capture: true });
  });
  setInterval(function () {
    if (!TM.on || document.hidden || Date.now() - TM.last > 60000) return;
    if (!document.getElementById('tP').hidden) { TM.test++; if (TM.cur !== null && !st[TM.cur].done) TM.q[TM.cur] = (TM.q[TM.cur] || 0) + 1; }
    else TM.study++;
  }, 1000);
  function resetClock() { TM.test = 0; TM.study = 0; TM.q = {}; TM.cur = null; TM.on = true; TM.last = Date.now(); }

  // tabs
  function showTab(id) {
    $$('.step').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-tab') === id ? 'true' : 'false'); });
    $$('.tabp').forEach(function (p) { p.hidden = p.id !== id; });
    stopTalk(); window.scrollTo({ top: $('.steps').offsetTop - 60, behavior: 'smooth' });
  }
  $$('.step').forEach(function (b) { b.addEventListener('click', function () { showTab(b.getAttribute('data-tab')); }); });
  $$('[data-go]').forEach(function (b) { b.addEventListener('click', function () { showTab(b.getAttribute('data-go')); }); });

  // read aloud
  var canTalk = 'speechSynthesis' in window;
  function stopTalk() { if (canTalk) { try { speechSynthesis.cancel(); } catch (e) {} } $$('.listen.on').forEach(function (b) { b.classList.remove('on'); }); }
  $$('.listen').forEach(function (b) {
    if (!canTalk) { b.hidden = true; return; }
    b.addEventListener('click', function () {
      var was = b.classList.contains('on'); stopTalk(); if (was) return;
      var u = new SpeechSynthesisUtterance(b.getAttribute('data-say')); u.rate = 0.9;
      u.onend = function () { b.classList.remove('on'); }; b.classList.add('on'); speechSynthesis.speak(u);
    });
  });

  // one question at a time
  function dots() {
    $('#dots').innerHTML = QD.map(function (q, i) {
      return '<button type="button" class="dot' + (i === cur ? ' cur' : '') + (st[i].done ? (st[i].ok ? ' r' : ' w') : '') + '" data-i="' + i + '" aria-label="Question ' + (i + 1) + '">' + (i + 1) + '</button>';
    }).join('');
    $$('#dots .dot').forEach(function (d) { d.addEventListener('click', function () { go(+d.getAttribute('data-i')); }); });
  }
  function go(i) {
    stopTalk(); cur = Math.max(0, Math.min(QD.length - 1, i)); TM.cur = cur;
    $$('.qc').forEach(function (c) { c.hidden = +c.getAttribute('data-i') !== cur; });
    dots();
    var top = $('#dots').getBoundingClientRect().top + window.pageYOffset - 70;
    if (Math.abs(window.pageYOffset - top) > 40) window.scrollTo({ top: top, behavior: 'smooth' });
  }
  $$('.qc').forEach(function (c) {
    var i = +c.getAttribute('data-i');
    $$('.ch', c).forEach(function (b) {
      b.addEventListener('click', function () {
        if (st[i].done || locked) return;
        $$('.ch', c).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        $('.nudge', c).textContent = '';
      });
    });
    $('.chk', c).addEventListener('click', function () { check(i); });
    $('.back', c).addEventListener('click', function () { go(i - 1); });
    $('.nxt', c).addEventListener('click', function () {
      if (i < QD.length - 1) go(i + 1);
      else { $('#submitbox').scrollIntoView({ block: 'start', behavior: 'smooth' }); }
    });
  });
  function picked(i) { var b = $('#qc' + i + ' .ch[aria-pressed="true"]'); return b ? +b.getAttribute('data-j') : -1; }
  function grade(i) {
    var q = QD[i], j = picked(i);
    if (j < 0) return { blank: true, ok: false, msg: 'You did not answer this one.', answer: '' };
    if (j === q.ans) return { ok: true, msg: '', answer: L[j] };
    return { ok: false, msg: q.fb[j] || 'Look at the example again.', answer: L[j] };
  }
  function show(i, r) {
    var q = QD[i], c = $('#qc' + i);
    st[i] = { done: true, ok: r.ok, answer: r.answer };
    $$('.ch', c).forEach(function (b) {
      var j = +b.getAttribute('data-j'); b.disabled = true;
      if (j === q.ans) b.classList.add('right'); else if (b.getAttribute('aria-pressed') === 'true') b.classList.add('wrong');
    });
    $('.chk', c).hidden = true;
    var res = $('.res', c);
    res.className = 'res show ' + (r.ok ? 'ok' : 'no');
    res.innerHTML = '<div class="head">' + (r.ok ? 'Correct! Great job.' : (r.blank ? 'Not answered' : 'Not yet')) + '</div>' +
      (r.ok ? '' : '<div>' + r.msg + '</div>') + '<div class="why"><b>Answer: ' + L[q.ans] + '.</b> ' + q.why + '</div>';
    dots(); progress();
  }
  function check(i) {
    var r = grade(i);
    if (r.blank) { $('#qc' + i + ' .nudge').textContent = 'Tap an answer first.'; return; }
    show(i, r);
  }
  function progress() {
    var n = st.filter(function (s) { return s.done; }).length;
    $('#progtxt').textContent = n + ' of ' + QD.length + ' done';
  }

  // name, class, submit
  var nameEl = $('#sname'); nameEl.value = store(NAME_KEY);
  function pickClass(c) { $$('.cls').forEach(function (b) { b.setAttribute('aria-pressed', b.textContent === c ? 'true' : 'false'); }); }
  function chosenClass() { var b = $('.cls[aria-pressed="true"]'); return b ? b.textContent : ''; }
  $$('.cls').forEach(function (b) { b.addEventListener('click', function () { if (!locked) pickClass(b.textContent); }); });
  pickClass(store(CLASS_KEY));
  function smsg(t, k) { var e = $('#smsg'); e.textContent = t; e.className = 'msg' + (k ? ' ' + k : ''); }
  var armed = false;
  $('#sbtn').addEventListener('click', function () {
    if (locked) return;
    var name = nameEl.value.replace(/\s+/g, ' ').trim();
    if (name.length < 3 || name.indexOf(' ') < 0) { smsg('Type your first AND last name at the top.', 'warn'); nameEl.focus(); nameEl.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
    var cls = chosenClass();
    if (!cls) { smsg('Tap your class at the top.', 'warn'); $('.classes').scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
    var open = QD.map(function (q, i) { return i; }).filter(function (i) { return !st[i].done && picked(i) < 0; });
    if (open.length && !armed) { armed = true; smsg('You did not answer question ' + open.map(function (i) { return i + 1; }).join(', ') + '. Go back, or tap Submit again.', 'warn'); $('#sbtn').textContent = 'Submit anyway'; return; }
    store(NAME_KEY, name); store(CLASS_KEY, cls); finish(name, cls);
  });
  function finish(name, cls) {
    QD.forEach(function (q, i) { if (!st[i].done) show(i, grade(i)); });
    locked = true; stopTalk();
    $$('.cls').forEach(function (b) { b.disabled = true; });
    var items = [], by = {}, score = 0;
    QD.forEach(function (q, i) {
      if (st[i].ok) score++;
      var b = by[q.std] = by[q.std] || { r: 0, n: 0 }; b.n++; if (st[i].ok) b.r++;
      items.push({ id: q.id, std: q.std, label: q.label, answer: st[i].answer || '(blank)', ok: st[i].ok ? 1 : 0, secs: TM.q[i] || 0 });
    });
    $('#sbtn').hidden = true;
    smsg('Here is your score. Tap a red number above to look at that question again.', '');
    $('#bigscore').innerHTML = score + ' <small>out of ' + QD.length + '</small>';
    $('#bystd').innerHTML = Object.keys(by).map(function (s) { return '<tr><td>' + NAMES[s] + '</td><td class="p">' + by[s].r + ' / ' + by[s].n + '</td></tr>'; }).join('');
    $('#scorebox').classList.add('show');
    TM.on = false;
    lastPayload = { code: CFG.CODE, kind: 'benchmark', benchmark: BENCH, name: name, period: cls, session: session, score: score, total: QD.length, items: items, testSecs: TM.test, studySecs: TM.study };
    send();
  }
  function sendmsg(t, k) { var e = $('#sendmsg'); e.textContent = t; e.className = 'msg' + (k ? ' ' + k : ''); }
  function send() {
    $('#resend').hidden = true;
    if (!CFG.ENDPOINT) { sendmsg('Sending is not switched on yet. Show this screen to Mr. Allen.', 'warn'); return; }
    sendmsg('Sending to Mr. Allen…', '');
    fetch(CFG.ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(lastPayload) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.ok) sendmsg('Sent ✓ Mr. Allen has your results, ' + res.name + '.', 'good');
        else { sendmsg('That did not go through. Tap Try sending again, or tell Mr. Allen.', 'warn'); $('#resend').hidden = false; }
      })
      .catch(function () { sendmsg('Could not reach Mr. Allen\'s sheet. Check the internet, then tap Try sending again.', 'warn'); $('#resend').hidden = false; });
  }
  $('#resend').addEventListener('click', send);
  $('#again').addEventListener('click', function () {
    session = newSession(); locked = false; armed = false; lastPayload = null; resetClock();
    st = QD.map(function () { return { done: false, ok: false, answer: '' }; });
    $$('.ch').forEach(function (b) { b.disabled = false; b.setAttribute('aria-pressed', 'false'); b.classList.remove('right', 'wrong'); });
    $$('.chk').forEach(function (b) { b.hidden = false; });
    $$('.res').forEach(function (r) { r.className = 'res'; r.innerHTML = ''; });
    $$('.cls').forEach(function (b) { b.disabled = false; });
    $('#scorebox').classList.remove('show'); $('#sbtn').hidden = false; $('#sbtn').textContent = 'Submit';
    smsg('New try. Start with question 1.', ''); progress(); go(0);
  });
  go(0); progress(); TM.cur = 0;
  window.__bench = { QD: QD, state: function () { return st; }, go: go, clock: TM };
})();
"""

qd = [{"id": q["id"], "std": "NC.8." + q["std"], "label": "V2: " + q["title"], "ans": q["ans"], "fb": q["fb"], "why": q["why"]} for q in Q]
page = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NC Check-In Benchmark Review — Version 2 — Mr. Allen's Math Class</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,600&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<style>{PAGE_CSS}</style>
<script src="../brand.js"></script>
</head>
<body>
<!-- SITE-BAR -->
<script src="../site-bar.js"></script>
<div class="wrap">
<a class="back-link" href="benchmarks.html">← Benchmarks</a>
<header class="hdr">
  <div class="eyebrow">NC Check-In Benchmark</div>
  <h1>NC Check-In Benchmark Review</h1>
  <div class="ver">Version 2</div>
  <p class="lede">First, read the tips. Next, read the notes. Then answer 10 questions, one at a time. Each question has an example to help you.</p>
  <div class="links"><a href="NC_CheckIn_Benchmark_Review_V2.pdf">Printable version (PDF)</a></div>
</header>

<nav class="steps" role="tablist" aria-label="Sections">
  <button type="button" role="tab" class="step" data-tab="tS" aria-selected="true"><span class="n">1</span>Tips</button>
  <button type="button" role="tab" class="step" data-tab="tN" aria-selected="false"><span class="n">2</span>Notes</button>
  <button type="button" role="tab" class="step" data-tab="tP" aria-selected="false"><span class="n">3</span>Questions</button>
</nav>

<section class="tabp" id="tS" role="tabpanel">
  <h2>5 Test Tips</h2>
  {"".join(f'<div class="scard"><span class="num">{i+1}</span><div><b>{a}</b><br>{b}</div></div>' for i, (a, b) in enumerate(STRATS))}
  <div class="next"><button type="button" class="btn" data-go="tN">Next: Notes →</button></div>
</section>

<section class="tabp" id="tN" role="tabpanel" hidden>
  {"".join(note_card(n) for n in NOTES)}
  <div class="next"><button type="button" class="btn" data-go="tP">Next: Questions →</button></div>
</section>

<section class="tabp" id="tP" role="tabpanel" hidden>
  <div class="namebox">
    <label for="sname">Your first and last name</label>
    <input id="sname" type="text" autocomplete="name" placeholder="First and last name">
    <span class="lbl2" id="clslabel">Your class</span>
    <div class="classes" role="group" aria-labelledby="clslabel">
      <button type="button" class="cls" aria-pressed="false">A1</button>
      <button type="button" class="cls" aria-pressed="false">A2</button>
      <button type="button" class="cls" aria-pressed="false">A4</button>
      <button type="button" class="cls" aria-pressed="false">B5</button>
      <button type="button" class="cls" aria-pressed="false">B6</button>
    </div>
  </div>
  <p class="msg c" id="progtxt" aria-live="polite"></p>
  <div class="dots" id="dots"></div>
  {"".join(qcard(i, q) for i, q in enumerate(Q))}
  <section class="submit" id="submitbox" aria-live="polite">
    <h2>Submit to Mr. Allen</h2>
    <p class="msg" id="smsg">When you finish all 10, tap Submit.</p>
    <div class="btns"><button type="button" class="btn" id="sbtn">Submit</button></div>
    <div class="score" id="scorebox">
      <div class="big" id="bigscore"></div>
      <table class="bystd" id="bystd"></table>
      <p class="msg" id="sendmsg"></p>
      <div class="btns"><button type="button" class="btn ghost" id="resend" hidden>Try sending again</button>
        <button type="button" class="btn ghost" id="again">Try again</button></div>
    </div>
  </section>
</section>
</div>
<script src="../benchmark-config.js"></script>
<script>{PAGE_JS.replace("__BENCH__", json.dumps(BENCH, ensure_ascii=False)).replace("__QD__", json.dumps(qd, ensure_ascii=False)).replace("__NAMES__", json.dumps({"NC.8." + k: v.replace("&amp;", "&") for k, v in NAMES.items()}))}</script>
</body>
</html>'''
open(os.path.join(REPO, "grade8", "checkin_benchmark_review_v2.html"), "w").write(page)

# ═════════════════════════ PDF ═════════════════════════
PDF_CSS = f"""
@font-face {{ font-family:'Source Serif 4'; src:url('file://{FONTS}/sourceserif4/SourceSerif4[opsz,wght].ttf'); font-weight:200 900; }}
@font-face {{ font-family:'JetBrains Mono'; src:url('file://{FONTS}/jetbrainsmono/JetBrainsMono[wght].ttf'); font-weight:100 800; }}
@page {{ size: letter; margin: 0.55in 0.6in 0.65in 0.6in; }}
""" + BASE_CSS + """
body{margin:0;font:13pt/1.5 var(--sans);color:var(--ink)}
h1{font:600 30pt/1.1 var(--serif);color:#fff;margin:6px 0;max-width:78%;position:relative;z-index:1}
h2{font:600 18pt/1.2 var(--serif);color:var(--navy);margin:0 0 8px}
.hero{background:var(--navy);color:#fff;border-radius:14px;padding:26px 28px;position:relative;overflow:hidden}
.hero:after{content:"";position:absolute;right:-40px;top:-40px;width:160px;height:160px;border-radius:50%;background:var(--gold)}
.hero .s{font:700 9pt var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--gold)}
.hero .v{display:inline-block;background:var(--gold);color:var(--navy);font-weight:800;border-radius:999px;padding:3px 14px;margin-top:6px;position:relative;z-index:1}
.namebar{display:flex;gap:16px;margin:18px 0}
.namebar div{flex:1;border-bottom:1.5px solid var(--navy);font-size:10pt;color:var(--muted);font-weight:600;padding-bottom:3px}
.namebar div.s{flex:.4}
.sc{display:flex;gap:12px;align-items:flex-start;border:1px solid var(--line);border-radius:10px;padding:10px 14px;margin:0 0 9px;break-inside:avoid}
.sc .num{flex:none;width:30px;height:30px;border-radius:50%;background:var(--navy);color:var(--gold);font:700 13pt/30px var(--sans);text-align:center}
.nc{border:1px solid var(--line);border-radius:10px;padding:12px 16px;margin:0 0 12px;break-inside:avoid}
.tag{font:600 9pt var(--mono);color:#fff;background:var(--navy);border-radius:5px;padding:3px 7px}
.idea{margin:6px 0 8px}
.nex{background:#FAFAF8;border:1px dashed var(--line-2);border-radius:8px;padding:8px 10px}
.tip{margin:8px 0 0;font-size:11.5pt}
.q{border:1.5px solid var(--line);border-radius:12px;padding:14px 18px;margin:0 0 14px;break-inside:avoid}
.qh{display:flex;align-items:center;gap:10px;margin-bottom:6px}
.qn{width:30px;height:30px;border-radius:8px;background:var(--navy);color:var(--gold);font:700 14pt/30px var(--serif);text-align:center}
.exbox{background:var(--gold-soft);border-left:5px solid var(--gold);border-radius:8px;padding:8px 12px;margin:4px 0 10px;font-size:12pt}
.exlab{font:700 8.5pt var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--gold-text)}
.ask{font-size:14pt;font-weight:600;margin:0 0 8px}
.row{display:flex;gap:16px;align-items:center}
.row .fig{flex:none}
.opts{display:flex;flex-wrap:wrap;gap:10px 26px;margin:8px 0 4px}
.opt{display:flex;align-items:center;gap:10px;font:600 16pt var(--serif);color:var(--navy)}
.opt .b{width:24px;height:24px;border-radius:50%;border:2px solid var(--navy);font:700 10pt/20px var(--sans);text-align:center}
.opt.k .b{background:var(--gold)}
.opts.g .opt{flex-direction:column}
.work{border-top:1px dashed var(--line-2);margin-top:8px;padding-top:3px;font-size:9pt;color:#9aa3b5;height:40px}
.key{margin-top:8px;background:#F3F5FA;border-left:4px solid var(--gold);border-radius:0 6px 6px 0;padding:6px 10px;font-size:11pt}
.pb{break-before:page}
"""
def pdf_q(i, q, key):
    opts = "".join(f'<div class="opt{" k" if key and j == q["ans"] else ""}"><span class="b">{L[j]}</span><span>{o}</span></div>' for j, o in enumerate(q["opts"]))
    fig = f'<div class="fig">{q["fig"]}</div>' if q["fig"] else ""
    body = f'<div class="ask">{q["stem"]}</div><div class="opts{" g" if q.get("grid") else ""}">{opts}</div>'
    if fig: body = f'<div class="row"><div style="flex:1">{body}</div>{fig}</div>'
    tail = f'<div class="key"><b>Answer: {L[q["ans"]]}.</b> {q["why"]}</div>' if key else '<div class="work">Show your work</div>'
    return f'<div class="q"><div class="qh"><span class="qn">{i+1}</span><span class="tag">NC.8.{q["std"]}</span><b style="color:var(--navy)">{q["title"]}</b></div><div class="exbox"><div class="exlab">Example</div>{q["ex"]}</div>{body}{tail}</div>'

def pdf_doc(key):
    cover = f'''<div class="hero"><div class="s">Mr. Allen's 8th Grade Math</div><h1>NC Check-In Benchmark Review</h1><div class="v">Version 2{" — Answer Key" if key else ""}</div></div>'''
    if key:
        return cover + '<h2 style="margin-top:18px">Answers</h2><p>' + " &nbsp; ".join(f"<b>{i+1}.</b> {L[q['ans']]}" for i, q in enumerate(Q)) + '</p>' + "".join(pdf_q(i, q, True) for i, q in enumerate(Q))
    s = cover + '<div class="namebar"><div>Name</div><div class="s">Date</div><div class="s">Class</div></div>'
    s += "<h2>5 Test Tips</h2>" + "".join(f'<div class="sc"><span class="num">{i+1}</span><div><b>{a}</b><br>{b}</div></div>' for i, (a, b) in enumerate(STRATS))
    s += '<div class="pb"></div><h2>Notes</h2>' + "".join(f'<div class="nc"><span class="tag">NC.8.{n[0]}</span> <b style="font:600 14pt var(--serif);color:var(--navy)">{n[1]}</b><p class="idea">{n[2]}</p><div class="nex">{n[3]}</div><p class="tip"><b>Tip:</b> {n[4]}</p></div>' for n in NOTES)
    s += '<div class="pb"></div><h2>Questions</h2>' + "".join(pdf_q(i, q, False) for i, q in enumerate(Q))
    return s

from playwright.sync_api import sync_playwright
footer = lambda label: f'<div style="width:100%;font-family:Inter;font-size:8px;color:#55607a;padding:0 0.6in;display:flex;justify-content:space-between"><span>Mr. Allen\'s 8th Grade Math • {label}</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>'
with sync_playwright() as p:
    b = p.chromium.launch()
    for key, path, label in [(False, os.path.join(REPO, "grade8", "NC_CheckIn_Benchmark_Review_V2.pdf"), "NC Check-In Review — Version 2"),
                             (True, os.path.join(KEY_DIR, "NC_CheckIn_Review_V2_Answer_Key.pdf"), "NC Check-In Review — Version 2 — Answer Key")]:
        hp = "/tmp/v2_" + ("key" if key else "student") + ".html"
        open(hp, "w").write(f"<!doctype html><html><head><meta charset='utf-8'><style>{PDF_CSS}</style></head><body>{pdf_doc(key)}</body></html>")
        pg = b.new_page(); pg.goto("file://" + hp); pg.wait_for_timeout(400)
        pg.pdf(path=path, format="Letter", print_background=True, display_header_footer=True, header_template="<div></div>",
               footer_template=footer(label), prefer_css_page_size=True)
    b.close()
print("built v2")
