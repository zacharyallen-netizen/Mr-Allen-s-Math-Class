"""Build grade8/twins/<page>.js for the Interactive Notes.  python3 _build/notes_twins/build.py [u3 u4 …]
Optional: TWIN_DUMP=<dir with <page>.json item lists> to report questions that have no twin."""
import importlib, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from twinlib import write
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
    write(page, mod.T, ids)
