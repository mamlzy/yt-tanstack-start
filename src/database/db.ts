import { createServerOnlyFn } from '@tanstack/react-start';
import { drizzle } from 'drizzle-orm/node-postgres';
import { relations } from './relations';

const createDatabase = createServerOnlyFn(() =>
  drizzle(process.env.DATABASE_URL!, {
    relations,
  }),
);

export const db = createDatabase();
