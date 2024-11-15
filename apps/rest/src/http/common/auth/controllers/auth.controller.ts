import { AuthService } from '@cros_todolist/core';
import { AuthLoginInputDTO, CreateUsersInputDTO, CrosToDoListControllerResponseDTO, CrosToDoListSuccesResponseDTO } from '@cros_todolist/dtos';
import { Body, Post, Inject, HttpCode, UseGuards, Controller } from '@nestjs/common';


@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AuthService')
    private readonly authService: AuthService,
  ) {}

  @Post('/login')
  @HttpCode(200)
  async login(@Body() authLoginDTO: AuthLoginInputDTO): Promise<CrosToDoListControllerResponseDTO> {
    const data = await this.authService.login({
      authLoginDTO,
    });

    return {
      data,
    };
  }

  @Post('/logout')
  @HttpCode(200)
  async logout(@Body() body: { token: string }): Promise<CrosToDoListControllerResponseDTO> {
    await this.authService.logout(body.token);
    return { data: { message: 'Logout successful' } };
  }

  @Post('/register')
  @HttpCode(200)
  async register(@Body() createUserDTO: CreateUsersInputDTO): Promise<CrosToDoListControllerResponseDTO> {
    const data = await this.authService.register({
      createUserDTO
    });

    return {
      data,
    };
  }
}