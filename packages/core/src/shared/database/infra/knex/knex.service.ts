import { Knex } from 'knex';

export class KnexService {
  q: Knex;

  constructor(q: Knex) {
    this.q = q;
  }
}
