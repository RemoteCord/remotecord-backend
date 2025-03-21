import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService, type ConfigType } from "@nestjs/config";
import redisConfig, { REDIS_CONFIG_KEY } from "./redis.config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { RedisService } from "./application/redis.service";
import { RedisModule } from "@nestjs-modules/ioredis";
import { Configuration } from "@/src/config/env.enum";

export const REDIS_MICROSERVICE_KEY = "REDIS_MICROSERVICE";

const redisMicroserviceFactory = {
  provide: REDIS_MICROSERVICE_KEY,
  useFactory: (configService: ConfigService) => {
    const config =
      configService.get<ConfigType<typeof redisConfig>>(REDIS_CONFIG_KEY);
    return ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        ...config,
      },
    });
  },
  inject: [ConfigService],
};

@Module({
  // imports: [ConfigModule.forFeature(redisConfig)],
  // providers: [redisMicroserviceFactory, RedisService],
  // exports: [redisMicroserviceFactory, RedisService],
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
          clusterRetryStrategy: (times: any) => Math.min(times * 100, 3000),
        },
      }),
    }),
  ],
})
export class RedisServiceModule {}
