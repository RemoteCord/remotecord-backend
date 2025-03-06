import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { HealthModule } from "@/app/health/health.module";

// Update this import path
import { LoggerModule } from "@/modules/shared/logger/logger.module";

import { AuthModule } from "../modules/auth/auth.module";
import { TestsModule } from "../modules/tests/tests.module";

@Module({
  imports: [
    MongooseModule.forRoot(
      "mongodb+srv://luqueee2007:FLbY1QfvH7aaz5sO@cluster0.2dk8kke.mongodb.net/classmate?retryWrites=true&w=majority",
    ),
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    LoggerModule,
    HealthModule,
    AuthModule,
    TestsModule,
  ],
})
export class AppModule {}
