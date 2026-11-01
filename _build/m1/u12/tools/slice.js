const sharp=require('/home/claude/.npm-global/lib/node_modules/sharp');
(async()=>{const f=process.argv[2],h=+(process.argv[3]||1000);const m=await sharp(f).metadata();let i=0;
for(let y=0;y<m.height;y+=h){const hh=Math.min(h,m.height-y);await sharp(f).extract({left:0,top:y,width:m.width,height:hh}).toFile(f.replace('.png','_'+(i++)+'.png'));}
console.log(i,'slices');})();
