import { Knex } from 'knex';
import { IKnexCommonMigrations } from '../knex-common-migrations.service';

export default class KnexCommonMigrations implements IKnexCommonMigrations {
  async up(knex: Knex): Promise<void> {
    await knex.schema.createSchemaIfNotExists('common');
  }

  async down(knex: Knex): Promise<void> {
    await knex.schema.dropSchemaIfExists('common');
  }
}
