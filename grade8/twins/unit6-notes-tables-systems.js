/* unit6-notes-tables-systems: similar problems for notes-flow.js. Built by _build/notes_twins/build.py — edit there, not here. */
window.NOTE_TWINS = {
"np1-1": {
"p": "What is the slope <strong>m</strong> of this table? Type just the number.",
"fig": "<table class=\"xy-table\"><tr><th>x</th><th>y</th></tr><tr><td>0</td><td>4</td></tr><tr><td>1</td><td>7</td></tr><tr><td>2</td><td>10</td></tr><tr><td>3</td><td>13</td></tr></table>",
"a": "3",
"show": "3",
"sol": "Each time x goes up 1, y goes up 3 (4 → 7 → 10 → 13). So m = 3 ÷ 1 = 3."
},
"np1-2": {
"p": "Write the equation for this table in the form y = mx + b.",
"fig": "<table class=\"xy-table\"><tr><th>x</th><th>y</th></tr><tr><td>0</td><td>8</td></tr><tr><td>1</td><td>5</td></tr><tr><td>2</td><td>2</td></tr><tr><td>3</td><td>−1</td></tr></table>",
"a": "y=-3x+8|-3x+8|y=8-3x|8-3x",
"show": "y = −3x + 8",
"ph": "y = mx + b",
"sol": "Slope: y changes by −3 each time x goes up 1, so m = −3. When x = 0, y = 8, so b = 8. Equation: y = −3x + 8."
},
"np1-3": {
"p": "This table has no x = 0 row. Find <strong>b</strong>, the y-intercept. Type just the number.",
"fig": "<table class=\"xy-table\"><tr><th>x</th><th>y</th></tr><tr><td>2</td><td>−3</td></tr><tr><td>4</td><td>1</td></tr><tr><td>6</td><td>5</td></tr><tr><td>8</td><td>9</td></tr></table>",
"a": "-7",
"show": "b = −7",
"sol": "m: y goes up 4 when x goes up 2, so m = 4 ÷ 2 = 2. Work backward from (2, −3): x goes back 2 to 0, so y drops 2 × 2 = 4. −3 − 4 = −7. Equation: y = 2x − 7."
},
"np2-1": {
"p": "Where do the two lines cross? Type the ordered pair, like (2, 3).",
"fig": "<div class=\"graph-wrap\"><div class=\"pfig\" style=\"margin:0 auto\" data-geo='{\"type\": \"plane\", \"xmin\": -6, \"xmax\": 6, \"ymin\": -6, \"ymax\": 6, \"size\": 228, \"lines\": [{\"m\": 1.0, \"b\": 2.0, \"c\": \"navy\"}, {\"m\": -2.0, \"b\": -4.0, \"c\": \"gold\"}], \"alt\": \"y = x + 2 and y = −2x − 4\"}'></div><div class=\"pfig-legend\"><span><i style=\"border-top:3px solid #1E2D4F\"></i>y = x + 2</span><span><i style=\"border-top:3px solid #B45309\"></i>y = −2x − 4</span></div></div>",
"a": "(-2,0)|-2,0",
"show": "(−2, 0)",
"ph": "(x, y)",
"sol": "The lines cross at (−2, 0). Check: −2 + 2 = 0 ✓ and −2(−2) − 4 = 0 ✓."
},
"np2-2": {
"p": "Graph both lines on the grid. Where do they cross? Type the ordered pair.",
"fig": "<div class=\"graph-wrap\"><div class=\"pfig\" style=\"margin:0 auto\" data-geo='{\"type\": \"plane\", \"xmin\": -6, \"xmax\": 6, \"ymin\": -6, \"ymax\": 6, \"size\": 228, \"lines\": [], \"alt\": \"empty grid for graphing y = 3x − 2 and y = −x + 6\"}'></div><div class=\"pfig-legend\"><span><i style=\"border-top:3px solid #1E2D4F\"></i>y = 3x − 2</span><span><i style=\"border-top:3px solid #B45309\"></i>y = −x + 6</span></div></div>",
"a": "(2,4)|2,4",
"show": "(2, 4)",
"ph": "(x, y)",
"sol": "y = 3x − 2: start at (0, −2), then up 3, right 1. y = −x + 6: start at (0, 6), then down 1, right 1. They cross at (2, 4). Check: 3(2) − 2 = 4 ✓ and −2 + 6 = 4 ✓."
},
"np2-3": {
"p": "Which system has <strong>infinitely many solutions</strong>?",
"choices": [
"y = 3x + 2 and y = 3x − 1",
"y = 2x + 4 and y = 2x + 4",
"y = x − 2 and y = −x − 2"
],
"a": "y = 2x + 4 and y = 2x + 4",
"sol": "First: same slope 3, different y-intercepts → parallel → no solution. Second: the same line twice → infinitely many. Third: slopes 1 and −1 are different → one solution."
},
"np3-1": {
"p": "Does the point <strong>(4, 7)</strong> make <strong>y = 2x − 1</strong> true?",
"choices": [
"Yes",
"No"
],
"a": "Yes",
"fig": "<div class=\"pfig\" style=\"margin:0 auto\" data-fig='{\"type\":\"machine\",\"lab\":\"put in x = 4\",\"inp\":\"x = 4\",\"rule\":\"2x − 1\",\"out\":\"y = ?\",\"cmp\":\"is it 7?\",\"alt\":\"Put x = 4 into 2x − 1. Is the output 7?\"}'></div>",
"sol": "2(4) − 1 = 8 − 1 = 7. That matches y = 7, so yes ✓."
},
"np3-2": {
"p": "Is <strong>(2, 2)</strong> a solution of this system?",
"choices": [
"Yes",
"No"
],
"a": "No",
"fig": "<div class=\"system-eqs\"><div class=\"eq-line\"><span class=\"eq-tag\">EQ 1</span><span>y = 3x − 4</span></div><div class=\"eq-line\"><span class=\"eq-tag\">EQ 2</span><span>y = −x + 6</span></div></div><div class=\"graph-wrap\"><div class=\"pfig\" style=\"margin:0 auto\" data-geo='{\"type\": \"plane\", \"xmin\": -1, \"xmax\": 6, \"ymin\": -3, \"ymax\": 7, \"size\": 228, \"lines\": [{\"m\": 3.0, \"b\": -4.0, \"c\": \"navy\"}, {\"m\": -1.0, \"b\": 6.0, \"c\": \"gold\"}], \"alt\": \"y = 3x − 4 and y = −x + 6 with the point (2, 2)\", \"points\": [{\"x\": 2, \"y\": 2, \"c\": \"red\", \"r\": 6, \"label\": \"(2, 2)\", \"pos\": \"nw\"}]}'></div><div class=\"pfig-legend\"><span><i style=\"border-top:3px solid #1E2D4F\"></i>y = 3x − 4</span><span><i style=\"border-top:3px solid #B45309\"></i>y = −x + 6</span></div></div>",
"sol": "EQ 1: 3(2) − 4 = 2 ✓ true. EQ 2: −(2) + 6 = 4, but y is 2 ✗. It fails EQ 2, so no, (2, 2) is not a solution."
},
"np3-3": {
"p": "Which point is the solution of this system?",
"choices": [
"(1, 4)",
"(2, 5)",
"(4, 7)",
"(5, 8)"
],
"a": "(2, 5)",
"fig": "<div class=\"system-eqs\"><div class=\"eq-line\"><span class=\"eq-tag\">EQ 1</span><span>y = x + 3</span></div><div class=\"eq-line\"><span class=\"eq-tag\">EQ 2</span><span>y = 2x + 1</span></div></div>",
"sol": "All four points work in EQ 1. Now test EQ 2: 2(1) + 1 = 3 ✗, 2(2) + 1 = 5 ✓, 2(4) + 1 = 9 ✗, 2(5) + 1 = 11 ✗. Only (2, 5) works in both."
},
"np4-1": {
"p": "Solve for x. Type just the x-value.",
"fig": "<div class=\"system-eqs\"><div class=\"eq-line\"><span class=\"eq-tag\">EQ 1</span><span>y = 3x</span></div><div class=\"eq-line\"><span class=\"eq-tag\">EQ 2</span><span>x + y = 20</span></div></div>",
"a": "5",
"show": "x = 5",
"sol": "Put 3x in place of y: x + 3x = 20 → 4x = 20 → x = 5. (Then y = 3(5) = 15.)"
},
"np4-2": {
"p": "Solve by substitution. Type the ordered pair (x, y).",
"fig": "<div class=\"system-eqs\"><div class=\"eq-line\"><span class=\"eq-tag\">EQ 1</span><span>y = 5x − 4</span></div><div class=\"eq-line\"><span class=\"eq-tag\">EQ 2</span><span>y = 2x + 5</span></div></div>",
"a": "(3,11)|3,11",
"show": "(3, 11)",
"ph": "(x, y)",
"sol": "5x − 4 = 2x + 5 → 3x − 4 = 5 → 3x = 9 → x = 3. Then y = 2(3) + 5 = 11. Solution: (3, 11). Check EQ 1: 5(3) − 4 = 11 ✓"
},
"np4-3": {
"p": "Pool A costs y = 4x + 15 dollars and Pool B costs y = 7x + 3 dollars for x visits. After how many visits do they cost the same?",
"a": "4",
"show": "4 visits",
"fig": "<table class=\"xy-table gym-t\"><tr><th>x</th><th>Pool A ($)</th><th>Pool B ($)</th></tr><tr><td>0</td><td>15</td><td>3</td></tr><tr><td>1</td><td>19</td><td>10</td></tr><tr><td>2</td><td>23</td><td>17</td></tr></table>",
"sol": "4x + 15 = 7x + 3 → 15 = 3x + 3 → 12 = 3x → x = 4. After 4 visits both cost 4(4) + 15 = $31."
},
"np5-1": {
"p": "In <strong>y = −4x + 9</strong>, what is b, the y-intercept? Type just the number.",
"a": "9",
"show": "b = 9",
"sol": "y = mx + b. Here m = −4 and b = 9."
},
"np5-2": {
"p": "Write the equation for this table in the form y = mx + b.",
"fig": "<table class=\"xy-table\"><tr><th>x</th><th>y</th></tr><tr><td>0</td><td>3</td></tr><tr><td>3</td><td>9</td></tr><tr><td>6</td><td>15</td></tr><tr><td>9</td><td>21</td></tr></table>",
"a": "y=2x+3|2x+3|y=3+2x|3+2x",
"show": "y = 2x + 3",
"ph": "y = mx + b",
"sol": "When x goes up 3, y goes up 6, so m = 6 ÷ 3 = 2. When x = 0, y = 3, so b = 3. Equation: y = 2x + 3."
},
"np5-3": {
"p": "Two lines are the same line (one on top of the other). How many solutions does the system have?",
"choices": [
"One solution",
"No solution",
"Infinitely many solutions"
],
"a": "Infinitely many solutions",
"sol": "The same line touches itself at every point, so there are infinitely many solutions."
},
"np5-4": {
"p": "Where do the two lines cross? Type the ordered pair.",
"fig": "<div class=\"graph-wrap\"><div class=\"pfig\" style=\"margin:0 auto\" data-geo='{\"type\": \"plane\", \"xmin\": -6, \"xmax\": 6, \"ymin\": -6, \"ymax\": 6, \"size\": 228, \"lines\": [{\"m\": 1.0, \"b\": -3.0, \"c\": \"navy\"}, {\"m\": -2.0, \"b\": 3.0, \"c\": \"gold\"}], \"alt\": \"y = x − 3 and y = −2x + 3\"}'></div><div class=\"pfig-legend\"><span><i style=\"border-top:3px solid #1E2D4F\"></i>y = x − 3</span><span><i style=\"border-top:3px solid #B45309\"></i>y = −2x + 3</span></div></div>",
"a": "(2,-1)|2,-1",
"show": "(2, −1)",
"ph": "(x, y)",
"sol": "The lines cross at (2, −1). Check: 2 − 3 = −1 ✓ and −2(2) + 3 = −1 ✓."
},
"np5-5": {
"p": "Is <strong>(−2, 1)</strong> a solution of this system?",
"choices": [
"Yes",
"No"
],
"a": "Yes",
"fig": "<div class=\"system-eqs\"><div class=\"eq-line\"><span class=\"eq-tag\">EQ 1</span><span>y = 3x + 7</span></div><div class=\"eq-line\"><span class=\"eq-tag\">EQ 2</span><span>y = x + 3</span></div></div>",
"sol": "EQ 1: 3(−2) + 7 = −6 + 7 = 1 ✓. EQ 2: −2 + 3 = 1 ✓. Both true, so yes."
},
"np5-6": {
"p": "Lee says (1, 5) is a solution of y = 2x + 3 and y = 3x + 3, because it works in the first equation. Is Lee right?",
"choices": [
"Yes, one true equation is enough",
"No, it must make both equations true"
],
"a": "No, it must make both equations true",
"sol": "EQ 1: 2(1) + 3 = 5 ✓. EQ 2: 3(1) + 3 = 6, not 5 ✗. A solution must work in both equations, so Lee is wrong."
},
"np5-7": {
"p": "Solve for x. Type just the x-value.",
"fig": "<div class=\"system-eqs\"><div class=\"eq-line\"><span class=\"eq-tag\">EQ 1</span><span>y = 4x</span></div><div class=\"eq-line\"><span class=\"eq-tag\">EQ 2</span><span>x + y = 15</span></div></div>",
"a": "3",
"show": "x = 3",
"sol": "x + 4x = 15 → 5x = 15 → x = 3. (Then y = 4(3) = 12.)"
},
"np5-8": {
"p": "Solve by substitution. Type the ordered pair (x, y).",
"fig": "<div class=\"system-eqs\"><div class=\"eq-line\"><span class=\"eq-tag\">EQ 1</span><span>y = x + 5</span></div><div class=\"eq-line\"><span class=\"eq-tag\">EQ 2</span><span>y = 2x + 1</span></div></div>",
"a": "(4,9)|4,9",
"show": "(4, 9)",
"ph": "(x, y)",
"sol": "x + 5 = 2x + 1 → 5 − 1 = 2x − x → 4 = x. y = 4 + 5 = 9. Solution: (4, 9). Check: 2(4) + 1 = 9 ✓"
},
"np5-9": {
"p": "Neither equation is solved for y. Solve the system and type the ordered pair.",
"fig": "<div class=\"system-eqs\"><div class=\"eq-line\"><span class=\"eq-tag\">EQ 1</span><span>x − y = 2</span></div><div class=\"eq-line\"><span class=\"eq-tag\">EQ 2</span><span>3x + y = 14</span></div></div>",
"a": "(4,2)|4,2",
"show": "(4, 2)",
"ph": "(x, y)",
"sol": "Solve EQ 1 for y: y = x − 2. Substitute: 3x + (x − 2) = 14 → 4x − 2 = 14 → 4x = 16 → x = 4. y = 4 − 2 = 2. Solution: (4, 2). Check EQ 2: 3(4) + 2 = 14 ✓"
},
"np5-10": {
"p": "Line A is y = 3x − 4. Line B goes through (0, 2) and (1, 5). How many solutions does the system have?",
"choices": [
"One solution",
"No solution",
"Infinitely many solutions"
],
"a": "No solution",
"fig": "<div class=\"graph-wrap\"><div class=\"pfig\" style=\"margin:0 auto\" data-geo='{\"type\": \"plane\", \"xmin\": -6, \"xmax\": 6, \"ymin\": -6, \"ymax\": 6, \"size\": 228, \"lines\": [{\"m\": 3.0, \"b\": -4.0, \"c\": \"navy\"}], \"alt\": \"Line A, y = 3x − 4, and the two points of Line B\", \"points\": [{\"x\": 0, \"y\": 2, \"c\": \"gold\", \"label\": \"(0, 2)\", \"pos\": \"w\"}, {\"x\": 1, \"y\": 5, \"c\": \"gold\", \"label\": \"(1, 5)\", \"pos\": \"e\"}]}'></div><div class=\"pfig-legend\"><span><i style=\"border-top:3px solid #1E2D4F\"></i>Line A: y = 3x − 4</span><span><i style=\"border-top:3px solid #B45309\"></i>Line B: through the 2 points</span></div></div>",
"sol": "Line B: slope = (5 − 2) ÷ (1 − 0) = 3, and b = 2, so y = 3x + 2. Same slope as Line A (3), different y-intercepts (−4 and 2) → parallel → no solution."
}
};
