import pdfplumber,re,json,sys
G='/home/claude/mr-allen-s-math-class/grade8/'
GREEN=(0.909803921,0.960784313,0.886274509)
def near(c,t): return c and len(c)==3 and all(abs(a-b)<.01 for a,b in zip(c,t))
def lines(words):
    L=[]
    for w in sorted(words,key=lambda w:(round(w['top']),w['x0'])):
        if L and abs(L[-1][0]['top']-w['top'])<3: L[-1].append(w)
        else: L.append([w])
    return L
def extract(key):
    pdf=pdfplumber.open(G+key); out={'title':None,'sub':None,'secs':[]}; probs=[]
    for pi,pg in enumerate(pdf.pages):
        pg=pg.dedupe_chars()
        words=pg.extract_words(keep_blank_chars=False,x_tolerance=1.5)
        greens=[r for r in pg.rects if near(r.get('non_stroking_color'),GREEN)]
        secbars=[r for r in pg.rects if r.get('non_stroking_color') and near(r['non_stroking_color'],(1.0,0.756862745,0.02745098)) and r['x1']-r['x0']<8]
        boxes=[r for r in pg.rects if r['x1']-r['x0']>400 and r['bottom']-r['top']>30 and r['top']>80]
        L=lines(words)
        if pi==0 and out['title'] is None:
            out['title']=' '.join(w['text'] for w in L[0]).replace('(cid:1)','').strip(' ✏🖊')
            out['sub']=' '.join(w['text'] for w in L[1])
        events=[]
        for b in secbars:
            t=' '.join(w['text'] for l in L for w in l if b['top']-2<=l[0]['top']<=b['bottom'])
            events.append((pi,b['top'],'sec',t.strip()))
        for l in L:
            tx=' '.join(w['text'] for w in l).strip()
            m=re.match(r'^Problem (\d+)$',tx)
            if m: events.append((pi,l[0]['top'],'prob',int(m.group(1)),l))
        events.sort(key=lambda e:(e[0],e[1]))
        for k,e in enumerate(events):
            if e[2]=='sec': out['secs'].append({'title':e[3],'probs':[]}); continue
            top=e[1]; box=min([b for b in boxes if b['top']<=top<=b['bottom']] or [None],key=lambda b:b['bottom']-b['top'] if b else 0)
            bot=box['bottom'] if box else (events[k+1][1] if k+1<len(events) else pg.height)
            gr=[g for g in greens if top<g['top']<bot]
            g=gr[0] if gr else None
            ans=' '.join(w['text'] for l in L for w in l if g and g['top']-1<=w['top']<=g['bottom']+1 and w['x0']>=g['x0']-1 and w['x1']<=g['x1']+40).strip()
            # question lines: lines after label, left-aligned near label x
            lx=e[4][0]['x0']; q=[];qbot=top+10
            for l in L:
                if l[0]['top']<=top+2 or (g and l[0]['top']>=g['top']-1) or l[0]['top']>=bot: continue
                if abs(l[0]['x0']-lx)<4 and (not q or l[0]['top']-qbot<16): q.append(' '.join(w['text'] for w in l)); qbot=l[0]['bottom']
                elif q: break
            figtop=qbot+2; figbot=(g['top']-2) if g else bot-4
            hasfig=any(figtop<c['top']<figbot for c in pg.curves+pg.lines+pg.rects if c not in greens) or any(figtop<l[0]['top']<figbot for l in L)
            fig=dict(page=pi,x0=box['x0'] if box else 40,x1=box['x1'] if box else 554,top=figtop,bottom=figbot) if hasfig and figbot-figtop>12 else None
            if not out['secs']: out['secs'].append({'title':'','probs':[]})
            out['secs'][-1]['probs'].append({'n':e[3],'q':' '.join(q),'ans':ans,'fig':fig})
    return out
if __name__=='__main__':
    d=extract(sys.argv[1]); print(json.dumps(d,ensure_ascii=False,indent=0)[:6000])
