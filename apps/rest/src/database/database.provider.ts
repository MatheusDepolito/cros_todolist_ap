import { Provider } from '@nestjs/common';
import {
  EnvService,
  KnexService,
  KnexDatabaseService,
  KnexUnitOfWorkService,
} from '@cros_todolist/core';

export const KnexServiceProvider: Provider = {
  provide: 'KnexService',
  inject: ['EnvService'],
  useFactory: (envService: EnvService) => new KnexDatabaseService(envService),
};

export const KnexUnitOfWorkProvider: Provider = {
  provide: 'IUnitOfWorkService',
  inject: ['KnexService'],
  useFactory: (knexService: KnexService) => new KnexUnitOfWorkService(knexService),
};
