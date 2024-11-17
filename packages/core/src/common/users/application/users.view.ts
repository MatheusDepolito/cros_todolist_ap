import { User } from '../domain/user.model';
import {
  CreateUsersOutputDTO,
  FindOneUsersOutputDTO,
  FindManyUsersOutputDTO,
} from '@cros_todolist/dtos';

export class UsersView {
  create(user: User): CreateUsersOutputDTO | undefined {
    if (!user) {
      return;
    }

    return {
      id: user.id,
    };
  }

  findOne(user: User | null): FindOneUsersOutputDTO | undefined {
    if (!user) {
      return;
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  findMany(users: User[]): FindManyUsersOutputDTO[] {
    if (!users) {
      return [];
    }

    return users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
    }));
  }
}
