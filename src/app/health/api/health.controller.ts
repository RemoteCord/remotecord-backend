import { Controller, Get, HttpCode, Inject, Logger } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MongooseHealthIndicator,
} from "@nestjs/terminus";
@Controller("health")
export class HealthController {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    private readonly healthCheck: HealthCheckService,

    private mongooseHealth: MongooseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @HttpCode(200)
  run() {
    return this.healthCheck.check([
      () => this.mongooseHealth.pingCheck("mongoDB"),
    ]);

    // this.logger.log("Health endpoint called!");
    // return { status: "ok", mongo };
  }
}
