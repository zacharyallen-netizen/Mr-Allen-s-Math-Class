/* unit4-notes: similar problems for notes-flow.js. Built by _build/notes_twins/build.py — edit there, not here. */
window.NOTE_TWINS = {
"np1-1": {
"p": "The two angles are complementary. Find x. Type just the number.",
"fig": "<div data-geo='{\"type\": \"rays\", \"rays\": [{\"deg\": 0}, {\"deg\": 34}, {\"deg\": 90}], \"angles\": [{\"from\": 0, \"to\": 34, \"label\": \"34°\", \"c\": \"blue\"}, {\"from\": 34, \"to\": 90, \"label\": \"x°\", \"c\": \"gold\"}], \"alt\": \"a right angle split into 34 degrees and x degrees\", \"right\": [[0, 90]], \"maxW\": 260}'></div>",
"a": "56",
"show": "56",
"sol": "Complementary angles add to 90°. x + 34 = 90, so x = 90 − 34 = 56."
},
"np1-2": {
"p": "Two lines cross. Find x.",
"fig": "<div data-geo='{\"type\": \"cross\", \"theta\": 75, \"angles\": [{\"q\": 1, \"label\": \"75°\", \"c\": \"blue\"}, {\"q\": 3, \"label\": \"(x + 30)°\", \"c\": \"gold\"}], \"alt\": \"two crossing lines; a 75 degree angle and its vertical angle x plus 30\", \"maxW\": 260}'></div>",
"a": "45",
"show": "45",
"sol": "The angles are across from each other, so they are vertical angles. Vertical angles are equal: x + 30 = 75. Subtract 30 from both sides: x = 45."
},
"np1-3": {
"p": "The two angles form a linear pair. Find x.",
"fig": "<div data-geo='{\"type\": \"rays\", \"rays\": [{\"deg\": 0}, {\"deg\": 131}, {\"deg\": 180}], \"angles\": [{\"from\": 0, \"to\": 131, \"label\": \"(4x − 5)°\", \"c\": \"blue\"}, {\"from\": 131, \"to\": 180, \"label\": \"(x + 15)°\", \"c\": \"gold\"}], \"alt\": \"a linear pair: angles 4x minus 5 and x plus 15\", \"maxW\": 300}'></div>",
"a": "34",
"show": "34",
"sol": "A linear pair adds to 180°. (4x − 5) + (x + 15) = 180. Combine like terms: 5x + 10 = 180. Subtract 10: 5x = 170. Divide by 5: x = 34. Check: 4(34) − 5 = 131° and 34 + 15 = 49°, and 131° + 49° = 180° ✓"
},
"np2-1": {
"p": "Lines m and n are parallel. What kind of angle pair are ∠4 and ∠6?",
"choices": [
"Corresponding",
"Alternate interior",
"Same-side interior"
],
"a": "Same-side interior",
"fig": "<div data-geo='{\"type\": \"parallel\", \"theta\": 60, \"numbers\": true, \"marks\": {\"4\": \"4\", \"6\": \"6\"}, \"colors\": {\"4\": \"gold\", \"6\": \"gold\"}, \"lineNames\": [\"m\", \"n\"], \"tName\": \"t\", \"alt\": \"parallel lines m and n cut by transversal t, angles 4 and 6 shaded\", \"maxW\": 380}'></div>",
"sol": "∠4 and ∠6 are both between the parallel lines (interior). They are on the SAME side of t. So they are same-side interior angles, and they add to 180°."
},
"np2-2": {
"p": "Lines m and n are parallel. Find x.",
"fig": "<div data-geo='{\"type\": \"parallel\", \"theta\": 70, \"marks\": {\"3\": \"70°\", \"7\": \"x°\"}, \"colors\": {\"3\": \"blue\", \"7\": \"gold\"}, \"lineNames\": [\"m\", \"n\"], \"tName\": \"t\", \"alt\": \"parallel lines cut by a transversal: 70 degrees and x in matching corners\", \"maxW\": 380}'></div>",
"a": "70",
"show": "70",
"sol": "The 70° angle and x are in the same corner at each crossing, so they are corresponding angles. Corresponding angles are equal: x = 70."
},
"np2-3": {
"p": "Lines m and n are parallel. Find x.",
"fig": "<div data-geo='{\"type\": \"parallel\", \"theta\": 70, \"gap\": 80, \"marks\": {\"3\": \"(2x + 20)°\", \"6\": \"(4x − 30)°\"}, \"colors\": {\"3\": \"blue\", \"6\": \"gold\"}, \"lineNames\": [\"m\", \"n\"], \"tName\": \"t\", \"alt\": \"alternate interior angles 2x plus 20 and 4x minus 30\", \"maxW\": 380}'></div>",
"a": "25",
"show": "25",
"sol": "Alternate interior angles are equal: 2x + 20 = 4x − 30. Subtract 2x: 20 = 2x − 30. Add 30: 50 = 2x. Divide by 2: x = 25. Check: 2(25) + 20 = 70° and 4(25) − 30 = 70° ✓"
},
"np2-4": {
"p": "Lines m and n are parallel. Find x. Then find the measure of the angle marked (3x + 10)°.",
"fig": "<div data-geo='{\"type\": \"parallel\", \"theta\": 50, \"gap\": 80, \"marks\": {\"4\": \"(3x + 10)°\", \"6\": \"(x + 10)°\"}, \"colors\": {\"4\": \"blue\", \"6\": \"gold\"}, \"lineNames\": [\"m\", \"n\"], \"tName\": \"t\", \"alt\": \"same-side interior angles 3x plus 10 and x plus 10\", \"maxW\": 380}'></div>",
"a": "130",
"show": "130",
"sol": "Both angles are between the lines on the same side of t, so they are same-side interior angles. They add to 180°: (3x + 10) + (x + 10) = 180 → 4x + 20 = 180 → 4x = 160 → x = 40. The angle is 3(40) + 10 = 130°. Check: the other angle is 40 + 10 = 50°, and 130° + 50° = 180° ✓"
},
"np3-1": {
"p": "Find x. Type just the number.",
"fig": "<div data-geo='{\"type\": \"triangle\", \"A\": 52, \"B\": 71, \"angles\": {\"A\": \"52°\", \"B\": \"71°\", \"C\": \"x°\"}, \"colors\": {\"A\": \"blue\", \"B\": \"green\", \"C\": \"gold\"}, \"alt\": \"triangle with angles 52, 71 and x degrees\", \"maxW\": 270}'></div>",
"a": "57",
"show": "57",
"sol": "The angles of a triangle add to 180°. x + 52 + 71 = 180 → x + 123 = 180 → x = 57."
},
"np3-2": {
"p": "The exterior (outside) angle is 126°. Find x.",
"fig": "<div data-geo='{\"type\": \"triangle\", \"A\": 64, \"B\": 54, \"angles\": {\"A\": \"x°\", \"C\": \"62°\"}, \"colors\": {\"A\": \"gold\", \"C\": \"blue\"}, \"exterior\": {\"at\": \"B\", \"label\": \"126°\", \"c\": \"green\"}, \"alt\": \"triangle with exterior angle 126 degrees and far inside angles x and 62\", \"maxW\": 320}'></div>",
"a": "64",
"show": "64",
"sol": "Exterior Angle Theorem: the outside angle = the sum of the two far (remote) inside angles. x + 62 = 126. Subtract 62: x = 64."
},
"np3-3": {
"p": "Find x. Then find the measure of the exterior angle, (2x + 20)°.",
"fig": "<div data-geo='{\"type\": \"triangle\", \"A\": 40, \"B\": 90, \"angles\": {\"A\": \"40°\", \"C\": \"(x + 15)°\"}, \"colors\": {\"A\": \"blue\", \"C\": \"green\"}, \"exterior\": {\"at\": \"B\", \"label\": \"(2x + 20)°\", \"c\": \"gold\"}, \"alt\": \"triangle with far inside angles 40 and x plus 15 and exterior angle 2x plus 20\", \"maxW\": 330}'></div>",
"a": "90",
"show": "90",
"sol": "Exterior angle = sum of the two far inside angles: 2x + 20 = 40 + (x + 15). Simplify: 2x + 20 = x + 55. Subtract x: x + 20 = 55. Subtract 20: x = 35. Exterior angle = 2(35) + 20 = 90°. Check: 40 + (35 + 15) = 90 ✓"
},
"np4-1": {
"p": "Are these two triangles similar?",
"choices": [
"Yes — two pairs of angles match",
"No — they are different sizes",
"You can’t tell"
],
"a": "Yes — two pairs of angles match",
"fig": "<div data-geo='{\"type\": \"similar\", \"A\": 40, \"B\": 80, \"k\": 1.4, \"angles\": {\"A\": \"40°\", \"B\": \"80°\"}, \"colors\": {\"A\": \"blue\", \"B\": \"green\"}, \"left\": {\"names\": [\"A\", \"B\", \"C\"]}, \"right\": {\"names\": [\"D\", \"E\", \"F\"]}, \"alt\": \"two triangles of different sizes, each with 40 and 80 degree angles\", \"maxW\": 380}'></div>",
"sol": "∠A = ∠D = 40° and ∠B = ∠E = 80°. Two pairs of angles match, so the triangles are similar by AA. Size does not matter."
},
"np4-2": {
"p": "△ABC ~ △DEF. Find the measure of ∠F.",
"fig": "<div data-geo='{\"type\": \"similar\", \"A\": 55, \"B\": 63, \"k\": 1.35, \"left\": {\"names\": [\"A\", \"B\", \"C\"], \"angles\": {\"A\": \"55°\", \"B\": \"63°\"}, \"colors\": {\"A\": \"blue\", \"B\": \"green\"}}, \"right\": {\"names\": [\"D\", \"E\", \"F\"], \"angles\": {\"C\": \"?\"}, \"colors\": {\"C\": \"gold\"}}, \"caption\": \"F matches C\", \"alt\": \"similar triangles ABC and DEF; angle A is 55, angle B is 63, angle F is unknown\", \"maxW\": 380}'></div>",
"a": "62",
"show": "62",
"sol": "∠C = 180 − 55 − 63 = 62°. ∠F corresponds to ∠C, so ∠F = 62°."
},
"np4-3": {
"p": "The triangles are similar. Side 4 matches side 10, and side 8 matches side x. Find x.",
"fig": "<div data-geo='{\"type\": \"similar\", \"A\": 60, \"B\": 70, \"k\": 1.6, \"left\": {\"sides\": {\"AB\": \"4\", \"CA\": \"8\"}}, \"right\": {\"sides\": {\"AB\": \"10\", \"CA\": \"x\"}}, \"caption\": \"4 → 10 and 8 → x\", \"alt\": \"similar triangles with sides 4 and 8, and 10 and x\", \"maxW\": 380}'></div>",
"a": "20",
"show": "20",
"sol": "Scale factor = 10 ÷ 4 = 2.5. So x = 8 × 2.5 = 20."
},
"np4-4": {
"p": "Triangle 1 shows 50° and 60°. Triangle 2 shows 50° and 75°. Lia says they ARE similar. Is Lia right?",
"choices": [
"Yes — they are similar",
"No — they are not similar"
],
"a": "No — they are not similar",
"fig": "<div data-geo='{\"type\": \"triangle\", \"A\": 50, \"B\": 60, \"base\": 200, \"angles\": {\"A\": \"50°\", \"B\": \"60°\", \"C\": \"?\"}, \"colors\": {\"A\": \"blue\", \"B\": \"green\", \"C\": \"gold\"}, \"names\": [\"\", \"\", \"\"], \"alt\": \"triangle with angles 50 and 60\", \"maxW\": 210}'></div><div data-geo='{\"type\": \"triangle\", \"A\": 50, \"B\": 75, \"base\": 200, \"angles\": {\"A\": \"50°\", \"B\": \"75°\", \"C\": \"?\"}, \"colors\": {\"A\": \"blue\", \"B\": \"green\", \"C\": \"gold\"}, \"names\": [\"\", \"\", \"\"], \"alt\": \"triangle with angles 50 and 75\", \"maxW\": 210}'></div>",
"sol": "Triangle 1: third angle = 180 − 50 − 60 = 70°, so its angles are 50°, 60°, 70°. Triangle 2: third angle = 180 − 50 − 75 = 55°, so its angles are 50°, 75°, 55°. Only one pair (50°) matches. They are NOT similar, so Lia is not right."
},
"np5-1": {
"p": "The two angles are supplementary. Find x.",
"fig": "<div data-geo='{\"type\": \"rays\", \"rays\": [{\"deg\": 0}, {\"deg\": 52}, {\"deg\": 180}], \"angles\": [{\"from\": 0, \"to\": 52, \"label\": \"52°\", \"c\": \"blue\"}, {\"from\": 52, \"to\": 180, \"label\": \"x°\", \"c\": \"gold\"}], \"alt\": \"supplementary angles 52 degrees and x\", \"maxW\": 300}'></div>",
"a": "128",
"show": "128",
"sol": "Supplementary angles add to 180°. x + 52 = 180, so x = 180 − 52 = 128."
},
"np5-2": {
"p": "Two lines cross. Find x.",
"fig": "<div data-geo='{\"type\": \"cross\", \"theta\": 64, \"angles\": [{\"q\": 1, \"label\": \"64°\", \"c\": \"blue\"}, {\"q\": 2, \"label\": \"x°\", \"c\": \"gold\"}], \"alt\": \"two crossing lines; 64 degrees and the angle x next to it\", \"maxW\": 260}'></div>",
"a": "116",
"show": "116",
"sol": "x and 64° sit side by side on a straight line, so they are a linear pair. x + 64 = 180, so x = 116. (They are not vertical angles — vertical angles are across from each other.)"
},
"np5-3": {
"p": "Lines m and n are parallel. Find x.",
"fig": "<div data-geo='{\"type\": \"parallel\", \"theta\": 57, \"marks\": {\"1\": \"123°\", \"8\": \"x°\"}, \"colors\": {\"1\": \"blue\", \"8\": \"gold\"}, \"lineNames\": [\"m\", \"n\"], \"tName\": \"t\", \"alt\": \"alternate exterior angles 123 degrees and x\", \"maxW\": 380}'></div>",
"a": "123",
"show": "123",
"sol": "The angles are outside the parallel lines and on opposite sides of t, so they are alternate exterior angles. They are equal: x = 123."
},
"np5-4": {
"p": "Lines m and n are parallel. Find x.",
"fig": "<div data-geo='{\"type\": \"parallel\", \"theta\": 76, \"marks\": {\"1\": \"104°\", \"5\": \"(3x + 14)°\"}, \"colors\": {\"1\": \"blue\", \"5\": \"gold\"}, \"lineNames\": [\"m\", \"n\"], \"tName\": \"t\", \"alt\": \"corresponding angles 104 degrees and 3x plus 14\", \"maxW\": 380}'></div>",
"a": "30",
"show": "30",
"sol": "The angles are in the same corner at each crossing, so they are corresponding angles and are equal. 3x + 14 = 104. Subtract 14: 3x = 90. Divide by 3: x = 30."
},
"np5-5": {
"p": "Lines m and n are parallel. Jay says x = 65 because the angles “look the same.” Find the correct value of x.",
"fig": "<div data-geo='{\"type\": \"parallel\", \"theta\": 115, \"marks\": {\"4\": \"65°\", \"6\": \"x°\"}, \"colors\": {\"4\": \"blue\", \"6\": \"gold\"}, \"lineNames\": [\"m\", \"n\"], \"tName\": \"t\", \"alt\": \"same-side interior angles 65 degrees and x\", \"maxW\": 380}'></div>",
"a": "115",
"show": "115",
"sol": "The angles are between the lines and on the same side of t, so they are same-side interior angles. Those add to 180°, they are not equal. x + 65 = 180, so x = 115. Jay’s mistake: he set them equal."
},
"np5-6": {
"p": "Find x. (The square corner is a right angle.)",
"fig": "<div data-geo='{\"type\": \"triangle\", \"A\": 41, \"B\": 90, \"angles\": {\"A\": \"41°\", \"C\": \"x°\"}, \"colors\": {\"A\": \"blue\", \"C\": \"gold\"}, \"alt\": \"right triangle with a 41 degree angle and angle x\", \"maxW\": 250}'></div>",
"a": "49",
"show": "49",
"sol": "A right angle is 90°. x + 41 + 90 = 180 → x + 131 = 180 → x = 49."
},
"np5-7": {
"p": "Find the exterior angle x.",
"fig": "<div data-geo='{\"type\": \"triangle\", \"A\": 44, \"B\": 68, \"angles\": {\"A\": \"44°\", \"C\": \"68°\"}, \"colors\": {\"A\": \"blue\", \"C\": \"green\"}, \"exterior\": {\"at\": \"B\", \"label\": \"x°\", \"c\": \"gold\"}, \"alt\": \"triangle with inside angles 44 and 68 and exterior angle x\", \"maxW\": 320}'></div>",
"a": "112",
"show": "112",
"sol": "Exterior Angle Theorem: x = 44 + 68 = 112."
},
"np5-8": {
"p": "Find x.",
"fig": "<div data-geo='{\"type\": \"triangle\", \"A\": 30, \"B\": 90, \"angles\": {\"A\": \"x°\", \"B\": \"3x°\", \"C\": \"60°\"}, \"colors\": {\"A\": \"gold\", \"B\": \"green\", \"C\": \"blue\"}, \"alt\": \"triangle with angles x, 3x and 60 degrees\", \"maxW\": 270}'></div>",
"a": "30",
"show": "30",
"sol": "The angles add to 180°: x + 3x + 60 = 180. Combine like terms: 4x + 60 = 180. Subtract 60: 4x = 120. Divide by 4: x = 30. Check: 30 + 90 + 60 = 180 ✓"
},
"np5-9": {
"p": "△JKL ~ △MNP. Find x.",
"fig": "<div data-geo='{\"type\": \"similar\", \"A\": 58, \"B\": 47, \"k\": 1.35, \"left\": {\"names\": [\"J\", \"K\", \"L\"], \"angles\": {\"A\": \"58°\", \"B\": \"47°\"}, \"colors\": {\"A\": \"blue\", \"B\": \"green\"}}, \"right\": {\"names\": [\"M\", \"N\", \"P\"], \"angles\": {\"C\": \"x°\"}, \"colors\": {\"C\": \"gold\"}}, \"caption\": \"P matches L\", \"alt\": \"similar triangles JKL and MNP; angle J is 58, angle K is 47, angle P is x\", \"maxW\": 380}'></div>",
"a": "75",
"show": "75",
"sol": "∠L = 180 − 58 − 47 = 75°. ∠P corresponds to ∠L, so x = 75."
},
"np5-10": {
"p": "A 6 ft person casts a 3 ft shadow. At the same time, a pole casts an 18 ft shadow. The two triangles are similar (AA). How tall is the pole? Type just the number.",
"fig": "<div data-geo='{\"type\": \"similar\", \"A\": 63.43, \"B\": 90, \"k\": 1.7, \"left\": {\"names\": [\"\", \"\", \"\"], \"sides\": {\"AB\": \"3 ft\", \"BC\": \"6 ft\"}}, \"right\": {\"names\": [\"\", \"\", \"\"], \"sides\": {\"AB\": \"18 ft\", \"BC\": \"h\"}}, \"caption\": \"person and shadow → pole and shadow (not to scale)\", \"alt\": \"two similar right triangles: a 6 foot person with a 3 foot shadow, and a pole of height h with an 18 foot shadow\", \"maxW\": 380}'></div>",
"a": "36",
"show": "36",
"sol": "The sun hits both at the same angle, and both stand straight up (90°), so the triangles are similar by AA. Scale factor = 18 ÷ 3 = 6. Pole height h = 6 × 6 = 36 ft."
},
"chk41a": {
"p": "<span class=\"badge\">MC</span> Two angles form a linear pair. One measures 128°. What is the other?",
"choices": [
"52°",
"62°",
"232°"
],
"a": "52°",
"fig": "<div data-geo='{\"type\": \"rays\", \"rays\": [{\"deg\": 0}, {\"deg\": 128}, {\"deg\": 180}], \"angles\": [{\"from\": 0, \"to\": 128, \"label\": \"128°\", \"c\": \"blue\"}, {\"from\": 128, \"to\": 180, \"label\": \"?\", \"c\": \"gold\"}], \"alt\": \"a linear pair: 128 degrees and an unknown angle on a straight line\", \"maxW\": 300}'></div>",
"why": "A linear pair adds to 180°. 180° − 128° = 52°."
},
"u4pA2": {
"p": "<span class=\"np-lv l1 u4-lv\">Score 3</span> Complementary Angles, given 38°. x = ?",
"a": [
"52"
],
"fig": "<div data-geo='{\"type\": \"rays\", \"rays\": [{\"deg\": 0}, {\"deg\": 38}, {\"deg\": 90}], \"angles\": [{\"from\": 0, \"to\": 38, \"label\": \"38°\", \"c\": \"blue\"}, {\"from\": 38, \"to\": 90, \"label\": \"x°\", \"c\": \"gold\"}], \"alt\": \"complementary: 38 degrees and x\", \"right\": [[0, 90]], \"maxW\": 260}'></div>",
"after": "<div class=\"np-sol u4-sol\" style=\"display:block\">Complementary angles add to 90°: x = 90 − 38 = 52.</div>"
},
"u4pA3": {
"p": "<span class=\"np-lv l1 u4-lv\">Score 3</span> Vertical Angles, given 66°. x = ?",
"a": [
"66"
],
"fig": "<div data-geo='{\"type\": \"cross\", \"theta\": 66, \"angles\": [{\"q\": 1, \"label\": \"66°\", \"c\": \"blue\"}, {\"q\": 3, \"label\": \"x°\", \"c\": \"gold\"}], \"alt\": \"vertical angles 66 degrees and x\", \"maxW\": 220}'></div>",
"after": "<div class=\"np-sol u4-sol\" style=\"display:block\">Vertical angles are equal: x = 66.</div>"
},
"u4pB2": {
"p": "<span class=\"np-lv l1 u4-lv\">Score 3</span> Alternate Interior, given 115°. x = ?",
"a": [
"115"
],
"fig": "<div data-geo='{\"type\": \"parallel\", \"theta\": 115, \"marks\": {\"3\": \"115°\", \"6\": \"x°\"}, \"colors\": {\"3\": \"blue\", \"6\": \"gold\"}, \"lineNames\": [\"m\", \"n\"], \"tName\": \"t\", \"alt\": \"parallel lines: alternate interior angles 115 degrees and x\", \"maxW\": 300}'></div>",
"after": "<div class=\"np-sol u4-sol\" style=\"display:block\">Alternate Interior angles are equal: x = 115.</div>"
},
"u4pD1": {
"p": "<span class=\"np-lv l2 u4-lv\">Score 4</span> AA Similarity — two angles match: 45° and 75°. x = ?",
"a": [
"60"
],
"fig": "<div data-geo='{\"type\": \"similar\", \"A\": 45, \"B\": 75, \"k\": 1.3, \"left\": {\"names\": [\"\", \"\", \"\"], \"angles\": {\"A\": \"45°\", \"B\": \"75°\"}, \"colors\": {\"A\": \"blue\", \"B\": \"green\"}}, \"right\": {\"names\": [\"\", \"\", \"\"], \"angles\": {\"A\": \"45°\", \"B\": \"75°\", \"C\": \"x°\"}, \"colors\": {\"A\": \"blue\", \"B\": \"green\", \"C\": \"gold\"}}, \"alt\": \"two triangles with 45 and 75 degree angles; the third angle of triangle 2 is x\", \"maxW\": 340}'></div>",
"after": "<div class=\"np-sol u4-sol\" style=\"display:block\">Two angles match (45° and 75°), so the triangles are similar by AA. The third angle: x = 180 − 45 − 75 = 60.</div>"
},
"u4pD2": {
"p": "<span class=\"np-lv l2 u4-lv\">Score 4</span> △ABC ~ △DEF, given 40° and 72°. x = ?",
"a": [
"68"
],
"fig": "<div data-geo='{\"type\": \"similar\", \"A\": 40, \"B\": 72, \"k\": 1.3, \"left\": {\"names\": [\"A\", \"B\", \"C\"], \"angles\": {\"A\": \"40°\", \"B\": \"72°\"}, \"colors\": {\"A\": \"blue\", \"B\": \"green\"}}, \"right\": {\"names\": [\"D\", \"E\", \"F\"], \"angles\": {\"C\": \"x°\"}, \"colors\": {\"C\": \"gold\"}}, \"caption\": \"F matches C\", \"alt\": \"similar triangles; angles 40 and 72, angle F is x\", \"maxW\": 340}'></div>",
"after": "<div class=\"np-sol u4-sol\" style=\"display:block\">∠C = 180 − 40 − 72 = 68°. ∠F corresponds to ∠C, so x = 68.</div>"
},
"u4pD3": {
"p": "<span class=\"np-lv l2 u4-lv\">Score 4</span> Parallel line inside a triangle, given 60° and 52°. x = ?",
"a": [
"68"
],
"fig": "<div data-geo='{\"type\": \"triangle\", \"A\": 60, \"B\": 52, \"angles\": {\"A\": \"60°\", \"B\": \"52°\", \"C\": \"x°\"}, \"colors\": {\"A\": \"blue\", \"B\": \"green\", \"C\": \"gold\"}, \"alt\": \"big triangle with base angles 60 and 52; a line parallel to the base cuts off a small top triangle with top angle x\", \"maxW\": 240}'></div>",
"after": "<div class=\"np-sol u4-sol\" style=\"display:block\">A line parallel to the base cuts off a small top triangle. It has the same angles as the big one (corresponding angles). The three angles add to 180°: x = 180 − 60 − 52 = 68.</div>"
},
"u4pD4": {
"p": "<span class=\"np-lv l2 u4-lv\">Score 4</span> Similar triangles — sides 4 and 6 match 10 and x. x = ?",
"a": [
"15"
],
"fig": "<div data-geo='{\"type\": \"similar\", \"A\": 60, \"B\": 70, \"k\": 1.5, \"left\": {\"sides\": {\"AB\": \"4\", \"CA\": \"6\"}}, \"right\": {\"sides\": {\"AB\": \"10\", \"CA\": \"x\"}}, \"alt\": \"similar triangles: 4 and 6 match 10 and x\", \"maxW\": 340}'></div>",
"after": "<div class=\"np-sol u4-sol\" style=\"display:block\">Scale factor = 10 ÷ 4 = 2.5. x = 6 × 2.5 = 15.</div>"
},
"u4pD5": {
"p": "<span class=\"np-lv l2 u4-lv\">Score 4</span> Similar right triangles, given 28°. x = ?",
"a": [
"62"
],
"fig": "<div data-geo='{\"type\": \"similar\", \"A\": 28, \"B\": 90, \"k\": 1.3, \"left\": {\"names\": [\"\", \"\", \"\"], \"angles\": {\"A\": \"28°\"}, \"colors\": {\"A\": \"blue\"}}, \"right\": {\"names\": [\"\", \"\", \"\"], \"angles\": {\"A\": \"28°\", \"C\": \"x°\"}, \"colors\": {\"A\": \"blue\", \"C\": \"gold\"}}, \"alt\": \"two right triangles with a 28 degree angle; the other angle is x\", \"maxW\": 340}'></div>",
"after": "<div class=\"np-sol u4-sol\" style=\"display:block\">Both triangles have a 90° angle and a 28° angle, so they are similar by AA. x = 180 − 90 − 28 = 62.</div>"
},
"u4pD6": {
"p": "<span class=\"np-lv l2 u4-lv\">Score 4</span> Triangle 1: 55°, 65°. Triangle 2: 55°, 60°. Find x, Triangle 2’s third angle.",
"a": [
"65"
],
"fig": "<div data-geo='{\"type\": \"triangle\", \"A\": 55, \"B\": 60, \"base\": 200, \"angles\": {\"A\": \"55°\", \"B\": \"60°\", \"C\": \"x°\"}, \"colors\": {\"A\": \"blue\", \"B\": \"green\", \"C\": \"gold\"}, \"names\": [\"\", \"\", \"\"], \"alt\": \"triangle 2 with angles 55 and 60 and x\", \"maxW\": 210}'></div>",
"after": "<div class=\"np-sol u4-sol\" style=\"display:block\">Triangle 2’s angles add to 180°: x = 180 − 55 − 60 = 65. (Triangle 1’s third angle is 180 − 55 − 65 = 60°, so Triangle 1 has 55°, 65°, 60° and Triangle 2 has 55°, 60°, 65°: they ARE similar.)</div>"
}
};
