import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { WsClientService } from "../domain/ws-client.service";
import { ClientJoinsUseCase } from "../application/client-joins.use-case";
import { ClientDataEncryptUseCase } from "../application/client-data-encrypt.use-case";

@WebSocketGateway({
  namespace: "clients",
  cors: true,
})
export class WsClientGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly wsClientService: WsClientService,
    private readonly clientJoinsUseCase: ClientJoinsUseCase,
    private clientDataEncryptUseCase: ClientDataEncryptUseCase,
  ) {}

  afterInit(client: Socket) {}

  async handleConnection(client: Socket) {
    try {
      return this.clientJoinsUseCase.execute(client);
      // await this.clientJoinsUseCase.execute()
    } catch (error) {
      console.error("Connection error:", error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {}
}
