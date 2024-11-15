import { JwtService } from '@nestjs/jwt';
import { Provider } from '@nestjs/common';

export const JwtServiceProvider: Provider = {
  provide: 'IJwtService',
  inject: [],
  useFactory: () => new JwtService(),
};
