import { JwtServiceProvider } from './jwt.provider';
import { Global, Module as NestModule } from '@nestjs/common';

@Global()
@NestModule({
  imports: [],
  controllers: [],
  providers: [JwtServiceProvider],
  exports: [JwtServiceProvider],
})
export class JwtModule {}
