# Activer la synchronisation « Famille » (Firebase, gratuit)

À faire une seule fois, sur un ordinateur de préférence (environ 10 minutes), avec ton compte Google.

## 1. Créer le projet
1. Va sur **https://console.firebase.google.com** et clique sur **« Créer un projet »** (ou « Ajouter un projet »).
2. Nom : `mes-jeux-ecole` → Continuer.
3. **Désactive Google Analytics** (inutile) → **Créer le projet** → Continuer.

## 2. Autoriser la connexion anonyme
1. Menu de gauche : **Créer (Build) → Authentication** → **Commencer**.
2. Onglet **Méthode de connexion (Sign-in method)** → **Anonyme** → **Activer** → **Enregistrer**.

## 3. Créer la base de données
1. Menu de gauche : **Créer (Build) → Firestore Database** → **Créer une base de données**.
2. Emplacement : **eur3 (Europe)** → Suivant.
3. **Démarrer en mode production** → **Créer**.

## 4. Coller les règles de sécurité
Dans Firestore Database, onglet **Règles**, remplace tout le texte par celui-ci puis clique sur **Publier** :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /families/{fam}/devices/{uid} {
      allow read: if request.auth != null && fam.size() == 12;
      allow write: if request.auth != null && request.auth.uid == uid && fam.size() == 12;
    }
  }
}
```

Ces règles font que chaque téléphone ne peut écrire que sa propre part, et qu'on ne peut lire une famille qu'en connaissant son code de 12 caractères.

## 5. Récupérer la configuration
1. En haut à gauche : **⚙️ → Paramètres du projet** → onglet **Général**.
2. En bas, « Vos applications » : clique sur l'icône **Web `</>`**, nom `jeux`, **ne coche pas** Firebase Hosting → **Enregistrer l'application**.
3. Firebase affiche un bloc `firebaseConfig`. Envoie à Claude seulement ces deux lignes :
   - `apiKey: "…"`
   - `projectId: "…"`

Ce ne sont pas des secrets : elles indiquent seulement à l'appli quel projet utiliser. La sécurité vient des règles de l'étape 4.

## Ensuite, dans l'appli
1. Sur ton téléphone : Paramètres → 📱 Application → **👨‍👩‍👧 Famille** → **Créer une famille** → **📤 Partager le code**.
2. Sur le téléphone d'Edwina : Paramètres → 📱 Application → 👨‍👩‍👧 Famille → saisir le code → **Rejoindre**.
   Les profils de son téléphone sont remplacés par ceux de la famille.
