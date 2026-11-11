"""Homework answer checking data (Nov 11, 2026).

PRIVATE KEY RULE: Mr. Allen's homework answer key ("8th_Grade_Homework_2026-27_ANSWER_KEY.pdf", in his Google Drive)
must NEVER be committed to this public repo. Neither may anything this script prints, or any file with readable answers.

This script reads the key PDF from a path OUTSIDE the repo and writes ONLY scrambled codes (hashes) to
grade8/homework/check.js:
    HW_CHECK[hw][num] = [type, hash, type, hash ...]
    type: n one number | m numbers in order | l letter(s) | w word(s) | p written form
In the key, answers are green text and chosen choices are green-filled shapes. Only clear-cut answers get a code.
Explanations, find-the-mistake, graphs, stacked-fraction answers and anything unclear are left out: the page says
"Mr. Allen checks this one."
The tidy-up rules (num, nums, letters, words, form) must stay the same as grade8/homework-check.js.

Run:  python3 _build/hw_check_build.py /path/outside/repo/KEY.pdf [/path/outside/repo/review.json]
      (needs pdfplumber and pdftotext; takes a few minutes)
The optional review file lists what was read for each problem (readable answers: keep it outside the repo). Use it to
test that the page's checker accepts the key's own answer for every coded problem.
"""
import re, json, sys, os, collections, subprocess, logging
from fractions import Fraction
GREEN=(0.0824,0.502,0.2392); NAVY=(0.1176,0.1765,0.3098)
PUA={'':'=','':'−','':'(','':')','':'+','':'×','':'→','':':','':'÷','':'≈','':'<','':'{','':'}','':'≥','':'>','':'≤','':'≠','':'≅','':'↔','':'-'}
def isc(c,ref,tol=0.02):
    try: return c is not None and len(c)==3 and all(abs(a-b)<tol for a,b in zip(c,ref))
    except TypeError: return False
def white(c):
    try: return c is not None and ((len(c)==3 and min(c)>0.97) or (len(c)==1 and c[0]>0.97))
    except TypeError: return False
def inside(o,b,pad=1): return o['x0']>=b[0]-pad and o['x1']<=b[2]+pad and o['top']>=b[1]-pad and o['bottom']<=b[3]+pad
def lines_of(chars):
    lines=[]
    for c in sorted(chars,key=lambda c:-c['size']):                      # big chars set the lines; small raised ones join them
        mid=(c['top']+c['bottom'])/2; best=None
        for L in lines:
            if c['size']>=0.85*L['size']:
                if abs(L['mid']-mid)<2.2: best=L; break
            elif L['top']-3.5<=c['top'] and c['bottom']<=L['base']+1 and L['x0']-2<=c['x0']<=L['x1']+c['size']: best=L; break
        if best: best['cs'].append(c); best['x0']=min(best['x0'],c['x0']); best['x1']=max(best['x1'],c['x1'])
        else: lines.append({'mid':mid,'size':c['size'],'top':c['top'],'base':c['bottom'],'x0':c['x0'],'x1':c['x1'],'cs':[c]})
    out=[]
    for L in sorted(lines,key=lambda L:(L['mid'],L['x0'])):
        cs=sorted(L['cs'],key=lambda c:c['x0']); s=''; prev=None; sup=False
        for c in cs:
            ch=PUA.get(c['text'],c['text']); raised=c['size']<0.85*L['size'] and c['bottom']<L['base']-2
            if prev is not None and c['x0']-prev['x1']>0.22*max(c['size'],prev['size']) and not s.endswith(' '): s+=' '
            if raised and not sup and ch.strip(): s=s.rstrip()+'^'; sup=True
            if not raised and ch.strip(): sup=False
            s+=ch; prev=c
        out.append({'t':re.sub(r'\s+',' ',s).strip(),'size':round(L['size'],1),'y':L['mid'],'x0':L['x0'],'x1':L['x1'],'font':cs[0]['fontname'].split('+')[-1]})
    return [o for o in out if o['t']]
def cards(pg):
    cs=set()
    for r in pg['shapes']:
        w=r['x1']-r['x0']; h=r['bottom']-r['top']
        if w>150 and h>40 and not r['fill'] and r['stroke'] and isc(r['stroking_color'],(0.8353,0.851,0.8784)): cs.add((round(r['x0']),round(r['top']),round(r['x1']),round(r['bottom'])))
    res=[]
    for b in sorted(cs,key=lambda b:(b[1],b[0])):
        chars=[c for c in pg['chars'] if inside(c,b)]
        gsh=[s for s in pg['shapes'] if s['fill'] and isc(s['non_stroking_color'],GREEN) and inside(s,b) and s['bottom']-s['top']>5]
        nsh=[s for s in pg['shapes'] if s['fill'] and isc(s['non_stroking_color'],NAVY) and inside(s,b) and s['x1']-s['x0']<22 and s['top']<b[1]+30]
        num=None
        for s in sorted(nsh,key=lambda s:(s['top'],s['x0'])):
            t=''.join(c['text'] for c in sorted(chars,key=lambda c:c['x0']) if inside(c,(s['x0'],s['top'],s['x1'],s['bottom']),1.5))
            if t.strip().isdigit(): num=int(t); break
        if num is None: continue
        sel=[]; seen=set(); opt=[]
        for s in sorted(gsh,key=lambda s:(round(s['top']),s['x0'])):
            bb=(s['x0'],s['top'],s['x1'],s['bottom']); k=tuple(round(v) for v in bb)
            if k in seen: continue
            seen.add(k)
            cs2=[c for c in chars if inside(c,bb,1.5) and white(c['non_stroking_color'])]
            t=' '.join(l['t'] for l in lines_of(cs2)).strip()
            if t: sel.append(t)
            if re.fullmatch(r'[A-E]',t):                                   # the words of the chosen choice (so "8" works as well as "C")
                row=[c for c in chars if abs((c['top']+c['bottom'])/2-(s['top']+s['bottom'])/2)<7 and c['x0']>=s['x1']-0.5 and not white(c['non_stroking_color']) and not isc(c['non_stroking_color'],GREEN)]
                nxt=[o['x0'] for o in pg['shapes'] if o is not s and 6<o['x1']-o['x0']<16 and 6<o['bottom']-o['top']<16 and abs(o['top']-s['top'])<4 and o['x0']>s['x1']+3 and inside(o,b)]
                lim=min(nxt)-1 if nxt else b[2]
                # the next choice's letter sits inside its circle: stop before it
                row=[c for c in row if c['x1']<=lim]
                ot=' '.join(l['t'] for l in lines_of(row)).strip()
                cm=(s['top']+s['bottom'])/2                                 # a stacked fraction or a second line in the choice: do not guess its words
                low=[c for c in chars if s['x1']-0.5<=c['x0'] and c['x1']<=lim and 3.5<(c['top']+c['bottom'])/2-cm<10 and c['text'].strip() and not isc(c['non_stroking_color'],GREEN)]
                if ot and not low: opt.append(ot)
        # other green marks = something is marked that we cannot read as text (outlined boxes, points on a graph, lines)
        gmarks=[s for s in pg['shapes'] if (isc(s['stroking_color'],GREEN) or (s['fill'] and isc(s['non_stroking_color'],GREEN))) and inside(s,b)]
        green=lines_of([c for c in chars if isc(c['non_stroking_color'],GREEN)])
        q=lines_of([c for c in chars if not isc(c['non_stroking_color'],GREEN) and not white(c['non_stroking_color']) and c['size']>6.5])
        res.append({'num':num,'sel':sel,'opt':opt,'green':green,'q':' '.join(x['t'] for x in q),'marks':len(gmarks)})
    return res

# ---------- canonical forms (the same rules are in grade8/homework-check.js) ----------
UNIT=r'(?:\s*(?:mm|cm|km|m|in|ft|yd|mi|units?|inches|feet|meters|miles|degrees|dollars|cents)\b\.?(?:\s*\^\s*[23])?)+'
SUP=str.maketrans('⁰¹²³⁴⁵⁶⁷⁸⁹','0123456789')
def pre(s):
    s=s.strip().lower()
    s=re.sub(r'[⁻]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+',lambda m:'^'+('-' if m.group()[0]=='⁻' else '')+m.group().lstrip('⁻').translate(SUP),s)
    s=re.sub(r'[−–—]','-',s); s=re.sub(r'[×·•]','*',s); s=s.replace('÷','/').replace('≥','>=').replace('≤','<=').replace('=>','>=').replace('=<','<=')
    return re.sub(r'[.;,!]+$','',s).strip()
def num(s):
    """one number: 17, x = 17, -3.5, 2/3, 2 1/3, $4.50, 40%, 5 in  ->  'n/d'  (None if it is not one clear number)"""
    s=pre(s); s=re.sub(r'^[a-z]\s*=\s*','',s); s=s.replace('$','').replace('%','').replace('°','')
    s=re.sub(r'(?<=\d),(?=\d{3}\b)','',s); s=re.sub(UNIT+'$','',s).strip()
    TAIL=r'(?:\s+[a-z][a-z ]*|[a-z]{2,}[a-z ]*)?$'
    m=re.match(r'^(-?)\s*(\d+)\s+(\d+)\s*/\s*(\d+)'+TAIL,s)
    if m and int(m.group(4)): f=Fraction(int(m.group(2)))+Fraction(int(m.group(3)),int(m.group(4))); f=-f if m.group(1) else f; return '%d/%d'%(f.numerator,f.denominator)
    m=re.match(r'^(-?\d+)\s*/\s*(-?\d+)'+TAIL,s)
    if m and int(m.group(2)): f=Fraction(int(m.group(1)),int(m.group(2))); return '%d/%d'%(f.numerator,f.denominator)
    m=re.match(r'^(-?(?:\d+\.?\d*|\.\d+))'+TAIL,s)
    if m: f=Fraction(m.group(1)); return '%d/%d'%(f.numerator,f.denominator)
    return None
def nums(s):
    s=pre(s); s=re.sub(r'(?<=\d),(?=\d{3}\b)','',s); parts=re.findall(r'-?\d+\s*/\s*\d+|-?(?:\d+\.?\d*|\.\d+)',s); out=[]
    for p in parts:
        n=num(p)
        if n is None: return None
        out.append(n)
    return ';'.join(out) if len(out)>=2 else None
FILL={'it','is','a','an','the','number','numbers','of','to','are','they','and','or'}
def words(s):
    s=pre(s); s=re.sub(r'[^a-z0-9<>=.\-/ ]',' ',s); t=sorted(set(w for w in s.split() if w not in FILL)); return ' '.join(t) if t else None
def letters(s):
    s=pre(s); s=re.sub(r'\b(and|or)\b',' ',s); t=[w for w in re.split(r'[\s,;/&]+',s) if w]
    if t and all(re.match(r'^[a-e][).:]?$',w) for w in t): return ''.join(sorted(set(w[0] for w in t)))
    m=re.match(r'^([a-e])(?:[).:]|\s+(?!=))',s)
    return m.group(1) if m else None
def form(s):
    s=pre(s); s=re.sub(r'(?<=\d),(?=\d{3}\b)','',s); s=re.sub(r'(?<=\d)\s*x\s*(?=10\s*\^)','*',s); s=s.replace('pi','π'); s=re.sub(r'(?<=[\dπ])'+UNIT+'$','',s); s=re.sub(r'\s+','',s)
    s=re.sub(r'(\*10\^-?\d+)[a-z]{2,}$',r'\1',s); s=s.replace('**','^')
    m=re.match(r'^(-?[\d./]+)(<=|>=|<|>)([a-z])$',s)
    if m: s=m.group(3)+{'<':'>','>':'<','<=':'>=','>=':'<='}[m.group(2)]+m.group(1)
    return s or None
def h53(s):                                                              # cyrb53, same as the page
    h1=0xdeadbeef; h2=0x41c6ce57; M=0xFFFFFFFF
    def imul(a,b): return (a*b)&M
    for ch in s.encode('utf-16-le').decode('utf-16-le'):
        c=ord(ch); h1=imul(h1^c,2654435761); h2=imul(h2^c,1597334677)
    h1=imul(h1^(h1>>16),2246822507)^imul(h2^(h2>>13),3266489909); h2=imul(h2^(h2>>16),2246822507)^imul(h1^(h1>>13),3266489909)
    h1&=M; h2&=M
    return format(4294967296*(2097151&h2)+h1,'x')

def classify(c):
    sel=c['sel']; g=c['green']; q=c['q']
    if re.search(r'made a mistake|Explain|explain|Why\?|Justify|Describe|How do you know|Sketch|Draw|Graph |Plot |Write a (story|rule|sentence)|in your own words',q) and not sel: return None
    if sel:
        if all(re.fullmatch(r'[A-E]',s) for s in sel):
            r=('l',''.join(sorted(s.lower() for s in sel)),' '.join(sel)+(' = '+c['opt'][0] if len(sel)==1 and c['opt'] else ''))
            if len(sel)==1 and len(c['opt'])==1:
                o=c['opt'][0]
                if num(o) is not None: return r+(('n',num(o)),)
                f=form(o)
                if f and len(o)<=24 and re.fullmatch(r'[0-9a-zπ^*/().,+\-<>=]+',f) and not re.search(r'[a-z]{2}',f): return r+(('p',f),)
                w=words(o)
                if w and len(o.split())<=3 and re.fullmatch(r'[A-Za-z ]+',o): return r+(('w',w),)
            return r
        if len(sel)==1 and num(sel[0]) is not None and not re.search(r'[a-z]{2}',sel[0].lower()): return ('n',num(sel[0]),sel[0])
        w=words(' '.join(sel)); return ('w',w,' / '.join(sel)) if w else None
    big=[x for x in g if x['size']>=10.4]; frac=[x for x in g if 9.9<=x['size']<10.4]
    if frac and not big:
        if len(frac)==2 and abs((frac[0]['x0']+frac[0]['x1'])-(frac[1]['x0']+frac[1]['x1']))<14 and 8<frac[1]['y']-frac[0]['y']<16:
            t=frac[0]['t']+'/'+frac[1]['t']
            if num(t): return ('n',num(t),t)
            f=form(t); return ('p',f,t) if f and re.fullmatch(r'[0-9a-zπ^*/().\-]+',f) and not re.search(r'[a-z]{2}',f) else None
        return None
    if len(big)!=1 or frac: return None
    t=big[0]['t']
    if num(t) is not None: return ('n',num(t),t)
    if re.fullmatch(r'(Yes|No|True|False|Rational|Irrational|Linear|Nonlinear|Function|Not a function|Positive|Negative|None|No solution|Infinitely many solutions?|One solution)\.?',t,re.I): return ('w',words(t),t)
    if re.fullmatch(r'-?[\d,.]+( [a-z]+)?( and|,) -?[\d,.]+( [a-z]+)?',t) and nums(t): return ('m',nums(t),t)
    f=form(t)
    if f and len(t)<=28 and re.fullmatch(r'[0-9a-zπ^*/().,+\-<>=]+',f) and not re.search(r'[a-z]{2}',f) and re.search(r'[\^<>a-zπ,]',f): return ('p',f,t)
    return None

if __name__=='__main__':
    import pdfplumber
    logging.disable(logging.CRITICAL)
    key=sys.argv[1]; ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    assert not os.path.abspath(key).startswith(ROOT), 'keep the key PDF outside the repo'
    txt=subprocess.run(['pdftotext','-layout',key,'-'],capture_output=True,text=True).stdout.split('\f')
    P=[]
    for pg in pdfplumber.open(key).pages:
        P.append({'chars':[{k:c.get(k) for k in ('text','x0','x1','top','bottom','size','fontname','non_stroking_color')} for c in pg.chars],
                  'shapes':[{k:r.get(k) for k in ('x0','x1','top','bottom','fill','stroke','stroking_color','non_stroking_color')} for r in pg.rects+pg.curves+pg.lines]})
    raw={}
    for i,pg in enumerate(P):
        m=re.search(r'H(?:OMEWORK|omework)\s+([0-9E]+\.\d+)\s*·',txt[i])
        if not m: continue
        for c in cards(pg): raw.setdefault(m.group(1),{})[str(c['num'])]=c
    s=open(os.path.join(ROOT,'grade8','homework_turn_in.html'),encoding='utf-8').read()
    HW=json.loads(re.search(r'var HW = (\[.*?\]);\n',s,re.S).group(1))
    out={}; review={}; stats=collections.Counter()
    for h in HW:
        for p in h['p']:
            c=raw.get(h['id'],{}).get(str(p[0]))
            if not c: stats['not found in key']+=1; continue
            r=classify(c)
            if not r or not r[1]:
                stats['Mr. Allen checks']+=1
                review.setdefault(h['id'],{})[str(p[0])]=['-','',' | '.join(x['t'] for x in c['green'])[:90],c['q'][:70]]; continue
            stats[r[0]]+=1; k='hw|'+h['id']+'|'+str(p[0])+'|'; e=[r[0],h53(k+r[1])]
            for alt in r[3:]: e+=[alt[0],h53(k+alt[1])]
            out.setdefault(h['id'],{})[str(p[0])]=e
            review.setdefault(h['id'],{})[str(p[0])]=[r[0],r[1],r[2],c['q'][:70]]+[list(a) for a in r[3:]]
    open(os.path.join(ROOT,'grade8','homework','check.js'),'w').write('/* Scrambled codes for checking homework answers (no answers here). Made from the private key; see homework-check.js. */\nwindow.HW_CHECK = '+json.dumps(out,separators=(',',':'))+';\n')
    if len(sys.argv)>2:
        assert not os.path.abspath(sys.argv[2]).startswith(ROOT), 'the review file has readable answers: keep it outside the repo'
        json.dump(review,open(sys.argv[2],'w'),ensure_ascii=False)
    print(dict(stats))
