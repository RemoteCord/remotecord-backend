import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { WsBotRepository } from "../domain/ws-bot.repository";
import { WsBotJoinsUseCase } from "../application/ws-bot-joins.use-case";
import { WsBotLeavesUseCase } from "../application/ws-bot-leaves.use-case";

@WebSocketGateway({
  namespace: "bot",
  cors: true,
  maxHttpBufferSize: 1e8,
})
export class WsBotGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly wsBotJoinsUseCase: WsBotJoinsUseCase,
    private readonly wsBotLeavesUseCase: WsBotLeavesUseCase,
  ) {}

  afterInit(client: Socket) {}

  async handleConnection(client: Socket) {
    try {
      return this.wsBotJoinsUseCase.execute(client);
      // await this.clientJoinsUseCase.execute()
    } catch (error) {
      // console.error("Connection error:", error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.wsBotLeavesUseCase.execute();
  }
}
