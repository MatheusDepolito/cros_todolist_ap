import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module as NestModule } from '@nestjs/common';
import { AuthModule } from './common/auth/auth.module';
import { UsersModule } from './common/users/users.module';
import { TasksModule } from './to-do-list/tasks/tasks.module';
import { CrosToDoListInterceptor } from './shared/interceptors/to-do-list.response.interceptor';

@NestModule({
  imports: [UsersModule, AuthModule, TasksModule],
  exports: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CrosToDoListInterceptor,
    },
  ],
  controllers: [],
})
export class HttpModule {}
