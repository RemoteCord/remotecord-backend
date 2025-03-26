import { LoggerService } from "@/src/modules/shared/providers";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import Redis from "ioredis";

type RedisCategories =
  | "explorer"
  | "permissions"
  | "connection-ws"
  | "ws-client-id"
  | "client-data"
  | "ws-application-id";

@Injectable()
export class RedisRepository {
  constructor(
    private readonly logger: LoggerService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async setEntity(
    category: RedisCategories,
    key: string,
    data: string,
    expire = false,
  ) {
    try {
      let res;
      const stringifiedData =
        typeof data === "object" ? JSON.stringify(data) : data;
      this.logger.info(`Adding data to redis ${category} ${key}`);

      if (!expire) {
        res = await this.redis.set(`${category}:${key}`, stringifiedData);
      } else {
        res = await this.redis.setex(
          `${category}:${key}`,
          3600,
          stringifiedData,
        );
      }
      this.logger.info(`Data added to redis ${category} ${key} result: ${res}`);
    } catch (error) {
      console.log(error);
      this.logger.error(`Error adding data to redis ${category} ${key}`);
    }
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

  async deleteEntity(category: RedisCategories, key: string) {
    try {
      this.logger.info(`Deleting data from redis ${category} ${key}`);
      return await this.redis.del(`${category}:${key}`);
    } catch (error) {
      console.log(error);
      this.logger.error(`Error deleting data from redis ${category} ${key}`);
    }
  }

  async deleteAllFromCategory(category: RedisCategories) {
    try {
      this.logger.info(`Deleting all data from redis ${category}`);
      const keys = await this.redis.keys(`${category}:*`);
      const pipeline = this.redis.pipeline();

      keys.forEach(key => {
        pipeline.del(key);
      });

      return pipeline.exec();
    } catch (error) {
      console.log(error);
      this.logger.error(`Error deleting all data from redis ${category}`);
    }
  }
}
