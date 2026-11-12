/* unit5-notes: similar problems for notes-flow.js. Built by _build/notes_twins/build.py — edit there, not here. */
window.NOTE_TWINS = {
"np1-1": {
"p": "Look at the right triangle. Which side is the hypotenuse?",
"choices": [
"5",
"12",
"13"
],
"a": "13",
"fig": "<svg role=\"img\" aria-label=\"right triangle with sides 12, 5, 13\" viewBox=\"0 0 260 121\" width=\"220\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40.0,90.8 210.0,90.8 40.0,20.0\" fill=\"#EEF3FB\" stroke=\"none\"/><line x1=\"40\" y1=\"90.83333333333333\" x2=\"210.0\" y2=\"90.83333333333333\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><line x1=\"40\" y1=\"90.83333333333333\" x2=\"40\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><line x1=\"210.0\" y1=\"90.83333333333333\" x2=\"40\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><rect x=\"40\" y=\"78.83333333333333\" width=\"12\" height=\"12\" fill=\"none\" stroke=\"#1E2D4F\" stroke-width=\"1.5\"/><text x=\"125.0\" y=\"110.8\" text-anchor=\"middle\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">12</text><text x=\"32.0\" y=\"60.4\" text-anchor=\"end\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">5</text><text x=\"137.0\" y=\"51.4\" text-anchor=\"start\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">13</text></svg>",
"sol": "The hypotenuse is across from the right angle (the little square). It is always the longest side. Here it is 13."
},
"np1-2": {
"p": "A triangle has angles of 40°, 50°, and 90°. Can you use a² + b² = c² on it?",
"choices": [
"Yes",
"No"
],
"a": "Yes",
"sol": "One angle is 90°, so it IS a right triangle. The theorem works on right triangles. Answer: Yes."
},
"np1-3": {
"p": "The squares on the two legs of a right triangle have areas 81 and 144. What is the area of the square on the hypotenuse?",
"a": "225",
"show": "225",
"sol": "a² + b² = c² → 81 + 144 = c² → c² = 225. (So the hypotenuse is √225 = 15.)"
},
"np1-4": {
"p": "The square on the hypotenuse has area 100. The square on one leg has area 36. What is the area of the square on the other leg?",
"a": "64",
"show": "64",
"sol": "a² + 36 = 100 → a² = 100 − 36 = 64. (So that leg is √64 = 8.)"
},
"np2-1": {
"p": "The legs of a right triangle are 9 and 12. Find the hypotenuse c.",
"fig": "<svg role=\"img\" aria-label=\"right triangle with sides 12, 9, c\" viewBox=\"0 0 250 170\" width=\"220\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40.0,140.0 200.0,140.0 40.0,20.0\" fill=\"#EEF3FB\" stroke=\"none\"/><line x1=\"40\" y1=\"140.0\" x2=\"200.0\" y2=\"140.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><line x1=\"40\" y1=\"140.0\" x2=\"40\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><line x1=\"200.0\" y1=\"140.0\" x2=\"40\" y2=\"20.0\" stroke=\"#E0A800\" stroke-width=\"3\"/><rect x=\"40\" y=\"128.0\" width=\"12\" height=\"12\" fill=\"none\" stroke=\"#1E2D4F\" stroke-width=\"1.5\"/><text x=\"120.0\" y=\"160.0\" text-anchor=\"middle\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">12</text><text x=\"32.0\" y=\"85.0\" text-anchor=\"end\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">9</text><text x=\"132.0\" y=\"76.0\" text-anchor=\"start\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">c</text></svg>",
"a": "15",
"show": "15",
"sol": "9² + 12² = c² → 81 + 144 = c² → 225 = c² → c = √225 = 15"
},
"np2-2": {
"p": "The legs are 3 and 5. Find the hypotenuse c. Round to the nearest tenth (or give the exact √ answer).",
"fig": "<svg role=\"img\" aria-label=\"right triangle with sides 5, 3, c\" viewBox=\"0 0 260 152\" width=\"220\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40.0,122.0 210.0,122.0 40.0,20.0\" fill=\"#EEF3FB\" stroke=\"none\"/><line x1=\"40\" y1=\"122.0\" x2=\"210.0\" y2=\"122.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><line x1=\"40\" y1=\"122.0\" x2=\"40\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><line x1=\"210.0\" y1=\"122.0\" x2=\"40\" y2=\"20.0\" stroke=\"#E0A800\" stroke-width=\"3\"/><rect x=\"40\" y=\"110.0\" width=\"12\" height=\"12\" fill=\"none\" stroke=\"#1E2D4F\" stroke-width=\"1.5\"/><text x=\"125.0\" y=\"142.0\" text-anchor=\"middle\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">5</text><text x=\"32.0\" y=\"76.0\" text-anchor=\"end\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">3</text><text x=\"137.0\" y=\"67.0\" text-anchor=\"start\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">c</text></svg>",
"a": "5.8|√34|sqrt34|sqrt(34)|√(34)",
"show": "c = √34 ≈ 5.8",
"tol": 0.06,
"sol": "3² + 5² = c² → 9 + 25 = c² → 34 = c² → c = √34 ≈ 5.831 ≈ 5.8"
},
"np2-3": {
"p": "The legs are 8 and 15. Jon says c = 23, because 8 + 15 = 23. What is the correct value of c?",
"fig": "<svg role=\"img\" aria-label=\"right triangle with sides 15, 8, c\" viewBox=\"0 0 260 141\" width=\"220\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40.0,110.7 210.0,110.7 40.0,20.0\" fill=\"#EEF3FB\" stroke=\"none\"/><line x1=\"40\" y1=\"110.66666666666667\" x2=\"210.0\" y2=\"110.66666666666667\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><line x1=\"40\" y1=\"110.66666666666667\" x2=\"40\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><line x1=\"210.0\" y1=\"110.66666666666667\" x2=\"40\" y2=\"20.0\" stroke=\"#E0A800\" stroke-width=\"3\"/><rect x=\"40\" y=\"98.66666666666667\" width=\"12\" height=\"12\" fill=\"none\" stroke=\"#1E2D4F\" stroke-width=\"1.5\"/><text x=\"125.0\" y=\"130.7\" text-anchor=\"middle\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">15</text><text x=\"32.0\" y=\"70.3\" text-anchor=\"end\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">8</text><text x=\"137.0\" y=\"61.3\" text-anchor=\"start\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">c</text></svg>",
"a": "17",
"show": "17",
"sol": "Jon forgot to square the legs. 8² + 15² = c² → 64 + 225 = 289 → c = √289 = 17"
},
"np3-1": {
"p": "One leg is 5 and the hypotenuse is 13. Find the other leg.",
"fig": "<svg role=\"img\" aria-label=\"right triangle with sides b, 5, 13\" viewBox=\"0 0 260 121\" width=\"220\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40.0,90.8 210.0,90.8 40.0,20.0\" fill=\"#EEF3FB\" stroke=\"none\"/><line x1=\"40\" y1=\"90.83333333333333\" x2=\"210.0\" y2=\"90.83333333333333\" stroke=\"#E0A800\" stroke-width=\"3\"/><line x1=\"40\" y1=\"90.83333333333333\" x2=\"40\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><line x1=\"210.0\" y1=\"90.83333333333333\" x2=\"40\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><rect x=\"40\" y=\"78.83333333333333\" width=\"12\" height=\"12\" fill=\"none\" stroke=\"#1E2D4F\" stroke-width=\"1.5\"/><text x=\"125.0\" y=\"110.8\" text-anchor=\"middle\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">b</text><text x=\"32.0\" y=\"60.4\" text-anchor=\"end\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">5</text><text x=\"137.0\" y=\"51.4\" text-anchor=\"start\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">13</text></svg>",
"a": "12",
"show": "12",
"sol": "5² + b² = 13² → 25 + b² = 169 → b² = 169 − 25 = 144 → b = √144 = 12"
},
"np3-2": {
"p": "One leg is 6 and the hypotenuse is 11. Find the other leg. Round to the nearest tenth (or give the exact √ answer).",
"fig": "<svg role=\"img\" aria-label=\"right triangle with sides b, 6, 11\" viewBox=\"0 0 260 161\" width=\"220\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40.0,130.9 210.0,130.9 40.0,20.0\" fill=\"#EEF3FB\" stroke=\"none\"/><line x1=\"40\" y1=\"130.8695652173913\" x2=\"210.0\" y2=\"130.8695652173913\" stroke=\"#E0A800\" stroke-width=\"3\"/><line x1=\"40\" y1=\"130.8695652173913\" x2=\"40\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><line x1=\"210.0\" y1=\"130.8695652173913\" x2=\"40\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><rect x=\"40\" y=\"118.86956521739131\" width=\"12\" height=\"12\" fill=\"none\" stroke=\"#1E2D4F\" stroke-width=\"1.5\"/><text x=\"125.0\" y=\"150.9\" text-anchor=\"middle\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">b</text><text x=\"32.0\" y=\"80.4\" text-anchor=\"end\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">6</text><text x=\"137.0\" y=\"71.4\" text-anchor=\"start\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">11</text></svg>",
"a": "9.2|√85|sqrt85|sqrt(85)|√(85)",
"show": "b = √85 ≈ 9.2",
"tol": 0.06,
"sol": "6² + b² = 11² → 36 + b² = 121 → b² = 85 → b = √85 ≈ 9.220 ≈ 9.2"
},
"np3-3": {
"p": "A right triangle has a hypotenuse of 17 and one leg of 8. What is its perimeter?",
"fig": "<svg role=\"img\" aria-label=\"right triangle with sides ?, 8, 17\" viewBox=\"0 0 260 141\" width=\"220\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40.0,110.7 210.0,110.7 40.0,20.0\" fill=\"#EEF3FB\" stroke=\"none\"/><line x1=\"40\" y1=\"110.66666666666667\" x2=\"210.0\" y2=\"110.66666666666667\" stroke=\"#E0A800\" stroke-width=\"3\"/><line x1=\"40\" y1=\"110.66666666666667\" x2=\"40\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><line x1=\"210.0\" y1=\"110.66666666666667\" x2=\"40\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><rect x=\"40\" y=\"98.66666666666667\" width=\"12\" height=\"12\" fill=\"none\" stroke=\"#1E2D4F\" stroke-width=\"1.5\"/><text x=\"125.0\" y=\"130.7\" text-anchor=\"middle\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">?</text><text x=\"32.0\" y=\"70.3\" text-anchor=\"end\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">8</text><text x=\"137.0\" y=\"61.3\" text-anchor=\"start\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">17</text></svg>",
"a": "40",
"show": "40",
"sol": "Missing leg: 8² + b² = 17² → 64 + b² = 289 → b² = 225 → b = 15. Perimeter = 8 + 15 + 17 = 40"
},
"np4-1": {
"p": "A triangle has sides 25, 7, and 24. Is it a right triangle?",
"choices": [
"Yes",
"No"
],
"a": "Yes",
"sol": "Put the sides in order: 7, 24, 25. Test: 7² + 24² = 49 + 576 = 625 and 25² = 625. Equal, so Yes."
},
"np4-2": {
"p": "A triangle has sides 12, 35, and x. The side x is the longest. What must x be for a right triangle?",
"a": "37",
"show": "37",
"sol": "For a right triangle, 12² + 35² = x² → 144 + 1225 = 1369 → x = √1369 = 37"
},
"np5-1": {
"p": "A rectangular park is 12 m long and 5 m wide. A path goes from one corner to the opposite corner. How long is the path?",
"a": "13|13 m",
"show": "13 m",
"fig": "<svg role=\"img\" aria-label=\"right triangle with sides 12 m, 5 m, path\" viewBox=\"0 0 260 121\" width=\"220\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40.0,90.8 210.0,90.8 40.0,20.0\" fill=\"#EEF3FB\" stroke=\"none\"/><line x1=\"40\" y1=\"90.83333333333333\" x2=\"210.0\" y2=\"90.83333333333333\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><line x1=\"40\" y1=\"90.83333333333333\" x2=\"40\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><line x1=\"210.0\" y1=\"90.83333333333333\" x2=\"40\" y2=\"20.0\" stroke=\"#E0A800\" stroke-width=\"3\"/><rect x=\"40\" y=\"78.83333333333333\" width=\"12\" height=\"12\" fill=\"none\" stroke=\"#1E2D4F\" stroke-width=\"1.5\"/><text x=\"125.0\" y=\"110.8\" text-anchor=\"middle\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">12 m</text><text x=\"32.0\" y=\"60.4\" text-anchor=\"end\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">5 m</text><text x=\"137.0\" y=\"51.4\" text-anchor=\"start\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">path</text></svg>",
"sol": "The path is the hypotenuse. 5² + 12² = c² → 25 + 144 = 169 → c = √169 = 13 m"
},
"np5-2": {
"p": "A 13-foot ladder leans against a wall. The bottom is 5 feet from the wall. How high up the wall does it reach?",
"a": "12|12 ft|12 feet",
"show": "12 ft",
"fig": "<svg role=\"img\" aria-label=\"right triangle with sides 5 ft, h, 13 ft\" viewBox=\"0 0 140 170\" width=\"140\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40.0,140.0 90.0,140.0 40.0,20.0\" fill=\"#EEF3FB\" stroke=\"none\"/><line x1=\"40\" y1=\"140.0\" x2=\"90.0\" y2=\"140.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><line x1=\"40\" y1=\"140.0\" x2=\"40\" y2=\"20.0\" stroke=\"#E0A800\" stroke-width=\"3\"/><line x1=\"90.0\" y1=\"140.0\" x2=\"40\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><rect x=\"40\" y=\"128.0\" width=\"12\" height=\"12\" fill=\"none\" stroke=\"#1E2D4F\" stroke-width=\"1.5\"/><text x=\"65.0\" y=\"160.0\" text-anchor=\"middle\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">5 ft</text><text x=\"32.0\" y=\"85.0\" text-anchor=\"end\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">h</text><text x=\"77.0\" y=\"76.0\" text-anchor=\"start\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">13 ft</text></svg>",
"sol": "The ladder is the hypotenuse. 5² + h² = 13² → 25 + h² = 169 → h² = 144 → h = 12 ft"
},
"np5-3": {
"p": "Ella walks 8 blocks east, then 6 blocks north. How many blocks shorter is the straight path back to where she started?",
"a": "4|4 blocks",
"show": "4 blocks",
"sol": "Straight path: 8² + 6² = 64 + 36 = 100 → √100 = 10 blocks. She walked 8 + 6 = 14 blocks. 14 − 10 = 4 blocks shorter."
},
"np6-1": {
"p": "Find the distance between (1,&nbsp;2) and (13,&nbsp;7).",
"a": "13",
"show": "13",
"fig": "<svg role=\"img\" aria-label=\"points (1, 2) and (13, 7)\" viewBox=\"0 0 240 240\" width=\"250\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20.0\" y1=\"220.0\" x2=\"20.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"220.0\" x2=\"220.0\" y2=\"220.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"34.3\" y1=\"220.0\" x2=\"34.3\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"205.7\" x2=\"220.0\" y2=\"205.7\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"48.6\" y1=\"220.0\" x2=\"48.6\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"191.4\" x2=\"220.0\" y2=\"191.4\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"62.9\" y1=\"220.0\" x2=\"62.9\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"177.1\" x2=\"220.0\" y2=\"177.1\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"77.1\" y1=\"220.0\" x2=\"77.1\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"162.9\" x2=\"220.0\" y2=\"162.9\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"91.4\" y1=\"220.0\" x2=\"91.4\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"148.6\" x2=\"220.0\" y2=\"148.6\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"105.7\" y1=\"220.0\" x2=\"105.7\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"134.3\" x2=\"220.0\" y2=\"134.3\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"120.0\" y1=\"220.0\" x2=\"120.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"120.0\" x2=\"220.0\" y2=\"120.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"134.3\" y1=\"220.0\" x2=\"134.3\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"105.7\" x2=\"220.0\" y2=\"105.7\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"148.6\" y1=\"220.0\" x2=\"148.6\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"91.4\" x2=\"220.0\" y2=\"91.4\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"162.9\" y1=\"220.0\" x2=\"162.9\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"77.1\" x2=\"220.0\" y2=\"77.1\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"177.1\" y1=\"220.0\" x2=\"177.1\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"62.9\" x2=\"220.0\" y2=\"62.9\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"191.4\" y1=\"220.0\" x2=\"191.4\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"48.6\" x2=\"220.0\" y2=\"48.6\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"205.7\" y1=\"220.0\" x2=\"205.7\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"34.3\" x2=\"220.0\" y2=\"34.3\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"220.0\" y1=\"220.0\" x2=\"220.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"20.0\" x2=\"220.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"220.0\" x2=\"20.0\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"1.6\"/><line x1=\"20.0\" y1=\"220.0\" x2=\"220.0\" y2=\"220.0\" stroke=\"#1E2D4F\" stroke-width=\"1.6\"/><polyline points=\"34.3,191.4 205.7,191.4 205.7,120.0\" fill=\"none\" stroke=\"#0056B3\" stroke-width=\"2\" stroke-dasharray=\"5 4\"/><line x1=\"34.3\" y1=\"191.4\" x2=\"205.7\" y2=\"120.0\" stroke=\"#E0A800\" stroke-width=\"3\"/><circle cx=\"34.3\" cy=\"191.4\" r=\"4.5\" fill=\"#1E2D4F\"/><text x=\"34.3\" y=\"210.4\" text-anchor=\"middle\" font-family=\"Inter,sans-serif\" font-size=\"13\" font-weight=\"700\" fill=\"#1E2D4F\">(1, 2)</text><circle cx=\"205.7\" cy=\"120.0\" r=\"4.5\" fill=\"#1E2D4F\"/><text x=\"205.7\" y=\"111.0\" text-anchor=\"middle\" font-family=\"Inter,sans-serif\" font-size=\"13\" font-weight=\"700\" fill=\"#1E2D4F\">(13, 7)</text></svg>",
"sol": "Across: 13 − 1 = 12. Up: 7 − 2 = 5. 12² + 5² = 144 + 25 = 169 → d = √169 = 13"
},
"np6-2": {
"p": "Find the distance between (−1,&nbsp;4) and (2,&nbsp;−1). Round to the nearest tenth (or give the exact √ answer).",
"a": "5.8|√34|sqrt34|sqrt(34)|√(34)",
"show": "d = √34 ≈ 5.8",
"tol": 0.06,
"fig": "<svg role=\"img\" aria-label=\"points (−1, 4) and (2, −1)\" viewBox=\"0 0 240 240\" width=\"250\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20.0\" y1=\"220.0\" x2=\"20.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"220.0\" x2=\"220.0\" y2=\"220.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"48.6\" y1=\"220.0\" x2=\"48.6\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"191.4\" x2=\"220.0\" y2=\"191.4\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"77.1\" y1=\"220.0\" x2=\"77.1\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"162.9\" x2=\"220.0\" y2=\"162.9\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"105.7\" y1=\"220.0\" x2=\"105.7\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"134.3\" x2=\"220.0\" y2=\"134.3\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"134.3\" y1=\"220.0\" x2=\"134.3\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"105.7\" x2=\"220.0\" y2=\"105.7\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"162.9\" y1=\"220.0\" x2=\"162.9\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"77.1\" x2=\"220.0\" y2=\"77.1\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"191.4\" y1=\"220.0\" x2=\"191.4\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"48.6\" x2=\"220.0\" y2=\"48.6\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"220.0\" y1=\"220.0\" x2=\"220.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"20.0\" x2=\"220.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"77.1\" y1=\"220.0\" x2=\"77.1\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"1.6\"/><line x1=\"20.0\" y1=\"162.9\" x2=\"220.0\" y2=\"162.9\" stroke=\"#1E2D4F\" stroke-width=\"1.6\"/><polyline points=\"48.6,48.6 134.3,48.6 134.3,191.4\" fill=\"none\" stroke=\"#0056B3\" stroke-width=\"2\" stroke-dasharray=\"5 4\"/><line x1=\"48.6\" y1=\"48.6\" x2=\"134.3\" y2=\"191.4\" stroke=\"#E0A800\" stroke-width=\"3\"/><circle cx=\"48.6\" cy=\"48.6\" r=\"4.5\" fill=\"#1E2D4F\"/><text x=\"48.6\" y=\"39.6\" text-anchor=\"middle\" font-family=\"Inter,sans-serif\" font-size=\"13\" font-weight=\"700\" fill=\"#1E2D4F\">(−1, 4)</text><circle cx=\"134.3\" cy=\"191.4\" r=\"4.5\" fill=\"#1E2D4F\"/><text x=\"134.3\" y=\"210.4\" text-anchor=\"middle\" font-family=\"Inter,sans-serif\" font-size=\"13\" font-weight=\"700\" fill=\"#1E2D4F\">(2, −1)</text></svg>",
"sol": "Across: 2 − (−1) = 3. Down: 4 − (−1) = 5. 3² + 5² = 9 + 25 = 34 → d = √34 ≈ 5.831 ≈ 5.8"
},
"np6-3": {
"p": "Point P is in Quadrant I. It is 10 units from (0,&nbsp;0), and its x-coordinate is 6. What is its y-coordinate?",
"a": "8",
"show": "8",
"sol": "The distance 10 is the hypotenuse and 6 is one leg. 6² + y² = 10² → 36 + y² = 100 → y² = 64 → y = 8. So P = (6, 8)."
},
"np7-1": {
"p": "A right triangle has legs 8 and 15 and hypotenuse 17. Which equation is true?",
"choices": [
"8² + 15² = 17²",
"8² + 17² = 15²",
"8 + 15 = 17"
],
"a": "8² + 15² = 17²",
"sol": "The two legs go on the left. The hypotenuse goes alone on the right: 8² + 15² = 17² (64 + 225 = 289)."
},
"np7-2": {
"p": "The legs of a right triangle are 18 and 24. Find the hypotenuse.",
"a": "30",
"show": "30",
"sol": "18² + 24² = c² → 324 + 576 = 900 → c = √900 = 30"
},
"np7-3": {
"p": "A triangle has sides 15, 20, and 25. Is it a right triangle?",
"choices": [
"Yes",
"No"
],
"a": "Yes",
"sol": "15² + 20² = 225 + 400 = 625 and 25² = 625. Equal, so Yes."
},
"np7-4": {
"p": "One leg is 11 and the hypotenuse is 61. Find the other leg.",
"a": "60",
"show": "60",
"sol": "11² + b² = 61² → 121 + b² = 3721 → b² = 3600 → b = √3600 = 60"
},
"np7-5": {
"p": "The legs are 1 and 5. Find the hypotenuse. Round to the nearest tenth (or give the exact √ answer).",
"a": "5.1|√26|sqrt26|sqrt(26)|√(26)",
"show": "c = √26 ≈ 5.1",
"tol": 0.06,
"sol": "1² + 5² = c² → 1 + 25 = 26 → c = √26 ≈ 5.099 ≈ 5.1"
},
"np7-6": {
"p": "A triangle has sides 9, 12, and 16. Is it a right triangle?",
"choices": [
"Yes",
"No"
],
"a": "No",
"sol": "9² + 12² = 81 + 144 = 225, but 16² = 256. 225 ≠ 256, so No."
},
"np7-7": {
"p": "A plane flies 9 miles east, then 40 miles north. How far is it from where it started?",
"a": "41|41 miles|41 mi",
"show": "41 miles",
"sol": "The straight-line distance is the hypotenuse. 9² + 40² = 81 + 1600 = 1681 → √1681 = 41 miles"
},
"np7-8": {
"p": "Find the distance between (−4,&nbsp;1) and (8,&nbsp;6).",
"a": "13",
"show": "13",
"fig": "<svg role=\"img\" aria-label=\"points (−4, 1) and (8, 6)\" viewBox=\"0 0 240 240\" width=\"250\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20.0\" y1=\"220.0\" x2=\"20.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"220.0\" x2=\"220.0\" y2=\"220.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"34.3\" y1=\"220.0\" x2=\"34.3\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"205.7\" x2=\"220.0\" y2=\"205.7\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"48.6\" y1=\"220.0\" x2=\"48.6\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"191.4\" x2=\"220.0\" y2=\"191.4\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"62.9\" y1=\"220.0\" x2=\"62.9\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"177.1\" x2=\"220.0\" y2=\"177.1\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"77.1\" y1=\"220.0\" x2=\"77.1\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"162.9\" x2=\"220.0\" y2=\"162.9\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"91.4\" y1=\"220.0\" x2=\"91.4\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"148.6\" x2=\"220.0\" y2=\"148.6\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"105.7\" y1=\"220.0\" x2=\"105.7\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"134.3\" x2=\"220.0\" y2=\"134.3\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"120.0\" y1=\"220.0\" x2=\"120.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"120.0\" x2=\"220.0\" y2=\"120.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"134.3\" y1=\"220.0\" x2=\"134.3\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"105.7\" x2=\"220.0\" y2=\"105.7\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"148.6\" y1=\"220.0\" x2=\"148.6\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"91.4\" x2=\"220.0\" y2=\"91.4\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"162.9\" y1=\"220.0\" x2=\"162.9\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"77.1\" x2=\"220.0\" y2=\"77.1\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"177.1\" y1=\"220.0\" x2=\"177.1\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"62.9\" x2=\"220.0\" y2=\"62.9\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"191.4\" y1=\"220.0\" x2=\"191.4\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"48.6\" x2=\"220.0\" y2=\"48.6\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"205.7\" y1=\"220.0\" x2=\"205.7\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"34.3\" x2=\"220.0\" y2=\"34.3\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"220.0\" y1=\"220.0\" x2=\"220.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"20.0\" x2=\"220.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"91.4\" y1=\"220.0\" x2=\"91.4\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"1.6\"/><line x1=\"20.0\" y1=\"148.6\" x2=\"220.0\" y2=\"148.6\" stroke=\"#1E2D4F\" stroke-width=\"1.6\"/><polyline points=\"34.3,134.3 205.7,134.3 205.7,62.9\" fill=\"none\" stroke=\"#0056B3\" stroke-width=\"2\" stroke-dasharray=\"5 4\"/><line x1=\"34.3\" y1=\"134.3\" x2=\"205.7\" y2=\"62.9\" stroke=\"#E0A800\" stroke-width=\"3\"/><circle cx=\"34.3\" cy=\"134.3\" r=\"4.5\" fill=\"#1E2D4F\"/><text x=\"34.3\" y=\"153.3\" text-anchor=\"middle\" font-family=\"Inter,sans-serif\" font-size=\"13\" font-weight=\"700\" fill=\"#1E2D4F\">(−4, 1)</text><circle cx=\"205.7\" cy=\"62.9\" r=\"4.5\" fill=\"#1E2D4F\"/><text x=\"205.7\" y=\"53.9\" text-anchor=\"middle\" font-family=\"Inter,sans-serif\" font-size=\"13\" font-weight=\"700\" fill=\"#1E2D4F\">(8, 6)</text></svg>",
"sol": "Across: 8 − (−4) = 12. Up: 6 − 1 = 5. 12² + 5² = 144 + 25 = 169 → d = √169 = 13"
},
"np7-9": {
"p": "A square has a diagonal of 12&nbsp;cm. How long is each side? Round to the nearest tenth (or give the exact √ answer).",
"a": "8.5|√72|sqrt72|sqrt(72)|√(72)|6√2",
"show": "s = √72 ≈ 8.5 cm",
"tol": 0.06,
"sol": "Both legs are the same length, s. s² + s² = 12² → 2s² = 144 → s² = 72 → s = √72 ≈ 8.485 ≈ 8.5 cm"
},
"np7-10": {
"p": "A triangle has corners at (0,&nbsp;0), (6,&nbsp;0), and (6,&nbsp;8). What is its perimeter?",
"a": "24",
"show": "24",
"sol": "Bottom side: 6. Right side: 8. Slanted side: 6² + 8² = 36 + 64 = 100 → √100 = 10. Perimeter = 6 + 8 + 10 = 24"
},
"u5h1": {
"p": "<span class=\"np-lv l1 lvb\">Score 3</span> Legs 6 and 8: 6² + 8² = c² → c = ?",
"a": [
"10"
],
"fig": "<svg role=\"img\" aria-label=\"right triangle with sides 8, 6, c\" viewBox=\"0 0 250 170\" width=\"220\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40.0,140.0 200.0,140.0 40.0,20.0\" fill=\"#EEF3FB\" stroke=\"none\"/><line x1=\"40\" y1=\"140.0\" x2=\"200.0\" y2=\"140.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><line x1=\"40\" y1=\"140.0\" x2=\"40\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><line x1=\"200.0\" y1=\"140.0\" x2=\"40\" y2=\"20.0\" stroke=\"#E0A800\" stroke-width=\"3\"/><rect x=\"40\" y=\"128.0\" width=\"12\" height=\"12\" fill=\"none\" stroke=\"#1E2D4F\" stroke-width=\"1.5\"/><text x=\"120.0\" y=\"160.0\" text-anchor=\"middle\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">8</text><text x=\"32.0\" y=\"85.0\" text-anchor=\"end\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">6</text><text x=\"132.0\" y=\"76.0\" text-anchor=\"start\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">c</text></svg>"
},
"chk54a": {
"p": "<span class=\"np-lv l1 lvb\">Score 3</span> <span class=\"badge\">MC</span> Sides 8, 15, 17 — right triangle?",
"choices": [
"Yes",
"No"
],
"a": "Yes",
"why": "8² + 15² = 64 + 225 = 289; 17² = 289; 289 = 289 → YES, right triangle."
},
"chk54b": {
"p": "<span class=\"np-lv l1 lvb\">Score 3</span> <span class=\"badge\">MC</span> Sides 5, 8, 10 — right triangle?",
"choices": [
"Yes",
"No"
],
"a": "No",
"why": "5² + 8² = 25 + 64 = 89; 10² = 100; 89 ≠ 100 → NO, not a right triangle."
},
"u5pB2": {
"p": "<span class=\"np-lv l1 lvb\">Score 3</span> Known leg 5, hyp 13. Leg = ?",
"a": [
"12"
],
"fig": "<svg role=\"img\" aria-label=\"right triangle with sides ?, 5, 13\" viewBox=\"0 0 260 121\" width=\"220\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40.0,90.8 210.0,90.8 40.0,20.0\" fill=\"#EEF3FB\" stroke=\"none\"/><line x1=\"40\" y1=\"90.83333333333333\" x2=\"210.0\" y2=\"90.83333333333333\" stroke=\"#E0A800\" stroke-width=\"3\"/><line x1=\"40\" y1=\"90.83333333333333\" x2=\"40\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><line x1=\"210.0\" y1=\"90.83333333333333\" x2=\"40\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><rect x=\"40\" y=\"78.83333333333333\" width=\"12\" height=\"12\" fill=\"none\" stroke=\"#1E2D4F\" stroke-width=\"1.5\"/><text x=\"125.0\" y=\"110.8\" text-anchor=\"middle\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">?</text><text x=\"32.0\" y=\"60.4\" text-anchor=\"end\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">5</text><text x=\"137.0\" y=\"51.4\" text-anchor=\"start\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">13</text></svg>"
},
"u5pD2": {
"p": "<span class=\"np-lv l1 lvb\">Score 3</span> (0,0) → (6,8). d = ?",
"a": [
"10"
],
"fig": "<svg role=\"img\" aria-label=\"points (0, 0) and (6, 8)\" viewBox=\"0 0 240 240\" width=\"200\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20.0\" y1=\"220.0\" x2=\"20.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"220.0\" x2=\"220.0\" y2=\"220.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"40.0\" y1=\"220.0\" x2=\"40.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"200.0\" x2=\"220.0\" y2=\"200.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"60.0\" y1=\"220.0\" x2=\"60.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"180.0\" x2=\"220.0\" y2=\"180.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"80.0\" y1=\"220.0\" x2=\"80.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"160.0\" x2=\"220.0\" y2=\"160.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"100.0\" y1=\"220.0\" x2=\"100.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"140.0\" x2=\"220.0\" y2=\"140.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"120.0\" y1=\"220.0\" x2=\"120.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"120.0\" x2=\"220.0\" y2=\"120.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"140.0\" y1=\"220.0\" x2=\"140.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"100.0\" x2=\"220.0\" y2=\"100.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"160.0\" y1=\"220.0\" x2=\"160.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"80.0\" x2=\"220.0\" y2=\"80.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"180.0\" y1=\"220.0\" x2=\"180.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"60.0\" x2=\"220.0\" y2=\"60.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"200.0\" y1=\"220.0\" x2=\"200.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"40.0\" x2=\"220.0\" y2=\"40.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"220.0\" y1=\"220.0\" x2=\"220.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"20.0\" y1=\"20.0\" x2=\"220.0\" y2=\"20.0\" stroke=\"#D5DBE6\" stroke-width=\"1\"/><line x1=\"40.0\" y1=\"220.0\" x2=\"40.0\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"1.6\"/><line x1=\"20.0\" y1=\"200.0\" x2=\"220.0\" y2=\"200.0\" stroke=\"#1E2D4F\" stroke-width=\"1.6\"/><polyline points=\"40.0,200.0 160.0,200.0 160.0,40.0\" fill=\"none\" stroke=\"#0056B3\" stroke-width=\"2\" stroke-dasharray=\"5 4\"/><line x1=\"40.0\" y1=\"200.0\" x2=\"160.0\" y2=\"40.0\" stroke=\"#E0A800\" stroke-width=\"3\"/><circle cx=\"40.0\" cy=\"200.0\" r=\"4.5\" fill=\"#1E2D4F\"/><text x=\"40.0\" y=\"219.0\" text-anchor=\"middle\" font-family=\"Inter,sans-serif\" font-size=\"13\" font-weight=\"700\" fill=\"#1E2D4F\">(0, 0)</text><circle cx=\"160.0\" cy=\"40.0\" r=\"4.5\" fill=\"#1E2D4F\"/><text x=\"160.0\" y=\"31.0\" text-anchor=\"middle\" font-family=\"Inter,sans-serif\" font-size=\"13\" font-weight=\"700\" fill=\"#1E2D4F\">(6, 8)</text></svg>"
},
"u5pE5": {
"p": "<span class=\"np-lv l3 lvb\">Score 5</span> Sides 12, 35, 38 — right triangle? (type <em>yes</em> or <em>no</em>)",
"a": [
"No — 12² + 35² = 1369, and 38² = 1444, so 1369 ≠ 1444",
"no",
"n",
"not right",
"no it is not",
"not a right triangle"
]
},
"u5ea": {
"p": "<span class=\"np-lv l2 lvb\">Score 4</span> <span class=\"badge\">ERROR ANALYSIS</span> A student finds the missing leg when c = 17 and b = 8 by writing <span class=\"err-bad\">a² = 17² + 8² = 353</span>. What is the fix?",
"fig": "<svg role=\"img\" aria-label=\"right triangle with sides a, 8, 17\" viewBox=\"0 0 260 141\" width=\"220\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40.0,110.7 210.0,110.7 40.0,20.0\" fill=\"#EEF3FB\" stroke=\"none\"/><line x1=\"40\" y1=\"110.66666666666667\" x2=\"210.0\" y2=\"110.66666666666667\" stroke=\"#E0A800\" stroke-width=\"3\"/><line x1=\"40\" y1=\"110.66666666666667\" x2=\"40\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><line x1=\"210.0\" y1=\"110.66666666666667\" x2=\"40\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><rect x=\"40\" y=\"98.66666666666667\" width=\"12\" height=\"12\" fill=\"none\" stroke=\"#1E2D4F\" stroke-width=\"1.5\"/><text x=\"125.0\" y=\"130.7\" text-anchor=\"middle\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">a</text><text x=\"32.0\" y=\"70.3\" text-anchor=\"end\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">8</text><text x=\"137.0\" y=\"61.3\" text-anchor=\"start\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">17</text></svg>",
"choices": [
"They added the squares. To find a leg, subtract: 17² − 8² = 225, so a = 15.",
"Nothing is wrong. a = √353 ≈ 18.8",
"They should add the sides: a = 17 + 8 = 25.",
"They should subtract the sides: a = 17 − 8 = 9."
],
"a": "They added the squares. To find a leg, subtract: 17² − 8² = 225, so a = 15.",
"why": "a is a leg, so subtract: a² = 17² − 8² = 289 − 64 = 225, and a = √225 = 15."
},
"np7-11": {
"p": "You know the hypotenuse is 10 and one leg is 6. What do you do to find the other leg?",
"choices": [
"Subtract the squares: 10² − 6²",
"Add the squares: 10² + 6²",
"Subtract the sides: 10 − 6",
"Add the sides: 10 + 6"
],
"a": "Subtract the squares: 10² − 6²",
"fig": "<svg role=\"img\" aria-label=\"right triangle with sides ?, 6, 10\" viewBox=\"0 0 250 170\" width=\"220\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40.0,140.0 200.0,140.0 40.0,20.0\" fill=\"#EEF3FB\" stroke=\"none\"/><line x1=\"40\" y1=\"140.0\" x2=\"200.0\" y2=\"140.0\" stroke=\"#E0A800\" stroke-width=\"3\"/><line x1=\"40\" y1=\"140.0\" x2=\"40\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><line x1=\"200.0\" y1=\"140.0\" x2=\"40\" y2=\"20.0\" stroke=\"#1E2D4F\" stroke-width=\"3\"/><rect x=\"40\" y=\"128.0\" width=\"12\" height=\"12\" fill=\"none\" stroke=\"#1E2D4F\" stroke-width=\"1.5\"/><text x=\"120.0\" y=\"160.0\" text-anchor=\"middle\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">?</text><text x=\"32.0\" y=\"85.0\" text-anchor=\"end\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">6</text><text x=\"132.0\" y=\"76.0\" text-anchor=\"start\" font-family=\"Inter,sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"#1E2D4F\">10</text></svg>",
"sol": "You are finding a LEG, so subtract the squares: 10² − 6² = 100 − 36 = 64, and √64 = 8."
},
"u5pF1": {
"p": "<span class=\"np-lv l3 lvb\">Score 5</span> A box is 6 in long, 2 in wide, and 3 in tall. What is the longest straight stick that fits inside, from a bottom corner to the opposite top corner?",
"a": [
"7",
"7 in"
],
"fig": "<svg role=\"img\" aria-label=\"Box 6 in long, 2 in wide and 3 in tall, with a dashed line from a bottom corner to the opposite top corner\" width=\"262\" height=\"146\" viewBox=\"0 0 262 146\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"30,112 170,112 170,62 30,62\" fill=\"#eef4ff\" stroke=\"none\"/><polygon points=\"30,62 170,62 214,28 74,28\" fill=\"#eef4ff\" stroke=\"none\"/><polygon points=\"170,112 214,78 214,28 170,62\" fill=\"#eef4ff\" stroke=\"none\"/><line x1=\"30\" y1=\"112\" x2=\"74\" y2=\"78\" stroke=\"#8a93a6\" stroke-width=\"1.5\" stroke-dasharray=\"4 4\"/><line x1=\"74\" y1=\"78\" x2=\"214\" y2=\"78\" stroke=\"#8a93a6\" stroke-width=\"1.5\" stroke-dasharray=\"4 4\"/><line x1=\"74\" y1=\"78\" x2=\"74\" y2=\"28\" stroke=\"#8a93a6\" stroke-width=\"1.5\" stroke-dasharray=\"4 4\"/><line x1=\"30\" y1=\"112\" x2=\"214\" y2=\"78\" stroke=\"#8a93a6\" stroke-width=\"1.6\" stroke-dasharray=\"2 4\"/><line x1=\"30\" y1=\"112\" x2=\"170\" y2=\"112\" stroke=\"#1E2D4F\" stroke-width=\"2.2\"/><line x1=\"170\" y1=\"112\" x2=\"170\" y2=\"62\" stroke=\"#1E2D4F\" stroke-width=\"2.2\"/><line x1=\"170\" y1=\"62\" x2=\"30\" y2=\"62\" stroke=\"#1E2D4F\" stroke-width=\"2.2\"/><line x1=\"30\" y1=\"62\" x2=\"30\" y2=\"112\" stroke=\"#1E2D4F\" stroke-width=\"2.2\"/><line x1=\"30\" y1=\"62\" x2=\"74\" y2=\"28\" stroke=\"#1E2D4F\" stroke-width=\"2.2\"/><line x1=\"170\" y1=\"62\" x2=\"214\" y2=\"28\" stroke=\"#1E2D4F\" stroke-width=\"2.2\"/><line x1=\"74\" y1=\"28\" x2=\"214\" y2=\"28\" stroke=\"#1E2D4F\" stroke-width=\"2.2\"/><line x1=\"170\" y1=\"112\" x2=\"214\" y2=\"78\" stroke=\"#1E2D4F\" stroke-width=\"2.2\"/><line x1=\"214\" y1=\"78\" x2=\"214\" y2=\"28\" stroke=\"#1E2D4F\" stroke-width=\"2.2\"/><line x1=\"30\" y1=\"112\" x2=\"214\" y2=\"28\" stroke=\"#b08800\" stroke-width=\"3\" stroke-dasharray=\"7 4\"/><text x=\"100\" y=\"131\" text-anchor=\"middle\" font-family=\"Arvo,serif\" font-weight=\"bold\" font-size=\"13\" fill=\"#0056B3\" paint-order=\"stroke\" stroke=\"#fff\" stroke-width=\"3\">6 in</text><text x=\"22\" y=\"92\" text-anchor=\"end\" font-family=\"Arvo,serif\" font-weight=\"bold\" font-size=\"13\" fill=\"#0056B3\" paint-order=\"stroke\" stroke=\"#fff\" stroke-width=\"3\">3 in</text><text x=\"200\" y=\"104\" text-anchor=\"start\" font-family=\"Arvo,serif\" font-weight=\"bold\" font-size=\"13\" fill=\"#0056B3\" paint-order=\"stroke\" stroke=\"#fff\" stroke-width=\"3\">2 in</text><text x=\"112\" y=\"52\" text-anchor=\"middle\" font-family=\"Arvo,serif\" font-weight=\"bold\" font-size=\"13\" fill=\"#b08800\" paint-order=\"stroke\" stroke=\"#fff\" stroke-width=\"3\">d = ?</text></svg>"
}
};
