import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { WsClientJoinsUseCase } from "../application/ws-client-joins.use-case";
import { WsClientResetAllConnectionsUseCase } from "../application/ws-client-reset-all-connections-use-case";
import { LoggerService } from "../../shared/providers";
import { WsClientLeavesUseCase } from "../application/ws-client-leaves.use-case";
import { WsClientGuard } from "../application/ws-client.guard";
import type {
  GetExplorerFromClientEvent,
  RunCmdCommandEvent,
  TasksEvent,
  GetScreensFromClientEvent,
  RunCmdCommand,
  GetScreenshotFromClientEvent,
} from "../types/ws-client-events.type";
import type { FileRequest } from "../types/tasks.type";
import { UseGuards } from "@nestjs/common";
import { WsBotScreenshotUseCase } from "../../ws-bot/application/events/ws-bot-screenshot.use-case";
import { WsBotSendCommandUseCase } from "../../ws-bot/application/events/ws-bot-send-command.use-case";
import { WsClientFile } from "../application/events/ws-client-file";
import { WsBotSendExplorerUseCase } from "../../ws-bot/application/events/ws-bot-send-explorer.use-case";

@WebSocketGateway({
  namespace: "clients",
  cors: true,
  maxHttpBufferSize: 1e8,
})
export class WsClientGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly wsClientJoinsUseCase: WsClientJoinsUseCase,
    private readonly wsClientLeavesUseCase: WsClientLeavesUseCase,
    private readonly wsClientResetAllConnectionsUseCase: WsClientResetAllConnectionsUseCase,
    private readonly wsBotScreenshotUseCase: WsBotScreenshotUseCase,
    private readonly wsBotSendCmdCommandUseCase: WsBotSendCommandUseCase,
    private readonly wsBotSendExplorerUseCase: WsBotSendExplorerUseCase,
    private readonly logger: LoggerService,
  ) {}

  async afterInit(client: Socket) {
    this.logger.info("Resetting all client connections");
    await this.wsClientResetAllConnectionsUseCase.execute();
  }

  async handleConnection(client: Socket) {
    try {
      await this.wsClientJoinsUseCase.execute(client);
    } catch (error) {
      this.logger.error("Connection error:", error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.wsClientLeavesUseCase.execute(client);
  }

  @UseGuards(WsClientGuard)
  @SubscribeMessage("runCmdCommand")
  runCmdCommand(client: Socket, data: RunCmdCommand) {
    this.wsBotSendCmdCommandUseCase.execute({
      controllerid: client.handshake.query.controllerid as string,
      ...data,
    });
  }

  @UseGuards(WsClientGuard)
  @SubscribeMessage("getScreensFromClient")
  getScreensFromClient(client: Socket, data: GetScreensFromClientEvent) {
    this.logger.info("getScreensFromClient", data);
    this.wsBotScreenshotUseCase.sendScreens({
      controllerid: client.handshake.query.controllerid as string,
      screens: data.screens,
    });
  }

  @UseGuards(WsClientGuard)
  @SubscribeMessage("getScreenshotFromClient")
  getScreenshotFromClient(client: Socket, data: GetScreenshotFromClientEvent) {
    this.logger.info("getScreensFromClient", data);
    // this.wsBotSendScreensUseCase.execute({
    //   controllerid: client.handshake.query.controllerid as string,
    //   screens: data.screens,
    // });

    this.wsBotScreenshotUseCase.sendScreenshot({
      controllerid: client.handshake.query.controllerid as string,
      buffer: data.buffer,
    });
  }

  @UseGuards(WsClientGuard)
  @SubscribeMessage("getFilesFolder")
  getExplorerFromClient(client: Socket, data: GetExplorerFromClientEvent) {
    this.logger.info("getExplorerFromClient Event", data);
    this.wsBotSendExplorerUseCase.execute({
      controllerid: client.handshake.query.controllerid as string,
      ...data,
    });
  }

  @UseGuards(WsClientGuard)
  @SubscribeMessage("getFileFromClient")
  getFileFromClient(client: Socket, data: FileRequest) {
    const { metadata, buffer } = data;

    const size = metadata.size;

    if (size > 10) {
      this.logger.error("File too big");
    }
  }

  @UseGuards(WsClientGuard)
  @SubscribeMessage("getTasksFromClient")
  getTasksFromClient(client: Socket, data: TasksEvent) {}
}
