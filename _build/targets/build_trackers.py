#!/usr/bin/env python3
"""Add practice-question hyperlinks to the Teacher Master and Student Digital trackers."""
import json, re, copy, sys
import openpyxl
from openpyxl.styles import Font, Alignment
from openpyxl.worksheet.hyperlink import Hyperlink
sys.path.insert(0, "/home/claude/work/tools")
from build import DOMAINS, BASE_URL

SRC = "/home/claude/work/src"
OUT = "/home/claude/work/out"
targets = json.load(open("/home/claude/work/data/targets.json"))
SLUG = {s: d["slug"] for d in DOMAINS for s in d["order"]}
CODES = {t["code"] for t in targets}
HUB = BASE_URL + "index.html"


def url_code(code):
    std = "NC.8." + code.split("-")[0]
    return f"{BASE_URL}{SLUG[std]}.html#{code}"


def url_std(std):
    return f"{BASE_URL}{SLUG[std]}.html#{std}"


def style_from(dst, src):
    dst.font = copy.copy(src.font)
    dst.fill = copy.copy(src.fill)
    dst.border = copy.copy(src.border)
    dst.alignment = copy.copy(src.alignment)
    dst.number_format = src.number_format


def link(cell, url, text=None, tip=None):
    if text is not None:
        cell.value = text
    cell.hyperlink = Hyperlink(ref=cell.coordinate, target=url, tooltip=tip)
    cell.hyperlink.target = url


# ======================================================================= student digital
def student():
    wb = openpyxl.load_workbook(f"{SRC}/student_digital.xlsx")
    n_links = 0
    for ws in wb.worksheets:
        if not ws.title.startswith("Unit "):
            continue
        # widen merges A:F -> A:G
        for rng in list(ws.merged_cells.ranges):
            if rng.min_col == 1 and rng.max_col == 6:
                r = rng.min_row
                ws.unmerge_cells(str(rng))
                ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=7)
                style_from(ws.cell(r, 7), ws.cell(r, 6))
        ws.column_dimensions["G"].width = 13
        std = None
        for row in range(1, ws.max_row + 1):
            a = ws.cell(row, 1).value
            if isinstance(a, str) and a.startswith("NC.8."):
                std = a.split(" ")[0]
                # standard heading row: add a practice-all link in G
                g = ws.cell(row, 7)
                style_from(g, ws.cell(row, 6))
            if ws.cell(row, 6).value == "Lesson link":
                g = ws.cell(row, 7)
                style_from(g, ws.cell(row, 6))
                g.value = "Practice"
            if isinstance(a, int) and std:
                code = std.replace("NC.8.", "") + f"-{a}"
                assert code in CODES, (ws.title, row, code)
                g = ws.cell(row, 7)
                style_from(g, ws.cell(row, 6))
                g.font = Font(name=ws.cell(row, 6).font.name, size=ws.cell(row, 6).font.size, color="FF0563C1", underline="single", bold=True)
                g.alignment = Alignment(horizontal="center", vertical="center")
                link(g, url_code(code), "Try it →", f"Practice question for {code}")
                n_links += 1
        # unit header link row 2 stays; print area
        if ws.print_area:
            ws.print_area = re.sub(r"\$F\$", "$G$", ws.print_area if isinstance(ws.print_area, str) else ws.print_area[0])
    # My Scores: column K practice link per standard
    ms = wb["My Scores"]
    for rng in list(ms.merged_cells.ranges):
        if str(rng) == "A1:J1":
            ms.unmerge_cells("A1:J1"); ms.merge_cells("A1:K1")
    ms.column_dimensions["K"].width = 12
    style_from(ms["K3"], ms["J3"]); ms["K3"].value = "Practice"
    for row in range(4, ms.max_row + 1):
        std = ms.cell(row, 2).value
        if isinstance(std, str) and std.startswith("NC.8."):
            k = ms.cell(row, 11)
            style_from(k, ms.cell(row, 10))
            link(k, url_std(std), "Try it →", f"All practice questions for {std}")
            n_links += 1
    # Start Here
    sh = wb["Start Here"]
    sh["A13"].value = "4. Stuck? Click Try it → to answer a practice question for that statement, or the lesson link to review the lesson."
    style_from(sh["A25"], sh["A24"]); style_from(sh["B25"], sh["B24"])
    sh["A25"].value = "I Can Targets"
    link(sh["B25"], HUB, "Open every practice question")
    n_links += 1
    wb.save(f"{OUT}/Student I Can Tracker - Digital.xlsx")
    print("student links added:", n_links)


# ======================================================================= teacher master
def master():
    wb = openpyxl.load_workbook(f"{SRC}/master.xlsx")
    key = wb["Standards Key"]
    style_from(key["J2"], key["I2"]); key["J2"].value = "Practice question"
    key.column_dimensions["J"].width = 18
    n = 0
    for row in range(3, key.max_row + 1):
        code = key.cell(row, 4).value
        if code in CODES:
            c = key.cell(row, 10)
            style_from(c, key.cell(row, 9))
            link(c, url_code(code), f"Try it: {code}", f"Practice question for {code}")
            n += 1
    if key.auto_filter.ref:
        key.auto_filter.ref = re.sub(r"I(\d+)$", r"J\1", key.auto_filter.ref)
    for ws in wb.worksheets:
        if not ws.title.startswith("Period"):
            continue
        for c in ws[5]:
            v = c.value
            if isinstance(v, str) and v in CODES:
                link(c, url_code(v))
                f = copy.copy(c.font); f.underline = "single"; c.font = f
                n += 1
            elif isinstance(v, str) and v.startswith("NC.8."):
                link(c, url_std(v))
                f = copy.copy(c.font); f.underline = "single"; c.font = f
                n += 1
    hw = wb["How to Use"]
    # append a section about the links
    r = hw.max_row + 2
    style_from(hw.cell(r, 1), hw["A16"]); hw.cell(r, 1).value = "Practice question links"
    lines = ["• Every statement code in row 5 of each period tab (for example NS.1-5) and every standard code is a link. Click it to open that target's practice question on the class website (Ctrl/⌘-click in Excel; in Google Sheets click, then the link that pops up).",
             "• The Standards Key's Practice question column has the same links.",
             "• Students have the same links in their Student I Can Tracker (Try it → column)."]
    for i, t in enumerate(lines, 1):
        style_from(hw.cell(r + i, 1), hw["A17"]); hw.cell(r + i, 1).value = t
    style_from(hw.cell(r + 4, 1), hw["A17"])
    link(hw.cell(r + 4, 1), HUB, "I Can Targets home: " + HUB)
    hw.cell(r + 4, 1).font = Font(color="FF0563C1", underline="single", name=hw["A17"].font.name, size=hw["A17"].font.size)
    wb.save(f"{OUT}/2627 Standards Progress Tracker - MASTER I Can.xlsx")
    print("master links added:", n)


if __name__ == "__main__":
    import os
    os.makedirs(OUT, exist_ok=True)
    student(); master()
