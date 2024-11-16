import { Module as NestModule } from '@nestjs/common';
import { UsersModule } from './common/users/users.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CrosToDoListInterceptor } from './shared/interceptors/to-do-list.response.interceptor';
import { AuthModule } from './common/auth/auth.module';
import { TasksModule } from './to-do-list/tasks/tasks.module';

@NestModule({
  imports: [
    UsersModule,
    AuthModule,
    TasksModule,
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