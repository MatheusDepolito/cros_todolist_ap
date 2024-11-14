import { Provider } from '@nestjs/common';
import { EnvService } from '@cros_todolist/core';

export const EnvServiceProvider: Provider = {
  provide: 'EnvService',
  useFactory: () => new EnvService(),
};
