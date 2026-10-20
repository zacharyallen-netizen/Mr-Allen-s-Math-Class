import re, zipfile, docx, glob
from fractions import Fraction as F
from decimal import Decimal as D
D_ = '/home/claude/mr-allen-s-math-class/grade8/Fluency-Lab-Package/module-materials/Module-5-Decimals/'
files = sorted(f for f in glob.glob(D_ + '*.docx') if 'Routine' not in f)
bad_words = re.compile(r'\b(miles?|pens?|recipe|cost|price|dollars?|cents?|store|buy|bought|sold|students? (?:has|have)|people|apples|pizza|km|kg|cm|meters?|feet|inch(?:es)?|hours?|minutes?)\b|\$', re.I)
for f in files:
    d = docx.Document(f)  # opens?
    with zipfile.ZipFile(f) as z:
        xml = ''.join(z.read(n).decode() for n in z.namelist() if n.startswith('word/') and n.endswith('.xml') and ('document' in n or 'footer' in n or 'header' in n))
    text = ' '.join(re.findall(r'<w:t[^>]*>([^<]*)</w:t>', xml)).replace('\xa0', ' ')
    sl = re.findall(r'[0-9A-Za-z]\s*/\s*[0-9A-Za-z]', text)
    bw = bad_words.findall(text)
    print(f.split('/')[-1], '| opens OK | slash patterns:', sl, '| word-problem words:', [w for w in bw if any(w)])
# answers
probs = [
 ('Mixed 1) 3.4 + 5.9', D('3.4') + D('5.9'), D('9.3')),
 ('Mixed 2) 0.75 = __ %', D('0.75') * 100, D('75')),
 ('Mixed 3) 25% of 60', D('0.25') * 60, D('15')),
 ('Mixed 4) 7.2 - 3.85', D('7.2') - D('3.85'), D('3.35')),
 ('Mixed 5) 3/4 as decimal', D(3) / D(4), D('0.75')),
 ('Mixed 6) 0.5 x 8', D('0.5') * 8, D('4')),
 ('Warm 1/2 + 1/3', F(1,2) + F(1,3), F(5,6)),
 ('Warm 2/3 x 3/4', F(2,3) * F(3,4), F(1,2)),
 ('Warm 5/6 - 1/4', F(5,6) - F(1,4), F(7,12)),
 ('Warm 3/4 / 1/2', F(3,4) / F(1,2), F(3,2)),
 ('Mistake 3.5 + 12', D('3.5') + 12, D('15.5')),
 ('Mistake wrong work: digits aligned right 35+12 -> 4.7', D(35 + 12) / 10, D('4.7')),
 ('Refresher 4.30 + 1.19', D('4.30') + D('1.19'), D('5.49')),
 ('Refresher 0.6 x 7 (6x7=42)', D('0.6') * 7, D('4.2')),
 ('Guided A 3.6 + 2.45', D('3.6') + D('2.45'), D('6.05')),
 ('Guided B 7.2 - 1.85', D('7.2') - D('1.85'), D('5.35')),
 ('Guided C 0.7 x 6 (7x6=42)', D('0.7') * 6, D('4.2')),
 ('Light worked 7.20 - 1.85', D('7.20') - D('1.85'), D('5.35')),
 ('Light worked 0.8 x 7', D('0.8') * 7, D('5.6')),
 ('Light try 2.6 + 3.45', D('2.6') + D('3.45'), D('6.05')),
 ('Light try 6.1 - 2.75', D('6.1') - D('2.75'), D('3.35')),
 ('Light try 0.9 x 6', D('0.9') * 6, D('5.4')),
 ('OYO 1) 4.5 + 3.7', D('4.5') + D('3.7'), D('8.2')),
 ('OYO 2) 9.2 - 4.8', D('9.2') - D('4.8'), D('4.4')),
 ('OYO 3) 0.6 x 8', D('0.6') * 8, D('4.8')),
 ('OYO 4) 12.4 + 5.75', D('12.4') + D('5.75'), D('18.15')),
 ('OYO 5) 8.3 - 2.95', D('8.3') - D('2.95'), D('5.35')),
 ('OYO 6) 1.5 x 7', D('1.5') * 7, D('10.5')),
]
for name, got, exp in probs:
    print('OK ' if got == exp else 'BAD', name, '=', exp)
