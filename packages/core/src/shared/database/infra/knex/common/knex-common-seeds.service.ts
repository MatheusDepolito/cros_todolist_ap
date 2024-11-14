import { Knex } from 'knex';
import path from 'node:path';
import { KnexService } from '../knex.service';
import { KnexSeeds } from '../knex-seeds.service';

export interface IKnexCommonSeeds {
  up(knex: Knex): Promise<void>;
  down(knex: Knex): Promise<void>;
}

export class KnexCommonSeedsService extends KnexSeeds {
  constructor(private readonly knexService: KnexService) {
    super('common');
  }

  async up() {
    const { seedsPath, seedsFiles } = await this.getSeeds();

    seedsFiles.sort((a, b) => a.localeCompare(b));

    for (const seedsFile of seedsFiles) {
      try {
        const knexTenantSeeds: IKnexCommonSeeds = new (
          await import(path.resolve(seedsPath, seedsFile))
        ).default();

        await knexTenantSeeds.up(this.knexService.q);
      } catch (error) {
        console.warn(error);
      }
    }
  }

  async down() {
    const { seedsPath, seedsFiles } = await this.getSeeds();

    seedsFiles.sort((a, b) => a.localeCompare(b)).reverse();

    for (const seedsFile of seedsFiles) {
      try {
        const knexTenantMigration: IKnexCommonSeeds = new (
          await import(path.resolve(seedsPath, seedsFile))
        ).default();

        await knexTenantMigration.down(this.knexService.q);
      } catch (error) {
        console.warn(error);
      }
    }
  }
}
