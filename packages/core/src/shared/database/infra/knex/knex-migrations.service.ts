import path from 'node:path';
import fs from 'node:fs/promises';

const __dirname = new URL('.', import.meta.url).pathname;

export abstract class KnexMigrations {
  constructor(private readonly prefix: string) {}

  async getMigrations() {
    const migrationsPath = path.resolve(__dirname, this.prefix, 'migrations');
    const migrationsFiles = await fs.readdir(migrationsPath);

    return {
      migrationsPath,
      migrationsFiles,
    };
  }
}
