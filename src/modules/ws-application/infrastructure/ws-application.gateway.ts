import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Socket } from "socket.io";

import { LoggerService } from "../../shared/providers";
import { WsApplicationJoinsUseCase } from "../application/ws-application-joins.use-case";
import { WsApplicationLeavesUseCase } from "../application/ws-application-leaves.use-case";
import { WsApplicationResetAllConnectionsUseCase } from "../application/ws-application-reset-all-connections-use-case";
import { UseGuards } from "@nestjs/common";
import { WsApplicationGuard } from "../application/ws-application.guard";
import { WsApplicationAddFriendUseCase } from "../application/ws-application-friend.use-case";

@WebSocketGateway({
  namespace: "application",
  cors: true,
  maxHttpBufferSize: 1e8,
})
export class WsApplicationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly wsApplicationJoinsUseCase: WsApplicationJoinsUseCase,
    private readonly wsApplicationLeavesUseCase: WsApplicationLeavesUseCase,
    private readonly wsApplicationResetAllConnectionsUseCase: WsApplicationResetAllConnectionsUseCase,
    private readonly wsApplicationAddFriendUseCase: WsApplicationAddFriendUseCase,
    private readonly logger: LoggerService,
  ) {}

  async afterInit(client: Socket) {
    this.logger.info("Resetting all client connections");
    await this.wsApplicationResetAllConnectionsUseCase.execute();
  }

  async handleConnection(client: Socket) {
    try {
      return this.wsApplicationJoinsUseCase.execute(client);
      // await this.clientJoinsUseCase.execute()
    } catch (error) {
      // console.error("Connection error:", error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    void this.wsApplicationLeavesUseCase.execute(client);
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
