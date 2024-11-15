import { Module } from "@nestjs/common";
import { EnvModule } from "../env/env.module";
import { DatabaseModule } from "../database/database.module";
import { HttpModule } from "../http/http.module";
import { CrosToDoListInterceptor } from "../http/shared/interceptors/to-do-list.response.interceptor";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [EnvModule, DatabaseModule, HttpModule],
  controllers: [],
  providers: [],
})
export class AppModule {}