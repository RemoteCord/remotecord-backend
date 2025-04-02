import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket } from "socket.io";

import { LoggerService } from "../../shared/providers";
import { WsApplicationJoinsUseCase } from "../application/ws-application-joins.use-case";
import { WsApplicationLeavesUseCase } from "../application/ws-application-leaves.use-case";
import { WsApplicationResetAllConnectionsUseCase } from "../application/ws-application-reset-all-connections-use-case";
import { UseGuards } from "@nestjs/common";
import { WsApplicationGuard } from "../application/ws-application.guard";
import { WsApplicationAddFriendUseCase } from "../application/ws-application-friend.use-case";
import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";

@WebSocketGateway({
  namespace: "application",
  cors: true,
  maxHttpBufferSize: 1e8,
})
export class WsApplicationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Socket;

  constructor(
    private readonly wsApplicationJoinsUseCase: WsApplicationJoinsUseCase,
    private readonly wsApplicationLeavesUseCase: WsApplicationLeavesUseCase,
    private readonly wsApplicationResetAllConnectionsUseCase: WsApplicationResetAllConnectionsUseCase,
    private readonly wsApplicationAddFriendUseCase: WsApplicationAddFriendUseCase,
    private readonly logger: LoggerService,
    private readonly redisRepository: RedisRepository,
  ) {}

  async sendEventToApplication(clientid: string, event: string, payload: any) {
    try {
      // const client = this.server.sockets.sockets.get(clientid);
      // console.log("client", client);
      // if (client) {
      //   client.emit(event, payload);
      // }

      const connectionid = await this.redisRepository.HGET(
        ["ws", [clientid]],
        "application",
      );
      console.log("connectionid", connectionid);

      if (!connectionid) return;
      this.server.to(connectionid).emit(event, payload);
    } catch (error) {
      this.logger.error("Error sending event to application", error);
    }
  }
  async afterInit(client: Socket) {
    this.logger.info("Resetting all client connections");
    await this.wsApplicationResetAllConnectionsUseCase.execute();
  }

  async handleConnection(client: Socket) {
    try {
      const { clientid } = await this.wsApplicationJoinsUseCase.execute(client);

      await this.redisRepository.HSET(["ws", [clientid]], {
        application: client.id,
      });

      // await this.clientJoinsUseCase.execute()
    } catch (error) {
      // console.error("Connection error:", error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      await this.wsApplicationLeavesUseCase.execute(client);
    } catch (error) {
      // console.error("Connection error:", error);
      client.disconnect();
    }

    const clientid = client.handshake.query["clientid"] as string;

    await this.redisRepository.HDEL(["ws", [clientid]], "application");
  }

  @UseGuards(WsApplicationGuard)
  @SubscribeMessage("addFriend")
  async addFriend(
    client: Socket,
    payload: { token: string; accept: boolean; controllerid: string },
  ) {
    this.logger.info("addFriend", payload, client.handshake.query.clientid);
    if (client.handshake.query.clientid)
      this.wsApplicationAddFriendUseCase.execute(
        payload.token,
        payload.accept,
        client.handshake.query.clientid as string,
        payload.controllerid,
      );
    return payload;
  }
}
