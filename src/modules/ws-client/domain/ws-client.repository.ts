import { Injectable } from "@nestjs/common";
import { ClientsMap, ClientSockets } from "../types/ws-client.type";
import { Socket } from "socket.io";
import { FileRequest } from "../types/tasks.type";
import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";
import type { UserModel } from "@/src/repository/db/user/user.schema";

@Injectable()
export class WsClientRepository {
  clients = new Map() as ClientsMap;

  constructor(private readonly redisRepository: RedisRepository) {}

  addClient(clientid: string, data: ClientSockets) {
    this.clients.set(clientid, data);
  }

  removeClient(clientid: string) {
    this.clients.delete(clientid);
  }
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

  async removeAllClients() {
    await Promise.all(
      // eslint-disable-next-line @typescript-eslint/require-await
      [...this.clients.values()].map(async client => {
        client.socket.disconnect();
      }),
    );

    this.clients.clear();
  }
}
