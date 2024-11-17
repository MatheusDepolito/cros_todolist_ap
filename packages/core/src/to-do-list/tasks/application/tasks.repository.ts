import { Task } from '../domain/task.model';
import { TaskStatus } from '@cros_todolist/dtos';

export interface ITasksRepository {
  findOne(params: FindOneTasksParams): Promise<Task | null>;
  findMany(params: FindManyTasksParams): Promise<Task[]>;
  create(params: CreateTasksParams): Promise<void>;
  update(params: UpdateTasksParams): Promise<void>;
  delete(params: DeleteTasksParams): Promise<void>;
  count(params: CountTasksParams): Promise<number>;
  exists(params: ExistsTasksParams): Promise<boolean>;
  exclusive(params: ExclusiveTasksParams): Promise<boolean>;

  createMany(params: CreateManySubTasksParams): Promise<void>;
  updateMany(params: UpdateManySubTaskParams): Promise<void>;
  deleteByTaskParentId(params: DeleteTasksParams): Promise<void>;
}

export type IncludesTasksParams = {
  subTasks?: boolean;
};

export type FindOneTasksParams = {
  id: string;
  includes?: IncludesTasksParams;
};

export type FindManyTasksParams = {
  title?: string;
  description?: string;
  status?: TaskStatus;
  parentTaskId?: string;
  userId: string;
};

export type CreateTasksParams<T = unknown> = {
  task: Task;
  transaction?: T;
};

export type UpdateTasksParams<T = unknown> = {
  task: Task;
  transaction?: T;
};

export type DeleteTasksParams<T = unknown> = {
  task: Task;
  transaction?: T;
};

export type CountTasksParams = {
  title?: string;
};

export type ExistsTasksParams = {
  id?: string;
  title?: string;
  userId: string;
};

export type ExclusiveTasksParams = {
  id: string;
  title?: string;
  userId: string;
};

export type CreateManySubTasksParams<T = unknown> = {
  tasks: Task[];
  transaction?: T;
};

export type UpdateManySubTaskParams<T = unknown> = {
  tasks: Task[];
  transaction?: T;
};

export type deleteByTaskParentId<T = unknown> = {
  task: Task;
  transaction?: T;
};
