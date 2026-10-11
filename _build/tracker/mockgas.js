// Minimal, strict mock of the Google Apps Script services the tracker uses.
// Throws on the mistakes that break real scripts (wrong setValues/setBackgrounds sizes, bad ranges).
const fs = require('fs'), vm = require('vm');

function colIdx(s) { let n = 0; for (const ch of s) n = n * 26 + (ch.charCodeAt(0) - 64); return n; }
function parseA1(a1) {
  const m = /^([A-Z]+)(\d+)(?::([A-Z]+)(\d+))?$/.exec(a1); if (!m) throw new Error('bad A1 ' + a1);
  const r1 = +m[2], c1 = colIdx(m[1]), r2 = m[4] ? +m[4] : r1, c2 = m[3] ? colIdx(m[3]) : c1;
  return [r1, c1, r2 - r1 + 1, c2 - c1 + 1];
}
class Range {
  constructor(sh, r, c, nr, nc) {
    if (!(r >= 1 && c >= 1 && nr >= 1 && nc >= 1)) throw new Error(`bad range ${r},${c},${nr},${nc} on ${sh.name}`);
    Object.assign(this, { sh, r, c, nr, nc });
  }
  getValues() { const out = []; for (let i = 0; i < this.nr; i++) { const row = []; for (let j = 0; j < this.nc; j++) { const v = (this.sh.data[this.r - 1 + i] || [])[this.c - 1 + j]; row.push(v === undefined ? '' : v); } out.push(row); } return out; }
  setValues(v) {
    if (v.length !== this.nr || v.some(r => r.length !== this.nc)) throw new Error(`setValues size ${v.length}x${v[0] && v[0].length} != ${this.nr}x${this.nc} on ${this.sh.name}`);
    v.forEach((row, i) => row.forEach((x, j) => { if (x === undefined || (typeof x === 'number' && !isFinite(x))) throw new Error('bad value ' + x + ' at ' + (this.r + i) + ',' + (this.c + j) + ' on ' + this.sh.name); this.sh.set(this.r + i, this.c + j, x); })); return this;
  }
  setValue(x) { this.sh.set(this.r, this.c, x); return this; }
  setBackgrounds(b) { if (b.length !== this.nr || b.some(r => r.length !== this.nc)) throw new Error(`setBackgrounds size mismatch on ${this.sh.name}`); return this; }
}
['setBackground','setNumberFormat','setFontWeight','setFontColor','setFontStyle','setFontSize','setWrap',
 'setVerticalAlignment','setHorizontalAlignment'].forEach(f => { Range.prototype[f] = function () { return this; }; });

class Sheet {
  constructor(name) { this.name = name; this.data = []; }
  set(r, c, v) { while (this.data.length < r) this.data.push([]); const row = this.data[r - 1]; while (row.length < c) row.push(''); row[c - 1] = v; }
  getLastRow() { for (let i = this.data.length; i > 0; i--) if (this.data[i - 1].some(v => v !== '' && v !== undefined)) return i; return 0; }
  appendRow(row) { const r = this.getLastRow() + 1; row.forEach((v, j) => this.set(r, j + 1, v)); return this; }
  getRange(a, b, c, d) { if (typeof a === 'string') return new Range(this, ...parseA1(a)); return new Range(this, a, b, c || 1, d || 1); }
  clear() { this.data = []; return this; }
}
['setFrozenRows','setFrozenColumns','setColumnWidth','setRowHeight'].forEach(f => { Sheet.prototype[f] = function () { return this; }; });

class Spreadsheet {
  constructor(name) { this.name = name; this.sheets = [new Sheet('Sheet1')]; this.id = 'SS' + Math.random().toString(36).slice(2); }
  getId() { return this.id; } getUrl() { return 'https://docs.google.com/spreadsheets/d/' + this.id; }
  getSheetByName(n) { return this.sheets.find(s => s.name === n) || null; }
  insertSheet(n) { if (this.getSheetByName(n)) throw new Error('dup sheet ' + n); const s = new Sheet(n); this.sheets.push(s); return s; }
  getSheets() { return this.sheets.slice(); }
  deleteSheet(s) { this.sheets = this.sheets.filter(x => x !== s); }
}

function load(file) {
  const books = {}, props = {}, triggers = [], logs = [];
  const ctx = {
    console, Math, JSON, Date, Number, String, Array, Object, isFinite, parseFloat, RegExp,
    SpreadsheetApp: {
      create(n) { const s = new Spreadsheet(n); books[s.id] = s; return s; },
      openById(id) { if (!books[id]) throw new Error('no book ' + id); return books[id]; }
    },
    PropertiesService: { getScriptProperties: () => ({ getProperty: k => props[k] || null, setProperty: (k, v) => { props[k] = v; } }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: s => ({ s, setMimeType() { return this; } }) },
    ScriptApp: { getProjectTriggers: () => triggers.map(t => ({ getHandlerFunction: () => t })),
                 newTrigger: h => ({ timeBased: () => ({ everyHours: () => ({ create: () => triggers.push(h) }) }) }) },
    Logger: { log: m => logs.push(m) }
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  ctx.__books = books; ctx.__triggers = triggers; ctx.__logs = logs; ctx.__props = props;
  return ctx;
}
module.exports = { load };
