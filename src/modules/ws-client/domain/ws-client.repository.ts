import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { FileRequest } from "../types/tasks.type";
import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";
import type { UserModel } from "@/src/repository/db/user/user.schema";

@Injectable()
export class WsClientRepository {
  constructor(private readonly redisRepository: RedisRepository) {}

  async getClient(clientid: string) {
    const wsClientDataCache = await this.redisRepository.HGET(
      ["client-data"],
      clientid,
    );
    if (!wsClientDataCache) {
      // this.logger.error(`Client ${clientid} not found`);
      return null;
    }

    return JSON.parse(wsClientDataCache) as {
      clientid: string;
      email: string;
      name: string;
      controllerid: string;
    };

    // return this.clients.get(clientid);
  }
}
