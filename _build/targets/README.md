# I Can Targets — build notes

The pages in `grade8/targets/` are generated. To change a question, edit its JSON in `data/` and run
`python3 build.py` (paths at the top of build.py point at the original work folder — adjust WORK/SITE first).

- `data/targets.json` — the 218 targets (from the Standards Key of the master tracker)
- `data/q_*.json` — one multiple-choice question per target (first choice = correct; the page shuffles)
- `build.py` — renders hub + 4 domain pages; `--check` validates; `--preview CODES out.html` for one-off cards
- `build_trackers.py` / `build_pdf.py` — add the practice links to the Excel trackers and make the condensed PDF
- `../../grade8/targets/explore.js` — the "Explore it" widgets
