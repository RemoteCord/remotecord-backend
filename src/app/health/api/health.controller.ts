import { RedisHealthIndicator } from "@nestjs-modules/ioredis";
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
    private redis: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @HttpCode(200)
  async run() {
    const mongo = await this.healthCheck.check([
      () => this.mongooseHealth.pingCheck("mongoDB"),
    ]);

    const redis = await this.redis.isHealthy("redis");

    return { redis, mongo };

    // this.logger.log("Health endpoint called!");
    // return { status: "ok", mongo };
  }
}
