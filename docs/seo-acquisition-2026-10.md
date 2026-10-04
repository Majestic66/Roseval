# Roseval : corrections et acquisition — 4 octobre 2026

## État vérifié

Le dépôt produit 32 pages publiques statiques et une 404, avec titres,
descriptions, URL canoniques, données structurées et sitemap. Les pages locales
création web, référencement et identité existent déjà, ainsi que trois études
de cas clients. La nouvelle accueil conserve les trois univers.

L’accueil a été relue publiquement. Le précédent rapport ne permet pas de
conclure que Google indexe une mauvaise version : un extrait ancien n’est pas
une mesure d’indexation ni une preuve de pénalité. Il faut consulter Search
Console pour connaître la page explorée, la date et le canonical choisi.

## Corrections de ce lot

- Rétablissement des anciens favoris `/#contact`, `/#services`, `/#pricing`, etc.
  vers les sections correspondantes de `/web`, sans charger l’animation du studio.
- Liens directs depuis l’accueil vers les réalisations, le journal et les pages
  d’information, avec un bouton de préférences statistiques.
- Accès clavier au contenu principal et focus visible sur les liens et boutons.
- Tous les HTML des builds Vercel preview/development portent `noindex, follow`.
  La production conserve ses métadonnées indexables. Une copie utilisant ce même
  build peut activer `ROSEVAL_NOINDEX=true`. Ce réglage ne modifie pas un ancien
  projet Lovable indépendant.
- Tests des redirections, des liens et des métadonnées de toutes les pages de
  prévisualisation, en plus des contrôles SEO, formulaires et outils existants.

## Opérations qui demandent un accès aux comptes

### Google Search Console

1. Ouvrir la propriété `https://rosevaldesign.com/` ou la propriété domaine.
2. Vérifier sa validation : la balise présente dans le code ne prouve pas que
   la propriété est validée dans le compte.
3. Soumettre `https://rosevaldesign.com/sitemap.xml` et lire les erreurs éventuelles.
4. Inspecter `/`, `/web`, `/kits`, `/roseval-plus` et `/realisations` : statut,
   dernier crawl, canonical déclaré et canonical choisi. Demander l’indexation
   après avoir vérifié le HTML public et les réponses HTTP.
5. Suivre les impressions, clics, requêtes et pages sur quatre semaines. Une
   demande d’indexation ne garantit ni l’indexation ni un délai.

### Ancien projet Lovable

Vérifier la propriété du projet `roseval-design-flow.lovable.app`, son usage et
son code. Avec validation du propriétaire, ajouter `noindex` dans son propre
HTML ou configurer la redirection appropriée. Laisser Google explorer la page
pour qu’il puisse lire la directive. Ne pas supprimer le projet sans validation.

### Google Business Profile

Vérifier la fiche existante avant toute création. Contrôler nom, site, téléphone,
catégorie et zone de service. Une adresse de domiciliation ne suffit pas à
justifier un établissement recevant des clients. Ajouter des réalisations
autorisées et des avis authentiques ; ne pas fabriquer de témoignages.

## Plan concret sans dépense engagée

Objectif : obtenir des demandes qualifiées pour une offre de site vitrine
artisan, plutôt que promouvoir tous les outils en même temps.

| Semaine | Action | Indicateur |
| --- | --- | --- |
| 1 | Vérifier Search Console et la fiche Google ; prendre une mesure initiale | Pages indexées, clics, demandes reçues |
| 2 | Préparer un guide métier utile à partir d’une vraie réalisation autorisée | Visites du guide vers le devis |
| 3 | Présenter les trois cas clients sur les réseaux avec leurs captures et liens | Clics vers les études de cas |
| 4 | Comparer les visites du studio et les contacts ; ajuster l’offre et les appels à l’action | Demandes qualifiées, devis, ventes |

Les événements `quote_success` et `contact_click` existent déjà. Les statistiques
ne se déclenchent qu’avec consentement ; elles sous-estiment donc les contacts.
Compter aussi les demandes réellement reçues. Un clic e-mail n’est pas une vente.

## Campagne Google Ads préparée, à ne pas lancer sans budget validé

- Page de destination : `https://rosevaldesign.com/creation-site-web-toulouse`.
- Une campagne Search, ciblée sur Toulouse et une zone réellement desservie,
  avec les paramètres de présence géographique vérifiés au lancement.
- Mots-clés initiaux en expression/exact : `création site artisan Toulouse`,
  `site vitrine artisan Toulouse`, `freelance site web Toulouse`.
- Exclusions à examiner : emploi, stage, formation, tutoriel, gratuit.
- Titres proposés : « Site artisan à Toulouse », « Site vitrine dès 399 € HT »,
  « Votre projet, votre devis », « Roseval Design ».
- Description : « Présentez votre savoir-faire avec un site adapté au mobile.
  Périmètre et budget définis ensemble. Devis gratuit. »
- URL de suivi : `?utm_source=google&utm_medium=cpc&utm_campaign=artisan_toulouse`.
- Si un budget de 150 € pour 30 jours est retenu plus tard : environ 5 € par
  jour en moyenne. Contrôler le plafond total, les règles de facturation et
  les conversions avant activation. Aucun nombre de clients ne peut être promis.

Ce document prépare les actions ; il ne signifie pas que les comptes Google
ont été modifiés, qu’une campagne a été créée ou qu’un budget a été dépensé.

Référence technique : https://developers.google.com/search/docs/crawling-indexing/block-indexing
