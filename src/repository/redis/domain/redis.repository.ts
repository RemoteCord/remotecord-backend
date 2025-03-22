import { LoggerService } from "@/src/modules/shared/providers";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import Redis from "ioredis";

type RedisCategories = "explorer";

@Injectable()
export class RedisRepository {
  constructor(
    private readonly logger: LoggerService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async addEntity(category: RedisCategories, key: string, data: JSON | string) {
    this.logger.info(`Adding data to redis ${category} ${key}`);
    await this.redis.set(
      `${category}:${key}`,
      JSON.stringify(data),
      "EX",
      3600,
    );
  }

  async getEntity(category: RedisCategories, key: string) {
    try {
      this.logger.info(`Getting data from redis ${category} ${key}`);
      return await this.redis.get(`${category}:${key}`);
    } catch (error) {
      console.log(error);
      this.logger.error(`Error getting data from redis ${category} ${key}`);
      return null;
    }
  }
}
