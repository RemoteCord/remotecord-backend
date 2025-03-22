import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService, type ConfigType } from "@nestjs/config";

import { RedisModule } from "@nestjs-modules/ioredis";
import { Configuration } from "@/src/config/env.enum";
import { RedisRepository } from "./domain/redis.repository";

export const REDIS_MICROSERVICE_KEY = "REDIS_MICROSERVICE";

@Module({
  providers: [RedisRepository],
  exports: [RedisRepository],
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Parse Redis DB to ensure it's a valid integer
        const redisDbValue = configService.get(Configuration.REDIS_DB);
        const redisDb = parseInt(redisDbValue, 10);

        return {
          type: "single",
          url: `redis://${configService.get(Configuration.REDIS_HOST)}:${configService.get(Configuration.REDIS_PORT)}`,
          global: true,
          options: {
            username: configService.get(Configuration.REDIS_USERNAME),
            password: configService.get(Configuration.REDIS_PASSWORD),
            db: isNaN(redisDb) ? 0 : redisDb, // Default to 0 if not a valid number
            clusterRetryStrategy: (times: number) =>
              Math.min(times * 100, 3000),
          },
        };
      },
    }),
  ],
})
export class RedisServiceModule {}
