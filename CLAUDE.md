# Mes jeux d'école — passation depuis claude.ai

**Règle : ne créer que les jeux explicitement demandés par l'utilisateur.**

Appli web pour enfant (6 ans), à l'origine un artifact claude.ai en un seul fichier, désormais découpée en PWA.
Dépôt : https://github.com/Fapic67/mes-jeux-ecole · site : https://fapic67.github.io/mes-jeux-ecole/
Le but est d'en faire une **appli Android installable (APK)** et partageable à des amis.

## Structure actuelle
- `index.html` = accueil par matière (Français, Mathématiques, Allemand). Chaque jeu est un fichier de `jeux/` (`francais.html`, `calcul.html`, `telephone.html`, `deutsch.html`), récupéré par `fetch` puis chargé dans une iframe `srcdoc` (même origine que l'accueil, donc même localStorage).
  Avant le chargement, l'accueil injecte `window.START` (mode du jeu) et `window.PRENOM` (prénom saisi sur l'accueil).
- `manifest.webmanifest`, `sw.js` (hors-ligne, **changer `VERSION` à chaque mise à jour**), `icons/`.
- Navigation par hash : `#francais`, `#quique`, `#maths`, `#allemand`, `#calcul`, `#telephone`, `#article`, `#mot`.
- Les jeux enregistrent leurs données en localStorage (clés `calcul`, `tel_*`, `hub_prenom`). Le prénom se règle dans les Paramètres globaux (carte « Enfant »).

## Récompenses globales (dans `index.html`)
- Les jeux envoient `parent.postMessage({type:"stars",n}, "*")` ; l'accueil cumule les étoiles (clé `rw` = `{stars, money}`).
  Gains : Calcul malin +1 ⭐ par bonne réponse, Téléphone +3 ⭐ par appel réussi, Der·Die·Das / Finde das Wort +1 ⭐ par mot trouvé du premier coup.
- Paramètres globaux (⚙️ de l'accueil, clé `rw_cfg` = `{money, unit, per, gain, pin}`) : interrupteur `money` (false = étoiles seules, tout élément `.mon` masqué via `body.nomoney`), unité de monnaie, taux « per ⭐ = gain unité », conversion, ajout/retrait d'argent, code parent.
- Code parent : 4 chiffres, haché en SHA-256 (préfixe `tm:`). **Code par défaut : 0000** (`CFG.pin` vide = `DEF_PIN`) ; les paramètres sont toujours protégés, « Remettre 0000 » rétablit le défaut. `window.hubGate(ok)` est exposé aux jeux ; le Téléphone l'utilise pour ses réglages.
- Migration unique (`rw_mig`) : l'ancienne cagnotte du Téléphone (`tel_cash` + 100 par ticket) est versée dans la monnaie, et son PIN devient le code parent.

## Design system tactile
Cibles >= 56px, bordures 3px, textes secondaires >= 16px, menus centrés verticalement (`.mid`).

### Français (`francais.html`)
- **Complète la phrase** (qui / que) : 32 phrases (`QQ`, mot manquant entre `{}`), 15 par partie. L'enfant tape « qui » ou « que » avec le clavier virtuel maison (`jeux/clavier.js` : AZERTY minuscules + ligne é è ê à ç, ⌫ et ✓, clic sonore, pas de voix ; clavier physique accepté ; le clavier Android ne s'ouvre jamais) ; la voix lit la phrase entière (mot compris) à l'affichage et après la bonne réponse. Aucun affichage de « qui »/« que » avant la bonne réponse (pas d'indice, pas de placeholder, titre neutre) : l'enfant doit l'orthographier de mémoire. Après 2 erreurs, la phrase est relue. Hash `#quique`.

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
   Les mots sans emoji utilisent des dessins SVG faits main (objet `PIC` dans `deutsch.html`) : Gans, Schulhof, Tisch, Klasse, Radiergummi, Tafel, Mäppchen, Reihe, Spitzer ; Musik = 🎶.
   Ne pas reprendre les illustrations du manuel « Die Rappelkiste » (droits d'auteur).

## Point technique important : la voix
Tout repose sur `speechSynthesis` (Web Speech API). Une **WebView Android classique ne la gère généralement pas**.
- Option recommandée : **TWA** (Trusted Web Activity, l'appli tourne dans Chrome, donc la voix marche).
  Étapes : héberger sur GitHub Pages, ajouter un `manifest.webmanifest` et un service worker (hors-ligne), des icônes 192/512, puis générer l'APK avec PWABuilder ou Bubblewrap. Ajouter `assetlinks.json` pour retirer la barre d'URL.
- Option alternative : Capacitor, en remplaçant `speechSynthesis` par le plugin `@capacitor-community/text-to-speech` (voix `de-DE` et `fr-FR`).

## À faire
- [x] Séparer le fichier en `index.html` + un fichier par jeu (sans base64).
- [x] Manifest, service worker, icônes. Git initialisé.
- [x] Publié sur GitHub Pages.
- [x] APK v1.0.0 généré (TWA, Bubblewrap, paquet `io.github.fapic67.jeuxecole`, minSdk 24). Config dans `android/twa-manifest.json`.
  La clé de signature (`android.keystore`) n'est PAS dans le dépôt : le propriétaire la garde en privé.
- [ ] Publier `android/assetlinks.json` sur https://fapic67.github.io/.well-known/assetlinks.json (dépôt `Fapic67/Fapic67.github.io`) pour retirer la barre d'adresse.
- [ ] Tester la voix de-DE / fr-FR sur un vrai téléphone.
