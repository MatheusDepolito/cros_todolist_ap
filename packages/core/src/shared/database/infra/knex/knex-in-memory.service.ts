import { newDb } from 'pg-mem';
import { KnexService } from './knex.service';

export class KnexInMemoryService extends KnexService {
  constructor() {
    super(newDb().adapters.createKnex());
  }
}
