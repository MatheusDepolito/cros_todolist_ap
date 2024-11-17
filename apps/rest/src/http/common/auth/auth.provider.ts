import { Provider } from '@nestjs/common';
import {
  EnvService,
  AuthService,
  IJwtService,
  UsersService,
  IUsersRepository,
} from '@cros_todolist/core';

export const AuthServiceProvider: Provider = {
  provide: 'AuthService',
  inject: ['EnvService', 'IJwtService', 'IUsersRepository', 'UsersService'],
  useFactory: (
    envService: EnvService,
    jwtService: IJwtService,
    usersRepository: IUsersRepository,
    usersService: UsersService,
  ) => {
    return new AuthService(envService, jwtService, usersRepository, usersService);
  },
};
