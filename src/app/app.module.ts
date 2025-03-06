import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { HealthModule } from "@/app/health/health.module";

// Update this import path
import { LoggerModule } from "@/modules/shared/logger/logger.module";

import { AuthModule } from "../modules/auth/auth.module";
import { WsClientModule } from "../modules/ws-client/ws-client.module";
import { SchemasModule } from "../repository/schemas.module";
import { configVar } from "../config/config-var";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./environments/${process.env.NODE_ENV}.env`,
      load: [configVar],
    }),

    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    LoggerModule,
    HealthModule,
    AuthModule,
    WsClientModule,
    SchemasModule,
  ],
})
export class AppModule {}
