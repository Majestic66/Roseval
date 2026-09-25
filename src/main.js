const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const intro=document.querySelector('#roseval-intro');
if(intro){
  if(!document.documentElement.classList.contains('roseval-intro-active'))intro.remove();
  else{
    let finished=false;
    const frame=intro.querySelector('iframe');
    const reveal=()=>{
      if(finished)return;
      finished=true;
      try{sessionStorage.setItem('roseval-intro-seen','1')}catch{}
      document.documentElement.classList.remove('roseval-intro-active');
      intro.style.display='block';
      intro.style.opacity='0';
      intro.style.pointerEvents='none';
      setTimeout(()=>intro.remove(),850);
      window.removeEventListener('message',onComplete);
      clearTimeout(fallback);
    };
    const onComplete=event=>{
      if(event.source!==frame.contentWindow||event.origin!==location.origin||event.data?.type!=='roseval-intro-complete')return;
      reveal();
    };
    window.addEventListener('message',onComplete);
    frame.addEventListener('error',reveal,{once:true});
    const fallback=setTimeout(reveal,15000);
  }
}
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#nav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');nav.classList.toggle('open',open)});
nav?.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false')}});
if(!reduced.matches&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pending');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('pending');observer.observe(el)})}
if(document.querySelector('#art-canvas')){const load=()=>import('./sculpture.js').then(m=>m.init()).catch(()=>{document.querySelector('#motion-toggle').hidden=true});if('requestIdleCallback'in window)requestIdleCallback(load,{timeout:1400});else setTimeout(load,200)}
let toastTimer;function toast(text){const el=document.querySelector('#toast');el.textContent=text;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3500)}
const store={get(key){try{return localStorage.getItem(key)}catch{return null}},set(key,val){try{localStorage.setItem(key,val)}catch{}}};
function openDialog(id){const d=document.querySelector(id);if(d&&!d.open)d.showModal()}
document.querySelectorAll('[data-open-quote]').forEach(b=>b.addEventListener('click',()=>openDialog('#quote-dialog')));
document.querySelectorAll('[data-open-assistant]').forEach(b=>b.addEventListener('click',()=>openDialog('#assistant-dialog')));
document.querySelectorAll('[data-cookie-settings]').forEach(b=>b.addEventListener('click',()=>openDialog('#cookie-dialog')));
document.querySelectorAll('[data-close-dialog]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const b=d.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)d.close()}}));
document.querySelector('#copy-email')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText('roseval.design@gmail.com');toast('Adresse e-mail copiée')}catch{toast('roseval.design@gmail.com')}});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelectorAll('.post-card').forEach(c=>c.hidden=b.dataset.filter!=='Tous'&&c.dataset.category!==b.dataset.filter)}));
document.querySelectorAll('[data-offer]').forEach(b=>b.addEventListener('click',()=>{const s=document.querySelector('#contact-form select');const map={'Formule simple':'Formule simple (39€/mois)','Image de marque':'Image de marque (199€+)','Projet sur mesure':'Site Vitrine (399€)'};if(s)s.value=map[b.dataset.offer]}));
for(const id of ['contact-form','newsletter-form']){const form=document.getElementById(id);if(!form)continue;form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const status=form.querySelector('.form-status'),submit=form.querySelector('[type=submit]');if(submit.disabled)return;const data=Object.fromEntries(new FormData(form));if(data._gotcha)return;if(id==='newsletter-form'){data.projectType='Demande d’inscription newsletter';data.message='Demande d’inscription volontaire à la newsletter. Consentement explicite fourni via la case cochée.'}submit.disabled=true;status.className='form-status';status.textContent='Envoi en cours…';try{const response=await fetch(form.action,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error();status.classList.add('success');status.textContent=id==='newsletter-form'?'Votre demande d’inscription a été transmise à Antonny.':'Merci ! Votre demande a bien été envoyée. Je vous réponds sous 24h.';form.reset()}catch{status.classList.add('error');status.textContent='L’envoi n’a pas abouti. Vos informations sont conservées dans ce formulaire. Contactez-moi à roseval.design@gmail.com ou au 06 68 39 98 99.'}finally{submit.disabled=false}})}
const quoteForm=document.querySelector('#quote-form');
function quote(){const f=new FormData(quoteForm);const amount=Number(f.get('kind'))+Number(f.get('seo')||0)+Number(f.get('brand')||0);return `À partir de ${amount.toLocaleString('fr-FR')} € HT${f.has('maintenance')?' + 50 €/mois de maintenance':''}`}
quoteForm?.addEventListener('change',()=>document.querySelector('#quote-total').textContent=quote());
quoteForm?.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(quoteForm);const project=quoteForm.elements.kind.selectedOptions[0].textContent;const message=`Bonjour Antonny, mon projet : ${project}.\n${quote()} (estimation indicative, à confirmer).\nOptions : ${['seo','brand','maintenance'].filter(k=>f.has(k)).join(', ')||'aucune'}.\n\nVoici les détails de mon projet : `;const target=document.querySelector('#contact-form');if(target){const types={'Site vitrine':'Site Vitrine (399€)','E-commerce':'Site E-commerce (900€+)','Application web':'Application sur mesure','Refonte de site':'Refonte / Maintenance','Identité visuelle':'Image de marque (199€+)'};target.elements.projectType.value=types[project];target.elements.message.value=message;document.querySelector('#quote-dialog').close();location.hash='contact';target.elements.name.focus({preventScroll:true})}else{try{sessionStorage.setItem('roseval-quote',message)}catch{}location.href='/#contact'}});
try{const message=sessionStorage.getItem('roseval-quote');const field=document.querySelector('#contact-form textarea');if(message&&field){field.value=message;sessionStorage.removeItem('roseval-quote')}}catch{}
function answer(question){const q=question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');if(/urgent|contact|appel|antonny|telephone|rdv/.test(q))return 'Antonny est joignable au 06 68 39 98 99 et à roseval.design@gmail.com. Le formulaire de contact est disponible 24h/24, avec une réponse annoncée sous 24h.';if(/tarif|prix|combien|budget|cout/.test(q))return 'Site vitrine dès 399 € HT, formule simple dès 39 €/mois HT (engagement 12 mois), e-commerce dès 900 €, identité visuelle dès 199 € HT. Chaque projet fait l’objet d’un devis personnalisé.';if(/delai|temps|rapide|long/.test(q))return 'Comptez 2 à 3 semaines pour un site vitrine, 4 à 6 semaines pour un e-commerce et 8 à 12 semaines pour une application complexe. Le calendrier est confirmé dans le devis.';if(/seo|google|referenc/.test(q))return 'Le SEO est intégré aux projets : optimisation technique, contenus, données structurées et performance. L’accompagnement SEO & visibilité débute à 300 €. Le positionnement dépend aussi de la concurrence et ne peut pas être garanti.';if(/maintenance|suivi|apres|bug/.test(q))return 'La maintenance expert est proposée à 50 €/mois : mises à jour de sécurité, sauvegardes, suivi des performances et support technique.';if(/toulouse|region|ou |local/.test(q))return 'Roseval Design est basé à Toulouse et accompagne les artisans, TPE et PME de Haute-Garonne et d’Occitanie, principalement à distance. Des rencontres sont possibles pour les réunions importantes.';if(/ia|robot|automati/.test(q))return 'Roseval Design propose des agents IA et des automatisations sur mesure. Cet assistant utilise des réponses pré-écrites et ne remplace pas un échange avec Antonny.';if(/realisation|portfolio|exemple/.test(q))return 'Explorez les 11 projets dans la section Réalisations : FL Rénovation, DPC Immobilier, AP Design, Trading Bot AI, Cabinet Dentaire Montrabé et d’autres plateformes.';if(/merci|bonjour|salut/.test(q))return 'Bonjour et bienvenue ! Je peux vous renseigner sur les tarifs, le SEO, les délais et les coordonnées du studio.';return 'Pour préciser votre besoin, contactez Antonny à roseval.design@gmail.com ou utilisez le formulaire de contact. Je peux répondre aux questions sur les tarifs, le SEO, la maintenance ou les délais.'}
function chat(q){const log=document.querySelector('#chat-log');const user=document.createElement('p');user.className='user';user.textContent=q;const reply=document.createElement('p');reply.textContent=answer(q);log.append(user,reply);reply.scrollIntoView({block:'nearest',behavior:reduced.matches?'instant':'smooth'})}
document.querySelector('#chat-form')?.addEventListener('submit',e=>{e.preventDefault();const field=e.currentTarget.elements.question;const q=field.value.trim();if(q){chat(q);field.value=''}});
document.querySelectorAll('[data-topic]').forEach(b=>b.addEventListener('click',()=>chat(b.dataset.topic)));
const gaID='G-YHD3WSWHXR';let analyticsLoaded=false;
function enableAnalytics(){if(analyticsLoaded||['localhost','127.0.0.1'].includes(location.hostname))return;analyticsLoaded=true;window['ga-disable-'+gaID]=false;window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});window.gtag('js',new Date());window.gtag('config',gaID,{allow_google_signals:false,allow_ad_personalization_signals:false,cookie_expires:60*60*24*180});const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+gaID;document.head.append(script)}
function validConsent(){try{const v=JSON.parse(store.get('roseval-consent'));return v&&Date.now()-v.time<180*864e5?v.value:null}catch{return null}}
if(validConsent()==='granted')enableAnalytics();
document.querySelectorAll('[data-consent]').forEach(b=>b.addEventListener('click',()=>{const consent=b.dataset.consent;store.set('roseval-consent',JSON.stringify({value:consent,time:Date.now()}));document.querySelector('#cookie-dialog').close();if(consent==='granted'){enableAnalytics();toast('Préférence enregistrée : statistiques autorisées')}else{window['ga-disable-'+gaID]=true;window.gtag?.('consent','update',{analytics_storage:'denied'});for(const cookie of document.cookie.split(';')){const name=cookie.split('=')[0].trim();if(name.startsWith('_ga')||name==='_gid')for(const domain of ['',location.hostname,'.'+location.hostname,'.rosevaldesign.com'])document.cookie=`${name}=; Max-Age=0; path=/${domain?'; domain='+domain:''}` }toast('Statistiques désactivées')}}));
document.querySelector('[data-share]')?.addEventListener('click',async()=>{try{if(navigator.share)await navigator.share({title:document.title,url:location.href});else{await navigator.clipboard.writeText(location.href);toast('Lien copié')}}catch{}});
