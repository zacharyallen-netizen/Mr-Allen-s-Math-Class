from lib import Q, F, Fr
from figs import circle, prism, tri, svg, t, ln, INK, RUST, SAND

PI = Fr(314, 100)
assert PI * 10 == Fr(314, 10) and 2 * PI * 5 == Fr(314, 10) and PI * 4 == Fr(1256, 100) and PI * 6 * 6 == Fr(11304, 100)
assert PI * 25 == Fr(785, 10) and PI * 100 == 314 and PI * 9 == Fr(2826, 100) and Fr(1, 2) * PI * 16 == Fr(2512, 100)
assert Fr(4396, 100) / PI == 14 and Fr(1, 4) * PI * 100 == Fr(785, 10)
assert 8 * 5 + Fr(1, 2) * 8 * 3 == 52 and 10 * 6 - 4 * 3 == 48 and Fr(1, 2) * (6 + 10) * 4 == 32
assert 2 * (5 * 3 + 5 * 2 + 3 * 2) == 62 and 2 * (4 * 4) + 4 * (4 * 10) == 192 and 6 * 3 * 3 == 54
assert 2 * Fr(1, 2) * 6 * 8 + (6 + 8 + 10) * 12 == 336
assert 5 * 3 * 2 == 30 and Fr(1, 2) * 6 * 4 * 10 == 120 and 4 * 4 * 4 == 64 and Fr(5, 2) * 2 * 4 == 20
assert Fr(240, 8 * 5) == 6 and 12 * 10 * 8 - 12 * 10 * 5 == 360
assert PI * 8 == Fr(2512, 100) and 2 * PI * 3 == Fr(1884, 100) and PI * 49 == Fr(15386, 100) and PI * 64 == Fr(20096, 100)
assert 12 * 8 - Fr(1, 2) * 12 * 3 == 78 and 2 * (6 * 4 + 6 * 3 + 4 * 3) == 108 and 7 * 4 * 3 == 84 and Fr(1, 2) * 5 * 4 * 9 == 90 and 4 * 5 * 6 == 120

def lshape():
    b = '<path d="M30,30 H190 V92 H126 V170 H30 Z" fill="%s" stroke="%s" stroke-width="2.4"/>' % (SAND, INK)
    b += t(110, 22, '10 ft', 13, RUST) + t(198, 66, '4 ft', 13, RUST, 'start') + t(78, 188, '6 ft', 13, RUST) + t(22, 104, '9 ft', 13, RUST, 'end')
    return svg(240, 200, b, 'L shaped room: top 10 ft, left 9 ft, right side 4 ft, bottom 6 ft')

def housefig():
    b = '<path d="M30,150 V80 H190 V150 Z" fill="%s" stroke="%s" stroke-width="2.4"/><path d="M30,80 L110,30 L190,80 Z" fill="#FBE9C9" stroke="%s" stroke-width="2.4"/>' % (SAND, INK, INK)
    b += ln(110, 30, 110, 80, RUST, 1.5, '4 3') + t(118, 62, '3 m', 13, RUST, 'start') + t(110, 168, '8 m', 13, RUST) + t(20, 120, '5 m', 13, RUST, 'end')
    return svg(230, 180, b, 'a rectangle 8 m by 5 m with a triangle 3 m tall on top')

UNIT = dict(
    n=7, title='Circles, Area, Surface Area and Volume', short='Geometry 2', icon='⭕',
    tag='Find the circumference and area of circles, and the area, surface area and volume of shapes and prisms.',
    desc='Use the formulas for circumference and area of a circle, find the area of composite shapes, and solve surface area and volume problems with prisms.',
    stds=[('NC.7.G.4', 'Understand and use the formulas for the area and circumference of a circle; explain how they are related.'),
          ('NC.7.G.6', 'Solve real-world problems with area of 2-D shapes and surface area and volume of 3-D objects made of triangles, quadrilaterals, polygons, cubes and right prisms.')],
    ican=['I can find the circumference of a circle', 'I can find the area of a circle and solve problems with circles',
          'I can find the area of shapes made of rectangles, triangles and trapezoids', 'I can find the surface area of a prism',
          'I can find the volume of a right prism'],
    vocab=[('Radius (r)', 'from the center to the edge of a circle'), ('Diameter (d)', 'across the circle through the center; d = 2r'),
           ('Circumference (C)', 'the distance around a circle; C = πd = 2πr'), ('π (pi)', 'the circumference ÷ the diameter of ANY circle, about 3.14'),
           ('Area of a circle', 'A = πr²'), ('Composite shape', 'a shape made of simpler shapes'),
           ('Surface area', 'the total area of all the faces of a 3-D shape'), ('Volume', 'the space inside a 3-D shape; V = Bh for a prism (B = area of the base)')],
)
T = []
T.append(dict(
    title='Circumference', nav='Circumference', std='NC.7.G.4',
    words=[('Radius', 'center to edge.'), ('Diameter', 'edge to edge through the center. d = 2r.'), ('Circumference', 'the distance around.'), ('π', 'about 3.14. For EVERY circle, C ÷ d = π.')],
    big='<b>C = πd</b> or <b>C = 2πr</b>. The distance around is a little more than 3 diameters. Use 3.14 for π unless the problem says to leave π.',
    fig=circle('r = 5 cm', None), figcap='r = 5 cm, so d = 10 cm and C = 3.14 × 10 = 31.4 cm.',
    fill=['r = 5, so d = {{10}}', 'C = 3.14 × 10 = {{31.4}}', 'd = 4: C = {{4π}} ≈ {{12.56}}'],
    examples=[dict(title='Example: a bike wheel has a diameter of 26 in. How far does it roll in one turn?', steps=['One turn = one circumference.', 'C = πd = 3.14 × 26', '<b>81.64 inches</b>'])],
    warn='C = 2πr uses the RADIUS. If you are given the diameter, use C = πd (or cut it in half first).',
    np=[Q(1, 'Find the circumference of a circle with diameter 10 cm. Use 3.14.', ans=31.4, hint='C = 3.14 × d', sol='3.14 × 10 = 31.4 cm.'),
        Q(2, 'A circle has radius 3 m. What is its circumference? Use 3.14.', ch=['18.84 m', '9.42 m', '28.26 m', '6 m'],
          why={'9.42 m': 'You used the radius as the diameter. d = 2 × 3 = 6.', '28.26 m': 'That is the AREA formula (πr²).', '6 m': 'That is the diameter. Multiply by π.'},
          hint='C = 2 × 3.14 × 3', sol='C = 2πr = 2 × 3.14 × 3 = 18.84 m.'),
        Q(3, 'A round table has a circumference of 43.96 ft. What is its diameter, in feet? Use 3.14.', ans=14, hint='C = πd, so d = C ÷ 3.14.', sol='43.96 ÷ 3.14 = 14 ft.')]))
T.append(dict(
    title='Area of a Circle', nav='Circle Area', std='NC.7.G.4',
    words=[('Area', 'the space inside, in square units.'), ('r²', 'r × r, not r × 2.')],
    big='<b>A = πr²</b>. Cut a circle into thin slices and line them up: it makes a shape like a rectangle, πr long and r tall. So the area is πr × r = πr².',
    fig=circle(None, 'd = 10 in'), figcap='d = 10 in, so r = 5 in and A = 3.14 × 5 × 5 = 78.5 in².',
    fill=['r = 5: A = 3.14 × {{25}} = {{78.5}}', 'r = 10: A = {{314}}', 'd = 6: r = {{3}}, A = 3.14 × 9 = {{28.26}}'],
    examples=[dict(title='Example: a half circle has diameter 8 m. What is its area?', steps=['r = 4', 'Whole circle: 3.14 × 4 × 4 = 50.24', 'Half: 50.24 ÷ 2', '<b>25.12 m²</b>'])],
    warn='Square the RADIUS, not the diameter, and do not multiply r by 2. r² means r × r.',
    np=[Q(1, 'Find the area of a circle with radius 10 ft. Use 3.14.', ans=314, hint='3.14 × 10 × 10', sol='3.14 × 100 = 314 ft².'),
        Q(2, 'A pizza has a diameter of 12 in. What is its area? Use 3.14.', ch=['113.04 in²', '452.16 in²', '37.68 in²', '18.84 in²'],
          why={'452.16 in²': 'You squared the diameter. Use r = 6.', '37.68 in²': 'That is the circumference (πd).', '18.84 in²': 'You did 3.14 × 6. Square the radius: 6 × 6.'},
          hint='r = 6. A = 3.14 × 6 × 6.', sol='r = 6. A = 3.14 × 36 = 113.04 in².'),
        Q(3, 'A sprinkler waters a circle 10 m across. It only turns through 1/4 of the circle. What area does it water, in m²? Use 3.14.', ans=19.625, hint='Radius 5. Whole circle 3.14 × 25. Then take 1/4.', sol='3.14 × 25 = 78.5. 78.5 ÷ 4 = 19.625 m².')]))
T.append(dict(
    title='Area of Composite Shapes', nav='Composite Area', std='NC.7.G.6',
    words=[('Composite shape', 'a shape made of rectangles, triangles and other simple shapes.'), ('Trapezoid', 'A = ½(b₁ + b₂)h')],
    big='Break the shape into pieces you know. Find each area, then ADD them. Or find a big rectangle and SUBTRACT the missing piece.',
    fig=housefig(), figcap='Rectangle 8 × 5 = 40. Triangle ½ × 8 × 3 = 12. Total 52 m².',
    table=(['Shape', 'Area formula', 'Example', 'Area'], [['Rectangle', 'A = lw', '8 by 5', '{{40}}'], ['Triangle', 'A = ½bh', 'b = 8, h = 3', '{{12}}'], ['Trapezoid', 'A = ½(b₁ + b₂)h', '6 and 10, h = 4', '{{32}}']]),
    examples=[dict(title='Example: find the area of the L-shaped room.', fig=lshape(), steps=['Big rectangle: 10 × 9 = 90', 'Missing corner: (10 − 6) by (9 − 4) = 4 × 5 = 20', 'Subtract: 90 − 20', '<b>70 ft²</b>'])],
    warn='The height of a triangle is straight up from the base (it makes a square corner), not the slanted side.',
    np=[Q(1, 'A rectangle is 10 ft by 6 ft. A 4 ft by 3 ft rectangle is cut out of it. What area is left, in ft²?', ans=48, hint='60 − 12', sol='10 × 6 = 60. 4 × 3 = 12. 60 − 12 = 48 ft².'),
        Q(2, 'A trapezoid has bases 6 cm and 10 cm and height 4 cm. What is its area?', ch=['32 cm²', '64 cm²', '240 cm²', '20 cm²'],
          why={'64 cm²': 'You forgot the ½.', '240 cm²': 'You multiplied 6 × 10 × 4. Add the bases first.', '20 cm²': 'You added 6 + 10 + 4. Use ½(b₁ + b₂)h.'},
          hint='½ × (6 + 10) × 4', sol='½ × 16 × 4 = 32 cm².'),
        Q(3, 'A 12 m by 8 m yard has a triangular garden in one corner with legs 12 m and 3 m. What area is NOT garden, in m²?', ans=78, hint='Yard 12 × 8. Garden ½ × 12 × 3.', sol='96 − 18 = 78 m².')]))
T.append(dict(
    title='Surface Area of Prisms', nav='Surface Area', std='NC.7.G.6',
    words=[('Face', 'a flat side of a 3-D shape.'), ('Net', 'a 3-D shape unfolded flat.'), ('Surface area', 'the sum of the areas of ALL the faces.')],
    big='Unfold the prism into a net. Find the area of every face and add. A rectangular prism has 3 pairs of matching faces: <b>SA = 2(lw + lh + wh)</b>.',
    fig=prism('5 cm', '2 cm', '3 cm'), figcap='5 × 3 front and back, 5 × 2 top and bottom, 2 × 3 left and right.',
    fill=['Front and back: 2 × (5 × 3) = {{30}}', 'Top and bottom: 2 × (5 × 2) = {{20}}', 'Left and right: 2 × (2 × 3) = {{12}}', 'Surface area = {{62}} cm²'],
    examples=[dict(title='Example: a triangular prism. The triangle has legs 6 and 8 and long side 10. The prism is 12 long.', steps=['Two triangles: 2 × ½ × 6 × 8 = 48', 'Three rectangles: 6 × 12 + 8 × 12 + 10 × 12 = 288', '<b>48 + 288 = 336 square units</b>'])],
    warn='Count EVERY face. A box has 6 faces, not 3. Surface area is in square units.',
    np=[Q(1, 'A cube has edges of 3 in. What is its surface area, in in²?', ans=54, hint='6 faces, each 3 × 3.', sol='6 × 9 = 54 in².'),
        Q(2, 'A box is 6 cm long, 4 cm wide and 3 cm tall. What is its surface area?', ch=['108 cm²', '54 cm²', '72 cm²', '13 cm²'],
          why={'54 cm²': 'You counted each kind of face once. Every face has a matching one: double it.', '72 cm²': 'That is the volume, in cubic cm.', '13 cm²': 'You added the lengths. Find the area of every face.'},
          hint='2(6 × 4 + 6 × 3 + 4 × 3)', sol='2(24 + 18 + 12) = 2 × 54 = 108 cm².'),
        Q(3, 'A square box with no lid has a 4 ft by 4 ft bottom and is 10 ft tall. How many ft² of wood does it take?', ans=176, hint='Bottom only (no lid): 4 × 4. Four sides: 4 × 10 each.', sol='Bottom 16 + sides 4 × 40 = 160. 16 + 160 = 176 ft².')]))
T.append(dict(
    title='Volume of Prisms', nav='Volume', std='NC.7.G.6',
    words=[('Base (B)', 'the area of the shape on the end of the prism.'), ('Volume', 'how many unit cubes fit inside; cubic units.')],
    big='<b>V = Bh</b>: area of the base × height (the length of the prism). For a box, B = lw, so V = lwh. For a triangular prism, B = ½bh of the triangle.',
    fig=prism('5 ft', '3 ft', '2 ft'), figcap='B = 5 × 3 = 15. V = 15 × 2 = 30 ft³.',
    fill=['Box 5 by 3 by 2: V = {{30}}', 'Triangular prism: triangle ½ × 6 × 4 = {{12}}, length 10: V = {{120}}', 'Cube with 4 in edges: V = {{64}} in³'],
    examples=[dict(title='Example: a fish tank is 12 in long, 10 in wide and 8 in tall. Water fills it to 5 in. How much MORE water fits?', steps=['Whole tank: 12 × 10 × 8 = 960', 'Water now: 12 × 10 × 5 = 600', '<b>360 in³ more</b>'])],
    warn='Volume is in CUBIC units (in³). Area is in square units. Do not mix them up.',
    np=[Q(1, 'A box is 5 cm by 3 cm by 2 cm. What is its volume, in cm³?', ans=30, hint='5 × 3 × 2', sol='5 × 3 × 2 = 30 cm³.'),
        Q(2, 'A triangular prism has a triangle base with b = 6 and h = 4, and the prism is 10 long. What is the volume?', ch=['120 cubic units', '240 cubic units', '20 cubic units', '12 cubic units'],
          why={'240 cubic units': 'The triangle\'s area has a ½. You used b × h.', '20 cubic units': 'You added the numbers. Multiply B × length.', '12 cubic units': 'That is only B, the area of the triangle. Multiply by the length.'},
          hint='B = ½ × 6 × 4. V = B × 10.', sol='B = 12. V = 12 × 10 = 120 cubic units.'),
        Q(3, 'A box holds 240 in³. Its base is 8 in by 5 in. How tall is it, in inches?', ans=6, hint='240 = 8 × 5 × h', sol='8 × 5 = 40. 240 ÷ 40 = 6 in.')]))

PART2 = [
    ('A. Circles', 'NC.7.G.4', [
        Q(1, 'Find the circumference of a circle with diameter 8 m. Use 3.14.', ans=25.12, hint='3.14 × 8'),
        Q(2, 'Find the area of a circle with radius 7 cm. Use 3.14.', ans=153.86, hint='3.14 × 7 × 7'),
        Q(3, 'Which is true for EVERY circle?', ch=['Circumference ÷ diameter = π', 'Area ÷ radius = π', 'Circumference = area', 'Diameter ÷ radius = π'],
          why={'Area ÷ radius = π': 'Area ÷ radius = πr. Only C ÷ d is always π.', 'Circumference = area': 'They have different units (length vs square units).', 'Diameter ÷ radius = π': 'Diameter ÷ radius is always 2.'}, hint='Think about C = πd.')]),
    ('B. Area and Surface Area', 'NC.7.G.6', [
        Q(1, 'A triangle has base 9 and height 4. What is its area?', ans=18, hint='½ × 9 × 4'),
        Q(2, 'A cube has 5 cm edges. What is its surface area, in cm²?', ans=150, hint='6 × 5 × 5'),
        Q(3, 'A rectangular prism is 2 in by 3 in by 4 in. What is its surface area, in in²?', ans=52, hint='2(6 + 8 + 12)')]),
    ('C. Volume', 'NC.7.G.6', [
        Q(1, 'A box is 7 ft by 4 ft by 3 ft. What is its volume, in ft³?', ans=84, hint='7 × 4 × 3'),
        Q(2, 'A triangular prism: triangle b = 5, h = 4; length 9. What is its volume?', ans=90, hint='½ × 5 × 4 = 10. Then × 9.'),
        Q(3, 'A 4 in by 5 in by 6 in box is filled with 1-inch cubes. Then 1/2 of the cubes are taken out. How many cubes are left?', ans=60, hint='Volume = 4 × 5 × 6.')]),
]

PRACTICE = dict(title='Unit 7 Practice — Circles, Area, Surface Area and Volume', sub='Circumference · Circle area · Composite area · Surface area · Volume', secs=[
    ('A. Circumference', 'NC.7.G.4', 'C = πd = 2πr. Use 3.14.', [
        Q(1, 'Find the circumference: diameter 5 in. Use 3.14.', ans=15.7, hint='3.14 × 5'),
        Q(2, 'A circle has radius 4 ft. Which is its circumference? Use 3.14.', ch=['25.12 ft', '12.56 ft', '50.24 ft', '8 ft'],
          why={'12.56 ft': 'You used the radius as the diameter. d = 8.', '50.24 ft': 'That is the area (πr²).', '8 ft': 'That is the diameter. Multiply by π.'}, hint='C = 2 × 3.14 × 4'),
        Q(3, 'A wheel rolls 314 cm in 5 full turns. What is its diameter, in cm? Use 3.14.', ans=20, hint='One turn: 314 ÷ 5. Then d = C ÷ 3.14.')]),
    ('B. Area of a Circle', 'NC.7.G.4', 'A = πr². Square the radius.', [
        Q(1, 'Find the area: radius 6 m. Use 3.14.', ans=113.04, hint='3.14 × 36'),
        Q(2, 'A circle has diameter 20 cm. What is its area? Use 3.14.', ch=['314 cm²', '1,256 cm²', '62.8 cm²', '125.6 cm²'],
          why={'1,256 cm²': 'You squared the diameter. r = 10.', '62.8 cm²': 'That is the circumference.', '125.6 cm²': 'You did 3.14 × 10 × 4. Square the radius: 10 × 10.'}, hint='r = 10.'),
        Q(3, 'A round rug with radius 3 ft lies on a 10 ft by 8 ft floor. How many ft² of floor are NOT covered? Use 3.14.', ans=51.74, hint='80 − 3.14 × 9')]),
    ('C. Composite Area', 'NC.7.G.6', 'Break it into pieces. Add, or subtract a missing piece.', [
        Q(1, 'A rectangle 8 m by 5 m has a triangle on top with base 8 m and height 3 m. What is the total area, in m²?', fig=housefig(), ans=52, hint='40 + 12'),
        Q(2, 'Which area is right for a trapezoid with bases 7 and 11 and height 6?', ch=['54', '108', '462', '24'],
          why={'108': 'You forgot the ½.', '462': 'You multiplied all three. Add the bases first.', '24': 'You added all three numbers.'}, hint='½ × (7 + 11) × 6'),
        Q(3, 'A 20 ft by 15 ft wall has a window 4 ft by 5 ft and a door 3 ft by 7 ft. How many ft² need paint?', ans=259, hint='300 − 20 − 21')]),
    ('D. Surface Area', 'NC.7.G.6', 'Add the areas of ALL the faces.', [
        Q(1, 'A cube has 2 ft edges. What is its surface area, in ft²?', ans=24, hint='6 × 4'),
        Q(2, 'A box is 5 by 2 by 3. What is the surface area?', ch=['62 square units', '31 square units', '30 square units', '10 square units'],
          why={'31 square units': 'Each face has a matching face. Double it.', '30 square units': 'That is the volume.', '10 square units': 'You added the lengths.'}, hint='2(10 + 15 + 6)'),
        Q(3, 'A tent is a triangular prism. The triangle ends have base 6 ft and height 4 ft, with slanted sides 5 ft. The tent is 10 ft long and has NO floor. How many ft² of cloth?', ans=124, hint='Two triangles + two 5 × 10 sides (no floor).')]),
    ('E. Volume', 'NC.7.G.6', 'V = Bh. Use cubic units.', [
        Q(1, 'A box is 4 by 4 by 4. What is its volume?', ans=64, hint='4 × 4 × 4'),
        Q(2, 'A prism has a base area of 2 1/2 in² and is 8 in tall. What is its volume?', ch=['20 in³', '10.5 in³', '16 in³', '80 in³'],
          why={'10.5 in³': 'You added. V = B × h.', '16 in³': 'You used 2, not 2 1/2.', '80 in³': '2 1/2 × 8 is not 80. Think: 2 × 8 plus ½ × 8.'}, hint='2.5 × 8'),
        Q(3, 'A pool is 12 m long, 10 m wide and 8 m deep. It has water 5 m deep. How many m³ more water fit?', ans=360, hint='12 × 10 × 3')]),
])
