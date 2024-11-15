import { AuthService, EnvService, IJwtService, IUsersRepository, UsersService } from "@cros_todolist/core";
import { Provider } from "@nestjs/common";

export const AuthServiceProvider: Provider = {
  provide: 'AuthService',
  inject: [
    'EnvService',
    'IJwtService',
    'IUsersRepository',
    'UsersService'
  ],
  useFactory: (
    envService: EnvService,
    jwtService: IJwtService,
    usersRepository: IUsersRepository,
    usersService: UsersService,
  ) => {
    return new AuthService(
      envService,
      jwtService,
      usersRepository,
      usersService,
    );
  },
};