import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { BProgress } from '@bprogress/core';

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,

    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: () => <p>Not Found.</p>,
  });

  // Progress bar Start
  router.subscribe('onBeforeNavigate', ({ pathChanged }) => {
    pathChanged && BProgress.start();
  });

  // Progress bar Done
  router.subscribe('onResolved', () => {
    BProgress.done();
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
