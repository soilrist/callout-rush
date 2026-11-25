/** Offline (M2-10): registers the service worker only in the deployed build. Once opened, it opens later without a network. */
export function registerOffline(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => undefined);
  });
}
