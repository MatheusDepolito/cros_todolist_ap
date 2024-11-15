import { Module } from "@nestjs/common";
import { UsersController } from "./controllers/users.controller";
import { UsersRepositoryProvider, UsersServiceProvider, UsersViewProvider } from "./users.provider";



@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    UsersViewProvider,
    UsersServiceProvider,
    UsersRepositoryProvider,
  ],
  exports: [],
})
export class UsersModule {}