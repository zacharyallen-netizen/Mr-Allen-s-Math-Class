"""7th grade site builder helpers (Nov 20, 2026 draft).

Question format (used by the notes AND the practice pages):
    Q(lv, prompt, ans=..., hint=..., sol=...)                    number answer (lv 1/2/3 = Score 3/4/5)
    Q(lv, prompt, ch=[right, wrong1, wrong2], why={wrong: note}) tap answer; wrong notes NAME the mistake
Every number answer is checked against a value computed in the unit file where possible (assert).
"""
from fractions import Fraction as Fr
import hashlib, html, json, re

def m(s):
    """true minus signs in displayed math"""
    return re.sub(r'(^|[\s(=,\[:+×÷/])-(?=[\d.a-zπ(√$])', lambda g: g.group(1) + '−', str(s))

def num(x):
    """number → display text (true minus, no trailing .0)"""
    if isinstance(x, Fr):
        if x.denominator == 1: x = x.numerator
        else:
            s = '%s/%s' % (abs(x.numerator), x.denominator)
            return ('−' if x < 0 else '') + s
    if isinstance(x, float):
        x = round(x, 6)
        if x == int(x): x = int(x)
    s = format(x, ',') if isinstance(x, int) and abs(x) >= 10000 else str(x)
    return s.replace('-', '−')

def F(a, b):
    """stacked fraction html"""
    return '<span class="fr"><span>%s</span><span>%s</span></span>' % (m(a), m(b))

def plain(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', re.sub(r'<span class="fr"><span>(.*?)</span><span>(.*?)</span></span>', r'\1/\2', s)))).strip()

def shuffle(lst, seed):
    """deterministic order (same every time) so printed and screen copies match"""
    return sorted(lst, key=lambda c: hashlib.md5((seed + '|' + c).encode()).hexdigest())

class Q(dict):
    def __init__(self, lv, p, ans=None, ch=None, why=None, hint='', sol='', show=None, tol=None, fig='', keep=False, std=None):
        assert lv in (1, 2, 3), lv
        assert (ans is None) != (ch is None), p
        if ch:
            assert len(set(ch)) == len(ch), ch
            why = why or {}
            for w in why: assert w in ch[1:], (w, ch)
            for w in ch[1:]: assert w in why, ('every wrong choice needs a note', w, p)
            for w, note in why.items():   # a note may not give the answer away
                assert plain(ch[0]).lower() not in note.lower(), ('note gives the answer', note)
        super().__init__(lv=lv, p=p, ans=ans, ch=ch, why=why or {}, hint=hint, sol=sol, show=show, tol=tol, fig=fig, keep=keep, std=std)
        assert hint, ('every problem needs a hint', p)

def ans_text(q):
    if q['ch']: return plain(q['ch'][0])
    a = q['ans']
    return q['show'] or num(a)

def ans_attr(q):
    a = q['ans']
    if isinstance(a, Fr):
        out = [('%d/%d' % (a.numerator, a.denominator)) if a.denominator != 1 else str(a.numerator)]
        if a.denominator != 1:
            d = float(a)
            if abs(d * 1000 - round(d * 1000)) < 1e-9: out.append(str(round(d, 3)))
        return '|'.join(out)
    if isinstance(a, float): a = round(a, 6); a = int(a) if a == int(a) else a
    return str(a)

def choices_for(q, seed):
    ch = [plain(c) for c in q['ch']]          # buttons show plain text (5/6, not a stacked fraction)
    return ch if q['keep'] else shuffle(ch, seed)

def why_plain(q):
    return {plain(k): v for k, v in q['why'].items()}

# ---------------- notes: one ✏ Practice question ----------------
def np_q(q, qid):
    a = ['class="np-q"', 'id="%s"' % qid, 'data-level="%d"' % q['lv'], 'data-hint="%s"' % html.escape(plain(q['hint']), quote=True)]
    if q['ch']:
        ch = choices_for(q, qid)
        a.append('data-choices="%s"' % html.escape('|'.join(ch), quote=True))
        a.append('data-ans="%s"' % html.escape(plain(q['ch'][0]), quote=True))
        a.append("data-why='%s'" % html.escape(json.dumps(why_plain(q), ensure_ascii=False), quote=True))
    else:
        a.append('data-ans="%s"' % html.escape(ans_attr(q), quote=True))
        a.append('data-show="%s"' % html.escape(ans_text(q), quote=True))
        if q['tol']: a.append('data-tol="%s"' % q['tol'])
    sol = q['sol'] or ('The answer is ' + ans_text(q) + '.')
    return '<div %s>\n  <div class="np-prompt">%s%s</div>\n  <div class="np-sol">%s</div>\n</div>' % (' '.join(a), q['p'], ('<div class="fig">' + q['fig'] + '</div>') if q['fig'] else '', sol)

# ---------------- practice engine problem ----------------
def pr_prob(q, n, seed):
    p = {'n': n, 'q': q['p'] + (('<div class="pr-figwrap">' + q['fig'] + '</div>') if q['fig'] else ''), 'lv': q['lv'] + 2, 'hint': plain(q['hint'])}
    if q['ch']:
        p['ans'] = plain(q['ch'][0]); p['choices'] = choices_for(q, seed); p['why'] = why_plain(q)
    else:
        a = q['ans']
        p['ans'] = ans_attr(q).split('|')[0]
        if isinstance(a, Fr) and a.denominator != 1:
            alt = ans_attr(q).split('|')[1:]
            if alt: p['alt'] = alt
    return p
