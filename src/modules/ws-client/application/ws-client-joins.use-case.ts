import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";
import { UserRepository } from "@/src/repository/db/user/user.repository";
import { WsClientRepository } from "../domain/ws-client.repository";
import { LoggerService } from "../../shared/providers";
import { ClientNotFoundException } from "@/src/repository/db/user/exceptions";
import { WsClientVerifyConnectionUseCase } from "./ws-client-verify-connection.use-case";
import { WsBotConnectClientUseCase } from "../../ws-bot/application/events/ws-bot-connect-client.use-case";
import { WsApplicationRepository } from "../../ws-application/domain/ws-application.repository";
import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";
@Injectable()
export class WsClientJoinsUseCase {
  constructor(
    private readonly controllerRepository: ControllerRepository,
    private readonly userRepository: UserRepository,
    private readonly wsClientRepository: WsClientRepository,
    private readonly wsApplicationRepository: WsApplicationRepository,
    private readonly wsClientVerifyConnectionUseCase: WsClientVerifyConnectionUseCase,
    private readonly logger: LoggerService,
    private readonly wsBotConnectClientUseCase: WsBotConnectClientUseCase,
    private readonly redisRepository: RedisRepository,
  ) {}

  async execute(client: Socket) {
    const { controllerid } = client.handshake.query as {
      controllerid: string;
    };

    const { token, tokenConnection } = client.handshake.auth as {
      token: string;
      tokenConnection: string;
    };

    const { clientid } = await this.wsClientVerifyConnectionUseCase.execute(
      controllerid,
      token,
    );

    this.logger.info(
      `Client joining controller ${controllerid} ${clientid} with token ${token} `,
    );

    const verifiedTokenConnection =
      this.wsApplicationRepository.getConnectionToken(clientid);

    if (verifiedTokenConnection !== tokenConnection) {
      throw new Error("Invalid connection token");
    }

    this.logger.info(
      `Client joining controller ${controllerid} with token ${token}`,
    );

    const client_data = await this.userRepository.getUserById(clientid);

    if (!client_data) throw new ClientNotFoundException(clientid);

    this.logger.info(
      `Client connected with ID ${clientid} to controller ${controllerid}`,
    );

    client.handshake.query["clientid"] = clientid;
    client.handshake.query["controllerid"] = controllerid;

    await this.redisRepository.setEntity(
      "connection-ws",
      controllerid,
      clientid,
    );

    await this.controllerRepository.selectActiveClient(clientid, controllerid);

    this.wsClientRepository.addClient(clientid, {
      controllerid,
      socket: client,
      client_data,
    });

    await this.wsBotConnectClientUseCase.execute({
      controllerid,
      clientid,
    });

    return { clientid };
  }
}
