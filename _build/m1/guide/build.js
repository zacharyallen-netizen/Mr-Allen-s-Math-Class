const fs=require('fs');
const t=fs.readFileSync('template.html','utf8');
const css=fs.readFileSync('style.css','utf8');
const js=['lib.js','items1.js','items2.js','app.js'].map(f=>'/* '+f+' */\n'+fs.readFileSync(f,'utf8')).join('\n');
const out=t.replace('{{CSS}}',()=>css).replace('{{JS}}',()=>js.replace(/<\/script/gi,'<\\/script'));
fs.writeFileSync('/home/claude/mr-allen-s-math-class/math1/nc_math1_study_guide.html',out);
console.log('bytes',out.length);
