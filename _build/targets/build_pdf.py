import json, sys, html
sys.path.insert(0,'/home/claude/work/tools')
from build import DOMAINS, BASE_URL
t=json.load(open('data/targets.json'))
SLUG={s:d['slug'] for d in DOMAINS for s in d['order']}
DOM={s:d['short'] for d in DOMAINS for s in d['order']}
seq=["NC.8.NS.1","NC.8.EE.2","NC.8.NS.2","NC.8.EE.1","NC.8.EE.3","NC.8.EE.4","NC.8.EE.7","NC.8.G.5","NC.8.G.6","NC.8.G.7","NC.8.G.8",
"NC.8.F.1","NC.8.F.3","NC.8.F.4","NC.8.F.2","NC.8.F.5","NC.8.EE.8","NC.8.SP.1","NC.8.SP.2","NC.8.SP.3","NC.8.SP.4","NC.8.G.3","NC.8.G.2","NC.8.G.4","NC.8.G.9"]
UNIT={"U1":"Real Numbers","U2":"Exponents & Scientific Notation","U3":"Equations & Inequalities","U4":"Angles & Triangles","U5":"Pythagorean Theorem","U6":"Functions, Slope & Systems","U7":"Data Analysis","U8":"Transformations","U9":"Volume"}
by={}
for x in t: by.setdefault(x['standard'],[]).append(x)
rows=[];last=None
for s in seq:
    x=by[s][0]
    if x['unit']!=last:
        rows.append(f'<tr class="u"><td colspan="7">Unit {x["unit"][1:]} — {html.escape(UNIT[x["unit"]])}</td></tr>'); last=x['unit']
    url=f'{BASE_URL}{SLUG[s]}.html#{s}'
    cls="pri" if x["type"]=="Priority" else "sup"
    rows.append(f'<tr class="{cls}"><td class="c">{s}</td><td>{html.escape(x["title"])}<div class="d">{DOM[s]}</div></td>'
      f'<td class="n">{len(by[s])}</td><td class="b"></td><td class="b"></td><td class="b"></td><td class="b"></td></tr>')
H=f'''<!DOCTYPE html><html><head><meta charset="utf-8"><style>
@page{{size:Letter;margin:0.5in 0.5in 0.55in}}
body{{font-family:"DejaVu Sans",Arial,sans-serif;color:#1B2333;font-size:10pt;margin:0}}
.hd{{background:#1E2D4F;color:#fff;padding:12px 16px 10px;border-bottom:4px solid #FFC107}}
.hd h1{{margin:0;font-size:17pt}} .hd p{{margin:3px 0 0;font-size:8.5pt;color:#dfe5f1}}
.id{{display:grid;grid-template-columns:auto 1fr auto 1fr;gap:6px 10px;margin:14px 0 10px;align-items:end;font-weight:700}}
.id span.l{{border-bottom:1px solid #1E2D4F;height:18px}}
.lv{{display:flex;gap:6px;font-size:8pt;margin:0 0 8px;flex-wrap:wrap}}
.lv span{{border:1px solid #c9d0dc;border-radius:3px;padding:2px 6px}}
table{{width:100%;border-collapse:collapse}}
th{{background:#1E2D4F;color:#fff;font-size:8pt;padding:5px 4px;text-align:left}}
th.q{{text-align:center;width:34px}}
td{{border:1px solid #c9d0dc;padding:4px 5px;vertical-align:middle}}
tr{{break-inside:avoid}}
tr.u td{{background:#fff;color:#1E2D4F;font-weight:700;font-size:9.5pt;border:0;border-bottom:2px solid #1E2D4F;padding-top:9px}}
td.c{{font-weight:700;white-space:nowrap;font-size:9pt;color:#1E2D4F}}
.d{{font-size:7pt;color:#687082}}
td.t{{font-size:8pt;color:#5B6475}} td.t.p{{color:#8A6100;font-weight:700}}
td.n{{text-align:center;font-size:8.5pt}}
td.b{{width:34px;height:24px}}
td.l{{text-align:center;font-size:8.5pt}} td.l a{{color:#0563C1;font-weight:700}}
tr.pri td{{background:#FFF4D1}} tr.sup td{{background:#E8F0FB}} tr.pri td.b,tr.sup td.b{{background:#fff}}
.key{{font-size:8.5pt;margin:0 0 8px;display:flex;align-items:center;gap:6px}} .sw{{display:inline-block;width:14px;height:14px;border:1px solid #c9d0dc;margin-left:8px}} .sw.pri{{background:#FFF4D1}} .sw.sup{{background:#E8F0FB}}
.ft{{margin-top:10px;font-size:8pt;color:#5B6475}} .ft a{{color:#0563C1}}
</style></head><body>
<div class="hd"><h1>8th Grade Math — My Standards</h1><p>Mr. Allen's Math Class · Condensed I Can Tracker</p></div>
<div class="id"><span>Name</span><span class="l"></span><span>Period</span><span class="l"></span></div>
<div class="lv"><b>Scores:</b><span>5 Mastery</span><span>4 Proficient</span><span>3 Approaching</span><span>2 Developing</span><span>1 Beginning</span>
<span style="border:0">Copy Mr. Allen's score into the box each quarter.</span></div>
<div class="key"><span class="sw pri"></span> Priority standard <span class="sw sup"></span> Supporting standard</div>
<table><tr><th>Standard</th><th>What it is</th><th>Targets</th><th class="q">Q1</th><th class="q">Q2</th><th class="q">Q3</th><th class="q">Q4</th></tr>
{"".join(rows)}</table>

</body></html>'''
open('out/condensed.html','w').write(H)
