import { Task } from '../domain/task.model';
import {
  CreateTasksOutputDTO,
  FindOneTasksOutputDTO,
  FindManyTasksOutputDTO,
} from '@cros_todolist/dtos';

export class TasksView {
  findOne(task: Task | null): FindOneTasksOutputDTO | undefined {
    if (!task) {
      return;
    }

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      parentTaskId: task.parentTaskId,
      subTasks: task.subTasks?.map((subTask) => ({
        id: subTask.id,
        title: subTask.title,
        description: subTask.description,
        status: subTask.status,
        parentTaskId: subTask.parentTaskId,
        createdAt: subTask.createdAt,
        updatedAt: subTask.updatedAt,
        subTasks: subTask.subTasks?.map((complementaryTask) => ({
          ...complementaryTask,
          subTasks: [],
        })),
      })),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  findMany(tasks: Task[]): FindManyTasksOutputDTO[] {
    if (!tasks) {
      return [];
    }

    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      parentTaskId: task.parentTaskId,
    }));
  }

  create(task: Task): CreateTasksOutputDTO | undefined {
    if (!task) {
      return;
    }

    return {
      id: task.id,
    };
  }
}
