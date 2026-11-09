"""One shared look for the 'Print PDF / Answer key' links that live INSIDE interactive notes, pre-tests and practice pages
(Nov 2026: the unit pages no longer repeat them). Used by build_pretest.py and by the one-time patch in this file."""
import os
BTN = ("font:700 14px Inter,system-ui,sans-serif;padding:8px 14px;background:#fff;border-radius:8px;text-decoration:none;"
       "display:inline-flex;align-items:center;gap:6px;min-height:40px")
def row(pdf=None, key=None, pdf_label='Print PDF', key_label='Answer Key (PDF)'):
    a = []
    if pdf: a.append(f'<a href="{pdf}" target="_blank" rel="noopener" style="{BTN};color:#1E2D4F;border:2px solid #1E2D4F">🖨️ {pdf_label}</a>')
    if key: a.append(f'<a href="{key}" target="_blank" rel="noopener" style="{BTN};color:#14532D;border:2px solid #15803D">✅ {key_label}</a>')
    if not a: return ''
    return ('<style>@media print{.pdf-links{display:none!important}}</style><div class="pdf-links" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:10px 0 14px">'
            + ''.join(a) + '</div>')

# pre-test page → (print PDF, answer key)
PRETEST = {
    'unit1-pretest.html': ('Unit1_PreTest.pdf', 'Unit1_PreTest_AnswerKey.pdf'),
    'unit1-pretest-form-b.html': ('Unit1_PreTest_FormB.pdf', 'Unit1_PreTest_FormB_AnswerKey.pdf'),
    'unit2-pretest-exponents.html': ('Unit2_PreTest_ExponentRules.pdf', 'Unit2_PreTest_ExponentRules_AnswerKey.pdf'),
    'unit2-pretest-sci-notation.html': ('Unit2_PreTest_ScientificNotation.pdf', 'Unit2_PreTest_ScientificNotation_AnswerKey.pdf'),
    'unit3-pretest.html': ('Unit3_PreTest.pdf', 'Unit3_PreTest_AnswerKey.pdf'),
    'unit4-pretest.html': ('Unit4_PreTest.pdf', 'Unit4_PreTest_AnswerKey.pdf'),
    'units3-4-pretest.html': ('Unit3_4_PreTest.pdf', None),
    'unit5-pretest.html': ('Unit5_PreTest.pdf', 'Unit5_PreTest_AnswerKey.pdf'),
    'unit6-pretest.html': ('Unit6_PreTest.pdf', 'Unit6_PreTest_AnswerKey.pdf'),
    'unit7-pretest.html': ('Unit7_PreTest.pdf', 'Unit7_PreTest_AnswerKey.pdf'),
    'unit8-pretest.html': ('Unit8_PreTest.pdf', 'Unit8_PreTest_AnswerKey.pdf'),
    'unit9-pretest.html': ('Unit9_PreTest.pdf', 'Unit9_PreTest_AnswerKey.pdf'),
}
def pretest_row(fname):
    p = PRETEST.get(os.path.basename(fname))
    return row(*p) if p else ''
