import { Module } from "@nestjs/common";

import { HealthController } from "./api/health.controller";
import { HealthCheckService, TerminusModule } from "@nestjs/terminus";

@Module({
  controllers: [HealthController],
  imports: [TerminusModule],
})
export class HealthModule {}
