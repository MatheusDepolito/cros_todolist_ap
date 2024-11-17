import { Provider } from '@nestjs/common';
import {
  UsersView,
  AuthService,
  KnexService,
  UsersService,
  IUsersRepository,
  IUnitOfWorkService,
  KnexUsersRepository,
} from '@cros_todolist/core';

export const UsersViewProvider: Provider = {
  provide: 'UsersView',
  useFactory: () => new UsersView(),
};

export const UsersRepositoryProvider: Provider = {
  inject: ['KnexService'],
  provide: 'IUsersRepository',
  useFactory: (KnexService: KnexService) => new KnexUsersRepository(KnexService),
};

export const UsersServiceProvider: Provider = {
  provide: 'UsersService',
  inject: ['IUnitOfWorkService', 'IUsersRepository'],
  useFactory: (unitOfWork: IUnitOfWorkService, usersRepository: IUsersRepository) => {
    return new UsersService(unitOfWork, usersRepository);
  },
};
