import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { HttpModule } from '../http/http.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [EnvModule, DatabaseModule, HttpModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
