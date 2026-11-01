module.exports = {
1: `{
        n:1, type:"mc", standard:"8.SP.1", topic:"Statistics", dok:1, page:3, answer:"C",
        prompt:"Look at the four scatterplots. Which graph shows a negative association?",
        choices:{A:"Graph A",B:"Graph B",C:"Graph C",D:"Graph D"},
        hint:"A negative association trends downward as x increases.",
        explain:{
          setup:"A scatterplot shows a NEGATIVE association when y-values DECREASE as x-values INCREASE — the cloud of points falls from upper-left to lower-right.",
          steps:[
            "Look at each scatterplot's overall trend left-to-right.",
            "<b>Positive</b>: points rise. <b>Negative</b>: points fall. <b>None</b>: random scatter with no direction.",
            "<b>A</b> rises. <b>B</b> has no pattern. <b>D</b> goes up, then down.",
            "Pick the only graph where the cloud descends as x grows."
          ],
          result:"Graph C is the answer because its points fall steadily as x increases — the signature of a negative association."
        }
      }`,
4: `{
        n:4, type:"mc", standard:"8.F.1", topic:"Functions", dok:1, page:6, answer:"B",
        prompt:"Look at the four graphs. In which graph is y NOT a function of x?",
        choices:{A:"Graph A",B:"Graph B",C:"Graph C",D:"Graph D"},
        hint:"Use the vertical line test.",
        explain:{
          setup:"<b>Vertical Line Test:</b> y is a function of x only if every vertical line you can draw crosses the graph AT MOST once. Two crossings = two y-values for one x = NOT a function.",
          steps:[
            "Imagine sliding a vertical line across each graph.",
            "If the line ever hits the graph twice at the same x, that graph fails the test.",
            "Sideways parabolas, circles, and ellipses all fail. Lines, regular parabolas, and curves like y = √x pass.",
            "<b>A</b> (a slanted line), <b>C</b> (a U-shape opening up), and <b>D</b> (a flat line) are crossed only once. <b>B</b> is a U-shape turned on its side. The line x = 1 crosses it two times."
          ],
          result:"<b>Graph B</b> is the only graph where a vertical line crosses twice — so it's NOT a function."
        }
      }`,
7: `{
        n:7, type:"mc", standard:"8.G.3", topic:"Transformations", dok:3, page:10, answer:"D",
        prompt:"Triangle EGH has E(−4, 0), G(−4, 3), and H(−2, 0). Three moves map it onto triangle MPT, with M(7, 5), P(1, 5), and T(7, 9). Move 2 is a dilation by a scale factor of 2 about the origin. Move 3 is a translation 7 units right and 13 units up. What is move 1?",
        choices:{A:"Reflection across the x-axis",B:"Reflection across the y-axis",C:"90° clockwise rotation about the origin",D:"90° counterclockwise rotation about the origin"},
        hint:"Work backward from M. Undo the slide, then undo the dilation.",
        explain:{
          setup:"Dilations and translations DON'T change orientation — they only scale and slide. So move 1 is the one that turns or flips EGH. Work backward from M to see where move 1 sent E.",
          steps:[
            "Undo move 3 (slide back 7 left, 13 down): M(7, 5) → (7 − 7, 5 − 13) = (0, −8).",
            "Undo move 2 (divide by 2): (0, −8) → (0, −4). So move 1 sent E(−4, 0) to (0, −4).",
            "A 90° counterclockwise turn sends (x, y) → (−y, x). E(−4, 0) → (0, −4). ✓",
            "Check G: (−4, 3) → (−3, −4) → × 2 → (−6, −8) → slide → (1, 5) = P. ✓ Check H: (−2, 0) → (0, −2) → (0, −4) → (7, 9) = T. ✓",
            "The others miss: clockwise sends E to (0, 4). Reflecting across the x-axis leaves E at (−4, 0). Reflecting across the y-axis sends E to (4, 0)."
          ],
          result:"<b>D — 90° counterclockwise rotation</b> is the only first step that produces MPT's orientation after the dilation and translation."
        }
      }`,
11: `{
        n:11, type:"fr", standard:"8.EE.1", topic:"Exponents", dok:3, page:14, answer:"0.1",
        prompt:"Find the value of 2⁻³ × 5⁻³ × 10². Write your answer as a decimal.",
        hint:"Use exponent rules before multiplying.",
        explain:{
          setup:"Use the exponent rules: <span class='math'>aⁿ × bⁿ = (a × b)ⁿ</span>, <span class='math'>aᵐ × aⁿ = aᵐ⁺ⁿ</span>, and <span class='math'>a⁻ⁿ = 1/aⁿ</span>.",
          steps:[
            "2⁻³ and 5⁻³ have the same exponent. Multiply the bases: <span class='math'>2⁻³ × 5⁻³ = (2 × 5)⁻³ = 10⁻³</span>.",
            "Now both are powers of 10. Add the exponents: <span class='math'>10⁻³ × 10² = 10⁻¹</span>.",
            "A negative exponent means \\"1 over\\": <span class='math'>10⁻¹ = 1/10 = 0.1</span>.",
            "Check another way: 2⁻³ = 1/8 and 5⁻³ = 1/125. Then 1/8 × 1/125 = 1/1,000, and 1/1,000 × 100 = 1/10. ✓"
          ],
          result:"Final value: <b>0.1</b> (or 1/10)."
        }
      }`,
12: `{
        n:12, type:"fr", standard:"8.F.4", topic:"Slope", dok:1, page:14, answer:"3.5",
        prompt:"The table shows y as a linear function of x. What is the slope?",
        hint:"Slope is change in y divided by change in x.",
        explain:{
          setup:"For a linear function from a table: <span class='math'>slope = Δy / Δx = (y₂ − y₁) / (x₂ − x₁)</span>.",
          steps:[
            "Pick two rows from the table: (2, 5) and (4, 12).",
            "Change in y: 12 − 5 = 7.",
            "Change in x: 4 − 2 = 2.",
            "Divide: 7 ÷ 2 = 3.5. Check with the next rows: (19 − 12) ÷ (6 − 4) = 7 ÷ 2 = 3.5. ✓"
          ],
          result:"Slope = <b>3.5</b> — y increases by 3.5 for every 1-unit increase in x."
        }
      }`,
14: `{
        n:14, type:"fr", standard:"8.EE.1", topic:"Exponents", dok:1, page:15, answer:"81",
        prompt:"Find the value of 9³ ÷ 3².",
        hint:"Rewrite with the same base, then simplify.",
        explain:{
          setup:"When two terms have the same base but different exponents, combine them with the product (add exponents) or quotient (subtract exponents) rules.",
          steps:[
            "9 is 3 × 3, so 9 = 3². Rewrite: <span class='math'>9³ = (3²)³ = 3⁶</span>.",
            "Same base, so subtract the exponents: <span class='math'>3⁶ ÷ 3² = 3⁴</span>.",
            "<span class='math'>3⁴ = 3 × 3 × 3 × 3 = 81</span>.",
            "Check: 9³ = 729 and 3² = 9. 729 ÷ 9 = 81. ✓"
          ],
          result:"Final value: <b>81</b> (which is 3⁴)."
        }
      }`,
15: `{
        n:15, type:"fr", standard:"8.F.4", topic:"Linear functions", dok:1, page:16, answer:"20",
        prompt:"A linear function passes through the points in the table. What is the y-intercept?",
        hint:"Find the slope, then work back to x = 0.",
        explain:{
          setup:"To find the y-intercept of a linear function from a table: (1) find the slope, (2) use a point and slope to write y = mx + b, (3) solve for b.",
          steps:[
            "Slope: (32 − 26) ÷ (4 − 2) = 6 ÷ 2 = 3.",
            "Use the point (2, 26): 26 = 3(2) + b, so 26 = 6 + b.",
            "Subtract 6: b = 20.",
            "Or step back: from x = 2 to x = 0 is 2 steps back, so y goes down 6. 26 − 6 = 20."
          ],
          result:"y-intercept: <b>20</b> — when x = 0, y = 20."
        }
      }`,
17: `{
        n:17, type:"fr", standard:"8.EE.7", topic:"Equations", dok:1, page:18, answer:"-12",
        prompt:"Solve for x:  ½x − 3 = x + 3",
        hint:"Clear fractions first, then combine like terms.",
        explain:{
          setup:"Solving multi-step equations: clear fractions, combine like terms, get x alone, then check.",
          steps:[
            "Clear the fraction. Multiply every term by 2: <span class='math'>x − 6 = 2x + 6</span>.",
            "Subtract x from both sides: <span class='math'>−6 = x + 6</span>.",
            "Subtract 6 from both sides: <span class='math'>−12 = x</span>.",
            "Check: ½(−12) − 3 = −6 − 3 = −9, and −12 + 3 = −9. ✓"
          ],
          result:"x = <b>−12</b>."
        }
      }`,
19: `{
        n:19, type:"fr", standard:"8.G.5", topic:"Angle relationships", dok:2, page:20, answer:"67",
        prompt:"Lines R and S are parallel. Line Q cuts across both. One angle is 113°. What is the value of x?",
        hint:"Use corresponding, alternate interior, or supplementary angle relationships.",
        explain:{
          setup:"When parallel lines are cut by a transversal: corresponding angles are EQUAL, alternate interior angles are EQUAL, alternate exterior angles are EQUAL, and same-side (co-interior) angles are SUPPLEMENTARY (sum to 180°).",
          steps:[
            "At line R, the 113° angle sits next to another angle along R. Together they make a straight line, so they add to 180°.",
            "That angle is 180° − 113° = 67°.",
            "The 67° angle at R and the x° angle at S are in the same spot at each crossing (above the line, left of Q). They are corresponding angles, so they are equal.",
            "So x = 67."
          ],
          result:"x = <b>67°</b>."
        }
      }`,
22: `{
        n:22, type:"mc", standard:"8.G.3", topic:"Dilations", dok:2, page:23, answer:"D",
        prompt:"A pentagon has vertices (1, 1), (3, 1), (4, 3), (2, 4), and (1, 3). Which graph shows the pentagon after it is dilated with respect to the origin by a scale factor of 2? (The dashed shape is the original.)",
        choices:{A:"Graph A",B:"Graph B",C:"Graph C",D:"Graph D"},
        hint:"A dilation from the origin doubles both x- and y-coordinates.",
        explain:{
          setup:"A dilation centered at the origin with scale factor k sends every point <span class='math'>(x, y) → (kx, ky)</span>. Distances from the origin are MULTIPLIED by k; the shape is similar (same angles, proportional sides).",
          steps:[
            "Multiply each vertex by 2: (1, 1) → (2, 2), (3, 1) → (6, 2), (4, 3) → (8, 6), (2, 4) → (4, 8), (1, 3) → (2, 6).",
            "<b>A</b> is smaller — that is a scale factor of ½.",
            "<b>B</b> is the same size, just slid 2 right and 2 up.",
            "<b>C</b> doubles only the x-values, so it is stretched sideways.",
            "The image must be twice as far from the origin and twice as wide/tall as the original."
          ],
          result:"<b>D</b> is the only choice where every vertex is doubled in both coordinates."
        }
      }`,
25: `{
        n:25, type:"mc", standard:"8.SP.4", topic:"Two-way tables", dok:2, page:28, answer:"A",
        prompt:"A school has 250 students. 65 play football, 40 play basketball, and 12 play both. Which two-way table represents the data?",
        choices:{A:"Table A",B:"Table B",C:"Table C",D:"Table D"},
        hint:"The cell where both rows and columns are 'yes' should hold 12.",
        explain:{
          setup:"A two-way table cross-classifies two yes/no variables. Build it from the totals: each cell uses inclusion-exclusion.",
          steps:[
            "Football AND basketball: <b>12</b>.",
            "Football only: 65 − 12 = <b>53</b>.",
            "Basketball only: 40 − 12 = <b>28</b>.",
            "Neither: 250 − (53 + 28 + 12) = 250 − 93 = <b>157</b>.",
            "Match those four numbers to a choice. Row and column totals should still hit 65, 40, 250.",
            "<b>B</b> has a football total of 77. <b>C</b> has a basketball total of 81. <b>D</b> has a grand total of 238."
          ],
          result:"<b>A</b> is the only table whose row, column, and grand totals all match."
        }
      }`,
27: `{
        n:27, type:"mc", standard:"8.F.5", topic:"Graphs", dok:2, page:31, answer:"D",
        prompt:"Alex rode at a constant speed, sped up to reach a friend, then stopped to talk. Which distance–time graph best shows the ride?",
        choices:{A:"Graph A",B:"Graph B",C:"Graph C",D:"Graph D"},
        hint:"Look for steady increase, then steeper increase, then a flat section.",
        explain:{
          setup:"On a distance-vs-time graph: a constant speed is a straight line with positive slope; speeding up makes a steeper line; stopping makes a HORIZONTAL line (distance unchanged).",
          steps:[
            "Section 1 (constant speed): straight, gently rising line.",
            "Section 2 (sped up): straight line, but with a STEEPER slope.",
            "Section 3 (stopped): a flat (horizontal) segment — distance stays the same as time passes.",
            "Eliminate any graph that decreases (Alex didn't go backward). <b>A</b> stops in the middle. <b>B</b> goes back down at the end. <b>C</b> gets less steep (slows down)."
          ],
          result:"<b>D</b> is the only graph showing rise → steeper rise → flat."
        }
      }`,
31: `{
        n:31, type:"mc", standard:"8.F.2", topic:"Slope", dok:2, page:36, answer:"D",
        prompt:"The table shows a linear function. Which choice is a function with a slope two times the slope of the function in the table?",
        choices:{A:"y = 3x − 2",B:"y = (²⁄₃)x − 1",C:"y = (²⁄₃)x + 1",D:"y = 6x − 4"},
        hint:"Find the table's slope first, then double it.",
        explain:{
          setup:"Step 1: find the table's slope using <span class='math'>m = Δy / Δx</span>. Step 2: double that slope. Step 3: pick the equation whose slope (the coefficient of x) equals the doubled value.",
          steps:[
            "Pick two table rows: (1, 1) and (2, 4).",
            "Table slope: (4 − 1) ÷ (2 − 1) = 3 ÷ 1 = 3. Every row goes up 3.",
            "Double: 2 × 3 = 6.",
            "Find the equation with slope 6 → y = 6x − 4.",
            "Watch out: A, y = 3x − 2, is the table's own line. Its slope is 3, not 6."
          ],
          result:"<b>D: y = 6x − 4</b>."
        }
      }`,
33: `{
        n:33, type:"mc", standard:"8.SP.1", topic:"Statistics", dok:1, page:38, answer:"B",
        prompt:"Look at the four scatterplots. Which graph shows a positive association?",
        choices:{A:"Graph A",B:"Graph B",C:"Graph C",D:"Graph D"},
        hint:"A positive association trends upward as x increases.",
        explain:{
          setup:"<b>Positive association:</b> as x grows, y grows — points rise from lower-left to upper-right.",
          steps:[
            "Scan each graph for an overall direction.",
            "Eliminate graphs that fall (negative) or scatter randomly (no association). <b>A</b> falls. <b>C</b> has no pattern. <b>D</b> stays flat.",
            "Pick the only graph where points climb steadily as x increases."
          ],
          result:"<b>B</b> is the graph where the cloud rises left-to-right."
        }
      }`,
37: `{
        n:37, type:"mc", standard:"8.SP.2", topic:"Scatterplots", dok:2, page:43, answer:"B",
        prompt:"Which choice best models the data in the scatterplot?",
        choices:{A:"y = x − 4",B:"y = x + 4",C:"y = 2x − 4",D:"y = 2x + 4"},
        hint:"Estimate both the slope and y-intercept from the trend.",
        explain:{
          setup:"To match a line of best fit to an equation: estimate the slope (rise/run) and the y-intercept (where the line crosses the y-axis).",
          steps:[
            "Where does the trend cross the y-axis? Near (0, 4). So b ≈ 4. That rules out A and C (they start at −4).",
            "Slope: the trend goes from about 4 at x = 0 to about 14 at x = 10. Rise 10 ÷ run 10 = 1.",
            "D has slope 2. At x = 10 it gives 24 — far above the dots.",
            "Slope ≈ 1 and y-intercept ≈ 4 → y = x + 4."
          ],
          result:"<b>B: y = x + 4</b> — slope 1 and y-intercept 4."
        }
      }`,
41: `{
        n:41, type:"mc", standard:"8.G.5", topic:"Angle relationships", dok:2, page:47, answer:"C",
        prompt:"Two lines cross at point A. Side AB of triangle ABC is extended past point B. Use the angles shown. What is the measure of angle z?",
        choices:{A:"15°",B:"36°",C:"69°",D:"75°"},
        hint:"Use angle relationships from intersecting lines and triangle angle sums.",
        explain:{
          setup:"Multi-step angle problems use: vertical angles equal, linear pairs sum to 180°, parallel-line relationships, and triangle angles sum to 180°.",
          steps:[
            "At A, the 36° angle and the angle inside the triangle are vertical angles. So the inside angle at A is 36°.",
            "At B, the 105° angle and the inside angle make a straight line. So the inside angle at B is 180° − 105° = 75°.",
            "The three angles of a triangle add to 180°: z = 180° − 36° − 75°.",
            "z = 69°. (Check: the outside angle 105° = 36° + 69°. ✓)"
          ],
          result:"z = <b>69°</b>."
        }
      }`,
43: `{
        n:43, type:"mc", standard:"8.G.3", topic:"Transformations", dok:2, page:48, answer:"D",
        prompt:"Triangle PQR has P(−3, −4), Q(−1, −1), and R(−5, −1). It is reflected over the y-axis and then translated 2 units right. What are the coordinates of P′?",
        choices:{A:"(−5, 4)",B:"(−1, 4)",C:"(1, −4)",D:"(5, −4)"},
        hint:"Reflect across y-axis: change x's sign. Then add 2 to x.",
        explain:{
          setup:"Two transformations applied in order: (1) reflection over y-axis sends <span class='math'>(x, y) → (−x, y)</span>; (2) translation 2 right sends <span class='math'>(x, y) → (x + 2, y)</span>.",
          steps:[
            "Reflect P(−3, −4) over the y-axis: change the sign of x → (3, −4).",
            "Translate 2 units right: add 2 to x → (3 + 2, −4) = (5, −4).",
            "The y-value never changes in either move, so P′ must still have y = −4. That rules out A and B.",
            "C, (1, −4), comes from moving 2 left instead of right."
          ],
          result:"<b>D: (5, −4)</b>."
        }
      }`
};
