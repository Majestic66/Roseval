import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const sitemap=await fs.readFile('dist/sitemap.xml','utf8');
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
assert.equal(new Set(urls).size,32,'Sitemap sans doublons');
const titles=new Set(),descriptions=new Set();
for(const url of urls){
 const file=url==='/kits/atelier'?'dist/kits/atelier.html':path.join('dist',url,'index.html');
 const html=await fs.readFile(file,'utf8');
 const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
 const description=html.match(/<meta name="description" content="([^"]*)"/)?.[1];
 assert(title&&!titles.has(title),'Titre unique : '+url);titles.add(title);
 assert(description&&!descriptions.has(description),'Description unique : '+url);descriptions.add(description);
 assert.equal((html.match(/rel="canonical"/g)||[]).length,1,url);
 assert(html.includes('rel="canonical" href="https://rosevaldesign.com'+url+'"'),url);
 assert(!/name="robots" content="[^"]*noindex/.test(html),url);
 for(const key of ['og:title','og:description','og:url','og:image'])assert(html.includes('property="'+key+'"'),key+' '+url);
 const graphs=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1])['@graph']||[]);
 assert(graphs.some(n=>n['@type']==='WebPage'&&n.url==='https://rosevaldesign.com'+url),'WebPage '+url);
 if(url.startsWith('/outils/'))assert(graphs.some(n=>n['@type']==='WebApplication'),'Application '+url);
}
assert((await fs.readFile('dist/intro.html','utf8')).includes('noindex, follow'));
assert((await fs.readFile('dist/404.html','utf8')).includes('noindex, follow'));
assert((await fs.readFile('dist/roseval-plus/index.html','utf8')).includes('href="/outils/generateur-carrousel"'));
console.log('PASS : 32 URL canoniques, titres et descriptions uniques, données structurées, aperçus sociaux et sitemap.');

// Project pages and revised articles must remain reachable with truthful dates and semantic content.
for(const slug of ['fl-renovation','dpc-immobilier','ap-design']){
 const page=await fs.readFile('dist/realisations/'+slug+'/index.html','utf8');
 assert(page.includes('<h2>Le besoin</h2>')&&page.includes('<h2>Le travail réalisé</h2>'));
 assert(sitemap.includes('/realisations/'+slug));
 assert((await fs.readFile('dist/web/index.html','utf8')).includes('href="/realisations/'+slug+'"'));
}
for(const slug of ['seo-local-toulouse-2026','prix-creation-site-vitrine','creation-site-internet-pas-cher-toulouse']){
 const html=await fs.readFile('dist/blog/'+slug+'/index.html','utf8');
 assert(html.includes('aria-label="Sommaire de l’article"'));
 assert(html.includes('Mis à jour le 29/09/2026'));
 assert(html.includes('"dateModified":"2026-09-29"'));
 assert(sitemap.includes('/blog/'+slug+'</loc><lastmod>2026-09-29</lastmod>'));
}
const servicePage=await fs.readFile('dist/web/index.html','utf8');
assert(servicePage.includes('<title>Freelance web à Toulouse'));
assert((await fs.readFile('src/main.js','utf8')).includes("location.href='/web#contact'"));
console.log('PASS : réalisations liées, dates de mise à jour cohérentes, articles structurés et parcours devis direct.');
