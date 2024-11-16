import { TaskStatus } from "../enums/task-status.enum";

export type FindManyTasksOutputDTO = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  parentTaskId: string | null;
};