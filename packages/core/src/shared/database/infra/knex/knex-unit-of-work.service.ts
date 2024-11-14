import { Knex } from 'knex';
import { KnexService } from './knex.service';
import { IUnitOfWorkService } from '../../application/unit-of-work.service';

export class KnexUnitOfWorkService implements IUnitOfWorkService<Knex.Transaction> {
  constructor(readonly knexService: KnexService) {}

  async transaction<R>(callback: (transaction: Knex.Transaction) => Promise<R>): Promise<R> {
    return await this.knexService.q.transaction(async (transaction) => {
      return await callback(transaction);
    });
  }
}
