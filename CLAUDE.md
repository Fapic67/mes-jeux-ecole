# Mes jeux d'école — passation depuis claude.ai

**Règle : ne créer que les jeux explicitement demandés par l'utilisateur.**

Appli web pour enfant (6 ans), à l'origine un artifact claude.ai en un seul fichier, désormais découpée en PWA.
Dépôt : https://github.com/Fapic67/mes-jeux-ecole · site : https://fapic67.github.io/mes-jeux-ecole/
Le but est d'en faire une **appli Android installable (APK)** et partageable à des amis.

## Structure actuelle
- `index.html` = accueil par matière (Français, Mathématiques, Allemand, Logique, Mémoire, Musique, Jeux). Chaque jeu est un fichier de `jeux/` (`francais.html`, `calcul.html`, `telephone.html`, `deutsch.html`), récupéré par `fetch` puis chargé dans une iframe `srcdoc` (même origine que l'accueil, donc même localStorage).
  Avant le chargement, l'accueil injecte `window.START` (mode du jeu) et `window.PRENOM` (prénom saisi sur l'accueil).
- `manifest.webmanifest`, `sw.js` (hors-ligne, **changer `VERSION` à chaque mise à jour**), `icons/`.
- Navigation par hash : `#francais`, `#quique`, `#phrase`, `#conj`, `#maths`, `#allemand`, `#calcul`, `#telephone`, `#nombre`, `#article`, `#mot`, `#schreib`, `#logique`, `#chenille`, `#code`, `#robot`, `#boucles`, `#reparateur`, `#memoire`, `#memory`, `#courses`, `#musique`, `#note`, `#jeux`, `#morpion`.
- Les jeux enregistrent leurs données en localStorage (clés `calcul`, `tel_*`, `hub_prenom`). Le prénom se règle dans les Paramètres globaux (carte « Enfant »).

## Profils et récompenses (dans `index.html`)
- Clé `profiles` = `{active, list:[{id, name, reward, unit, per, gain, stars, money}]}`. Chaque profil a son prénom (injecté dans les jeux en `window.PRENOM`), son système de récompense (`reward` on/off, unité, taux « per ⭐ = gain »), ses étoiles et sa récompense. `window.PROFILE` = id du profil actif.
- **Économie (argent de poche juste)** : les jeux n'attribuent plus d'étoiles ; à chaque réponse ils envoient `parent.postMessage({type:"answer", game, ok, diff, q}, "*")` (`ok` = juste **du premier coup** ; une bonne réponse après une erreur n'envoie rien ; `diff` = difficulté du jeu ; `q` = qualité 0-1, optionnelle). L'accueil (`onAnswer`, objet `ECON`) gère :
  - **série 🔥** (bonnes réponses d'affilée du 1er coup, remise à 0 par une erreur et à chaque lancement de jeu) avec paliers ×1 (0-4), ×2 (5-9), ×3 (10+), annonces à 5 et 10 ;
  - **jauge ⭐** : points = `ECON.P[jeu] × diff × palier × q`, 10 points = 1 ⭐ (P : calcul .7, telephone .9, dde/fdw .5, quique/phrase 1.1, conj .8, note .5, code 7, robot 5, boucles 6, reparateur 4, chenille .8, memory 1 (par paire, à la fin de la partie), courses 2.5, nombre .6, sdw 1.1 — calibrés par simulation : 20 min/jour à 90 % ≈ 140 ⭐/semaine) ;
  - par profil `goal` (min/jour, 20, objectif affiché « ⭐ x / goal aujourd'hui »), `cap` (€/semaine, 3) et `rate` (⭐ pour 1 €, **50**) : `target = rate × cap` (150 ⭐ pour 3 €) ; `econ = {streak, gauge, days:{AAAA-MM-JJ:{st,ok,tot,sec,best}}, weeks:[…], wk (lundi), notice}` ;
  - **Règle : jeux en partie de hasard (ex. Memory) = pas de série 🔥 et ni gagné ni perdu** : `GAMES[x].luck` masque la série, les messages `answer` sont ignorés ; le jeu envoie en fin de partie `{type:"finish", game, n, diff, k}` → `onFinish` ajoute `P × n × difficulté` points (sans palier). Résultats : nombre de parties terminées, sans note ni verdict.
  - **bilan hebdomadaire** (`rollWeek`, au démarrage et toutes les 10 min) : versement `min(cap, étoiles / rate)` arrondi aux 10 c, **étoiles en trop reportées** (jamais perdues), historique, annonce à l'enfant (`#notice`) ;
  - temps de jeu (jeu ouvert + réponse dans les 90 s) pour le bilan.
  Difficultés : Calcul max ≤10 ×1 / ≤20 ×1,25 / ≤50 ×1,5 / >50 ×2 (+0,25 « un peu de tout ») ; Téléphone max ≤30 ×1 / ≤60 ×1,25 / 99 ×1,5 ; Code : **étoiles seulement en Difficile** (×2 ; ≤3 essais q1, 4-5 essais q.6, sinon échec), Facile et Moyen = entraînement (le jeu envoie `{type:"eco", on:false}` → l'accueil masque la série via `ecoOff`) ; Note Facile ×1 / Moyen ×1,5 (+0,25 clé de fa) ; Robot niv 1-3 ×1 / 4-8 ×1,5 / 9+ ×2 (réussi après échec q.5, chaque échec = erreur) ; Allemand ×1,25 si > 8 leçons cochées ; Français qui/que ×1, mots simples ×1,25. Morpion : pas d'étoiles.
  Affichage : barre des jeux `#eco` (⭐×difficulté, 🔥 série ×palier, jauge) ; accueil « ⭐ x / 20 aujourd'hui » + semaine / € estimés / étoiles gardées ; fiche profil : maximum €/semaine, objectif min/jour, 📊 Bilan (jour, semaine, 10 dernières semaines).
- **Premier écran à l'ouverture : « Qui joue ? »** (vue `v-profil`, route `#profil`, racine de l'historique) : une tuile par profil (initiale, prénom, étoiles) et « + Nouveau profil » (prénom seul, sans code). Choisir un profil ouvre l'accueil ; le bouton « 👤 Prénom » de l'accueil et le retour du téléphone y ramènent. Les liens profonds ne sont plus suivis au démarrage.
- Paramètres (protégés par le code) = menu thématique avec pages (pile `PG`, chaque page est une entrée d'historique) : 👤 Profils et récompenses (liste → fiche profil : prénom, utiliser, supprimer, système de récompense, étoiles en attente définir/remettre à 0, récompense définir/remettre à 0/ajouter/retirer, bilan ; plus de conversion manuelle) · 🔄 Progression (par profil, tableau `PROGRESS` : pour l'instant le petit robot, clés `robot_lvl@<id>`, `robot_best@<id>`) · 🔒 Code parent · 📱 Application.
- Code parent global (`rw_cfg.pin`) : 4 chiffres, SHA-256 (préfixe `tm:`), **par défaut 0000**. `window.hubGate(ok)` est exposé aux jeux.
- Migrations : ancienne cagnotte `rw`/`rw_cfg`/`hub_prenom` → premier profil `p1` ; ancienne cagnotte du Téléphone (`rw_mig`) ; `robot_lvl` → `robot_lvl@p1`.

## Âge, classe et bonus d'étoiles (dans `index.html`)
- Fiche profil → carte « 🎂 Âge et classe » : `p.birth` (stocké AAAA-MM-JJ ; saisi dans un champ texte **jj/mm/aaaa**, pavé numérique, « / » ajoutés tout seuls, enregistré quand la date est complète et valide — `birthIso` refuse 31/02, dates futures ou avant 1900 ; date incomplète ou impossible = message, l'ancienne date reste ; champ vidé puis quitté = date effacée) et `p.cls` (PS … Terminale ; vide = d'après l'âge : `classAuto` = année de la rentrée − année de naissance − 3, donc 6 ans dans l'année = CP). Adulte (`ageOf` ≥ 18) : la classe est masquée, pas de bonus.
- `AGEBONUS[jeu][classe]` multiplie la difficulté dans `onAnswer` (plafond ×3) et le chip ⭐× dès l'ouverture du jeu. Pour l'instant seulement **Conjugue être et avoir** : PS/MS/GS ×2, CP ×1,5, CE1 ×1,25, ensuite ×1.

## Temps par jour (dans `index.html`)
- Fiche profil → carte « 🌙 Temps par jour » : `p.daily = {on (défaut false), min (15/20/30/45/60/90, défaut 30), bonus:{d,sec}}`. Compte le temps actif dans les jeux (`today().sec`, même minuteur que le reste). `dayLeft`, `dayOver`.
- Accueil : « 🌙 encore N min aujourd'hui » (`#daytxt`). Pendant un jeu, chip `#ptime` « 🌙 m:ss » les 5 dernières minutes. À 0 : toast « termine ton jeu » ; écran `#dayover` « C'est fini pour aujourd'hui ! » à la **fin de manche** (`roundEnd`, envoyé maintenant par tous les jeux : fin de partie/liste/morceau, bonne réponse en Calcul, Dis le nombre, Chenille, appel du Téléphone…) ou après 5 min de grâce, puis retour au menu. Ensuite tous les jeux sont grisés « 🌙 fini pour aujourd'hui » ; toucher un jeu rouvre le message. « 🔑 Un parent peut ajouter 15 min » (code parent). Remise à zéro chaque jour. Prioritaire sur le chip du temps de jeu limité.

## Temps de jeu limité (dans `index.html`)
- Par profil `p.play = {on, ratio, games, bonus:{d,sec}}` (défaut : activé, 25 %, jeux limités `morpion`, `code`, `robot`). Compteurs du jour `econ.days[d].learn` / `.play` (secondes actives : jeu ouvert, visible, appui ou réponse dans les 60 s ; les appuis dans l'iframe sont écoutés via `setFrame`).
- Jeu autorisé = `learn × r / (1 − r)` + bonus parent − déjà joué (`playLeft`). Sous 30 s, les jeux limités sont grisés (`.locked`, `renderLocks`) avec « 🔒 apprends d'abord » ; sinon badge « ⏳ N min de jeu ». Toucher un jeu grisé → fenêtre `#lockinfo` (minutes d'apprentissage restantes, « 🔑 Un parent peut débloquer 15 min » via le code parent).
- Pendant un jeu limité : chip `#ptime` (décompte, orange < 1 min). À 0 : « Termine ta partie ! » ; écran `#timeup` à la fin de la manche (les jeux envoient `{type:"roundEnd"}` : manche du Morpion, fin du Code secret, niveau du Robot réussi) ou après 3 min de grâce.
- Fiche profil → carte « ⏳ Temps de jeu » : interrupteur, ratio 20/25/33/50 %, jeux limités (n'importe quel jeu). Le 📊 Bilan affiche apprentissage / jeux du jour.

## Résultats par exercice (dans `index.html`)
- Les jeux ajoutent à chaque message `answer` une catégorie `k` et une question `item` (Calcul : add/sub/comp + « 13 − 4 » ; Téléphone : dizaine + nombre ; Der·Die·Das : article + « die Tafel » ; Finde das Wort : leçon `L4` + mot ; qui/que : qui|que + phrase ; mots simples : mot ; Note : nom de la note ; Code : niveau (le Code envoie aussi ses parties Facile/Moyen, sans étoiles) ; Robot : tranche de niveaux).
- Stockage par profil `stats@<id>` = `{since, g:{jeu:{d:{jour:{ok,tot,sec,k:{cat:[ok,tot]}}}, it:{question:[ok,tot,dernier jour]}}}}` (clé de jeu = clé de `GAMES` ; 400 questions max ; temps compté par le minuteur d'activité ; supprimé avec le profil). `recordStat` est appelé avant `onAnswer`, même sans étoiles.
- Paramètres → 👤 Profils → fiche du profil → carte 📊 Bilan → « 📈 Résultats par exercice » (`renderResults`, profil = `EDIT`) : choix de la période (7 j / 30 j / depuis le début) ; « En bref » ; par jeu : verdict (≥ 90 % Très bien, ≥ 75 % Bien, ≥ 60 % À travailler, sinon Difficile ; « Peu de réponses » sous 10), réussite du premier coup, évolution par rapport à la période précédente, temps, 14 derniers jours en couleurs, réussite par catégorie, « À revoir » (6 questions les plus ratées sur la période).

## Navigation et bouton retour
Historique géré dans `index.html` (`go` = pushState, `back` = history.back si possible, sinon parent). Le bouton retour du téléphone (popstate) = bouton « ← » de l'appli : ferme d'abord une fenêtre du hub (pile `OV` : `settings`, `pin`), puis demande au jeu via `window.hubBack()` (renvoie true s'il a fermé sa propre fenêtre : réglages Calcul/Téléphone, choix du niveau code/robot), sinon remonte d'un niveau. Au lancement, l'historique repart de « Qui joue ? » (d=0).

## Sauvegarde
Paramètres → 💾 Sauvegarde : « Sauvegarder dans un fichier » télécharge `mes-jeux-ecole-sauvegarde-AAAA-MM-JJ.json` = `{app:"mes-jeux-ecole", date, data:{tout le localStorage}}` ; « Restaurer » relit ce fichier (vérifie `app`, confirmation avec les prénoms), vide le localStorage, réécrit les clés puis recharge. `bk_last` = date de la dernière sauvegarde. Au démarrage, `navigator.storage.persist()` est demandé pour éviter l'effacement automatique. Une appli web ne peut pas écrire seule dans les fichiers du téléphone : la sauvegarde est toujours à la demande.

## Appli Android native (Capacitor)
- Projet dans `android-natif/` (Capacitor 8, `server.url` = le site GitHub Pages : les jeux se mettent à jour sans nouvel APK). Paquet `io.github.fapic67.jeuxecole`, version 2.1.0 (versionCode 3), signé avec la même clé que l'ancien APK TWA (clé privée NON versionnée).
- Plugins : `@capacitor/filesystem`, `@capacitor/app`, `@capacitor-community/text-to-speech`, `@capacitor-community/speech-recognition` (7.0.1, depuis la version **2.1.0, versionCode 3** ; autorisation RECORD_AUDIO). Pour compiler hors ligne, dans `node_modules/@capacitor-community/speech-recognition/android/build.gradle` remplacer `gradle:8.7.2` par `gradle:8.13.0` (même version que l'appli, déjà en cache).
- Micro : `window.hubListen(lang, {onSpeech})` (Promise des phrases entendues ; natif = plugin, navigateur = SpeechRecognition de Chrome), `hubListenStop()`, `hubListenOK()` (`ok` / `old-apk` / `none`). Dans `index.html`, bloc « Appli Android » actif seulement si `Capacitor.isNativePlatform()` :
  - remplace `speechSynthesis`/`SpeechSynthesisUtterance` par la synthèse d'Android (`window.NATIVE_TTS`, injecté aussi dans chaque jeu via le script de démarrage de l'iframe) ;
  - sauvegarde automatique `Documents/MesJeuxEcole/config.json` (toutes les clés sauf `bk_*`), réécrite à chaque changement (toutes les 10 s, à la mise en arrière-plan, après chaque `saveP`) ; si `profiles` est absent au démarrage, relit ce fichier, restaure et recharge (toast « Profils restaurés ») ;
  - bouton retour Android = `back()`, quitte l'appli depuis « Qui joue ? » ;
  - « Sauvegarder dans un fichier » écrit `Documents/MesJeuxEcole/sauvegarde-AAAA-MM-JJ.json`.
- Compiler : voir `android-natif/README.md`.
- APK publié (public, à la demande de l'utilisateur) : `telechargement/mes-jeux-ecole.apk` → https://fapic67.github.io/mes-jeux-ecole/telechargement/mes-jeux-ecole.apk (exception dans `.gitignore`). À remplacer à chaque nouvelle version de l'APK.

## Mise à jour
Paramètres → carte « Application » : affiche la version en cache (`jeux-ecole-vXX`) et un bouton « Mettre à jour maintenant » qui vérifie la connexion (fetch `sw.js` no-store), supprime les caches, désinscrit le service worker puis recharge. Le localStorage (étoiles, réglages) est conservé.

## Design system tactile
Cibles >= 56px, bordures 3px, textes secondaires >= 16px, menus centrés verticalement (`.mid`). En-tête des matières et des jeux : bouton retour à gauche (gros chevron SVG `.chev` centré dans `.icon-btn`) puis le titre (`.ttl`).

### Français (`francais.html`)
- **Complète la phrase** (qui / que) : 32 phrases (`QQ`, mot manquant entre `{}`), 15 par partie. L'enfant tape « qui » ou « que » avec le clavier virtuel maison (`jeux/clavier.js` : AZERTY minuscules + ligne é è ê à ç (option `acc`, `space` pour une barre d'espace), ⌫ et ✓, clic sonore, pas de voix ; clavier physique accepté ; le clavier Android ne s'ouvre jamais) ; la voix lit la phrase entière (mot compris) à l'affichage et après la bonne réponse. Le titre affiche « Complète la phrase : qui ou que ? » (barre du jeu : « Qui ou que ? »), à la demande de l'utilisateur ; sinon aucun indice : pas de placeholder, pas de réponse donnée après une erreur. Après 2 erreurs, la phrase est relue. Hash `#quique` (START=3).
- **Complète la phrase** (mots simples) : même mécanique, 50 phrases (`MOTS`) portant chacune sur un mot différent qui s'écrit comme il se prononce (pas de lettre finale muette, pas de « eau/ph », pas de double consonne). 15 par partie. Hash `#phrase` (START=4).

- **Conjugue être et avoir** (hash `#conj`, START=5, jeu `conj`) : choix du verbe (être, avoir, être et avoir = les deux tableaux à la suite, ×1,25) ; tableau du présent avec les pronoms en colonne (je/j', tu, il, elle, nous, vous, ils, elles), l'enfant écrit le verbe ligne par ligne avec le clavier maison ; juste → vert et la voix lit « tu es » ; faux → rouge, on recommence, la voix lit la forme après 2 erreurs. Fin : score « x / 6 du premier coup », Encore / Autre verbe. Résultats : catégorie = verbe, item = « tu es ». `hubBack` ramène au choix du verbe.

### Mathématiques
1. **Calcul malin** : additions, soustractions et compléments, avec un résultat maximum réglable. Partie sans fin (plus de condition de fin ni de compteur propre).
   L'opération est **énoncée en allemand** ; quand la réponse est juste, l'opération complète est relue avec le résultat. Bonne réponse : le check se secoue, devient vert et un son de victoire part. Mauvaise réponse : croix rouge.
   Toutes les 6 à 8 étoiles, un personnage traverse l'écran en riant (15 personnages SVG, trajets variés).
2. **Le téléphone magique** : une voix française dicte un numéro de 5 nombres de 10 à 99, un nombre à la fois. L'enfant compose chaque nombre ; le nombre suivant n'est dicté que quand elle a juste. En cas d'erreur, l'appli dit « Recommence ».
   Quand le numéro est complet, la voix dit « Appuie sur téléphoner ». Bon numéro : ça sonne, puis « Allô ? Bravo » ; mauvais numéro : tonalité occupé.
   La cagnotte gagne 10 € par victoire, et un ticket coûte 100 €. Toutes les 10 victoires, l'appli dit « Bravo + prénom ».
   Réglages : nombre maximum, plage favorisée avec un pourcentage, utilisation des tickets. Ils sont protégés par le verrou du téléphone (WebAuthn), ou à défaut par un PIN parent.

3. **Dis le nombre** (`nombre.html`, hash `#nombre`, français uniquement) : un nombre s'affiche et **le micro s'ouvre tout seul** ; l'enfant le dit. Icône 🎤 : bleue avec anneau = écoute (`.wait`), rouge qui pulse = la personne parle (`.talk`, via `onSpeech` : événements `listeningState` du plugin natif ou `onspeechstart/onspeechend` de Chrome, pas besoin de nouvel APK), grise = pause (`.off`) après 2 silences de suite → toucher 🎤 pour reprendre. Relance automatique après une erreur ; micro coupé pendant les réglages, l'aide A/B/C, en arrière-plan et en quittant le jeu (`hubListenStop` dans `show`). Reconnaissance via `parent.hubListen("fr-FR")` (5 propositions) ; `parseFr` lit chiffres ou mots (soixante-dix-sept, quatre-vingt-onze, septante…, quelques homophones : cent/sans, sept/cette…). Juste → vert, le nombre est relu, suivant. Autre nombre entendu → « J'ai entendu « 94 » » = erreur ; rien de compris → pas d'erreur. Après 3 essais ratés : 3 boutons 🔊 A/B/C à écouter, on choisit celui écrit. Réglage ⚙️ maximum 10 / 20 / 69 / 100 (`nb_max@<profil>`, ×1 / ×1 / ×1,25 / ×1,5). Résultats : dizaine + nombre. Si le micro manque (`hubListenOK()` = `old-apk` ou `none`) : message expliquant d'installer l'APK 2.1.

### Allemand (vocabulaire commun : `jeux/allemand-mots.js`)
- Rangé comme le manuel de CP « Die Rappelkiste » : `DE_MODULES` (périodes 1-5, modules 1a…12, leçons 1-32), `DE_LETTERS` (lettre de chaque leçon), `DE_RAW` = `leçon|article|mot|image`. Leçons 1-14 : mots des encadrés de vocabulaire du livre (photos envoyées par l'utilisateur) ; leçons 15-32 : seulement les mots référents du sommaire, à compléter quand l'utilisateur enverra les pages. Ne reprendre que les mots, jamais les images ni les textes du livre.
- Paramètres → 🎮 Réglages des jeux → Der · Die · Das / Finde das Wort : leçons cochées **par jeu et par profil** (clés `de_sel_dde@<profil>`, `de_sel_fdw@<profil>`, défaut `DE_DEFAULT` = leçons 1-10). Les jeux ne tirent que les mots des leçons cochées (message s'il y en a moins de 3).
- Pas de doublon d'emoji entre mots (sinon deux réponses auraient la même image).
- `DE_SVG` (dans `allemand-mots.js`) : dessins maison partagés par **tous** les jeux d'allemand quand un emoji ne suffit pas (taille 1,3em, comme un emoji) ; utilisé si le champ image de `DE_RAW` est vide. Pour l'instant : **Obst = corbeille de fruits** (banane, raisin, pomme, orange), à la demande de l'utilisateur (une fraise ne voulait pas dire « les fruits »).
3. **Der · Die · Das** : le mot s'affiche et est prononcé ; l'enfant choisit l'article. Bonne réponse : l'appli dit article + mot. Partie de 20 mots, note sur 10, bouton « Nochmal ».
4. **Finde das Wort** : une image (emoji) et 3 pills **avec l'article** (« der Bleistift ») ; le mot trouvé est prononcé.
   Les mots sans emoji utilisent des dessins SVG faits main (objet `PIC` dans `deutsch.html`) : Gans, Schulhof, Tisch, Klasse, Radiergummi, Tafel, Mäppchen, Reihe, Spitzer ; Musik = 🎶.
   Ne pas reprendre les illustrations du manuel « Die Rappelkiste » (droits d'auteur).
5. **Schreib das Wort** (`deutsch.html`, START=3, hash `#schreib`, jeu `sdw`) : une image (emoji ou dessin `PIC`), l'enfant écrit le mot **avec l'article pour les noms** (« der Apfel ») au clavier maison en version allemande (`Clavier({acc:"äöüß", space:true})` : ä ö ü ß + barre d'espace). **Un trait par lettre** et un espace visible entre l'article et le mot (trait en cours qui clignote, taille adaptée à la longueur, une seule ligne) ; on ne peut pas taper plus de lettres que de traits ; l'espace se place tout seul au trou (⌫ l'enlève avec la lettre). Comparaison sans tenir compte des majuscules ; à l'affichage, le nom prend sa majuscule automatiquement. Erreur : texte effacé, message ciblé (« n'oublie pas l'article », « le mot est juste, mais pas l'article », « bon article, vérifie le mot ») ; après 2 erreurs la voix dit le mot, après 3 « Recopie : … ». 10 mots par partie, note sur 10. Leçons cochées `de_sel_sdw@<profil>`. Résultats : leçon + mot.

### Logique (`code.html`)
- **Le code secret** : jeu de déduction (principe « bulls and cows ») avec des chiffres (Facile 1-4, Moyen 1-5, Difficile 0-9). Ne pas l'appeler ni le styliser comme le jeu de société de marque.
  Niveaux (clé `code_lvl`) : Facile 3 parmi 4, Moyen 4 parmi 5 (sans répétition, chiffres déjà posés grisés), Difficile 4 chiffres de 0 à 9 avec répétitions. Page entière défilable au doigt ; ⌫/✓ juste sous la ligne en cours, puis message, puis pavé de chiffres.
  8 essais max. Retour par essai, un point aligné sous chaque chiffre (positionnel) : vert = bonne place, jaune = présent ailleurs, vide = absent ; les répétitions sont comptées correctement. Étoiles uniquement en Difficile.

- **Le petit robot** (`robot.html`) : grille avec 🤖, ⭐ et rochers 🪨 ; l'enfant aligne des flèches absolues (← ↑ ↓ →, 24 max) puis ▶ ; le robot exécute pas à pas (flèche en cours surlignée, trace). Cogne un rocher / sort de la grille / n'arrive pas sur l'étoile → retour au départ, programme conservé. Arriver sur l'étoile = réussi (même s'il reste des flèches).
  Niveaux générés au hasard mais toujours faisables (BFS) : 4×4 sans rocher (niv. 1-2), 5×5 (niv. 4-8), 6×6 ensuite ; longueur du plus court chemin croissante. Clés `robot_lvl@<profil>`, `robot_best@<profil>` ; choix parmi les niveaux déjà atteints. +2 ⭐ du premier coup, sinon +1 ⭐.

- **Le robot qui répète** (`robot.html`, START=2, hash `#boucles`, clés `boucles_lvl@`/`boucles_best@`) : boutons ×2 ×3 ×4 qui s'appliquent à la dernière brique (re-toucher = ×1) ; nombre de briques limité (`maxB` = minimum de briques calculé par BFS, +1 jusqu'au niveau 3) et chemin le plus court ≥ maxB + 2 pour obliger à répéter. Grilles 5×5 (niv. 1-2), 6×6 (3-6), 7×7 ensuite.
- **Le robot réparateur** (START=3, hash `#reparateur`, clés `reparateur_lvl@`…) : le programme le plus court est donné avec 1 flèche fausse (2 à partir du niveau 7) ; l'enfant lance ▶ pour voir l'erreur (sans pénalité tant que le programme n'a pas été modifié), touche la flèche fausse puis la bonne. Pas d'ajout ni d'effacement.
  Dans `robot.html`, le programme est une liste de briques `{d, n}` ; `MODE` = robot / boucles / reparateur (= nom envoyé dans `answer`).
- **La chenille des couleurs** (`chenille.html`, hash `#chenille`, clés `chenille_lvl@`/`chenille_best@`) : suites de perles (couleurs puis formes) dont il faut trouver la perle suivante parmi 3-4. 8 niveaux : AB ; AAB/ABB ; ABC ; motifs de 4 ; formes et couleurs ; perle cachée au milieu ; deux règles (couleur et forme à périodes différentes) ; deux perles cachées. 5 réussites du premier coup = niveau suivant ; choix parmi les niveaux atteints. 🎨 « Invente ton motif » (2 à 4 perles, la chenille le répète, sans étoiles). Difficulté ×1 / ×1,25 / ×1,5 / ×2.
- Ces 3 jeux ne sont pas dans les jeux limités par défaut (réglable dans la fiche profil).

### Mémoire (couleur `--me`)
- **Memory** (`memory.html`, hash `#memory`) : cartes à retourner par deux. Réglage dans le jeu (bouton Niveau) : cartes « Images » (paires identiques) ou « Image ↔ mot allemand » (par défaut : emoji ↔ « der Apfel », mot prononcé en allemand ; mots avec image des leçons cochées `de_sel_mem@<profil>`, complétés par les leçons 1-14) ; clé `memory_mode@`. 5 niveaux : 3, 4, 6, 8, 10 paires (`memory_lvl@`, `memory_best@`). Jeu de hasard (`luck`) : **pas de série 🔥, ni erreur ni victoire** (deux cartes différentes se retournent simplement) ; étoiles à la fin de la partie = nombre de paires × difficulté, quel que soit le nombre de coups. Difficulté ×1 (3-4 paires) / ×1,25 / ×1,5 / ×2 (+0,25 en allemand).
- **Die Einkaufsliste** (`courses.html`, hash `#courses`) : la voix allemande dit « Ich kaufe einen Apfel, ein Brot und eine Kerze. » (accusatif einen/eine/ein) ; l'enfant met les objets dans le panier 🧺 (re-toucher = retirer), vérification automatique quand le panier est plein, puis solution affichée. Objets = noms de `DE_BUY` (dans `allemand-mots.js`) des leçons cochées `de_sel_courses@<profil>` (complétés si trop peu). 8 niveaux : 2/6, 3/6, 3/9, 4/9, 3/9 dans l'ordre, 4/9 dans l'ordre, 5/12, 5/12 dans l'ordre ; 3 listes réussies d'affilée = niveau suivant (`courses_lvl@`, `courses_best@`). Une réponse par liste (q .7 si réécoutée), item = mots oubliés.
- Paramètres → 🎮 Réglages des jeux : leçons cochées aussi pour Memory et Die Einkaufsliste.

### Musique (`musique.html`)
- **Trouve la note** : portée en clé de sol (SVG dessiné à la main), une note à la fois (fenêtre de 6 notes, notes trouvées en vert avec leur nom). L'enfant choisit parmi 7 pastilles do ré mi fa sol la si ; bonne réponse → la note est jouée (synthé façon piano WebAudio) ; mauvaise → pastille barrée.
  Les notes forment un « morceau mystère » ; à la fin : titre révélé (affiché seulement, pas de voix), morceau joué en entier avec la note en cours surlignée, boutons Réécouter / Morceau suivant (« Réécouter » désactivé, libellé « 🎵 Écoute… », tant que le morceau joue).
  Airs du domaine public uniquement (`SONGS`, 15 morceaux, de sol3 à sol5) : Au clair de la lune, Frère Jacques, Ah ! vous dirai-je maman, Joyeux anniversaire, Ode à la joie, Alle meine Entchen, Hänschen klein, Marie avait un petit agneau, Vive le vent, Dans la ferme de Mathurin, Le pont de Londres, Rame rame rameurs, Oh when the saints, La gamme, Mon beau sapin. N'ajouter que des mélodies dont on est sûr. Ordre aléatoire mémorisé (`mus_order`, `mus_i`). Difficulté (réglage ⚙️, clé `mus_niv`) : Facile = début de l'air (`n`), Moyen = air complet (`m`, 25 à 44 notes, descend jusqu'à sol3). Étoiles : Facile +5 sans erreur / +3 ; Moyen +8 / +5.
  Réglages ⚙️ dans le jeu : clé principale (clé `mus_cle` = `sol` par défaut ou `fa`). En clé de fa, les airs sont transposés d'une octave plus bas (do3 à ré4, affichage et son) ; `pos(n)` est relatif à la ligne du bas de la clé active (mi4 en sol, sol2 en fa). `window.hubBack` ferme les réglages.

### Jeux (`morpion.html`)
- **Règle : aucune étoile pour toute la matière Jeux** (`noStars()` dans `index.html` ignore les réponses et masque `#pstars`/`#eco` quand `subj === "jeux"`).
- **Morpion** : 3×3, deux joueurs sur le même appareil (✕ rouge / ◯ bleu), uniquement à deux. **Aucune étoile.** Le premier joueur alterne à chaque manche ; score de la séance (✕, ◯, égalités) non sauvegardé ; ligne gagnante surlignée, bouton « Rejouer ».

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
