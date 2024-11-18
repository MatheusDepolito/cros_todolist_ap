import { IUnitOfWorkService } from '@cros_todolist/core';

export class UnitOfWorkServiceFactory {
  #props: IUnitOfWorkService;

  constructor() {
    this.#props = {
      transaction: async (callback) => {
        return await callback({} as any);
      },
    };
  }

  static create() {
    return new UnitOfWorkServiceFactory();
  }

  build() {
    return this.#props;
  }
}
