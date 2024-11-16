import { TaskStatus } from "../enums/task-status.enum";

export type FindOneTasksOutputDTO = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  subTasks?: FindOneTasksOutputDTO[];
};