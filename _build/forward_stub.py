"""Write a tiny page at an old address that forwards to the new one (keeps ?query and #hash),
so links already posted in Google Classroom or bookmarked keep working.
Usage from Python: write_stub('grade8/old.html', 'new.html', 'New page title')"""
import html, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def write_stub(old_path, new_href, title):
    t = html.escape(title)
    h = html.escape(new_href, quote=True)
    page = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>{t} — moved</title>
<meta http-equiv="refresh" content="0; url={h}">
<script>location.replace({new_href!r} + location.search + location.hash);</script>
<link rel="canonical" href="{h}">
</head>
<body style="font:16px/1.5 Inter,system-ui,sans-serif;padding:24px;color:#1E2D4F;background:#F7F7F4">
<p>This page moved. <a href="{h}">Go to {t}</a>.</p>
</body>
</html>
'''
    with open(os.path.join(ROOT, old_path), 'w', encoding='utf-8') as f:
        f.write(page)
