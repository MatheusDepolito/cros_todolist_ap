import { Knex } from 'knex';
import { User } from '../../../domain/user.model';
import { UserEntity } from '../entities/user.entity';
import { UsersMapper } from '../mappers/users.mapper';
import { KnexService } from '../../../../../shared/database/infra/knex/knex.service';
import {
  CountUsersParams,
  IUsersRepository,
  CreateUsersParams,
  DeleteUsersParams,
  ExistsUsersParams,
  FindOneUserParams,
  UpdateUsersParams,
  FindManyUsersParams,
  ExclusiveUsersParams,
} from '../../../application/users.repository';

export class KnexUsersRepository implements IUsersRepository {
  constructor(private readonly knexService: KnexService) {}

  async findOne(params: FindOneUserParams): Promise<User | null> {
    const { id } = params;

    const userEntity = await this.knexService.q<UserEntity>('common.users').where({ id }).first();

    if (!userEntity) {
      console.log('test');
      return null;
    }

    return UsersMapper.toDomain(userEntity);
  }

  async findMany(params: FindManyUsersParams): Promise<User[]> {
    const { ...filters } = params;

    let query = this.knexService.q<UserEntity>(`common.users`);

    query = this.#buildWhere({ query, filters });

    const usersEntities = await query.orderBy('username');

    return usersEntities.map(UsersMapper.toDomain);
  }

  async create(params: CreateUsersParams<Knex.Transaction>): Promise<void> {
    const { user, transaction } = params;

    const query = transaction ?? this.knexService.q;

    await query<UserEntity>('common.users').insert(UsersMapper.toPersistence(user));
  }

  async update(params: UpdateUsersParams<Knex.Transaction>): Promise<void> {
    const { user, transaction } = params;

    const query = transaction ?? this.knexService.q;

    await query<UserEntity>('common.users').where({ id: user.id }).update({
      username: user.username,
      email: user.email,
      password: user.password,
      updated_at: user.updatedAt,
    });
  }

  async delete(params: DeleteUsersParams<Knex.Transaction>): Promise<void> {
    const { user, transaction } = params;

    const query = transaction ?? this.knexService.q;

    await query<UserEntity>('common.users').where({ id: user.id }).delete();
  }

  async count(params: CountUsersParams): Promise<number> {
    const { ...filters } = params;

    let query = this.knexService.q<UserEntity>('common.users');

    query = this.#buildWhere({ query, filters });

    const counter = await query.count({ count: '*' }).first();

    return Number(counter?.count);
  }

  async exclusive(params: ExclusiveUsersParams): Promise<boolean> {
    const { id, ...filters } = params;

    let query = this.knexService.q<UserEntity>('common.users');

    query = this.#buildWhere({ query, filters });

    const counter = await query.whereNot('id', id).count({ count: '*' }).first();

    return Number(counter?.count) > 0;
  }

  async exists(params: ExistsUsersParams): Promise<boolean> {
    const { ...filters } = params;

    let query = this.knexService.q<UserEntity>('common.users');

    query = this.#buildWhere({ query, filters });

    const counter = await query.count({ count: '*' }).first();

    return Number(counter?.count) > 0;
  }

  #buildWhere({ query, filters }: BuildWhereParams) {
    const { id, email, username } = filters;

    if (id !== undefined) {
      query = query.where('id', id);
    }

    if (username !== undefined) {
      query = query.whereILike('username', username);
    }

    if (email !== undefined) {
      query = query.where('email', email);
    }

    return query;
  }
}

type BuildWhereParams = {
  query: Knex.QueryBuilder;
  filters: {
    id?: string;
    email?: string;
    username?: string;
  };
};
