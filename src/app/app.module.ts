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
import { ControllerModule } from "../modules/controller/controller.module";
import { WsBotModule } from "../modules/ws-bot/ws-bot.module";
import { WsApplicationModule } from "../modules/ws-application/ws-application.module";
import { ClientModule } from "../modules/client/infrastructure/client.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./environments/${process.env.NODE_ENV}.env`,
      load: [configVar],
    }),

    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    LoggerModule,
    HealthModule,
    WsClientModule,
    WsBotModule,
    WsApplicationModule,
    SchemasModule,
    ControllerModule,
    ClientModule,
  ],
})
export class AppModule {}
