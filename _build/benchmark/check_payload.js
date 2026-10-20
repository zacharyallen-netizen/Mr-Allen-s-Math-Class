// Feed saved page payloads to the real BenchmarkTracker.gs (in the Sheets stand-in).
const { load } = require('../tracker/mockgas');
const G = load(__dirname + '/BenchmarkTracker.gs'); G.setup();
let bad = 0;
for (const f of process.argv.slice(2)) {
  const r = JSON.parse(G.doPost({ postData: { contents: require('fs').readFileSync(f, 'utf8') } }).s);
  const ss = Object.values(G.__books)[0];
  const resp = ss.getSheetByName('Responses').data.slice(-15);
  const okStd = resp.every(row => /^NC\.8\./.test(row[5]));
  console.log(r.ok && okStd ? 'OK  ' : 'BAD ', f, JSON.stringify(r));
  if (!(r.ok && okStd)) bad++;
}
const ss = Object.values(G.__books)[0];
console.log(ss.getSheetByName('Gradebook').data.map(r => r.join(' | ')).join('\n'));
process.exit(bad ? 1 : 0);
