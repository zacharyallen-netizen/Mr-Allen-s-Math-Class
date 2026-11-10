/* unit6-notes-slope: similar problems for notes-flow.js. Built by _build/notes_twins/build.py — edit there, not here. */
window.NOTE_TWINS = {
"np1-1": {
"p": "In y = mx + b, what does the letter b stand for?",
"choices": [
"the slope",
"the y-intercept",
"the x-value"
],
"a": "the y-intercept",
"sol": "In y = mx + b, b is the y-intercept: where the line crosses the y-axis. (m is the slope.)"
},
"np1-2": {
"p": "What is the slope of y = −3x + 5? Type just the number.",
"a": "-3",
"show": "−3",
"sol": "Match it to y = mx + b. The number in front of x is m, so m = −3. (5 is b, the y-intercept.)"
},
"np1-3": {
"p": "This hill goes right 5 and up 2. If you walk right 20 on the same hill, how far up do you climb?",
"a": "8",
"show": "8",
"fig": "<div class=\"graph-area geo-fig\"><div class=\"geo\" data-geo='{\"type\": \"plane\", \"xmin\": -1, \"xmax\": 11, \"ymin\": -1, \"ymax\": 6, \"size\": 210, \"labelEvery\": 2, \"maxW\": 280, \"lines\": [{\"p\": [0, 1], \"q\": [10, 5], \"c\": \"blue\"}], \"slopeTri\": {\"p\": [0, 1], \"q\": [5, 3]}, \"alt\": \"a hill line that goes right 5 and up 2\"}'></div></div>",
"sol": "Right 20 is 4 groups of right 5. Each group climbs 2. So you climb 2 + 2 + 2 + 2 = 8. The slope stays the same: 2/5 = 8/20."
},
"np2-1": {
"p": "What type of slope does this line have?",
"choices": [
"Positive",
"Negative",
"Zero",
"Undefined"
],
"a": "Positive",
"fig": "<div class=\"graph-area geo-fig\"><div class=\"geo\" data-geo='{\"type\": \"plane\", \"xmin\": -5, \"xmax\": 5, \"ymin\": -5, \"ymax\": 5, \"size\": 170, \"labelEvery\": 5, \"maxW\": 220, \"lines\": [{\"p\": [-4, -2], \"q\": [4, 3], \"c\": \"navy\"}], \"alt\": \"a line going up from left to right\"}'></div></div>",
"sol": "Reading left to right, the line goes up (uphill). So the slope is positive."
},
"np2-2": {
"p": "A line goes through (3, 1) and (3, 5). What type of slope does it have?",
"choices": [
"Positive",
"Negative",
"Zero",
"Undefined"
],
"a": "Undefined",
"fig": "<div class=\"graph-area geo-fig\"><div class=\"geo\" data-geo='{\"type\": \"plane\", \"xmin\": -1, \"xmax\": 6, \"ymin\": -1, \"ymax\": 6, \"size\": 190, \"labelEvery\": 1, \"maxW\": 250, \"points\": [{\"x\": 3, \"y\": 1, \"label\": \"(3, 1)\", \"pos\": \"e\", \"c\": \"blue\"}, {\"x\": 3, \"y\": 5, \"label\": \"(3, 5)\", \"pos\": \"e\", \"c\": \"blue\"}], \"alt\": \"the points (3, 1) and (3, 5) on a grid\"}'></div></div>",
"sol": "Both points have x = 3, so the line goes straight up and down (vertical). The run is 0, and we can’t divide by 0. The slope is undefined."
},
"np2-3": {
"p": "Which equation has a positive slope?",
"choices": [
"y = −4x + 1",
"y = −x − 3",
"y = 2x − 6",
"y = −5x"
],
"a": "y = 2x − 6",
"sol": "The slope is the number in front of x: −4, −1, 2 and −5. Only 2 is positive, so y = 2x − 6 goes uphill."
},
"np3-1": {
"p": "Count the rise and the run from one dot to the other. What is the slope?",
"a": "3",
"show": "3",
"fig": "<div class=\"graph-area geo-fig\"><div class=\"geo\" data-geo='{\"type\": \"plane\", \"xmin\": -2, \"xmax\": 6, \"ymin\": -1, \"ymax\": 8, \"size\": 210, \"labelEvery\": 1, \"maxW\": 280, \"points\": [{\"x\": 1, \"y\": 1, \"label\": \"(1, 1)\", \"pos\": \"w\", \"c\": \"blue\"}, {\"x\": 3, \"y\": 7, \"label\": \"(3, 7)\", \"pos\": \"n\", \"c\": \"blue\"}], \"alt\": \"the points (1, 1) and (3, 7)\", \"lines\": [{\"p\": [1, 1], \"q\": [3, 7], \"c\": \"blue\"}], \"segments\": [{\"p\": [1, 1], \"q\": [3, 1], \"c\": \"green\", \"dash\": \"6 4\", \"label\": \"run = ?\", \"dy\": 16}, {\"p\": [3, 1], \"q\": [3, 7], \"c\": \"gold\", \"dash\": \"6 4\", \"label\": \"rise = ?\", \"dx\": 34, \"dy\": 4}]}'></div></div>",
"sol": "Rise: up 6 (from y = 1 to y = 7). Run: right 2 (from x = 1 to x = 3). Slope = 6/2 = 3."
},
"np3-2": {
"p": "Find the slope of this line. Use the two dots.",
"a": "-3",
"show": "−3",
"fig": "<div class=\"graph-area geo-fig\"><div class=\"geo\" data-geo='{\"type\": \"plane\", \"xmin\": -3, \"xmax\": 5, \"ymin\": -1, \"ymax\": 8, \"size\": 210, \"labelEvery\": 1, \"maxW\": 280, \"points\": [{\"x\": 0, \"y\": 7, \"label\": \"(0, 7)\", \"pos\": \"w\", \"c\": \"blue\"}, {\"x\": 2, \"y\": 1, \"label\": \"(2, 1)\", \"pos\": \"s\", \"c\": \"blue\"}], \"alt\": \"the points (0, 7) and (2, 1)\", \"lines\": [{\"p\": [0, 7], \"q\": [2, 1], \"c\": \"blue\"}]}'></div></div>",
"sol": "From (0, 7), count down 6 to y = 1: rise = −6. Then right 2: run = 2. Slope = −6/2 = −3."
},
"np3-3": {
"p": "Find the slope of this line. Write it as a fraction in simplest form, like 3/4.",
"a": "3/4|0.75",
"show": "3/4",
"tol": 0.01,
"fig": "<div class=\"graph-area geo-fig\"><div class=\"geo\" data-geo='{\"type\": \"plane\", \"xmin\": -3, \"xmax\": 3, \"ymin\": -3, \"ymax\": 2, \"size\": 210, \"labelEvery\": 1, \"maxW\": 280, \"points\": [{\"x\": -2, \"y\": -2, \"label\": \"(−2, −2)\", \"pos\": \"w\", \"c\": \"blue\"}, {\"x\": 2, \"y\": 1, \"label\": \"(2, 1)\", \"pos\": \"n\", \"c\": \"blue\"}], \"alt\": \"the points (−2, −2) and (2, 1)\", \"lines\": [{\"p\": [-2, -2], \"q\": [2, 1], \"c\": \"blue\"}]}'></div></div>",
"sol": "Rise: up 3 (from −2 to 1). Run: right 4 (from −2 to 2). Slope = 3/4."
},
"np4-1": {
"p": "Use the slope formula to find the slope through (2, 1) and (4, 9).",
"a": "4",
"show": "4",
"fig": "<div class=\"graph-area geo-fig\"><div class=\"geo\" data-geo='{\"type\": \"plane\", \"xmin\": -3, \"xmax\": 7, \"ymin\": -1, \"ymax\": 10, \"size\": 210, \"labelEvery\": 1, \"maxW\": 280, \"points\": [{\"x\": 2, \"y\": 1, \"label\": \"(2, 1)\", \"pos\": \"w\", \"c\": \"blue\"}, {\"x\": 4, \"y\": 9, \"label\": \"(4, 9)\", \"pos\": \"n\", \"c\": \"blue\"}], \"alt\": \"the points (2, 1) and (4, 9)\"}'></div></div>",
"sol": "m = <span class=\"frac-inline\"><span class=\"fn\">9 − 1</span><span class=\"fb\"></span><span class=\"fd\">4 − 2</span></span> = <span class=\"frac-inline\"><span class=\"fn\">8</span><span class=\"fb\"></span><span class=\"fd\">2</span></span> = 4."
},
"np4-2": {
"p": "Find the slope through (−3, 2) and (3, −2). Write a fraction in simplest form.",
"a": "-2/3",
"show": "−2/3",
"tol": 0.01,
"fig": "<div class=\"graph-area geo-fig\"><div class=\"geo\" data-geo='{\"type\": \"plane\", \"xmin\": -4, \"xmax\": 4, \"ymin\": -3, \"ymax\": 3, \"size\": 210, \"labelEvery\": 1, \"maxW\": 280, \"points\": [{\"x\": -3, \"y\": 2, \"label\": \"(−3, 2)\", \"pos\": \"w\", \"c\": \"blue\"}, {\"x\": 3, \"y\": -2, \"label\": \"(3, −2)\", \"pos\": \"s\", \"c\": \"blue\"}], \"alt\": \"the points (−3, 2) and (3, −2)\"}'></div></div>",
"sol": "m = <span class=\"frac-inline\"><span class=\"fn\">−2 − 2</span><span class=\"fb\"></span><span class=\"fd\">3 − (−3)</span></span> = <span class=\"frac-inline\"><span class=\"fn\">−4</span><span class=\"fb\"></span><span class=\"fd\">6</span></span>. Simplify: −2/3."
},
"np4-3": {
"p": "A line goes through (1, 2) and (5, y). Its slope is 3. What is y?",
"a": "14",
"show": "14",
"sol": "Run: 5 − 1 = 4. Slope 3 means rise ÷ 4 = 3, so the rise is 12. y = 2 + 12 = 14. Check: (14 − 2)/(5 − 1) = 12/4 = 3 ✓"
},
"np5-1": {
"p": "What does the y-intercept tell you?",
"choices": [
"Where a line crosses the y-axis",
"How steep a line is",
"How long a line is"
],
"a": "Where a line crosses the y-axis",
"sol": "The y-intercept (b) is where the line crosses the y-axis, at (0, b). How steep the line is, is the slope."
},
"p1": {
"p": "Find the slope through (2, 1) and (5, 10).",
"a": "3",
"show": "3",
"fig": "<div class=\"graph-area geo-fig\"><div class=\"geo\" data-geo='{\"type\": \"plane\", \"xmin\": -2, \"xmax\": 8, \"ymin\": -1, \"ymax\": 11, \"size\": 210, \"labelEvery\": 2, \"maxW\": 280, \"points\": [{\"x\": 2, \"y\": 1, \"label\": \"(2, 1)\", \"pos\": \"w\", \"c\": \"blue\"}, {\"x\": 5, \"y\": 10, \"label\": \"(5, 10)\", \"pos\": \"n\", \"c\": \"blue\"}], \"alt\": \"the points (2, 1) and (5, 10)\", \"segments\": [{\"p\": [2, 1], \"q\": [5, 1], \"c\": \"green\", \"dash\": \"6 4\", \"label\": \"run = ?\", \"dy\": 16}, {\"p\": [5, 1], \"q\": [5, 10], \"c\": \"gold\", \"dash\": \"6 4\", \"label\": \"rise = ?\", \"dx\": 34, \"dy\": 4}]}'></div></div>",
"sol": "m = <span class=\"frac-inline\"><span class=\"fn\">10 − 1</span><span class=\"fb\"></span><span class=\"fd\">5 − 2</span></span> = <span class=\"frac-inline\"><span class=\"fn\">9</span><span class=\"fb\"></span><span class=\"fd\">3</span></span> = 3."
},
"p2": {
"p": "Find the slope through (1, 9) and (3, 3).",
"a": "-3",
"show": "−3",
"fig": "<div class=\"graph-area geo-fig\"><div class=\"geo\" data-geo='{\"type\": \"plane\", \"xmin\": -3, \"xmax\": 7, \"ymin\": -1, \"ymax\": 10, \"size\": 210, \"labelEvery\": 2, \"maxW\": 280, \"points\": [{\"x\": 1, \"y\": 9, \"label\": \"(1, 9)\", \"pos\": \"w\", \"c\": \"blue\"}, {\"x\": 3, \"y\": 3, \"label\": \"(3, 3)\", \"pos\": \"s\", \"c\": \"blue\"}], \"alt\": \"the points (1, 9) and (3, 3)\", \"segments\": [{\"p\": [1, 9], \"q\": [3, 9], \"c\": \"green\", \"dash\": \"6 4\", \"label\": \"run = ?\", \"dy\": 16}, {\"p\": [3, 9], \"q\": [3, 3], \"c\": \"gold\", \"dash\": \"6 4\", \"label\": \"rise = ?\", \"dx\": 34, \"dy\": 4}]}'></div></div>",
"sol": "m = <span class=\"frac-inline\"><span class=\"fn\">3 − 9</span><span class=\"fb\"></span><span class=\"fd\">3 − 1</span></span> = <span class=\"frac-inline\"><span class=\"fn\">−6</span><span class=\"fb\"></span><span class=\"fd\">2</span></span> = −3."
},
"p3": {
"p": "Find the slope through (−3, −2) and (3, 2). If the answer is a fraction, type it as a/b (like 3/4).",
"a": "2/3",
"show": "2/3",
"fig": "<div class=\"graph-area geo-fig\"><div class=\"geo\" data-geo='{\"type\": \"plane\", \"xmin\": -4, \"xmax\": 5, \"ymin\": -3, \"ymax\": 3, \"size\": 210, \"labelEvery\": 2, \"maxW\": 280, \"points\": [{\"x\": -3, \"y\": -2, \"label\": \"(−3, −2)\", \"pos\": \"w\", \"c\": \"blue\"}, {\"x\": 3, \"y\": 2, \"label\": \"(3, 2)\", \"pos\": \"n\", \"c\": \"blue\"}], \"alt\": \"the points (−3, −2) and (3, 2)\", \"segments\": [{\"p\": [-3, -2], \"q\": [3, -2], \"c\": \"green\", \"dash\": \"6 4\", \"label\": \"run = ?\", \"dy\": 16}, {\"p\": [3, -2], \"q\": [3, 2], \"c\": \"gold\", \"dash\": \"6 4\", \"label\": \"rise = ?\", \"dx\": 34, \"dy\": 4}]}'></div></div>",
"sol": "m = <span class=\"frac-inline\"><span class=\"fn\">2 − (−2)</span><span class=\"fb\"></span><span class=\"fd\">3 − (−3)</span></span> = <span class=\"frac-inline\"><span class=\"fn\">4</span><span class=\"fb\"></span><span class=\"fd\">6</span></span>. Simplify: 2/3."
},
"p5": {
"p": "Find the slope through (−3, 5) and (4, 5). Type “undefined” if the slope is undefined.",
"a": "0",
"show": "0",
"fig": "<div class=\"graph-area geo-fig\"><div class=\"geo\" data-geo='{\"type\": \"plane\", \"xmin\": -4, \"xmax\": 6, \"ymin\": -1, \"ymax\": 6, \"size\": 210, \"labelEvery\": 2, \"maxW\": 280, \"points\": [{\"x\": -3, \"y\": 5, \"label\": \"(−3, 5)\", \"pos\": \"w\", \"c\": \"blue\"}, {\"x\": 4, \"y\": 5, \"label\": \"(4, 5)\", \"pos\": \"s\", \"c\": \"blue\"}], \"alt\": \"the points (−3, 5) and (4, 5)\", \"segments\": [{\"p\": [-3, 5], \"q\": [4, 5], \"c\": \"green\", \"dash\": \"6 4\", \"label\": \"run = ?\", \"dy\": 16}]}'></div></div>",
"sol": "m = <span class=\"frac-inline\"><span class=\"fn\">5 − 5</span><span class=\"fb\"></span><span class=\"fd\">4 − (−3)</span></span> = <span class=\"frac-inline\"><span class=\"fn\">0</span><span class=\"fb\"></span><span class=\"fd\">7</span></span> = 0."
},
"p6": {
"p": "Find the slope through (3, −2) and (3, 6). Type “undefined” if the slope is undefined.",
"a": "undefined",
"show": "undefined",
"fig": "<div class=\"graph-area geo-fig\"><div class=\"geo\" data-geo='{\"type\": \"plane\", \"xmin\": -2, \"xmax\": 6, \"ymin\": -3, \"ymax\": 7, \"size\": 210, \"labelEvery\": 2, \"maxW\": 280, \"points\": [{\"x\": 3, \"y\": -2, \"label\": \"(3, −2)\", \"pos\": \"w\", \"c\": \"blue\"}, {\"x\": 3, \"y\": 6, \"label\": \"(3, 6)\", \"pos\": \"e\", \"c\": \"blue\"}], \"alt\": \"the points (3, −2) and (3, 6)\", \"segments\": [{\"p\": [3, -2], \"q\": [3, 6], \"c\": \"gold\", \"dash\": \"6 4\", \"label\": \"rise = ?\", \"dx\": 34, \"dy\": 4}]}'></div></div>",
"sol": "m = <span class=\"frac-inline\"><span class=\"fn\">6 − (−2)</span><span class=\"fb\"></span><span class=\"fd\">3 − 3</span></span> = <span class=\"frac-inline\"><span class=\"fn\">8</span><span class=\"fb\"></span><span class=\"fd\">0</span></span>. We can't divide by 0, so the slope is undefined (a vertical line)."
},
"np5-3": {
"p": "Mia says, “A horizontal line has an undefined slope.” Is Mia right?",
"choices": [
"Yes, a horizontal line has an undefined slope",
"No, a horizontal line has a slope of 0",
"No, a horizontal line has a positive slope"
],
"a": "No, a horizontal line has a slope of 0",
"sol": "No. A horizontal (flat) line has rise = 0, and 0 ÷ run = 0. So its slope is 0. A vertical line is the one with an undefined slope."
},
"np5-5": {
"p": "What is the slope of this line? Write a fraction, like 1/2.",
"a": "-3/5|-0.6",
"show": "−3/5",
"fig": "<div class=\"graph-area geo-fig\"><div class=\"geo\" data-geo='{\"type\": \"plane\", \"xmin\": -1, \"xmax\": 6, \"ymin\": -3, \"ymax\": 2, \"size\": 210, \"labelEvery\": 1, \"maxW\": 280, \"points\": [{\"x\": 0, \"y\": 1, \"label\": \"(0, 1)\", \"pos\": \"w\", \"c\": \"blue\"}, {\"x\": 5, \"y\": -2, \"label\": \"(5, −2)\", \"pos\": \"s\", \"c\": \"blue\"}], \"alt\": \"the points (0, 1) and (5, −2)\", \"lines\": [{\"p\": [0, 1], \"q\": [5, -2], \"c\": \"blue\"}]}'></div></div>",
"sol": "Rise: down 3 (from 1 to −2), so rise = −3. Run: right 5 (from 0 to 5). Slope = −3/5."
},
"np5-10": {
"p": "A ramp rises 3 feet over a run of 12 feet. What is its slope? Write a fraction in simplest form.",
"a": "1/4|0.25|3/12",
"show": "1/4",
"fig": "<div class=\"graph-area geo-fig\"><div class=\"geo\" data-geo='{\"type\": \"righttri\", \"a\": 12, \"b\": 3, \"unitPx\": 14, \"labels\": {\"a\": \"run = 12 ft\", \"b\": \"rise = 3 ft\", \"c\": \"ramp\"}, \"maxW\": 260, \"alt\": \"a ramp: a right triangle with a run of 12 feet and a rise of 3 feet\"}'></div></div>",
"sol": "slope = rise/run = 3/12. Divide top and bottom by 3: 1/4."
},
"np5-11": {
"p": "A line goes through (2, 1) and (x, 9). Its slope is 4. What is x?",
"a": "4",
"show": "4",
"sol": "Rise: 9 − 1 = 8. Slope 4 means 8 ÷ run = 4, so the run is 2. x = 2 + 2 = 4. Check: (9 − 1)/(4 − 2) = 8/2 = 4 ✓"
}
};
