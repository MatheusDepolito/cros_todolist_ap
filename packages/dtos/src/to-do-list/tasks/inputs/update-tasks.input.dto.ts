import { TaskStatus } from '../enums/task-status.enum';

export type UpdateTasksInputDTO = {
  title?: string;
  status?: TaskStatus;
  description?: string;
  subTasks?: UpdateSubTasksInputDTO[];
};

export type UpdateSubTasksInputDTO = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  subTasks?: UpdateSubTasksInputDTO[];
};
