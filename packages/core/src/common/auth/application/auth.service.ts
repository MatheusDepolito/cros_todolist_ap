import * as bcrypt from 'bcrypt';
import { IJwtService } from './jwt.service';
import { EnvService } from '../../../shared/env/infra/env.service';
import { CoreError } from '../../../shared/errors/application/core-error';
import { User, UsersService, IUsersRepository } from '@cros_todolist/core';
import { CoreErrorCode } from '../../../shared/errors/application/core-error-code.enum';
import {
  AuthType,
  AuthLoginInputDTO,
  AuthLoginOutputDTO,
  CreateUsersInputDTO,
  AuthLoginPayloadOutputDTO,
} from '@cros_todolist/dtos';

export class AuthServiceError extends CoreError {}

export class AuthService {
  SIX_HOURS_IN_MS = 6 * 60 * 60 * 1000;
  THIRTY_MINUTES_IN_MS = 30 * 60 * 1000;

  private readonly tokenBlacklist: Set<string> = new Set();

  constructor(
    private readonly envService: EnvService,
    private readonly jwtService: IJwtService,
    private readonly usersRepository: IUsersRepository,
    private readonly usersService: UsersService,
  ) {}

  async logout(token: string): Promise<void> {
    this.tokenBlacklist.add(token);
  }

  isTokenRevoked(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }

  async register(params: RegisterParams): Promise<AuthLoginOutputDTO | undefined> {
    const { createUserDTO } = params;

    const user = await this.usersService.create({
      createUserDTO,
    });

    const userAuth = await this.login({
      authLoginDTO: {
        type: AuthType.EMAIL,
        email: user.email,
        password: createUserDTO.password,
      },
    });

    return userAuth;
  }

  async login(params: LoginParams): Promise<AuthLoginOutputDTO> {
    const { authLoginDTO } = params;

    const user = await this.#validate(authLoginDTO);

    const payload: AuthLoginPayloadOutputDTO = {
      sub: user.id,
    };

    return {
      expiresIn: this.THIRTY_MINUTES_IN_MS,
      accessToken: this.jwtService.sign(payload, {
        secret: this.envService.e.jwt.secret,
        expiresIn: this.THIRTY_MINUTES_IN_MS,
      }),
    };
  }

  async #validate(authDTO: AuthLoginInputDTO) {
    let user: User | null;

    switch (authDTO.type) {
      case AuthType.EMAIL:
        let u = await this.usersRepository.findMany({ email: authDTO.email ?? '' });
        user = u[0];
        break;
      case AuthType.USERNAME:
        let us = await this.usersRepository.findMany({ username: authDTO.username ?? '' });
        user = us[0];
        break;
      default:
        throw new AuthServiceError('Invalid auth type', CoreErrorCode.UNPROCESSABLE_ENTITY);
    }

    if (!user) {
      throw new AuthServiceError('auth error login or password incorrect', CoreErrorCode.NOT_FOUND);
    }

    const passwordMatch = await bcrypt.compare(authDTO.password, user.password);

    if (!passwordMatch) {
      throw new AuthServiceError('auth error login or password incorrect', CoreErrorCode.NOT_FOUND);
    }

    return user;
  }
}

type LoginParams = {
  authLoginDTO: AuthLoginInputDTO;
};

type RegisterParams = {
  createUserDTO: CreateUsersInputDTO;
};

type PermissionsParams = {
  userId: string;
};
