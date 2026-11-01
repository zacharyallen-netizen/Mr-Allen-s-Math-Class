"""Module 2 worksheet clean-up: trim words (rule 4). Edits by paragraph index.
Value: list of run texts (same count as existing runs) or None to delete the paragraph."""
import re, sys
from xml.sax.saxutils import escape

EDITS = {
    'Facts': {
        7: ['×4:  ', 'double it twice.   4 × 7:  7 → 14 → 28'],
        8: ['×8:  ', 'double it three times.   8 × 7:  7 → 14 → 28 → 56'],
        9: ['×11:  ', 'write the digit twice.   11 × 6 = 66'],
        6: ['×9:  ', 'ten times, minus the number.   9 × 7 = 70 − 7 = 63'],
        10: ['Squares:  ', '6 × 6 = 36,   7 × 7 = 49,   8 × 8 = 64,   9 × 9 = 81,   12 × 12 = 144'],
        11: ['Fill the grid'],
        12: ['Row × column. Time yourself.'],
        77: ['On your own'],
        90: ['Say each fact out loud. ★'],
    },
    'Mixed_Review': {
        5: None,
        6: ['Warm-up'],
        13: ['Challenge set'],
        14: ['Stack, then solve.'],
        19: ['Stack, then solve.'],
        22: ['Find the mistake'],
        23: None,
        33: ['Facts fast, algorithm clean. ★'],
    },
    'MultiDigit_Guided': {
        5: ['Refresher'],
        6: ['Example 1:  ', '34 × 6', ''],
        11: ['Ones: 6 × 4 = 24 → write 4, carry 2.'],
        12: ['Tens: 6 × 3 = 18, + carry 2 = 20 → write 20.'],
        13: ['Example 2:  ', '47 × 38', ''],
        21: ['Line 2 is the ', 'tens', ':  47 × 30 = 1410 (the shift).'],
        22: ['Your turn'],
        37: ['Partial 2  (46 × 20): = ______   ← the shift'],
        48: ['On your own'],
        79: ['Stack, then solve.'],
        82: ['Remember the shift. ★'],
    },
    'MultiDigit_Light': {
        13: ['Line 1:  ', '47 × 8 = 376', '.   Line 2 (shift):  ', '47 × 30 = 1410', '.   Add:  ', '1786', '.'],
        14: ['Copy the move'],
        20: ['Your turn'],
        33: ['Your turn'],
        43: ['Your turn'],
        79: ['Stack, then solve.'],
    },
}

def edit(path, edits):
    x = open(path, encoding='utf-8').read()
    idx = [-1]
    def sub(m):
        idx[0] += 1
        i = idx[0]
        if i not in edits:
            return m.group()
        new = edits[i]
        if new is None:
            return ''
        ts = list(re.finditer(r'<w:t(?: [^>]*)?(?:/>|>[^<]*</w:t>)', m.group()))
        assert len(ts) == len(new), (path, i, len(ts), new)
        p = m.group(); out = []; last = 0
        for t, s in zip(ts, new):
            out.append(p[last:t.start()])
            out.append('<w:t xml:space="preserve">%s</w:t>' % escape(s))
            last = t.end()
        out.append(p[last:])
        return ''.join(out)
    x2 = re.sub(r'<w:p[ >].*?</w:p>', sub, x, flags=re.S)
    open(path, 'w', encoding='utf-8').write(x2)

if __name__ == "__main__":
  for name, e in EDITS.items():
    edit(f"u_{name}/word/document.xml", e)
    print('edited', name)
