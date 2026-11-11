/* unit8-notes: similar problems for notes-flow.js. Built by _build/notes_twins/build.py — edit there, not here. */
window.NOTE_TWINS = {
"chk1a": {
"p": "<span class=\"badge\">Q1</span> <span class=\"np-lv l1\">Score 3</span> A triangle is rotated 180° about the origin. The pre-image and image are…",
"choices": [
"Similar but not congruent",
"Congruent",
"Neither"
],
"a": "Congruent",
"why": "✓ Rotation is a rigid transformation — size and shape are preserved, so the figures are congruent.",
"fig": "<div class=\"tx\" data-tx='{\"pre\": [[1, 1], [4, 1], [1, 3]], \"names\": \"ABC\", \"ops\": [{\"op\": \"R\", \"deg\": 180, \"cw\": false}], \"win\": [-5, 5, -4, 4], \"alt\": \"a triangle rotated 180 degrees about the origin\"}'></div><div class=\"fig-key\"><b class=\"b\">blue</b> = pre-image · <b class=\"g\">gold dashed</b> = image</div>"
},
"chk1b": {
"p": "<span class=\"badge\">Q2</span> <span class=\"np-lv l1\">Score 3</span> A triangle is dilated by a scale factor of 2. The pre-image and image are…",
"choices": [
"Similar but not congruent",
"Congruent",
"Neither"
],
"a": "Similar but not congruent",
"why": "✓ Dilation is non-rigid — the shape stays the same but size changes, so the figures are similar but not congruent.",
"fig": "<div class=\"tx\" data-tx='{\"pre\": [[1, 1], [3, 1], [1, 3]], \"names\": \"ABC\", \"ops\": [{\"op\": \"D\", \"k\": 2}], \"win\": [-1, 7, -1, 7], \"rule\": true, \"alt\": \"a triangle dilated by 2 from the origin\"}'></div><div class=\"fig-key\"><b class=\"b\">blue</b> = pre-image · <b class=\"g\">gold dashed</b> = image</div>"
},
"p-trans-1": {
"p": "<span class=\"badge\">P1</span> <span class=\"np-lv l1\">Score 3</span> Rectangle WXYZ has vertices W(2, 1), X(5, 1), Y(5, 4), Z(2, 4). Translate the rectangle by the rule (x − 3, y + 2). What are the coordinates of W′?",
"choices": [
"(−1, 3)",
"(5, −1)",
"(−1, −1)",
"(−3, 2)"
],
"a": "(−1, 3)",
"why": "✓ Apply (x − 3, y + 2) to W(2, 1): (2 − 3, 1 + 2) = (−1, 3). Every other vertex shifts the same way.",
"fig": "<div class=\"tx\" data-tx='{\"pre\": [[2, 1], [5, 1], [5, 4], [2, 4]], \"names\": \"WXYZ\", \"ops\": [{\"op\": \"T\", \"h\": -3, \"k\": 2}], \"show\": \"p\", \"reveal\": \"1m\", \"legs\": 0, \"rule\": true, \"hint\": \"the answer picture appears after you answer\", \"win\": [-2, 6, -1, 7], \"alt\": \"rectangle WXYZ on a coordinate plane\"}'></div><div class=\"fig-key\"><b class=\"b\">blue</b> = pre-image · <b class=\"g\">gold dashed</b> = image</div>"
},
"p-trans-2": {
"p": "<span class=\"badge\">P2</span> <span class=\"np-lv l2\">Score 4</span> Hexagon ABCDEF has vertex B(−2, 3). The whole hexagon is translated by (x + 4, y − 3). Type the coordinates of B′.",
"xy": [
2,
0
],
"why": "✓ B(−2, 3) → B′(−2 + 4, 3 − 3) = (2, 0). All six vertices shift by the same rule."
},
"p-trans-3": {
"p": "<span class=\"badge\">P3</span> <span class=\"np-lv l2\">Score 4</span> Parallelogram PQRS was translated to P′Q′R′S′ (shown). P(0, 0) maps to P′(3, −4). Which rule was used?",
"choices": [
"(x + 3, y − 4)",
"(x − 3, y + 4)",
"(x − 4, y + 3)",
"(x + 3, y + 4)"
],
"a": "(x + 3, y − 4)",
"why": "✓ P(0, 0) → P′(3, −4) means x increased by 3 and y decreased by 4. Rule: (x + 3, y − 4).",
"fig": "<div class=\"tx\" data-tx='{\"pre\": [[0, 0], [3, 0], [4, 2], [1, 2]], \"names\": \"PQRS\", \"ops\": [{\"op\": \"T\", \"h\": 3, \"k\": -4}], \"show\": \"p1m\", \"arrows\": [0], \"legs\": 0, \"legsReveal\": true, \"rule\": true, \"ruleReveal\": true, \"hint\": \"the rule appears after you answer\", \"win\": [-1, 8, -5, 3], \"alt\": \"parallelogram PQRS and its image after a translation\"}'></div><div class=\"fig-key\"><b class=\"b\">blue</b> = pre-image · <b class=\"g\">gold dashed</b> = image</div>"
},
"p-refl-1": {
"p": "<span class=\"badge\">P1</span> <span class=\"np-lv l1\">Score 3</span> Rectangle ABCD has vertex B(4, 2). The whole rectangle is reflected over the x-axis. What are the coordinates of B′?",
"choices": [
"(4, −2)",
"(−4, 2)",
"(−4, −2)",
"(2, 4)"
],
"a": "(4, −2)",
"why": "✓ Reflect over the x-axis: (x, y) → (x, −y). B(4, 2) → B′(4, −2).",
"fig": "<div class=\"tx\" data-tx='{\"pre\": [[1, 2], [4, 2], [4, 4], [1, 4]], \"names\": \"ABCD\", \"ops\": [{\"op\": \"Rx\"}], \"show\": \"pm\", \"reveal\": \"1\", \"rule\": true, \"hint\": \"the answer picture appears after you answer\", \"win\": [-1, 6, -5, 5], \"alt\": \"rectangle ABCD and the x-axis mirror\"}'></div><div class=\"fig-key\"><b class=\"b\">blue</b> = pre-image · <b class=\"g\">gold dashed</b> = image</div>"
},
"p-refl-2": {
"p": "<span class=\"badge\">P2</span> <span class=\"np-lv l2\">Score 4</span> Trapezoid KLMN has vertex N(3, 5). The whole trapezoid is reflected over the y-axis. Type the coordinates of N′.",
"xy": [
-3,
5
],
"why": "✓ Reflect over the y-axis: (x, y) → (−x, y). N(3, 5) → N′(−3, 5)."
},
"p-refl-3": {
"p": "<span class=\"badge\">P3</span> <span class=\"np-lv l2\">Score 4</span> Pentagon ABCDE was reflected to A′B′C′D′E′ (shown). Which line is the mirror (line of reflection)?",
"choices": [
"the x-axis",
"the y-axis",
"the line y = x",
"the line y = 2"
],
"a": "the y-axis",
"why": "✓ Each image point has the same y but the opposite x (e.g., C(4, 3) → C′(−4, 3)). That's the rule for reflection over the y-axis.",
"fig": "<div class=\"tx\" data-tx='{\"pre\": [[1, 1], [3, 1], [4, 3], [2, 5], [0, 3]], \"names\": \"ABCDE\", \"ops\": [{\"op\": \"Ry\"}], \"show\": \"p1\", \"reveal\": \"m\", \"hint\": \"the mirror line appears after you answer\", \"win\": [-6, 6, -1, 6], \"alt\": \"pentagon ABCDE and its reflection\"}'></div><div class=\"fig-key\"><b class=\"b\">blue</b> = pre-image · <b class=\"g\">gold dashed</b> = image</div>"
},
"p-rot-1": {
"p": "<span class=\"badge\">P1</span> <span class=\"np-lv l2\">Score 4</span> Rectangle PQRS has vertex Q(4, 1). The whole rectangle is rotated 180° about the origin. What are the coordinates of Q′?",
"choices": [
"(−4, −1)",
"(4, −1)",
"(−1, −4)",
"(1, 4)"
],
"a": "(−4, −1)",
"why": "✓ 180° rule: (x, y) → (−x, −y). Q(4, 1) → Q′(−4, −1). Both signs flip.",
"fig": "<div class=\"tx\" data-tx='{\"pre\": [[2, 1], [4, 1], [4, 4], [2, 4]], \"names\": \"PQRS\", \"ops\": [{\"op\": \"R\", \"deg\": 180, \"cw\": false}], \"turnAt\": 1, \"show\": \"pm\", \"reveal\": \"1\", \"rule\": true, \"hint\": \"the answer picture appears after you answer\", \"win\": [-5, 5, -5, 5], \"alt\": \"rectangle PQRS on a coordinate plane\"}'></div><div class=\"fig-key\"><b class=\"b\">blue</b> = pre-image · <b class=\"g\">gold dashed</b> = image</div>"
},
"p-rot-2": {
"p": "<span class=\"badge\">P2</span> <span class=\"np-lv l3\">Score 5</span> L-shape ABCDEF has vertex C(3, 4). The whole shape is rotated 90° counterclockwise (CCW) about the origin. Type the coordinates of C′.",
"xy": [
-4,
3
],
"why": "✓ 90° CCW rule: (x, y) → (−y, x). C(3, 4) → C′(−4, 3). Every vertex follows the same rule."
},
"p-rot-3": {
"p": "<span class=\"badge\">P3</span> <span class=\"np-lv l2\">Score 4</span> Trapezoid ABCD was rotated to A′B′C′D′ (shown). All rotations are about the origin. Which rotation was used?",
"choices": [
"90° clockwise (CW)",
"90° counterclockwise (CCW)",
"180°",
"270° counterclockwise (CCW)"
],
"a": "90° counterclockwise (CCW)",
"why": "✓ Check A(1, 1) → A′(−1, 1). The rule (x, y) → (−y, x) is 90° CCW. Also matches B(4, 1) → B′(−1, 4).",
"fig": "<div class=\"tx\" data-tx='{\"pre\": [[1, 1], [4, 1], [3, 3], [2, 3]], \"names\": \"ABCD\", \"ops\": [{\"op\": \"R\", \"deg\": 90, \"cw\": false}], \"turnAt\": 0, \"show\": \"p1\", \"reveal\": \"m\", \"hint\": \"the turn appears after you answer\", \"win\": [-5, 5, -1, 5], \"alt\": \"trapezoid ABCD and its rotated image\"}'></div><div class=\"fig-key\"><b class=\"b\">blue</b> = pre-image · <b class=\"g\">gold dashed</b> = image</div>"
},
"chk5a": {
"p": "<span class=\"badge\">P1</span> <span class=\"np-lv l2\">Score 4</span> Triangle ABC has vertices A(1, 2), B(3, 0), C(−1, −1). The triangle is dilated by scale factor k = 3 (centered at origin). What are the new coordinates of A′?",
"choices": [
"(3, 6)",
"(4, 5)",
"(1, 6)",
"(⅓, ⅔)"
],
"a": "(3, 6)",
"why": "✓ Multiply both coordinates by 3: A′ = (1 · 3, 2 · 3) = (3, 6). Apply the same rule to B and C: B′(9, 0), C′(−3, −3).",
"fig": "<div class=\"tx\" data-tx='{\"pre\": [[1, 2], [3, 0], [-1, -1]], \"names\": \"ABC\", \"ops\": [{\"op\": \"D\", \"k\": 3}], \"show\": \"pm\", \"reveal\": \"1\", \"rule\": true, \"hint\": \"the answer picture appears after you answer\", \"win\": [-4, 10, -4, 7], \"alt\": \"triangle ABC on a coordinate plane\"}'></div><div class=\"fig-key\"><b class=\"b\">blue</b> = pre-image · <b class=\"g\">gold dashed</b> = image</div>"
},
"chk5b": {
"p": "<span class=\"badge\">P2</span> <span class=\"np-lv l3\">Score 5</span> Triangle ABC has vertices A(2, 6), B(8, −6), C(−4, 0). The triangle is dilated by k = ¹⁄₂ (centered at origin). Type the new coordinates of vertex B′:",
"xy": [
4,
-3
],
"why": "✓ Multiply both coordinates by ½: B(8, −6) → B′(4, −3)."
},
"chk5c": {
"p": "<span class=\"badge\">P3</span> <span class=\"np-lv l1\">Score 3</span> A figure is dilated and the image is larger than the pre-image. The scale factor k must be…",
"choices": [
"greater than 1",
"equal to 1",
"between 0 and 1",
"negative"
],
"a": "greater than 1",
"why": "✓ A scale factor greater than 1 (like 2 or 3.5) produces an enlargement — the image is bigger."
},
"chk6a": {
"p": "<span class=\"badge\">P1</span> <span class=\"np-lv l2\">Score 4</span> Triangle A has side lengths 5, 12, 13. Triangle B has side lengths 15, 36, 39 and the same angles. Triangles A and B are…",
"choices": [
"congruent",
"similar",
"neither"
],
"a": "similar",
"why": "✓ Same shape, but B's sides are 3× A's sides. They are similar (related by a dilation with k = 3) but NOT congruent."
},
"chk6b": {
"p": "<span class=\"badge\">P2</span> <span class=\"np-lv l2\">Score 4</span> A triangle is reflected over the y-axis, then translated 3 units down. The pre-image and image are…",
"choices": [
"congruent",
"similar but not congruent",
"neither"
],
"a": "congruent",
"why": "✓ Both transformations are rigid (no dilation). Size and shape are preserved → congruent."
},
"chk6c": {
"p": "<span class=\"badge\">P3</span> <span class=\"np-lv l1\">Score 3</span> Which transformation can change the size of a figure?",
"choices": [
"translation",
"reflection",
"rotation",
"dilation"
],
"a": "dilation",
"why": "✓ Dilation is the only one that resizes the figure (changes side lengths). Translations, reflections and rotations keep the same size."
},
"chk6d": {
"p": "<span class=\"badge\">P4</span> <span class=\"np-lv l3\">Score 5</span> A hexagon undergoes a sequence: rotation 180°, translation 4 units left, then reflection over the x-axis. The pre-image and image are…",
"choices": [
"congruent",
"similar but not congruent",
"neither"
],
"a": "congruent",
"why": "✓ Rotations, translations and reflections are all rigid. No dilation, so size and shape stay the same → congruent."
},
"chk6e": {
"p": "<span class=\"badge\">P5</span> <span class=\"np-lv l3\">Score 5</span> A triangle is rotated 180° and then dilated by k = 3. How does the AREA of the image compare with the pre-image?",
"choices": [
"The same",
"3 times as large",
"6 times as large",
"9 times as large"
],
"a": "9 times as large",
"why": "✓ The rotation keeps the size. The dilation triples the base AND the height, so the area is 3 × 3 = 9 times as large."
},
"chk6f": {
"p": "<span class=\"badge\">P6</span> <span class=\"np-lv l3\">Score 5</span> Point P(1, 3) is translated 2 units up, then reflected over the x-axis. Do you get the same image if you reflect FIRST and then translate?",
"choices": [
"Yes. The order never matters.",
"Yes. Both give (1, −5).",
"No. Translate then reflect gives (1, −5). Reflect then translate gives (1, −1).",
"No. Translate then reflect gives (−1, 5)."
],
"a": "No. Translate then reflect gives (1, −5). Reflect then translate gives (1, −1).",
"why": "✓ Translate first: (1, 3) → (1, 5) → (1, −5). Reflect first: (1, 3) → (1, −3) → (1, −1). The order can change the image."
},
"chk6g": {
"p": "<span class=\"badge\">P7</span> <span class=\"np-lv l3\">Score 5</span> Rectangle PQRS is mapped to WXYZ by a reflection and then a dilation by k = 2. Mia says the rectangles are congruent. Who is right?",
"choices": [
"Mia is right. A reflection is rigid.",
"Mia is wrong. The dilation changes the size, so they are similar but not congruent.",
"Mia is right. Rectangles are always congruent.",
"Mia is wrong. They are neither congruent nor similar."
],
"a": "Mia is wrong. The dilation changes the size, so they are similar but not congruent.",
"why": "✓ One dilation is enough to change the size. The shape stays the same, so the rectangles are similar, not congruent."
}
};
