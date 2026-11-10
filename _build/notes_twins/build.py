"""Build grade8/twins/<page>.js for the Interactive Notes.  python3 _build/notes_twins/build.py [u3 u4 …]
Optional: TWIN_DUMP=<dir with <page>.json item lists> to report questions that have no twin."""
import importlib, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from twinlib import write
import re
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from notes_part2 import SCORES, CLS
PAGES = {'u1': 'unit1-notes', 'u2e': 'unit2-notes-exponents', 'u2s': 'unit2-notes-sci-notation', 'u3': 'unit3-notes',
         'u4': 'unit4-notes', 'u5': 'unit5-notes', 'u6si': 'unit6-notes-slope-intercept', 'u6s': 'unit6-notes-slope',
         'u6t': 'unit6-notes-tables-systems', 'u6': 'unit6-notes', 'u7': 'unit7-notes', 'u8': 'unit8-notes'}
for k in sys.argv[1:] or PAGES:
    if not os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__)), k + '.py')): print('skip', k); continue
    mod = importlib.import_module(k)
    page = PAGES[k]; ids = None
    d = os.environ.get('TWIN_DUMP')
    if d and os.path.exists(os.path.join(d, page + '.json')):
        ids = [it['id'] for it in json.load(open(os.path.join(d, page + '.json'))) if it['kind'] != 'np' or it['ans'] or it['choices']]
    # Part 2 practice (Nov 9, 2026): Score 3 / 4 / 5 labels in the twins' prompts; problems cut from Part 2 lose their twins
    sc = SCORES.get(page, {})
    P2 = {'unit2-notes-exponents': r'u2pA', 'unit2-notes-sci-notation': r'u2p[BC]', 'unit3-notes': r'(p[ABC]\d|np9-)', 'unit4-notes': r'(u4p|np5-)', 'unit5-notes': r'(u5p[A-E]|np7-)'}
    CUT = {'unit6-notes-slope': ['p4']}            # Unit 6 cuts (Nov 9, 2026; _build/u6_scores.py)
    for k in CUT.get(page, []): mod.T.pop(k, None)
    if page in P2:
        for k in [k for k in mod.T if re.match(P2[page], k) and k not in sc]: del mod.T[k]
    for k, t in mod.T.items():
        if k in sc and 'p' in t:
            n = sc[k]
            t['p'] = re.sub(r'<span class="np-lv l[123]([^"]*)">[^<]*</span>', lambda m: f'<span class="np-lv {CLS[n]}{m.group(1)}">Score {n}</span>', t['p'])
            t['p'] = re.sub(r'(^|</span>\s*)\d+\)\s*', r'\1', t['p'])          # the page renumbered its problems
            if 'np-lv' not in t['p'] and not k.startswith('np'): t['p'] = f'<span class="np-lv {CLS[n]}">Score {n}</span> ' + t['p']
    write(page, mod.T, ids)
