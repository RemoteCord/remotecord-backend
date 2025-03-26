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
    private readonly wsBotSendCmdCommandUseCase: WsBotSendCommandUseCase,
    private readonly wsBotSendExplorerUseCase: WsBotSendExplorerUseCase,
    private readonly wsBotSendTasksUseCase: WsBotSendTasksUseCase,
    private readonly logger: LoggerService,
    private readonly redisRepository: RedisRepository,
  ) {}

  async sendEventToClient(clientid: string, event: string, payload: any) {
    // const client = this.server.sockets.sockets.get(clientid);
    // console.log("client", client);
    // if (client) {
    //   client.emit(event, payload);
    // }

    const connectionid = await this.redisRepository.getEntity(
      "ws-client-id",
      clientid,
    );

    console.log("connectionid", connectionid);
    if (!connectionid) return;
    this.server.to(connectionid).emit(event, payload);
  }

  async afterInit(client: Socket) {
    this.logger.info("Resetting all client connections");
    await this.wsClientResetAllConnectionsUseCase.execute();
    await this.redisRepository.deleteAllFromCategory("ws-client-id");
  }

  async handleConnection(client: Socket) {
    try {
      console.log(this.server);
      const { clientid } = await this.wsClientJoinsUseCase.execute(client);

      // console.log("clientid", this.server.sockets);
      this.redisRepository.setEntity("ws-client-id", clientid, client.id);
      this.server.to(client.id).emit("connected", "connected");
    } catch (error) {
      this.logger.error("Connection error:", error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    try {
      this.wsClientLeavesUseCase.execute(client);
    } catch (error) {
      this.logger.error("Connection error:", error);
      client.disconnect();
    }

    const clientid = client.handshake.query["clientid"] as string;
    const controllerid = client.handshake.query["controllerid"] as string;

    this.redisRepository.deleteEntity("ws-client-id", clientid);

    this.redisRepository.deleteEntity("connection-ws", controllerid);
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
  async getExplorerFromClient(
    client: Socket,
    data: GetExplorerFromClientEvent,
  ) {
    this.logger.info("getExplorerFromClient Event");

    const { files, folder, relativepath } = data;

    const { clientid } = client.handshake.query;

    const splitedPath = relativepath.split("/")[1] ?? relativepath;

    const resultPath = path.join(folder, splitedPath);

    const key = `${clientid}:${resultPath}`;
    console.log("key", key);
    // const timeKey = `${key}:timestamp`;

    void this.redisRepository.setEntity(
      "explorer",
      key,
      JSON.stringify(files),
      true,
    );

    // await this.redis.set(key, JSON.stringify(files), "EX", 3600);

    // await this.redis.set(timeKey, Date.now(), "EX", 3600);

    this.wsBotSendExplorerUseCase.execute({
      controllerid: client.handshake.query.controllerid as string,
      ...data,
    });
  }

  @UseGuards(WsClientGuard)
  @SubscribeMessage("getFileFromClient")
  getFileFromClient(client: Socket, data: FileRequest) {
    const { metadata } = data;

    const size = metadata.size;

    if (size > 10) {
      this.logger.error("File too big");
    }
  }

  @UseGuards(WsClientGuard)
  @SubscribeMessage("getTasksFromClient")
  getTasksFromClient(client: Socket, data: TasksEvent) {
    this.wsBotSendTasksUseCase.execute({
      controllerid: client.handshake.query.controllerid as string,

      ...data,
    });
  }
}
