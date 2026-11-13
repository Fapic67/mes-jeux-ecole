// Service worker : fonctionnement hors ligne.
// Pensez à changer VERSION à chaque mise à jour des fichiers pour que les téléphones la récupèrent.
var VERSION = "v43";
var CACHE = "jeux-ecole-" + VERSION;
var FILES = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "jeux/calcul.html",
  "jeux/telephone.html",
  "jeux/deutsch.html",
  "jeux/francais.html",
  "jeux/clavier.js",
  "jeux/allemand-mots.js",
  "jeux/code.html",
  "jeux/morpion.html",
  "jeux/robot.html",
  "jeux/musique.html",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png",
  "icons/apple-touch-icon.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  // Polices Google : réseau d'abord, puis copie en cache pour le hors ligne.
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(caches.open(CACHE).then(function (c) {
      return c.match(req).then(function (hit) {
        var net = fetch(req).then(function (r) { c.put(req, r.clone()); return r; }).catch(function () { return hit; });
        return hit || net;
      });
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  // sw.js n'est jamais servi depuis le cache (sert à vérifier la connexion et la version en ligne)
  if (url.pathname.endsWith("/sw.js")) return;
  // Fichiers de l'appli : cache d'abord (ignore le #hash et les ?paramètres).
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(function (hit) {
    return hit || fetch(req).then(function (r) {
      if (r.ok) { var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return r;
    }).catch(function () { return caches.match("index.html"); });
  }));
});
