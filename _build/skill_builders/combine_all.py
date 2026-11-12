"""One PDF with every Skill Builders unit (lessons + practice) and one combined answer key, bookmarked by unit.
python3 _build/skill_builders/combine_all.py   (after node _build/skill_builders/pdfs.js)"""
import pathlib
from pypdf import PdfReader, PdfWriter
D = pathlib.Path(__file__).resolve().parents[2] / 'grade8' / 'skills' / 'pdf'
NAMES = ['Real Numbers', 'Exponents & Scientific Notation', 'Equations & Inequalities', 'Angle Relationships',
         'Pythagorean Theorem', 'Functions', 'Statistics', 'Transformations']
for key in ('', '_AnswerKey'):
    w, page = PdfWriter(), 0
    for n, name in enumerate(NAMES, 1):
        parent = None
        for kind, label in (('Lessons', 'Mini-Lessons'), ('Practice', 'Practice Set')):
            r = PdfReader(D / f'SkillBuilders_Unit{n}_{kind}{key}.pdf')
            for p in r.pages: w.add_page(p)
            if parent is None: parent = w.add_outline_item(f'Unit {n}: {name}', page)
            w.add_outline_item(label, page, parent=parent); page += len(r.pages)
    out = D / f'SkillBuilders_All_Units{key}.pdf'; w.write(out); print(out.name, page, 'pages')
