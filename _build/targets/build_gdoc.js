// Build the student "My Math Steps" tracker as .docx (to be converted into a Google Doc).
const fs = require('fs');
const D = require('docx');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType,
  BorderStyle, AlignmentType, HeadingLevel, PageBreak, VerticalAlign, TableLayoutType } = D;

const steps = [].concat(...['steps_nse', 'steps_fsp', 'steps_geo'].map(f =>
  JSON.parse(fs.readFileSync(`/home/claude/work/data/${f}.json`, 'utf8'))));
const targets = JSON.parse(fs.readFileSync('/home/claude/work/data/targets.json', 'utf8'));
const meta = {}; targets.forEach(t => { meta[t.standard] = meta[t.standard] || { type: t.type, unit: t.unit, title: t.title }; });
const byStd = {}; steps.forEach(s => byStd[s.standard] = s);

const UNITS = [
  ['U1', 'Real Numbers', ['NC.8.NS.1', 'NC.8.EE.2', 'NC.8.NS.2']],
  ['U2', 'Exponents & Scientific Notation', ['NC.8.EE.1', 'NC.8.EE.3', 'NC.8.EE.4']],
  ['U3', 'Equations & Inequalities', ['NC.8.EE.7']],
  ['U4', 'Angles & Triangles', ['NC.8.G.5']],
  ['U5', 'The Pythagorean Theorem', ['NC.8.G.6', 'NC.8.G.7', 'NC.8.G.8']],
  ['U6', 'Functions, Slope & Systems', ['NC.8.F.1', 'NC.8.F.3', 'NC.8.F.4', 'NC.8.F.2', 'NC.8.F.5', 'NC.8.EE.8']],
  ['U7', 'Data Analysis', ['NC.8.SP.1', 'NC.8.SP.2', 'NC.8.SP.3', 'NC.8.SP.4']],
  ['U8', 'Transformations', ['NC.8.G.3', 'NC.8.G.2', 'NC.8.G.4']],
  ['U9', 'Volume', ['NC.8.G.9']],
];
const NAVY = '1E2D4F', GOLD_BG = 'FFF1C2', BLUE_BG = 'DCE8F8', MUTED = '5B6475';
const LV = { Approaching: ['8A6100', 'Approaching'], Proficient: ['1D4ED8', 'Proficient'], Mastery: ['15803D', 'Mastery'] };
const FONT = 'Arial';
const W_BOX = 720, W_TXT = 7380, W_LVL = 1620, W_ALL = W_BOX + W_TXT + W_LVL; // 9720 = 6.75in
const line = { style: BorderStyle.SINGLE, size: 6, color: 'B8C0CF' };
const borders = { top: line, bottom: line, left: line, right: line };

function run(text, o = {}) { return new TextRun({ text, font: FONT, size: o.size || 24, bold: o.bold, color: o.color, italics: o.italics }); }
function para(children, o = {}) { return new Paragraph({ children, spacing: { before: o.before || 0, after: o.after ?? 80 }, alignment: o.align, heading: o.heading, shading: o.shading, keepNext: o.keepNext, pageBreakBefore: o.pageBreakBefore }); }

function stdTable(stdCode) {
  const s = byStd[stdCode], m = meta[stdCode];
  const rows = s.steps.map((st, i) => {
    const lv = st.extension ? ['5B6475', 'Extra challenge'] : LV[st.level];
    return new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: W_BOX, type: WidthType.DXA }, borders, verticalAlign: VerticalAlign.CENTER,
        children: [para([run('☐', { size: 36, color: NAVY })], { align: AlignmentType.CENTER, after: 0 })] }),
      new TableCell({ width: { size: W_TXT, type: WidthType.DXA }, borders, margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [
          para([run(`${i + 1}.  `, { bold: true, color: NAVY }), run(st.text, { bold: true })], { after: 40 }),
          para([run('Example: ', { size: 21, color: MUTED, italics: true }), run(st.example, { size: 21, color: MUTED })], { after: 0 }),
        ] }),
      new TableCell({ width: { size: W_LVL, type: WidthType.DXA }, borders, verticalAlign: VerticalAlign.CENTER,
        children: [para([run(lv[1], { size: 20, bold: true, color: lv[0] })], { align: AlignmentType.CENTER, after: 0 })] }),
    ] });
  });
  const pri = m.type === 'Priority';
  return [
    para([run(`${stdCode.replace('NC.8.', '')}  ·  ${s.student_title}`, { size: 28, bold: true, color: NAVY })],
      { heading: HeadingLevel.HEADING_2, shading: { type: ShadingType.CLEAR, fill: pri ? GOLD_BG : BLUE_BG, color: 'auto' }, before: 280, after: 40, keepNext: true }),
    para([run(`${stdCode} — ${m.title}`, { size: 18, color: MUTED })], { after: 100, keepNext: true }),
    new Table({ width: { size: W_ALL, type: WidthType.DXA }, columnWidths: [W_BOX, W_TXT, W_LVL], layout: TableLayoutType.FIXED, rows }),
  ];
}

const kids = [];
// ---- cover page
kids.push(para([run('My Math Steps', { size: 52, bold: true, color: NAVY })], { heading: HeadingLevel.TITLE, after: 60 }));
kids.push(para([run("8th Grade Math  ·  Mr. Allen  ·  2026–27", { size: 24, color: MUTED })], { after: 360 }));
kids.push(para([run('Name: ______________________________     Period: ________', { size: 26 })], { after: 360 }));
kids.push(para([run('How it works', { size: 30, bold: true, color: NAVY })], { after: 120 }));
[['1.', 'Find the unit we are working on. Each unit starts on a new page.'],
 ['2.', 'Read the steps in order. Each step gets you closer to Mastery.'],
 ['3.', 'When you can do a step on your own, put an X in its box ☐.']].forEach(([n, t]) =>
  kids.push(para([run(n + '  ', { bold: true, color: NAVY, size: 26 }), run(t, { size: 26 })], { after: 120 })));
kids.push(para([run('Colors', { size: 30, bold: true, color: NAVY })], { before: 300, after: 120 }));
const keyRow = (fill, label, note) => new TableRow({ children: [
  new TableCell({ width: { size: 900, type: WidthType.DXA }, borders, shading: { type: ShadingType.CLEAR, fill, color: 'auto' }, children: [para([run(' ')], { after: 0 })] }),
  new TableCell({ width: { size: 8820, type: WidthType.DXA }, borders, margins: { left: 140, top: 60, bottom: 60 },
    children: [para([run(label, { bold: true, size: 24 }), run('  ' + note, { size: 22, color: MUTED })], { after: 0 })] })] });
kids.push(new Table({ width: { size: 9720, type: WidthType.DXA }, columnWidths: [900, 8820], rows: [
  keyRow(GOLD_BG, 'Gold', 'a big (priority) standard'), keyRow(BLUE_BG, 'Blue', 'a supporting standard')] }));
kids.push(para([run('Step labels:  ', { size: 24, bold: true }), run('Approaching', { size: 24, bold: true, color: LV.Approaching[0] }),
  run(' → ', { size: 24 }), run('Proficient', { size: 24, bold: true, color: LV.Proficient[0] }), run(' → ', { size: 24 }),
  run('Mastery', { size: 24, bold: true, color: LV.Mastery[0] })], { before: 200, after: 300 }));
kids.push(para([run('Units', { size: 30, bold: true, color: NAVY })], { after: 120 }));
UNITS.forEach(([u, name]) => kids.push(para([run(`Unit ${u.slice(1)}  `, { bold: true, color: NAVY }), run(name)], { after: 40 })));

// ---- units
UNITS.forEach(([u, name, stds]) => {
  kids.push(para([run(`Unit ${u.slice(1)} — ${name}`, { size: 40, bold: true, color: NAVY })],
    { heading: HeadingLevel.HEADING_1, pageBreakBefore: true, after: 120 }));
  stds.forEach(s => kids.push(...stdTable(s)));
});

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 24 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', run: { font: FONT, size: 40, bold: true, color: NAVY }, paragraph: { outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', run: { font: FONT, size: 28, bold: true, color: NAVY }, paragraph: { outlineLevel: 1 } },
      { id: 'Title', name: 'Title', basedOn: 'Normal', next: 'Normal', run: { font: FONT, size: 52, bold: true, color: NAVY } }] },
  sections: [{ properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, bottom: 1080, left: 1260, right: 1260 } } }, children: kids }],
});
Packer.toBuffer(doc).then(b => { fs.writeFileSync('/home/claude/work/out/My Math Steps - Student Tracker.docx', b); console.log('ok', b.length); });
