import { AuthService, IUnitOfWorkService, IUsersRepository, KnexService, KnexUsersRepository, UsersService, UsersView } from "@cros_todolist/core";
import { Provider } from "@nestjs/common";

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
  inject: [
    'IUnitOfWorkService',
    'IUsersRepository',
  ],
  useFactory: (
    unitOfWork: IUnitOfWorkService,
    usersRepository: IUsersRepository,
  ) => {
    return new UsersService(
      unitOfWork,
      usersRepository,
    );
  },
};