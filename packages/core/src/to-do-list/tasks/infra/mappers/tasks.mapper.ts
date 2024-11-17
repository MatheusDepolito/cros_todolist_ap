import { Task } from '../../domain/task.model';
import { TaskStatus } from '@cros_todolist/dtos';
import { TaskEntity } from '../entities/task-entity';

export class TasksMapper {
  static toDomain(task: TaskEntity): Task {
    return Task.load({
      id: task.id,
      title: task.title,
      description: task.description,
      status: TaskStatus[task.status as keyof typeof TaskStatus],
      userId: task.user_id,
      parentTaskId: task.parent_task_id,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      subTasks: task.subTasks?.map(TasksMapper.toDomain) ?? [],
    });
  }

  static toPersistence(task: Task): TaskEntity {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      user_id: task.userId,
      parent_task_id: task.parentTaskId,
      created_at: task.createdAt,
      updated_at: task.updatedAt,
    };
  }
}
