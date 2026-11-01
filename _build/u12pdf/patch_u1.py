"""One-time patch: print stylesheet + hidden answer-key mode for the two Unit 1 pre-test pages.
Question text/numbers are untouched; only answer data (ans) and print-only pieces are added."""
import re, sys
G = '/home/claude/mr-allen-s-math-class/grade8/'
ANS = {
  'Unit1_PreTest.html':       {1:'0.375',2:'1/4',3:'R',4:'2/3',5:'2.833…',6:'IR',7:'R',8:'R',11:'R',12:'IR',14:('15 ft','60 ft')},
  'Unit1_PreTest_FormB.html': {1:'0.625',2:'3/4',3:'R',4:'1/3',5:'2.333…',6:'IR',7:'R',8:'R',11:'R',12:'IR',14:('14 ft','56 ft')},
}
PRINT_CSS = r'''
  /* ---- Answer key flag + paper-only pieces (hidden on screen) ---- */
  .key-flag,.print-line{display:none;}

  /* ---- Paper version: a clean worksheet (screen look is unchanged) ---- */
  @media print{
    @page{size:letter;margin:.5in .45in;}
    *{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    body{background:#fff;font-size:15px;}
    .backrow,.scorebar,.toolbar,footer.sitefoot,.check-btn,.mini,.chips,.nl-readout{display:none!important;}
    .answer-row:has(> .check-btn),.answer-row:has(> .mini){display:none!important;}
    .sheet{max-width:none;padding:0;}
    .masthead{padding-bottom:10px;}
    .masthead h1{font-size:1.75rem;}
    .meta{gap:8px 28px;font-size:.92rem;}
    .meta label{color:var(--ink);}
    .meta input{border-bottom:1.2px solid #333;min-width:1.7in;}
    .band{margin:16px 0 2px;padding:8px 14px;break-after:avoid;page-break-after:avoid;}
    .subsec{margin:12px 0 0;break-after:avoid;page-break-after:avoid;}
    .directive{margin:2px 0 6px;break-after:avoid;page-break-after:avoid;}
    .garden{margin:8px auto;break-after:avoid;page-break-after:avoid;}
    .q{background:#fff;margin:8px 0;padding:10px 14px 12px;break-inside:avoid;page-break-inside:avoid;}
    .answer-row{margin-top:10px;}
    input.answer{border:0;border-bottom:1.5px solid #333;border-radius:0;background:transparent;min-width:2.6in;padding:5px 2px 2px;}
    input.answer::placeholder{color:#8a8578;}
    .feedback{transition:none;}
    .feedback.show{max-height:none;}
    .print-line{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.95rem;color:var(--muted);align-items:flex-end;gap:8px;margin-top:8px;}
    .print-line .pl-blank{display:inline-block;width:3.6in;border-bottom:1.5px solid #333;height:1.2em;}
    body:not(.answer-key) .print-line{display:flex;}
    body:not(.answer-key) .order-readout{display:none;}
    body.answer-key .key-flag{display:inline-block;margin:6px 0 0;padding:3px 12px;border:2px solid var(--bad);color:var(--bad);font-weight:800;letter-spacing:.18em;text-transform:uppercase;font-size:.9rem;border-radius:4px;}
    body.answer-key input.answer{color:var(--good);font-weight:700;}
    body.answer-key .q.correct{background:#fff;}
  }
'''
KEY_JS = r'''
/* ================= Answer key (prints the answer-key PDF; no button on screen) ================= */
function showAnswerKey(){
  document.body.classList.add('answer-key');
  registry.forEach(e=>{
    const q=e.q;
    if(q.type==='numberline') e.comp.setValue(q.target);
    else if(q.type==='order') e.comp.placeInOrder();
    else if(q.type==='multi') e.inputs.forEach((i,k)=>{i.value=q.multi[k].ans;});
    else e.inputs[0].value=q.ans;
    const ok=e.isCorrect(); e.applyMark(ok);
    e.card.classList.remove('correct','incorrect'); e.card.classList.add(ok?'correct':'incorrect');
    verdict(e.feedbackEl, ok?'pass':'fail', ok?'Solution:':'KEY ERROR: this answer fails the checker', e.why);
  });
  updateScore();
  if(window.ScoreSend&&ScoreSend.revealed)ScoreSend.revealed();
}
window.showAnswerKey=showAnswerKey;
'''

def sub1(pat, rep, s, flags=0):
    s2, n = re.subn(pat, rep, s, count=1, flags=flags)
    if n != 1: sys.exit('pattern not found: ' + pat)
    return s2

for fn, ans in ANS.items():
    p = G + fn; s = open(p, encoding='utf-8').read()
    if 'showAnswerKey' in s: print('already patched', fn); continue
    # 1. print CSS
    s = sub1(r'(  @media\(max-width:520px\)\{[^\n]*\n)(</style>)', lambda m: m.group(1) + PRINT_CSS + m.group(2), s)
    # 2. key flag in masthead
    s = sub1(r'(<p class="eyebrow">[^<]*</p>\n)', lambda m: m.group(1) + '    <p class="key-flag">Answer Key</p>\n', s)
    # 3. answers in the question data
    for no, a in ans.items():
        if isinstance(a, tuple):
            # the two multi fields (side length, perimeter)
            line = re.search(r'multi:\[ \{label:"Side length =".*?\]', s).group(0)
            parts = line.split('}, {')
            new = parts[0] + ',ans:"' + a[0] + '"}, {' + parts[1].rstrip(' ]').rstrip('}') + ',ans:"' + a[1] + '"} ]'
            s = s.replace(line, new)
        else:
            s = sub1(r"(\{ no:%d, prompt:.*?type:'text', )" % no, lambda m, a=a: m.group(1) + "ans:'" + a + "', ", s)
    # 4. number line: allow setting a value
    s = sub1(r"(    getValue:\(\)=>selected,\n)", lambda m: m.group(1) + "    setValue:(v)=>select(v),\n", s)
    # 5. ordering: place all values least->greatest; paper write-in line
    s = sub1(r"(    reset:reset,\n    needMsg:'Click all four values)",
             lambda m: "    placeInOrder:()=>{ reset(); items.map((it,k)=>({it,b:chipBtns[k]})).sort((x,y)=>x.it.value-y.it.value).forEach(o=>placeItem(o.it,o.b)); },\n" + m.group(1), s)
    s = sub1(r"(  wrap\.appendChild\(chipsRow\); wrap\.appendChild\(readout\);\n)",
             lambda m: m.group(1) + "  const pl=document.createElement('div'); pl.className='print-line'; pl.innerHTML='Order: <span class=\"pl-blank\"></span>'; wrap.appendChild(pl);\n", s)
    # 6. keep the question on its registry entry
    s = sub1(r"(      registry\.push\(entry\);)", lambda m: "      entry.q=q;\n" + m.group(1), s)
    # 7. key function + reset clears key mode
    s = sub1(r"(updateScore\(\);\n</script>)", lambda m: "updateScore();\n" + KEY_JS + "</script>", s)
    s = sub1(r"(document\.getElementById\('reset'\)\.addEventListener\('click',\(\)=>\{\n)",
             lambda m: m.group(1) + "  document.body.classList.remove('answer-key');\n", s)
    open(p, 'w', encoding='utf-8').write(s)
    print('patched', fn)
