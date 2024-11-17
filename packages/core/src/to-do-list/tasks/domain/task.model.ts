import { TaskStatus } from '@cros_todolist/dtos';
import { CoreError } from '../../../shared/errors/application/core-error';
import { isEnum, isUUID, isString, maxLength, isNotEmpty } from 'class-validator';
import { CoreErrorCode } from '../../../shared/errors/application/core-error-code.enum';

export type TaskProps = Omit<Task, 'update'>;
export type CreateTaskProps = Pick<
  TaskProps,
  'title' | 'description' | 'status' | 'userId' | 'parentTaskId'
>;
export type UpdateTaskProps = Partial<Pick<TaskProps, 'title' | 'description' | 'status'>>;

export class TaskError extends CoreError {}

export class Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  userId: string;
  parentTaskId: string | null;
  createdAt: Date;
  updatedAt: Date;
  subTasks: Task[];

  private constructor(props: TaskProps) {
    Object.assign(this, props);
  }

  static create(props: CreateTaskProps): Task {
    const task = new Task({
      id: crypto.randomUUID(),
      title: props.title,
      description: props.description,
      status: props.status,
      userId: props.userId,
      parentTaskId: props.parentTaskId,
      createdAt: new Date(),
      updatedAt: new Date(),
      subTasks: [],
    });

    task.#validate();

    return task;
  }

  static load(props: TaskProps): Task {
    const task = new Task({
      id: props.id,
      title: props.title,
      description: props.description,
      status: props.status,
      userId: props.userId,
      parentTaskId: props.parentTaskId,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      subTasks: props.subTasks,
    });

    task.#validate();

    return task;
  }

  update(props: UpdateTaskProps) {
    if (props.title !== undefined) this.title = props.title;
    if (props.description !== undefined) this.description = props.description;
    if (props.status !== undefined) this.status = props.status;

    this.updatedAt = new Date();

    this.#validate();
  }

  #validate() {
    const messages: string[] = [];

    if (!isNotEmpty(this.id)) messages.push('id should not be empty');
    if (!isUUID(this.id, 4)) messages.push('id must be a UUID');

    if (!isNotEmpty(this.title)) messages.push('title should not be empty');
    if (!isString(this.title)) messages.push('title must be a string');
    if (!maxLength(this.title, 64))
      messages.push('title must be a shorter than or equal to 64 characters');

    if (this.description) {
      if (!isString(this.description)) messages.push('description must be a string');
    }

    if (!isNotEmpty(this.status)) messages.push('status should not be empty');
    if (!isEnum(this.status, TaskStatus))
      messages.push(
        `status must be one of the following values: ${Object.values(TaskStatus).join(', ')}`,
      );

    if (messages.length > 0) {
      throw new TaskError(messages.join(', '), CoreErrorCode.UNPROCESSABLE_ENTITY);
    }
  }
}
