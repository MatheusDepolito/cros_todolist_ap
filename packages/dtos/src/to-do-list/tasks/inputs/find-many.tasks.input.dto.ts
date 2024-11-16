import { TaskStatus } from "../enums/task-status.enum";

export type FindManyTasksInputDTO = {
  title?: string;
  status?: TaskStatus;
  parentTaskId?: string;
  userId: string;
};