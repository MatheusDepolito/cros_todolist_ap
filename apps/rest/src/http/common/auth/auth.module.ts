import { UsersModule } from '../users/users.module';
import { Module as NestModule } from '@nestjs/common';
import { AuthServiceProvider } from './auth.provider';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '../../../jwt/jwt.module';



@NestModule({
  imports: [UsersModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthServiceProvider],
  exports: [],
})
export class AuthModule {}