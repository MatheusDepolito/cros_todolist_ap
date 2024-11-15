import { Module as NestModule } from '@nestjs/common';
import { UsersModule } from './common/users/users.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CrosToDoListInterceptor } from './shared/interceptors/to-do-list.response.interceptor';

@NestModule({
  imports: [
    UsersModule,
  ],
  exports: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CrosToDoListInterceptor
    },
  ],
  controllers: [],
})
export class HttpModule {}