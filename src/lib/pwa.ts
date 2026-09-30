const serviceWorkerPath = '/sw.js';

export const registerServiceWorker = async (): Promise<void> => {
  if (!('serviceWorker' in navigator)) return;

  try {
    if (import.meta.env.DEV) {
      const registrations = await navigator.serviceWorker.getRegistrations();

      await Promise.all(
        registrations
          .filter((registration) => registration.active?.scriptURL.endsWith(serviceWorkerPath))
          .map((registration) => registration.unregister())
      );

      return;
    }

    await navigator.serviceWorker.register(serviceWorkerPath);
  } catch (error) {
    console.warn('Service worker se nepodařilo zaregistrovat.', error);
  }
};
