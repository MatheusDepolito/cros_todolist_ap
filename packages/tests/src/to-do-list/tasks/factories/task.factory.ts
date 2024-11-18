import { faker } from '@faker-js/faker';
import { Builder } from '../../../builder';
import { Task, TaskProps, CreateTaskProps, UpdateTaskProps } from '@cros_todolist/core';
import { TaskStatus, CreateTasksInputDTO, UpdateTasksInputDTO } from '@cros_todolist/dtos';

export class TaskFactory {
  static props = {
    props: () => TaskPropsBuilder.make(),
    create: () => CreateTaskPropsBuilder.make(),
    update: () => UpdateTaskPropsBuilder.make(),
  };

  static dtos = {
    create: () => CreateTaskDTOBuilder.make(),
    update: () => UpdateTaskDTOBuilder.make(),
  };

  static model = {
    create: () => CreateTaskBuilder.make(),
    load: () => LoadTaskBuilder.make(),
  };
}

export abstract class TasksBuilder<T> extends Builder<T> {
  static id() {
    return faker.string.uuid();
  }

  static title() {
    return faker.string.alphanumeric({ length: faker.number.int({ min: 1, max: 64 }) });
  }

  static description() {
    return faker.string.alphanumeric({ length: faker.number.int({ min: 1, max: 64 }) });
  }

  static status() {
    return faker.helpers.enumValue(TaskStatus);
  }

  static userId() {
    return faker.string.uuid();
  }

  static parentTaskId() {
    return faker.string.uuid();
  }

  static createdAt() {
    return faker.date.past();
  }

  static updatedAt() {
    return faker.date.recent();
  }
}

class CreateTaskDTOBuilder extends TasksBuilder<CreateTasksInputDTO> {
  static make() {
    const builder = new CreateTaskDTOBuilder({
      title: TasksBuilder.title(),
      description: TasksBuilder.description(),
      status: TasksBuilder.status(),
      userId: TasksBuilder.userId(),
      parentTaskId: TasksBuilder.parentTaskId(),
    });

    return builder;
  }

  withParentTaskId(id: string) {
    this.props.parentTaskId = id;
    return this;
  }

  withUserId(id: string) {
    this.props.userId = id;
    return this;
  }

  async build(): Promise<CreateTasksInputDTO> {
    const createTasksDTO: CreateTasksInputDTO = {
      title: this.props.title!,
      description: this.props.description!,
      status: this.props.status!,
      parentTaskId: this.props.parentTaskId!,
      userId: this.props.userId!,
      subTasks: this.props.subTasks!,
    };

    return createTasksDTO;
  }
}

class UpdateTaskDTOBuilder extends TasksBuilder<UpdateTasksInputDTO> {
  static make() {
    const builder = new UpdateTaskDTOBuilder({
      title: faker.helpers.arrayElement([TasksBuilder.title(), undefined]),
      description: faker.helpers.arrayElement([TasksBuilder.description(), undefined]),
      status: faker.helpers.arrayElement([TasksBuilder.status(), undefined]),
    });

    return builder;
  }

  async build() {
    const updateTaskDTO: UpdateTasksInputDTO = {
      title: this.props.title!,
      description: this.props.description!,
      status: this.props.status!,
      subTasks: this.props.subTasks!,
    };

    Builder.removeUndefinedFields(updateTaskDTO);

    return updateTaskDTO;
  }
}

class TaskPropsBuilder extends TasksBuilder<TaskProps> {
  static make() {
    const builder = new TaskPropsBuilder({
      id: TasksBuilder.id(),
      title: TasksBuilder.title(),
      description: TasksBuilder.description(),
      status: TasksBuilder.status(),
      userId: TasksBuilder.userId(),
      parentTaskId: TasksBuilder.parentTaskId(),
      createdAt: TasksBuilder.createdAt(),
      updatedAt: TasksBuilder.updatedAt(),
    });

    return builder;
  }

  async build() {
    const props: TaskProps = {
      id: this.props.id!,
      title: this.props.title!,
      description: this.props.description!,
      status: this.props.status!,
      userId: this.props.userId!,
      parentTaskId: this.props.parentTaskId!,
      createdAt: this.props.createdAt!,
      updatedAt: this.props.updatedAt!,
      subTasks: [],
    };

    return props;
  }
}

class CreateTaskPropsBuilder extends TasksBuilder<CreateTaskProps> {
  static make() {
    const builder = new CreateTaskPropsBuilder({
      title: TasksBuilder.title(),
      description: TasksBuilder.description(),
      status: TasksBuilder.status(),
      userId: TasksBuilder.userId(),
      parentTaskId: TasksBuilder.parentTaskId(),
    });

    return builder;
  }

  async build() {
    return {
      title: this.props.title!,
      description: this.props.description!,
      status: this.props.status!,
      userId: this.props.userId!,
      parentTaskId: this.props.parentTaskId!,
    };
  }
}

class UpdateTaskPropsBuilder extends TasksBuilder<UpdateTaskProps> {
  static make() {
    const builder = new UpdateTaskPropsBuilder({
      title: faker.helpers.arrayElement([TasksBuilder.title(), undefined]),
      description: faker.helpers.arrayElement([TasksBuilder.description(), undefined]),
      status: faker.helpers.arrayElement([TasksBuilder.status(), undefined]),
    });

    return builder;
  }

  async build() {
    const updateTaskProps: UpdateTaskProps = {
      title: this.props.title,
      description: this.props.description,
      status: this.props.status,
    };

    Builder.removeUndefinedFields(updateTaskProps);

    return updateTaskProps;
  }
}

class CreateTaskBuilder extends TasksBuilder<CreateTaskProps> {
  static make() {
    const builder = new CreateTaskBuilder({
      title: TasksBuilder.title(),
      description: TasksBuilder.description(),
      status: TasksBuilder.status(),
      userId: TasksBuilder.userId(),
      parentTaskId: TasksBuilder.parentTaskId(),
    });

    return builder;
  }

  withUserId(id: string) {
    this.props.userId = id;
    return this;
  }

  async build() {
    return Task.create({
      title: this.props.title!,
      description: this.props.description!,
      status: this.props.status!,
      parentTaskId: this.props.parentTaskId!,
      userId: this.props.userId!,
    });
  }
}

class LoadTaskBuilder extends TasksBuilder<TaskProps> {
  static make() {
    const builder = new LoadTaskBuilder({
      id: TasksBuilder.id(),
      title: TasksBuilder.title(),
      description: TasksBuilder.description(),
      status: TasksBuilder.status(),
      userId: 'd0b9100a-b3d8-427f-af18-e587a4fa468a',
      parentTaskId: TasksBuilder.parentTaskId(),
      createdAt: TasksBuilder.createdAt(),
      updatedAt: TasksBuilder.updatedAt(),
      subTasks: [],
    });

    return builder;
  }

  withParentTaskId(id: string) {
    this.props.parentTaskId = id;
    return this;
  }

  withUserId(id: string) {
    this.props.userId = id;
    return this;
  }

  async build() {
    return Task.load({
      id: this.props.id!,
      title: this.props.title!,
      description: this.props.description!,
      status: this.props.status!,
      parentTaskId: this.props.parentTaskId!,
      userId: this.props.userId!,
      createdAt: this.props.createdAt!,
      updatedAt: this.props.updatedAt!,
      subTasks: this.props.subTasks!,
    });
  }
}
