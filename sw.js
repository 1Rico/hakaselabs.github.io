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
    console.log('The service worker is serving the assets');
    event.respondWith(
        fromCache(event.request)
    );
    event.waitUntil(
        update(event.request)
        .then(refresh)
    );
});

function fromCache(request) {
    return caches.open(cacheName)
            .then(function(cache) {
                return cache.match(request);
            });
}
function update(request) {
    return caches.open(cacheName)
            .then(function(cache) {
                return fetch(request)
                .then(function(response) {
                    return cache.put(request, response.clone()).then( function() {
                        return response;
                    });
                });
            });
}
function refresh(response) {
    return self.clients.matchAll()
    .then(function(clients) {
        clients.forEach(function(client) {
            var message = {
                type: 'refresh',
                url: response.url,
                eTag: response.headers.get('ETag')
            };
            client.postMessage(JSON.stringify(message));
        });
    });
}