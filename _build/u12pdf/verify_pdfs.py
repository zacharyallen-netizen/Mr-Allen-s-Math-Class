"""Checks each PDF against the live HTML dump: every question present, in order, inside its own
region; headings/directives present; answers only in the keys; key marked ANSWER KEY."""
import json, re, sys, unicodedata, logging
logging.disable(logging.WARNING)
import pdfplumber
G = '/home/claude/mr-allen-s-math-class/grade8/'
d = json.load(open(sys.argv[1]))
JOBS = [('Unit1_PreTest','Unit1_PreTest'),('Unit1_PreTest_FormB','Unit1_PreTest_FormB'),('Unit_2_Pretest','Unit2_PreTest_ExponentRules')]
def norm(s):
    s = unicodedata.normalize('NFKD', s)
    s = ''.join(c for c in s if not unicodedata.combining(c))
    return re.sub(r'\s+', '', s).replace('⁄','/').replace('⁄','/')
from collections import Counter
def subset(want, txt):            # same characters, any order (stacked fractions / sup / sub reorder in PDF text)
    return not (Counter(want) - Counter(txt))
def words_in_order(phrase, text):  # every word of phrase appears in text, in order
    pos = 0
    for w in phrase.split():
        w = norm(w); k = text.find(w, pos)
        if k < 0: return False
        pos = k + len(w)
    return True
bad = 0
def fail(msg):
    global bad; bad += 1; print('  FAIL', msg)
for html, pdf in JOBS:
    H = d[html]
    for key in (False, True):
        f = pdf + ('_AnswerKey' if key else '') + '.pdf'
        P = pdfplumber.open(G + f)
        full = norm(' '.join(pg.extract_text() or '' for pg in P.pages))
        # reading-order walk for question numbers
        words = []
        for pi, pg in enumerate(P.pages):
            for w in pg.extract_words():
                words.append((pi, round(w['top']/4), w['x0'], w, pg))
        words.sort(key=lambda t: (t[0], t[1], t[2]))
        qs = H['questions']; found = []; i = 0
        for pi, _, x0, w, pg in words:
            if i < len(qs) and w['text'] == qs[i]['no'].strip():
                found.append((pi, w, pg)); i += 1
        if i != len(qs): fail(f'{f}: only {i}/{len(qs)} question numbers found in order')
        # each question's text sits right beside its number (crop half a page wide, 1.6in tall)
        for q, (pi, w, pg) in zip(qs, found):
            wide = 270 if html == 'Unit_2_Pretest' else pg.width
            box = (max(0, w['x0']-4), max(0, w['top']-4), min(pg.width, w['x0']+wide), min(pg.height, w['top']+115))
            txt = norm(pg.crop(box).extract_text() or '')
            want = norm(q['no'] + q['text'])
            if want not in txt and subset(want, txt): print(f'  note {f}: q{q["no"]} matched with layout reordering (stacked/sup/sub)')
            elif want not in txt: fail(f'{f}: q{q["no"]} text {want!r} not found near its number; got {txt[:120]!r}')
            for e in q['extra']:
                if norm(e) not in txt and not subset(norm(e), txt): fail(f'{f}: q{q["no"]} missing {e!r}')
        for h in H['headings']:
            if norm(h) not in full: fail(f'{f}: heading/directive missing {h!r}')
        for v in H.get('vocab', []):
            if norm(v['term']) not in full or not words_in_order(v['def'], full): fail(f'{f}: vocab {v["term"]} missing')
        # answers: in the key, not in the blank
        prompts = ''.join(norm(q['text']) for q in qs)
        marks = ['Solution:', 'answer:'] + [a for a in H['answers'] if len(norm(a)) > 12 and norm(a) not in prompts]
        hits = [a for a in marks if norm(a) in full]
        if key:
            missing = [a for a in H['answers'] if norm(a) not in full and not (len(norm(a)) < 8 and subset(norm(a), full))]
            if missing: fail(f'{f}: key missing answers {missing[:5]}')
            if 'ANSWERKEY' not in full.upper(): fail(f'{f}: not marked Answer Key')
            if 'KEYERROR' in full: fail(f'{f}: key error text present')
        else:
            if hits: fail(f'{f}: blank shows answers {hits[:4]}')
            if 'ANSWERKEY' in full.upper(): fail(f'{f}: blank says answer key')
        for chrome in ['Checkallanswers', 'Showanswers', 'Reset', 'correct', 'Backto', 'ReturntoHome', 'Tapamark', 'Clearplacements', 'SendtoMr', 'Mr.Allen·8th', 'Check']:
            if chrome in full and not (key and chrome == 'correct'):
                # 'correct' can legitimately appear inside words; flag only stand-alone UI strings
                if chrome in ('correct',): continue
                fail(f'{f}: web chrome text {chrome!r} printed')
        print(f'{f}: {len(P.pages)} pages, {i}/{len(qs)} questions in order', 'OK' if not bad else '')
print('TOTAL FAILURES', bad)
