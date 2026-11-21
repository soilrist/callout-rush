// 오프라인 저장 (M2-10): 빌드가 아래 두 값을 채운다. 개발 중에는 등록하지 않는다.
const VERSION = '__SW_VERSION__';
const FILES = JSON.parse('__SW_FILES__');
const CACHE = `calloutrush-${VERSION}`;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('calloutrush-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // ignoreVary: 서버가 Vary: Origin 을 붙이는데 모듈 스크립트는 Origin 을 보내서, 없으면 저장본을 못 찾는다
  e.respondWith(caches.match(e.request, { ignoreSearch: true, ignoreVary: true }).then((hit) => hit || fetch(e.request)));
});
