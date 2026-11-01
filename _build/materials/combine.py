"""Combine PDFs into one file with a bookmark per part.
python3 _build/materials/combine.py OUT.pdf "Bookmark A=a.pdf" "Bookmark B=b.pdf" ...
"""
import sys
from pypdf import PdfReader, PdfWriter
out, specs = sys.argv[1], sys.argv[2:]
w, page = PdfWriter(), 0
for spec in specs:
    title, path = spec.split("=", 1) if "=" in spec else (spec.rsplit("/", 1)[-1][:-4], spec)
    r = PdfReader(path)
    for p in r.pages: w.add_page(p)
    w.add_outline_item(title, page); page += len(r.pages)
w.write(out)
print(out, page, "pages")
