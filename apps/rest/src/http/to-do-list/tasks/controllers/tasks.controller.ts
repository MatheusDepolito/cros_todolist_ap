import { TasksView, TasksService } from '@cros_todolist/core';
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
  CreateTasksInputDTO,
  UpdateTasksInputDTO,
  FindManyTasksInputDTO,
  CrosToDoListControllerResponseDTO,
} from '@cros_todolist/dtos';

@UseGuards(AuthGuard)
@UseInterceptors()
@Controller('tasks')
export class TasksController {
  constructor(
    @Inject('TasksView')
    private readonly tasksView: TasksView,
    @Inject('TasksService')
    private readonly tasksService: TasksService,
  ) {}

  @Get(':id')
  async findOne(@ParamUUID('id') id: string): Promise<CrosToDoListControllerResponseDTO> {
    const task = await this.tasksService.findOne({ id, includes: { subTasks: true } });

    const data = this.tasksView.findOne(task);

    return { data };
  }

  @Get()
  async findMany(@Query() filters: FindManyTasksInputDTO, @Query('userId') userId: string) {
    const { tasks } = await this.tasksService.findMany({
      filters,
      userId,
    });

    const data = this.tasksView.findMany(tasks);

    return {
      data,
    };
  }

  @Post()
  async create(
    @Body() createTaskDTO: CreateTasksInputDTO,
    @Query('userId') userId: string,
  ): Promise<CrosToDoListControllerResponseDTO> {
    const task = await this.tasksService.create({
      createTaskDTO,
      userId,
    });

    const data = this.tasksView.create(task);

    return {
      data,
    };
  }

  @Put(':id')
  async update(
    @ParamUUID('id') id: string,
    @Query('userId') userId: string,
    @Body() updateTaskDTO: UpdateTasksInputDTO,
  ) {
    await this.tasksService.update({
      id,
      updateTaskDTO,
      userId,
    });
  }

  @Delete(':id')
  async delete(@ParamUUID('id') id: string) {
    await this.tasksService.delete({
      id,
    });
  }
}
