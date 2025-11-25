const CACHE_NAME = 'math-trainer-v2';
// 列出所有需要离线缓存的文件
const urlsToCache = [
    './', // 根路径
    './index.html',
    './manifest.json',
    // './ding.mp3', 
    // './buzz.mp3', 
    // './icon-72.png',
    // './icon-192.png',
    // './icon-512.png'
];

// 监听安装事件：将所有静态资源缓存
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                // 使用 addAll 缓存所有列出的文件
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error('Failed to cache files:', err);
            })
    );
});

// 监听请求事件：首先尝试从缓存中获取资源
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // 如果缓存中有资源，直接返回
                if (response) {
                    return response;
                }
                // 缓存中没有，发起网络请求
                return fetch(event.request);
            })
    );
});

// 监听激活事件：清除旧版本的缓存，确保用户始终使用最新版本
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // 如果缓存名称不在白名单内，则删除它
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});