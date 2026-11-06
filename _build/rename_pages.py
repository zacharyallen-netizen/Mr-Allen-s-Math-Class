"""Give 8th grade unit pages short, consistent names: unitN-pretest, unitN-practice-1, unitN-notes, ...
Each old address keeps a tiny forwarding page, so links posted in Google Classroom keep working.
Every link in the site, the builders (_build) and the docs is updated to the new name.
PDF names are NOT changed (a PDF address cannot forward)."""
import os, re, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from forward_stub import write_stub

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = 'grade8/'
MAP = {
    # pre-tests
    'Unit1_PreTest': 'unit1-pretest', 'Unit1_PreTest_FormB': 'unit1-pretest-form-b',
    'Unit_2_Pretest': 'unit2-pretest-exponents', 'Unit2_PreTest_ScientificNotation': 'unit2-pretest-sci-notation',
    'Unit3_PreTest': 'unit3-pretest', 'Unit3_4_PreTest': 'units3-4-pretest', 'Unit4_PreTest': 'unit4-pretest',
    'Unit5_PreTest': 'unit5-pretest', 'Unit6_PreTest': 'unit6-pretest', 'Unit7_PreTest': 'unit7-pretest',
    'Unit8_PreTest': 'unit8-pretest', 'Unit9_PreTest': 'unit9-pretest',
    # practice
    'Unit1_Practice1_Interactive': 'unit1-practice-1', 'Unit1_Practice2_Interactive': 'unit1-practice-2',
    'Unit2_Exponent_Rules_Practice1_Interactive': 'unit2-practice-exponents-1',
    'Unit2_Exponent_Rules_Practice2_Interactive': 'unit2-practice-exponents-2',
    'Unit2_Scientific_Notation_Practice1_Interactive': 'unit2-practice-sci-notation-1',
    'Unit2_Scientific_Notation_Practice2_Interactive': 'unit2-practice-sci-notation-2',
    'Unit3_Practice1_Interactive': 'unit3-practice-1', 'Unit3_Practice2_Interactive': 'unit3-practice-2',
    'Unit4_Practice1_Interactive': 'unit4-practice-1', 'Unit4_Practice2_Interactive': 'unit4-practice-2',
    'Unit5_Practice1_Interactive': 'unit5-practice-1', 'Unit5_Practice2_Interactive': 'unit5-practice-2',
    'Unit5_Practice_Problems_Interactive': 'unit5-practice-problems',
    'Unit6_Practice_Interactive': 'unit6-practice', 'slope_intercept_practice': 'unit6-practice-slope-intercept',
    'tables_linear_functions': 'unit6-practice-tables', 'unit6_review': 'unit6-review',
    'unit7_practice': 'unit7-practice', 'unit7_practice1': 'unit7-practice-1', 'unit7_practice2': 'unit7-practice-2',
    'unit8_practice': 'unit8-practice', 'unit8_practice1': 'unit8-practice-1', 'unit8_practice2': 'unit8-practice-2',
    'volume_practice': 'unit9-practice',
    # notes
    'Unit_1_Real_Numbers_Guided_Notes': 'unit1-notes', 'Unit_2_Exponent_Rules_Guided_Notes': 'unit2-notes-exponents',
    'Unit_2_Scientific_Notation_Guided_Notes': 'unit2-notes-sci-notation', 'Unit_3_Equations_Guided_Notes': 'unit3-notes',
    'Unit_4_Geometry_Guided_Notes': 'unit4-notes', 'Unit_5_Pythagorean_Guided_Notes': 'unit5-notes',
    'Unit_6_Functions_Guided_Notes': 'unit6-notes', 'slope_guided_notes': 'unit6-notes-slope',
    'slope_intercept_interactive': 'unit6-notes-slope-intercept', 'tables-and-systems-guided-notes': 'unit6-notes-tables-systems',
    'Unit_7_Data_Analysis_Guided_Notes': 'unit7-notes', 'transformations-guided-notes': 'unit8-notes',
    # tutorials, games and projects tied to a unit
    'Unit_1_Cubes_Cube_Roots_Tutorial': 'unit1-tutorial-cube-roots', 'Unit_1_Estimating_Roots': 'unit1-estimating-roots',
    'Unit_2_Exponent_Games': 'unit2-games', 'Unit_2_Games_and_Project': 'unit2-games-project',
    'units3_4_review_tutorial': 'units3-4-review-tutorial', 'angles_pythagorean_tutorial': 'units4-5-tutorial',
    'unit7_project_interactive': 'unit7-project',
}
TEXT = ('.html', '.js', '.py', '.json', '.md', '.txt', '.gs', '.css', '.sh')
SKIP_DIRS = {'.git', 'archive', 'node_modules'}

def title_of(path):
    m = re.search(r'<title>([^<|—]+)', open(path, encoding='utf-8', errors='ignore').read())
    return (m.group(1).strip() if m else os.path.basename(path)).replace('&amp;', '&')

def main(dry):
    for old, new in MAP.items():
        assert os.path.exists(os.path.join(ROOT, G + old + '.html')), old
        assert not os.path.exists(os.path.join(ROOT, G + new + '.html')), new
    assert len(set(MAP.values())) == len(MAP)
    # 1) update references everywhere (longest names first so prefixes never clash)
    pats = [(re.compile(r'(?<![\w-])' + re.escape(o) + r'\.html'), n + '.html') for o, n in sorted(MAP.items(), key=lambda kv: -len(kv[0]))]
    changed = 0
    for d, ds, fs in os.walk(ROOT):
        ds[:] = [x for x in ds if x not in SKIP_DIRS]
        for f in fs:
            if not f.endswith(TEXT): continue
            p = os.path.join(d, f)
            s = open(p, encoding='utf-8', errors='ignore').read(); t = s
            for rx, rep in pats: t = rx.sub(rep, t)
            if t != s:
                changed += 1
                if not dry: open(p, 'w', encoding='utf-8').write(t)
    print('files with updated links:', changed)
    # 2) move each page and leave a forwarding page at the old address
    for old, new in MAP.items():
        title = title_of(os.path.join(ROOT, G + old + '.html'))
        print(f'{old}.html -> {new}.html   ({title})')
        if dry: continue
        subprocess.run(['git', 'mv', G + old + '.html', G + new + '.html'], cwd=ROOT, check=True)
        write_stub(G + old + '.html', new + '.html', title)
        subprocess.run(['git', 'add', G + old + '.html'], cwd=ROOT, check=True)

if __name__ == '__main__':
    main('--dry' in sys.argv)
