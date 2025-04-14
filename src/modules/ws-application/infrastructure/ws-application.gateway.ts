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
import { Logger, UseGuards } from "@nestjs/common";
import { WsApplicationGuard } from "../application/ws-application.guard";
import { WsApplicationAddFriendUseCase } from "../application/ws-application-friend.use-case";
import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";
import { WsApplicationRepository } from "../domain/ws-application.repository";
import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";

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

  private logger = new Logger("WsApplicationGateway");

  constructor(
    // private readonly wsApplicationRepository: WsApplicationRepository,
    private readonly controllerRepository: ControllerRepository,
    private readonly wsApplicationJoinsUseCase: WsApplicationJoinsUseCase,
    private readonly wsApplicationLeavesUseCase: WsApplicationLeavesUseCase,
    private readonly wsApplicationAddFriendUseCase: WsApplicationAddFriendUseCase,
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
    this.logger.log("Resetting all client connections");
  }

  async handleConnection(client: Socket) {
    try {
      const { clientid } = await this.wsApplicationJoinsUseCase.execute(client);

      await this.redisRepository.HSET(["ws", [clientid]], {
        application: client.id,
      });

      this.logger.log(`Client ${clientid} connected to ws-application`);

      // await this.clientJoinsUseCase.execute()
    } catch (error) {
      this.logger.error("Error on joining to ws-application", error);
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

    this.logger.log(`Client ${clientid} disconnected from ws-application`);
    // await this.redisRepository.HDEL(["client-data"], clientid);
  }

  @UseGuards(WsApplicationGuard)
  @SubscribeMessage("addFriend")
  async addFriend(
    client: Socket,
    payload: { token: string; accept: boolean; controllerid: string },
  ) {
    this.logger.log(`Client ${client.id} sending addFriend event`);

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
