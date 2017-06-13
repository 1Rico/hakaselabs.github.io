self.addEventListener("push", function(event) {
    event.waitUntil(
        self.registration.showNotification('Got Push?', {
            body: 'Push Message recieved'
        })
    );
});

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('the-magic-cache').then(function(cache) {
        return cache.addAll([
            '/',
            '/index.html',
            '/*.html',
            '/*.css',
            '/*.js',
            '/*.md'

        ]);
    })
    );
});

self.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});