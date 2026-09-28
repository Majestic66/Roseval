const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let active=false;
async function openIntro(manual=false){
  if(active||reduced.matches)return;
  if(!manual){try{if(sessionStorage.getItem('roseval-plus-intro-seen')==='1')return}catch{}}
  const dialog=document.createElement('dialog');
  if(typeof dialog.showModal!=='function')return;
  active=true;const previous=document.activeElement;let cleanup=()=>{},closed=false;
  dialog.className='plus-intro';dialog.setAttribute('aria-label','Bienvenue dans Roseval +');
  dialog.innerHTML='<div class="intro-fallback"><h2>roseval <span>+</span></h2></div><div class="intro-top"><span>ROSEVAL DESIGN / LE STUDIO CRÉATIF</span><button class="intro-skip">Passer l’intro ↗</button></div><div class="intro-caption"><p>VOTRE PROCHAINE DIMENSION CRÉATIVE.</p><div class="intro-track"><i></i></div><small>Identité · Contenus · Lancement</small></div>';
  document.body.append(dialog);const overflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();
  const finish=()=>{if(closed)return;closed=true;clearTimeout(timer);cleanup();dialog.classList.add('leaving');setTimeout(()=>{dialog.close();dialog.remove();document.body.style.overflow=overflow;active=false;if(previous?.isConnected)previous.focus({preventScroll:true})},reduced.matches?0:550)};
  const timer=setTimeout(finish,5200);dialog.querySelector('button').onclick=finish;dialog.addEventListener('cancel',e=>{e.preventDefault();finish()});
  try{sessionStorage.setItem('roseval-plus-intro-seen','1')}catch{}
  try{const {createScene}=await import('./plus-scene.js');if(!closed)cleanup=createScene(dialog,finish)}catch{/* The CSS 3D wordmark remains visible when WebGL is unavailable. */}
}
document.querySelector('#replay-intro')?.addEventListener('click',()=>{if(reduced.matches){document.querySelector('#toast').textContent='Les animations sont désactivées dans les préférences de votre appareil.';document.querySelector('#toast').classList.add('show');setTimeout(()=>document.querySelector('#toast').classList.remove('show'),3500)}else openIntro(true)});
openIntro();
