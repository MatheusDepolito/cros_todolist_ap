import { UsersView, UsersService } from '@cros_todolist/core';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { ParamUUID } from '../../../shared/decorators/param-uuid.decorator';
import {
  Get,
  Put,
  Body,
  Post,
  Query,
  Delete,
  Inject,
  UseGuards,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateUsersInputDTO,
  DeleteUsersInputDTO,
  UpdateUsersInputDTO,
  FindManyUsersInputDTO,
  CrosToDoListControllerResponseDTO,
} from '@cros_todolist/dtos';

@UseGuards(AuthGuard)
@UseInterceptors()
@Controller('users')
export class UsersController {
  constructor(
    @Inject('UsersView')
    private readonly usersView: UsersView,
    @Inject('UsersService')
    private readonly usersService: UsersService,
  ) {}

  @Get(':id')
  async findOne(@ParamUUID('id') id: string): Promise<CrosToDoListControllerResponseDTO> {
    const user = await this.usersService.findOne({ id });

    const data = this.usersView.findOne(user);

    return { data };
  }

  @Get()
  async findMany(
    @Query() filters: FindManyUsersInputDTO,
  ): Promise<CrosToDoListControllerResponseDTO> {
    const users = await this.usersService.findMany({
      filters,
    });

    const data = this.usersView.findMany(users);

    return {
      data,
    };
  }

  @Post()
  async create(
    @Body() createUserDTO: CreateUsersInputDTO,
  ): Promise<CrosToDoListControllerResponseDTO> {
    const user = await this.usersService.create({
      createUserDTO,
    });

    const data = this.usersView.create(user);

    return { data };
  }

  @Put(':id')
  async update(@ParamUUID('id') id: string, @Body() updateUserDTO: UpdateUsersInputDTO) {
    await this.usersService.update({
      id,
      updateUserDTO,
    });
  }

  @Delete(':id')
  async delete(@Query() deleteUserDTO: DeleteUsersInputDTO, @ParamUUID('id') id: string) {
    await this.usersService.delete({
      id,
      loggedUserId: deleteUserDTO.loggedUserId,
    });
  }
}
