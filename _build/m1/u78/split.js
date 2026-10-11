const sharp=require('/home/claude/.npm-global/lib/node_modules/sharp');
(async()=>{const [f,h]= [process.argv[2], +(process.argv[3]||1100)];
const m=await sharp(f).metadata(); let i=0;
for(let y=0;y<m.height;y+=h){await sharp(f).extract({left:0,top:y,width:m.width,height:Math.min(h,m.height-y)}).toFile(f.replace('shots/','parts/').replace('.png',`_${i++}.png`));}
console.log(i);})();
