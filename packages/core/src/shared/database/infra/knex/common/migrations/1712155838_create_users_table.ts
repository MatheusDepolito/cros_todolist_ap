import { Knex } from 'knex';
import { IKnexCommonMigrations } from '../knex-common-migrations.service';

export default class KnexCommonMigrations implements IKnexCommonMigrations {
  async up(knex: Knex): Promise<void> {
    const usersTableExists = await knex.schema.withSchema('common').hasTable('users');

    if (!usersTableExists) {
      await knex.schema.withSchema('common').createTable('users', (builder) => {
        builder.string('id').primary().notNullable();
        builder.string('username').notNullable();
        builder.string('email').nullable();
        builder.string('password').notNullable();
        builder.dateTime('created_at').notNullable();
        builder.dateTime('updated_at').notNullable();

        builder.unique(['email']);
        builder.unique(['username']);

        builder.index(['id']);
        builder.index(['email']);
        builder.index(['username']);
      });
    }
  }

  async down(knex: Knex): Promise<void> {
    await knex.schema.withSchema('common').dropTableIfExists('users');
  }
}
