const CACHE_NAME = 'video-gallery-cache-v2'; // 캐시 이름 변경하여 업데이트 유도
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/scripts.js' // 확인된 스크립트 파일 경로
];

// Install a service worker
self.addEventListener('install', event => {
    event.waitUntil
