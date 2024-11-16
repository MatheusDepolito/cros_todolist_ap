import { Knex } from "knex";
import { IKnexCommonSeeds } from "../knex-common-seeds.service";
import { Task } from "../../../../../../to-do-list/tasks/domain/task.model";
import { TaskStatus } from "@cros_todolist/dtos";
import { TaskEntity } from "../../../../../../to-do-list/tasks/infra/entities/task-entity";
import { TasksMapper } from "../../../../../../to-do-list/tasks/infra/mappers/tasks.mapper";

export default class KnexCommonSeeds implements IKnexCommonSeeds {

  async up(knex: Knex): Promise<void> {

    const task = Task.load({
      id: crypto.randomUUID(),
      title: "test",
      description: null,
      status: TaskStatus.CONCLUDED,
      userId: "d0b9100a-b3d8-427f-af18-e587a4fa468a",
      createdAt: new Date(),
      updatedAt: new Date(),
      parentTaskId: "",
      subTasks: [],
    });

    const subTask = Task.load({
      id: crypto.randomUUID(),
      title: "test1",
      description: null,
      status: TaskStatus.CONCLUDED,
      userId: "d0b9100a-b3d8-427f-af18-e587a4fa468a",
      createdAt: new Date(),
      updatedAt: new Date(),
      parentTaskId: task.id,
      subTasks: [],
    });

    const complementaryTask = Task.load({
      id: crypto.randomUUID(),
      title: "test2",
      description: null,
      status: TaskStatus.CONCLUDED,
      userId: "d0b9100a-b3d8-427f-af18-e587a4fa468a",
      createdAt: new Date(),
      updatedAt: new Date(),
      parentTaskId: subTask.id,
      subTasks: [],
    });

    await knex<TaskEntity>(`common.tasks`).insert(TasksMapper.toPersistence(task));
    await knex<TaskEntity>(`common.tasks`).insert(TasksMapper.toPersistence(subTask));
    await knex<TaskEntity>(`common.tasks`).insert(TasksMapper.toPersistence(complementaryTask));
  }

  async down(knex: Knex): Promise<void> {
    await knex<TaskEntity>(`common.tasks`).delete();
  }
}