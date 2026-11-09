/* unit7-notes: similar problems for notes-flow.js. Built by _build/notes_twins/build.py — edit there, not here. */
window.NOTE_TWINS = {
"np1-1": {
"p": "Which data set is bivariate?",
"choices": [
"Shoe sizes of 25 students",
"Height AND arm span for 25 students",
"Favorite sports of 25 students"
],
"a": "Height AND arm span for 25 students",
"sol": "Bivariate = two values for each item. Height AND arm span gives each student two numbers, so it is bivariate. The other two have only one value per student."
},
"np1-2": {
"p": "The scatterplot shows hours of practice and points scored for 8 players. How many points did the player who practiced 6 hours score? Type just the number.",
"a": "13",
"show": "13",
"fig": "<div class=\"pfig\" data-fig='{\"type\": \"chart\", \"xmin\": 0, \"xmax\": 8, \"xstep\": 1, \"ymin\": 0, \"ymax\": 20, \"ystep\": 1, \"ylabelEvery\": 2, \"xlabel\": \"Hours practiced\", \"ylabel\": \"Points scored\", \"points\": [[1, 3], [2, 5], [3, 6], [4, 9], [5, 10], [6, 13], [7, 14], [8, 17]], \"alt\": \"Scatter plot of hours practiced and points scored for 8 players\"}'></div>",
"sol": "Find 6 on the x-axis. Go up to the dot. Go left: the dot is on the line for 13. The player scored 13 points."
},
"np1-3": {
"p": "How many students studied more than 3 hours AND scored above 80? Type just the number.",
"a": "5",
"show": "5",
"fig": "<div class=\"pfig\" data-fig='{\"type\": \"chart\", \"xmin\": 0, \"xmax\": 6, \"xstep\": 1, \"ymin\": 60, \"ymax\": 100, \"ystep\": 10, \"brk\": true, \"xlabel\": \"Hours studied\", \"ylabel\": \"Test score\", \"points\": [[1, 62], [1.5, 68], [2, 74], [2.5, 71], [3, 79], [3.5, 86], [4, 82], [4.5, 77], [5, 91], [5.5, 85], [6, 72], [6, 94]], \"alt\": \"Scatter plot of hours studied and test score for 12 students\"}'></div>",
"sol": "Dots to the right of 3 hours: 3.5 h (86), 4 h (82), 4.5 h (77), 5 h (91), 5.5 h (85), 6 h (72), 6 h (94). Above 80: 86, 82, 91, 85, 94. 77 and 72 are below 80. So 5 students."
},
"np2-1": {
"p": "What type of correlation does this scatterplot show?",
"choices": [
"Positive",
"Negative",
"None"
],
"a": "Positive",
"fig": "<div class=\"pfig\" data-fig='{\"type\": \"chart\", \"xmin\": 0, \"xmax\": 10, \"xstep\": 1, \"xlabelEvery\": 2, \"ymin\": 0, \"ymax\": 10, \"ystep\": 1, \"ylabelEvery\": 2, \"xlabel\": \"Hours of exercise\", \"ylabel\": \"Calories burned (100s)\", \"points\": [[1, 1.5], [2, 2.4], [3, 3.1], [4, 4.2], [5, 4.9], [6, 6.1], [7, 6.8], [8, 7.9], [9, 8.6]], \"alt\": \"Scatter plot: dots go up from left to right\"}'></div>",
"sol": "From left to right the dots go UP. As x increases, y increases. That is a positive correlation."
},
"np2-2": {
"p": "Describe the correlation. Pick the direction AND the strength.",
"choices": [
"Strong positive",
"Weak positive",
"Strong negative",
"Weak negative"
],
"a": "Weak positive",
"fig": "<div class=\"pfig\" data-fig='{\"type\": \"chart\", \"xmin\": 0, \"xmax\": 10, \"xstep\": 1, \"xlabelEvery\": 2, \"ymin\": 0, \"ymax\": 10, \"ystep\": 1, \"ylabelEvery\": 2, \"xlabel\": \"Hours reading\", \"ylabel\": \"Vocabulary score\", \"points\": [[1, 3], [2, 1.5], [3, 4.5], [4, 2.5], [5, 6], [6, 3.8], [7, 7.5], [8, 5], [9, 8.5]], \"alt\": \"Scatter plot: dots drift up but are spread out\"}'></div>",
"sol": "Direction: the dots drift UP from left to right → positive. Strength: the dots are spread out, not hugging a line → weak. Answer: weak positive."
},
"np2-3": {
"p": "Cities with more police officers have more crimes. Does having more police officers cause more crime?",
"choices": [
"Yes — more officers cause more crime",
"No — bigger cities have more officers AND more crime",
"No — there is no correlation at all"
],
"a": "No — bigger cities have more officers AND more crime",
"sol": "There IS a positive correlation, but it is not cause and effect. The lurking variable is the size of the city: a big city has more officers AND more crimes."
},
"np3-1": {
"p": "Which graph shows a good line of best fit?",
"choices": [
"Graph A",
"Graph B",
"Graph C"
],
"a": "Graph A",
"fig": "<div style=\"display:flex;gap:6px;flex-wrap:wrap;justify-content:center\"><div class=\"pfig\" data-fig='{\"type\": \"chart\", \"pw\": 130, \"ph\": 110, \"xmin\": 0, \"xmax\": 9, \"xstep\": 1, \"ymin\": 0, \"ymax\": 10, \"ystep\": 1, \"noXticks\": true, \"noYticks\": true, \"title\": \"A\", \"points\": [[1, 3.4], [2, 3.0], [3, 5.1], [4, 4.8], [5, 6.9], [6, 6.6], [7, 8.7], [8, 8.4]], \"lines\": [{\"m\": 0.9, \"b\": 1.9, \"c\": \"green\"}], \"alt\": \"Graph A: one straight line through the middle of the dots\"}'></div><div class=\"pfig\" data-fig='{\"type\": \"chart\", \"pw\": 130, \"ph\": 110, \"xmin\": 0, \"xmax\": 9, \"xstep\": 1, \"ymin\": 0, \"ymax\": 10, \"ystep\": 1, \"noXticks\": true, \"noYticks\": true, \"title\": \"B\", \"points\": [[1, 3.4], [2, 3.0], [3, 5.1], [4, 4.8], [5, 6.9], [6, 6.6], [7, 8.7], [8, 8.4]], \"lines\": [{\"m\": 0.9, \"b\": 4.2, \"c\": \"blue\"}], \"alt\": \"Graph B: a straight line with every dot below it\"}'></div><div class=\"pfig\" data-fig='{\"type\": \"chart\", \"pw\": 130, \"ph\": 110, \"xmin\": 0, \"xmax\": 9, \"xstep\": 1, \"ymin\": 0, \"ymax\": 10, \"ystep\": 1, \"noXticks\": true, \"noYticks\": true, \"title\": \"C\", \"points\": [[1, 3.4], [2, 3.0], [3, 5.1], [4, 4.8], [5, 6.9], [6, 6.6], [7, 8.7], [8, 8.4]], \"polys\": [{\"pts\": [[1, 3.4], [2, 3.0], [3, 5.1], [4, 4.8], [5, 6.9], [6, 6.6], [7, 8.7], [8, 8.4]], \"c\": \"red\"}], \"alt\": \"Graph C: a zigzag that connects every dot\"}'></div></div>",
"sol": "C connects the dots (a zigzag, not a line). B has every dot below the line. A is one straight line with 4 dots above and 4 below. Graph A."
},
"np3-2": {
"p": "The line of best fit for a plant is y = 3x + 4. x = weeks and y = height in cm. Predict the height at 7 weeks. Type just the number.",
"a": "25",
"show": "25",
"sol": "y = 3x + 4 → y = 3(7) + 4 = 21 + 4 = 25. The plant should be about 25 cm tall."
},
"np3-3": {
"p": "Use the same line, y = 3x + 4. About how many weeks until the plant is 31 cm tall? Type just the number.",
"a": "9",
"show": "9",
"sol": "Set y = 31: 3x + 4 = 31. Subtract 4: 3x = 27. Divide by 3: x = 9. About 9 weeks."
},
"np4-1": {
"p": "100 students were asked if they have a pet. How many 7th graders have a pet? Type just the number.",
"fig": "<table class=\"rules-table np-tw\"><tr><th></th><th>Has a pet</th><th>No pet</th><th>Total</th></tr><tr><td>6th Grade</td><td>21</td><td>29</td><td>50</td></tr><tr><td>7th Grade</td><td>32</td><td>18</td><td>50</td></tr><tr><td><strong>Total</strong></td><td><strong>53</strong></td><td><strong>47</strong></td><td><strong>100</strong></td></tr></table>",
"a": "32",
"show": "32",
"sol": "Row: 7th Grade. Column: Has a pet. The cell where they cross is 32."
},
"np4-2": {
"p": "Same table. What percent of 7th graders have a pet? Type the percent, like 50%.",
"fig": "<table class=\"rules-table np-tw\"><tr><th></th><th>Has a pet</th><th>No pet</th><th>Total</th></tr><tr><td>6th Grade</td><td>21</td><td>29</td><td>50</td></tr><tr><td>7th Grade</td><td>32</td><td>18</td><td>50</td></tr><tr><td><strong>Total</strong></td><td><strong>53</strong></td><td><strong>47</strong></td><td><strong>100</strong></td></tr></table>",
"a": "64%|64|0.64",
"show": "64%",
"sol": "7th graders with a pet ÷ all 7th graders = 32 ÷ 50 = 0.64. × 100 → 64%."
},
"np4-3": {
"p": "Same table. Is there an association between grade and having a pet?",
"fig": "<table class=\"rules-table np-tw\"><tr><th></th><th>Has a pet</th><th>No pet</th><th>Total</th></tr><tr><td>6th Grade</td><td>21</td><td>29</td><td>50</td></tr><tr><td>7th Grade</td><td>32</td><td>18</td><td>50</td></tr><tr><td><strong>Total</strong></td><td><strong>53</strong></td><td><strong>47</strong></td><td><strong>100</strong></td></tr></table>",
"choices": [
"Yes — 64% of 7th graders have a pet, but only 42% of 6th graders do",
"No — both grades have 50 students",
"No — the two grades have about the same percent"
],
"a": "Yes — 64% of 7th graders have a pet, but only 42% of 6th graders do",
"sol": "6th: 21 ÷ 50 = 0.42 = 42%. 7th: 32 ÷ 50 = 0.64 = 64%. The percents are far apart, so yes — grade and having a pet are associated."
},
"np5-1": {
"p": "Each dot is one student. How many students are shown? Type just the number.",
"a": "13",
"show": "13",
"fig": "<div class=\"pfig\" data-fig='{\"type\": \"chart\", \"xmin\": 4, \"xmax\": 10, \"xstep\": 1, \"ymin\": 50, \"ymax\": 100, \"ystep\": 10, \"brk\": true, \"xlabel\": \"Hours of sleep\", \"ylabel\": \"Test score\", \"points\": [[4.5, 64], [5, 70], [5.5, 68], [6, 74], [6.5, 72], [7, 80], [7.5, 77], [8, 86], [8.5, 83], [9, 92], [9.5, 89], [10, 95], [9, 97]], \"alt\": \"Scatter plot of hours of sleep and test score\"}'></div>",
"sol": "Count every dot one at a time: there are 13 dots, so 13 students."
},
"np5-2": {
"p": "On a scatterplot, x = hours practiced and y = goals scored. What does the dot <b>(4, 9)</b> mean?",
"choices": [
"A player practiced 9 hours and scored 4 goals",
"A player practiced 4 hours and scored 9 goals",
"4 players scored 9 goals"
],
"a": "A player practiced 4 hours and scored 9 goals",
"sol": "(x, y) = (4, 9). x = 4 hours practiced, y = 9 goals. One dot = one player."
},
"np5-3": {
"p": "Hours spent practicing piano vs. mistakes made in a song. What type of correlation would you expect?",
"choices": [
"Positive",
"Negative",
"None"
],
"a": "Negative",
"sol": "As practice time goes UP, the number of mistakes goes DOWN. One goes up while the other goes down → negative."
},
"np5-4": {
"p": "One dot is an outlier. Type it as an ordered pair (x, y).",
"a": "(4,2)|4,2",
"show": "(4, 2)",
"ph": "like (3, 5)",
"fig": "<div class=\"pfig\" data-fig='{\"type\": \"chart\", \"xmin\": 0, \"xmax\": 10, \"xstep\": 1, \"ymin\": 0, \"ymax\": 10, \"ystep\": 1, \"ylabelEvery\": 2, \"xlabel\": \"x\", \"ylabel\": \"y\", \"points\": [[1, 8.5], [2, 7.6], [3, 7], [4, 2], [5, 5.4], [6, 4.6], [7, 3.9], [8, 3], [9, 2.2]], \"alt\": \"Scatter plot with a strong negative pattern and one dot far below the rest\"}'></div>",
"sol": "The dots go down in a tight line, but the dot at x = 4 is way down at y = 2. The outlier is (4, 2)."
},
"np5-5": {
"p": "A line of best fit for a phone plan is y = 10x + 25. x = gigabytes used and y = dollars. What does the 25 mean?",
"choices": [
"The plan costs $25 before any data is used",
"Each gigabyte costs $25",
"You use 25 gigabytes"
],
"a": "The plan costs $25 before any data is used",
"sol": "25 is the y-intercept: the cost when x = 0 (no data used). The 10 is the slope: each extra gigabyte adds about $10."
},
"np5-6": {
"p": "Kim used y = 3x + 2 for 4 hours and wrote 3 × 4 + 2 = 3 × 6 = 18. What is the correct prediction? Type just the number.",
"a": "14",
"show": "14",
"sol": "Kim added 4 + 2 first. Multiply first: y = 3(4) + 2 = 12 + 2 = 14. The correct prediction is 14."
},
"np5-7": {
"p": "The line of best fit goes through (0, 10) and (8, 50). Predict y when x = 5. Type just the number.",
"a": "35",
"show": "35",
"sol": "Slope = (50 − 10) ÷ (8 − 0) = 40 ÷ 8 = 5. The y-intercept is 10, so y = 5x + 10. At x = 5: y = 5(5) + 10 = 25 + 10 = 35."
},
"np5-8": {
"p": "Find the missing number in the table. Type just the number.",
"fig": "<table class=\"rules-table np-tw\"><tr><th></th><th>Has a phone</th><th>No phone</th><th>Total</th></tr><tr><td>6th Grade</td><td>14</td><td><strong style=\"color:#B45309\">?</strong></td><td>40</td></tr><tr><td>7th Grade</td><td>23</td><td>17</td><td>40</td></tr><tr><td><strong>Total</strong></td><td><strong>37</strong></td><td><strong>43</strong></td><td><strong>80</strong></td></tr></table>",
"a": "26",
"show": "26",
"sol": "The 6th grade row adds to 40: 14 + ? = 40, so ? = 40 − 14 = 26. Check the column: 26 + 17 = 43 ✓."
},
"np5-9": {
"p": "Students picked a favorite season. What percent of girls prefer winter? Type the percent, like 50%.",
"fig": "<table class=\"rules-table np-tw\"><tr><th></th><th>Summer</th><th>Winter</th><th>Total</th></tr><tr><td>Boys</td><td>18</td><td>12</td><td>30</td></tr><tr><td>Girls</td><td>16</td><td>24</td><td>40</td></tr><tr><td><strong>Total</strong></td><td><strong>34</strong></td><td><strong>36</strong></td><td><strong>70</strong></td></tr></table>",
"a": "60%|60|0.6",
"show": "60%",
"sol": "24 girls prefer winter out of 40 girls: 24 ÷ 40 = 0.6 → 60%."
},
"np5-10": {
"p": "Same table. Boys are more likely to prefer summer. By how many percentage points? Type just the number.",
"fig": "<table class=\"rules-table np-tw\"><tr><th></th><th>Summer</th><th>Winter</th><th>Total</th></tr><tr><td>Boys</td><td>18</td><td>12</td><td>30</td></tr><tr><td>Girls</td><td>16</td><td>24</td><td>40</td></tr><tr><td><strong>Total</strong></td><td><strong>34</strong></td><td><strong>36</strong></td><td><strong>70</strong></td></tr></table>",
"a": "20",
"show": "20",
"sol": "Boys: 18 ÷ 30 = 0.6 = 60%. Girls: 16 ÷ 40 = 0.4 = 40%. 60% − 40% = 20 percentage points. (Use percents, not counts — the groups are different sizes.)"
}
};
