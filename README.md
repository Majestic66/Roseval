# Roseval Design — version 3

Refonte complète de rosevaldesign.com, préparée pour GitHub et Vercel. Le site public existant n’a pas été modifié.

## Démarrer sur votre ordinateur

Installez Node.js 22 ou une version plus récente, puis ouvrez un terminal dans ce dossier :

```sh
npm ci
npm run dev
```

Ouvrez http://127.0.0.1:4186. Si le port est déjà utilisé, modifiez sa valeur dans `scripts/dev.mjs`.

Pour régénérer le site après une modification, lancez `npm run build` puis actualisez votre navigateur. Le serveur local continue à servir les fichiers actualisés.

## Mettre le site sur GitHub, puis Vercel

1. Créez un dépôt GitHub et placez **le contenu de ce dossier** à sa racine. `package.json`, `vercel.json`, `src`, `scripts` et `public` doivent être au même niveau. Le dossier `node_modules` ne doit pas être envoyé.
2. Dans Vercel, choisissez **Add New → Project**, puis importez ce dépôt.
3. Framework : **Other**. Commande de compilation : `npm run build`. Dossier de sortie : `dist`. Le fichier `vercel.json` fournit ces paramètres. Aucune variable secrète n’est requise.
4. Consultez l’URL de prévisualisation Vercel et contrôlez les pages, le formulaire et les informations de votre entreprise.
5. Dans les réglages du projet Vercel, ajoutez **rosevaldesign.com** et suivez les indications DNS de Vercel. N’effectuez la bascule du domaine qu’après ce contrôle. Configurez également `www.rosevaldesign.com` en redirection vers le domaine principal.
6. Envoyez une demande réelle depuis votre formulaire et vérifiez sa réception dans votre boîte e-mail / votre compte Formspree. Cette réception n’a pas été testée automatiquement pour éviter de vous envoyer des messages.
7. Dans Google Search Console, soumettez `https://rosevaldesign.com/sitemap.xml`, puis surveillez l’indexation et les éventuelles erreurs de migration.

Les URL de production sont volontairement fixées à `https://rosevaldesign.com`. Les prévisualisations Vercel pointent donc vers ce domaine dans leurs URL canoniques.

## Ce qui a été récupéré

- Les six expertises, les trois packs et les prestations complémentaires.
- Les onze projets, leurs liens et leurs images ; les quatre sites de démonstration.
- La présentation d’Antonny, son parcours et les quatre témoignages complets.
- Le processus de travail, les huit questions/réponses et les coordonnées.
- Le journal et les huit articles, avec leurs URL et dates de publication.
- Les trois pages légales et les informations d’entreprise de l’ancien site.
- Le formulaire, un estimateur, l’assistant à réponses prédéfinies et la demande d’inscription à la newsletter.

Harmonisation validée : **Roseval Design**, **roseval.design@gmail.com**, maintenance **50 €/mois**.

## Modifier le contenu

- `src/content.json` : articles, projets, témoignages, FAQ et pages légales.
- `src/templates.mjs` : textes de l’accueil, offres, navigation, SEO et structure des pages.
- `src/style.css` : couleurs, typographie, mise en page et adaptation mobile.
- `src/wordmark.js` : tracé du logotype « roseval. » extrait de la police Outfit du site, sous licence SIL OFL.
- `src/sculpture.js` : logotype en relief Three.js, éclairage et animation.
- `src/main.js` : interactions, formulaire, estimateur, consentement et assistant.
- `public/` : toutes les images et polices, conservées localement.

Après modification :

```sh
npm run build
npm run check
```

L’archive est le projet complet. Aucun lien vers un espace Sites ou un outil de création n’est nécessaire pour l’héberger.

## Contact et newsletter

Le formulaire utilise l’adresse **Formspree publique déjà présente sur l’ancien site** : `https://formspree.io/f/xjgerygq`. Il affiche un succès uniquement après réponse positive du service. En cas d’erreur, il conserve le texte et propose le contact direct. Vérifiez que ce formulaire appartient toujours à votre compte, que le domaine est autorisé et que le quota est suffisant.

La newsletter transmet une **demande d’inscription** à Antonny via ce même formulaire, avec consentement explicite. Il n’existait pas de raccordement d’envoi de newsletter récupérable sur le site précédent. La constitution de la liste et les campagnes restent à gérer dans votre outil habituel ; le site n’annonce pas une inscription automatique effectuée.

L’estimateur est indicatif, sans valeur contractuelle. L’assistant utilise des réponses pré-écrites : aucune clé d’API d’intelligence artificielle n’est nécessaire et aucune conversation n’est envoyée à un fournisseur d’IA.

## SEO, GEO et performance

Le contenu est produit en HTML avant la visite : les moteurs et les visiteurs peuvent le lire sans attendre JavaScript. Chaque page possède un titre, une description, une URL canonique et des données structurées cohérentes. Les articles ont un auteur, une date et un balisage BlogPosting ; la FAQ correspond aux réponses visibles. Le sitemap ne contient que les pages réellement générées.

Les anciennes routes `/services`, `/portfolio` et `/contact` redirigent vers les sections correspondantes. Le site dispose d’une vraie page 404, de liens HTML explorables et d’une structure de titres contrôlée. Les anciennes métadonnées contradictoires (autre domaine Vercel, faux numéro générique, recherche inexistante, compteurs d’avis divergents) n’ont pas été reproduites.

La 3D est chargée à part, uniquement sur l’accueil. Son animation s’arrête hors écran et en arrière-plan ; le bouton pause et la préférence système de réduction des animations sont respectés. Le logotype reste visible en version plate si WebGL n’est pas disponible. Aucun défilement artificiellement détourné. Les visuels ont des dimensions réservées et sont chargés progressivement.

Cette base facilite l’exploration et la compréhension du site ; elle ne garantit pas une position Google ou une citation dans les réponses d’IA. Les mesures Core Web Vitals réelles devront être suivies après publication. Référence : https://developers.google.com/search/docs/appearance/ai-features

## Confidentialité et informations à relire

La mesure d’audience est désactivée par défaut. Les préférences permettent d’activer Google Analytics avec l’identifiant existant `G-YHD3WSWHXR`. Aucun script Analytics n’est chargé en prévisualisation locale. Google Tag Manager et les scripts publicitaires ne sont pas chargés. Les politiques techniques ont été adaptées à ce fonctionnement.

Les numéros d’entreprise, l’adresse, les informations d’hébergement et les engagements commerciaux ont été récupérés depuis vos pages existantes, sans accès à vos contrats ni à un registre d’entreprise. Relisez-les avant de publier la version officielle. Les articles anciens conservent leurs budgets et dates historiques (notamment le Pack Business à 600 € dans l’article sur les prix).

Deux illustrations de blog indisponibles lors de la récupération ont été remplacées par des visuels du site existant : « Création de site internet pas cher » et « Prix création site vitrine ». Les textes ont été conservés.

## Vérification effectuée

- Compilation réussie et vérification automatique de 13 pages + la page 404.
- Contrôle des liens et ancres internes, ressources locales, JSON-LD, langue, titres et inventaire des contenus.
- Vérification visuelle sur ordinateur et mobile 390 px, sans débordement horizontal sur les pages contrôlées.
- Menu mobile, FAQ, filtre du journal, lecture d’article, estimateur et transfert vers le formulaire, assistant, pause 3D et refus des statistiques vérifiés dans le navigateur.
- Aucun message externe envoyé, aucun domaine modifié, aucun dépôt distant créé.

## Dépendances

Three.js pour la 3D, esbuild pour préparer les fichiers JavaScript, Acorn pour la vérification. Les versions sont verrouillées dans `package-lock.json`. Le rendu du contenu ne dépend pas de React, d’un serveur Node en production, ni d’une base de données.

#   R o s e v a l 
 
 