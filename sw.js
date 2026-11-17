// Service worker sederhana: menyimpan tampilan pembuka supaya ikon cepat terbuka.
// Isi aplikasi tetap selalu diambil langsung dari Google (tidak disimpan).
var CACHE = 'musy-v1';
var FILE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILE); }));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) {
    return Promise.all(k.filter(function (x) { return x !== CACHE; }).map(function (x) { return caches.delete(x); }));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (u.origin !== location.origin) return;   // permintaan ke Google tidak disentuh
  e.respondWith(fetch(e.request).then(function (r) {
    var salin = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, salin); }); return r;
  }).catch(function () { return caches.match(e.request); }));
});
