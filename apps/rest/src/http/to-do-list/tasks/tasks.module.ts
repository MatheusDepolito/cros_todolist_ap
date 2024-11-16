import { TasksView } from "@cros_todolist/core";
import { Module } from "@nestjs/common";
import { TasksRepositoryProvider, TasksServiceProvider, TasksViewProvider } from "./tasks.provider";
import { TasksController } from "./controllers/tasks.controller";



@Module({
  imports: [],
  controllers: [TasksController],
  providers: [
    TasksViewProvider,
    TasksServiceProvider,
    TasksRepositoryProvider,
  ],
  exports: [],
})
export class TasksModule {}