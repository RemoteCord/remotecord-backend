import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { ControllerRepository } from "@/src/repository/controller/controller.repository";
import { UserRepository } from "@/src/repository/user/user.repository";
import { WsClientRepository } from "../domain/ws-client.repository";
import { LoggerService } from "../../shared/providers";
import { ClientNotFoundException } from "@/src/repository/user/exceptions";
import { WsClientVerifyConnectionUseCase } from "./ws-client-verify-connection.use-case";
import { WsBotConnectClientUseCase } from "../../ws-bot/application/events/ws-bot-connect-client.use-case";
import { WsApplicationRepository } from "../../ws-application/domain/ws-application.repository";

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
  ) {}

  async execute(client: Socket) {
    try {
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

      const controller =
        await this.controllerRepository.getControllerById(controllerid);

      if (!controller?.friends.includes(clientid))
        throw new Error(
          "Client not authorized to join controller (is not a friend)",
        );

      const client_data = await this.userRepository.getUserById(clientid);

      if (!client_data) throw new ClientNotFoundException(clientid);

      this.logger.info(
        `Client connected with ID ${clientid} to controller ${controllerid}`,
      );

      client.handshake.query["clientid"] = clientid;
      client.handshake.query["controllerid"] = controllerid;

      await this.controllerRepository.updateController(controllerid, {
        activeclient: clientid,
      });

      this.wsClientRepository.addClient(clientid, {
        controllerid,
        socket: client,
        client_data,
      });

      return await this.wsBotConnectClientUseCase.execute({
        controllerid,
        clientid,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error("Error joining client:", errorMessage);
    }
  }
}
