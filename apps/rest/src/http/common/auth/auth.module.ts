import { UsersModule } from '../users/users.module';
import { JwtModule } from '../../../jwt/jwt.module';
import { Module as NestModule } from '@nestjs/common';
import { AuthServiceProvider } from './auth.provider';
import { AuthController } from './controllers/auth.controller';

@NestModule({
  imports: [UsersModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthServiceProvider],
  exports: [],
})
export class AuthModule {}
