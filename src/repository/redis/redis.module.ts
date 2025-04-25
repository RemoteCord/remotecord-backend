import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
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
      useFactory: (configService: ConfigService) => {
        const redisHost = configService.get(Configuration.REDIS_HOST);
        const redisPort = configService.get(Configuration.REDIS_PORT);
        const redisUsername = configService.get(Configuration.REDIS_USERNAME);
        const redisPassword = configService.get(Configuration.REDIS_PASSWORD);
        const redisDB = configService.get(Configuration.REDIS_DB);
        
        // Validate DB is a number
        const db = parseInt(redisDB, 10);
        
        return {
          type: "single",
          url: `redis://${redisHost}:${redisPort}`,
          global: true,
          options: {
            username: redisUsername,
            password: redisPassword,
            db: isNaN(db) ? 0 : db,
            // Use auth instead of username/password if needed
            // (this is redundant with the above but included for clarity)
            auth_pass: redisPassword,
          },
        };
      },
    }),
  ],
})
export class RedisServiceModule {}