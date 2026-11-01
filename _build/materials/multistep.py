"""Multi-Step Equations (NC.8.EE.7) — two-sided handout + separate answer key.
FRONT: flowchart notes + Reciprocal box + 6 blank sample problems (worked in green on the key).
BACK: 10 leveled Check-In style practice items (Approaching (3) / Proficient (4) / Mastery (5)).

    sh _build/materials/get_fonts.sh
    OUT_DIR=/path/to/out python3 _build/materials/multistep.py

Every equation line (problem AND each worked step) is written once in plain text and checked
with Fraction arithmetic before rendering. Fractions appear ONLY in the reciprocal problems;
distributive problems distribute integers only.
"""
import sys, os, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kit import *
import kit
from fractions import Fraction as F
from handouts import item, mc, sa, entry, work, front_head, back_head
import handouts
from equations import flowchart

TOPIC, STD = "Multi-Step Equations", "NC.8.EE.7"

kit.CSS += """
.lv{grid-column:span 2;display:flex;align-items:center;gap:8px;margin:2px 0 0;font:700 9pt Inter;color:#1E2D4F}
.lv .st{color:#E0A800;font-size:10.5pt;letter-spacing:1px}
.lv:after{content:"";flex:1;border-top:1.4px solid #E3E5EA}
.stp{font:600 9pt/1.35 'Source Serif 4',Georgia,serif;color:#15803D}
.stp .sl{font:600 7.6pt Inter;color:#15803D;opacity:.8;margin-right:5px}.stp .sl:after{content:':'}
"""

# ── plain text → checked math + HTML ──────────────────────────────────────────
def _py(side):
    s = re.sub(r"\[(\d+)/(\d+)\]", r"F(\1,\2)*", side.replace("−", "-"))
    s = re.sub(r"(\d|\))\s*(x|\()", r"\1*\2", s)
    return s.replace("*-", "*-")

def val(side, x): return eval(_py(side), {"F": F, "x": F(x)})

def holds(eq, x):
    l, r = eq.split("=")
    return val(l, x) == val(r, x)

def html(eq):
    eq = re.sub(r"\[(\d+)/(\d+)\]", lambda m: fr(m.group(1), m.group(2)), eq)
    return eq.replace("-", "−").replace("x", "<i>x</i>").replace("<<i>x</i>", "<x")

def solve_lin(eq):
    """Solve a linear equation by evaluating at 0 and 1. Returns Fraction, 'all', or 'none'."""
    l, r = eq.split("=")
    d0 = val(l, 0) - val(r, 0); d1 = val(l, 1) - val(r, 1); a = d1 - d0
    if a == 0: return "all" if d0 == 0 else "none"
    return -d0 / a

def worked(eq, x, steps):
    """steps: [(label, plain equation)]. Assert the start and EVERY step is true at x, and the last line is 'x = ans'."""
    assert solve_lin(eq) == F(x), (eq, solve_lin(eq), x)
    for lab, s in steps:
        assert holds(s, x), (eq, lab, s)
        assert solve_lin(s) == F(x), (eq, s)
    assert steps[-1][1].replace(" ", "") == f"x={x}", steps[-1]
    return steps

COMPACT = [False]
def show(steps, check=None):
    if COMPACT[0]:
        rows = [f'<span class="sl">{lab}</span>{html(st) if st else ""}' for lab, st in steps[:-1]]
        rows.append(f'<span class="sl">{steps[-1][0]}</span><b>{html(steps[-1][1])}</b>')
        return '<div class="stp" style="columns:2;column-gap:10px">' + "".join(f"<div>{r}</div>" for r in rows) + '</div>'
    out = "".join(f'<div><span class="sl">{lab}</span>{html(s) if s else ""}</div>' for lab, s in steps[:-1])
    out += f'<div><span class="sl">{steps[-1][0]}</span><b>{html(steps[-1][1])}</b></div>'
    if check: out += f'<div><span class="sl">Check</span>{check} ✓</div>'
    return f'<div class="stp">{out}</div>'

# ══════════════════════ FRONT ══════════════════════
S = [
  ("1 · Combine like terms", "4x + 7 - x = 22", 5, [
      ("Combine like terms", "3x + 7 = 22"), ("Undo +7: −7 both sides", "3x = 15"), ("Undo ×3: ÷3 both sides", "x = 5")],
      "4(5) + 7 − 5 = 22"),
  ("2 · Distributive property", "-2(x + 3) = 10", -8, [
      ("Distribute −2", "-2x - 6 = 10"), ("Undo −6: +6 both sides", "-2x = 16"), ("Undo ×(−2): ÷(−2) both sides", "x = -8")],
      "−2(−8 + 3) = −2(−5) = 10"),
  ("3 · Variables on both sides", "7x - 5 = 3x + 11", 4, [
      ("Subtract 3x (smaller) both sides", "4x - 5 = 11"), ("Undo −5: +5 both sides", "4x = 16"), ("Undo ×4: ÷4 both sides", "x = 4")],
      "7(4) − 5 = 23 and 3(4) + 11 = 23"),
  ("4 · Use the reciprocal", "[3/4]x - 5 = 7", 16, [
      ("Undo −5: +5 both sides", "[3/4]x = 12"), ("Undo × " + fr(3, 4) + ": × reciprocal " + fr(4, 3), "x = 16")],
      fr(3, 4) + " · 16 = 12 and 12 − 5 = 7"),
  ("5 · Mixed: all the steps", "2(x + 5) + 3x = 4x + 16", 6, [
      ("Distribute 2", "2x + 10 + 3x = 4x + 16"), ("Combine like terms", "5x + 10 = 4x + 16"),
      ("Subtract 4x (smaller) both sides", "x + 10 = 16"), ("Undo +10: −10 both sides", "x = 6")],
      "2(11) + 18 = 40 and 24 + 16 = 40"),
  ("6 · Mixed: all the steps", "5(x + 1) - 2x = x - 7", -6, [
      ("Distribute 5", "5x + 5 - 2x = x - 7"), ("Combine like terms", "3x + 5 = x - 7"),
      ("Subtract x (smaller) both sides", "2x + 5 = -7"), ("Undo +5: −5 both sides", "2x = -12"), ("Undo ×2: ÷2 both sides", "x = -6")],
      "5(−5) + 12 = −13 and −6 − 7 = −13"),
]
for t, eq, x, st, ck in S: worked(eq, x, st)
assert F(3, 4) * 16 == 12 and F(2, 3) * F(3, 2) == 1 and F(3, 2) * 8 == 12

def sample(t, eq, x, st, ck, key, h):
    # box stretches to its grid row; blank space grows, the x = line stays at the bottom; key steps stay at the top
    body = (show(st, ck) + '<div style="flex:1"></div>') if key else f'<div style="flex:1;min-height:{h}px"></div><div style="text-align:right;font-size:9.5pt"><i>x</i> = <span class="line" style="min-width:60px"></span></div>'
    return f'<div class="sample" style="display:flex;flex-direction:column;margin:0"><b style="font-size:9.5pt;color:#1E2D4F">{t}</b><div class="eq">{html(eq)}</div>{body}</div>'

def front(key):
    COMPACT[0] = False
    h = front_head(f"{STD} · Notes", TOPIC, "Combine like terms · Distributive property · Variables on both sides · Reciprocals", key)
    notes = f'''<div class="box" style="padding:5px 4px 0 6px"><b style="font:600 11pt 'Source Serif 4';color:#1E2D4F">Follow the flowchart</b>
<div style="font-size:8.6pt;margin:1px 0 0">Go top to bottom. Do the <b>same thing to both sides</b>.</div><div style="zoom:.95">{flowchart()}</div></div>'''
    recip = f'''<div class="box gold" style="font-size:9pt"><h3>Reciprocal</h3>
The <b>reciprocal</b> of a fraction is the fraction <b>flipped</b>. The reciprocal of {fr(2, 3)} is {fr(3, 2)}.<br>
A number times its reciprocal = 1. &nbsp;{fr(2, 3)} × {fr(3, 2)} = 1<br>
Use it to undo a fraction next to <i>x</i>:<div class="m" style="margin-top:2px">{fr(2, 3)}<i>x</i> = 8 &nbsp;→&nbsp; {fr(3, 2)} · {fr(2, 3)}<i>x</i> = 8 · {fr(3, 2)} &nbsp;→&nbsp; <i>x</i> = 12</div></div>'''
    vocab = '''<div class="box" style="font-size:8.6pt;line-height:1.45"><b>Like terms</b>: same variable part (3x and −x; 5 and 2). Add them.<br>
<b>Distributive property</b>: multiply the outside number by <b>every</b> term inside.<br>
<b>Variables on both sides</b>: subtract the smaller x-term from both sides.</div>'''
    cells = "".join(sample(*s, key, 96) for s in S)
    return h + f'''<div data-fit><div class="cols" style="gap:10px"><div style="flex:0 0 372px">{notes}{recip}{vocab}</div>
<div style="display:flex;flex-direction:column"><div class="grid2" style="gap:6px;flex:1;grid-template-rows:repeat(3,1fr);margin-bottom:7px">{cells}</div></div></div></div>'''

# ══════════════════════ BACK ══════════════════════
# 10 items: 3 Approaching (3), 4 Proficient (4), 3 Mastery (5). Every solve item gets ≥ 1.3 in of blank work space
# (measured on the printed page by render_ms below). The two multiple-choice items share a shorter top row.
kit.CSS += """
.pq{border:1px solid #E3E5EA;border-radius:8px;padding:5px 9px 6px;position:relative;break-inside:avoid;display:flex;flex-direction:column}
.pq .hd{display:flex;align-items:center;gap:6px;font-size:9.8pt}
.pq .eqn{font:600 11.5pt 'Source Serif 4',Georgia,serif;color:#1E2D4F}
.stars{font:700 8pt Inter;color:#8A6100;background:#FFF6D6;border-radius:4px;padding:1px 5px;white-space:nowrap}
.ws{flex:1 0 auto}
.corner{position:absolute;right:8px;bottom:6px;font-size:9.5pt}
.corner .ent{min-width:64px}
"""
# Learning-target levels, same colors as grade8/targets/ (--appr / --prof / --mast)
LV = {1: ("Approaching (3)", "#8A6100", "#FFF4D1"), 2: ("Proficient (4)", "#1D4ED8", "#E6EEFF"), 3: ("Mastery (5)", "#15803D", "#E3F5E8")}

B = {   # solve-for-x items: n: (plain equation, x, steps)
  1: ("3(x - 4) = 18", 10, [("Distribute 3", "3x - 12 = 18"), ("+12 both sides", "3x = 30"), ("÷3 both sides", "x = 10")]),
  2: ("[2/5]x = 6", 15, [("× reciprocal " + fr(5, 2) + " both sides", "x = 15")]),
  3: ("4x + 3x - 5 = 23", 4, [("Combine like terms", "7x - 5 = 23"), ("+5 both sides", "7x = 28"), ("÷7 both sides", "x = 4")]),
  4: ("-4(x + 2) = 20", -7, [("Distribute −4", "-4x - 8 = 20"), ("+8 both sides", "-4x = 28"), ("÷(−4) both sides", "x = -7")]),
  5: ("6x + 3 - 2x = 2x + 13", 5, [("Combine like terms", "4x + 3 = 2x + 13"), ("−2x both sides", "2x + 3 = 13"), ("−3 both sides", "2x = 10"), ("÷2 both sides", "x = 5")]),
  6: ("[3/4]x + 2 = 11", 12, [("−2 both sides", "[3/4]x = 9"), ("× reciprocal " + fr(4, 3) + " both sides", "x = 12")]),
  7: ("5x - 3(x + 2) = 14", 10, [("Distribute −3", "5x - 3x - 6 = 14"), ("Combine like terms", "2x - 6 = 14"), ("+6 both sides", "2x = 20"), ("÷2 both sides", "x = 10")]),
  9: ("4(2x - 3) - 5x = 2(x + 7) - 6", 20, [("Distribute both sides", "8x - 12 - 5x = 2x + 14 - 6"), ("Combine like terms", "3x - 12 = 2x + 8"),
                                           ("−2x both sides", "x - 12 = 8"), ("+12 both sides", "x = 20")]),
  8: ("2(3x - 1) + 4 = 4(x + 5)", 9, [("Distribute both sides", "6x - 2 + 4 = 4x + 20"), ("Combine like terms", "6x + 2 = 4x + 20"),
                                       ("−4x both sides", "2x + 2 = 20"), ("−2 both sides", "2x = 18"), ("÷2 both sides", "x = 9")]),
}
for n, (eq, x, st) in B.items(): worked(eq, x, st)
# MC distractors (#1: forgot to distribute → 3x − 4 = 18 isn't an option; 2 = 18÷3 − 4, 6 = 18÷3, 22 = 18 + 4.  #2: 12/5 = 6 × ⅖, 3 = 6 ÷ 2, 30 = 6 × 5)
assert F(18, 3) - 4 == 2 and F(18, 3) == 6 and 18 + 4 == 22
assert F(6) * F(2, 5) == F(12, 5) and F(6, 2) == 3 and 6 * 5 == 30
MC1 = ["2", "6", "10", "22"]; MC2 = [fr(12, 5), "3", "15", "30"]
assert MC1.index(str(B[1][1])) == 2 and MC2.index(str(B[2][1])) == 2
# 7 · how many solutions
HM = "3(x + 2) - x = 2x + 6"
HM_ST = [("Distribute 3", "3x + 6 - x = 2x + 6"), ("Combine like terms", "2x + 6 = 2x + 6")]
assert solve_lin(HM) == "all" and all(solve_lin(e) == "all" for _, e in HM_ST)
# 9 · word problem: Shop A $8 delivery + $11 a pizza; Shop B $2 + $13 a pizza
WP = "8 + 11x = 2 + 13x"
WP_ST = worked(WP, 3, [("Equation", WP), ("−11x both sides", "8 = 2 + 2x"), ("−2 both sides", "6 = 2x"), ("÷2 both sides", "x = 3")])
assert 8 + 11 * 3 == 2 + 13 * 3 == 41
# 10 · find the error: Dev wrote 5x − 2 (did not multiply 5 by the 2); the rest of his work is right for that line
ER = "5(x - 2) = 3x + 6"
assert solve_lin("5x - 2 = 3x + 6") == 4 and holds("2x - 2 = 6", 4) and holds("2x = 8", 4)
B_ER = worked(ER, 8, [("Distribute 5", "5x - 10 = 3x + 6"), ("−3x both sides", "2x - 10 = 6"), ("+10 both sides", "2x = 16"), ("÷2 both sides", "x = 8")])

def pq(n, lv, head, body, key, ws, ans=None, ans_label="<i>x</i> ="):
    blank = f'<div class="ws" style="min-height:{ws}px"></div>' if not key else '<div class="ws"></div>'
    corner = (f'<div class="{"" if key else "corner"}" style="{"text-align:right;font-size:9.5pt;margin-top:3px" if key else ""}">{ans_label} <span class="ent" style="min-width:64px">{ans if key else ""}</span></div>'
              if ans is not None else "")
    return (f'<div class="pq"><div class="hd"><span class="qn">{n}</span><span class="stars" style="color:{LV[lv][1]};background:{LV[lv][2]}">{LV[lv][0]}</span>{head}</div>'
            f'{body}{blank}{corner}</div>')

def solve_q(n, lv, key, ws, note=""):
    e, x, st = B[n]
    return pq(n, lv, f'Solve. <span class="eqn">{html(e)}</span>{note}', show(st) if key else "", key, ws, neg(x))

WS = 150     # px at zoom 1; render_ms reports the printed size

def back(key):
    COMPACT[0] = True
    h = back_head(f"{STD} · Practice", TOPIC, "Use the flowchart. Show every step. Check your answer. &nbsp;Levels: Approaching (3) · Proficient (4) · Mastery (5)", key)
    mcq = lambda n, opts: pq(n, 1, f'Solve. <span class="eqn">{html(B[n][0])}</span>',
                             (show(B[n][2]) if key else "") + mc([f"<i>x</i> = {o}" for o in opts], 2, key, 4), key, 46)
    items = [
      mcq(1, MC1), mcq(2, MC2),
      solve_q(3, 1, key, WS), solve_q(4, 2, key, WS),
      solve_q(5, 2, key, WS), solve_q(6, 2, key, WS, ' <span class="small">Use the reciprocal.</span>'),
      solve_q(7, 2, key, WS),
      solve_q(8, 3, key, WS),
      solve_q(9, 3, key, WS),
      pq(10, 3, '<b style="font-size:9pt;color:#1E2D4F">Find the error</b>',
         f'<div class="stem" style="margin-top:2px">Dev solved <span class="m">{html(ER)}</span>. His work: '
         '<span class="m" style="font-weight:500">5<i>x</i> − 2 = 3<i>x</i> + 6 → 2<i>x</i> − 2 = 6 → 2<i>x</i> = 8 → <i>x</i> = 4</span>. '
         'What did Dev do wrong? Solve it the right way.</div>'
         + ('<div class="stp">Dev did not multiply 5 by the 2. 5 · 2 = 10, so it is 5<i>x</i> − 10.</div>' + show(B_ER) if key else ""), key, WS, "8"),
    ]
    return h + f'<div data-fit><div class="grid2">{"".join(items)}</div></div>'

# ── render with a private temp file (another builder may use kit's /tmp/_mat.html) and measure the printed layout
def render_ms(pages, path, footer):
    import tempfile
    from playwright.sync_api import sync_playwright
    body = "".join(f'<section style="break-after:page">{p}</section>' for p in pages[:-1]) + f"<section>{pages[-1]}</section>"
    html_ = f"<!doctype html><html><head><meta charset='utf-8'><style>@page{{size:letter;margin:0.4in 0.45in 0.45in}}{kit.CSS}</style></head><body>{body}</body></html>"
    fd, tmp = tempfile.mkstemp(suffix=".html"); os.write(fd, html_.encode()); os.close(fd)
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": 730, "height": 900}); pg.goto("file://" + tmp); pg.wait_for_timeout(300)
        pg.emulate_media(media="print")
        avail = 11 * 96 - 0.85 * 96 - 14
        zooms = pg.evaluate("""(avail) => { const zs = []; for (const sec of document.querySelectorAll('section')) {
            const f = sec.querySelector('[data-fit]'); if (!f) { zs.push(1); continue; }
            let z = 1.0; f.style.zoom = z;
            while (z > 0.8 && sec.getBoundingClientRect().height > avail) { z -= 0.02; f.style.zoom = z; } zs.push(z); } return zs; }""", avail)
        info = pg.evaluate("""() => { const secs = [...document.querySelectorAll('section')];
            return { heights: secs.map(s => s.getBoundingClientRect().height),
                     ws: [...secs[secs.length-1].querySelectorAll('.pq')].map(q => {
                        const w = q.querySelector('.ws').getBoundingClientRect().height;
                        const c = q.querySelector('.corner'); return w + (c ? 0 : 0); }),
                     flow: (() => { const t = [...document.querySelectorAll('section svg text')].find(e => e.textContent.startsWith('Distribute')); return t ? t.getBoundingClientRect().height : 0; })() }; }""")
        pg.pdf(path=path, print_background=True, format="Letter", prefer_css_page_size=True, display_header_footer=True, header_template="<div></div>",
               footer_template=f'<div style="width:100%;font-family:Inter;font-size:7px;color:#8a93a8;padding:0 0.45in;display:flex;justify-content:space-between"><span>Mr. Allen&#39;s 8th Grade Math • {footer}</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>')
        b.close()
    os.unlink(tmp)
    return zooms, info

if __name__ == "__main__":
    name = "Multi_Step_Equations"
    for key in (False, True):
        z, info = render_ms([front(key), back(key)], f"{OUT}/{name}{'_AnswerKey' if key else ''}.pdf", TOPIC + (" — Answer Key" if key else ""))
        print("  flowchart action text height (pt):", round(info["flow"] * 0.75, 1))
        print("KEY" if key else "STUDENT", "fit zooms", [round(v, 2) for v in z], "page heights", [round(h) for h in info["heights"]])
        if not key:
            ins = [round(w / 96, 2) for w in info["ws"]]
            print("  blank work space per item (in):", ins)
            assert all(v >= 1.3 for i, v in enumerate(ins) if i not in (0, 1)), ins     # items 1–2 are the MC row
    print("built in", OUT)
