import { vi } from 'vitest';
import { ITasksRepository } from '../../../../src';

export class TaskRepositoryFactory {
  #props: ITasksRepository;

  constructor() {
    this.#props = {
      findOne: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      exists: vi.fn(),
      exclusive: vi.fn(),
      createMany: vi.fn(),
      deleteByTaskParentId: vi.fn(),
      updateMany: vi.fn(),
    };
  }

  static create() {
    return new TaskRepositoryFactory();
  }

  build() {
    return this.#props;
  }
}
