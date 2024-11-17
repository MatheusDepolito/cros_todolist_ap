import { Module } from '@nestjs/common';
import { TasksView } from '@cros_todolist/core';
import { TasksController } from './controllers/tasks.controller';
import { TasksViewProvider, TasksServiceProvider, TasksRepositoryProvider } from './tasks.provider';

@Module({
  imports: [],
  controllers: [TasksController],
  providers: [TasksViewProvider, TasksServiceProvider, TasksRepositoryProvider],
  exports: [],
})
export class TasksModule {}
