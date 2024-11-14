import { Knex } from 'knex';
import path from 'node:path';
import { KnexService } from '@cros_todolist/core';
import { KnexMigrations } from '../knex-migrations.service';

export interface IKnexCommonMigrations {
  up(knex: Knex): Promise<void>;
  down(knex: Knex): Promise<void>;
}

export class KnexCommonMigrationsService extends KnexMigrations {
  constructor(private readonly knexService: KnexService) {
    super('common');
  }

  async up() {
    const { migrationsPath, migrationsFiles } = await this.getMigrations();

    migrationsFiles.sort((a, b) => a.localeCompare(b));

    for (const migrationsFile of migrationsFiles) {
      try {
        const knexCommonMigrations: IKnexCommonMigrations = new (
          await import(path.resolve(migrationsPath, migrationsFile))
        ).default();

        await knexCommonMigrations.up(this.knexService.q);
      } catch (error) {
        console.warn(error);
      }
    }
  }

  async down() {
    const { migrationsPath, migrationsFiles } = await this.getMigrations();

    migrationsFiles.sort((a, b) => a.localeCompare(b)).reverse();

    for (const migrationsFile of migrationsFiles) {
      try {
        const knexCommonMigration: IKnexCommonMigrations = new (
          await import(path.resolve(migrationsPath, migrationsFile))
        ).default();

        await knexCommonMigration.down(this.knexService.q);
      } catch (error) {
        console.warn(error);
      }
    }
  }
}
