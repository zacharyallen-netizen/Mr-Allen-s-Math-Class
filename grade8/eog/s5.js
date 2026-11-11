/* SCORE 5 QUESTIONS for the Unit EOG Practice sets (Nov 11, 2026). Mr. Allen: "even the easier sections, I would like a
   few Score 5 questions." Two per set, added as a last part ("Score 5"), written from his proficiency scales: explain or
   justify, combine skills, or say what an answer means in a real situation. Version 1 = four choices and a Hint.
   Version 2 keeps its "Read this first" box and three choices. Every wrong choice says what went wrong.
   These are NOT from the "EOG Unit Practice" PDFs or their answer key (node _build/eog_units/test_key.js checks them). */
(function () {
  var S5 = {
    1: { std: "NC.8.NS.1–2",
      v1: [
        { id: "u1s1", text: "Which statement is <b>true</b>?", hint: "Test each one with an example, like √25, 0.333… and π/2.",
          opts: [{ h: "Every square root is irrational.", why: "√25 = 5 is rational. Only square roots of numbers that are NOT perfect squares are irrational." },
                 { h: "Every repeating decimal is rational.", ok: 1 },
                 { h: "A number can be both rational and irrational.", why: "A decimal either stops or repeats (rational), or it does neither (irrational). It cannot be both." },
                 { h: "Every fraction with π in it is rational.", why: "A rational number is a ratio of two INTEGERS. π is not an integer." }],
          ok: "A repeating decimal can always be written as a fraction (the 9’s rule), so it is rational.", mist: "Thinking the √ sign always means irrational." },
        { id: "u1s2", text: "Maya says √52 ≈ 7.2. Which work shows her estimate is good?", hint: "To check a square root, square the estimate.",
          opts: [{ h: "7.2² = 51.84, which is very close to 52.", ok: 1 },
                 { h: "7² = 49 and 8² = 64, so any number from 7 to 8 is a good estimate.", why: "That only shows √52 is between 7 and 8. Squaring 7.2 shows how CLOSE it is." },
                 { h: "7.2 × 2 = 14.4, so the estimate is wrong.", why: "Squaring means 7.2 × 7.2, not 7.2 × 2." },
                 { h: "52 ÷ 2 = 26, so the estimate should be 26.", why: "√52 is not half of 52. It is the number that times itself makes 52." }],
          ok: "7.2 × 7.2 = 51.84. That is only 0.16 away from 52, so 7.2 is a good estimate.", mist: "Doubling instead of squaring." }
      ],
      v2: [
        { id: "u1t1", box: "A rational number can be written as a fraction of two <b>integers</b>. π is not an integer.", text: "Is π/3 rational or irrational?",
          opts: [{ h: "Rational. It is written as a fraction.", why: "A fraction is rational only when the top AND the bottom are integers." },
                 { h: "Irrational. The top, π, is not an integer.", ok: 1 },
                 { h: "Rational. 3 is an integer.", why: "The bottom is an integer, but the top (π) is not." }],
          ok: "π is irrational, so π/3 is not a ratio of two integers. It is irrational." },
        { id: "u1t2", box: "To put numbers in order, change each one to a decimal. √10 ≈ 3.16 and π ≈ 3.14.", text: "Which list is in order from least to greatest?",
          opts: [{ h: "π, √10, 3.2", ok: 1 }, { h: "√10, π, 3.2", why: "3.16 is more than 3.14, so π comes before √10." }, { h: "3.2, √10, π", why: "That is greatest to least. Start with the smallest." }],
          ok: "3.14 < 3.16 < 3.2, so the order is π, √10, 3.2." }
      ] },
    2: { std: "NC.8.EE.1 · NC.8.EE.4",
      v1: [
        { id: "u2s1", text: "Which shows why 4⁰ = 1?", hint: "Use the quotient rule: when you divide powers with the same base, subtract the exponents.",
          opts: [{ h: "4 × 0 = 0, and 0 + 1 = 1.", why: "An exponent does not mean “multiply by the exponent”. Use 4³ ÷ 4³ = 4⁰." },
                 { h: "4¹ = 4, so 4⁰ is 4 − 3 = 1.", why: "Going down one exponent DIVIDES by 4. It does not subtract. 4 ÷ 4 = 1." },
                 { h: "4³ ÷ 4³ = 4⁰, and a number divided by itself is 1.", ok: 1 },
                 { h: "It is a rule to memorize. There is no reason.", why: "There is a reason: 4³ ÷ 4³ = 4⁰ by the quotient rule, and that division equals 1." }],
          ok: "4³ ÷ 4³ = 4³⁻³ = 4⁰. Any number (not 0) divided by itself is 1, so 4⁰ = 1.", mist: "Treating 4⁰ as 4 × 0." },
        { id: "u2s2", text: "A factory makes 4 × 10⁵ bottles each day. How many bottles does it make in 3 × 10² days?", hint: "Multiply the front numbers. Add the exponents. Then check the front number is less than 10.",
          opts: [{ h: "12 × 10⁷", why: "The value is right, but it is not in scientific notation. The front number must be less than 10." },
                 { h: "1.2 × 10⁷", why: "When 12 becomes 1.2, the exponent goes UP by one: 10⁸." },
                 { h: "7 × 10⁷", why: "Multiply the front numbers: 4 × 3 = 12. Do not add them." },
                 { h: "1.2 × 10⁸", ok: 1 }],
          ok: "4 × 3 = 12 and 10⁵ × 10² = 10⁷. Then 12 × 10⁷ = 1.2 × 10⁸ bottles.", steps: ["Multiply the front numbers: 4 × 3 = 12.", "Add the exponents: 5 + 2 = 7.", "12 × 10⁷ = 1.2 × 10⁸."], mist: "Stopping at 12 × 10⁷." }
      ],
      v2: [
        { id: "u2t1", box: "A negative exponent means a reciprocal: 2⁻³ = 1/2³. It does <b>not</b> make the answer negative.", text: "Jo says 2⁻³ = −8. What is the right value?",
          opts: [{ h: "−8", why: "A negative exponent does not make a negative number. It moves the power to the bottom of a fraction." }, { h: "−6", why: "An exponent is not 2 × (−3)." }, { h: "1/8", ok: 1 }],
          ok: "2⁻³ = 1/2³ = 1/8." },
        { id: "u2t2", box: "To multiply in scientific notation: multiply the front numbers, then ADD the exponents. If the front number is 10 or more, move the decimal and add 1 to the exponent.", text: "(5 × 10³) × (4 × 10²) = ?",
          opts: [{ h: "20 × 10⁵", why: "Not in scientific notation yet. 20 is not less than 10." }, { h: "2 × 10⁶", ok: 1 }, { h: "2 × 10⁵", why: "When 20 becomes 2, the exponent goes up by one: 10⁶." }],
          ok: "5 × 4 = 20 and 10³ × 10² = 10⁵. Then 20 × 10⁵ = 2 × 10⁶." }
      ] },
    3: { std: "NC.8.EE.7",
      v1: [
        { id: "u3s1", text: "What number can go in the box so that 3(x + 4) = 3x + ▢ has <b>no solution</b>?", hint: "Distribute the left side first. No solution means the x-terms match but the numbers do not.",
          opts: [{ h: "only 12", why: "With 12, both sides are 3x + 12. That gives infinitely many solutions, not none." },
                 { h: "any number except 12", ok: 1 },
                 { h: "only 0", why: "0 works, but so does every other number that is not 12." },
                 { h: "no number works", why: "Try 5: 3x + 12 = 3x + 5 is never true. So 5 works." }],
          ok: "3(x + 4) = 3x + 12. If the box is not 12, the x-terms match but the numbers do not: no solution.", mist: "Mixing up no solution (different numbers) and infinitely many (same numbers)." },
        { id: "u3s2", text: "Plan A costs $20 a month plus $0.10 for each text. Plan B costs $35 a month with free texts. Solving 20 + 0.10t = 35 gives t = 150. What does 150 mean?", hint: "t is the number of texts. What is true about the two plans when t = 150?",
          opts: [{ h: "Plan A always costs $150.", why: "150 is a number of texts, not dollars." },
                 { h: "You save $150 with Plan B.", why: "150 is a number of texts. At 150 texts the plans cost the same, so nothing is saved." },
                 { h: "At 150 texts, the two plans cost the same.", ok: 1 },
                 { h: "You can send at most 150 texts.", why: "The equation finds where the costs are equal. It does not set a limit." }],
          ok: "At t = 150, Plan A costs 20 + 0.10(150) = $35, the same as Plan B.", mist: "Reading the solution as dollars instead of texts." }
      ],
      v2: [
        { id: "u3t1", box: "Simplify both sides. Same x-terms and same numbers → infinitely many solutions. Same x-terms but different numbers → no solution.", text: "How many solutions does 2(x + 3) = 2x + 6 have?",
          opts: [{ h: "infinitely many", ok: 1 }, { h: "no solution", why: "No solution needs different numbers. Here both sides are 2x + 6." }, { h: "exactly one", why: "One solution needs different x-terms. Both sides have 2x." }],
          ok: "2(x + 3) = 2x + 6. Both sides are the same, so every number works." },
        { id: "u3t2", box: "A solution tells you something real. Here x is the number of weeks.", text: "Sam has $40 and saves $10 a week. Kim has $70 and saves $5 a week. Solving 40 + 10x = 70 + 5x gives x = 6. What does that mean?",
          opts: [{ h: "Sam saves $6 a week.", why: "x is the number of weeks. Sam saves $10 a week." }, { h: "After 6 weeks, they have the same amount.", ok: 1 }, { h: "Kim has $6 more than Sam.", why: "x = 6 is a number of weeks, not dollars." }],
          ok: "After 6 weeks Sam has 40 + 60 = $100 and Kim has 70 + 30 = $100." }
      ] },
    4: { std: "NC.8.G.5",
      v1: [
        { id: "u4s1", text: "Why do the three angles of <b>every</b> triangle add to 180°?", hint: "Think about a line through the top vertex that is parallel to the base.",
          opts: [{ h: "A triangle has 3 angles, and 3 × 60° = 180°.", why: "Only an equilateral triangle has three 60° angles. The sum is 180° for every triangle." },
                 { h: "A line through the top vertex, parallel to the base, makes three angles on a straight line that match the triangle’s angles.", ok: 1 },
                 { h: "A triangle is half of a circle, and half of 360° is 180°.", why: "A triangle is not half of a circle. Use parallel lines and alternate interior angles." },
                 { h: "Every triangle has one 90° angle and two 45° angles.", why: "Most triangles have no right angle at all. Their angles still add to 180°." }],
          ok: "The two outside angles on that line equal the base angles (alternate interior angles). A straight line is 180°.", mist: "Giving one example instead of a reason that works for every triangle." },
        { id: "u4s2", text: "Lines m and n are parallel. Two same-side interior angles are (2x + 30)° and (3x − 10)°. What is the <b>larger</b> angle?", hint: "Same-side interior angles add to 180°. Solve for x, then find both angles.",
          opts: [{ h: "32°", why: "That is x. Put x back into each angle." },
                 { h: "86°", why: "That is the smaller angle. The other one is 2(32) + 30." },
                 { h: "94°", ok: 1 },
                 { h: "110°", why: "You set the angles equal. Same-side interior angles ADD to 180°." }],
          ok: "(2x + 30) + (3x − 10) = 180 → 5x + 20 = 180 → x = 32. The angles are 94° and 86°.", steps: ["Add the angles: 5x + 20 = 180.", "Solve: 5x = 160, so x = 32.", "2(32) + 30 = 94 and 3(32) − 10 = 86. The larger is 94°."], mist: "Stopping at x = 32." }
      ],
      v2: [
        { id: "u4t1", box: "An exterior angle of a triangle equals the two far (remote) inside angles <b>added together</b>.", text: "The remote angles are 50° and 65°. Kay says the exterior angle is 65°, because 180 − 50 − 65 = 65. What is the right answer?",
          opts: [{ h: "65°", why: "That is the THIRD inside angle. The exterior angle is the two remote angles added." }, { h: "15°", why: "Add the remote angles. Do not subtract them." }, { h: "115°", ok: 1 }],
          ok: "50° + 65° = 115°." },
        { id: "u4t2", box: "Vertical angles are equal. Angles on a straight line add to 180°.", text: "Two lines cross. One angle is 70°. What are the other three angles?",
          opts: [{ h: "70°, 110°, 110°", ok: 1 }, { h: "70°, 70°, 70°", why: "Only the angle across (vertical) is 70°. The neighbors are 180 − 70 = 110°." }, { h: "110°, 110°, 110°", why: "The angle across from 70° is also 70° (vertical angles)." }],
          ok: "The vertical angle is 70°. Each neighbor is 180° − 70° = 110°." }
      ] },
    5: { std: "NC.8.G.6–7",
      v1: [
        { id: "u5s1", text: "A triangle has sides 8, 15 and 18. Is it a right triangle? Pick the best reason.", hint: "The longest side must be c. Check whether a² + b² equals c².",
          opts: [{ h: "Yes. 8, 15, 17 is a right triangle, and 18 is close to 17.", why: "Close is not enough. The two sides of a² + b² = c² must be exactly equal." },
                 { h: "Yes. 8 + 15 is more than 18.", why: "That only shows the sides can make a triangle. Check the squares." },
                 { h: "No. 8² + 15² = 289, but 18² = 324.", ok: 1 },
                 { h: "No. 8² + 18² is not equal to 15².", why: "The answer is right, but the check is not. The LONGEST side is c." }],
          ok: "64 + 225 = 289. 18² = 324. They are not equal, so it is not a right triangle.", mist: "Putting the longest side in the wrong place." },
        { id: "u5s2", text: "A box is 6 in long, 8 in wide and 24 in tall. What is the longest diagonal inside the box?", hint: "Find the diagonal of the bottom first. Then use it with the height.",
          opts: [{ h: "10 in", why: "That is the diagonal of the bottom. Use it with the height: 10² + 24²." },
                 { h: "26 in", ok: 1 },
                 { h: "38 in", why: "Do not add the sides. Use the Pythagorean Theorem twice." },
                 { h: "about 25.3 in", why: "That uses only 8 and 24. Find the diagonal of the bottom (6 and 8) first." }],
          ok: "Bottom: 6² + 8² = 100, so 10. Then 10² + 24² = 676, and √676 = 26 in.", steps: ["Bottom diagonal: √(36 + 64) = 10.", "Box diagonal: √(10² + 24²) = √676.", "√676 = 26 in."], mist: "Stopping after the first triangle." }
      ],
      v2: [
        { id: "u5t1", box: "In a² + b² = c², c is always the LONGEST side (the hypotenuse). To find a leg, subtract.", text: "A right triangle has a leg of 9 and a hypotenuse of 15. Ty adds: 9² + 15² = 306. What should he do?",
          opts: [{ h: "Nothing. The other leg is √306.", why: "15 is the hypotenuse, so it goes alone as c². Subtract to find a leg." }, { h: "Subtract: 15² − 9² = 144, so the leg is 12.", ok: 1 }, { h: "Add the sides: 9 + 15 = 24.", why: "Use the squares, and subtract because you are finding a leg." }],
          ok: "225 − 81 = 144 and √144 = 12." },
        { id: "u5t2", box: "The distance between two points is the hypotenuse of a right triangle. Count across and up to get the legs.", text: "From (1, 2) to (4, 6) is 3 across and 4 up. What is the distance?",
          opts: [{ h: "7", why: "Do not add the legs. Use 3² + 4²." }, { h: "25", why: "25 is c². Take the square root." }, { h: "5", ok: 1 }],
          ok: "3² + 4² = 25 and √25 = 5." }
      ] },
    6: { std: "NC.8.F.3–4",
      v1: [
        { id: "u6s1", text: "A line passes through (2, 7) and (6, 15). What is its y-intercept?", hint: "Find the slope first. Then use y = mx + b with one of the points to find b.",
          opts: [{ h: "2", why: "That is the slope. Now use 7 = 2(2) + b to find b." },
                 { h: "7", why: "7 is the y-value when x = 2. The y-intercept is the y-value when x = 0." },
                 { h: "3", ok: 1 },
                 { h: "−3", why: "Check the sign: 7 = 4 + b, so b = 3." }],
          ok: "Slope = (15 − 7) ÷ (6 − 2) = 2. Then 7 = 2(2) + b, so b = 3.", steps: ["Slope: (15 − 7) ÷ (6 − 2) = 2.", "Put in (2, 7): 7 = 2(2) + b.", "7 = 4 + b, so b = 3."], mist: "Stopping at the slope." },
        { id: "u6s2", text: "A pool holds 500 gallons and drains 25 gallons each minute: y = −25x + 500. The graph crosses the x-axis at (20, 0). What does that point mean?", hint: "At that point y = 0. What does y stand for?",
          opts: [{ h: "The pool starts with 20 gallons.", why: "The start is the y-intercept: 500 gallons at 0 minutes." },
                 { h: "The pool drains 20 gallons each minute.", why: "The rate is the slope: 25 gallons each minute." },
                 { h: "After 500 minutes, 20 gallons are left.", why: "The point is (20, 0): x = 20 minutes and y = 0 gallons." },
                 { h: "After 20 minutes, the pool is empty.", ok: 1 }],
          ok: "x = 20 minutes and y = 0 gallons. Check: 500 − 25(20) = 0.", mist: "Mixing up the two intercepts." }
      ],
      v2: [
        { id: "u6t1", box: "In y = mx + b, <b>m</b> is the rate (how much y changes each time x goes up 1) and <b>b</b> is the start (y when x = 0).", text: "A taxi costs y = 2x + 5 dollars for x miles. What do the 2 and the 5 mean?",
          opts: [{ h: "$5 for each mile, plus a $2 starting fee", why: "You switched them. The number WITH x (2) is the rate." }, { h: "$2 for each mile, plus a $5 starting fee", ok: 1 }, { h: "2 miles cost $5", why: "Put in x = 2: y = 2(2) + 5 = $9." }],
          ok: "The 2 is with x, so it is the cost for each mile. The 5 is the fee at 0 miles." },
        { id: "u6t2", box: "A linear function changes by the SAME amount each time. Look at how y changes.", text: "x: 1, 2, 3, 4 and y: 2, 4, 8, 16. Is the table linear? Why?",
          opts: [{ h: "Yes. y goes up every time.", why: "Going up is not enough. It must go up by the SAME amount each time." }, { h: "Yes. Each y is double the one before.", why: "Doubling is not adding the same amount. The change grows: 2, 4, 8." }, { h: "No. y goes up by 2, then 4, then 8.", ok: 1 }],
          ok: "The change is not constant (2, 4, 8), so the table is nonlinear." }
      ] },
    7: { std: "NC.8.SP.2 · NC.8.SP.4",
      v1: [
        { id: "u7s1", text: "Two lines are drawn on a scatter plot. Line A is close to the points, with about half above it and half below. Line B goes through the first and last points, but most points are below it. Which line fits better?", hint: "A good line goes through the middle of the points.",
          opts: [{ h: "Line A. The points are close to it and balanced above and below.", ok: 1 },
                 { h: "Line B. It touches two of the points.", why: "Touching points does not matter. Being CLOSE to all of them does." },
                 { h: "Line B. A line of best fit must start at the first point.", why: "It does not have to pass through any point." },
                 { h: "They fit the same. Both are straight lines.", why: "Compare how close the points are to each line." }],
          ok: "A line of best fit follows the middle of the data: close to the points, with points on both sides.", mist: "Thinking the line must touch the points." },
        { id: "u7s2", text: "In a survey, 30 of 40 seventh graders and 20 of 40 eighth graders ride the bus. Is there an association between grade and riding the bus?", hint: "Find the percent of each grade that rides the bus. Then compare.",
          opts: [{ h: "No. Both grades have 40 students.", why: "Equal group sizes do not mean no association. Compare the percents." },
                 { h: "No. 50 students ride the bus in all.", why: "The total does not show an association. Compare the two grades." },
                 { h: "Yes. 80 students were asked.", why: "The number asked does not show an association. Compare the percents." },
                 { h: "Yes. 75% of 7th graders ride the bus, but only 50% of 8th graders do.", ok: 1 }],
          ok: "30 ÷ 40 = 75% and 20 ÷ 40 = 50%. The percents are very different, so there is an association.", mist: "Looking at totals instead of the percent of each group." }
      ],
      v2: [
        { id: "u7t1", box: "A line of best fit goes through the MIDDLE of the points. It does not have to touch them.", text: "A line touches only 1 of 10 points. The other points are very close to it, some above and some below. Is it a good fit?",
          opts: [{ h: "No. It should touch every point.", why: "A line of best fit almost never touches every point." }, { h: "Yes. The points are close to the line and balanced.", ok: 1 }, { h: "No. It should touch at least half of the points.", why: "There is no rule about touching. Close and balanced is what matters." }],
          ok: "Close to the points with some above and some below = a good fit." },
        { id: "u7t2", box: "In a trend line y = mx + b, the slope m tells how much y changes for each 1 more of x.", text: "Test score: y = 5x + 60, where x is hours studied. What does the 5 mean?",
          opts: [{ h: "A student who studies 0 hours scores 5.", why: "That is the y-intercept, and it is 60." }, { h: "Students study for 5 hours.", why: "5 is the slope: points gained for each hour." }, { h: "The score goes up about 5 points for each hour studied.", ok: 1 }],
          ok: "The slope is 5: about 5 more points for each extra hour." }
      ] },
    8: { std: "NC.8.G.2–3",
      v1: [
        { id: "u8s1", text: "A triangle is dilated by a scale factor of 3. How does its <b>area</b> change?", hint: "Both the base and the height are multiplied by 3.",
          opts: [{ h: "It stays the same.", why: "A dilation by 3 makes every side 3 times as long, so the area grows." },
                 { h: "It is 3 times as large.", why: "The sides are 3 times as long. Area uses two lengths, so it grows by 3 × 3." },
                 { h: "It is 6 times as large.", why: "Multiply 3 × 3, not 3 × 2." },
                 { h: "It is 9 times as large.", ok: 1 }],
          ok: "Base × 3 and height × 3, so the area is 3 × 3 = 9 times as large.", mist: "Using the scale factor itself for the area." },
        { id: "u8s2", text: "Figure A is rotated 90°, then translated, then reflected to make Figure B. Which statement is true?", hint: "Is any step a dilation?",
          opts: [{ h: "A and B are similar but not congruent, because there are three steps.", why: "The number of steps does not matter. Only a dilation changes the size." },
                 { h: "A and B are congruent, because every step is a rigid motion.", ok: 1 },
                 { h: "A and B are not congruent, because a reflection flips the figure.", why: "A flipped figure is still the same size and shape. Reflections are rigid." },
                 { h: "You cannot tell without measuring.", why: "You can tell: turns, slides and flips never change side lengths or angles." }],
          ok: "Rotations, translations and reflections keep every length and angle, so the figures are congruent.", mist: "Thinking many steps change the size." }
      ],
      v2: [
        { id: "u8t1", box: "Rigid moves (slide, flip, turn) keep the size. A dilation changes the size but keeps the shape.", text: "A square is reflected and then dilated by a scale factor of 2. The image and the square are…",
          opts: [{ h: "congruent", why: "The dilation doubled every side, so the size changed." }, { h: "similar, but not congruent", ok: 1 }, { h: "neither similar nor congruent", why: "A dilation keeps the shape, so they are similar." }],
          ok: "Same shape, different size: similar but not congruent." },
        { id: "u8t2", box: "To dilate, MULTIPLY both coordinates by the scale factor.", text: "Ray dilated (4, 6) by a scale factor of ½ and got (4.5, 6.5). What is the right image?",
          opts: [{ h: "(4.5, 6.5)", why: "Ray added ½. Multiply instead." }, { h: "(8, 12)", why: "That multiplies by 2. A scale factor of ½ makes the figure smaller." }, { h: "(2, 3)", ok: 1 }],
          ok: "4 × ½ = 2 and 6 × ½ = 3." }
      ] },
    9: { std: "NC.8.G.9",
      v1: [
        { id: "u9s1", text: "A cylinder and a cone have the same radius and the same height. The cylinder holds 90π cm³. How much does the cone hold?", hint: "Compare the formulas: πr²h and ⅓πr²h.",
          opts: [{ h: "30π cm³", ok: 1 },
                 { h: "45π cm³", why: "A cone is one THIRD of the cylinder, not one half." },
                 { h: "90π cm³", why: "The cone comes to a point, so it holds less: one third as much." },
                 { h: "270π cm³", why: "The cone holds LESS than the cylinder. Divide by 3." }],
          ok: "A cone holds ⅓ of the cylinder with the same radius and height: 90π ÷ 3 = 30π cm³.", mist: "Multiplying by 3 instead of dividing." },
        { id: "u9s2", text: "The radius of a sphere is doubled. How many times as large is the new volume?", hint: "V = ⁴⁄₃πr³. The radius is used three times.",
          opts: [{ h: "2 times", why: "The radius is cubed, so doubling it multiplies the volume by 2 × 2 × 2." },
                 { h: "4 times", why: "That would be r². A sphere uses r³: 2 × 2 × 2." },
                 { h: "6 times", why: "Multiply 2 × 2 × 2, not 2 × 3." },
                 { h: "8 times", ok: 1 }],
          ok: "(2r)³ = 8r³, so the volume is 8 times as large.", mist: "Doubling the volume because the radius doubled." }
      ],
      v2: [
        { id: "u9t1", box: "Cylinder: V = πr²h. The radius is squared, so doubling the radius makes the volume 2 × 2 = 4 times as large.", text: "A cylinder has r = 3 and h = 5, so V = 45π. What is the volume if the radius is doubled to 6?",
          opts: [{ h: "90π", why: "The radius is squared, so the volume is 4 times as large, not 2." }, { h: "180π", ok: 1 }, { h: "360π", why: "Only the radius doubled. The height is still 5." }],
          ok: "π(6)²(5) = 180π. That is 4 × 45π." },
        { id: "u9t2", box: "The radius is HALF of the diameter. Sphere: V = ⁴⁄₃πr³.", text: "A ball has a diameter of 6 cm. Lee used r = 6 and got 288π. What is the right volume?",
          opts: [{ h: "288π cm³", why: "That uses the diameter as the radius. The radius is 3." }, { h: "12π cm³", why: "Cube the radius: 3 × 3 × 3 = 27, not 3 × 3 = 9." }, { h: "36π cm³", ok: 1 }],
          ok: "r = 3, so V = ⁴⁄₃π(27) = 36π cm³." }
      ] }
  };
  EOGU.s5 = S5;
  Object.keys(EOGU.data).forEach(function (n) {
    var d = EOGU.data[n], s = S5[n]; if (!s || d.s5done) return; d.s5done = true;
    s.v1.forEach(function (q) { q.tag = "Score 5"; }); s.v2.forEach(function (q) { q.tag = "Score 5"; });
    d.v1.parts.push({ title: "Score 5: explain your thinking", std: s.std, calc: true, s5: true, qs: s.v1 });
    d.v2.parts.push({ title: "Score 5: read the box, then choose A, B or C", std: s.std, s5: true, qs: s.v2 });
  });
})();
