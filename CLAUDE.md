# Mes jeux d'école — passation depuis claude.ai

Appli web pour enfant (6 ans), en une seule page : `mes-jeux-ecole.html`.
Elle tourne aujourd'hui comme un artifact claude.ai. Le but est d'en faire une **appli Android installable (APK)** et partageable à des amis.

## Structure actuelle
- `index.html` = accueil par matière. Chaque jeu est un fichier de `jeux/` (`calcul.html`, `telephone.html`, `deutsch.html`), récupéré par `fetch` puis chargé dans une iframe `srcdoc` (même origine que l'accueil, donc même localStorage).
- `manifest.webmanifest`, `sw.js` (hors-ligne, **changer `VERSION` à chaque mise à jour**), `icons/`.
  Avant le chargement, l'accueil injecte `window.START` (mode du jeu) et `window.PRENOM` (prénom saisi sur l'accueil).
- Navigation par hash : `#maths`, `#allemand`, `#calcul`, `#telephone`, `#article`, `#mot`.
- Les jeux enregistrent leurs données en localStorage (clés `calcul`, `tel_*`, `hub_prenom`).

### Mathématiques
1. **Calcul malin** : additions, soustractions et compléments, avec un résultat maximum réglable. Fin de partie au choix : sans fin, objectif d'étoiles ou minuteur (au minuteur, l'enfant termine la dernière opération).
   L'opération est **énoncée en allemand** ; quand la réponse est juste, l'opération complète est relue avec le résultat. Bonne réponse : le check se secoue, devient vert et un son de victoire part. Mauvaise réponse : croix rouge.
   Toutes les 6 à 8 étoiles, un personnage traverse l'écran en riant (15 personnages SVG, trajets variés).
2. **Le téléphone magique** : une voix française dicte un numéro de 5 nombres de 10 à 99, un nombre à la fois. L'enfant compose chaque nombre ; le nombre suivant n'est dicté que quand elle a juste. En cas d'erreur, l'appli dit « Recommence ».
   Quand le numéro est complet, la voix dit « Appuie sur téléphoner ». Bon numéro : ça sonne, puis « Allô ? Bravo » ; mauvais numéro : tonalité occupé.
   La cagnotte gagne 10 € par victoire, et un ticket coûte 100 €. Toutes les 10 victoires, l'appli dit « Bravo + prénom ».
   Réglages : nombre maximum, plage favorisée avec un pourcentage, utilisation des tickets. Ils sont protégés par le verrou du téléphone (WebAuthn), ou à défaut par un PIN parent.

### Allemand (liste de mots commune dans `RAW`, format `article|mot|emoji`)
3. **Der · Die · Das** : le mot s'affiche et est prononcé ; l'enfant choisit l'article. Bonne réponse : l'appli dit article + mot. Partie de 20 mots, note sur 10, bouton « Nochmal ».
4. **Finde das Wort** : une image (emoji) et 3 pills **avec l'article** (« der Bleistift ») ; le mot trouvé est prononcé.
   Les mots sans image sont exclus. Prévu : une planche d'images générée par IA (grille 4×3) pour Gans, Schulhof, Tisch, Klasse, Radiergummi, Tafel, Mäppchen, Reihe, Spitzer et Musik, à découper en sprites.

## Point technique important : la voix
Tout repose sur `speechSynthesis` (Web Speech API). Une **WebView Android classique ne la gère généralement pas**.
- Option recommandée : **TWA** (Trusted Web Activity, l'appli tourne dans Chrome, donc la voix marche).
  Étapes : héberger sur GitHub Pages, ajouter un `manifest.webmanifest` et un service worker (hors-ligne), des icônes 192/512, puis générer l'APK avec PWABuilder ou Bubblewrap. Ajouter `assetlinks.json` pour retirer la barre d'URL.
- Option alternative : Capacitor, en remplaçant `speechSynthesis` par le plugin `@capacitor-community/text-to-speech` (voix `de-DE` et `fr-FR`).

## À faire
- [x] Séparer le fichier en `index.html` + un fichier par jeu (sans base64).
- [x] Manifest, service worker, icônes. Git initialisé.
- [ ] Publier sur GitHub Pages (voir README.md).
- [ ] Générer l'APK (TWA via PWABuilder) + `assetlinks.json`, tester la voix de-DE / fr-FR sur un vrai téléphone.
