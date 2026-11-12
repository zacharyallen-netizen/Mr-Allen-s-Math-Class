import json, os
G='/home/claude/mr-allen-s-math-class/grade8/'
SETS=json.load(open('/tmp/claude-0/-home-claude/71df80c8-d29a-5b9a-96ce-5a924999e656/scratchpad/prac2/sets.json'))
LABEL={'Practice1':'Practice 1','Practice2':'Practice 2','Practice':'Practice','Problems':'Practice Problems 5.1–5.4'}
out={}
for key,s in SETS.items():
    topic=key.split('_')[1:-1]; tag=key.split('_')[-1]
    name=f"Unit {s['unit']} · "+(' '.join(topic)+' ' if topic else '')+LABEL[tag]
    if key=='Unit5_Practice_Problems': name='Unit 5 · Practice Problems 5.1–5.4'
    # page names follow _build/rename_pages.py (Nov 2026): unitN-practice-1, unit2-practice-exponents-1, ...
    import sys, os; sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from rename_pages import MAP as RENAMED
    fn=RENAMED.get(key+'_Interactive', key+'_Interactive')+'.html'
    d={'unit':s['unit'],'pdf':s['pdf'],'data':s['data']}
    _k=s['pdf'].replace('_Blank.pdf','_AnswerKey.pdf') if s['pdf'].endswith('_Blank.pdf') else s['pdf'][:-4]+'_AnswerKey.pdf'
    if os.path.exists(G+_k): d={'unit':d['unit'],'pdf':d['pdf'],'key':_k,'data':d['data']}
    stds=sorted({x['std'] for x in s['data']['secs']})
    page=f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{name} — Interactive</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,600&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../site.css">
<link rel="stylesheet" href="practice/practice.css">
</head>
<body>
<script src="../site-bar.js"></script>
<div class="page-wrap">
<a href="unit{s['unit']}.html" class="back-link">← Back to Unit {s['unit']}</a>
<div id="practice"></div>
</div>
<div class="site-footer">© Mr. Allen's Math Class</div>
<script>window.PRACTICE = {json.dumps(d,ensure_ascii=False)};</script>
<script src="tap-answers.js?v=20261112b"></script>
<script src="practice/practice-engine.js?v=20261112b"></script>
<script src="../tracker-config.js"></script>
<script src="../score-send.js"></script>
<script> ScoreSend.setup({{ kind:'practice', unit:'{s['unit']}', page:'{name}', mount:'#ss-mount', std:'{stds[0]}', band:3 }}); </script>
</body>
</html>
'''
    open(G+fn,'w').write(page); out[key]=(fn,name,s['pdf'])
json.dump(out,open('/tmp/claude-0/-home-claude/71df80c8-d29a-5b9a-96ce-5a924999e656/scratchpad/prac2/pages.json','w'),indent=1)
for k,v in out.items(): print(v)
