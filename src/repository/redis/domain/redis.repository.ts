import { LoggerService } from "@/src/modules/shared/providers";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { unknown } from "node_modules/@rspack/core/compiled/zod";

export type RedisCategories =
  | "explorer"
  | "permissions"
  | "connection-ws"
  | "client-data"
  | "client-commands-requests"
  | "keylogger"
  | "stats"
  | "ws"
  | "messages-bot";

@Injectable()
export class RedisRepository {
  constructor(
    private readonly logger: LoggerService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async HSET(
    params: [RedisCategories, string[]] | [RedisCategories],
    data: Record<string, any>,
    expire = false,
  ) {
    const [category, keys] = params;
    const formattedKey = keys ? `${category}:${keys.join(":")}` : category;

    this.logger.info(`Adding data to redis ${category} ${keys?.join(":")}`);

    await this.redis.hset(formattedKey, data);

    if (expire) await this.redis.expire(formattedKey, 3600);
  }

  async HGET<T = null>(
    params: [RedisCategories, string[]] | [RedisCategories],
    key: string,
  ) {
    const [category, keys] = params;
    const formattedKey = keys ? `${category}:${keys.join(":")}` : category;

    this.logger.info(`Getting data from redis ${formattedKey} ${key}`);

    return (await this.redis.hget(formattedKey, key)) as T;
  }
  async HGETALL<T>(params: [RedisCategories, string[]] | [RedisCategories]) {
    const [category, keys] = params;
    const formattedKey = keys ? `${category}:${keys.join(":")}` : category;

    // this.logger.info(`Getting all data from redis ${formattedKey}`);

    return (await this.redis.hgetall(formattedKey)) as T;
  }

  async HLEN(params: [RedisCategories, string[]] | [RedisCategories]) {
    const [category, keys] = params;
    const formattedKey = keys ? `${category}:${keys.join(":")}` : category;

    this.logger.info(`Getting length from redis ${formattedKey}`);

    return await this.redis.hlen(formattedKey);
  }

  async HKEYS(params: [RedisCategories, string[]] | [RedisCategories]) {
    const [category, keys] = params;
    const formattedKey = keys ? `${category}:${keys.join(":")}` : category;

    this.logger.info(`Getting keys from redis ${formattedKey}`);

    return await this.redis.hkeys(formattedKey);
  }
  async HDEL(
    params: [RedisCategories, string[]] | [RedisCategories],
    key: string,
  ) {
    const [category, keys] = params;
    const formattedKey = keys ? `${category}:${keys.join(":")}` : category;

    this.logger.info(`Deleting data from redis ${formattedKey} ${key}`);

    return await this.redis.hdel(formattedKey, key);
  }
  async HDELALL(params: [RedisCategories, string[]] | [RedisCategories]) {
    const [category, keys] = params;
    const formattedKey = keys ? `${category}:${keys.join(":")}` : category;

    const elements = await this.redis.hkeys(formattedKey);
    this.logger.info(
      `Deleting all data from redis ${formattedKey} ${elements}`,
    );
    if (elements.length === 0) return;

    await Promise.all(
      elements.map(async element => {
        await this.redis.hdel(formattedKey, element);
      }),
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

  async deleteEntityHash(
    category: RedisCategories,
    param: string,
    key: string | null = null,
  ) {
    try {
      this.logger.info(`Deleting hash data from redis ${category} ${key}`);
      return await this.redis.hdel(
        `${key ? `${category}:${key}` : category}`,
        param,
      );
    } catch (error) {
      console.log(error);
      this.logger.error(
        `Error deleting hash data from redis ${category} ${key}`,
      );
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

  async deleteAllFromCategoryHash(category: RedisCategories) {
    try {
      this.logger.info(`Deleting all hash data from redis ${category}`);
      const keys = await this.redis.keys(`${category}:*`);
      const pipeline = this.redis.pipeline();

      // Process each key
      for (const key of keys) {
        const type = await this.redis.type(key);
        if (type === "hash") {
          pipeline.del(key);
        }
      }

      return pipeline.exec();
    } catch (error) {
      console.log(error);
      this.logger.error(`Error deleting all hash data from redis ${category}`);
      return null;
    }
  }

  async getAllFromCategory<T>(
    category: RedisCategories,
    options = { parse: false, splitKey: false },
  ) {
    try {
      this.logger.info(`Getting all data from redis ${category}`);
      const keys = await this.redis.keys(`${category}:*`);

      // console.log("keys", keys);

      const result: { [key: string]: T } = {};
      await Promise.all(
        keys.map(async key => {
          const value = await this.redis.get(key);
          result[options.splitKey ? key.split(":")[1] : key] = (
            options.parse && value ? JSON.parse(value) : value
          ) as T;
        }),
      );
      return result;
    } catch (error) {
      console.log(error);
      this.logger.error(`Error getting all data from redis ${category}`);
    }
  }
}
