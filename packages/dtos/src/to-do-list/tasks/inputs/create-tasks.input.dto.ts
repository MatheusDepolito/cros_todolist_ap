import { TaskStatus } from '../enums/task-status.enum';

export type CreateTasksInputDTO = {
  title: string;
  description: string | null;
  status: TaskStatus;
  userId: string;
  parentTaskId: string | null;
  subTasks: CreateTasksInputDTO[];
};
