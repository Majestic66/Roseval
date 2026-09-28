import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {deflateRawSync} from 'node:zlib';
export async function buildKitsPacks(){
 const source=path.resolve('public/kits'),out=path.resolve('dist/kits/packs');await fs.mkdir(out,{recursive:true});
 let html=(await fs.readFile(path.join(source,'atelier.html'),'utf8')).replace('<base href="/kits/">','').replaceAll('href="/"','href="https://rosevaldesign.com/"').replaceAll('href="index.html"','href="#"');
 let css=await fs.readFile(path.join(source,'atelier.css'),'utf8');
 for(const f of await fs.readdir(path.join(source,'assets/fonts')))if(f.endsWith('.woff'))css=css.replace('assets/fonts/'+f,'data:font/woff;base64,'+(await fs.readFile(path.join(source,'assets/fonts',f))).toString('base64'));
 html=html.replace('<link rel="stylesheet" href="atelier.css">','<style>'+css+'</style>');
 for(const f of ['data.js','render.js','atelier.js']){let code=await fs.readFile(path.join(source,f),'utf8');if(f==='atelier.js')code=code.replace("'assets/inspiration.jpg'",JSON.stringify('data:image/jpeg;base64,'+(await fs.readFile(path.join(source,'assets/inspiration.jpg'))).toString('base64')));html=html.replace('<script src="'+f+'"></script>','<script>'+code+'</script>')}
 const {PACKS,TITLES,CAPTIONS}=vm.runInNewContext((await fs.readFile(path.join(source,'data.js'),'utf8'))+';({PACKS,TITLES,CAPTIONS})');
 const guide=await fs.readFile(path.join(source,'guide.txt'));const license=await fs.readFile(path.join(source,'assets/fonts/LICENCE.txt'));
 for(let i=0;i<PACKS.length;i++){const texts=TITLES.map((t,n)=>`${n+1}. ${t}\n${CAPTIONS[n].replaceAll('[métier]',PACKS[i][1].toLowerCase())}`).join('\n\n');const entries=[['atelier.html',html.replace('window.ROSEVAL_PACK=null','window.ROSEVAL_PACK='+i)],['LIRE-MOI.txt',guide],['textes-publications.txt',texts],['LICENCE-POLICES.txt',license]];await fs.writeFile(path.join(out,PACKS[i][0]+'.zip'),zip(entries))}
}
function crc32(buf){let crc=0xffffffff;for(const byte of buf){crc^=byte;for(let k=0;k<8;k++)crc=(crc>>>1)^((crc&1)?0xedb88320:0)}return (crc^0xffffffff)>>>0}
function zip(entries){const local=[],central=[];let offset=0;for(const [name,value]of entries){const file=Buffer.from(name),raw=Buffer.isBuffer(value)?value:Buffer.from(value),data=deflateRawSync(raw),crc=crc32(raw);const header=Buffer.alloc(30);header.writeUInt32LE(0x04034b50);header.writeUInt16LE(20,4);header.writeUInt16LE(0x800,6);header.writeUInt16LE(8,8);header.writeUInt16LE(33,12);header.writeUInt32LE(crc,14);header.writeUInt32LE(data.length,18);header.writeUInt32LE(raw.length,22);header.writeUInt16LE(file.length,26);local.push(header,file,data);const entry=Buffer.alloc(46);entry.writeUInt32LE(0x02014b50);entry.writeUInt16LE(20,4);entry.writeUInt16LE(20,6);entry.writeUInt16LE(0x800,8);entry.writeUInt16LE(8,10);entry.writeUInt16LE(33,14);entry.writeUInt32LE(crc,16);entry.writeUInt32LE(data.length,20);entry.writeUInt32LE(raw.length,24);entry.writeUInt16LE(file.length,28);entry.writeUInt32LE(offset,42);central.push(entry,file);offset+=header.length+file.length+data.length}const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);return Buffer.concat([...local,directory,end])}
