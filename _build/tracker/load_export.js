// Seed a mock Spreadsheet (from mockgas.js) with a text export of the real Sheet.
// Export format: "## Sheet name: <tab>" then that tab as CSV (quoted fields may span lines).
// Values become what Google Sheets would hand the script: Date objects, numbers, 0.93 for "93%".
const fs = require('fs');

function parseCSV(text) {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; }
      else f += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(f); f = ''; }
    else if (ch === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
    else if (ch !== '\r') f += ch;
  }
  if (f !== '' || row.length) { row.push(f); rows.push(row); }
  return rows;
}

function cell(v) {
  const s = String(v);
  let m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?: (\d{1,2}):(\d{2}):(\d{2}))?$/.exec(s);
  if (m) return new Date(+m[3], +m[1] - 1, +m[2], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
  if (/^-?\d+(\.\d+)?%$/.test(s)) return parseFloat(s) / 100;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return s;
}

/** Returns { tabName: rows[][] } */
function readExport(file) {
  const text = fs.readFileSync(file, 'utf8');
  const parts = text.split(/^## Sheet name: (.+)$/m);
  const tabs = {};
  for (let i = 1; i < parts.length; i += 2) {
    const name = parts[i].trim();
    let body = parts[i + 1].replace(/^\n/, '').replace(/\n+$/, '\n');
    tabs[name] = parseCSV(body).map(r => r.map(cell));
  }
  return tabs;
}

/** Replace the contents of the named tabs in a mock Spreadsheet with the export's rows. */
function seed(ss, tabs, only) {
  Object.keys(tabs).forEach(name => {
    if (only && only.indexOf(name) < 0) return;
    const sh = ss.getSheetByName(name) || ss.insertSheet(name);
    sh.clear();
    tabs[name].forEach((r, i) => r.forEach((v, j) => sh.set(i + 1, j + 1, v)));
  });
}

module.exports = { readExport, seed, parseCSV };
