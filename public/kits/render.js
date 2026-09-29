/* Shared renderer: the preview and PNG export use this exact composition. */
(function(root){
'use strict';
const formats={square:{label:'Carré',ratio:'1:1',w:1080,h:1080},portrait:{label:'Portrait',ratio:'4:5',w:1080,h:1350},tall:{label:'Portrait long',ratio:'3:4',w:1080,h:1440},story:{label:'Story',ratio:'9:16',w:1080,h:1920},wide:{label:'Paysage',ratio:'16:9',w:1920,h:1080},social:{label:'Paysage large',ratio:'1,91:1',w:1200,h:628}};
const styles=[{id:'editorial',name:'Éditorial',desc:'Typographie & espaces'},{id:'bold',name:'Impact',desc:'Contraste & caractère'},{id:'cinema',name:'Immersion',desc:'Photo plein cadre'},{id:'collage',name:'Studio collage',desc:'Décalé & spontané'},{id:'gallery',name:'Galerie',desc:'Grille & détails'},{id:'signature',name:'Signature',desc:'Élégance & sérif'},{id:'manifesto',name:'Manifeste',desc:'Affiche typographique'},{id:'magazine',name:'Magazine',desc:'Couverture & grand titre'},{id:'blueprint',name:'Architecture',desc:'Grille & précision'},{id:'spotlight',name:'Focus',desc:'Cadrage circulaire'},{id:'journal',name:'Carnet',desc:'Photo & note superposée'},{id:'ribbon',name:'Contraste',desc:'Bandeau & composition scindée'},{id:'swiss',name:'Swiss',desc:'Grille asymétrique & rigueur'},{id:'arch',name:'Arche',desc:'Courbes & sérif élégant'},{id:'horizon',name:'Horizon',desc:'Panorama & titre sous l’image'},{id:'film',name:'Pellicule',desc:'Cadre cinéma & perforations'},{id:'mosaic',name:'Mosaïque',desc:'Blocs modulaires & détails'},{id:'atelier',name:'Atelier',desc:'Papier ligné & photo épinglée'},{id:'chroma',name:'Chromatique',desc:'Halo coloré & panneau sombre'},{id:'cartouche',name:'Cartouche',desc:'Photo & encadré éditorial'},{id:'duplex',name:'Duplex',desc:'Deux colonnes & contraste'},{id:'passepartout',name:'Passe-partout',desc:'Cadre galerie & légende'},{id:'orbit',name:'Orbite',desc:'Cercles & photo satellite'},{id:'ticket',name:'Ticket',desc:'Découpe & pointillés'},{id:'index',name:'Index',desc:'Repères & bande latérale'},{id:'fold',name:'Pliage',desc:'Papier plié & aplats'},{id:'wave',name:'Vague',desc:'Courbes & mouvement'},{id:'stamp',name:'Estampe',desc:'Cadre dentelé & sérif'},{id:'capsule',name:'Capsule',desc:'Photo arrondie & titre compact'},{id:'diagonal',name:'Diagonale',desc:'Angles francs & énergie'}];
const palettes=[
{id:'violet',name:'Violet studio',accent:'#6941db',background:'#f5f2ed',ink:'#191820'},
{id:'cobalt',name:'Cobalt électrique',accent:'#244bff',background:'#eef1ff',ink:'#131b39'},
{id:'citrus',name:'Citron graphique',accent:'#d8f548',background:'#f2f4ea',ink:'#20251b'},
{id:'terracotta',name:'Terre cuite',accent:'#b8492e',background:'#faf0e6',ink:'#36251f'},
{id:'ocean',name:'Bleu lagon',accent:'#077e87',background:'#eaf5f4',ink:'#122e36'},
{id:'pink',name:'Rose pop',accent:'#c62973',background:'#ffedf4',ink:'#362037'},
{id:'forest',name:'Forêt profonde',accent:'#236747',background:'#edf2e9',ink:'#16291e'},
{id:'mono',name:'Noir & blanc',accent:'#242424',background:'#f5f5f3',ink:'#181818'}];
function render(canvas,state,previewWidth){
const fmt=formats[state.format]||formats.portrait;canvas.width=previewWidth||fmt.w;canvas.height=Math.round(fmt.h*canvas.width/fmt.w);const c=canvas.getContext('2d');let W=1080,H=fmt.h/fmt.w*1080,land=H<800,story=state.format==='story',M=60,top=story?190:55,bottom=H-(story?235:52),ink=/^#[0-9a-f]{6}$/i.test(state.ink)?state.ink:'#191820',paper=/^#[0-9a-f]{6}$/i.test(state.background)?state.background:'#f5f2ed',accent=/^#[0-9a-f]{6}$/i.test(state.color)?state.color:'#6941db',boxes=[];
c.scale(canvas.width/1080,canvas.width/1080);c.textBaseline='top';
const rgb=[1,3,5].map(i=>parseInt(accent.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4),onAccent=rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722>.179?ink:'#ffffff';
function rect(x,y,w,h,fill,r=0){c.fillStyle=fill;c.beginPath();if(r)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h);c.fill()}
function line(x,y,x2,y2,color){c.strokeStyle=color;c.lineWidth=1;c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.stroke()}
function split(t,width){let out=[],v='';for(const word of String(t).split(/\s+/)){if(!word)continue;if(c.measureText(word).width>width){if(v){out.push(v);v=''}let part='';for(const char of word){if(c.measureText(part+char).width>width&&part){out.push(part);part=''}part+=char}v=part}else if(c.measureText(v?(v+' '+word):word).width>width){out.push(v);v=word}else v=v?v+' '+word:word}if(v)out.push(v);return out}
function type(t,x,y,w,h,size,fill,opts={}){const family=opts.serif?'SocialSerif, Georgia, serif':'SocialSans, Arial, sans-serif',weight=opts.weight||'700',leading=opts.leading||1.02;let font=size,rows=[];do{c.font=`${opts.italic?'italic ':''}${weight} ${font}px ${family}`;rows=split(t,w);if(rows.length*font*leading<=h&&(!String(t).split(/\s+/).some(word=>c.measureText(word).width>w)||font<=12))break;font-=1}while(font>10);c.fillStyle=fill;c.textAlign=opts.align||'left';rows.forEach((s,i)=>c.fillText(s,opts.align==='center'?x+w/2:x,y+i*font*leading));c.textAlign='left';boxes.push({text:t,x,y,w,h,used:rows.length*font*leading,size:font});return rows.length*font*leading}
function label(t,x,y,w=680,color=ink,size=21){type(t,x,y,w,32,size,color,{weight:'500',leading:1.05})}
function tag(t,x,y,bg=accent,fg=onAccent){c.font='700 19px SocialSans';const w=Math.min(420,c.measureText(t).width+36);rect(x,y,w,43,bg,22);type(t,x+18,y+12,w-36,23,19,fg);return w}
function image(x,y,w,h,r=0,photo=state.photo){c.save();c.beginPath();if(r)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h);c.clip();if(photo){let im=photo,iw=im.naturalWidth||im.width,ih=im.naturalHeight||im.height,s=Math.max(w/iw,h/ih),dw=iw*s,dh=ih*s;c.drawImage(im,x-(dw-w)*(state.focusX??50)/100,y-(dh-h)*(state.focusY??50)/100,dw,dh)}else{rect(x,y,w,h,accent);c.globalAlpha=.12;for(let i=0;i<9;i++)rect(x+i*w/8,y,1,h,onAccent);c.globalAlpha=1;type('Votre\nsignature.',x+32,y+h*.25,w-64,h*.6,Math.min(w*.18,110),onAccent,{serif:true,italic:true,weight:'400'})}c.restore()}
function footer(color=ink,x=M,w=960,y=bottom-54){line(x,y-18,x+w,y-18,(color.length===4?'#'+[...color.slice(1)].map(v=>v+v).join(''):color)+'44');let brandW=state.logo?w-175:w;label(state.brand,x,y,brandW,color,22);label(state.contact,x,y+34,brandW,color,18);if(state.logo){let im=state.logo,iw=im.naturalWidth||im.width,ih=im.naturalHeight||im.height,s=Math.min(130/iw,52/ih);rect(x+w-147,y-2,147,62,'#ffffff',9);c.drawImage(im,x+w-138+(130-iw*s)/2,y+3+(52-ih*s)/2,iw*s,ih*s)}}
const T=state.title||'',S=state.subtitle||'',num=String((state.template||0)+1).padStart(2,'0'),topic=state.kicker||'SAVOIR-FAIRE / INSPIRATION',style=state.style||'editorial';rect(0,0,W,H,paper);
if(state.comparison){
 label(topic,M,top,900,ink,20);const th=land?100:160;type(T,M,top+55,960,th,land?62:90,ink);const py=top+th+80,ph=Math.max(80,bottom-py-170);image(M,py,465,ph,8,state.beforePhoto);image(555,py,465,ph,8,state.photo);tag('AVANT',M+15,py+15);tag('APRÈS',570,py+15);type(S,M,bottom-132,940,55,25,ink,{weight:'400'});footer();
}else if(style==='editorial'){
 label(topic,M,top,820,ink,20);label(num,960,top,60,accent);line(M,top+44,1020,top+44,ink+'44');
 if(land){type(T,M,top+80,455,bottom-top-230,74,ink);type(S,M,bottom-105,450,45,22,ink,{weight:'400'});image(565,top+74,455,bottom-top-153,10)}else{let th=Math.min(320,H*.24);type(T,M,top+82,960,th,104,ink,{leading:.98});let py=top+82+th+30,ph=bottom-160-py;image(M,py,960,ph,8);type(S,M,bottom-137,910,55,27,ink,{weight:'400'})}footer();
}else if(style==='bold'){
 rect(0,0,W,H,ink);tag(topic,M,top,accent,onAccent);
 if(land){image(675,top+67,345,bottom-top-169,18);type(T.toUpperCase(),M,top+80,565,bottom-top-220,82,'#fff',{leading:.94});type(S,M,bottom-134,940,47,23,'#d5d0e0',{weight:'400'});footer('#fff')}else{let th=Math.min(390,H*.31);type(T.toUpperCase(),M,top+87,960,th,122,'#fff',{leading:.91});let py=top+87+th+30;image(M,py,960,bottom-py-190,24);rect(770,py-28,220,56,accent,28);label('SUR MESURE',797,py-10,165,onAccent,18);type(S,M,bottom-146,940,57,28,'#ddd6ec',{weight:'400'});footer('#fff')}
}else if(style==='cinema'){
 image(0,0,W,H);let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0c1011aa');g.addColorStop(.3,'#0c101111');g.addColorStop(.58,'#0c101188');g.addColorStop(1,'#0c1011ee');rect(0,0,W,H,g);tag(topic,M,top,'#ffffff','#171820');let th=land?200:Math.min(400,H*.29),ty=bottom-th-180;rect(M,ty-30,60,5,accent);type(T,M,ty,940,th,land?90:116,'#fff',{serif:true,weight:'400',leading:1.02});type(S,M,bottom-151,920,61,28,'#f0ebee',{weight:'400'});footer('#fff');
}else if(style==='collage'){
 rect(0,0,W,H,state.background||'#e7e3f2');label(topic,M,top,860,ink,20);label(num,960,top,60,ink);
 if(land){type(T,M,top+86,490,bottom-top-200,77,ink,{leading:.97});type(S,M,bottom-101,470,57,22,ink,{weight:'400'});c.save();c.translate(796,H*.47);c.rotate(.045);rect(-218,-H*.28,436,H*.57,'#fff');image(-201,-H*.28+17,402,H*.57-60);label('LE SENS DU DÉTAIL',-195,H*.29-32,385,ink,16);c.restore()}else{let th=Math.min(300,H*.235);type(T,M,top+78,940,th,103,ink,{leading:.97});let py=top+78+th+42,ph=bottom-py-185;c.save();c.translate(W/2,py+ph/2);c.rotate(-.035);rect(-450,-ph/2,900,ph,'#fff');image(-431,-ph/2+19,862,ph-72);label('PROJET / '+num,-425,ph/2-36,820,ink,18);c.restore();c.save();c.translate(810,py+30);c.rotate(.075);rect(-135,-24,270,52,accent);label('À VOTRE IMAGE',-116,-10,235,onAccent,19);c.restore();type(S,M,bottom-136,940,50,27,ink,{weight:'400'})}footer();
}else if(style==='gallery'){
 label(topic,M,top,800,ink,20);label(num,960,top,60,accent);
 if(land){type(T,M,top+70,455,bottom-top-225,76,ink,{leading:.97});image(565,top+67,295,bottom-top-180,18);rect(877,top+67,143,bottom-top-180,accent,18);type(num,900,top+90,95,100,68,onAccent);type(S,M,bottom-132,950,49,23,ink,{weight:'400'});footer()}else{let th=Math.min(260,H*.22);type(T,M,top+62,960,th,land?77:100,ink,{leading:.97});let py=top+62+th+25,ph=bottom-py-155;image(M,py,610,ph,24);rect(690,py,330,ph,accent,24);type('Le sens\ndu détail.',720,py+30,270,ph*.55,Math.min(55,ph*.2),onAccent,{serif:true,italic:true,weight:'400'});label(num,724,py+ph-50,210,onAccent,28);type(S,M,bottom-128,920,47,25,ink,{weight:'400'});footer();}

}else if(style==='manifesto'){
 rect(0,0,W,H,accent);tag(topic,M,top,ink,'#fff');
 let th=land?bottom-top-240:Math.min(490,H*.37);
 type(T.toUpperCase(),M,top+88,land?670:960,th,land?98:148,onAccent,{leading:.93});
 if(land){image(795,top+75,225,bottom-top-225,12);type(S,M,bottom-131,940,48,24,onAccent,{weight:'400'})}
 else{let py=top+88+th+32,ph=bottom-py-185;image(M,py,360,ph,12);type(num,465,py,555,ph,Math.min(ph*.8,300),onAccent,{weight:'400'});type(S,M,bottom-140,940,54,29,onAccent,{weight:'400'})}footer(onAccent);
}else if(style==='magazine'){
 if(land){rect(0,0,W,H,paper);label(topic,M,top,820,ink,20);label(num,960,top,60,accent);image(590,top+65,430,bottom-top-223);type(T,M,top+78,485,bottom-top-231,88,ink,{serif:true,weight:'400',leading:.99});rect(0,bottom-151,W,H-(bottom-151),ink);type(S,M,bottom-133,940,46,24,'#fff',{weight:'400'});footer('#fff')}
 else{image(0,0,W,H);rect(0,0,W,H*.43,paper);label(topic,M,top,820,ink,20);label(num,960,top,60,accent);let th=Math.min(320,H*.25);type(T,M,top+66,960,th,120,ink,{serif:true,weight:'400',leading:.97});rect(0,bottom-160,W,H-(bottom-160),ink);type(S,M,bottom-139,940,53,27,'#fff',{weight:'400'});footer('#fff');}
}else if(style==='blueprint'){
 rect(0,0,W,H,ink);c.save();c.globalAlpha=.13;for(let x=0;x<W;x+=60)line(x,0,x,H,'#fff');for(let y=0;y<H;y+=60)line(0,y,W,y,'#fff');c.restore();label(topic,M,top,830,'#fff',19);label(num,960,top,60,'#fff');
 if(land){type(T,M,top+83,460,bottom-top-242,80,'#fff',{leading:1});image(570,top+76,435,bottom-top-245);line(555,top+61,1020,top+61,'#fff');line(555,top+61,555,bottom-166,'#fff')}
 else{let th=Math.min(310,H*.245);type(T,M,top+77,960,th,104,'#fff',{leading:1});let py=top+77+th+38,ph=bottom-py-186;image(90,py,900,ph);line(75,py-15,1005,py-15,'#fff');line(75,py-15,75,py+ph+15,'#fff');line(75,py+ph+15,1005,py+ph+15,'#fff')}
 type(S,M,bottom-137,940,54,27,'#e8e8ee',{weight:'400'});footer('#fff');
}else if(style==='spotlight'){
 rect(0,0,W,H,accent);label(topic,M,top,820,onAccent,19);label(num,960,top,60,onAccent);
 if(land){const sz=Math.min(280,bottom-top-170);image(715,top+64,sz,sz,sz/2);type(T,M,top+78,600,bottom-top-232,87,onAccent,{leading:.98});type(S,M,bottom-135,940,48,24,onAccent,{weight:'400'})}
 else{let th=Math.min(300,H*.24);type(T,M,top+68,960,th,108,onAccent,{leading:.98,align:'center'});let py=top+68+th+25,sz=Math.min(700,bottom-py-183);image((W-sz)/2,py,sz,sz,sz/2);type(S,M,bottom-141,960,57,28,onAccent,{weight:'400',align:'center'})}footer(onAccent);
}else if(style==='journal'){
 rect(0,0,W,H,paper);label(topic,M,top,830,ink,20);label(num,960,top,60,accent);
 if(land){image(615,top+65,405,bottom-top-181,6);rect(M,top+66,605,bottom-top-180,'#fff',4);rect(M,top+66,6,bottom-top-180,accent);type(T,M+26,top+89,538,bottom-top-229,80,ink,{serif:true,weight:'400',leading:1});type(S,M,bottom-132,940,49,24,ink,{weight:'400'})}
 else{let py=top+60,ph=(bottom-top-250)*.57;image(M,py,960,ph,8);let ny=py+ph-65,nh=bottom-178-ny;rect(110,ny,860,nh,'#fff',8);rect(140,ny+23,70,5,accent);type(T,145,ny+52,790,nh-76,97,ink,{serif:true,weight:'400',leading:1});type(S,M,bottom-139,940,52,27,ink,{weight:'400'})}footer();
}else if(style==='ribbon'){
 rect(0,0,W,H,paper);rect(0,0,22,H,accent);label(topic,M,top,830,ink,19);label(num,960,top,60,accent);
 let py=top+65,ph=bottom-py-171;image(580,py,440,ph);rect(M,py,493,ph,ink);type(T,M+30,py+28,433,ph-55,land?70:100,'#fff',{leading:.98});type(S,M,bottom-136,940,50,26,ink,{weight:'400'});footer();
}else if(style==='swiss'){
 rect(0,0,W,H,paper);label(topic,M,top,820,ink,19);label(num,960,top,60,accent);
 const py=top+65,ph=bottom-py-175;rect(M,py,12,ph,accent);type(T,M+35,py+10,land?450:520,ph-20,land?76:112,ink,{leading:.95});image(land?600:660,py,land?420:360,ph);type(S,M,bottom-135,940,50,26,ink,{weight:'400'});footer();
}else if(style==='arch'){
 label(topic,M,top,820,ink,19);label(num,960,top,60,accent);
 if(land){const py=top+65,ph=bottom-py-174;type(T,M,py+8,530,ph-10,82,ink,{serif:true,weight:'400'});c.save();c.beginPath();c.roundRect(655,py,365,ph,[Math.min(182,ph/2),Math.min(182,ph/2),0,0]);c.clip();image(655,py,365,ph);c.restore()}
 else{const th=Math.min(250,H*.2);type(T,M,top+65,960,th,103,ink,{serif:true,weight:'400',align:'center'});const py=top+th+90,ph=bottom-py-177;c.save();c.beginPath();c.roundRect(170,py,740,ph,[Math.min(370,ph/2),Math.min(370,ph/2),0,0]);c.clip();image(170,py,740,ph);c.restore();line(135,py,135,py+ph,accent);line(945,py,945,py+ph,accent)}
 type(S,M,bottom-136,940,51,26,ink,{weight:'400',align:'center'});footer();
}else if(style==='horizon'){
 rect(0,0,W,H,ink);const py=top+60,ph=(bottom-top-210)*(land?.43:.5);image(0,py,W,ph);rect(M,py+ph-4,200,8,accent);label(topic,M,top,850,'#fff',19);const ty=py+ph+28;type(T,M,ty,960,bottom-165-ty,land?72:106,'#fff',{leading:.98});type(S,M,bottom-135,940,50,26,'#e8e4ed',{weight:'400'});footer('#fff');
}else if(style==='film'){
 rect(0,0,W,H,ink);label(topic,M,top,830,'#fff',19);label(num,960,top,60,accent);
 const py=top+63,ph=bottom-py-175;
 if(land){type(T,M,py+12,450,ph-25,76,'#fff',{leading:1});rect(555,py,465,ph,'#08080b');image(590,py+16,395,ph-32);for(let y=py+10;y<py+ph-12;y+=34){rect(565,y,13,18,paper,2);rect(997,y,13,18,paper,2)}}
 else{const th=Math.min(280,H*.22);type(T,M,py,960,th,106,'#fff',{leading:.95});const iy=py+th+25,ih=ph-th-25;rect(M,iy,960,ih,'#08080b');image(M+45,iy+18,870,ih-36);for(let y=iy+10;y<iy+ih-12;y+=40){rect(M+12,y,18,23,paper,3);rect(990,y,18,23,paper,3)}}
 type(S,M,bottom-136,940,51,26,'#e8e4ed',{weight:'400'});footer('#fff');
}else if(style==='mosaic'){
 label(topic,M,top,830,ink,19);label(num,960,top,60,accent);const py=top+65,ph=bottom-py-175;
 const splitX=land?545:570;rect(M,py,splitX-M-20,ph,accent,20);type(T,M+25,py+25,splitX-M-70,ph-50,land?72:96,onAccent,{leading:.97});const iw=1020-splitX,gap=18;image(splitX,py,iw,ph*.58-gap/2,15);image(splitX,py+ph*.58+gap/2,iw*.5-gap/2,ph*.42-gap/2,15);rect(splitX+iw*.5+gap/2,py+ph*.58+gap/2,iw*.5-gap/2,ph*.42-gap/2,ink,15);type(num,splitX+iw*.5+gap/2+18,py+ph*.58+gap/2+12,iw*.5-gap/2-36,ph*.42-gap/2-24,60,paper,{weight:'400'});type(S,M,bottom-136,940,51,26,ink,{weight:'400'});footer();
}else if(style==='atelier'){
 rect(0,0,W,H,paper);c.save();c.globalAlpha=.13;for(let y=top+38;y<bottom-90;y+=36)line(M,y,1020,y,ink);c.restore();label(topic,M,top,820,ink,19);const py=top+68,ph=bottom-py-175;
 if(land){image(610,py,410,ph,4);rect(M,py,515,ph,paper);type(T,M+10,py+10,490,ph-20,81,ink,{serif:true,italic:true,weight:'400'});rect(730,py-10,160,26,accent)}
 else{const ih=ph*.53;image(105,py,870,ih,4);rect(440,py-12,200,28,accent);const ty=py+ih+25;type(T,M+10,ty,940,ph-ih-28,102,ink,{serif:true,italic:true,weight:'400',align:'center'})}
 type(S,M,bottom-136,940,51,26,ink,{weight:'400'});footer();
}else if(style==='chroma'){
 rect(0,0,W,H,ink);c.save();const glow=c.createLinearGradient(0,0,W,H);glow.addColorStop(0,accent);glow.addColorStop(.6,ink);glow.addColorStop(1,accent);rect(0,0,W,H,glow);c.restore();label(topic,M,top,840,'#fff',19);label(num,960,top,60,'#fff');const py=top+65,ph=bottom-py-175;rect(M,py,960,ph,'#111017cc',30);
 if(land){type(T,M+30,py+24,495,ph-48,76,'#fff');image(620,py+20,375,ph-40,20)}else{let th=Math.min(290,ph*.43);type(T,M+35,py+30,890,th,110,'#fff',{leading:.97});image(M+25,py+th+55,910,ph-th-80,20)}
 type(S,M,bottom-136,940,51,26,'#fff',{weight:'400'});footer('#fff');
}else if(style==='cartouche'){
 image(0,0,W,H);rect(0,0,W,H,'#11101733');const py=top+60,ph=bottom-py-170;
 rect(M,top,land?560:960,38,paper,4);label(topic,M+15,top+9,land?525:925,ink,17);
 const boxW=land?570:840,bx=land?M:120;rect(bx,py,boxW,ph,paper,8);rect(bx,py,boxW,8,accent);type(T,bx+30,py+30,boxW-60,ph-60,land?76:112,ink,{serif:true,weight:'400',leading:1});
 rect(0,bottom-160,W,H-bottom+160,ink);type(S,M,bottom-135,940,50,26,'#fff',{weight:'400'});footer('#fff');
}else if(['duplex','passepartout','orbit','ticket','index','fold','wave','stamp','capsule','diagonal'].includes(style)){
 const py=top+65,ph=bottom-py-175;
 let tx=M,ty=py+18,tw=465,th=ph-36,ix=565,iy=py,iw=455,ih=ph,r=0,fg=ink,foot=ink;
 if(style==='duplex'){
  rect(0,0,W,H,ink);rect(540,0,540,H,paper);rect(M,py,455,ph,accent);tx=M+25;tw=405;fg=onAccent;foot='#fff';image(ix,iy,iw,ih);rect(540,bottom-160,540,H-bottom+160,ink);
 }else if(style==='passepartout'){
  const frame=land?470:480;rect(M,py,frame,ph,ink);image(M+18,py+18,frame-36,ph-36);tx=M+frame+35;tw=1020-tx;fg=ink;line(tx,py,1020,py,accent);ty=py+25;th=ph-50;
 }else if(style==='orbit'){
  rect(0,0,W,H,ink);fg=foot='#fff';c.save();c.strokeStyle=accent;c.lineWidth=3;for(let z=0;z<3;z++){c.beginPath();c.ellipse(810,py+ph/2,190+z*33,Math.max(70,ph*.42)+z*18,0,0,Math.PI*2);c.stroke()}c.restore();const sz=Math.min(350,ph-28);image(810-sz/2,py+(ph-sz)/2,sz,sz,sz/2);tw=505;
 }else if(style==='ticket'){
  rect(M,py,960,ph,accent,18);tx=M+28;tw=450;fg=onAccent;image(590,py+20,410,ph-40,8);c.save();c.setLineDash([8,10]);line(560,py+15,560,py+ph-15,onAccent);c.restore();for(const y of [py,py+ph]){c.beginPath();c.arc(560,y,18,0,Math.PI*2);c.fillStyle=paper;c.fill()}
 }else if(style==='index'){
  rect(M,py,105,ph,accent);type(num,M+15,py+15,75,70,53,onAccent);tx=195;tw=land?395:405;image(635,py,385,ph);line(tx,py+ph-6,600,py+ph-6,accent);
 }else if(style==='fold'){
  rect(M,py,960,ph,accent);rect(M,py,500,ph,paper);image(585,py+20,415,ph-40);c.beginPath();c.moveTo(500,py);c.lineTo(560,py+60);c.lineTo(500,py+60);c.closePath();c.fillStyle=ink;c.fill();tx=M+20;tw=400;ty=py+25;th=ph-50;
 }else if(style==='wave'){
  rect(0,0,W,H,ink);fg=foot='#fff';c.beginPath();c.moveTo(530,0);c.bezierCurveTo(850,H*.3,340,H*.7,650,H);c.lineTo(W,H);c.lineTo(W,0);c.closePath();c.fillStyle=accent;c.fill();image(640,py+10,360,ph-20,Math.min(180,(ph-20)/2));tw=510;
 }else if(style==='stamp'){
  rect(555,py,465,ph,accent);for(let xx=568;xx<1010;xx+=28){for(const yy of [py,py+ph]){c.beginPath();c.arc(xx,yy,7,0,Math.PI*2);c.fillStyle=paper;c.fill()}}for(let yy=py+15;yy<py+ph;yy+=28){for(const xx of [555,1020]){c.beginPath();c.arc(xx,yy,7,0,Math.PI*2);c.fillStyle=paper;c.fill()}}image(576,py+21,423,ph-42);line(M,py+ph-5,505,py+ph-5,accent);tw=450;
 }else if(style==='capsule'){
  rect(M,py,960,ph,ink,Math.min(65,ph/4));fg='#fff';tx=M+35;tw=445;ty=py+30;th=ph-60;image(590,py+20,410,ph-40,Math.min(205,(ph-40)/2));
 }else if(style==='diagonal'){
  rect(0,0,W,H,ink);fg=foot='#fff';c.beginPath();c.moveTo(650,0);c.lineTo(W,0);c.lineTo(W,H);c.lineTo(470,H);c.closePath();c.fillStyle=accent;c.fill();image(610,py,410,ph);rect(M,py,490,ph,ink);tw=460;
 }
 label(topic,M,top,830,foot,19);label(num,960,top,60,style==='duplex'?ink:foot);
 type(T,tx,ty,tw,th,land?76:104,fg,{serif:['passepartout','stamp','fold'].includes(style),weight:['passepartout','stamp'].includes(style)?'400':'700',leading:1});
 type(S,M,bottom-136,940,51,26,foot,{weight:'400'});footer(foot);
}else{
 rect(0,0,W,H,state.background||'#eeeae3');label(topic,M,top,850,ink,19);
 if(land){image(625,top+57,395,bottom-top-169,125);type(T,M,top+80,505,bottom-top-230,78,ink,{serif:true,italic:true,weight:'400'});type(S,M,bottom-132,940,47,23,ink,{weight:'400'});footer()}else{let th=Math.min(300,H*.25);type(T,M,top+67,960,th,112,ink,{serif:true,italic:true,weight:'400',leading:.99,align:'center'});let py=top+67+th+30,ph=bottom-py-180;image(150,py,780,ph,Math.min(390,ph/2));type(S,130,bottom-139,820,58,27,ink,{weight:'400',align:'center'});footer()}
}
if(state.demo&&state.photo){c.save();c.fillStyle='#0009';c.fillRect(W-331,H-27,331,27);c.fillStyle='#fff';c.font='13px SocialSans';c.fillText('IMAGE D’INSPIRATION GÉNÉRÉE PAR IA',W-321,H-20);c.restore()}
return {width:canvas.width,height:canvas.height,boxes};
}
root.RosevalRender={render,formats,styles,palettes};
})(typeof globalThis!=='undefined'?globalThis:window);
