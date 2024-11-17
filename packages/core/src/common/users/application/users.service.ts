import { User } from '../domain/user.model';
import { IUsersRepository } from './users.repository';
import { CoreError } from '../../../shared/errors/application/core-error';
import { CoreErrorCode } from '../../../shared/errors/application/core-error-code.enum';
import { IUnitOfWorkService } from '../../../shared/database/application/unit-of-work.service';
import {
  CreateUsersInputDTO,
  UpdateUsersInputDTO,
  FindManyUsersInputDTO,
} from '@cros_todolist/dtos';

export class UsersServiceError extends CoreError {}

export class UsersService {
  constructor(
    private readonly unitOfWork: IUnitOfWorkService,
    private readonly usersRepository: IUsersRepository,
  ) {}

  async findOne(params: FindOneParams) {
    const { id } = params;

    const user = await this.usersRepository.findOne({
      id,
    });

    if (!user) {
      throw new UsersServiceError('user not found', CoreErrorCode.NOT_FOUND);
    }

    return user;
  }

  async findOneOrThrow(params: FindOneOrThrowParams) {
    const { id } = params;

    const user = await this.findOne({ id });

    if (!user) {
      throw new UsersServiceError('user not found', CoreErrorCode.NOT_FOUND);
    }

    return user;
  }

  async findMany(params: FindManyParams) {
    const { filters } = params;

    return await this.usersRepository.findMany({
      email: filters?.email,
      username: filters?.username,
    });
  }

  async create(params: CreateParams) {
    const { createUserDTO } = params;

    await this.#checkConflicts({
      email: createUserDTO.email,
      username: createUserDTO.username,
    });

    const user = await User.create({
      email: createUserDTO.email,
      password: createUserDTO.password,
      username: createUserDTO.username,
    });

    await this.unitOfWork.transaction(async (transaction) => {
      await this.usersRepository.create({
        user,
        transaction,
      });
    });

    return user;
  }

  async update(params: UpdateParams) {
    const { id, updateUserDTO } = params;

    await this.#checkConflicts({
      id,
      email: updateUserDTO.email,
      username: updateUserDTO.username,
    });

    const user = await this.findOneOrThrow({ id });

    await user.update({
      email: updateUserDTO.email,
      password: updateUserDTO.password,
      username: updateUserDTO.username,
    });

    await this.unitOfWork.transaction(async (transaction) => {
      await this.usersRepository.update({
        user,
        transaction,
      });
    });
  }

  async delete(params: DeleteParams) {
    const { id, loggedUserId } = params;

    if (loggedUserId && loggedUserId === id) {
      throw new UsersServiceError(
        'user cannot remove own user',
        CoreErrorCode.UNPROCESSABLE_ENTITY,
      );
    }

    const user = await this.findOneOrThrow({ id });

    await this.unitOfWork.transaction(async (transaction) => {
      await this.usersRepository.delete({ user, transaction });
    });
  }

  async #checkConflicts(params: CheckConflictParams) {
    const { id, email, username } = params;

    const messages: string[] = [];

    if (email) {
      await this.#checkEmailConflict({ id, email, messages });
    }

    if (username) {
      await this.#checkUsernameConflict({ id, username, messages });
    }

    if (messages.length > 0) {
      throw new UsersServiceError(messages.join(', '), CoreErrorCode.UNPROCESSABLE_ENTITY);
    }
  }

  async #checkEmailConflict(params: CheckEmailConflictParams) {
    const { id, email, messages } = params;

    const exists = !id
      ? () => this.usersRepository.exists({ email: email })
      : () => this.usersRepository.exclusive({ id, email: email });

    const emailExists = await exists();

    if (emailExists) {
      messages.push('user email already exists');
    }
  }

  async #checkUsernameConflict(params: CheckUsernameConflictParams) {
    const { id, username, messages } = params;

    const exists = !id
      ? () => this.usersRepository.exists({ username: username })
      : () => this.usersRepository.exclusive({ id, username: username });

    const usernameExists = await exists();

    if (usernameExists) {
      messages.push('user username already exists');
    }
  }
}

type FindOneParams = {
  id: string;
};

type FindOneOrThrowParams = FindOneParams & {};

type FindManyParams = {
  filters?: FindManyUsersInputDTO;
};

type CreateParams = {
  createUserDTO: CreateUsersInputDTO;
};

type UpdateParams = {
  id: string;
  updateUserDTO: UpdateUsersInputDTO;
};

type CheckConflictParams = {
  id?: string;
  username?: string;
  email?: string;
};

type CheckUsernameConflictParams = {
  id?: string;
  username: string;
  messages: string[];
};

type CheckEmailConflictParams = {
  id?: string;
  email: string;
  messages: string[];
};

type DeleteParams = {
  id: string;
  loggedUserId?: string;
};
