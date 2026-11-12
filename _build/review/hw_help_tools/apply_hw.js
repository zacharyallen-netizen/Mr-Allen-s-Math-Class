const fs = require('fs');
const { HELP, noteTopic, fits, D } = require('./topics.js');
Object.assign(HELP, {
  lin:    ['Linear means y changes by the SAME amount each time x goes up by 1, so the graph is a straight line. Find the change from each y to the next.', 'Common mistake: calling it linear because it always goes up. The change must be the same every time.'],
  mean:   ['In y = mx + b, m is the amount added EACH time x goes up by 1 (the rate). b is the starting amount, when x = 0.', 'Common mistake: switching them. The number WITH x is the rate. The number by itself is the start.'],
  cubev:  ['Volume of a cube = edge × edge × edge. An edge of 4 cm: 4 × 4 × 4 = 64 cm³. To go back from volume to edge, take the cube root.', 'Common mistakes: multiplying by 3 instead of cubing (4 × 3 = 12), and squaring instead of cubing.'],
  sysn:   ['Compare the slopes and the y-intercepts. Different slopes: the lines cross once (one solution). Same slope, different y-intercepts: parallel lines (no solution). Same slope AND same y-intercept: the same line (infinitely many).', 'Common mistakes: thinking parallel lines cross, and thinking two y-intercepts mean two solutions.'],
  scicmp: ['Compare the powers of 10 first: the bigger exponent is the bigger number (when both front numbers are 1 to 9). If the exponents match, compare the front numbers.', 'Common mistake: comparing only the front numbers. 5 × 10⁸ is less than 2 × 10⁹, because 10⁹ is ten times bigger than 10⁸.'],
});
// Claude's decision for each flagged problem (Nov 12, 2026): the real topic, or 'keep' when the current help already fits.
const T = {
 '1.1#9':'cls','1.2#9':'cls','1.6#2':'order','4.1#6':'ang','4.2#6':'ang','4.4#1':'ang','4.4#6':'ang','4.4#10':'ang','4.5#6':'tri','4.6#7':'ang',
 '4.5#4':'keep','4.5#10':'keep','4.6#8':'keep','6.4#9':'lin','6.8#3':'lin','7.1#2':'lin','E.6#1':'lin','6.5#7':'slope','6.7#10':'line','6.8#2':'line',
 '6.11#1':'line','6.11#3':'line','6.11#4':'line','6.11#10':'line','6.12#1':'keep','6.12#6':'keep','6.12#7':'keep','6.12#9':'keep','6.13#9':'keep','7.1#9':'keep',
 '7.2#1':'mean','7.2#10':'mean','7.3#5':'mean','7.4#4':'mean','7.2#2':'mean','7.2#6':'line','7.5#6':'line','7.2#9':'keep','8.3#3':'keep','8.4#7':'keep',
 '8.5#1':'cong','8.5#2':'cong','8.5#4':'cong','8.5#6':'keep','8.5#9':'keep','8.7#9':'keep','1.3#2':'keep','1.3#8':'keep','1.5#9':'keep','1.7#9':'keep',
 '1.8#2':'keep','1.8#9':'cbrt','2.1#8':'cubev','2.4#5':'exp','2.6#5':'exp','2.6#9':'keep','2.8#4':'scicmp','E.2#4':'scicmp','2.8#6':'keep','3.2#5':'word',
 '3.2#10':'keep','3.4#9':'peri','3.4#10':'check','3.6#8':'check','3.5#3':'keep','5.1#3':'pyth','5.4#6':'dist','6.1#7':'keep','6.2#10':'keep','6.3#9':'keep',
 '6.4#7':'slope','6.5#9':'slope','6.5#10':'keep','6.8#10':'lin','6.9#5':'line','6.9#6':'keep','7.1#3':'line','7.1#4':'keep','7.3#4':'table','8.4#10':'keep',
 '8.7#5':'keep','9.1#3':'cone','9.1#4':'sph','9.1#9':'keep','9.2#3':'sph','9.2#5':'cyl','9.3#1':'sph','9.4#3':'sph','E.5#9':'keep','E.3#10':'sysn',
};
// every flagged problem must have a decision
const flagged = fs.readFileSync('mism.txt', 'utf8').split('\n').filter(l => /^\S+ #\d+ \[/.test(l)).map(l => l.replace(/^(\S+) #(\d+).*/, '$1#$2'));
const missing = flagged.filter(k => !T[k]); if (missing.length) { console.log('NO DECISION:', missing); process.exit(1); }
const newHelp = JSON.parse(JSON.stringify(D)); let changed = 0; const log = [];
for (const k in T) {
  if (T[k] === 'keep') continue;
  const [hw, n] = k.split('#'), o = newHelp[hw][n], tp = T[k], [hint, mist] = HELP[tp];
  const fit = t => { const nt = noteTopic(t); return !nt || nt === tp || (fits(nt, tp) && !['eq', 'ineq', 'line', 'func', 'graph', 'sys', 'scat', 'tri', 'cyl', 'sph', 'cone', 'tl', 'dil', 'sqrt', 'ri'].includes(nt)); };
  log.push(`${k} [${tp}] hint: "${(o.h || '').slice(0, 50)}" → "${hint.slice(0, 50)}"`);
  o.h = hint; o.m = mist; changed++;
  (o.w || []).forEach((t, i) => { if ((o.right || []).includes('ABCDEF'[i])) return; if (t && !fit(t)) { o.w[i] = mist; log.push(`   ${'ABCDEF'[i]}: "${t.slice(0, 50)}" → common mistakes`); } });
}
fs.writeFileSync('hw_help_new.json', JSON.stringify(newHelp, null, 1));
console.log(log.join('\n')); console.log('problems changed:', changed);
