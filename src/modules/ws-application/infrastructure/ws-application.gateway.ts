import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { WsApplicationResetAllConnectionsUseCase } from "../application/ws-application-reset-all-connections-use-case";
import { LoggerService } from "../../shared/providers";
import { WsApplicationLeavesUseCase } from "../application/ws-application-leaves.use-case";
import { WsApplicationJoinsUseCase } from "../application/ws-application-joins.use-case";

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
    this.wsApplicationLeavesUseCase.execute(client);
  }
}
