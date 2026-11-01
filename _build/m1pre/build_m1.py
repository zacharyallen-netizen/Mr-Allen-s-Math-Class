#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build the NC Math 1 unit pre-tests (math1/M1_UnitN_PreTest.html) with the shared pre-test engine
(../build_pretest.py). Configs live in units_a.py (Units 1–4) and units_b.py (Units 5–8)."""
import sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from m1common import BP
import units_a
CFGS = list(units_a.CFGS)
try:
    import units_b
    CFGS += units_b.CFGS
except ImportError:
    pass

only = sys.argv[1:] and set(int(a) for a in sys.argv[1:])
for cfg in CFGS:
    n = int(cfg['file'].split('Unit')[1].split('_')[0])
    if only and n not in only: continue
    lv = {}
    for q in cfg['qs']: lv[q['lvl']] = lv.get(q['lvl'], 0) + 1
    assert len(cfg['qs']) == 18 and lv == {'basic': 6, 'target': 6, 'advanced': 6}, (cfg['file'], lv)
    assert [q['id'] for q in cfg['qs']] == list(range(1, 19))
    out = BP.build(cfg)
    print('built', os.path.basename(out), '(%d items, %d visuals)' % (len(cfg['qs']), sum(1 for q in cfg['qs'] if q.get('svg'))))
