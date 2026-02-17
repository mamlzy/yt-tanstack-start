import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const promptTable = pgTable('prompts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 100 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => new Date())
    .defaultNow()
    .notNull(),
});
