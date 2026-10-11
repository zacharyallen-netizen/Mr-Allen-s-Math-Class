// Usage: node check_payload.js payload.json [more.json ...]
// Feeds captured website payloads into the real tracker script (mocked Google services) and reports what it would store.
const { load } = require('./mockgas'); const fs = require('fs');
const G = load(__dirname + '/ScoreTracker_v2.gs'); G.setup();
let bad = 0;
for (const f of process.argv.slice(2)) {
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  const r = JSON.parse(G.doPost({ postData: { contents: JSON.stringify(d) } }).s);
  const noStd = (d.items || []).filter(i => !/^NC\.(8\.[A-Z]{1,2}\.\d{1,2}|M1\.[A-Z]{1,3}-[A-Z]{2,4}\.\d{1,2}[a-z]?)$/.test(i.std || '')).length;
  const bands = [...new Set((d.items || []).map(i => i.band))].join(',');
  const ok = r.ok && noStd === 0;
  if (!ok) bad++;
  console.log((ok ? 'OK  ' : 'BAD ') + f.split('/').pop() + ' kind=' + d.kind + ' unit=' + d.unit + ' items=' + (d.items || []).length +
              ' bands=' + bands + (noStd ? ' MISSING/INVALID STANDARD on ' + noStd : '') + (r.ok ? '' : ' REJECTED: ' + r.error));
}
G.refreshReports();
console.log(bad ? bad + ' payload(s) need fixing' : 'all payloads accepted');
process.exitCode = bad ? 1 : 0;
