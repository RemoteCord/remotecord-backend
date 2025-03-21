import { Module } from "@nestjs/common";

import { HealthController } from "./api/health.controller";
import { HealthCheckService, TerminusModule } from "@nestjs/terminus";
import { RedisHealthModule } from "@nestjs-modules/ioredis";

@Module({
  controllers: [HealthController],
  imports: [TerminusModule, RedisHealthModule],
})
export class HealthModule {}
