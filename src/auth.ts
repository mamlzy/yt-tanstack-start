import { createServerFn, createServerOnlyFn } from '@tanstack/react-start';
import { useAppSession } from '@/lib/session';
import { db } from './database/db';
import bcrypt from 'bcryptjs';

export const getCurrentUser = createServerFn().handler(async () => {
  const session = await useAppSession();
  const userId = session.data.userId;

  if (!userId) {
    return null;
  }

  const user = await db.query.userTable.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return null;
  }

  return user;
});

export const authenticate = createServerOnlyFn(
  async (email: string, password: string) => {
    const user = await db.query.userTable.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);

    return isValid ? user : null;
  },
);
