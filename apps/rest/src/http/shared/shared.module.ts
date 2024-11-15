import { Module } from '@nestjs/common';
import { AuthServiceProvider } from '../common/auth/auth.provider';

@Module({
  providers: [AuthServiceProvider],
  exports: [AuthServiceProvider],
})
export class SharedModule {}
