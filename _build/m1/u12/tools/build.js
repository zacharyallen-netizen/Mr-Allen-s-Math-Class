// build: inline engine css/js into page sources -> math1/
const fs=require('fs'),path=require('path');
const S=path.join(__dirname,'..','src'),OUT='/home/claude/mr-allen-s-math-class/math1';
const css=fs.readFileSync(path.join(S,'engine.css'),'utf8'),js=fs.readFileSync(path.join(S,'engine.js'),'utf8');
const pages=process.argv.slice(2).length?process.argv.slice(2):['unit1-notes','unit1-practice','unit2-notes','unit2-practice'];
for(const p of pages){const f=path.join(S,p+'.html');if(!fs.existsSync(f)){console.log('skip',p);continue;}
  let h=fs.readFileSync(f,'utf8');
  h=h.replace('<!--M1CSS-->','<style>\n'+css+'</style>').replace('<!--M1ENGINE-->','<script>\n'+js+'</script>');
  fs.writeFileSync(path.join(OUT,p+'.html'),h);console.log('built',p,h.length);}
