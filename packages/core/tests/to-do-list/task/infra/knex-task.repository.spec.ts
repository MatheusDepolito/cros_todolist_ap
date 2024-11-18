import knex, { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import { TaskFactory } from '@cros_todolist/tests';
import { initTestingForRepositories } from '../../..';
import { it, expect, describe, beforeAll, expectTypeOf } from 'vitest';
import { TaskRepositoryFactory } from '../factories/task.repository.factory';
import { TasksBuilder } from '@cros_todolist/tests/src/to-do-list/tasks/factories/task.factory';
import {
  Task,
  User,
  ITasksRepository,
  IUsersRepository,
  KnexTasksRepository,
  KnexUsersRepository,
} from '../../../../src';

describe(KnexTasksRepository.name, () => {
  let taskRepository: ITasksRepository;
  let userRepository: IUsersRepository;

  let existentTask: Task;
  let existentSubTasks: Task[];
  let existentUser: User;

  beforeAll(async () => {
    const { knexService, common } = await initTestingForRepositories();

    userRepository = new KnexUsersRepository(knexService);

    existentUser = common.user;

    await userRepository.findOne({
      id: common.user.id,
    });

    taskRepository = new KnexTasksRepository(knexService);

    existentSubTasks = await Promise.all(
      Array.from({ length: 3 }).map(async (_, index) => {
        const subTasks = await TaskFactory.model
          .load()
          .withParentTaskId(common.tasks.id)
          .withUserId(common.user.id)
          .build();

        return subTasks;
      }),
    );

    common.tasks.subTasks = existentSubTasks;

    existentTask = common.tasks;

    await taskRepository.createMany({
      tasks: existentSubTasks,
    });
  });

  describe(KnexTasksRepository.prototype.findOne.name, () => {
    it('should return a task', async () => {
      const foundTask = await taskRepository.findOne({
        id: existentTask.id,
        includes: {
          subTasks: true,
        },
      });

      expect(foundTask).not.toBeNull();
      expect(foundTask).toEqual(existentTask);
    });

    it('should return null when task does not exist', async () => {
      const foundTask = await taskRepository.findOne({
        id: faker.string.uuid(),
      });

      expect(foundTask).toBeNull();
    });
  });

  describe(KnexTasksRepository.prototype.findMany.name, () => {
    let userId: string;

    beforeAll(() => {
      userId = existentUser.id;
    });

    it('should return an array of tasks', async () => {
      const foundTasks = await taskRepository.findMany({
        userId: userId,
      });

      expect(foundTasks).not.toBeNull();
      expect(foundTasks).toBeInstanceOf(Array);
      expect(foundTasks.length).toBeGreaterThanOrEqual(0);
    });

    describe('should return an array of tasks filtered by', () => {
      it('status', async () => {
        const status = TasksBuilder.status();

        const foundTask = await taskRepository.findMany({
          userId,
          status,
        });

        expect(foundTask).not.toBeNull();
        expect(foundTask).toBeInstanceOf(Array);
        expect(foundTask.every((x) => x.status === status)).toBeTruthy();
      });
    });
  });

  describe(KnexTasksRepository.prototype.create.name, () => {
    it('should create a task', async () => {
      const task = await TaskFactory.model
        .load()
        .withUserId(existentUser.id)
        .withParentTaskId('')
        .build();

      await taskRepository.create({
        task,
      });

      const foundTask = await taskRepository.findOne({
        id: task.id,
      });

      expect(foundTask).not.toBeNull();
      expect(foundTask).toEqual(task);
    });
  });

  describe(KnexTasksRepository.prototype.update.name, () => {
    it('should update a task', async () => {
      const task = await TaskFactory.model
        .load()
        .withUserId(existentUser.id)
        .withParentTaskId('')
        .build();

      await taskRepository.create({
        task,
      });

      const updateTaskDTO = await TaskFactory.dtos.update().build();

      task.update({
        title: updateTaskDTO.title,
      });

      await taskRepository.update({
        task,
      });

      const foundTask = await taskRepository.findOne({
        id: task.id,
      });

      expect(foundTask).not.toBeNull();
      expect(foundTask).toEqual(task);
    });
  });
});
