#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Shared helpers for the NC Math 1 pre-test configs (build_m1.py)."""
import re, html, os, sys
SP = '/home/claude/mr-allen-s-math-class/_build'
HERE = os.path.join(SP, 'm1pre')
sys.path.insert(0, SP); sys.path.insert(0, HERE)
import build_pretest as BP

MI = '−'
def sup(s): return '<sup>%s</sup>' % s
def fr(n, d): return '<span class="frac"><span class="num">%s</span><span class="den">%s</span></span>' % (n, d)
def sub(s): return '<sub>%s</sub>' % s

def std(code): return 'NC.M1.' + code

def plain(expr_html):
    """Plain-text label for the teacher's tracker: stacked fractions -> (a)/(b), <sup> -> ^."""
    s = re.sub(r'<span class="frac"><span class="num">(.*?)</span><span class="den">(.*?)</span></span>', r'(\1)/(\2)', expr_html)
    s = re.sub(r'<sup>(.*?)</sup>', lambda m: '^' + (m.group(1) if len(m.group(1)) == 1 else '(' + m.group(1) + ')'), s)
    s = re.sub(r'<sub>(.*?)</sub>', r'_\1', s)
    s = re.sub(r'<[^>]+>', '', s)
    return re.sub(r'\s+', ' ', html.unescape(s)).strip()

def nw(s): return '<span class="nw">%s</span>' % s

def Q(id, lvl, code, op, expr, disp, chk, svg=None, lab='Answer:', tip=None, ph=None):
    expr = re.sub(r'(?<![\w>])\(([−\-]?[\d.]+), ([−\-]?[\d.]+)\)', r'<span class="nw">(\1, \2)</span>', expr)
    if ph and len(ph) > 17 and ph.startswith('type like '): ph = 'like ' + ph[10:]
    q = dict(id=id, lvl=lvl, op=op, expr=expr, disp=disp, chk=chk, lab=lab, std=std(code))
    if svg: q['svg'] = svg
    if tip: q['tip'] = tip
    if ph: q['ph'] = ph
    q['plain'] = plain(expr)
    return q

_YES = ['text', ['yes', 'y', 'yes it is', 'yes, it is', 'yes it is a solution', 'yes, it is a solution', 'it is a solution', 'true']]
_NO = ['text', ['no', 'n', 'no it is not', 'no, it is not', 'no it is not a solution', 'no, it is not a solution', 'not a solution',
                'it is not a solution', 'false', 'not a function', 'no, not a function', 'no it is not a function', 'no, it is not a function']]
_NOSOL = ['text', ['no solution', 'no solutions', 'none', 'no soln', 'empty', 'empty set', '0 solutions', 'zero solutions', '0', 'zero', 'no real solution']]
_INF = ['text', ['infinitely many', 'infinitely many solutions', 'infinite', 'infinite solutions', 'all real numbers', 'all reals',
                 'all numbers', 'every number', 'identity', 'many', 'infinitely']]
# exact short forms ('y', 'n', '0') OR a sentence that picks the choice and does not also pick a rival
YES = ['any', _YES, ['words', [['yes', 'yeah', 'yep']], ['no', 'nope']]]
NO = ['any', _NO, ['words', [['no', 'not', 'nope']], ['yes', 'yeah', 'yep']]]
NOSOL = ['any', _NOSOL, ['words', [['no solution', 'no solutions', 'none', 'no soln', 'zero solutions', '0 solutions', 'no real solution', 'no real solutions', 'empty set']],
                         ['one solution', 'exactly one', '1 solution', 'infinite', 'infinitely', 'infinity', 'all real', 'all numbers', 'every number', 'two solutions']]]
INF = ['any', _INF, ['words', [['infinitely many', 'infinite', 'infinitely', 'infinity', 'all real numbers', 'all reals', 'all numbers', 'every number',
                                'every x', 'all x', 'identity', 'endless', 'unlimited']],
                     ['no solution', 'no solutions', 'none', 'zero solutions', 'one solution', 'exactly one', '1 solution', 'two solutions', 'empty set']]]

GATE = open('/home/claude/mr-allen-s-math-class/math1/unit1-notes.html', encoding='utf-8').read().split('<head>\n', 1)[1].split('</script>', 1)[0] + '</script>\n'
assert GATE.startswith('<script>') and "gate.html" in GATE

M1JS = open(os.path.join(HERE, 'm1check.js'), encoding='utf-8').read()

def m1_engine():
    e = BP.ENGINE
    a = "function runCheck(chk,raw){\n  if(!chk)return false;\n  const t=chk[0];\n"
    assert e.count(a) == 1
    e = e.replace(a, a + "  if(M1.T[t])return M1.T[t](chk,raw);\n")
    b = "else{div.classList.add('wrong');fb.innerHTML='✗ answer: <span class=\"key\">'+q.disp+'</span>';"
    assert e.count(b) == 1
    e = e.replace(b, "else{div.classList.add('wrong');fb.innerHTML='✗ answer: <span class=\"key\">'+q.disp+'</span>'+(q.tip?'<span class=\"tip\">Tip: '+q.tip+'</span>':'');")
    c = "function ptLabel(q){"
    assert e.count(c) == 1
    e = e.replace(c, c + "if(q.plain)return ((q.op?q.op+': ':'')+q.plain).slice(0,80);")
    return M1JS + e

EXTRA_CSS = """.qfb .tip{display:block;font-family:var(--serif);font-style:italic;font-size:14px;color:#6b4a00;margin-top:3px;line-height:1.35}
.ans input{width:190px}
.nw{white-space:nowrap}
.q .expr{font-size:19px}
.q .expr .frac{font-size:.95em}
sub{font-size:.62em;vertical-align:sub;line-height:0}
.refbox .typ{display:flex;flex-wrap:wrap;gap:6px 18px;font-size:14px;justify-content:center;margin:4px 0 0}
.refbox .typ code{font-family:var(--mono);font-size:13px;background:#fff;border:1px solid #e3d7b0;border-radius:3px;padding:0 4px}
@media print{.dia svg{max-width:255px;max-height:2.25in;width:auto}.q{break-inside:avoid}.band{break-after:avoid;break-inside:avoid}.stripe{break-before:avoid}.stripe>.objline,.stripe>.can,.stripe>.prompt,.stripe>.refbox{break-after:avoid;break-inside:avoid}.qgrid{break-before:avoid}.ans input::placeholder{color:transparent}.q .expr{font-size:17px;margin:6px 0 8px}.q{padding:8px 2px 10px}}
"""

def typing_box(pairs, note=None):
    inner = '<div class="typ">' + ''.join('<span>%s <code>%s</code></span>' % (a, html.escape(b)) for a, b in pairs) + '</div>'
    if note: inner += '<p class="tag">%s</p>' % note
    return '    <div class="refbox"><p class="rl">How to type your answers</p>%s</div>' % inner

def unit_cfg(n, name, sub_title, bands, qs, std_line):
    return dict(file='M1_Unit%d_PreTest.html' % n, unit='unit%d' % n, unitlabel='Unit %d' % n,
                title='Unit %d Pre-Test — %s | NC Math 1' % (n, name), h1='Unit %d Pre-Test' % n, sub=sub_title,
                std=std_line, bands=bands, qs=qs, repo='/home/claude/mr-allen-s-math-class/math1',
                track_unit='M1 U%d' % n, track_page='Math 1 Unit %d Pre-Test' % n,
                engine=m1_engine(), head_pre=GATE, extra_css=EXTRA_CSS)

def band(level, codes, obj, can, prompt, refbox=None):
    num = {'basic': '3.0', 'target': '4.0', 'advanced': '5.0'}[level]
    name = {'basic': 'Basic Understanding', 'target': 'Target Content', 'advanced': 'Advanced Content'}[level]
    d = dict(num=num, name=name, level=level, code=' · '.join(std(c) for c in codes), obj=obj, can=can, prompt=prompt)
    if refbox: d['refbox'] = refbox
    return d
