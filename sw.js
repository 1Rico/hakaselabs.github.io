var cacheName = 'hakaseBlog-1';
var filesToCache = [
        '/',
        '/public/css/hyde.css',
        '/public/css/poole.css',
        '/public/css/syntax.css',
    ];

// activate the service worker
self.addEventListener('activate', function(e) {
    console.log('[*] Service worker activated');
    e.waitUntil(
        caches.keys()
        .then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    console.log('[*] ServiceWorker - Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

// Push Notifications
self.addEventListener("push", function(event) {
    event.waitUntil(
        self.registration.showNotification('Got Push?', {
            body: 'Push Message recieved'
        })
    );
});

// When the server worker installs
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
        return cache.addAll(filesToCache);
    })
    );
});

// Fetch Cached items
self.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});