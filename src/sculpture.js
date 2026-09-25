import * as THREE from 'three';
import {wordmark} from './wordmark.js';

export function init(){
const host=document.querySelector('#sculpture'),canvas=document.querySelector('#art-canvas'),toggle=document.querySelector('#motion-toggle');
let renderer;try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'})}catch{toggle.hidden=true;return}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(0,0,8.5);
scene.add(new THREE.HemisphereLight(0xe7ddff,0x302039,2.6));
for(const [color,intensity,pos] of [[0xe2d7ff,85,[-3,4,5]],[0x9e78ff,45,[4,-1,3]],[0xffffff,100,[1,3,-3]]]){const light=new THREE.PointLight(color,intensity);light.position.set(...pos);scene.add(light)}

// Use the actual brand-font outline for the full "roseval." wordmark, not just a substitute letter.
const outline=new THREE.ShapePath();
for(const c of wordmark){switch(c.type){case 'M':outline.moveTo(c.x,-c.y);break;case 'L':outline.lineTo(c.x,-c.y);break;case 'Q':outline.quadraticCurveTo(c.x1,-c.y1,c.x,-c.y);break;case 'C':outline.bezierCurveTo(c.x1,-c.y1,c.x2,-c.y2,c.x,-c.y);break;case 'Z':outline.currentPath.closePath();break}}
const geometry=new THREE.ExtrudeGeometry(outline.toShapes(),{depth:.42,bevelEnabled:true,bevelThickness:.055,bevelSize:.045,bevelSegments:5,curveSegments:24,steps:1});
geometry.center();geometry.computeVertexNormals();
geometry.computeBoundingBox();
const bbox=geometry.boundingBox,bw=bbox.max.x-bbox.min.x,bh=bbox.max.y-bbox.min.y;
const face=new THREE.MeshPhysicalMaterial({color:0xb6a0f3,metalness:.4,roughness:.26,clearcoat:1,clearcoatRoughness:.15});
const edge=new THREE.MeshPhysicalMaterial({color:0x7651c3,metalness:.64,roughness:.23,clearcoat:1});
const group=new THREE.Group(),mesh=new THREE.Mesh(geometry,[face,edge]);scene.add(group);group.add(mesh);mesh.rotation.set(.06,-.32,-.025);
const reduce=matchMedia('(prefers-reduced-motion: reduce)');let paused=reduce.matches,visible=true,raf=0,t=0,last=0,mx=0,my=0;
// Fit the wordmark to the visible frustum at the mesh's distance from the camera, whatever its aspect ratio.
function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();const vFov=camera.fov*Math.PI/180,visibleH=2*Math.tan(vFov/2)*camera.position.z,visibleW=visibleH*camera.aspect;const fit=Math.min(visibleW*.88/bw,visibleH*.88/bh);group.scale.setScalar(fit);renderer.render(scene,camera)}new ResizeObserver(resize).observe(host);resize();host.classList.add('ready');
function draw(now){raf=0;if(!visible||document.hidden)return;const delta=Math.min((now-last)/1000,.04);last=now;if(!paused){t+=delta;mesh.rotation.y=-.25+Math.sin(t*.52)*.23;mesh.rotation.x=.06+Math.sin(t*.38)*.055;mesh.rotation.z=-.025+Math.sin(t*.42)*.025;const bob=Math.sin(t*.8)*.075;group.position.x+=(mx*1.1-group.position.x)*.045;group.position.y+=(bob-my*.85-group.position.y)*.045;group.rotation.y+=(mx*.28-group.rotation.y)*.045;group.rotation.x+=(my*.18-group.rotation.x)*.045}renderer.render(scene,camera);if(!paused)raf=requestAnimationFrame(draw)}
function schedule(){if(!raf&&visible&&!document.hidden){last=performance.now();raf=requestAnimationFrame(draw)}}
function sync(){toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'Activer l’animation':'Mettre l’animation en pause');toggle.textContent=paused?'▷':'Ⅱ';schedule()}
toggle.addEventListener('click',()=>{paused=!paused;sync()});reduce.addEventListener('change',e=>{paused=e.matches;sync()});host.addEventListener('pointermove',e=>{const b=host.getBoundingClientRect();mx=(e.clientX-b.left)/b.width-.5;my=(e.clientY-b.top)/b.height-.5});host.addEventListener('pointerleave',()=>{mx=my=0});new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule()}).observe(host);document.addEventListener('visibilitychange',schedule);canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);host.classList.remove('ready');toggle.hidden=true});sync();
}
