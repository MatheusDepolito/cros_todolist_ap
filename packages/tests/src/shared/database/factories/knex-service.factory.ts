import { KnexInMemoryService } from '@cros_todolist/core';

export class KnexServiceFactory {
  constructor() {}

  static create() {
    return new KnexServiceFactory();
  }

  build() {
    return new KnexInMemoryService();
  }
}
