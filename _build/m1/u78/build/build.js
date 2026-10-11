const fs = require('fs');
const OUT = '/home/claude/mr-allen-s-math-class/math1/';
const which = process.argv.slice(2);
const pages = { 'unit7-notes': './u7n.js', 'unit7-practice': './u7p.js', 'unit8-notes': './u8n.js', 'unit8-practice': './u8p.js' };
for (const [name, mod] of Object.entries(pages)) {
  if (which.length && !which.includes(name)) continue;
  const html = require(mod);
  fs.writeFileSync(OUT + name + '.html', html);
  console.log(name, html.length);
}
