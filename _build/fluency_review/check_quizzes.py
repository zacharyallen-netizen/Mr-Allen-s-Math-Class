import json
from playwright.sync_api import sync_playwright
D='file:///home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/fluency-lab/'
N=['add-subtract','multiply','divide','fractions','decimals','integers','ratios','expressions']
IGN=('fonts.g','ERR_TUNNEL','Failed to load resource','net::ERR')
bad=0
with sync_playwright() as pw:
    b=pw.chromium.launch()
    for w in (390,1280):
        for n in N:
            p=b.new_page(viewport={'width':w,'height':900}); errs=[]
            p.on('pageerror',lambda e:errs.append(str(e)))
            p.on('console',lambda m: m.type=='error' and not any(x in m.text for x in IGN) and errs.append(m.text))
            p.goto(D+f'quiz-{n}.html'); p.wait_for_timeout(200)
            nq=p.evaluate('Q.length')
            # answer all right
            p.evaluate("Q.forEach((q,i)=>document.querySelector(`.opt[data-q='${i}'][data-o='${q[2]}']`).click())")
            p.click('#checkbtn'); p.wait_for_timeout(100)
            sc=p.inner_text('#score'); plan=p.inner_text('#plan') if p.locator('#plan').count() else ''
            ok1=sc.startswith(f'{nq} of {nq}') and 'Nothing to fix' in plan
            # all wrong
            p.click('#againbtn'); p.wait_for_timeout(100)
            p.evaluate("Q.forEach((q,i)=>document.querySelector(`.opt[data-q='${i}'][data-o='${(q[2]+1)%q[1].length}']`).click())")
            p.click('#checkbtn'); p.wait_for_timeout(100)
            sc2=p.inner_text('#score'); plan2=p.inner_text('#plan')
            fbs=p.evaluate("[...document.querySelectorAll('.fb.show')].length")
            hs=p.evaluate('document.documentElement.scrollWidth>innerWidth+1')
            words=p.evaluate("Q.map(q=>q[0].replace(/<[^>]+>/g,' ')).filter(t=>/[a-z]{4,}/i.test(t.replace(/Simplify|Write|as a|percent|decimal|improper|fraction|mixed|number/g,'')))")
            slash=p.evaluate("/[0-9?x]\\s*\\/\\s*[0-9?x]/.test(document.body.innerText)")
            words=words+(['SLASH FRACTION'] if slash else [])
            good=ok1 and sc2.startswith(f'0 of {nq}') and fbs==nq and 'Practice Level' in plan2 and not hs and not errs and not words
            if not good: bad+=1
            print(w,n,'OK' if good else 'BAD',nq,'|',sc.split('.')[0],'|',sc2.split('.')[0],'| hs',hs,'| words',words,'|',errs[:2])
            if w==390 and n in('fractions','ratios'): p.screenshot(path=f'quizshots/{n}_390.png',full_page=False)
            p.close()
    b.close()
print('BAD',bad)
