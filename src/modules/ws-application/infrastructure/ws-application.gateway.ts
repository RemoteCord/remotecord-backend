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
    // const client = this.server.sockets.sockets.get(clientid);
    // console.log("client", client);
    // if (client) {
    //   client.emit(event, payload);
    // }

    const connectionid = await this.redisRepository.getEntity(
      "ws-application-id",
      clientid,
    );

    console.log("connectionid", connectionid);
    if (!connectionid) return;
    this.server.to(connectionid).emit(event, payload);
  }
  async afterInit(client: Socket) {
    this.logger.info("Resetting all client connections");
    await this.wsApplicationResetAllConnectionsUseCase.execute();
    await this.redisRepository.deleteAllFromCategory("ws-application-id");
  }

  async handleConnection(client: Socket) {
    try {
      const { clientid } = await this.wsApplicationJoinsUseCase.execute(client);

      await this.redisRepository.setEntity(
        "ws-application-id",
        clientid,
        client.id,
      );
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
    await this.redisRepository.deleteEntity(
      "ws-application-id",
      client.handshake.query["clientid"] as string,
    );
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
