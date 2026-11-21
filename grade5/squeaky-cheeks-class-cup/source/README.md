# Building the 5th grade Class Cup game

`index.html` (one folder up) is built from Mr. Allen's 8th grade game plus these files:

| File | What |
|---|---|
| `squeaky-cheeks-grade8-original.html` | Copy of `grade8/squeaky-cheeks.html` from Mr. Allen's site (Nov 21, 2026) |
| `q5.js` | 5th grade question bank + models (NC.5.NF.4, NC.5.MD.4–5). Exact answers, a named mistake for common wrong answers |
| `math_ui.js` | Answer boxes (whole number, mixed number, tap choices), bonus beans, feedback |
| `cup.js` | Class Cup: homeroom picker, class totals, projector board (only inside the Apps Script web app) |
| `build.py` | `python3 build.py squeaky-cheeks-grade8-original.html ../index.html` |

Tests (Node + Playwright):
- `node fakegas.js`: runs the real `../Code.gs` against a fake Sheet.
- `t_game.js` and `t_mixed.js`: play every room at 390 px and 1100 px with no console errors and no sideways scrolling. They also check the Class Cup with a fake `google.script.run`.
  Serve this folder's parent with `python3 -m http.server 8766`, copy `index.html` to `game.html`, then run the tests.
