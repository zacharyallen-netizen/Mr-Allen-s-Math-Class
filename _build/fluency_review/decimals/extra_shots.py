from playwright.sync_api import sync_playwright
URL='file:///home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/fluency-lab/fluency-lab-decimals.html'
OUT='/home/claude/mr-allen-s-math-class/_build/fluency_review/decimals/shots'
def adv(pg, until):
    while pg.evaluate(until)==False:
        i=pg.evaluate("M.i")
        if pg.evaluate("M.mv[M.i].kind")=='tap': pg.click('#go')
        else: pg.fill('#box', pg.evaluate("String(+(+M.mv[M.i].expect).toFixed(6))")); pg.click('#go')
        pg.wait_for_function(f"M.i>{i} && !M.busy")
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':900}); pg.goto(URL)
    pg.click('#start button.btn'); pg.evaluate("FAST=true")
    pg.evaluate("current={kind:'sub',a:5.03,b:2.47,ans:2.56,display:`5.03${sp('−')}2.47`}; renderProblem()")
    adv(pg,"M.mv[M.i].button==='Borrow'"); pg.screenshot(path=OUT+'/30-sub-borrow-tap.png')
    i0=pg.evaluate("M.i"); pg.click("#go"); pg.wait_for_function(f"M.i>{i0} && !M.busy"); pg.screenshot(path=OUT+'/31-sub-after-borrow.png')
    print(pg.text_content('#msg'))
    pg.evaluate("current={kind:'f2r',fn:1,fd:6,display:`${FRC(1,6)} <span class=\"lbl\">as a decimal</span>`}; renderProblem()")
    adv(pg,"M.mv[M.i].key==='rep'"); pg.screenshot(path=OUT+'/32-f2r-1over6-repeats.png')
    pg.evaluate("current={kind:'f2d',fn:3,fd:8,ans:0.375,display:`${FRC(3,8)} <span class=\"lbl\">as a decimal</span>`}; renderProblem()")
    adv(pg,"M.mv[M.i].key==='q1'"); pg.screenshot(path=OUT+'/33-f2d-3over8-row2.png')
    print(pg.evaluate("document.querySelectorAll('#fwork .wl').length"), 'lines on screen at row 2')
    b.close()
