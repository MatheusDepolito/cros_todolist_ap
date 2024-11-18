import { Task, TaskProps } from '../../../../src';
import { TaskFactory } from '@cros_todolist/tests';
import { it, expect, describe, beforeAll, beforeEach } from 'vitest';
import { TasksBuilder } from '@cros_todolist/tests/src/to-do-list/tasks/factories/task.factory';

describe(Task.name, () => {
  describe(Task.create.name, async () => {
    it('should create a task', async () => {
      const taskProps = await TaskFactory.props.create().build();

      const task = Task.create(taskProps);

      expect(task).not.toBeNull();
      expect(task).toBeInstanceOf(Task);
      expect(task).toEqual(expect.objectContaining(taskProps));
    });
  });

  describe(Task.load.name, () => {
    it('should load a task', async () => {
      const taskProps = await TaskFactory.props.props().build();

      const task = Task.load(taskProps);
      expect(task).not.toBeNull();
      expect(task).toBeInstanceOf(Task);
      expect(task).toEqual(expect.objectContaining(taskProps));
    });
  });

  describe(Task.prototype.update.name, () => {
    it('should update a task', async () => {
      const task = await TaskFactory.model.load().build();

      const taskProps = await TaskFactory.props.update().build();

      task.update(taskProps);

      expect(task).not.toBeNull();
      expect(task).toBeInstanceOf(Task);
      expect(task).toEqual(expect.objectContaining(taskProps));
    });

    describe('should update a specif property of task', () => {
      it.each([{ key: 'status' as const, value: TasksBuilder.status() }])(
        'when property $key is $value',
        async ({ key, value }) => {
          const task = await TaskFactory.model.load().build();

          task.update({ [key]: value });

          expect(task).not.toBeNull();
          expect(task).toBeInstanceOf(Task);
          expect(task[key]).toEqual(value);
        },
      );
    });
  });

  describe('validate', () => {
    let taskProps: TaskProps;

    beforeEach(async () => {
      taskProps = await TaskFactory.props.props().build();
    });

    describe.each(['id' as const])('%s', (key) => {
      describe('should throw an error', () => {
        it(`when ${key} is empty`, () => {
          taskProps[key] = '';

          expect(() => Task.load(taskProps)).toThrowError(`${key} should not be empty`);
        });

        it(`when ${key} is not a UUID`, () => {
          taskProps[key] = 'invalid-uuid';

          expect(() => Task.load(taskProps)).toThrowError(`${key} must be a UUID`);
        });
      });
    });

    describe.each(['title' as const])('%s', (key) => {
      describe('should throw an error', () => {
        it(`when ${key} is empty`, () => {
          taskProps[key] = '';

          expect(() => Task.load(taskProps)).toThrowError(`${key} should not be empty`);
        });
      });
    });
  });
});
