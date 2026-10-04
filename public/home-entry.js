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
