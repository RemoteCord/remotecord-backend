import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { WsApplicationRepository } from "../../domain/ws-application.repository";
import { ClientDataEncryptUseCase } from "@/src/modules/auth/application/client-data-encrypt.use-case";
import { ConnectClientDto } from "@/src/modules/controller/infrastructure/routes/dto/connect-client.dto";
import { WsClientRepository } from "@/src/modules/ws-client/domain/ws-client.repository";
import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";
import { WsApplicationGateway } from "../../infrastructure/ws-application.gateway";

@Injectable()
export class WsApplicationConnectClientUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly controllerRepository: ControllerRepository,
    private readonly wsApplicationRepository: WsApplicationRepository,
    private readonly wsClientRepository: WsClientRepository,
    private readonly wsApplicationGateway: WsApplicationGateway,
  ) {}

  async disconnect(controllerid: string) {
    try {
      this.logger.info(`Disconnecting controller ${controllerid}`);
      const clientid =
        await this.controllerRepository.getActiveClient(controllerid);
      if (!clientid) throw new Error("Controller not found");

      this.logger.info(`Emitting disconnect to ws-client ${clientid}`);
      this.wsApplicationGateway.sendEventToApplication(
        clientid,
        "emitDisconnectFromController",
        {
          controller: controllerid,
        },
      );

      return { status: true };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error("Error disconnecting client:", errorMessage);
      return { status: false, message: errorMessage };
    }
  }

  async connect(
    controllerid: string,
    clientid: string,
    data: {
      username: string;
      avatar: string;
    },
  ) {
    // const { username, avatar } = data;
    try {
      const activeclient =
        await this.controllerRepository.getActiveClient(controllerid);
      console.log(activeclient);
      if (activeclient === clientid)
        throw new Error("Client already connected");

      this.logger.info(
        `Attempting Client ${clientid} emitting connect to ws-client with controller ${controllerid}`,
      );

      this.logger.info(
        `Encrypted controller id: (${controllerid}) for connecting to ${clientid}`,
      );

      const tokenConnection =
        this.wsApplicationRepository.generateConnectionToken(clientid);

      this.wsApplicationGateway.sendEventToApplication(
        clientid,
        "emitConnectToController",
        {
          controllerid,
          tokenConnection,
          controller: data,
        },
      );

      return { status: true };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error("Error joining client:", errorMessage);
      return { status: false, message: errorMessage };
    }
  }
}
