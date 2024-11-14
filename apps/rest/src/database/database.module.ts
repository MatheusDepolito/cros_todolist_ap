import { Global, Module as NestModule } from '@nestjs/common';
import { KnexServiceProvider, KnexUnitOfWorkProvider } from './database.provider';

@Global()
@NestModule({
  imports: [],
  controllers: [],
  providers: [KnexServiceProvider, KnexUnitOfWorkProvider],
  exports: [KnexServiceProvider, KnexUnitOfWorkProvider],
})
export class DatabaseModule {}
