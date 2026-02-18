import * as p from 'drizzle-orm/pg-core';

export const promptTable = p.pgTable('prompts', {
  id: p.uuid('id').primaryKey().defaultRandom(),
  title: p.varchar('title', { length: 100 }).notNull(),
  content: p.text('content').notNull(),
  createdAt: p.timestamp('created_at').defaultNow().notNull(),
  updatedAt: p
    .timestamp('updated_at')
    .$onUpdate(() => new Date())
    .defaultNow()
    .notNull(),
});
