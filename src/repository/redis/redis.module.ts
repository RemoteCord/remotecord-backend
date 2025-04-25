import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService, type ConfigType } from "@nestjs/config";

import { RedisModule } from "@nestjs-modules/ioredis";
import { Configuration } from "@/src/config/env.enum";
import { RedisRepository } from "./domain/redis.repository";

export const REDIS_MICROSERVICE_KEY = "REDIS_MICROSERVICE";

@Global()
@Module({
  providers: [RedisRepository],
  exports: [RedisRepository],
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "single",
        url: `redis://${configService.get(Configuration.REDIS_HOST)}:${configService.get(Configuration.REDIS_PORT)}`,
        global: true,

        options: {
          username: configService.get(Configuration.REDIS_USERNAME),
          password: configService.get(Configuration.REDIS_PASSWORD),
          db: configService.get(Configuration.REDIS_DB),
          sentinelPassword: configService.get(Configuration.REDIS_PASSWORD),
        },
      }),
    }),
  ],
})
export class RedisServiceModule { }
