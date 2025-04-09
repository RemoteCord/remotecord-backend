import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { HealthModule } from "@/app/health/health.module";

// Update this import path
import { LoggerModule } from "@/modules/shared/logger/logger.module";

import { AuthModule } from "../modules/auth/auth.module";
import { WsClientModule } from "../modules/ws-client/ws-client.module";
import { SchemasModule } from "../repository/db/schemas.module";
import { configVar } from "../config/config-var";
import { ControllerModule } from "../modules/controller/controller.module";
import { WsBotModule } from "../modules/ws-bot/ws-bot.module";
import { WsApplicationModule } from "../modules/ws-application/ws-application.module";
import { ClientModule } from "../modules/client/infrastructure/client.module";
import { ScheduleModule } from "@nestjs/schedule";
import { CdnModule } from "../modules/cdn/cdn.module";
import { RedisServiceModule } from "../repository/redis/redis.module";
import { PublicModule } from "../modules/public/public.module";
import { SentryGlobalFilter, SentryModule } from "@sentry/nestjs/setup";
import { APP_FILTER } from "@nestjs/core";
import { StripeModule } from "../modules/stripe/stripe.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./environments/${process.env.NODE_ENV}.env`,
      load: [configVar],
    }),
    SentryModule.forRoot(),
    StripeModule.forRootAsync(),
    ScheduleModule.forRoot(),
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    LoggerModule,
    HealthModule,
    WsClientModule,
    CdnModule,
    WsBotModule,
    WsApplicationModule,
    SchemasModule,
    ControllerModule,
    ClientModule,
    RedisServiceModule,
    PublicModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
