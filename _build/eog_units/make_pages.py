"""Unit EOG Practice pages (Nov 2026): grade8/unitN-eog.html (Version 1, EOG style) and unitN-eog-v2.html (Version 2).
Each page is a small shell; the engine is grade8/eog/eog-unit.js and the questions are in grade8/eog/uN.js.
Run after adding a unit or changing the version number:  python3 _build/eog_units/make_pages.py"""
import os, re
G = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'grade8')
V = '20261110j'   # bump when eog-unit.js, eog-unit.css or a uN.js changes
TITLES = {1: 'Real Numbers', 2: 'Exponents & Scientific Notation', 3: 'Linear Equations', 4: 'Angles & Geometry', 5: 'Pythagorean Theorem',
          6: 'Functions, Slope & Systems', 7: 'Data Analysis & Statistics', 8: 'Transformations', 9: 'Volume'}
PAGE = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Unit {n} EOG Practice{v2t} — Mr. Allen&#39;s Math Class</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,600&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="eog/eog-unit.css?v={V}">
<script src="../brand.js"></script>
</head>
<body>
<!-- SITE-BAR -->
<script src="../site-bar.js"></script>
<div class="wrap" id="eogwrap"><noscript>This page needs JavaScript.</noscript></div>
<script src="../tracker-config.js"></script>
<script src="../score-send.js"></script>
<script src="eog/eog-unit.js?v={V}"></script>
<script src="eog/u{n}.js?v={V}"></script>
<script>EOGU.run({n}, {ver});</script>
<script src="one-at-a-time.js?v=20261110k"></script>
</body>
</html>
'''
if __name__ == '__main__':
    for n in TITLES:
        if not os.path.exists(os.path.join(G, 'eog', 'u%d.js' % n)): continue
        for ver in (1, 2):
            fn = 'unit%d-eog%s.html' % (n, '-v2' if ver == 2 else '')
            open(os.path.join(G, fn), 'w', encoding='utf-8').write(PAGE.format(n=n, ver=ver, V=V, v2t=' · Version 2' if ver == 2 else ''))
            print(fn)
