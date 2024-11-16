import { Knex } from 'knex';
import { IKnexCommonMigrations } from '../knex-common-migrations.service';

export default class KnexCommonMigrations implements IKnexCommonMigrations {
  async up(knex: Knex): Promise<void> {
    const tasksTableExists = await knex.schema.withSchema('common').hasTable('tasks');

    if (!tasksTableExists) {
      await knex.schema.withSchema('common').createTable('tasks', (builder) => {
        builder.string('id').primary().notNullable();
        builder.string('title').notNullable();
        builder.text('description').nullable();
        builder.string('status').notNullable();
        builder.string('user_id').notNullable(); // Foreign Key to users table
        builder.string('parent_task_id').nullable(); // Foreign Key to parent task
        builder.dateTime('created_at').notNullable();
        builder.dateTime('updated_at').notNullable();

        builder.foreign('user_id').references('id').inTable('common.users').onDelete('CASCADE');

        builder.index(['id']);
        builder.index(['status']);
      });
    }
  }

  async down(knex: Knex): Promise<void> {
    await knex.schema.withSchema('common').dropTableIfExists('tasks');
  }
}
