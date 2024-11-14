import path from 'node:path';
import fs from 'node:fs/promises';

const __dirname = new URL('.', import.meta.url).pathname;

export abstract class KnexSeeds {
  constructor(private readonly prefix: string) {}

  async getSeeds() {
    const seedsPath = path.resolve(__dirname, this.prefix, 'seeds');
    const seedsFiles = await fs.readdir(seedsPath);

    return {
      seedsPath,
      seedsFiles,
    };
  }
}
