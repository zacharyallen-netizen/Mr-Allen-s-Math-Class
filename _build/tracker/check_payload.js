// Usage: node check_payload.js payload.json [more.json ...]
// Feeds captured website payloads into the real tracker script (mocked Google services) and reports what it would store.
const { load } = require('./mockgas'); const fs = require('fs');
// the newest script on this computer (v3 is private — not in the repo — so fall back to v2)
const SCRIPT = ['ScoreTracker_v3.gs', 'ScoreTracker_v2.gs'].find(f => fs.existsSync(__dirname + '/' + f));
const G = load(__dirname + '/' + SCRIPT); G.setup();
console.log('checking against ' + SCRIPT);
let bad = 0;
for (const f of process.argv.slice(2)) {
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  const r = JSON.parse(G.doPost({ postData: { contents: JSON.stringify(d) } }).s);
  // Fluency Lab work (unit "Fluency": practice sets, Flashpoint) has no NC Math 8 standard by design
  const noStd = d.unit === 'Fluency' ? 0 : (d.items || []).filter(i => !/^NC\.(8\.[A-Z]{1,2}\.\d{1,2}|M1\.[A-Z]{1,3}-[A-Z]{2,4}\.\d{1,2}[a-z]?)$/.test(i.std || '')).length;
  const bands = [...new Set((d.items || []).map(i => i.band))].join(',');
  const ok = r.ok && noStd === 0;
  if (!ok) bad++;
  console.log((ok ? 'OK  ' : 'BAD ') + f.split('/').pop() + ' kind=' + d.kind + ' unit=' + d.unit + ' items=' + (d.items || []).length +
              (d.unit === 'Fluency' ? ' page="' + d.page + '"' : '') +
              ' bands=' + bands + (noStd ? ' MISSING/INVALID STANDARD on ' + noStd : '') + (r.ok ? '' : ' REJECTED: ' + r.error));
}
G.refreshReports();
console.log(bad ? bad + ' payload(s) need fixing' : 'all payloads accepted');
process.exitCode = bad ? 1 : 0;
