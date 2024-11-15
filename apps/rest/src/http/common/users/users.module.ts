import { Module } from "@nestjs/common";
import { UsersController } from "./controllers/users.controller";
import { UsersRepositoryProvider, UsersServiceProvider, UsersViewProvider } from "./users.provider";
import { AuthModule } from "../auth/auth.module";



@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    UsersViewProvider,
    UsersServiceProvider,
    UsersRepositoryProvider,
  ],
  exports: [UsersRepositoryProvider, UsersServiceProvider],
})
export class UsersModule {}