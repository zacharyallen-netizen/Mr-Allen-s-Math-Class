from playwright.sync_api import sync_playwright
import sys
OUT='/home/claude/mr-allen-s-math-class/_build/fluency_review/add-subtract/'
files={'new':'file:///home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/fluency-lab/fluency-lab-add-subtract.html',
       'orig':'file://'+OUT+'original.html'}
with sync_playwright() as pw:
    br=pw.chromium.launch()
    for name,url in files.items():
      for rm in ('no-preference','reduce'):
        pg=br.new_page(viewport={'width':390,'height':844}, reduced_motion=rm)
        pg.goto(url); pg.click('#start button.btn')
        pg.evaluate("()=>{level=6;index=0;current=mk(400,163,'-');renderProblem();}")
        pg.click('#go'); pg.wait_for_function("()=>M.i>0 && !M.busy", timeout=15000); pg.wait_for_timeout(800)
        pg.screenshot(path=OUT+f'strike-{name}-{rm}.png', clip={'x':0,'y':150,'width':390,'height':380})
        pg.close()
    br.close()
