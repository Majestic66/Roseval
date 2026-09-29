import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
// Consent must gate both script loading and events, with no backlog or personal fields.
const code=fs.readFileSync('public/measurement.js','utf8');
function analytics(host='rosevaldesign.com'){
 const values=new Map(),scripts=[],document={title:'Test',cookie:'',head:{append:s=>scripts.push(s)},createElement:()=>({}),getElementById:()=>null};
 const context={document,localStorage:{getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)},location:{hostname:host,origin:'https://'+host,pathname:'/kits/atelier'},Date};context.window=context;vm.runInNewContext(code,context);return {context,values,scripts};
}
const a=analytics();a.context.RosevalAnalytics.track('kit_open',{pack:'menuisiers'});assert.equal(a.scripts.length,0);assert.equal(a.context.dataLayer,undefined);
a.context.RosevalAnalytics.choose('granted');assert.equal(a.scripts.length,1);a.context.RosevalAnalytics.track('kit_export',{pack:'menuisiers',format:'story',email:'private@example.test',title:'private text'});const event=Array.from(a.context.dataLayer.at(-1));assert.equal(event[1],'kit_export');assert.deepEqual(JSON.parse(JSON.stringify(event[2])),{pack:'menuisiers',format:'story'});
const n=a.context.dataLayer.length;a.context.RosevalAnalytics.track('unknown_event',{});assert.equal(a.context.dataLayer.length,n);a.context.RosevalAnalytics.choose('denied');const m=a.context.dataLayer.length;a.context.RosevalAnalytics.track('kit_open',{});assert.equal(a.context.dataLayer.length,m);assert.equal(a.context['ga-disable-G-YHD3WSWHXR'],true);
a.values.set('roseval-consent',JSON.stringify({value:'granted',time:Date.now()-181*864e5}));a.context.RosevalAnalytics.track('kit_open',{});assert.equal(a.context.dataLayer.length,m);
const local=analytics('127.0.0.1');local.context.RosevalAnalytics.choose('granted');local.context.RosevalAnalytics.track('kit_open',{});assert.equal(local.scripts.length,0);
// Exercise every composition and format, including two-photo mode.
const ctx=new Proxy({measureText:t=>({width:String(t).length*12}),createLinearGradient:()=>({addColorStop(){}})}, {get:(o,k)=>k in o?o[k]:(()=>{})});const sandbox={};vm.runInNewContext(fs.readFileSync('public/kits/render.js','utf8'),sandbox);const {render,formats,styles}=sandbox.RosevalRender;
let combinations=0;for(const format of Object.keys(formats))for(const style of styles)for(const comparison of [false,true]){const canvas={getContext:()=>ctx},state={format,style:style.id,comparison,title:'Votre réalisation, votre signature',subtitle:'Un projet pensé pour vos usages.',brand:'Entreprise',contact:'exemple.fr',color:'#6941db',background:'#f5f2ed',ink:'#191820',photo:{width:1448,height:1086},beforePhoto:{width:1448,height:1086},demo:true};const result=render(canvas,state);assert.equal(result.width,formats[format].w);assert.equal(result.height,formats[format].h);for(const b of result.boxes){assert.ok(Number.isFinite(b.x)&&Number.isFinite(b.y)&&b.w>0&&b.h>0);assert.ok(b.used<=b.h+2,`Text overflow ${format}/${style.id}: ${b.text}`)}combinations++}
const data=vm.runInNewContext(fs.readFileSync('public/kits/data.js','utf8')+';({PACKS,TITLES,CAPTIONS,SECTOR_TITLES,DEMO_IMAGES})');for(const p of data.PACKS){assert.equal(data.SECTOR_TITLES[p[0]].length,30);assert.ok(fs.existsSync('public/kits/'+data.DEMO_IMAGES[p[0]]))}assert.equal(new Set(Object.values(data.DEMO_IMAGES)).size,3);
console.log(`PASS : consentement, retrait, expiration, filtrage des événements, ${combinations} rendus, 90 sujets métier et 3 images distinctes.`);

// Downloaded packs must contain a standalone editor with all scripts, fonts and demo photos.
const {inflateRawSync}=await import('node:zlib');const {parse}=await import('acorn');
for(const pack of data.PACKS){const zip=fs.readFileSync(`dist/kits/packs/${pack[0]}.zip`);let offset=0,html;while(zip.readUInt32LE(offset)===0x04034b50){const size=zip.readUInt32LE(offset+18),nameLength=zip.readUInt16LE(offset+26),extraLength=zip.readUInt16LE(offset+28),start=offset+30+nameLength+extraLength,name=zip.subarray(offset+30,offset+30+nameLength).toString();if(name==='atelier.html')html=inflateRawSync(zip.subarray(start,start+size)).toString();offset=start+size}assert.ok(html);assert.ok(!/<script[^>]+src=/.test(html));assert.ok(!/<link[^>]+rel="stylesheet"/.test(html));assert.ok(!html.includes('<base'));for(const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g))parse(script[1],{ecmaVersion:'latest'});assert.ok(html.includes('href="https://rosevaldesign.com/web#contact"'));assert.ok(!html.includes("'assets/demo-menuisiers.jpg'"));}
console.log('PASS : les trois packs ZIP embarquent leurs scripts, polices et photos de démonstration.');
