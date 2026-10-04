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
if (intro && typeof intro.showModal === 'function') {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const frame = intro.querySelector('iframe');
  let timer;
  let previousOverflow;
  let focusBeforeIntro;
  function finishIntro() {
    if (!intro.open) return;
    clearTimeout(timer);
    intro.close();
    frame.removeAttribute('src'); // Stop the animation and free its resources.
    document.documentElement.style.overflow = previousOverflow;
    (focusBeforeIntro || document.querySelector('#accueil'))?.focus({preventScroll: true});
  }
  function playIntro() {
    if (intro.open || reducedMotion.matches) return;
    focusBeforeIntro = replay === document.activeElement ? replay : null;
    previousOverflow = document.documentElement.style.overflow;
    intro.querySelector('[data-skip-intro]').hidden = false;
    intro.showModal();
    document.documentElement.style.overflow = 'hidden';
    frame.src = frame.dataset.src;
    timer = setTimeout(finishIntro, 6500); // The site remains accessible if the frame fails.
    try { sessionStorage.setItem('roseval-home-intro-seen', '1'); } catch {}
  }
  window.addEventListener('message', event => {
    if (event.origin === location.origin && event.source === frame.contentWindow && event.data?.type === 'roseval-intro-complete') finishIntro();
  });
  intro.addEventListener('cancel', event => { event.preventDefault(); finishIntro(); });
  intro.querySelector('[data-skip-intro]').addEventListener('click', finishIntro);
  frame.addEventListener('error', finishIntro);
  frame.addEventListener('load', () => {
    if (intro.open && frame.contentDocument?.querySelector('#skip')) intro.querySelector('[data-skip-intro]').hidden = true;
  });
  replay.hidden = reducedMotion.matches;
  replay.addEventListener('click', playIntro);
  reducedMotion.addEventListener('change', () => { replay.hidden = reducedMotion.matches; if (reducedMotion.matches) finishIntro(); });
  let seen = false;
  try { seen = sessionStorage.getItem('roseval-home-intro-seen') === '1'; } catch {}
  // Keep direct links and restored navigation immediate.
  const navigation = performance.getEntriesByType('navigation')[0];
  if (!seen && !location.hash && navigation?.type !== 'back_forward') playIntro();
}
