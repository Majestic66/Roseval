(()=>{
  const key='roseval-kits-intro-seen';
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||location.hash)return;
  try{if(sessionStorage.getItem(key)==='1')return}catch{}
  const dialog=document.createElement('dialog');
  if(typeof dialog.showModal!=='function')return;
  dialog.setAttribute('aria-label','Introduction Roseval Kits');
  dialog.id='kits-intro';
  dialog.style.cssText='position:fixed;inset:0;width:100%;height:100%;max-width:none;max-height:none;margin:0;padding:0;border:0;border-radius:0;background:#0b0a10;overflow:hidden';
  const frame=document.createElement('iframe');
  frame.title='Roseval Kits — Signature en mouvement';
  frame.style.cssText='display:block;width:100%;height:100%;border:0';
  const skip=document.createElement('button');
  skip.textContent='Passer ↗';
  skip.style.cssText='position:absolute;right:24px;bottom:24px;background:#171021;color:white;border:1px solid #ffffff40;border-radius:30px;padding:12px 20px';
  dialog.append(frame,skip);document.body.append(dialog);
  const overflow=document.documentElement.style.overflow;
  const previous=document.activeElement;
  let timeout,closed=false;
  function close(){
    if(closed)return;closed=true;clearTimeout(timeout);
    window.removeEventListener('message',receive);
    document.documentElement.style.overflow=overflow;
    dialog.close();dialog.remove();
    if(previous instanceof HTMLElement)previous.focus({preventScroll:true});
  }
  function receive(event){if(event.origin===location.origin&&event.source===frame.contentWindow&&event.data?.type==='roseval-kits-intro-complete')close()}
  window.addEventListener('message',receive);
  dialog.addEventListener('cancel',e=>{e.preventDefault();close()});
  skip.onclick=close;
  frame.addEventListener('error',close,{once:true});
  frame.addEventListener('load',()=>{if(frame.contentDocument?.querySelector('#skip'))skip.hidden=true},{once:true});
  try{sessionStorage.setItem(key,'1')}catch{}
  document.documentElement.style.overflow='hidden';
  dialog.showModal();frame.src='/kits/intro.html';
  timeout=setTimeout(close,20000);
})();
