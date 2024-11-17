import { TaskStatus } from '../enums/task-status.enum';

export type FindOneTasksOutputDTO = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  parentTaskId: string | null;
  createdAt: Date;
  updatedAt: Date;
  subTasks?: FindOneTasksOutputDTO[];
};
