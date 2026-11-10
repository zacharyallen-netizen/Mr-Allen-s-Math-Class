"""Unit 7 and Unit 8 Extra Practice: Score 3/4/5 on every problem, ordered 3 -> 4 -> 5 inside each section,
renumbered Problem 1, 2, ... (labels only; nothing removed). Nov 10, 2026. Run once: python3 _build/extra_levels_nov10.py"""
import os, re
from practice_trim_nov10 import G, LV, CSS, block_end
PLAN = {
 'unit7-practice.html': [[('7a', 3), ('7b', 3), ('7j', 3), ('7g', 4)], [('7e', 3), ('7c', 4), ('7d', 4), ('7f', 5)],
                         [('7i', 4), ('7l', 4), ('7h', 5), ('7k', 5)]],
 'unit8-practice.html': [[('8a', 3)], [('8b', 3), ('8c', 3), ('8k', 5)], [('8e', 3), ('8d', 4), ('8l', 4)],
                         [('8f', 3), ('8g', 3)], [('8h', 3), ('8i', 4), ('8j', 4)]],
}
for fn, secs in PLAN.items():
    path = os.path.join(G, fn); s = open(path, encoding='utf-8').read(); assert 'class="pr-lv' not in s
    cards = {m.group(1): (m.start(), block_end(s, m.start())) for m in re.finditer(r'<div class="q-card" id="([^"]+)">', s)}
    hdrs = [m for m in re.finditer(r'<div class="sec-header">.*?</div>\n?', s)]
    assert len(hdrs) == len(secs) and len(cards) == sum(map(len, secs)), (fn, len(hdrs), len(cards))
    order = sorted(cards.values()); a, b = hdrs[0].start(), order[-1][1]
    # every card must sit after its own header and only whitespace may sit between cards / headers
    out, k = [], 0
    for h, sec in zip(hdrs, secs):
        out.append(h.group(0).rstrip('\n') + '\n')
        for cid, sc in sec:
            k += 1; x, y = cards[cid]; q = s[x:y]
            q, n = re.subn(r'<div class="q-num">Problem [^<]*</div>', f'<div class="q-num">Problem {k}{LV.format(sc)}</div>', q, count=1); assert n
            out.append(q + '\n')
    rest = s[a:b]
    for h in hdrs: rest = rest.replace(h.group(0), '', 1)
    for x, y in order: rest = rest.replace(s[x:y], '', 1)
    assert not rest.strip(), (fn, rest.strip()[:200])
    s = s[:a] + '\n'.join(out).rstrip('\n') + s[b:]
    s = s.replace('</head>', CSS + '\n</head>', 1)
    open(path, 'w', encoding='utf-8').write(s); print(fn, k)
