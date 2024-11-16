import { UsersService, UsersView } from "@cros_todolist/core";
import { Body, Controller, Delete, Get, Inject, Post, Put, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { ParamUUID } from "../../../shared/decorators/param-uuid.decorator";
import { CreateUsersInputDTO, CrosToDoListControllerResponseDTO, DeleteUsersInputDTO, FindManyUsersInputDTO, UpdateUsersInputDTO } from "@cros_todolist/dtos";
import { AuthGuard } from "../../../shared/guards/auth.guard";

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
  async findOne(
    @ParamUUID('id') id: string,
  ): Promise<CrosToDoListControllerResponseDTO> {
    const user = await this.usersService.findOne({ id });

    const data = this.usersView.findOne(user);

    return { data };
  }

  @Get()
  async findMany(@Query() filters: FindManyUsersInputDTO): Promise<CrosToDoListControllerResponseDTO> {
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
  async update(
    @ParamUUID('id') id: string,
    @Body() updateUserDTO: UpdateUsersInputDTO,
  ) {
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