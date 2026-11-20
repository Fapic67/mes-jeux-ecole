// Vocabulaire allemand rangé comme le manuel de CP « Die Rappelkiste » : périodes → modules → leçons (une lettre).
// Seuls les mots des encadrés de vocabulaire sont repris (pas les images ni les textes du livre).
// Leçons 1 à 32 : mots des encadrés de vocabulaire (photos des pages envoyées par l'utilisateur).
// Mots déjà vus dans une leçon précédente (lesen, Regen, schwarz, Mäppchen, lachen) : pas répétés.
// Images : emoji, ou dessin maison (PIC dans deutsch.html) quand le champ est vide.
var DE_MODULES=[
 {p:1,m:"1a",t:"Die Einschulung",f:"La rentrée des classes",l:[1,2]},
 {p:1,m:"1b",t:"Das Pausenbrot",f:"Le goûter",l:[3,4,5]},
 {p:1,m:"2",t:"Der Schultag",f:"La journée de classe",l:[6,7,8]},
 {p:2,m:"3",t:"Der Laternenumzug",f:"Le défilé aux lanternes",l:[9,10]},
 {p:2,m:"4",t:"Der Nikolaustag",f:"La Saint-Nicolas",l:[11,12]},
 {p:2,m:"5",t:"Plätzchen backen",f:"Confectionner des gâteaux",l:[13,14]},
 {p:3,m:"6",t:"Die Freundschaft",f:"L'amitié",l:[15,16,17]},
 {p:3,m:"7",t:"Der Karneval",f:"Le carnaval",l:[18,19]},
 {p:4,m:"8",t:"Eier suchen",f:"La chasse aux œufs",l:[20,21,22]},
 {p:4,m:"9",t:"Auf dem Bauernhof",f:"À la ferme",l:[23,24]},
 {p:5,m:"10",t:"Die Walpurgisnacht",f:"La nuit des sorcières",l:[25,26,27]},
 {p:5,m:"11",t:"Die Partnerklasse",f:"Les correspondants",l:[28,29,30]},
 {p:5,m:"12",t:"Die Bundesjugendspiele",f:"La rencontre sportive",l:[31,32]},
 // Annexes de fin de livre (pt = titre affiché à la place de « Période ») : cartes des lettres non vues dans les leçons, puis « Vers le CE1 »
 {p:6,pt:"📚 Fin du livre",m:"cartes",t:"Cartes des lettres",f:"Cartes de fin de livre",l:[33]},
 {p:6,pt:"📚 Fin du livre",m:"ce1",t:"Vers le CE1",f:"Pour préparer le CE1",l:[34]},
 // Dictionnaire hors manuel (mots ajoutés à la demande) : leçon 100, cochée d'office dans tous les jeux
 {p:0,m:"dico",t:"Dictionnaire",f:"Mots en plus, hors manuel",l:[100]}
];
var DE_DICT=100;
// Lettre(s) travaillée(s) dans chaque leçon
var DE_LETTERS={1:"A",2:"I",3:"O",4:"L",5:"R",6:"S",7:"U",8:"M",9:"T",10:"N",11:"W",12:"K",13:"P",14:"B",15:"D & E",16:"V & Ö",17:"H",18:"-ER",19:"SCH",20:"EI & Z",21:"Ä & Ü",22:"-CH & IE",23:"voyelle longue + h",24:"-CH & AU",25:"ATT, ESS, IMM…",26:"X, CHS, KS, CKS",27:"SP & ST",28:"S",29:"EU",30:"J",31:"consonne finale dure",32:"ß",33:"F, -E, V, G",34:"QU, -ER, ÖFF, -TZ, -CK, -NG, -NK, -IG, ÄU, Y",100:"Mots en plus"};
// leçon|article|mot|image
var DE_RAW=[
 "1|der|Apfel|🍎","1|die|Tafel|","1|der|Schulranzen|🎒","1|die|Klasse|","1|der|Radiergummi|","1||arbeiten|📝",
 "2|die|Idee|💡","2|der|Tisch|","2|der|Spitzer|","2|der|Bleistift|✏️","2||richtig|✅","2||singen|🎤",
 "3|das|Obst|","3|der|Schulhof|","3|das|Brot|🍞","3||rot|🔴","3|der|Orangensaft|🧃","3|das|Ohr|👂",
 "4|das|Lineal|📏","4||lesen|📖","4||lachen|😂","4|der|Ball|⚽","4|das|Lied|🎵","4||lila|🟣",
 "5|der|Regen|🌧️","5||rutschen|🛝","5|die|Reihe|","5||braun|🟤","5||riechen|👃💐","5|der|Freund|👦","5|die|Freundin|👧",
 "6|das|Gras|🌱","6||basteln|✂️","6||raus|🚪🏃","6|die|Kiste|📦","6|der|Bus|🚌","6|der|Kürbis|🎃",
 "7|die|Blume|🌸","7|die|Uhr|🕐","7||suchen|🔍","7||pusten|🌬️","7|die|Schule|🏫","7||gut|👍",
 "8|die|Maus|🐭","8||malen|🎨","8|die|Musik|🎶","8|die|Ampel|🚦","8|das|Mäppchen|","8||schwimmen|🏊",
 "9|die|Traube|🍇","9|die|Laterne|🏮","9||leuchten|🔦","9||teilen|","9||falten|📄","9||bunt|🌈",
 "10|die|Nase|👃","10|die|Gans|","10|der|Mantel|🧥","10|der|Nebel|🌫️","10||brennen|🔥","10||neun|9️⃣",
 "11|der|Wald|🌲","11||weiß|⚪","11||warm|🌡️","11||wünschen|🎁","11|der|Winter|❄️","11||schwarz|⚫",
 "12|die|Kerze|🕯️","12|der|Korb|🧺","12||kalt|🥶","12|der|Keks|🍪","12|das|Kind|🧒","12||trinken|🥤",
 "13|die|Puppe|🪆","13|der|Pinsel|🖌️","13|das|Rezept|📃","13||klopfen|✊🚪","13|das|Spritzgebäck|","13|die|Aprikose|🍑",
 "14|der|Baum|🌳","14|der|Tannenbaum|🎄","14|die|Butter|🧈","14|die|Gabel|🍴","14||backen|🧑‍🍳","14||blau|🔵",
 "15|die|Dose|🥫","15|der|Durst|","15||denken|🤔","15||dunkel|🌑","15||kneten|","15|der|Kleber|",
 "16|der|Vogel|🐦","16|die|Vögel|🐦🐦","16|das|Viereck|🟧","16||voll|🔋","16||viel|","16|die|Flöte|","16||größer|📈","16||böse|😠",
 "17|das|Haus|🏠","17|die|Hand|✋","17|der|Hamster|🐹","17||hell|🔆","17||helfen|","17||hören|🎧",
 "18|die|Kinder|👧👦","18|die|Kleider|👗","18|der|Bäcker|🥨","18|der|Jäger|","18|der|Maler|🧑‍🎨","18||hinter|","18||unter|","18||über|",
 "19|der|Schüler|","19|die|Schülerin|","19|der|Schatz|💰","19|der|Schnee|🌨️","19|der|Schornsteinfeger|","19||waschen|🧼",
 "20|das|Ei|🥚","20||zwei|2️⃣","20|die|Zeitung|📰","20|der|Schwanz|","20||tanzen|💃","20||weich|🧸","20|die|Pfeife|","20||klein|🤏",
 "21|das|Küken|🐤","21|die|Hände|🙌","21|das|Mädchen|","21||brüten|","21|das|Häslein|🐇","21|die|Füße|👣","21||füttern|",
 "22||ich|","22||sieben|7️⃣","22||rechts|➡️","22|die|Biene|🐝","22|die|Milch|🥛","22||durch|","22|die|Ziege|🐐","22||fliegen|✈️",
 "23|die|Bohne|🫘","23|der|Zeh|","23||blühen|🌼","23||froh|😊","23||säen|","23|die|Möhre|🥕","23|die|Kuh|🐄","23|der|Hahn|🐓",
 "24|das|Buch|📕","24|das|Auge|👁️","24||laut|📢","24|die|Mauer|🧱","24|das|Unkraut|🌿","24||brauchen|","24|der|Bach|🏞️",
 "25|der|Kessel|","25|der|Koffer|🧳","25||flattern|🦇","25|der|Himmel|☁️","25|der|Brunnen|⛲","25||schnell|🏃","25||sonnig|🌞","25||fallen|🍂",
 "26|die|Hexe|🧙‍♀️","26||sechs|6️⃣","26||links|⬅️","26|der|Klecks|","26||mixen|","26|die|Wachsmalkreide|🖍️","26||piksen|","26|der|Knicks|",
 "27|die|Spinne|🕷️","27||stampfen|","27|die|Spitze|🏔️","27||springen|🤸","27|der|Stamm|🪵","27|der|Stiel|","27||verstecken|🙈","27|der|Streifen|",
 "28|der|Besen|🧹","28|der|Friseur|💈","28|die|Friseurin|💇‍♀️","28||riesig|","28|die|Pause|⏸️","28||sauber|✨","28|die|Wiese|🌾",
 "29|die|Fahne|🇩🇪","29||Europa|🇪🇺","29|die|Kreuzung|","29||beugen|","29|die|Häuser|🏘️","29|die|Bäume|🌳🌳",
 "30|die|Jacke|","30||jubeln|🥳","30|das|Kajak|🛶","30|der|Junge|","30|das|Jahr|📅","30||jung|👶",
 "31||gelb|🟡","31|der|Mond|🌙","31|der|Weg|🛤️","31|der|Preis|🏆","31|der|Dieb|🦹","31|der|Sand|🏖️","31|der|Berg|⛰️","31|das|Glas|🍷",
 "32|der|Fuß|🦶","32|die|Süßigkeit|🍬","32||reißen|","32|der|Strauß|💐","32|das|Maßband|","32||gießen|🪴",
 "33|die|Feder|🪶","33|die|Tasse|☕","33|die|Vase|🏺","33|die|Giraffe|🦒",
 "34|das|Pferd|🐴","34|die|Qualle|","34||öffnen|🔓","34||zwölf|1️⃣2️⃣","34|die|Katze|🐱","34|das|Dreieck|🔺","34||angeln|🎣","34|der|Anker|⚓","34||wenig|","34|die|Mäuse|🐭🐭","34|die|Pyramide|",
 // --- Dictionnaire hors manuel ---
 "100|die|Klementine|",
 // « Lerne neue Wörter » : vocabulaire de base d'un enfant de 6 ans (hors manuel), seulement pour l'exercice d'apprentissage
 // Familie
 "100|die|Mama|👩",
 "100|der|Papa|👨",
 "100|die|Oma|👵",
 "100|der|Opa|👴",
 "100|die|Familie|👨‍👩‍👧",
 "100|das|Baby|",
 "100|der|Bruder|",
 "100|die|Schwester|",
 "100|die|Mutter|",
 "100|der|Vater|",
 // Körper
 "100|der|Kopf|",
 "100|der|Mund|👄",
 "100|der|Zahn|🦷",
 "100|das|Bein|🦵",
 "100|der|Arm|",
 "100|der|Bauch|",
 "100|die|Haare|",
 "100|der|Finger|☝️",
 "100|das|Knie|",
 "100|der|Rücken|",
 "100|das|Herz|❤️",
 "100|das|Gesicht|",
 // Tiere
 "100|der|Hund|🐕",
 "100|der|Fisch|🐟",
 "100|das|Schwein|🐖",
 "100|das|Schaf|🐑",
 "100|die|Ente|🦆",
 "100|der|Löwe|🦁",
 "100|der|Elefant|🐘",
 "100|der|Affe|🐒",
 "100|der|Bär|🐻",
 "100|die|Schlange|🐍",
 "100|der|Frosch|🐸",
 "100|der|Schmetterling|🦋",
 "100|die|Schnecke|🐌",
 "100|der|Tiger|🐅",
 "100|das|Zebra|🦓",
 "100|das|Krokodil|🐊",
 "100|die|Eule|🦉",
 "100|der|Igel|🦔",
 "100|der|Fuchs|🦊",
 "100|der|Wolf|🐺",
 "100|das|Huhn|🐔",
 "100|das|Kamel|🐪",
 "100|das|Känguru|🦘",
 "100|der|Panda|🐼",
 "100|das|Eichhörnchen|🐿️",
 "100|der|Marienkäfer|🐞",
 "100|die|Ameise|🐜",
 "100|der|Papagei|🦜",
 "100|der|Dinosaurier|🦕",
 "100|das|Einhorn|🦄",
 "100|der|Esel|",
 // Essen
 "100|die|Banane|🍌",
 "100|die|Birne|🍐",
 "100|die|Erdbeere|🍓",
 "100|die|Kirsche|🍒",
 "100|die|Zitrone|🍋",
 "100|die|Tomate|🍅",
 "100|die|Kartoffel|🥔",
 "100|der|Käse|🧀",
 "100|die|Wurst|",
 "100|der|Kuchen|🍰",
 "100|das|Eis|🍦",
 "100|das|Wasser|💧",
 "100|der|Tee|🍵",
 "100|die|Schokolade|🍫",
 "100|der|Honig|🍯",
 "100|die|Nudeln|🍝",
 "100|die|Pizza|🍕",
 "100|die|Suppe|🍲",
 "100|der|Salat|🥗",
 "100|die|Ananas|🍍",
 "100|die|Melone|🍉",
 "100|der|Pilz|🍄",
 "100|die|Gurke|🥒",
 "100|die|Zwiebel|🧅",
 "100|der|Mais|🌽",
 "100|die|Brezel|",
 "100|der|Pfannkuchen|🥞",
 "100|die|Pommes|🍟",
 "100|die|Kokosnuss|🥥",
 "100|die|Kiwi|🥝",
 "100|der|Brokkoli|🥦",
 "100|das|Salz|🧂",
 "100|das|Brötchen|",
 "100|der|Saft|",
 "100|der|Zucker|",
 "100|der|Joghurt|",
 // Kleidung
 "100|die|Hose|👖",
 "100|das|T-Shirt|👕",
 "100|der|Schuh|👟",
 "100|der|Stiefel|👢",
 "100|die|Mütze|🧢",
 "100|der|Hut|👒",
 "100|die|Socke|🧦",
 "100|der|Schal|🧣",
 "100|der|Handschuh|🧤",
 "100|die|Brille|👓",
 "100|die|Krone|👑",
 "100|der|Ring|💍",
 "100|der|Pullover|",
 "100|der|Rock|",
 "100|das|Kleid|",
 "100|der|Rucksack|",
 // Haus
 "100|die|Tür|🚪",
 "100|das|Fenster|🪟",
 "100|das|Bett|🛏️",
 "100|der|Stuhl|🪑",
 "100|das|Sofa|🛋️",
 "100|die|Toilette|🚽",
 "100|die|Badewanne|🛁",
 "100|die|Dusche|🚿",
 "100|der|Schlüssel|🔑",
 "100|das|Telefon|☎️",
 "100|das|Handy|📱",
 "100|der|Fernseher|📺",
 "100|der|Computer|💻",
 "100|der|Löffel|🥄",
 "100|das|Messer|🔪",
 "100|der|Spiegel|🪞",
 "100|die|Zahnbürste|🪥",
 "100|der|Wecker|⏰",
 "100|das|Bild|🖼️",
 "100|die|Lampe|",
 "100|der|Teller|",
 "100|der|Topf|",
 "100|die|Seife|",
 "100|das|Zimmer|",
 "100|die|Küche|",
 "100|der|Garten|",
 "100|die|Treppe|",
 "100|das|Kissen|",
 // Spielen und Feste
 "100|das|Geschenk|🎁",
 "100|der|Luftballon|🎈",
 "100|der|Würfel|🎲",
 "100|das|Puzzle|🧩",
 "100|der|Drachen|🪁",
 "100|der|Roboter|🤖",
 "100|der|Geburtstag|🎂",
 "100|der|Weihnachtsmann|🎅",
 "100|das|Gespenst|👻",
 "100|der|Teddybär|",
 "100|das|Spiel|",
 "100|die|Schaukel|",
 // Fahrzeuge
 "100|das|Auto|🚗",
 "100|das|Fahrrad|🚲",
 "100|der|Zug|🚂",
 "100|das|Flugzeug|✈️",
 "100|das|Schiff|🚢",
 "100|das|Boot|⛵",
 "100|die|Rakete|🚀",
 "100|der|Traktor|🚜",
 "100|das|Motorrad|🏍️",
 "100|der|Hubschrauber|🚁",
 "100|das|Polizeiauto|🚓",
 "100|das|Feuerwehrauto|🚒",
 "100|der|Krankenwagen|🚑",
 "100|der|Roller|🛴",
 "100|das|Taxi|🚕",
 // Natur
 "100|die|Sonne|☀️",
 "100|der|Stern|⭐",
 "100|der|Blitz|⚡",
 "100|das|Meer|🌊",
 "100|die|Insel|🏝️",
 "100|der|Stein|🪨",
 "100|das|Blatt|🍁",
 "100|der|Vulkan|🌋",
 "100|der|Kaktus|🌵",
 "100|die|Rose|🌹",
 "100|die|Sonnenblume|🌻",
 "100|die|Tulpe|🌷",
 "100|das|Kleeblatt|🍀",
 "100|die|Erde|🌍",
 "100|die|Wolke|",
 "100|der|Regenbogen|",
 "100|der|Wind|",
 "100|der|Fluss|",
 "100|der|Frühling|",
 "100|der|Sommer|",
 "100|der|Herbst|",
 // Berufe
 "100|der|Lehrer|👨‍🏫",
 "100|die|Lehrerin|👩‍🏫",
 "100|der|Arzt|👨‍⚕️",
 "100|die|Ärztin|👩‍⚕️",
 "100|der|Polizist|👮",
 "100|der|Koch|👨‍🍳",
 "100|der|Feuerwehrmann|🧑‍🚒",
 "100|der|Bauer|🧑‍🌾",
 "100|der|König|🤴",
 "100|die|Prinzessin|👸",
 "100|der|Pirat|",
 // Zahlen und Farben
 "100||null|0️⃣",
 "100||eins|1️⃣",
 "100||drei|3️⃣",
 "100||vier|4️⃣",
 "100||fünf|5️⃣",
 "100||acht|8️⃣",
 "100||zehn|🔟",
 "100||grün|🟢",
 "100||orange|🟠",
 "100||rosa|",
 "100||grau|",
 // Verben
 "100||essen|🍽️",
 "100||schlafen|😴",
 "100||weinen|😭",
 "100||schreiben|✍️",
 "100||sehen|👀",
 "100||kaufen|🛒",
 "100||klettern|🧗",
 "100||umarmen|🤗",
 "100||winken|👋",
 "100||spielen|",
 "100||gehen|",
 "100||laufen|",
 "100||sitzen|",
 "100||kochen|",
 "100||bauen|",
 "100||fahren|",
 "100||werfen|",
 "100||fangen|",
 "100||sagen|",
 "100||machen|",
 "100||sprechen|",
 "100||rufen|",
 // Adjektive
 "100||heiß|🥵",
 "100||müde|🥱",
 "100||traurig|😢",
 "100||krank|🤒",
 "100||groß|",
 "100||alt|",
 "100||neu|",
 "100||schön|",
 "100||lang|",
 "100||kurz|",
 "100||nass|",
 "100||leise|",
 "100||langsam|",
 "100||leer|",
 // Wörter
 "100||hallo|",
 "100||tschüss|",
 "100||danke|",
 "100||bitte|",
 "100||ja|",
 "100||nein|"
];
// Traduction française des mots du dictionnaire (voix française de « Lerne neue Wörter »)
var DE_FR={"Klementine":"la clémentine","Mama":"maman","Papa":"papa","Oma":"mamie","Opa":"papi","Familie":"la famille","Baby":"le bébé","Bruder":"le frère","Schwester":"la sœur","Mutter":"la mère","Vater":"le père","Kopf":"la tête","Mund":"la bouche","Zahn":"la dent","Bein":"la jambe","Arm":"le bras","Bauch":"le ventre","Haare":"les cheveux","Finger":"le doigt","Knie":"le genou","Rücken":"le dos","Herz":"le cœur","Gesicht":"le visage","Hund":"le chien","Fisch":"le poisson","Schwein":"le cochon","Schaf":"le mouton","Ente":"le canard","Löwe":"le lion","Elefant":"l'éléphant","Affe":"le singe","Bär":"l'ours","Schlange":"le serpent","Frosch":"la grenouille","Schmetterling":"le papillon","Schnecke":"l'escargot","Tiger":"le tigre","Zebra":"le zèbre","Krokodil":"le crocodile","Eule":"la chouette","Igel":"le hérisson","Fuchs":"le renard","Wolf":"le loup","Huhn":"la poule","Kamel":"le chameau","Känguru":"le kangourou","Panda":"le panda","Eichhörnchen":"l'écureuil","Marienkäfer":"la coccinelle","Ameise":"la fourmi","Papagei":"le perroquet","Dinosaurier":"le dinosaure","Einhorn":"la licorne","Esel":"l'âne","Banane":"la banane","Birne":"la poire","Erdbeere":"la fraise","Kirsche":"la cerise","Zitrone":"le citron","Tomate":"la tomate","Kartoffel":"la pomme de terre","Käse":"le fromage","Wurst":"la saucisse","Kuchen":"le gâteau","Eis":"la glace","Wasser":"l'eau","Tee":"le thé","Schokolade":"le chocolat","Honig":"le miel","Nudeln":"les pâtes","Pizza":"la pizza","Suppe":"la soupe","Salat":"la salade","Ananas":"l'ananas","Melone":"le melon","Pilz":"le champignon","Gurke":"le concombre","Zwiebel":"l'oignon","Mais":"le maïs","Brezel":"le bretzel","Pfannkuchen":"la crêpe","Pommes":"les frites","Kokosnuss":"la noix de coco","Kiwi":"le kiwi","Brokkoli":"le brocoli","Salz":"le sel","Brötchen":"le petit pain","Saft":"le jus","Zucker":"le sucre","Joghurt":"le yaourt","Hose":"le pantalon","T-Shirt":"le tee-shirt","Schuh":"la chaussure","Stiefel":"la botte","Mütze":"la casquette","Hut":"le chapeau","Socke":"la chaussette","Schal":"l'écharpe","Handschuh":"le gant","Brille":"les lunettes","Krone":"la couronne","Ring":"la bague","Pullover":"le pull","Rock":"la jupe","Kleid":"la robe","Rucksack":"le sac à dos","Tür":"la porte","Fenster":"la fenêtre","Bett":"le lit","Stuhl":"la chaise","Sofa":"le canapé","Toilette":"les toilettes","Badewanne":"la baignoire","Dusche":"la douche","Schlüssel":"la clé","Telefon":"le téléphone","Handy":"le portable","Fernseher":"la télévision","Computer":"l'ordinateur","Löffel":"la cuillère","Messer":"le couteau","Spiegel":"le miroir","Zahnbürste":"la brosse à dents","Wecker":"le réveil","Bild":"le tableau","Lampe":"la lampe","Teller":"l'assiette","Topf":"la casserole","Seife":"le savon","Zimmer":"la chambre","Küche":"la cuisine","Garten":"le jardin","Treppe":"l'escalier","Kissen":"le coussin","Geschenk":"le cadeau","Luftballon":"le ballon de baudruche","Würfel":"le dé","Puzzle":"le puzzle","Drachen":"le cerf-volant","Roboter":"le robot","Geburtstag":"l'anniversaire","Weihnachtsmann":"le père Noël","Gespenst":"le fantôme","Teddybär":"l'ours en peluche","Spiel":"le jeu","Schaukel":"la balançoire","Auto":"la voiture","Fahrrad":"le vélo","Zug":"le train","Flugzeug":"l'avion","Schiff":"le navire","Boot":"le bateau","Rakete":"la fusée","Traktor":"le tracteur","Motorrad":"la moto","Hubschrauber":"l'hélicoptère","Polizeiauto":"la voiture de police","Feuerwehrauto":"le camion de pompiers","Krankenwagen":"l'ambulance","Roller":"la trottinette","Taxi":"le taxi","Sonne":"le soleil","Stern":"l'étoile","Blitz":"l'éclair","Meer":"la mer","Insel":"l'île","Stein":"la pierre","Blatt":"la feuille","Vulkan":"le volcan","Kaktus":"le cactus","Rose":"la rose","Sonnenblume":"le tournesol","Tulpe":"la tulipe","Kleeblatt":"le trèfle","Erde":"la Terre","Wolke":"le nuage","Regenbogen":"l'arc-en-ciel","Wind":"le vent","Fluss":"la rivière","Frühling":"le printemps","Sommer":"l'été","Herbst":"l'automne","Lehrer":"le maître","Lehrerin":"la maîtresse","Arzt":"le médecin","Ärztin":"la médecin","Polizist":"le policier","Koch":"le cuisinier","Feuerwehrmann":"le pompier","Bauer":"le fermier","König":"le roi","Prinzessin":"la princesse","Pirat":"le pirate","null":"zéro","eins":"un","drei":"trois","vier":"quatre","fünf":"cinq","acht":"huit","zehn":"dix","grün":"vert","orange":"orange","rosa":"rose","grau":"gris","essen":"manger","schlafen":"dormir","weinen":"pleurer","schreiben":"écrire","sehen":"voir","kaufen":"acheter","klettern":"grimper","umarmen":"faire un câlin","winken":"faire coucou","spielen":"jouer","gehen":"marcher","laufen":"courir","sitzen":"être assis","kochen":"cuisiner","bauen":"construire","fahren":"rouler","werfen":"lancer","fangen":"attraper","sagen":"dire","machen":"faire","sprechen":"parler","rufen":"appeler","heiß":"chaud","müde":"fatigué","traurig":"triste","krank":"malade","groß":"grand","alt":"vieux","neu":"nouveau","schön":"beau","lang":"long","kurz":"court","nass":"mouillé","leise":"doucement","langsam":"lentement","leer":"vide","hallo":"bonjour","tschüss":"au revoir","danke":"merci","bitte":"s'il te plaît","ja":"oui","nein":"non"};
// Thème des mots du dictionnaire (catégorie des résultats de « Lerne neue Wörter »)
var DE_THEME={"Klementine":"Nourriture","Mama":"Famille","Papa":"Famille","Oma":"Famille","Opa":"Famille","Familie":"Famille","Baby":"Famille","Bruder":"Famille","Schwester":"Famille","Mutter":"Famille","Vater":"Famille","Kopf":"Corps","Mund":"Corps","Zahn":"Corps","Bein":"Corps","Arm":"Corps","Bauch":"Corps","Haare":"Corps","Finger":"Corps","Knie":"Corps","Rücken":"Corps","Herz":"Corps","Gesicht":"Corps","Hund":"Animaux","Fisch":"Animaux","Schwein":"Animaux","Schaf":"Animaux","Ente":"Animaux","Löwe":"Animaux","Elefant":"Animaux","Affe":"Animaux","Bär":"Animaux","Schlange":"Animaux","Frosch":"Animaux","Schmetterling":"Animaux","Schnecke":"Animaux","Tiger":"Animaux","Zebra":"Animaux","Krokodil":"Animaux","Eule":"Animaux","Igel":"Animaux","Fuchs":"Animaux","Wolf":"Animaux","Huhn":"Animaux","Kamel":"Animaux","Känguru":"Animaux","Panda":"Animaux","Eichhörnchen":"Animaux","Marienkäfer":"Animaux","Ameise":"Animaux","Papagei":"Animaux","Dinosaurier":"Animaux","Einhorn":"Animaux","Esel":"Animaux","Banane":"Nourriture","Birne":"Nourriture","Erdbeere":"Nourriture","Kirsche":"Nourriture","Zitrone":"Nourriture","Tomate":"Nourriture","Kartoffel":"Nourriture","Käse":"Nourriture","Wurst":"Nourriture","Kuchen":"Nourriture","Eis":"Nourriture","Wasser":"Nourriture","Tee":"Nourriture","Schokolade":"Nourriture","Honig":"Nourriture","Nudeln":"Nourriture","Pizza":"Nourriture","Suppe":"Nourriture","Salat":"Nourriture","Ananas":"Nourriture","Melone":"Nourriture","Pilz":"Nourriture","Gurke":"Nourriture","Zwiebel":"Nourriture","Mais":"Nourriture","Brezel":"Nourriture","Pfannkuchen":"Nourriture","Pommes":"Nourriture","Kokosnuss":"Nourriture","Kiwi":"Nourriture","Brokkoli":"Nourriture","Salz":"Nourriture","Brötchen":"Nourriture","Saft":"Nourriture","Zucker":"Nourriture","Joghurt":"Nourriture","Hose":"Vêtements","T-Shirt":"Vêtements","Schuh":"Vêtements","Stiefel":"Vêtements","Mütze":"Vêtements","Hut":"Vêtements","Socke":"Vêtements","Schal":"Vêtements","Handschuh":"Vêtements","Brille":"Vêtements","Krone":"Vêtements","Ring":"Vêtements","Pullover":"Vêtements","Rock":"Vêtements","Kleid":"Vêtements","Rucksack":"Vêtements","Tür":"Maison","Fenster":"Maison","Bett":"Maison","Stuhl":"Maison","Sofa":"Maison","Toilette":"Maison","Badewanne":"Maison","Dusche":"Maison","Schlüssel":"Maison","Telefon":"Maison","Handy":"Maison","Fernseher":"Maison","Computer":"Maison","Löffel":"Maison","Messer":"Maison","Spiegel":"Maison","Zahnbürste":"Maison","Wecker":"Maison","Bild":"Maison","Lampe":"Maison","Teller":"Maison","Topf":"Maison","Seife":"Maison","Zimmer":"Maison","Küche":"Maison","Garten":"Maison","Treppe":"Maison","Kissen":"Maison","Geschenk":"Jeux et fêtes","Luftballon":"Jeux et fêtes","Würfel":"Jeux et fêtes","Puzzle":"Jeux et fêtes","Drachen":"Jeux et fêtes","Roboter":"Jeux et fêtes","Geburtstag":"Jeux et fêtes","Weihnachtsmann":"Jeux et fêtes","Gespenst":"Jeux et fêtes","Teddybär":"Jeux et fêtes","Spiel":"Jeux et fêtes","Schaukel":"Jeux et fêtes","Auto":"Véhicules","Fahrrad":"Véhicules","Zug":"Véhicules","Flugzeug":"Véhicules","Schiff":"Véhicules","Boot":"Véhicules","Rakete":"Véhicules","Traktor":"Véhicules","Motorrad":"Véhicules","Hubschrauber":"Véhicules","Polizeiauto":"Véhicules","Feuerwehrauto":"Véhicules","Krankenwagen":"Véhicules","Roller":"Véhicules","Taxi":"Véhicules","Sonne":"Nature","Stern":"Nature","Blitz":"Nature","Meer":"Nature","Insel":"Nature","Stein":"Nature","Blatt":"Nature","Vulkan":"Nature","Kaktus":"Nature","Rose":"Nature","Sonnenblume":"Nature","Tulpe":"Nature","Kleeblatt":"Nature","Erde":"Nature","Wolke":"Nature","Regenbogen":"Nature","Wind":"Nature","Fluss":"Nature","Frühling":"Nature","Sommer":"Nature","Herbst":"Nature","Lehrer":"Métiers","Lehrerin":"Métiers","Arzt":"Métiers","Ärztin":"Métiers","Polizist":"Métiers","Koch":"Métiers","Feuerwehrmann":"Métiers","Bauer":"Métiers","König":"Métiers","Prinzessin":"Métiers","Pirat":"Métiers","null":"Nombres et couleurs","eins":"Nombres et couleurs","drei":"Nombres et couleurs","vier":"Nombres et couleurs","fünf":"Nombres et couleurs","acht":"Nombres et couleurs","zehn":"Nombres et couleurs","grün":"Nombres et couleurs","orange":"Nombres et couleurs","rosa":"Nombres et couleurs","grau":"Nombres et couleurs","essen":"Verbes","schlafen":"Verbes","weinen":"Verbes","schreiben":"Verbes","sehen":"Verbes","kaufen":"Verbes","klettern":"Verbes","umarmen":"Verbes","winken":"Verbes","spielen":"Verbes","gehen":"Verbes","laufen":"Verbes","sitzen":"Verbes","kochen":"Verbes","bauen":"Verbes","fahren":"Verbes","werfen":"Verbes","fangen":"Verbes","sagen":"Verbes","machen":"Verbes","sprechen":"Verbes","rufen":"Verbes","heiß":"Adjectifs","müde":"Adjectifs","traurig":"Adjectifs","krank":"Adjectifs","groß":"Adjectifs","alt":"Adjectifs","neu":"Adjectifs","schön":"Adjectifs","lang":"Adjectifs","kurz":"Adjectifs","nass":"Adjectifs","leise":"Adjectifs","langsam":"Adjectifs","leer":"Adjectifs","hallo":"Politesse","tschüss":"Politesse","danke":"Politesse","bitte":"Politesse","ja":"Politesse","nein":"Politesse"};
// Dessins maison partagés par tous les jeux (quand un seul emoji ne suffit pas) : taille = 1,3em (comme un emoji)
var DE_SVG={
 // Obst = les fruits : une corbeille de fruits (banane, raisin, pomme, orange)
 // teilen = partager : une tablette de chocolat cassée en deux, une moitié pour chaque enfant (choix de l'utilisateur ; 🤝 faisait penser à « saluer »)
 "teilen":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><g transform="rotate(-8 32 42)"><rect x="14" y="20" width="34" height="42" rx="4" fill="#7b4a2a"/><path d="M14 34h34M14 48h34M31 20v42" stroke="#5a3218" stroke-width="2.5"/><path d="M48 20l-3 6 3 5-3 6 3 5-3 6 3 5-3 6 3 3" fill="none" stroke="#5a3218" stroke-width="2"/></g><g transform="rotate(8 68 42)"><rect x="52" y="20" width="34" height="42" rx="4" fill="#7b4a2a"/><path d="M52 34h34M52 48h34M69 20v42" stroke="#5a3218" stroke-width="2.5"/></g><circle cx="22" cy="84" r="10" fill="#f6c89a"/><path d="M12 80q10-12 20 0" fill="#7a4a24"/><path d="M18 87q4 4 8 0" stroke="#5a3218" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="18.5" cy="82" r="1.4" fill="#3a2416"/><circle cx="25.5" cy="82" r="1.4" fill="#3a2416"/><circle cx="78" cy="84" r="10" fill="#f6c89a"/><path d="M68 82q10-16 20 0" fill="#e0a43a"/><path d="M74 87q4 4 8 0" stroke="#5a3218" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="74.5" cy="82" r="1.4" fill="#3a2416"/><circle cx="81.5" cy="82" r="1.4" fill="#3a2416"/></svg>',
 // die Flöte : une flûte à bec (l'emoji 🪈 n'existe pas sur les anciens Android)
 "Flöte":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><g transform="rotate(-40 50 50)"><path d="M10 44h12l4 -3h60v18H26l-4-3H10z" fill="#f4e3c3" stroke="#b8925a" stroke-width="2.5" stroke-linejoin="round"/><path d="M86 41c4 0 6 4 6 9s-2 9-6 9z" fill="#e8cfa0" stroke="#b8925a" stroke-width="2.5"/><rect x="18" y="45" width="7" height="4" rx="1" fill="#5a3a18"/><g fill="#5a3a18"><circle cx="40" cy="50" r="3"/><circle cx="50" cy="50" r="3"/><circle cx="60" cy="50" r="3"/><circle cx="70" cy="50" r="3"/><circle cx="79" cy="50" r="2.5"/></g></g></svg>',
 // die Qualle : une méduse (l'emoji 🪼 n'existe pas sur les anciens Android)
 "Qualle":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><g fill="none" stroke-linecap="round" stroke-width="4"><path d="M30 52q-6 12 2 22t0 22" stroke="#c77dff"/><path d="M44 54q6 12-2 22t2 20" stroke="#9d4edd"/><path d="M56 54q-6 12 2 22t-2 20" stroke="#c77dff"/><path d="M70 52q6 12-2 22t0 22" stroke="#9d4edd"/></g><path d="M18 52C18 30 32 14 50 14s32 16 32 38c-6 4-12 0-16 4-4-4-10 0-16-2-6 2-12-2-16 2-4-4-10 0-16-4z" fill="#e0aaff" stroke="#9d4edd" stroke-width="3" stroke-linejoin="round"/><path d="M30 30q8-10 20-10" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/><circle cx="42" cy="40" r="3.2" fill="#3c096c"/><circle cx="58" cy="40" r="3.2" fill="#3c096c"/><path d="M45 47q5 4 10 0" stroke="#3c096c" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>',
 // die Pyramide : une pyramide dans le désert, avec le soleil
 "Pyramide":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><circle cx="78" cy="22" r="10" fill="#ffd23f"/><path d="M4 84q46-8 92 0v10H4z" fill="#f2c46d"/><path d="M50 16L12 84h38z" fill="#e8b04b" stroke="#b07a1f" stroke-width="2.5" stroke-linejoin="round"/><path d="M50 16l38 68H50z" fill="#c98a2b" stroke="#b07a1f" stroke-width="2.5" stroke-linejoin="round"/><path d="M38 38h12M30 52h20M22 68h28M50 38h11M50 52h19M50 68h27" stroke="#b07a1f" stroke-width="1.8" opacity=".6"/></svg>',
 // Noms sans emoji, dessins maison (à la demande de l'utilisateur)
 "Junge":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><circle cx="50" cy="40" r="20" fill="#f2c094"/><path d="M30 36q0-18 20-18t20 18q-4-6-10-6l-4 4-4-6-6 6-4-4q-8 0-12 6z" fill="#6b3d1f"/><circle cx="43" cy="42" r="2.6" fill="#22204a"/><circle cx="57" cy="42" r="2.6" fill="#22204a"/><path d="M44 50q6 5 12 0" stroke="#22204a" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="38" cy="49" r="3" fill="#ff8fab" opacity=".5"/><circle cx="62" cy="49" r="3" fill="#ff8fab" opacity=".5"/><path d="M24 98q0-30 26-30t26 30z" fill="#4a7cff"/></svg>',
 "Mädchen":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><circle cx="50" cy="40" r="20" fill="#f6d2b0"/><circle cx="26" cy="44" r="8" fill="#c4502a"/><circle cx="74" cy="44" r="8" fill="#c4502a"/><path d="M30 38q2-22 20-22t20 22q-8-10-20-10t-20 10z" fill="#c4502a"/><circle cx="26" cy="36" r="3" fill="#ff5c9a"/><circle cx="74" cy="36" r="3" fill="#ff5c9a"/><circle cx="43" cy="42" r="2.6" fill="#22204a"/><circle cx="57" cy="42" r="2.6" fill="#22204a"/><path d="M44 50q6 5 12 0" stroke="#22204a" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="38" cy="49" r="3" fill="#ff8fab" opacity=".5"/><circle cx="62" cy="49" r="3" fill="#ff8fab" opacity=".5"/><path d="M22 98l8-28q20-6 40 0l8 28z" fill="#ff5c9a"/></svg>',
 "Schüler":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><rect x="18" y="58" width="22" height="30" rx="5" fill="#ffb800" stroke="#c48a00" stroke-width="2"/><path d="M22 66h14" stroke="#c48a00" stroke-width="2"/><circle cx="50" cy="34" r="20" fill="#e8b48a"/><path d="M30 30q0-18 20-18t20 18q-4-6-10-6l-4 4-4-6-6 6-4-4q-8 0-12 6z" fill="#3b2a1a"/><circle cx="43" cy="36" r="2.6" fill="#22204a"/><circle cx="57" cy="36" r="2.6" fill="#22204a"/><path d="M44 44q6 5 12 0" stroke="#22204a" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="38" cy="43" r="3" fill="#ff8fab" opacity=".5"/><circle cx="62" cy="43" r="3" fill="#ff8fab" opacity=".5"/><path d="M30 98q0-34 20-34t20 34z" fill="#4cc261"/><rect x="54" y="70" width="22" height="16" rx="2" fill="#e5484d"/><path d="M65 70v16" stroke="#fff" stroke-width="2"/><path d="M36 64l-8 4" stroke="#8a5a2b" stroke-width="4" stroke-linecap="round"/></svg>',
 "Schülerin":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><rect x="18" y="58" width="22" height="30" rx="5" fill="#ffb800" stroke="#c48a00" stroke-width="2"/><path d="M22 66h14" stroke="#c48a00" stroke-width="2"/><circle cx="50" cy="34" r="20" fill="#c98b5b"/><circle cx="26" cy="38" r="8" fill="#1f1f2e"/><circle cx="74" cy="38" r="8" fill="#1f1f2e"/><path d="M30 32q2-22 20-22t20 22q-8-10-20-10t-20 10z" fill="#1f1f2e"/><circle cx="26" cy="30" r="3" fill="#ff5c9a"/><circle cx="74" cy="30" r="3" fill="#ff5c9a"/><circle cx="43" cy="36" r="2.6" fill="#22204a"/><circle cx="57" cy="36" r="2.6" fill="#22204a"/><path d="M44 44q6 5 12 0" stroke="#22204a" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="38" cy="43" r="3" fill="#ff8fab" opacity=".5"/><circle cx="62" cy="43" r="3" fill="#ff8fab" opacity=".5"/><path d="M30 98q0-34 20-34t20 34z" fill="#9b6bff"/><rect x="54" y="70" width="22" height="16" rx="2" fill="#e5484d"/><path d="M65 70v16" stroke="#fff" stroke-width="2"/><path d="M36 64l-8 4" stroke="#8a5a2b" stroke-width="4" stroke-linecap="round"/></svg>',
 "Schornsteinfeger":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><rect x="62" y="56" width="20" height="40" fill="#b5523b"/><path d="M62 66h20M62 76h20M62 86h20M72 56v10M68 66v10M76 76v10" stroke="#8a3a28" stroke-width="2"/><rect x="58" y="50" width="28" height="8" fill="#8a3a28"/><circle cx="38" cy="40" r="14" fill="#f2c094"/><circle cx="33" cy="40" r="2.2" fill="#22204a"/><circle cx="43" cy="40" r="2.2" fill="#22204a"/><path d="M33 47q5 4 10 0" stroke="#22204a" stroke-width="2" fill="none"/><circle cx="30" cy="45" r="2.5" fill="#333" opacity=".5"/><rect x="26" y="8" width="24" height="20" rx="2" fill="#1f1f2e"/><rect x="20" y="26" width="36" height="5" rx="2" fill="#1f1f2e"/><path d="M20 98q0-42 18-42t18 42z" fill="#1f1f2e"/><path d="M38 60v38" stroke="#ffd166" stroke-width="2" stroke-dasharray="3 5"/><path d="M58 64L86 18" stroke="#8a5a2b" stroke-width="3"/><circle cx="88" cy="14" r="9" fill="#333"/><path d="M80 14h16M88 6v16M82 8l12 12M94 8l-12 12" stroke="#333" stroke-width="2"/></svg>',
 "Jäger":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><path d="M20 98q0-40 30-40t30 40z" fill="#3f7d3a"/><path d="M50 58v40" stroke="#2d5a29" stroke-width="2"/><circle cx="44" cy="70" r="2" fill="#c9a64a"/><circle cx="44" cy="82" r="2" fill="#c9a64a"/><circle cx="50" cy="40" r="17" fill="#f2c094"/><circle cx="44" cy="40" r="2.4" fill="#22204a"/><circle cx="56" cy="40" r="2.4" fill="#22204a"/><path d="M42 50q8 5 16 0" stroke="#6b3d1f" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M28 30q2-18 22-18t22 18z" fill="#2d5a29"/><rect x="22" y="28" width="56" height="6" rx="3" fill="#2d5a29"/><path d="M66 22q8-18 18-16-6 6-14 20z" fill="#e5484d"/><rect x="38" y="62" width="9" height="12" rx="3" fill="#333"/><rect x="53" y="62" width="9" height="12" rx="3" fill="#333"/><rect x="45" y="65" width="10" height="4" fill="#333"/></svg>',
 "Spritzgebäck":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><g transform="translate(30 40) rotate(-10)"><path d="M-14 6q0-18 14-18t14 18" fill="none" stroke="#e8b04b" stroke-width="12" stroke-linecap="round"/><path d="M-14 6q0-18 14-18t14 18" fill="none" stroke="#c98a2b" stroke-width="2" stroke-dasharray="2 4"/><path d="M-14 6q0-18 14-18t14 18" fill="none" stroke="#fff3d6" stroke-width="3" opacity=".6" transform="translate(0 -3)"/></g><g transform="translate(70 36) rotate(12)"><path d="M-14 6q0-18 14-18t14 18" fill="none" stroke="#e8b04b" stroke-width="12" stroke-linecap="round"/><path d="M-14 6q0-18 14-18t14 18" fill="none" stroke="#c98a2b" stroke-width="2" stroke-dasharray="2 4"/><path d="M-14 6q0-18 14-18t14 18" fill="none" stroke="#fff3d6" stroke-width="3" opacity=".6" transform="translate(0 -3)"/></g><g transform="translate(50 72) rotate(0)"><path d="M-14 6q0-18 14-18t14 18" fill="none" stroke="#e8b04b" stroke-width="12" stroke-linecap="round"/><path d="M-14 6q0-18 14-18t14 18" fill="none" stroke="#c98a2b" stroke-width="2" stroke-dasharray="2 4"/><path d="M-14 6q0-18 14-18t14 18" fill="none" stroke="#fff3d6" stroke-width="3" opacity=".6" transform="translate(0 -3)"/></g><path d="M58 66q0-10 8-14" stroke="#6b3d1f" stroke-width="6" stroke-linecap="round" fill="none" opacity=".0"/></svg>',
 "Kleber":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><ellipse cx="50" cy="94" rx="22" ry="3" fill="#000" opacity=".08"/><rect x="34" y="40" width="32" height="52" rx="5" fill="#4a7cff"/><rect x="34" y="52" width="32" height="22" fill="#fff"/><text x="50" y="68" text-anchor="middle" font-family="Fredoka,sans-serif" font-size="11" font-weight="700" fill="#4a7cff">KLEB</text><rect x="38" y="28" width="24" height="14" rx="2" fill="#fff8e1" stroke="#d9cfa0" stroke-width="2"/><rect x="66" y="66" width="28" height="22" rx="5" fill="#ff5c7a"/><rect x="66" y="66" width="28" height="6" rx="3" fill="#ff8fab"/></svg>',
 "Schwanz":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><path d="M14 70q4-24 30-22 26 2 26-18 0-14-10-18 26 0 30 24 4 30-26 42-26 10-50-8z" fill="#ff8a3d" stroke="#d9601a" stroke-width="3" stroke-linejoin="round"/><path d="M60 12q26 0 30 24 2 12-4 20-4-26-26-44z" fill="#fff"/><path d="M30 64q10-6 22-2M40 74q12-4 22-12" stroke="#d9601a" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="14" cy="80" rx="14" ry="16" fill="#ff8a3d" stroke="#d9601a" stroke-width="3"/><path d="M6 94v6M20 94v6" stroke="#6b3d1f" stroke-width="5" stroke-linecap="round"/></svg>',
 "Pfeife":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><ellipse cx="50" cy="90" rx="34" ry="4" fill="#000" opacity=".08"/><path d="M14 46h34v-10h14v10a26 26 0 1 1-48 0z" fill="#c9d3e3" stroke="#7d8aa3" stroke-width="3" stroke-linejoin="round"/><circle cx="40" cy="60" r="14" fill="#a9b6cc"/><circle cx="40" cy="60" r="6" fill="#7d8aa3"/><path d="M62 36h18v10H62" fill="#c9d3e3" stroke="#7d8aa3" stroke-width="3"/><path d="M62 30q16-14 30-8" stroke="#e5484d" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M24 50q4-6 10-6" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M84 52l8-2M84 60l9 2M82 68l7 5" stroke="#4a7cff" stroke-width="3" stroke-linecap="round"/></svg>',
 "Zeh":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><path d="M10 80q0-22 20-30l50-6q12 0 12 14t-12 16l-50 14q-20 4-20-8z" fill="#f2c094" stroke="#c98b5b" stroke-width="2.5"/><g fill="#f6d2b0" stroke="#c98b5b" stroke-width="2.5"><ellipse cx="80" cy="44" rx="9" ry="10"/><ellipse cx="66" cy="44" rx="6" ry="7"/><ellipse cx="55" cy="46" rx="5" ry="6"/><ellipse cx="45" cy="49" rx="4.5" ry="5"/><ellipse cx="36" cy="52" rx="4" ry="4.5"/></g><ellipse cx="82" cy="40" rx="4" ry="4" fill="#ff8fab"/><path d="M82 8v18" stroke="#e5484d" stroke-width="5" stroke-linecap="round"/><path d="M74 18l8 10 8-10" stroke="#e5484d" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 "Kessel":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><path d="M14 96L50 8 86 96" stroke="#8a5a2b" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M50 8v22" stroke="#555" stroke-width="2.5"/><path d="M28 36q22-12 44 0" stroke="#555" stroke-width="3" fill="none"/><path d="M24 40h52l-4 30q-2 10-22 10t-22-10z" fill="#2f2f3a"/><rect x="22" y="36" width="56" height="8" rx="4" fill="#45454f"/><path d="M30 46q6-2 8 6" stroke="#fff" stroke-width="2.5" fill="none" opacity=".4" stroke-linecap="round"/><path d="M34 96q-6-14 6-20 0 8 6 6-4-12 6-18 2 12 10 14 8 4 4 18z" fill="#ff8a3d"/><path d="M42 96q-2-8 6-12 0 6 4 6 4 2 4 6z" fill="#ffd23f"/><path d="M42 30q-4-6 2-10M54 28q4-6-2-10" stroke="#c9d3e3" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
 "Klecks":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><path d="M50 16q8 14 16 6 2 14 16 10-6 12 8 20-14 4-6 18-14-6-16 10-8-12-20-2 0-14-14-14 8-10-4-22 14 2 12-12 10 8 18-6z" fill="#2f6bd1"/><circle cx="84" cy="24" r="5" fill="#2f6bd1"/><circle cx="18" cy="82" r="4" fill="#2f6bd1"/><circle cx="90" cy="76" r="3" fill="#2f6bd1"/><circle cx="14" cy="22" r="3" fill="#2f6bd1"/><circle cx="42" cy="40" r="5" fill="#fff" opacity=".35"/></svg>',
 "Jacke":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><path d="M30 14l-18 10-6 60h18l2-40v54h48V44l2 40h18l-6-60-18-10-10 8h-20z" fill="#4a7cff" stroke="#2f5ad1" stroke-width="3" stroke-linejoin="round"/><path d="M40 14l10 16 10-16" fill="#2f5ad1"/><path d="M50 30v68" stroke="#2f5ad1" stroke-width="3"/><g fill="#ffd166"><circle cx="54" cy="44" r="2.5"/><circle cx="54" cy="60" r="2.5"/><circle cx="54" cy="76" r="2.5"/></g><path d="M32 56h12v8H32zM56 56h12v8H56z" fill="#2f5ad1"/></svg>',
 "Stiel":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><path d="M50 96V44" stroke="#3fa34d" stroke-width="7" stroke-linecap="round"/><path d="M50 74q-18-2-22-16 14 0 22 12z" fill="#4cc261"/><g fill="#ff5c9a"><circle cx="50" cy="20" r="9"/><circle cx="38" cy="28" r="9"/><circle cx="62" cy="28" r="9"/><circle cx="42" cy="40" r="9"/><circle cx="58" cy="40" r="9"/></g><circle cx="50" cy="31" r="7" fill="#ffd23f"/><path d="M90 64H64" stroke="#e5484d" stroke-width="5" stroke-linecap="round"/><path d="M72 54l-10 10 10 10" stroke="#e5484d" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 "Streifen":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><defs><clipPath id="stc_"><rect x="10" y="20" width="80" height="60" rx="8"/></clipPath></defs><g clip-path="url(#stc_)" transform="rotate(0)"><rect x="-40" y="0" width="12" height="140" fill="#e5484d" transform="rotate(35 50 50)"/><rect x="-28" y="0" width="12" height="140" fill="#ffffff" transform="rotate(35 50 50)"/><rect x="-16" y="0" width="12" height="140" fill="#4a7cff" transform="rotate(35 50 50)"/><rect x="-4" y="0" width="12" height="140" fill="#ffffff" transform="rotate(35 50 50)"/><rect x="8" y="0" width="12" height="140" fill="#e5484d" transform="rotate(35 50 50)"/><rect x="20" y="0" width="12" height="140" fill="#ffffff" transform="rotate(35 50 50)"/><rect x="32" y="0" width="12" height="140" fill="#4a7cff" transform="rotate(35 50 50)"/><rect x="44" y="0" width="12" height="140" fill="#ffffff" transform="rotate(35 50 50)"/><rect x="56" y="0" width="12" height="140" fill="#e5484d" transform="rotate(35 50 50)"/><rect x="68" y="0" width="12" height="140" fill="#ffffff" transform="rotate(35 50 50)"/><rect x="80" y="0" width="12" height="140" fill="#4a7cff" transform="rotate(35 50 50)"/><rect x="92" y="0" width="12" height="140" fill="#ffffff" transform="rotate(35 50 50)"/><rect x="104" y="0" width="12" height="140" fill="#e5484d" transform="rotate(35 50 50)"/></g><rect x="10" y="20" width="80" height="60" rx="8" fill="none" stroke="#c9d3e3" stroke-width="3"/></svg>',
 "Kreuzung":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><rect x="0" y="0" width="100" height="100" rx="10" fill="#7ccf6a"/><rect x="36" y="0" width="28" height="100" fill="#8c8f99"/><rect x="0" y="36" width="100" height="28" fill="#8c8f99"/><path d="M50 2v30M50 68v30M2 50h30M68 50h30" stroke="#fff" stroke-width="2.5" stroke-dasharray="5 5"/><g fill="#fff"><rect x="38" y="30" width="24" height="3"/><rect x="38" y="67" width="24" height="3"/><rect x="30" y="38" width="3" height="24"/><rect x="67" y="38" width="3" height="24"/></g><rect x="40" y="76" width="8" height="14" rx="2" fill="#e5484d"/><rect x="74" y="40" width="14" height="8" rx="2" fill="#ffb800"/></svg>',
 "Maßband":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><path d="M50 62h46v18H50z" fill="#ffd23f" stroke="#c9a400" stroke-width="2"/><path d="M58 62v8M66 62v5M74 62v8M82 62v5M90 62v8" stroke="#333" stroke-width="2"/><circle cx="40" cy="56" r="30" fill="#e5484d"/><circle cx="40" cy="56" r="20" fill="#c43a3f"/><circle cx="40" cy="56" r="7" fill="#fff"/><path d="M96 60v22" stroke="#555" stroke-width="4" stroke-linecap="round"/><path d="M26 40q8-8 18-8" stroke="#fff" stroke-width="3" fill="none" opacity=".5" stroke-linecap="round"/></svg>',
 // die Klementine : deux clémentines avec leurs feuilles
 "Klementine":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><circle cx="36" cy="60" r="26" fill="#ff8f1f"/><circle cx="36" cy="60" r="26" fill="url(#kp)" opacity=".35"/><circle cx="28" cy="50" r="6" fill="#fff" opacity=".35"/><circle cx="66" cy="64" r="24" fill="#ff9f2e"/><circle cx="59" cy="55" r="5.5" fill="#fff" opacity=".35"/><defs><pattern id="kp" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1" fill="#c9600a"/></pattern></defs><circle cx="36" cy="35" r="2.5" fill="#6b8e23"/><circle cx="66" cy="41" r="2.5" fill="#6b8e23"/><path d="M36 35q-2-9 6-14" stroke="#4d7a1f" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M38 26q12-8 20 1q-12 7-20-1z" fill="#3fae49"/><path d="M66 41q3-8 11-10" stroke="#4d7a1f" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M73 32q11-3 15 6q-11 3-15-6z" fill="#2f9a3c"/></svg>',
 "Obst":'<svg class="desvg" viewBox="0 0 100 100" width="1.3em" height="1.3em" style="vertical-align:-.25em"><path d="M20 47C22 30 36 18 58 17c2 0 3 2 1 3-14 4-23 13-27 27z" fill="#ffd23f" stroke="#d4a900" stroke-width="2" stroke-linejoin="round"/><g fill="#8e44ad"><circle cx="27" cy="44" r="6"/><circle cx="36" cy="41" r="6"/><circle cx="31" cy="35" r="6"/><circle cx="40" cy="33" r="5"/></g><path d="M35 29l3-6" stroke="#3a7d2c" stroke-width="2.5" stroke-linecap="round"/><circle cx="74" cy="43" r="11" fill="#ff9f1a"/><circle cx="71" cy="39" r="2.5" fill="#fff" opacity=".4"/><circle cx="55" cy="42" r="13" fill="#e5484d"/><circle cx="50" cy="37" r="3" fill="#fff" opacity=".4"/><path d="M55 30q1-6 4-8" stroke="#6b3e1f" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M58 27q8-6 12 0q-7 4-12 0z" fill="#3fae49"/><path d="M14 52h72l-8 34q-28 7-56 0z" fill="#c48a4a"/><path d="M17 64h66M19 75h62" stroke="#8b5a2b" stroke-width="2.5"/><path d="M32 54l3 34M50 54v35M68 54l-3 34" stroke="#8b5a2b" stroke-width="2.5"/><rect x="10" y="47" width="80" height="9" rx="4.5" fill="#9a6331"/></svg>'
};
function deSlug(w){return w.replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/Ä/g,"Ae").replace(/Ö/g,"Oe").replace(/Ü/g,"Ue").replace(/ß/g,"ss")}
function deImg(w){return '<img class="deimg" src="jeux/img/de/'+deSlug(w)+'.webp" alt="" draggable="false" style="width:1.3em;height:1.3em;vertical-align:-.25em;border-radius:.18em;object-fit:contain">'}
var DE_IMG=["Affe","Ameise","Ampel","Ananas","Anker","Apfel","Aprikose","Arm","Arzt","Auge","Auto","Baby","Bach","Badewanne","Ball","Banane","Bauch","Bauer","Baum","Bein","Berg","Besen","Bett","Biene","Bild","Birne","Blatt","Bleistift","Blitz","Blume","Bohne","Boot","Brezel","Brille","Brokkoli","Brot","Bruder","Brunnen","Brötchen","Buch","Bus","Butter","Bäcker","Bär","Bäume","Computer","Dieb","Dinosaurier","Dose","Drachen","Dreieck","Durst","Dusche","Ei","Eichhörnchen","Einhorn","Eis","Elefant","Ente","Erdbeere","Erde","Esel","Eule","Europa","Fahne","Fahrrad","Familie","Feder","Fenster","Fernseher","Feuerwehrauto","Feuerwehrmann","Finger","Fisch","Flugzeug","Fluss","Flöte","Freund","Freundin","Friseur","Friseurin","Frosch","Frühling","Fuchs","Fuß","Füße","Gabel","Gans","Garten","Geburtstag","Geschenk","Gesicht","Gespenst","Giraffe","Glas","Gras","Gurke","Haare","Hahn","Hamster","Hand","Handschuh","Handy","Haus","Herbst","Herz","Hexe","Himmel","Honig","Hose","Hubschrauber","Huhn","Hund","Hut","Hände","Häslein","Häuser","Idee","Igel","Insel","Jacke","Jahr","Joghurt","Junge","Jäger","Kajak","Kaktus","Kamel","Kartoffel","Katze","Keks","Kerze","Kessel","Kind","Kinder","Kirsche","Kissen","Kiste","Kiwi","Klasse","Kleber","Klecks","Kleeblatt","Kleid","Kleider","Klementine","Knicks","Knie","Koch","Koffer","Kokosnuss","Kopf","Korb","Krankenwagen","Kreuzung","Krokodil","Krone","Kuchen","Kuh","Känguru","Käse","König","Küche","Küken","Kürbis","Lampe","Laterne","Lehrer","Lehrerin","Lied","Lineal","Luftballon","Löffel","Löwe","Mais","Maler","Mama","Mantel","Marienkäfer","Mauer","Maus","Maßband","Meer","Melone","Messer","Milch","Mond","Motorrad","Mund","Musik","Mutter","Mädchen","Mäppchen","Mäuse","Möhre","Mütze","Nase","Nebel","Nudeln","Obst","Ohr","Oma","Opa","Orangensaft","Panda","Papa","Papagei","Pause","Pfannkuchen","Pfeife","Pferd","Pilz","Pinsel","Pirat","Pizza","Polizeiauto","Polizist","Pommes","Preis","Prinzessin","Pullover","Puppe","Puzzle","Pyramide","Qualle","Radiergummi","Rakete","Regen","Regenbogen","Reihe","Rezept","Ring","Roboter","Rock","Roller","Rose","Rucksack","Rücken","Saft","Salat","Salz","Sand","Schaf","Schal","Schatz","Schaukel","Schiff","Schlange","Schlüssel","Schmetterling","Schnecke","Schnee","Schokolade","Schornsteinfeger","Schuh","Schule","Schulhof","Schulranzen","Schwanz","Schwein","Schwester","Schüler","Schülerin","Seife","Socke","Sofa","Sommer","Sonne","Sonnenblume","Spiegel","Spiel","Spinne","Spitze","Spitzer","Spritzgebäck","Stamm","Stein","Stern","Stiefel","Stiel","Strauß","Streifen","Stuhl","Suppe","Süßigkeit","T-Shirt","Tafel","Tannenbaum","Tasse","Taxi","Teddybär","Tee","Telefon","Teller","Tiger","Tisch","Toilette","Tomate","Topf","Traktor","Traube","Treppe","Tulpe","Tür","Uhr","Unkraut","Vase","Vater","Viereck","Vogel","Vulkan","Vögel","Wachsmalkreide","Wald","Wasser","Wecker","Weg","Weihnachtsmann","Wiese","Wind","Winter","Wolf","Wolke","Wurst","Würfel","Zahn","Zahnbürste","Zebra","Zeh","Zeitung","Ziege","Zimmer","Zitrone","Zucker","Zug","Zwiebel","acht","alt","angeln","arbeiten","backen","basteln","bauen","beugen","bitte","blau","blühen","brauchen","braun","brennen","brüten","bunt","böse","danke","denken","drei","dunkel","durch","eins","essen","fahren","fallen","falten","fangen","flattern","fliegen","froh","fünf","füttern","gehen","gelb","gießen","grau","groß","größer","grün","gut","hallo","heiß","helfen","hell","hinter","hören","ich","ja","jubeln","jung","kalt","kaufen","klein","klettern","klopfen","kneten","kochen","krank","kurz","lachen","lang","langsam","laufen","laut","leer","leise","lesen","leuchten","lila","links","machen","malen","mixen","müde","nass","nein","neu","neun","null","orange","piksen","pusten","raus","rechts","reißen","richtig","riechen","riesig","rosa","rot","rufen","rutschen","sagen","sauber","schlafen","schnell","schreiben","schwarz","schwimmen","schön","sechs","sehen","sieben","singen","sitzen","sonnig","spielen","sprechen","springen","stampfen","suchen","säen","tanzen","teilen","traurig","trinken","tschüss","umarmen","unter","verstecken","viel","vier","voll","warm","waschen","weich","weinen","weiß","wenig","werfen","winken","wünschen","zehn","zwei","zwölf","Ärztin","öffnen","über"]; // mots illustrés par une image Gemini (jeux/img/de/<mot>.webp), prioritaires sur emoji et dessins
function deImgSrc(src){return '<img class="deimg" src="'+src+'" alt="" draggable="false" style="width:1.3em;height:1.3em;vertical-align:-.25em;border-radius:.18em;object-fit:contain">'}
var DE_WORDS=[],DE_ALL=[],DE_BUY=[],DE_NEW=[]; // calculés par deBuild() (en bas du fichier)
var DE_DEFAULT=[1,2,3,4,5,6,7,8,9,10]; // leçons cochées par défaut (les mots de l'ancienne liste)
// Leçons cochées pour un jeu ("dde" = Der · Die · Das, "fdw" = Finde das Wort) et un profil
function deSelected(game,pid){var v=null;try{v=JSON.parse(localStorage.getItem("de_sel_"+game+"@"+(pid||"p1")))}catch(e){}if(!Array.isArray(v))v=DE_DEFAULT.slice();
 if(v.indexOf(DE_DICT)<0&&v.indexOf(-DE_DICT)<0)v.push(DE_DICT); // dictionnaire hors manuel : coché d'office
 return v.filter(function(n){return n>0})}
function deSave(game,pid,list){if(list.indexOf(DE_DICT)<0)list=list.concat([-DE_DICT]);try{localStorage.setItem("de_sel_"+game+"@"+(pid||"p1"),JSON.stringify(list))}catch(e){}}
// Mots « qu'on peut acheter » pour la Liste des courses (noms avec article et image)
var DE_BUY0=["Klementine","Tasse","Vase","Feder","Süßigkeit","Strauß","Glas","Wachsmalkreide","Milch","Möhre","Zeitung","Apfel","Brot","Orangensaft","Traube","Butter","Keks","Kerze","Ball","Bleistift","Puppe","Pinsel","Lineal","Korb","Blume","Aprikose","Dose","Ei","Buch","Koffer","Besen","Mantel","Schulranzen","Kürbis","Laterne","Uhr","Gabel","Kiste","Obst","Tannenbaum"];

// --- Mots gérés par un parent dans Paramètres → 📖 Mots d'allemand (localStorage « de_words », commun à tous les profils) ---
// {add:[{id,n,a,w,fr,buy}], img:{Mot:"data:image/…"}, hide:["Mot",…]} : mots ajoutés, images choisies sur le téléphone, mots masqués.
function deUser(){var u=null;try{u=JSON.parse(localStorage.getItem("de_words"))}catch(e){}u=u||{};u.add=u.add||[];u.img=u.img||{};u.hide=u.hide||[];return u}
function deUserSave(u){localStorage.setItem("de_words",JSON.stringify(u));deBuild()}
function deBuild(){var u=deUser();
 var base=DE_RAW.map(function(s){var p=s.split("|");return{n:+p[0],a:p[1],w:p[2],e0:p[3]||""}});
 // un mot ajouté sur le téléphone puis intégré au dépôt par Claude (avec son image) : la version du dépôt l'emporte
 var known={};base.forEach(function(x){known[x.w]=1});
 var add=u.add.filter(function(x){return !known[x.w]}).map(function(x){return{n:+x.n,a:x.a||"",w:x.w,e0:"",user:1,id:x.id,fr:x.fr||"",buy:!!x.buy}});
 DE_ALL=base.concat(add).map(function(x){x.own=!!u.img[x.w];x.hid=u.hide.indexOf(x.w)>=0;
  x.e=u.img[x.w]?deImgSrc(u.img[x.w]):DE_IMG.indexOf(x.w)>=0?deImg(x.w):(x.e0||DE_SVG[x.w]||"");return x});
 // mots du dictionnaire du dépôt (leçon 100, dont Klementine) : seulement dans « Lerne neue Wörter », pas dans les autres exercices
 DE_ALL.forEach(function(x){x.neu=!x.user&&x.n===DE_DICT;if(!x.fr&&DE_FR[x.w])x.fr=DE_FR[x.w]});
 DE_WORDS=DE_ALL.filter(function(x){return !x.hid&&!x.neu});
 DE_NEW=DE_ALL.filter(function(x){return !x.hid&&x.neu&&x.e});
 DE_BUY=DE_BUY0.concat(add.filter(function(x){return x.buy&&x.a&&DE_BUY0.indexOf(x.w)<0}).map(function(x){return x.w}))}
deBuild();
// --- Mots activés pour les exercices, par profil (Paramètres → 📖 Mots d'allemand) : remplace le choix des leçons du manuel,
// qui reste en mémoire (deSelected / deSave, clés de_sel_*) sans être utilisé. Clé « de_off@<profil> » = mots désactivés.
// Au premier usage : désactivés = mots hors des leçons cochées pour Finde das Wort. Un mot ajouté plus tard est activé d'office.
function deOff(pid){pid=pid||"p1";var k="de_off@"+pid,v=null;try{v=JSON.parse(localStorage.getItem(k))}catch(e){}
 if(!Array.isArray(v)){var sel=deSelected("fdw",pid);v=DE_ALL.filter(function(x){return sel.indexOf(x.n)<0}).map(function(x){return x.w});try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
 return v}
function deOffSave(pid,v){try{localStorage.setItem("de_off@"+(pid||"p1"),JSON.stringify(v))}catch(e){}}
function deOn(pid){var off=deOff(pid);return DE_WORDS.filter(function(x){return off.indexOf(x.w)<0})}
function deOnSet(pid){var o={};deOn(pid).forEach(function(x){o[x.w]=1});return o}
