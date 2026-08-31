const CACHE_NAME = "baby-checklist-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  self.clients.claim();
});

// 최소한의 fetch 핸들러 (설치 가능 조건 충족용, 별도 캐싱 전략은 없음)
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
