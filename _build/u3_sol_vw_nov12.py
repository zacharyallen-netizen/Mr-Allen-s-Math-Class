"""Unit 3 notes: the written solutions under each practice problem ("np-sol") now show the work LINED UP,
using the same step boxes as the notes' worked examples (vwork.js: the move sits under the matching term on
BOTH sides, cancels are crossed out). Review fix A-M7, Nov 12, 2026 (Zach's rule: steps horizontal, aligned
with like terms). The explaining sentences stay; only the typed equation lines are replaced.
Runs once (refuses to run twice).   python3 _build/u3_sol_vw_nov12.py"""
import html, json, os, re

P = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'grade8', 'unit3-notes.html')
s = open(P, encoding='utf-8').read()
assert 'data-vw-sol' not in s, 'already done'
T = lambda x: re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', x))).strip()
EQ = r'[0-9x(][^=<>≤≥:]*?(?:=|≤|≥|<|>)\s*[−\-]?[0-9x(][^.:]*?'
done = 0


def eq_of(prompt, sol):
    m = re.search(r'Solve:\s*(.+?)(?:\.\s|\. Tap|\s+Tap|$)', prompt)
    if m and 'x' in m.group(1): return m.group(1).strip().rstrip('.')
    m = re.search(r'solved\s+(.+?)\s+and', prompt)
    if m: return m.group(1).strip()
    m = re.search(r'Let x = [^.]*\.\s*(.+?)(?=\s+(?:Subtract|Add|Divide|Multiply|Distribute|Combine)\b|\s*$)', sol)
    if m and re.search(r'[=≤≥<>]', m.group(1)) and 'x' in m.group(1): return m.group(1).strip().split('. ')[-1]
    return None


def fix(m):
    global done
    body = m.group(1)
    i = s.rfind('np-prompt', 0, m.start()); prompt = T(s[i:s.find('</div>', i)]) if i >= 0 else ''
    if re.search(r'How many solutions|goes in the box|number line|Which equation|cancel and you get|Put x', prompt): return m.group(0)
    e = eq_of(prompt, T(body))
    if not e or '?' in e: return m.group(0)
    e = e.replace('÷', '/').replace('·', '*')
    lines = [T(x) for x in re.split(r'<br\s*/?>', body)]
    lead = []
    for x in lines:
        if not x: continue
        for sent in re.split(r'(?<=[.])\s+', x):
            if re.match(r'^Let x = [^.]*\.$', sent) or (not re.search(r'[=≤≥<>→]|\d\s*[:]', sent) and not re.match(r'^(Subtract|Add|Divide|Multiply|Distribute|Combine)', sent)):
                lead.append(sent)
    lead = ' '.join(lead)
    done += 1
    return '<div class="np-sol" data-vw-sol="1">' + (html.escape(lead) + ' ' if lead else '') + "<div class=\"vw\" data-vw='" + json.dumps({'eq': e, 'mode': 'all', 'compact': True}, ensure_ascii=False).replace("'", '&#39;') + "'></div></div>"


s = re.sub(r'<div class="np-sol">(.*?)</div>', fix, s, flags=re.S)
open(P, 'w', encoding='utf-8').write(s)
print('solutions lined up:', done)
