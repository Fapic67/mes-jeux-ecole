# Mes jeux d'école

Petits jeux de maths et d'allemand pour enfant, sous forme d'appli web installable (PWA) et d'APK Android (TWA).

## Tester en local
```bash
python -m http.server 8000
```
Puis ouvrir http://localhost:8000 (le service worker ne marche pas en ouvrant le fichier directement).

## Mettre à jour
Après chaque modification, changer `VERSION` en haut de `sw.js` (v1 → v2…), sinon les téléphones gardent l'ancienne version en cache.

## 1. Publier sur GitHub Pages
1. Créer un dépôt public `mes-jeux-ecole` sur GitHub et y pousser ce dossier.
2. Dans le dépôt : Settings → Pages → Source « Deploy from a branch » → branche `main`, dossier `/ (root)`.
3. Après une minute, l'appli est en ligne sur `https://<ton-pseudo>.github.io/mes-jeux-ecole/`.

Ce lien suffit déjà pour partager :
- Android (Chrome) : menu ⋮ → « Installer l'application ».
- iPhone (Safari) : Partager → « Sur l'écran d'accueil ».

## 2. Générer l'APK Android (TWA)
1. Aller sur https://www.pwabuilder.com, coller l'adresse GitHub Pages.
2. Package for stores → Android → Options : nom de paquet, par ex. `io.github.<pseudo>.jeuxecole`.
3. Télécharger le zip. Il contient l'APK (pour envoyer à tes amis), l'AAB (pour le Play Store),
   la clé de signature (**à garder précieusement** : elle est nécessaire pour toute mise à jour) et un `assetlinks.json`.

### Retirer la barre d'adresse (assetlinks.json)
Le fichier doit être servi à la **racine du domaine** : `https://<pseudo>.github.io/.well-known/assetlinks.json`.
Pour un site de projet GitHub Pages, ça veut dire créer un second dépôt nommé exactement `<pseudo>.github.io`,
y mettre `.well-known/assetlinks.json` et un fichier vide `.nojekyll`, puis activer Pages dessus.

## 3. Installer l'APK sur un téléphone
Envoyer le fichier `.apk` (WhatsApp, mail, Drive…). Sur le téléphone, l'ouvrir et accepter
« Autoriser l'installation depuis cette source ». Chrome doit être installé (c'est le cas sur presque tous les Android).

Vérifier que les voix allemande et française marchent : Réglages Android → Synthèse vocale → Google,
et installer les données vocales Deutsch et Français si besoin.
