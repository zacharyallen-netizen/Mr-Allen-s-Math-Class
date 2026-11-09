/* unit6-notes: similar problems for notes-flow.js. Built by _build/notes_twins/build.py — edit there, not here. */
window.NOTE_TWINS = {
"np1-1": {
"p": "Is this a function? &nbsp;(2, 6), (4, 1), (7, 3), (9, 5)",
"choices": [
"Yes",
"No"
],
"a": "Yes",
"fig": "<div class=\"fnfig\"><div data-fn='{\"type\": \"mapping\", \"pairs\": [[2, 6], [4, 1], [7, 3], [9, 5]], \"maxW\": 240, \"alt\": \"mapping diagram for (2, 6), (4, 1), (7, 3), (9, 5)\"}'></div></div>",
"sol": "The inputs are 2, 4, 7, 9. No input repeats, so each input has exactly one output. It is a function."
},
"np1-2": {
"p": "This table is <b>not</b> a function. Which input breaks the rule? Type just the number.",
"fig": "<table class=\"data-table\" style=\"margin:8px 0\"><tr><th>x</th><td>1</td><td>5</td><td>3</td><td>5</td></tr><tr><th>y</th><td>2</td><td>4</td><td>6</td><td>8</td></tr></table>",
"a": "5",
"show": "5",
"sol": "The inputs are 1, 5, 3, 5. The input 5 shows up twice. It goes to 4 and also to 8. So the input 5 breaks the rule."
},
"np1-3": {
"p": "(3, 2), (5, 4), (<b>☐</b>, 6), (8, 10). Give one number for the box that makes this NOT a function.",
"a": "3|5|8",
"show": "3, 5, or 8",
"sol": "The inputs already used are 3, 5 and 8. If the box is one of them, that input gets a second output. Example: box = 3 gives (3, 2) and (3, 6). So 3, 5, or 8 works."
},
"np2-1": {
"p": "A plumber charges $40 to come out, plus $25 per hour. What is the rate of change (slope)? Type just the number.",
"a": "25",
"show": "25",
"sol": "“Per hour” tells you the rate. Each hour adds $25, so m = 25. (The $40 to come out is b.)"
},
"np2-2": {
"p": "A museum costs $6 to get in, plus $3 per exhibit. Write an equation for the total cost y after x exhibits.",
"a": "y = 3x + 6|3x+6|6+3x|y=6+3x",
"show": "y = 3x + 6",
"ph": "y = mx + b",
"sol": "$3 per exhibit is the rate → m = 3. The $6 to get in is paid once → b = 6. So y = 3x + 6."
},
"np2-3": {
"p": "A DJ charges a fixed fee plus a rate per hour. 2 hours cost $70. 6 hours cost $130. What is the fixed fee? Type just the number.",
"a": "40",
"show": "40",
"sol": "Rate: (130 − 70) ÷ (6 − 2) = 60 ÷ 4 = $15 per hour. 2 hours of work cost 2 × 15 = $30. Fixed fee: 70 − 30 = $40. Check: 15(6) + 40 = 130 ✓"
},
"np3-1": {
"p": "Function A: y = 6x + 2. &nbsp;Function B: y = 4x + 10. Which has the greater rate of change?",
"choices": [
"Function A",
"Function B"
],
"a": "Function A",
"sol": "Slopes: A has m = 6. B has m = 4. 6 > 4, so Function A has the greater rate of change. (The 2 and the 10 are starting values.)"
},
"np3-2": {
"p": "Function A is the table. Function B is y = 7x + 1. Which has the greater rate of change?",
"choices": [
"Function A",
"Function B",
"They are the same"
],
"a": "Function B",
"fig": "<table class=\"data-table\" style=\"margin:8px 0\"><tr><th>x</th><td>0</td><td>1</td><td>2</td><td>3</td></tr><tr><th>y</th><td>5</td><td>8</td><td>11</td><td>14</td></tr></table>",
"sol": "Table A: y goes up 3 each time x goes up 1, so m = 3. Function B: m = 7. 7 > 3, so Function B changes faster."
},
"np3-3": {
"p": "Pass A costs $12 per visit. Pass B costs a $20 fee plus $8 per visit. After how many visits do they cost the same? Type just the number.",
"a": "5",
"show": "5",
"sol": "Pass A: y = 12x. Pass B: y = 8x + 20. Set them equal: 12x = 8x + 20 → 4x = 20 → x = 5. Check: 12(5) = 60 and 8(5) + 20 = 60 ✓"
},
"np4-1": {
"p": "A graph shows Mia’s distance from home. The line goes UP. What is Mia doing?",
"choices": [
"Moving away from home",
"Moving toward home",
"Standing still"
],
"a": "Moving away from home",
"sol": "Going up means the distance from home is increasing. Mia is getting farther from home, so she is moving away from home."
},
"np4-2": {
"p": "This graph shows the gas in a car’s tank. In which part is the car parked (the gas stays the same)?",
"choices": [
"Part A",
"Part B",
"Part C"
],
"a": "Part B",
"fig": "<div class=\"fnfig\"><div data-fn='{\"type\": \"chart\", \"xmin\": 0, \"xmax\": 10, \"xstep\": 1, \"ymin\": 0, \"ymax\": 10, \"ystep\": 1, \"w\": 260, \"h\": 160, \"noNums\": true, \"xlabel\": \"Time\", \"ylabel\": \"Gas in tank\", \"lines\": [{\"pts\": [[0, 9], [4, 4], [7, 4], [10, 9]], \"c\": \"blue\"}], \"phases\": [{\"x0\": 0, \"x1\": 4, \"label\": \"A\"}, {\"x0\": 4, \"x1\": 7, \"label\": \"B\"}, {\"x0\": 7, \"x1\": 10, \"label\": \"C\"}], \"alt\": \"gas graph: part A goes down, part B is flat, part C goes up\"}'></div></div>",
"sol": "Part A goes down (using gas while driving). Part B is flat (the gas stays the same: parked). Part C goes up (filling the tank)."
},
"np5-1": {
"p": "(6.1) Which set of points is a function?",
"choices": [
"(2, 1), (2, 4), (3, 5)",
"(5, 0), (6, 1), (7, 1)",
"(8, 2), (8, 3), (8, 4)"
],
"a": "(5, 0), (6, 1), (7, 1)",
"sol": "In the first set, 2 goes to 1 and to 4. In the last set, 8 goes to 2, 3 and 4. In (5, 0), (6, 1), (7, 1) every input is different, so it is a function. Outputs may repeat."
},
"np5-2": {
"p": "(6.1) A function machine has the rule “× 2, then − 3.” What comes out when 7 goes in?",
"a": "11",
"show": "11",
"fig": "<div class=\"fnfig\"><div data-fn='{\"type\": \"machine\", \"inp\": \"7\", \"rule\": \"× 2, − 3\", \"out\": \"?\", \"inLabel\": \"input\", \"outLabel\": \"output\", \"alt\": \"function machine: 7 goes in, the rule is times 2 then minus 3\"}'></div></div>",
"sol": "7 × 2 = 14. Then 14 − 3 = 11."
},
"np5-3": {
"p": "(6.1) Is this mapping a function?",
"choices": [
"Yes",
"No"
],
"a": "No",
"fig": "<div class=\"fnfig\"><div data-fn='{\"type\": \"mapping\", \"pairs\": [[1, 5], [2, 6], [1, 8]], \"alt\": \"mapping diagram: 1 to 5, 2 to 6, 1 to 8\"}'></div></div>",
"sol": "The input 1 has two arrows: one to 5 and one to 8. One input with two outputs breaks the rule, so no, it is not a function."
},
"np5-4": {
"p": "(6.4) A gym membership costs y = 20x + 50, where x is the number of months. What does the 20 mean?",
"choices": [
"The cost for each month",
"A one-time starting fee",
"The number of months"
],
"a": "The cost for each month",
"sol": "20 is m, the slope (the number times x). Each month adds $20, so it is the cost for each month. The 50 is the one-time starting fee."
},
"np5-5": {
"p": "(6.4) A water tank holds 40 gallons. It drains 4 gallons each minute. Write an equation for the water y after x minutes.",
"a": "y = −4x + 40|-4x+40|40-4x|y=40-4x",
"show": "y = −4x + 40",
"ph": "y = mx + b",
"sol": "Start: 40 gallons → b = 40. It loses 4 gallons each minute → m = −4. So y = −4x + 40."
},
"np5-6": {
"p": "(6.4) The table shows the money left on a bus card after x rides. After how many rides will the card have $0? Type just the number.",
"a": "8",
"show": "8",
"fig": "<table class=\"data-table\" style=\"margin:8px 0\"><tr><th>Rides (x)</th><td>0</td><td>1</td><td>2</td><td>3</td></tr><tr><th>Money left (y)</th><td>$48</td><td>$42</td><td>$36</td><td>$30</td></tr></table>",
"sol": "Each ride uses $6, so m = −6. The card starts at $48, so b = 48: y = −6x + 48. The card is at $0 when 6x = 48, so x = 48 ÷ 6 = 8 rides."
},
"np5-7": {
"p": "(6.5) Function A is the graph. Function B is y = 2x + 7. Which has the greater rate of change?",
"choices": [
"Function A",
"Function B"
],
"a": "Function A",
"fig": "<div class=\"fnfig\"><div data-fn='{\"type\": \"chart\", \"xmin\": 0, \"xmax\": 4, \"xstep\": 1, \"ymin\": 0, \"ymax\": 20, \"ystep\": 2, \"ylabelEvery\": 4, \"w\": 240, \"h\": 180, \"xlabel\": \"x\", \"ylabel\": \"y\", \"lines\": [{\"pts\": [[0, 3], [4, 19]], \"c\": \"blue\"}], \"points\": [{\"x\": 0, \"y\": 3, \"label\": \"(0, 3)\", \"pos\": \"e\", \"c\": \"blue\"}, {\"x\": 2, \"y\": 11, \"label\": \"(2, 11)\", \"pos\": \"nw\", \"c\": \"blue\"}], \"alt\": \"Function A: a line through (0, 3) and (2, 11)\"}'></div></div>",
"sol": "Graph A: from (0, 3) to (2, 11) the rise is 8 and the run is 2, so m = 8 ÷ 2 = 4. Function B: m = 2. 4 > 2, so Function A has the greater rate of change. (B has the greater start: 7 > 3.)"
},
"np5-8": {
"p": "(6.5) Store A rents kayaks for $9 per hour. Store B charges a $10 fee plus $6 per hour. For a 5-hour trip, which store is cheaper?",
"choices": [
"Store A, by $5",
"Store B, by $5",
"Store B, by $10",
"They cost the same"
],
"a": "Store B, by $5",
"sol": "Store A: y = 9(5) = $45. Store B: y = 6(5) + 10 = 30 + 10 = $40. 45 − 40 = 5, so Store B is cheaper by $5."
},
"np5-9": {
"p": "(6.6) On a graph of height over time, a line going DOWN means the height is…",
"choices": [
"going up",
"going down",
"staying the same"
],
"a": "going down",
"sol": "A line that goes down from left to right means the value is getting smaller. The height is going down (decreasing)."
},
"np5-10": {
"p": "(6.6) The graph shows Zoe’s distance from home. In which part is Zoe moving at her FASTEST speed?",
"choices": [
"Part A",
"Part B",
"Part C",
"Part D"
],
"a": "Part C",
"fig": "<div class=\"fnfig\"><div data-fn='{\"type\": \"chart\", \"xmin\": 0, \"xmax\": 10, \"xstep\": 1, \"ymin\": 0, \"ymax\": 10, \"ystep\": 1, \"w\": 260, \"h\": 160, \"noNums\": true, \"xlabel\": \"Time\", \"ylabel\": \"Distance from home\", \"lines\": [{\"pts\": [[0, 0], [2, 3], [4, 3], [5, 9], [10, 0]], \"c\": \"red\"}], \"phases\": [{\"x0\": 0, \"x1\": 2, \"label\": \"A\"}, {\"x0\": 2, \"x1\": 4, \"label\": \"B\"}, {\"x0\": 4, \"x1\": 5, \"label\": \"C\"}, {\"x0\": 5, \"x1\": 10, \"label\": \"D\"}], \"alt\": \"Zoe’s distance graph: A gentle up, B flat, C very steep up, D gentle down\"}'></div></div>",
"sol": "Part B is flat, so Zoe is stopped there. She moves in Parts A, C and D. Part C is the steepest, so she moves fastest in Part C."
}
};
