/** 오프라인 (M2-10): 배포본(빌드)에서만 서비스 워커를 등록한다. 한 번 열어 두면 그 뒤로는 와이파이 없이 열린다. */
export function registerOffline(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => undefined);
  });
}
