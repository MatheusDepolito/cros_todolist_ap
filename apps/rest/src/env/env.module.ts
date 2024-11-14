import { EnvServiceProvider } from './env.provider';
import { Global, Module as NestModule } from '@nestjs/common';

@Global()
@NestModule({
  imports: [],
  controllers: [],
  providers: [EnvServiceProvider],
  exports: [EnvServiceProvider],
})
export class EnvModule {}
