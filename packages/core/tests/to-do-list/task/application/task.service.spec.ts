import { stat } from 'fs';
import { time } from 'console';
import { faker } from '@faker-js/faker';
import { TaskStatus } from '@cros_todolist/dtos';
import { TaskFactory } from '@cros_todolist/tests';
import { initTestingForRepositories } from '../../..';
import { TaskRepositoryFactory } from '../factories/task.repository.factory';
import { it, vi, expect, describe, beforeAll, TaskState, beforeEach } from 'vitest';
import { TasksBuilder } from '@cros_todolist/tests/src/to-do-list/tasks/factories/task.factory';
import {
  Task,
  User,
  TasksService,
  ITasksRepository,
  IUnitOfWorkService,
} from '@cros_todolist/core';
import { UnitOfWorkServiceFactory } from '../../../shared/infra/database/factories/unit-of-work-service.factory';

describe(TasksService.name, () => {
  let userId: string;

  let existentTask: Task;
  let existentSubTasks: Task[];
  let existentUser: User;

  let taskService: TasksService;
  let taskRepositoryGlobalMock: ITasksRepository;
  let unitOfWorkServiceGlobalMock: IUnitOfWorkService;

  beforeAll(async () => {
    const { knexService, common } = await initTestingForRepositories();

    taskRepositoryGlobalMock = TaskRepositoryFactory.create().build();
    unitOfWorkServiceGlobalMock = UnitOfWorkServiceFactory.create().build();

    taskService = new TasksService(unitOfWorkServiceGlobalMock, taskRepositoryGlobalMock);

    existentUser = common.user;
    userId = common.user.id;

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

    Object.assign(taskService, {
      tasksRepository: {
        ...taskService['tasksRepository'],
        findOne: vi.fn().mockImplementation((params) => {
          if (params.id === existentTask.id) {
            if (params.includes?.subTasks) {
              return {
                ...existentTask,
                subTasks: existentSubTasks,
                userId: userId,
              };
            }

            return existentTask;
          }

          return null;
        }),
        findMany: vi.fn().mockImplementation((params) => {
          if (params.userId == userId) {
            return [existentTask];
          }

          return [];
        }),
        exists: vi.fn().mockImplementation((params) => {
          if (params.title == existentTask.title) {
            return true;
          }

          return false;
        }),
      },
    });
  });

  describe(TasksService.prototype.findOne, () => {
    it('should return a task', async () => {
      const task = await taskService.findOne({
        id: existentTask.id,
      });

      expect(task).toEqual(existentTask);
    });

    it('should return a sub tasks', async () => {
      const task = await taskService.findOne({
        id: existentTask.id,
        includes: {
          subTasks: true,
        },
      });

      expect(task).toEqual({
        ...existentTask,
        subTasks: existentSubTasks,
      });
    });

    it('should return null when task not exists', async () => {
      const task = await taskService.findOne({
        id: faker.string.uuid(),
      });

      expect(task).toBeNull();
    });
  });

  describe(TasksService.prototype.findOneOrThrow, () => {
    it('should return a task', async () => {
      const task = await taskService.findOneOrThrow({
        id: existentTask.id,
      });

      expect(task).toEqual(existentTask);
    });

    describe('should throw an error', () => {
      it('when task does not exist', async () => {
        const act = () =>
          taskService.findOneOrThrow({
            id: faker.string.uuid(),
          });

        await expect(act).rejects.toThrowError(/task error not found/);
      });
    });
  });

  describe(TasksService.prototype.create, () => {
    it('should create an task', async () => {
      const createTaskDTO = await TaskFactory.dtos
        .create()
        .withParentTaskId('')
        .withUserId(userId)
        .build();

      const task = await taskService.create({
        createTaskDTO: createTaskDTO,
        userId,
      });

      expect(task).not.toBeNull();
      expect(task).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: createTaskDTO.title,
          status: createTaskDTO.status,
          description: createTaskDTO.description,
        }),
      );
    });
  });

  describe(TasksService.prototype.update, () => {
    describe('should update an task', () => {
      it('when send title', async () => {
        await expect(
          taskService.update({
            id: existentTask.id,
            updateTaskDTO: {
              title: TasksBuilder.title(),
            },
            userId,
          }),
        ).resolves.not.toThrowError();
      });
    });
  });

  describe(TasksService.prototype.delete, () => {
    it('should delete an task', async () => {
      await expect(
        taskService.delete({
          id: existentTask.id,
        }),
      ).resolves.not.toThrowError();
    });
  });
});
