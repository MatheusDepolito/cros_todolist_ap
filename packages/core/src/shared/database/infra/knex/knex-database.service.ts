import knex from 'knex';
import { KnexService } from './knex.service';
import { EnvService } from '../../../env/infra/env.service';

export class KnexDatabaseService extends KnexService {
  constructor(envService: EnvService) {
    super(
      knex({
        client: envService.e.database.client,
        connection: {
          ssl: envService.e.database.ssl,
          user: envService.e.database.user,
          host: envService.e.database.host,
          port: envService.e.database.port,
          database: envService.e.database.name,
          password: envService.e.database.password,
          filename: envService.e.database.filename,
          connectString: envService.e.database.connectionString,
        },
        useNullAsDefault: true,
      }),
    );
  }
}
