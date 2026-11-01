const sharp=require('/home/claude/.npm-global/lib/node_modules/sharp');
(async()=>{for(const f of process.argv.slice(2)){const m=await sharp(f).metadata();const H=1000;let k=0;
 for(let y=0;y<m.height;y+=H){const h=Math.min(H,m.height-y);await sharp(f).extract({left:0,top:y,width:m.width,height:h}).toFile(f.replace('.png',`_p${k++}.png`));}
 console.log(f,m.width,m.height,k);}})();
