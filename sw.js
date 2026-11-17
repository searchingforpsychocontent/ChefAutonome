// ChefAutonome — service worker : garde les fichiers de l'application en mémoire
// pour qu'elle s'ouvre sans connexion. Il ne voit et ne transmet aucune donnée
// (aliments, photos, listes restent dans le stockage du navigateur).
// Fichier généré automatiquement par scripts/pages-postbuild.ts.
const VERSION = "chefautonome-47b54c2754";
const FILES = ["./","./index.html","./manifest.webmanifest","./favicon.ico","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./assets/config-CwZoXJhi.js","./assets/cuisine-Ct_oXY-r.js","./assets/FoodVisual-BuXX_kd3.js","./assets/index-_1d2n3r_.js","./assets/styles-C7xdArQa.css"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;
  // Fichiers nommés avec une empreinte : jamais modifiés, on sert la copie en mémoire.
  if (url.pathname.includes("/assets/")) {
    e.respondWith(caches.match(e.request).then((m) => m || fetch(e.request)));
    return;
  }
  // Le reste : réseau d'abord (mises à jour), mémoire si pas de connexion.
  e.respondWith(
    fetch(e.request).catch(() =>
      caches.match(e.request, { ignoreSearch: true }).then((m) => m || caches.match("./index.html")),
    ),
  );
});
