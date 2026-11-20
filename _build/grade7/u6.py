from lib import Q, F, Fr
from figs import angles, xlines, tri, table, AMB, RUST, BLU, OLV

assert 6 * 4 == 24 and Fr(30, 5) == 6 and Fr(9, 2) * 4 == 18 and 3.5 * 20 == 70
assert (2 * 3) * (2 * 3) == 36 and Fr(18, 3) == 6 and 25 * 12 == 300
assert 3 + 4 > 5 and not (2 + 3 > 6) and 90 - 35 == 55 and 180 - 112 == 68 and Fr(90 - 6, 2) == 42 and Fr(180 - 20, 4) == 40
assert Fr(180 - 30, 5) == 30 and 3 * 30 + 30 == 120 and Fr(90 - 10, 4) == 20 and Fr(180, 3) == 60
assert 180 - 62 == 118 and 90 - 48 == 42 and 74 == 74 and Fr(150 - 10, 4) == 35 and 2 * 35 + 10 == 80
assert 1.5 * 8 == 12 and Fr(60, 5) == 12 and Fr(16, 4) ** 2 == 16 and Fr(160 - 25, 3) == 45

UNIT = dict(
    n=6, title='Scale Drawings, Angles and Triangles', short='Geometry 1', icon='📐',
    tag='Use scale drawings, draw triangles from given parts, and use angle facts to find missing angles.',
    desc='Find actual lengths and areas from scale drawings, decide when three parts make one, many or no triangles, and write and solve equations for complementary, supplementary, vertical and adjacent angles.',
    stds=[('NC.7.G.1', 'Solve problems with scale drawings: actual lengths and areas, and redraw at a different scale.'),
          ('NC.7.G.2', 'Draw shapes with given conditions; focus on triangles from three angles or three sides (one, many or no triangles).'),
          ('NC.7.G.5', 'Use supplementary, complementary, vertical and adjacent angles to write and solve equations for an unknown angle.')],
    ican=['I can use a scale to find actual lengths from a scale drawing',
          'I can find actual areas and redraw a picture at a new scale',
          'I can tell if three side lengths or three angles make one triangle, many triangles or no triangle',
          'I can name complementary, supplementary, vertical and adjacent angles',
          'I can write and solve an equation to find an unknown angle'],
    vocab=[('Scale', 'a ratio that compares drawing length to actual length, like 1 in : 4 ft'), ('Scale factor', 'the number you multiply by to go from one size to the other'),
           ('Triangle inequality', 'the two shorter sides must add to MORE than the longest side'), ('Complementary angles', 'two angles that add to 90°'),
           ('Supplementary angles', 'two angles that add to 180°'), ('Vertical angles', 'opposite angles made by two crossing lines; they are equal'),
           ('Adjacent angles', 'angles that share a side and a vertex and do not overlap')],
)
T = []
T.append(dict(
    title='Scale Drawings: Lengths', nav='Scale Lengths', std='NC.7.G.1',
    words=[('Scale', 'drawing length : actual length, like 1 cm : 4 m.'), ('Scale factor', 'how many times bigger (or smaller) one is than the other.')],
    big='Use the scale like a unit rate. If 1 cm stands for 4 m, then 6 cm stands for 6 × 4 = 24 m. To go from actual back to the drawing, divide.',
    table=(['Drawing (cm)', '1', '3', '6', '{{7.5}}'], [['Actual (m)', '4', '{{12}}', '{{24}}', '30']]),
    examples=[dict(title='Example: a map scale is 1 inch : 20 miles. Two towns are 3.5 inches apart. How far apart are they?', steps=['Each inch is 20 miles.', '3.5 × 20 = 70', '<b>70 miles</b>'])],
    warn='Keep the units with the right side of the scale. Check: is the actual length bigger than the drawing (for a map)?',
    np=[Q(1, 'A scale is 1 cm : 4 m. A wall is 6 cm on the drawing. How long is the real wall, in meters?', ans=24, hint='6 × 4', sol='6 × 4 = 24 m.'),
        Q(2, 'A map scale is 1 inch : 5 miles. Two parks are 30 miles apart. How far apart are they on the map?', ch=['6 inches', '150 inches', '35 inches', '25 inches'],
          why={'150 inches': 'You multiplied. Going from actual to the map, DIVIDE by 5.', '35 inches': 'You added. Each 5 miles is 1 inch.', '25 inches': 'You subtracted. Each 5 miles is 1 inch.'},
          hint='How many 5-mile pieces are in 30 miles?', sol='30 ÷ 5 = 6 inches.'),
        Q(3, 'A model car is built with a scale of 1 : 24. The model is 7.5 inches long. How many FEET long is the real car?', ans=15, hint='Real length = 7.5 × 24 inches. Then divide by 12.', sol='7.5 × 24 = 180 inches. 180 ÷ 12 = 15 feet.')]))
T.append(dict(
    title='Scale Drawings: Area and New Scales', nav='Scale Area', std='NC.7.G.1',
    words=[('Area', 'the space inside, in square units.')],
    big='To find a real area, change each LENGTH with the scale first, then multiply. (Scaling the area by the scale factor alone is a common mistake: area grows by the scale factor times itself.)',
    fill=['A 2 cm by 3 cm room, scale 1 cm : 2 m. Real size: {{4}} m by {{6}} m. Real area: {{24}} m²', 'Redraw a 12 cm line at half the size: {{6}} cm'],
    examples=[dict(title='Example: a garden is drawn 4 in by 6 in. The scale is 1 in : 3 ft. What is the real area?', steps=['Real length: 6 × 3 = 18 ft. Real width: 4 × 3 = 12 ft.', 'Area = 18 × 12', '<b>216 ft²</b> (not 4 × 6 × 3 = 72)'])],
    warn='For area, scale BOTH lengths. Multiplying the drawing area by the scale only once gives a number that is too small.',
    np=[Q(1, 'A room is drawn 5 in by 4 in. The scale is 1 in : 2 ft. What is the real WIDTH (from 4 in), in feet?', ans=8, hint='4 × 2', sol='4 × 2 = 8 ft.'),
        Q(2, 'A square is drawn 2 cm on each side. The scale is 1 cm : 3 m. What is the real area?', ch=['36 m²', '12 m²', '4 m²', '6 m²'],
          why={'12 m²': 'You scaled the area (4) by 3 only once. Scale each side first: 6 m by 6 m.', '4 m²': 'That is the area on the drawing. Use the real side lengths.', '6 m²': 'That is the real side length. Area = side × side.'},
          hint='Real side = 2 × 3 = 6 m. Area = 6 × 6.', sol='Each side is 6 m. 6 × 6 = 36 m².'),
        Q(3, 'A poster is 16 in wide. Lin redraws it with a scale factor of 1/4. How many SQUARE inches is a 16 in by 16 in square on the new drawing?', ans=16, hint='New side = 16 × 1/4 = 4 in.', sol='Each side is 4 in. 4 × 4 = 16 square inches.')]))
T.append(dict(
    title='Drawing Triangles', nav='Triangles', std='NC.7.G.2',
    words=[('Triangle inequality', 'the two SHORTER sides must add up to MORE than the longest side.'), ('Angle sum', 'the three angles of a triangle add to 180°.')],
    big='<b>Three sides:</b> if the two shorter sides add to more than the longest, they make exactly ONE triangle; if not, NO triangle. <b>Three angles:</b> if they add to 180°, they make MANY triangles (same shape, any size); if not, NO triangle.',
    fig=tri((5, 0), (95, 0), (37.4, 71), [(50, -9, '5 cm'), (14, 42, '3 cm'), (72, 42, '4 cm')]),
    figcap='3 + 4 = 7, which is more than 5. These sides make exactly one triangle.',
    table=(['Given', 'Test', 'How many triangles?'], [['3 cm, 4 cm, 5 cm', '3 + 4 > 5', '{{one}}'], ['2 cm, 3 cm, 6 cm', '2 + 3 < 6', '{{none}}'], ['50°, 60°, 70°', 'sum = 180°', '{{many}}'], ['40°, 60°, 90°', 'sum = 190°', '{{none}}']]),
    examples=[dict(title='Example: can 4 in, 4 in and 9 in make a triangle?', steps=['The two shorter sides: 4 + 4 = 8', '8 is less than 9. The short sides cannot reach.', '<b>No triangle.</b>'])],
    warn='Add the two SHORTEST sides. And "equal to" is not enough: 2 + 3 = 5 lies flat and makes no triangle.',
    np=[Q(1, 'Two angles of a triangle are 55° and 75°. What is the third angle, in degrees?', ans=50, hint='The three angles add to 180°.', sol='180 − 55 − 75 = 50°.'),
        Q(2, 'How many triangles can you make with sides 5 cm, 6 cm and 12 cm?', ch=['none', 'one', 'many', 'two'],
          why={'one': 'Test it: 5 + 6 = 11. Is that more than 12?', 'many': 'Three side lengths can never make more than one shape.', 'two': 'Test the two short sides against the longest side.'},
          hint='Add the two shorter sides. Is the sum more than 12?', sol='5 + 6 = 11, which is less than 12. No triangle.'),
        Q(3, 'Which set of angles makes MANY different triangles?', ch=['45°, 45°, 90°', '50°, 50°, 50°', '30°, 60°, 100°', '90°, 90°, 0°'],
          why={'50°, 50°, 50°': 'Add them: 150°. A triangle needs 180°.', '30°, 60°, 100°': 'Add them: 190°. A triangle needs 180°.', '90°, 90°, 0°': 'Every angle of a triangle must be more than 0°.'},
          hint='Which set adds to exactly 180°, with every angle more than 0°?', sol='45 + 45 + 90 = 180. Three angles that work make many triangles (same shape, different sizes).')]))
T.append(dict(
    title='Angle Relationships', nav='Angle Pairs', std='NC.7.G.5',
    words=[('Complementary', 'add to 90°.'), ('Supplementary', 'add to 180° (a straight line).'), ('Vertical angles', 'across from each other where two lines cross. They are EQUAL.'), ('Adjacent angles', 'next to each other: same vertex, one shared side.')],
    big='Look for the picture: a right angle (square corner) → <b>90°</b>. A straight line → <b>180°</b>. Two crossing lines → opposite angles are <b>equal</b>.',
    fig=xlines(40, {'right': '40°', 'left': '40°', 'top': '140°', 'bottom': '140°'}, title='two crossing lines: vertical angles 40 and 40, and 140 and 140'),
    figcap='Vertical angles are equal (40° and 40°). Angles next to each other on a line are supplementary: 40° + 140° = 180°.',
    fill=['The complement of 35° is {{55}}°.', 'The supplement of 112° is {{68}}°.', 'The angle vertical to a 74° angle is {{74}}°.'],
    examples=[dict(title='Example: two angles make a right angle. One is 48°. Find the other.', steps=['Right angle → they add to 90°.', '90 − 48 = 42', '<b>42°</b>'])],
    warn='Complementary = 90 (C comes before S, and 90 comes before 180). Supplementary = 180.',
    np=[Q(1, 'What is the supplement of a 62° angle, in degrees?', ans=118, hint='Supplementary angles add to 180°.', sol='180 − 62 = 118°.'),
        Q(2, 'Two lines cross. One angle is 65°. What is the angle across from it (vertical to it)?', fig=xlines(65, {'right': '65°', 'left': '?'}, title='two crossing lines, 65 degrees and the vertical angle marked ?'), ch=['65°', '115°', '25°', '295°'],
          why={'115°': 'That is the angle NEXT to it on the line. The vertical angle is across.', '25°': 'That would be a complement. These angles are not in a right angle.', '295°': 'An angle at a crossing is less than 180°.'},
          hint='Vertical angles are equal.', sol='Vertical angles are equal: 65°.'),
        Q(3, 'Angle A and angle B are complementary. Angle B and angle C are supplementary. Angle A = 30°. What is angle C?', ch=['120°', '60°', '150°', '30°'],
          why={'60°': 'That is angle B. Now find its supplement.', '150°': 'That is the supplement of A. C is the supplement of B.', '30°': 'Find B first: 90 − 30.'},
          hint='Find B first (B = 90 − A). Then C = 180 − B.', sol='B = 90 − 30 = 60°. C = 180 − 60 = 120°.')]))
T.append(dict(
    title='Equations for Unknown Angles', nav='Angle Equations', std='NC.7.G.5',
    words=[('Unknown angle', 'an angle written with a variable, like (2x + 6)°.')],
    big='<b>1</b> Name the relationship (90°, 180° or equal). <b>2</b> Write the equation. <b>3</b> Solve for x. <b>4</b> Put x back in to find the angle the question asks for.',
    fig=angles([0, 48, 180], [(0, 48, '(2x + 6)°', RUST), (48, 180, '?', BLU)], title='a straight line split into two angles'),
    figcap='Two angles on a straight line are supplementary.',
    examples=[dict(title='Example: two complementary angles are (2x + 6)° and 2x°. Find x.', steps=['Complementary → they add to 90.', '2x + 6 + 2x = 90', '4x + 6 = 90, so 4x = 84', '<b>x = 21</b>. The angles are 48° and 42°. Check: 48 + 42 = 90 ✓'])],
    warn='After you find x, read the question again. It may ask for the ANGLE, not x.',
    np=[Q(1, 'Two supplementary angles are 4x° and 20°. What is x?', ans=40, hint='4x + 20 = 180', sol='4x = 160, so x = 40.'),
        Q(2, 'Two angles on a straight line are (3x + 30)° and 2x°. Which equation fits?', ch=['3x + 30 + 2x = 180', '3x + 30 + 2x = 90', '3x + 30 = 2x', '3x + 30 − 2x = 180'],
          why={'3x + 30 + 2x = 90': 'A straight line is 180°, not 90°.', '3x + 30 = 2x': 'Angles on a line are not equal. That is for vertical angles.', '3x + 30 − 2x = 180': 'The two angles ADD to the straight line.'},
          hint='Angles on a straight line add to 180°.', sol='They add to 180: 3x + 30 + 2x = 180. (5x = 150, x = 30.)'),
        Q(3, 'Vertical angles measure (4x + 10)° and (3x + 25)°. What is the measure of ONE of the angles, in degrees?', ans=70, hint='Vertical angles are equal: 4x + 10 = 3x + 25. Find x, then the angle.', sol='4x + 10 = 3x + 25, so x = 15. The angle is 4(15) + 10 = 70°. Check: 3(15) + 25 = 70°.')]))

PART2 = [
    ('A. Scale Drawings', 'NC.7.G.1', [
        Q(1, 'A scale is 1 in : 8 ft. A room is 1.5 in long on the plan. How long is it in feet?', ans=12, hint='1.5 × 8'),
        Q(2, 'A map scale is 1 cm : 5 km. A road is 60 km long. How long is it on the map, in cm?', ans=12, hint='60 ÷ 5'),
        Q(3, 'A square patio is drawn 4 cm by 4 cm. The scale is 1 cm : 1/2 m. What is the REAL area in m²?', ans=4, hint='Real side = 4 × 1/2 = 2 m.')]),
    ('B. Triangles', 'NC.7.G.2', [
        Q(1, 'A triangle has angles 90° and 35°. What is the third angle?', ans=55, hint='180 − 90 − 35'),
        Q(2, 'Which side lengths make a triangle?', ch=['4, 7, 10', '2, 3, 5', '1, 4, 6', '3, 3, 7'],
          why={'2, 3, 5': '2 + 3 = 5 is not MORE than 5. It lies flat.', '1, 4, 6': '1 + 4 = 5, which is less than 6.', '3, 3, 7': '3 + 3 = 6, which is less than 7.'}, hint='Two shorter sides must add to more than the longest.'),
        Q(3, 'Ty says angles 60°, 60°, 60° make only ONE triangle. Is he right?', ch=['No. They make many triangles: same shape, any size.', 'Yes. Equal angles make one triangle.', 'No. They make no triangle.', 'Yes. Three angles always make one triangle.'],
          why={'Yes. Equal angles make one triangle.': 'Draw a small one and a big one. Both have 60°, 60°, 60°.', 'No. They make no triangle.': '60 + 60 + 60 = 180, so they do make triangles.', 'Yes. Three angles always make one triangle.': 'Angles fix the shape, not the size.'}, hint='Do the angles tell you how long the sides are?')]),
    ('C. Angle Equations', 'NC.7.G.5', [
        Q(1, 'Two complementary angles: one is 4x°, the other is 10°. What is x?', ans=20, hint='4x + 10 = 90'),
        Q(2, 'Three angles make a straight line: x°, x° and x°. What is x?', ans=60, hint='x + x + x = 180'),
        Q(3, 'Angles (3x + 25)° and 20° are supplementary. What is the larger angle, in degrees?', ans=160, hint='3x + 25 + 20 = 180. Then find 3x + 25.')]),
]

PRACTICE = dict(title='Unit 6 Practice — Scale Drawings, Angles and Triangles', sub='Scale lengths · Scale area · Triangles · Angle pairs · Angle equations', secs=[
    ('A. Scale Lengths', 'NC.7.G.1', 'Multiply by the scale to get the actual length. Divide to go back.', [
        Q(1, 'Scale 1 cm : 6 m. A drawing is 5 cm. How many meters is it really?', ans=30, hint='5 × 6'),
        Q(2, 'A map scale is 2 in : 25 miles. Two cities are 6 inches apart on the map. How far apart are they really?', ch=['75 miles', '150 miles', '12.5 miles', '37.5 miles'],
          why={'150 miles': '25 miles is for 2 inches, not 1 inch. How many 2-inch pieces are in 6 inches?', '12.5 miles': '12.5 miles is the distance for 1 inch. Multiply by 6.', '37.5 miles': 'Count the 2-inch pieces: 6 ÷ 2 = 3.'}, hint='6 inches is 3 groups of 2 inches.'),
        Q(3, 'A building is 90 ft tall. A model uses 1 in : 6 ft. How tall is the model, in inches?', ans=15, hint='90 ÷ 6')]),
    ('B. Scale Area', 'NC.7.G.1', 'Change each length first, then find the area.', [
        Q(1, 'A rectangle is drawn 3 cm by 2 cm. Scale 1 cm : 2 m. What is the real area in m²?', ans=24, hint='Real: 6 m by 4 m.'),
        Q(2, 'A field is drawn 5 in by 4 in. Scale 1 in : 10 yd. What is the real area?', ch=['2,000 yd²', '200 yd²', '20 yd²', '90 yd²'],
          why={'200 yd²': 'You scaled the area (20) only once. Scale each side: 50 yd and 40 yd.', '20 yd²': 'That is the drawing area.', '90 yd²': 'You added the sides. Area multiplies.'}, hint='50 yd by 40 yd.'),
        Q(3, 'A 12 cm by 8 cm picture is redrawn with scale factor 1.5. What is the new area in cm²?', ans=216, hint='New sides: 18 cm and 12 cm.')]),
    ('C. Drawing Triangles', 'NC.7.G.2', 'Sides: short + short > long. Angles: add to 180°.', [
        Q(1, 'A triangle has angles 47° and 68°. What is the third angle?', ans=65, hint='180 − 47 − 68'),
        Q(2, 'How many triangles have angles 30°, 70° and 80°?', ch=['many', 'one', 'none', 'three'],
          why={'one': 'Angles fix the shape but not the size. Picture a small one and a big one.', 'none': 'Add them: 30 + 70 + 80. Is it 180?', 'three': 'Think about size: the sides can be any length.'}, hint='Do they add to 180°? Do angles fix the size?'),
        Q(3, 'Two sides of a triangle are 5 cm and 9 cm. What is the greatest WHOLE number of cm the third side can be?', ans=13, hint='5 + 9 = 14. The third side must be LESS than 14.')]),
    ('D. Angle Pairs', 'NC.7.G.5', 'Complementary 90°. Supplementary 180°. Vertical angles are equal.', [
        Q(1, 'What is the complement of 27°?', ans=63, hint='90 − 27'),
        Q(2, 'Two lines cross. One angle is 110°. What is the angle next to it on the same line?', ch=['70°', '110°', '250°', '20°'],
          why={'110°': 'That is the angle ACROSS from it (vertical). The one next to it is supplementary.', '250°': '360 − 110 is the rest of the circle. The two angles on a line add to 180.', '20°': 'You subtracted from 90. Angles on a line add to 180.'}, hint='Angles next to each other on a line add to 180°.'),
        Q(3, 'Angles 1 and 2 are vertical. Angle 2 and angle 3 are supplementary. Angle 1 = 58°. What is angle 3?', ans=122, hint='Angle 2 = 58°. Angle 3 = 180 − 58.')]),
    ('E. Angle Equations', 'NC.7.G.5', 'Write the equation, solve for x, then answer the question.', [
        Q(1, 'Two supplementary angles are 5x° and 30°. What is x?', ans=30, hint='5x + 30 = 180'),
        Q(2, 'Vertical angles are (2x + 15)° and 75°. What is x?', ans=30, hint='2x + 15 = 75'),
        Q(3, 'A right angle is split into (2x + 6)° and (x + 12)°. What is the LARGER angle, in degrees?', ans=54, hint='2x + 6 + x + 12 = 90. Find x, then both angles.')]),
])
