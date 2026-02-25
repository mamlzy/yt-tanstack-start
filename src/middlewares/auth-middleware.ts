import { getCurrentUser } from '@/auth';
import { createMiddleware } from '@tanstack/react-start';

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return next({
    context: { user },
  });
});
