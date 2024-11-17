import { User } from '@cros_todolist/core';

export interface IUsersRepository {
  findOne(params: FindOneUserParams): Promise<User | null>;
  findMany(params: FindManyUsersParams): Promise<User[]>;
  create(params: CreateUsersParams): Promise<void>;
  update(params: UpdateUsersParams): Promise<void>;
  delete(params: DeleteUsersParams): Promise<void>;
  count(params: CountUsersParams): Promise<number>;
  exists(params: ExistsUsersParams): Promise<boolean>;
  exclusive(params: ExclusiveUsersParams): Promise<boolean>;
}

export type FindOneUserParams = {
  id: string;
};

export type FindManyUsersParams = {
  username?: string;
  email?: string;
};

export type CreateUsersParams<T = unknown> = {
  user: User;
  transaction?: T;
};

export type UpdateUsersParams<T = unknown> = {
  user: User;
  transaction?: T;
};

export type DeleteUsersParams<T = unknown> = {
  user: User;
  transaction?: T;
};

export type CountUsersParams = {
  username?: string;
  email?: string;
};

export type ExistsUsersParams = {
  id?: string;
  username?: string;
  email?: string;
};

export type ExclusiveUsersParams = {
  id: string;
  username?: string;
  email?: string;
};
