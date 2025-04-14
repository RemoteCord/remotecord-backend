import { Injectable } from "@nestjs/common";
import { WsApplicationGateway } from "../infrastructure/ws-application.gateway";
import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";
import type { Socket } from "socket.io";

@Injectable()
export class WsApplicationRepository {
  constructor(private readonly redisRepository: RedisRepository) {}

  async removeAllClients(socket: Socket) {
    const clients = await this.redisRepository.HKEYS(["client-data"]);
    console.log(clients);
    await Promise.all(
      Array.from(clients).map(async client => {
        await this.redisRepository.HDEL(["ws", [client]], "application");

        // socket.to(ws_application_id).disconnectSockets()

        // client.socket.disconnect();
      }),
    );
  }
}
