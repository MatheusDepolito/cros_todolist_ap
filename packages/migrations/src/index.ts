import yargs from 'yargs/yargs';
import { 
  EnvService,
  KnexDatabaseService,
  KnexCommonSeedsService,
  KnexCommonMigrationsService,
 } from '@cros_todolist/core';

const args = yargs(process.argv)
  .option('command', {
    alias: 'c',
    type: 'string',
    demandOption: true,
  })
  .option('type', {
    alias: 't',
    type: 'string',
    demandOption: true,
  })
  .option('scope', {
    alias: 's',
    type: 'string',
    demandOption: true,
  })
  .parseSync();

async function main() {
  const envService = new EnvService();
  const knexService = new KnexDatabaseService(envService);

  const knexCommonSeedsService = new KnexCommonSeedsService(knexService);

  const knexCommonMigrationsService = new KnexCommonMigrationsService(knexService) 

  if(args.type === 'migrations') {
    switch (args.scope) {
      case 'common':
        await knexCommonMigrationsService[args.command as 'up' | 'down']();
        break;
    }
  } else if (args.type === 'seeds') {
    switch (args.scope) {
      case 'common':
        await knexCommonSeedsService[args.command as 'up' | 'down']();
        break;
    }
  }
}

main() 
  .then(() => process.exit())
  .catch((err) => console.log(err));