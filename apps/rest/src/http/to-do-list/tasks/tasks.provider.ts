import { Provider } from '@nestjs/common';
import {
  TasksView,
  KnexService,
  TasksService,
  ITasksRepository,
  IUnitOfWorkService,
  KnexTasksRepository,
} from '@cros_todolist/core';

export const TasksViewProvider: Provider = {
  provide: 'TasksView',
  useFactory: () => new TasksView(),
};

export const TasksRepositoryProvider: Provider = {
  inject: ['KnexService'],
  provide: 'ITasksRepository',
  useFactory: (knexService: KnexService) => new KnexTasksRepository(knexService),
};

export const TasksServiceProvider: Provider = {
  provide: 'TasksService',
  inject: ['IUnitOfWorkService', 'ITasksRepository'],
  useFactory: (unitOfWork: IUnitOfWorkService, tasksRepository: ITasksRepository) => {
    return new TasksService(unitOfWork, tasksRepository);
  },
};
