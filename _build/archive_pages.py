"""Move unused pages into grade8/archive/ (nothing is deleted) and fix their relative links so they still open.
Usage: python3 _build/archive_pages.py grade8/old.html [grade8/ican/unit1.html ...]
Each file keeps its sub-folder under archive/ (grade8/ican/unit1.html -> grade8/archive/ican/unit1.html)."""
import os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARCH = 'grade8/archive'
URL = re.compile(r'''((?:href|src|action)\s*=\s*["']|url\(\s*["']?|["'])((?:\.\./|\./)?[\w./%-]+\.(?:html|css|js|pdf|png|jpe?g|svg|gif|webp|mp3|json)(?:[?#][^"')\s]*)?)''')

def fix(text, old, new):
    od, nd = os.path.dirname(old), os.path.dirname(new)
    def sub(m):
        u = m.group(2)
        if re.match(r'^[a-z]+:', u) or u.startswith('/'): return m.group(0)
        path, tail = re.match(r'([^?#]*)(.*)', u).groups()
        target = os.path.normpath(os.path.join(od, path))
        if not os.path.exists(os.path.join(ROOT, target)): return m.group(0)   # leave anything we can't resolve
        return m.group(1) + os.path.relpath(target, nd) + tail
    return URL.sub(sub, text)

for old in sys.argv[1:]:
    rel = os.path.relpath(old, 'grade8')
    new = os.path.join(ARCH, rel)
    os.makedirs(os.path.join(ROOT, os.path.dirname(new)), exist_ok=True)
    src = open(os.path.join(ROOT, old), encoding='utf-8').read()
    out = fix(src, old, new)
    subprocess.run(['git', 'mv', old, new], cwd=ROOT, check=True)
    open(os.path.join(ROOT, new), 'w', encoding='utf-8').write(out)
    print(f'{old} -> {new}')
