import * as p from 'drizzle-orm/pg-core';

export const promptTable = p.pgTable('prompts', {
  id: p.uuid('id').primaryKey().defaultRandom(),
  userId: p.uuid('user_id').references(() => userTable.id),
  title: p.varchar('title', { length: 100 }).notNull(),
  content: p.text('content').notNull(),
  createdAt: p.timestamp('created_at').defaultNow().notNull(),
  updatedAt: p
    .timestamp('updated_at')
    .$onUpdate(() => new Date())
    .defaultNow()
    .notNull(),
});

export const userTable = p.pgTable('users', {
  id: p.uuid('id').primaryKey().defaultRandom(),
  name: p.varchar('name', { length: 100 }).notNull(),
  email: p.varchar('email', { length: 255 }).notNull().unique(),
  password: p.varchar('password', { length: 255 }).notNull(),
  createdAt: p.timestamp('created_at').defaultNow().notNull(),
  updatedAt: p
    .timestamp('updated_at')
    .$onUpdate(() => new Date())
    .defaultNow()
    .notNull(),
});
