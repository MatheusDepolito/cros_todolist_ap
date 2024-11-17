import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersViewProvider, UsersServiceProvider, UsersRepositoryProvider } from './users.provider';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersViewProvider, UsersServiceProvider, UsersRepositoryProvider],
  exports: [UsersRepositoryProvider, UsersServiceProvider],
})
export class UsersModule {}
