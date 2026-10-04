// Keep bookmarks from the former homepage useful after the three-universe launch.
const studioSections = new Set(['hero', 'services', 'portfolio', 'about', 'pricing', 'process', 'testimonials', 'faq', 'contact']);
function routeStudioBookmark() {
  if (location.pathname === '/' && studioSections.has(location.hash.slice(1))) {
    location.replace('/web' + location.hash);
  }
}
routeStudioBookmark();
window.addEventListener('hashchange', routeStudioBookmark);
document.querySelector('[data-cookie-settings]')?.addEventListener('click', () => window.RosevalAnalytics?.preferences());


const intro = document.querySelector('#home-intro');
const replay = document.querySelector('[data-replay-intro]');
if (intro) {
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const frame = intro.querySelector('iframe');
  const page = document.querySelector('.roseval-page');
  let timer;
  let previousOverflow;
  let focusBeforeIntro;
  let playing = false;
  function clearCover() {
    clearTimeout(window.rosevalIntroCoverTimer);
    root.classList.remove('intro-pending');
  }
  function finishIntro() {
    clearCover();
    if (!playing) return;
    playing = false;
    clearTimeout(timer);
    if (typeof intro.close === 'function') intro.close();
    else intro.removeAttribute('open');
    frame.removeAttribute('src');
    page.inert = false;
    root.style.overflow = previousOverflow;
    (focusBeforeIntro || document.querySelector('#accueil'))?.focus({preventScroll: true});
  }
  function playIntro() {
    if (playing || reducedMotion.matches) return;
    focusBeforeIntro = replay === document.activeElement ? replay : null;
    previousOverflow = root.style.overflow;
    intro.querySelector('[data-skip-intro]').hidden = false;
    // Fixed overlay also works on browsers without the dialog API.
    if (typeof intro.showModal === 'function') intro.showModal();
    else intro.setAttribute('open', '');
    playing = true;
    page.inert = true;
    root.style.overflow = 'hidden';
    clearCover();
    timer = setTimeout(finishIntro, 10000);
    frame.src = frame.dataset.src;
  }
  window.addEventListener('message', event => {
    if (event.origin === location.origin && event.source === frame.contentWindow && event.data?.type === 'roseval-intro-complete') finishIntro();
  });
  intro.addEventListener('cancel', event => { event.preventDefault(); finishIntro(); });
  intro.addEventListener('keydown', event => { if (event.key === 'Escape') finishIntro(); });
  intro.querySelector('[data-skip-intro]').addEventListener('click', finishIntro);
  frame.addEventListener('error', finishIntro);
  frame.addEventListener('load', () => {
    if (!playing || !frame.contentDocument?.querySelector('#skip')) return;
    clearTimeout(timer);
    timer = setTimeout(finishIntro, 6500);
    // Keep the outer skip control available throughout loading and playback.
  });
  replay.hidden = reducedMotion.matches;
  replay.addEventListener('click', playIntro);
  reducedMotion.addEventListener('change', () => { replay.hidden = reducedMotion.matches; if (reducedMotion.matches) finishIntro(); });
  window.addEventListener('pagehide', finishIntro);
  // Every fresh homepage opening/reload plays the intro, including returning visitors.
  if (!location.hash && !reducedMotion.matches) playIntro();
  else clearCover();
}
