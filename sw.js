const CACHE_NAME = 'cat-tasks-cache-v2';

self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request).catch(() => new Response('Offline'))
    );
});

// --- 新增：處理推播通知的點擊事件 ---
self.addEventListener('notificationclick', (event) => {
    // 點擊後先關閉該則通知
    event.notification.close();

    // 尋找是否已經有開啟的 App 視窗
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // 如果 App 已經在背景開啟，就把他拉到最前景 (Focus)
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes(self.registration.scope) && 'focus' in client) {
                    return client.focus();
                }
            }
            // 如果 App 完全被關閉了，就重新開啟首頁
            if (clients.openWindow) {
                return clients.openWindow('./index.html');
            }
        })
    );
});
