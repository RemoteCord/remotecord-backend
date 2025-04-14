import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";
import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import Redis from "ioredis";

@Injectable()
export class PublicService {
  constructor(
    private readonly redisRepository: RedisRepository,
    private readonly controllerRepository: ControllerRepository,
  ) {}

  @Interval(10000)
  async fetchWsConnections() {
    // this.redis.hset("ws-application-id", "users", 0);
    const connections = await this.controllerRepository.getAllActiveClients();
    const clientsNum = await this.redisRepository.HLEN(["client-data"]);
    // console.log("wsConnections", clientsNum);
    if (!connections) {
      this.redisRepository.HSET(["stats"], {
        users: 0,
        clients: 0,
      });
      return;
    }

    this.redisRepository.HSET(["stats"], {
      connections: Object.keys(connections).length,
      clients: clientsNum,
    });
  }

  async getWsConnections() {
    const stats = await this.redisRepository.HGETALL<{
      users: number;
    } | null>(["stats"]);

    if (!stats) {
      return { users: 0 };
    }

    return stats;
  }
}
