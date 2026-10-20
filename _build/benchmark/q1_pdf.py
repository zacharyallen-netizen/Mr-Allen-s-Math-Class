import sys, pathlib, subprocess
from playwright.sync_api import sync_playwright

OUT = pathlib.Path(sys.argv[1])
FONTS = '/usr/local/lib/python3.13/dist-packages/mkdocs/themes/readthedocs/css/fonts'
NAVY, GOLD = '#1E2D4F', '#FFC107'
M = '−'

def sn(c, e):
    e = str(e).replace('-', M)
    return f'<span class="nw">{c}<span class="times">×</span>10<sup>{e}</sup></span>'

def fr(t, b):
    return f'<span class="fr"><span class="ft">{t}</span><span class="fb">{b}</span></span>'

def rt(x):
    return f'<span class="nw">√<span class="rad">{x}</span></span>'

def bar(d):
    return f'<span class="ovl">{d}</span>'

def blank(w=44):
    return f'<span class="blank" style="width:{w}px"></span>'

def chk(label=''):
    return f'<span class="chk"></span>{label}'

def bubble(L, txt):
    return f'<div class="opt"><span class="bub">{L}</span><span>{txt}</span></div>'

CSS = f'''
@font-face {{ font-family:'Slab'; font-weight:400; src:url('file://{FONTS}/Roboto-Slab-Regular.woff2') format('woff2'); }}
@font-face {{ font-family:'Slab'; font-weight:700; src:url('file://{FONTS}/Roboto-Slab-Bold.woff2') format('woff2'); }}
@page {{ size: letter; margin: 0; }}
* {{ box-sizing:border-box; margin:0; padding:0; }}
:root {{ --navy:{NAVY}; --gold:{GOLD}; --gold-soft:#FFF6D6; --line:#CDD3E0; --ink:#1B2333; --muted:#5B6578; --navy-soft:#EEF1F7; }}
body {{ font-family:'Inter',sans-serif; color:var(--ink); font-size:10.2pt; }}
.page {{ width:8.5in; height:11in; padding:0.4in 0.48in 0.36in; display:flex; flex-direction:column; page-break-after:always; overflow:hidden; }}
.page:last-child {{ page-break-after:auto; }}
h1,h2,.slab {{ font-family:'Slab',serif; }}
.hdr {{ background:var(--navy); color:#fff; border-radius:10px; padding:11px 18px; display:flex; align-items:center; justify-content:space-between; border-bottom:5px solid var(--gold); }}
.hdr .kicker {{ color:var(--gold); font-size:8pt; font-weight:700; letter-spacing:.14em; text-transform:uppercase; }}
.hdr h1 {{ font-size:19pt; font-weight:700; line-height:1.15; margin-top:2px; }}
.hdr .badge {{ background:var(--gold); color:var(--navy); font-family:'Slab',serif; font-weight:700; font-size:11pt; padding:6px 13px; border-radius:999px; white-space:nowrap; }}
.hdr.small {{ padding:8px 18px; }} .hdr.small h1 {{ font-size:13.5pt; }}
.who {{ display:flex; gap:18px; margin:9px 2px 0; font-weight:600; font-size:10pt; color:var(--navy); }}
.who span {{ display:flex; align-items:flex-end; gap:6px; }}
.who i {{ display:inline-block; border-bottom:1.3px solid var(--navy); height:15px; }}
.sec {{ margin-top:8px; }}
.sec-h {{ display:flex; align-items:center; gap:9px; margin-bottom:6px; }}
.sec-h .part {{ background:var(--navy); color:var(--gold); font-family:'Slab',serif; font-weight:700; font-size:9pt; padding:3px 9px; border-radius:5px; letter-spacing:.04em; }}
.sec-h h2 {{ font-size:13pt; color:var(--navy); font-weight:700; }}
.sec-h .std {{ margin-left:auto; font-size:8pt; color:var(--muted); font-weight:600; }}
.tip {{ background:var(--gold-soft); border-left:4px solid var(--gold); border-radius:6px; padding:5px 11px; font-size:9pt; line-height:1.45; margin-bottom:7px; }}
.tip b.lbl {{ color:var(--navy); font-size:8pt; letter-spacing:.1em; margin-right:4px; }}
.grid {{ display:grid; grid-template-columns:1fr 1fr; gap:8px; }}
.card {{ border:1.4px solid var(--line); border-radius:9px; padding:7px 11px 8px; display:flex; flex-direction:column; }}
.card.wide {{ grid-column:1 / -1; }}
.top {{ display:flex; align-items:flex-start; gap:9px; }}
.top p {{ line-height:1.4; padding-top:1px; }}
.qn {{ flex:none; width:21px; height:21px; border-radius:50%; background:var(--navy); color:#fff; font-weight:700; font-size:9pt; display:grid; place-items:center; }}
.type {{ font-size:7.2pt; font-weight:700; letter-spacing:.08em; color:var(--muted); text-transform:uppercase; margin-left:auto; white-space:nowrap; padding-top:3px; }}
.expr {{ font-family:'Slab',serif; font-size:13.5pt; color:var(--navy); font-weight:700; }}
.times {{ margin:0 .2em; }}
sup {{ font-size:.62em; vertical-align:.62em; line-height:0; }}
.nw {{ white-space:nowrap; }}
.rad {{ border-top:1.3px solid currentColor; padding:0 2px; }}
.ovl {{ text-decoration:overline; }}
.fr {{ display:inline-flex; flex-direction:column; align-items:center; vertical-align:middle; margin:0 2px; }}
.fr .ft {{ border-bottom:1.4px solid currentColor; padding:0 3px 1px; }}
.fr .fb {{ padding:1px 3px 0; }}
.blank {{ display:inline-block; border-bottom:1.3px solid var(--navy); height:16px; }}
.chk {{ display:inline-block; width:11px; height:11px; border:1.3px solid var(--navy); border-radius:2px; margin:0 4px 0 6px; position:relative; top:1px; }}
.opts {{ display:grid; grid-template-columns:repeat(3,1fr); gap:5px 10px; margin:7px 0 0 30px; }}
.opts.c4 {{ grid-template-columns:repeat(4,1fr); }}
.opts.c2 {{ grid-template-columns:1fr 1fr; }}
.opt {{ display:flex; align-items:center; gap:7px; font-size:10.5pt; }}
.opt .slab {{ font-weight:700; color:var(--navy); }}
.bub {{ flex:none; width:19px; height:19px; border-radius:50%; border:1.4px solid var(--navy); color:var(--navy); font-size:8.5pt; font-weight:700; display:grid; place-items:center; }}
.work {{ flex:1; margin-top:6px; border-radius:6px; min-height:24px; background-image:radial-gradient(circle,#C9D0DD 0.9px,transparent 1px); background-size:13px 13px; background-position:4px 4px; }}
.ans {{ display:flex; align-items:flex-end; justify-content:flex-end; gap:4px; margin-top:5px; font-weight:700; color:var(--navy); font-size:9.6pt; }}
.ans .tag {{ background:var(--navy); color:var(--gold); font-size:7.6pt; letter-spacing:.08em; padding:3px 7px; border-radius:4px; margin-right:4px; align-self:center; }}
.ans .bx {{ display:inline-flex; align-items:flex-end; gap:4px; border:1.6px solid var(--navy); border-radius:6px; padding:5px 9px 4px; min-width:120px; min-height:28px; }}
table.cls {{ border-collapse:separate; border-spacing:0; margin:7px 0 0 30px; border:1.4px solid var(--line); border-radius:8px; overflow:hidden; font-size:10pt; width:calc(100% - 30px); }}
table.cls th {{ background:var(--navy); color:#fff; font-weight:600; font-size:8.6pt; padding:5px 10px; text-align:center; }}
table.cls th:first-child {{ text-align:left; }}
table.cls td {{ padding:2px 10px; border-top:1px solid var(--line); text-align:center; height:23px; }}
table.cls td:first-child {{ text-align:left; font-family:'Slab',serif; font-weight:700; color:var(--navy); font-size:11.5pt; }}
table.cls tr:nth-child(even) td {{ background:#F7F8FB; }}
.order {{ display:flex; justify-content:space-around; margin:8px 0 2px 30px; font-family:'Slab',serif; font-weight:700; color:var(--navy); font-size:13pt; }}
.slots {{ display:flex; gap:8px; align-items:flex-end; margin:8px 0 0 30px; font-size:9pt; color:var(--muted); font-weight:600; }}
.slots .blank {{ flex:1; }}
.row {{ display:flex; align-items:flex-end; gap:6px; margin:7px 0 0 30px; font-size:10pt; flex-wrap:wrap; }}
.row .lab {{ font-weight:600; color:var(--muted); font-size:8.6pt; }}
.val {{ font-family:'Slab',serif; font-weight:700; color:var(--navy); }}
.foot {{ margin-top:auto; padding-top:7px; display:flex; justify-content:space-between; font-size:7.8pt; color:var(--muted); border-top:1px solid var(--line); }}
.foot b {{ color:var(--navy); }}
.stack {{ display:flex; flex-direction:column; gap:8px; }}
/* key */
.kgrid {{ display:grid; grid-template-columns:1fr 1fr; gap:6px 10px; }}
.kitem {{ border:1.2px solid var(--line); border-radius:8px; padding:7px 11px 8px; font-size:10pt; line-height:1.55; }}
.key .sec {{ margin-top:12px; }}
.kitem.wide {{ grid-column:1 / -1; }}
.kitem .q {{ display:flex; align-items:center; gap:8px; margin-bottom:2px; }}
.kitem .q .qn {{ width:19px; height:19px; font-size:8.4pt; }}
.kitem .q .std {{ margin-left:auto; font-size:7.6pt; color:var(--muted); font-weight:600; }}
.kitem .s {{ color:var(--muted); }}
.kitem .a {{ font-weight:700; color:var(--navy); }}
mark {{ background:var(--gold-soft); border:1.4px solid var(--gold); color:var(--navy); padding:0 6px; border-radius:4px; font-family:'Slab',serif; font-weight:700; }}
.teach {{ background:var(--navy-soft); border-radius:8px; padding:7px 11px; font-size:8.8pt; line-height:1.45; margin-top:10px; }}
.teach b {{ color:var(--navy); }}
'''

def header(title, small=False, kicker='IC Imagine · 8th Grade Math', badge='Quarter 1'):
    cls = 'hdr small' if small else 'hdr'
    return f'<div class="{cls}"><div><div class="kicker">{kicker}</div><h1>{title}</h1></div><div class="badge">{badge}</div></div>'

WHO = '<div class="who"><span>Name <i style="width:250px"></i></span><span>Date <i style="width:110px"></i></span><span>Period <i style="width:60px"></i></span></div>'

def sec_head(part, title, std):
    return f'<div class="sec-h"><span class="part">PART {part}</span><h2>{title}</h2><span class="std">{std}</span></div>'

def foot(l, r):
    return f'<div class="foot"><span>{l}</span><span>{r}</span></div>'

def q(n, text, typ, body='', cls='card', work=True, ans=None, wmin=None):
    w = f'<div class="work" style="{f"min-height:{wmin}px" if wmin else ""}"></div>' if work else ''
    a = f'<div class="ans"><span class="tag">ANSWER</span><span class="bx">{ans}</span></div>' if ans is not None else ''
    return f'<div class="{cls}"><div class="top"><span class="qn">{n}</span><p>{text}</p><span class="type">{typ}</span></div>{body}{w}{a}</div>'

# ---------------- content ----------------
ORDER = [rt('20'), f'4.{bar("4")}', fr('9', '2'), 'π + 1', '4.38']

def front():
    h = header('Q1 Benchmark Review') + WHO
    # Part 1
    h += '<div class="sec">' + sec_head(1, 'The Real Number System', 'NC.8.NS.1 · NC.8.NS.2')
    h += f'''<div class="tip"><b class="lbl">REMEMBER</b> <b>Rational</b> = can be written as a fraction of integers (decimals that end or repeat, √ of perfect squares).
    <b>Irrational</b> = decimal never ends and never repeats ({rt('2')}, π). &nbsp;Rational + irrational → <b>irrational</b>. Rational (not 0) × irrational → <b>irrational</b>.</div>'''
    o1 = ''.join(bubble(L, f'<span class="slab">{t}</span>') for L, t in zip('ABCDEF', [rt('64'), rt('18'), f'0.{bar("6")}', '3.14159', f'{fr("π","2")}', f'{M}{rt("25")}']))
    h += '<div class="grid">'
    h += q(1, 'Select <b>all</b> the numbers that are <b>irrational</b>.', 'Select all', f'<div class="opts">{o1}</div>', work=False)
    rows = [f'6 + {rt("11")}', f'{rt("5")} · {rt("5")}', '4π', f'0.25 + {fr("3","4")}']
    tbl = '<table class="cls"><tr><th>Expression</th><th>Rational</th><th>Irrational</th></tr>' + ''.join(f'<tr><td>{r}</td><td>{chk()}</td><td>{chk()}</td></tr>' for r in rows) + '</table>'
    h += q(2, 'Is the value of each expression rational or irrational? Check one box in each row.', 'Table', tbl, work=False)
    sq = f'<div class="row"><span class="lab">It is between the whole numbers</span>{blank(34)} and {blank(34)}</div><div class="row"><span class="lab">Perfect squares on each side:</span>{blank(34)} and {blank(34)}</div>'
    h += q(3, f'Estimate <span class="val">{rt("55")}</span> to the nearest <b>tenth</b>. Do not use a calculator.', 'Short answer', sq, ans='≈ ' + blank(60), wmin=28)
    order = '<div class="order">' + ''.join(f'<span>{x}</span>' for x in ORDER) + '</div>'
    slots = '<div class="slots"><span>Least</span>' + ''.join(blank(0) for _ in range(5)) + '<span>Greatest</span></div>'
    h += q(4, 'Order these numbers from <b>least to greatest</b>.', 'Short answer', order + slots, work=True, wmin=34)
    h += '</div></div>'
    # Part 2
    h += '<div class="sec" style="flex:1;display:flex;flex-direction:column">' + sec_head(2, 'Exponent Rules with Monomials', 'NC.8.EE.1')
    h += '<div class="tip"><b class="lbl">REMEMBER</b> Numbers with numbers, letters with letters. <b>Multiply → ADD</b> exponents. <b>Divide → SUBTRACT</b> exponents. <b>Power to a power → MULTIPLY</b> exponents, and raise the number to the power too.</div>'
    h += '<div class="grid" style="flex:1">'
    h += q(5, f'Simplify. &nbsp;<span class="expr">({M}3x<sup>4</sup>y<sup>2</sup>)(5x<sup>3</sup>y)</span>', 'Short answer', ans='')
    h += q(6, f'Simplify. &nbsp;<span class="expr">{fr("24a<sup>8</sup>b<sup>3</sup>", "6a<sup>2</sup>b<sup>3</sup>")}</span>', 'Short answer', ans='')
    o7 = ''.join(bubble(L, f'<span class="slab">{t}</span>') for L, t in zip('ABCD', [f'{M}8x<sup>7</sup>', f'{M}16x<sup>12</sup>', '16x<sup>12</sup>', '8x<sup>12</sup>']))
    h += q(7, f'Which expression is equivalent to <span class="expr">({M}2x<sup>3</sup>)<sup>4</sup></span>?', 'Multiple choice', f'<div class="opts c4">{o7}</div>', work=True)
    h += q(8, f'Simplify. &nbsp;<span class="expr">(2m<sup>3</sup>)<sup>2</sup> · 3m<sup>4</sup></span>', 'Short answer', ans='')
    h += '</div></div>'
    h += foot('<b>Turn over</b> for Part 3 →', 'Calculator inactive: Parts 1 and 2')
    return f'<div class="page">{h}</div>'

def back():
    h = header('Q1 Benchmark Review · Back', small=True)
    h += '<div class="sec">' + sec_head(3, 'Scientific Notation', 'NC.8.EE.3 · NC.8.EE.4')
    h += '<div class="tip"><b class="lbl">REMEMBER</b> The first number must be <b>at least 1 and less than 10</b>. Multiply → multiply the numbers, <b>ADD</b> the exponents. Divide → divide the numbers, <b>SUBTRACT</b> the exponents. Then check that the first number is still from 1 to less than 10.</div>'
    h += '<div class="grid">'
    snb = f'{blank(46)}<span class="times">×</span>10<sup>{blank(22)}</sup>'
    two = lambda a, b: f'<div class="row"><span class="lab">a.</span><span class="val">{a}</span> = {snb}</div><div class="row"><span class="lab">b.</span><span class="val">{b}</span> = {snb}</div>'
    h += q(9, 'Write each number in scientific notation.', 'Short answer', two('3,040,000,000', '0.000062'), work=False)
    h += q(10, 'Each number is <b>not</b> in correct scientific notation. Rewrite it correctly.', 'Short answer', two(sn('48.5', 6), sn('0.73', -3)), work=False)
    h += q(11, f'Multiply. Write your answer in scientific notation.<br><span class="expr">({sn("4", 5)})({sn("6", 3)})</span>', 'Short answer', ans=snb, wmin=40)
    h += q(12, f'Divide. Write your answer in scientific notation.<br><span class="expr">{fr(sn("3.6", 4), sn("9", -2))}</span>', 'Short answer', ans=snb, wmin=40)
    h += '</div></div>'
    h += '<div class="sec" style="flex:1;display:flex;flex-direction:column"><div class="stack" style="flex:1">'
    h += q(13, f'One grain of rice has a mass of about <span class="val">{sn("2.5", -2)}</span> grams. A warehouse has <span class="val">{sn("4", 6)}</span> grains of rice. What is the total mass of the rice, in grams? Write your answer in scientific notation.', 'Word problem', ans=snb + ' grams', wmin=70)
    h += q(14, f'An elephant has a mass of about <span class="val">{sn("6", 3)}</span> kilograms. A mouse has a mass of about <span class="val">{sn("2", -2)}</span> kilograms. About how many times as great is the mass of the elephant as the mass of the mouse?', 'Word problem', ans=snb + ' times', wmin=70)
    o15 = ''.join(bubble(L, f'<span class="slab">{t}</span>') for L, t in zip('ABCD', [f'{sn("7.2",-4)} &gt; {sn("3.1",-3)}', f'{sn("5",6)} &lt; {sn("9",5)}', f'{sn("2.8",7)} &gt; {sn("9.9",6)}', f'{sn("4.5",3)} &gt; {sn("4.5",4)}']))
    h += q(15, 'Which statement is <b>true</b>?', 'Multiple choice', f'<div class="opts c2">{o15}</div>', work=False)
    h += '</div></div>'
    h += foot('<b>Check your work!</b> Is every first number from 1 to less than 10?', 'Calculator active: Part 3')
    return f'<div class="page">{h}</div>'

def key():
    def k(n, std, question, steps, ans, wide=False):
        return f'<div class="kitem{" wide" if wide else ""}"><div class="q"><span class="qn">{n}</span><span class="val">{question}</span><span class="std">{std}</span></div><div class="s">{steps}</div><div class="a">Answer: <mark>{ans}</mark></div></div>'
    h = header('Q1 Benchmark Review · Answer Key', small=True, kicker='IC Imagine · 8th Grade Math · Teacher Copy')
    h += '<div class="sec">' + sec_head(1, 'The Real Number System', 'NC.8.NS.1 · NC.8.NS.2') + '<div class="kgrid">'
    h += k(1, 'NC.8.NS.1', 'Select all irrational', f'{rt("64")} = 8, 0.{bar("6")} = {fr("2","3")}, 3.14159 ends, {M}{rt("25")} = {M}5 → all rational. {rt("18")} is not a perfect square; π ÷ 2 is still irrational.', f'B ({rt("18")}) and E ({fr("π","2")})')
    h += k(2, 'NC.8.NS.1', 'Rational or irrational?', f'6 + {rt("11")}: rational + irrational → irrational. {rt("5")} · {rt("5")} = 5 → rational. 4π: rational × irrational → irrational. 0.25 + {fr("3","4")} = 1 → rational.', 'Irrational, Rational, Irrational, Rational')
    h += k(3, 'NC.8.NS.2', f'Estimate {rt("55")}', f'Between 7 and 8 because 7<sup>2</sup> = 49 and 8<sup>2</sup> = 64. 55 is closer to 49. Check: 7.4<sup>2</sup> = 54.76 and 7.5<sup>2</sup> = 56.25, so 55 is closer to 54.76.', '≈ 7.4')
    h += k(4, 'NC.8.NS.2', 'Order least to greatest', f'π + 1 ≈ 4.14 · 4.38 · 4.{bar("4")} ≈ 4.44 · {rt("20")} ≈ 4.47 · {fr("9","2")} = 4.5', f'π + 1, 4.38, 4.{bar("4")}, {rt("20")}, {fr("9","2")}')
    h += '</div></div>'
    h += '<div class="sec">' + sec_head(2, 'Exponent Rules with Monomials', 'NC.8.EE.1') + '<div class="kgrid">'
    h += k(5, 'NC.8.EE.1', f'({M}3x<sup>4</sup>y<sup>2</sup>)(5x<sup>3</sup>y)', f'{M}3 × 5 = {M}15; x<sup>4+3</sup> = x<sup>7</sup>; y<sup>2+1</sup> = y<sup>3</sup>', f'{M}15x<sup>7</sup>y<sup>3</sup>')
    h += k(6, 'NC.8.EE.1', f'{fr("24a<sup>8</sup>b<sup>3</sup>","6a<sup>2</sup>b<sup>3</sup>")}', f'24 ÷ 6 = 4; a<sup>8−2</sup> = a<sup>6</sup>; b<sup>3−3</sup> = b<sup>0</sup> = 1', '4a<sup>6</sup>')
    h += k(7, 'NC.8.EE.1', f'({M}2x<sup>3</sup>)<sup>4</sup>', f'({M}2)<sup>4</sup> = 16 (even power → positive); x<sup>3×4</sup> = x<sup>12</sup>. A adds exponents; B keeps the negative; D multiplies 2 × 4.', 'C. 16x<sup>12</sup>')
    h += k(8, 'NC.8.EE.1', '(2m<sup>3</sup>)<sup>2</sup> · 3m<sup>4</sup>', 'Power first: (2m<sup>3</sup>)<sup>2</sup> = 4m<sup>6</sup>. Then 4 × 3 = 12; m<sup>6+4</sup> = m<sup>10</sup>', '12m<sup>10</sup>')
    h += '</div></div>'
    h += foot('Q1 Benchmark Review · Answer Key', 'Page 1 of 2')
    p1 = f'<div class="page key">{h}</div>'
    h = header('Q1 Benchmark Review · Answer Key', small=True, kicker='IC Imagine · 8th Grade Math · Teacher Copy')
    h += '<div class="sec">' + sec_head(3, 'Scientific Notation', 'NC.8.EE.3 · NC.8.EE.4') + '<div class="kgrid">'
    h += k(9, 'NC.8.EE.3', 'Write in scientific notation', 'a. Point moves 9 places left. &nbsp;b. Point moves 5 places right.', f'a. {sn("3.04",9)} &nbsp; b. {sn("6.2",-5)}')
    h += k(10, 'NC.8.EE.4', 'Correct the notation', f'a. 48.5 → 4.85 (point moves left 1, exponent goes up 1). &nbsp;b. 0.73 → 7.3 (point moves right 1, exponent goes down 1).', f'a. {sn("4.85",7)} &nbsp; b. {sn("7.3",-4)}')
    h += k(11, 'NC.8.EE.4', f'({sn("4",5)})({sn("6",3)})', f'4 × 6 = 24; 10<sup>5+3</sup> = 10<sup>8</sup> → {sn("24",8)} → fix: {sn("2.4",9)}', sn('2.4', 9))
    h += k(12, 'NC.8.EE.4', f'{fr(sn("3.6",4), sn("9",-2))}', f'3.6 ÷ 9 = 0.4; 10<sup>4−(−2)</sup> = 10<sup>6</sup> → {sn("0.4",6)} → fix: {sn("4",5)}', sn('4', 5))
    h += k(13, 'NC.8.EE.4', 'Rice: total mass', f'({sn("2.5",-2)})({sn("4",6)}): 2.5 × 4 = 10; 10<sup>−2+6</sup> = 10<sup>4</sup> → {sn("10",4)} → fix: {sn("1",5)} = 100,000 grams', sn('1', 5) + ' grams')
    h += k(14, 'NC.8.EE.3 · NC.8.EE.4', 'Elephant vs. mouse', f'{fr(sn("6",3), sn("2",-2))}: 6 ÷ 2 = 3; 10<sup>3−(−2)</sup> = 10<sup>5</sup>', sn('3', 5) + ' (300,000) times')
    h += k(15, 'NC.8.EE.3', 'Which statement is true?', f'A: 0.00072 &lt; 0.0031. &nbsp;B: 5,000,000 &gt; 900,000. &nbsp;C: 28,000,000 &gt; 9,900,000 ✓. &nbsp;D: 4,500 &lt; 45,000.', 'C', wide=True)
    h += '</div></div>'
    h += '''<div class="teach"><b>Teacher notes:</b> Questions 1–8 are calculator inactive and 9–15 are calculator active, matching the two parts of the NC EOG. Common errors to watch: calling 3.14159 irrational (it ends, so it is rational); choosing “irrational” for √5 · √5; adding the exponents in the power rule (#7, choice A); and forgetting to fix 24 × 10<sup>8</sup> and 0.4 × 10<sup>6</sup> into correct scientific notation (#11, #12). Number #2 and #15 match the EOG table-grid and multiple-choice formats.</div>'''
    h += foot('Q1 Benchmark Review · Answer Key', 'Page 2 of 2')
    return p1 + f'<div class="page key">{h}</div>'

def render(name, body):
    html = f'<!DOCTYPE html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}</body></html>'
    p = OUT / f'{name}.html'; p.write_text(html)
    with sync_playwright() as pw:
        br = pw.chromium.launch(); pg = br.new_page()
        pg.goto(f'file://{p}'); pg.wait_for_timeout(300)
        pg.pdf(path=str(OUT / f'{name}.pdf'), width='8.5in', height='11in', print_background=True, prefer_css_page_size=True)
        # overflow check
        ov = pg.evaluate("""[...document.querySelectorAll('.page')].map(p=>p.scrollHeight>p.clientHeight+1)""")
        br.close()
    pages = subprocess.run(['pdfinfo', str(OUT / f'{name}.pdf')], capture_output=True, text=True).stdout
    print(name, [l for l in pages.splitlines() if l.startswith('Pages')], 'overflow:', ov)

render('Q1_Benchmark_Review', front() + back())
render('Q1_Benchmark_Review_AnswerKey', key())
