/**
 * ════════════════════════════════════════════════════════════════════
 *  FLUENCY LAB  ·  SCORE TRACKER
 *  Mr. Allen's Math Class · IC Imagine
 * ════════════════════════════════════════════════════════════════════
 *
 *  This receives Skill Check scores from your website and writes them
 *  into a private Google Sheet that only you can see. Students never
 *  sign in to anything and never leave your site.
 *
 *  SET IT UP  — five steps, about five minutes, once ever
 *
 *   1. Go to  script.google.com  →  New project.
 *      Delete whatever is in the editor and paste this whole file in.
 *
 *   2. Press  Run  with  setup  selected in the little dropdown at the
 *      top. Approve the permissions when Google asks
 *      (Advanced → "Go to ... (unsafe)" → Allow — it says that because
 *      the script is yours and not published by a company).
 *      The log at the bottom will print a link to your new Sheet.
 *
 *   3. Click  Deploy  (top right)  →  New deployment.
 *      Press the gear icon next to "Select type" and choose  Web app.
 *
 *   4. Set:   Description:  anything
 *             Execute as:   Me
 *             Who has access:  Anyone          ← this matters
 *      Then  Deploy, and approve again if asked.
 *
 *   5. Copy the  Web app URL  it gives you (it ends in /exec)
 *      and send it to Mr. Allen's assistant, or paste it into
 *      fluency-config.js on the website. That's it.
 *
 *  ──────────────────────────────────────────────────────────────────
 *  A NOTE ON "Anyone"
 *  "Anyone" means anyone holding that URL can send a score. The URL is
 *  long and random, and the CLASS_CODE below must match, so stray
 *  traffic is very unlikely. Nothing can be READ back out through it —
 *  it only accepts a score and writes it to your private Sheet. If you
 *  ever want a clean slate, make a new deployment and the old URL dies.
 * ════════════════════════════════════════════════════════════════════
 */

/** Must match CLASS_CODE in fluency-config.js on the website. */
var CLASS_CODE = 'allen-8th';

/** What counts as mastery on the Summary tab. */
var MASTERY_PCT = 80;

var SHEET_NAME   = 'Fluency Lab — Student Scores';
var LOG_TAB      = 'Scores';
var SUMMARY_TAB  = 'Summary';

var MODULES = ['Add & Subtract','Multiply','Divide','Fractions',
               'Decimals & Percents','Integers','Ratios & Proportions',
               'Expressions & Order of Operations'];

// ════════════════════════════════════════════════════════════════════
//  STEP 2 — run this once
// ════════════════════════════════════════════════════════════════════
function setup() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID');
  var ss = null;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; } }
  if (!ss) {
    ss = SpreadsheetApp.create(SHEET_NAME);
    props.setProperty('SHEET_ID', ss.getId());
  }

  var log = ss.getSheetByName(LOG_TAB) || ss.insertSheet(LOG_TAB);
  if (log.getLastRow() === 0) {
    log.appendRow(['When','Student','Skill','Score','Out of','Percent']);
    log.getRange('A1:F1').setFontWeight('bold')
       .setBackground('#1E2D4F').setFontColor('#ffffff');
    log.setFrozenRows(1);
    log.setColumnWidth(1,160); log.setColumnWidth(2,180); log.setColumnWidth(3,230);
  }
  if (!ss.getSheetByName(SUMMARY_TAB)) ss.insertSheet(SUMMARY_TAB);

  // tidy up the default empty sheet
  var blank = ss.getSheetByName('Sheet1');
  if (blank && ss.getSheets().length > 1 && blank.getLastRow() === 0) ss.deleteSheet(blank);

  rebuildSummary();

  Logger.log('✓ Ready.');
  Logger.log('Your private Sheet: ' + ss.getUrl());
  Logger.log('Now do steps 3–5 at the top of this file (Deploy → Web app).');
  return ss.getUrl();
}

// ════════════════════════════════════════════════════════════════════
//  the website posts here
// ════════════════════════════════════════════════════════════════════
function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);

    if (String(d.code) !== CLASS_CODE) return json({ ok: false, error: 'bad code' });

    var name   = tidyName(d.name);
    var module = String(d.module || '').trim();
    var score  = Number(d.score);
    var total  = Number(d.total);

    if (!name)                       return json({ ok:false, error:'no name' });
    if (MODULES.indexOf(module) < 0) return json({ ok:false, error:'unknown skill' });
    if (!(score >= 0 && score <= total && total > 0 && total <= 100))
                                     return json({ ok:false, error:'bad score' });

    var ss  = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID'));
    var log = ss.getSheetByName(LOG_TAB);
    var pct = Math.round(score / total * 100);
    log.appendRow([new Date(), name, module, score, total, pct / 100]);
    log.getRange(log.getLastRow(), 6).setNumberFormat('0%');

    rebuildSummary();
    return json({ ok: true, name: name, pct: pct });

  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

/** Visiting the URL in a browser just confirms it is alive. */
function doGet() {
  return ContentService.createTextOutput(
    'Fluency Lab score tracker is running. Scores are posted here by the website.'
  );
}

// ════════════════════════════════════════════════════════════════════
//  Summary tab — one row per student, best score per skill
// ════════════════════════════════════════════════════════════════════
function rebuildSummary() {
  var ss  = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID'));
  var log = ss.getSheetByName(LOG_TAB);
  var sum = ss.getSheetByName(SUMMARY_TAB) || ss.insertSheet(SUMMARY_TAB);
  sum.clear();

  var header = ['Student'].concat(MODULES).concat(['Skills mastered']);
  sum.appendRow(header);
  sum.getRange(1, 1, 1, header.length).setFontWeight('bold')
     .setBackground('#1E2D4F').setFontColor('#ffffff').setWrap(true)
     .setVerticalAlignment('middle');
  sum.setFrozenRows(1); sum.setFrozenColumns(1);
  sum.setRowHeight(1, 54); sum.setColumnWidth(1, 180);

  var last = log.getLastRow();
  if (last < 2) { sum.getRange(2,1).setValue('No scores submitted yet.'); return; }

  var rows = log.getRange(2, 2, last - 1, 5).getValues();   // Student..Percent
  var best = {};                                            // name -> {module: pct}
  rows.forEach(function (r) {
    var n = r[0], m = r[1], pct = Math.round(Number(r[4]) * 100);
    if (!n || !m) return;
    if (!best[n]) best[n] = {};
    if (best[n][m] == null || pct > best[n][m]) best[n][m] = pct;
  });

  var names = Object.keys(best).sort();
  var out = names.map(function (n) {
    var line = [n], mastered = 0;
    MODULES.forEach(function (m) {
      var v = best[n][m];
      if (v == null) { line.push(''); }
      else { line.push(v / 100); if (v >= MASTERY_PCT) mastered++; }
    });
    line.push(mastered + ' of ' + MODULES.length);
    return line;
  });
  if (!out.length) return;

  sum.getRange(2, 1, out.length, header.length).setValues(out);
  sum.getRange(2, 2, out.length, MODULES.length)
     .setNumberFormat('0%').setHorizontalAlignment('center');

  // colour: green at/above mastery, amber partway, red low, grey if not attempted
  for (var r = 0; r < out.length; r++) {
    for (var c = 0; c < MODULES.length; c++) {
      var cell = sum.getRange(r + 2, c + 2);
      var v = out[r][c + 1];
      if (v === '')              cell.setBackground('#f1f3f4');
      else if (v * 100 >= MASTERY_PCT) cell.setBackground('#d4edda');
      else if (v * 100 >= 60)    cell.setBackground('#fff3cd');
      else                       cell.setBackground('#f8d7da');
    }
  }
  sum.getRange(2, header.length, out.length, 1).setFontWeight('bold');
  for (var i = 2; i <= header.length; i++) sum.setColumnWidth(i, 110);
}

// ════════════════════════════════════════════════════════════════════
//  helpers
// ════════════════════════════════════════════════════════════════════
function tidyName(s) {
  s = String(s || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  return s.replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); });
}
function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
                       .setMimeType(ContentService.MimeType.JSON);
}

/** Handy: open the Sheet without hunting for it. */
function openMySheet() {
  Logger.log(SpreadsheetApp.openById(
    PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getUrl());
}
