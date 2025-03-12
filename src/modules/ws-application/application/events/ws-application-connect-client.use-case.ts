import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { WsApplicationRepository } from "../../domain/ws-application.repository";
import { ClientDataEncryptUseCase } from "@/src/modules/auth/application/client-data-encrypt.use-case";
import { ConnectClientDto } from "@/src/modules/controller/infrastructure/routes/dto/connect-client.dto";
import { WsClientRepository } from "@/src/modules/ws-client/domain/ws-client.repository";

@Injectable()
export class WsApplicationConnectClientUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly wsApplicationRepository: WsApplicationRepository,
    private readonly wsClientRepository: WsClientRepository,
    private readonly clientDataEncryptUseCase: ClientDataEncryptUseCase,
  ) {}

  async execute(
    controllerid: string,
    clientid: string,
    data: {
      username: string;
      avatar: string;
    },
  ) {
    // const { username, avatar } = data;
    try {
      if (this.wsClientRepository.getClient(clientid))
        throw new Error("Client already connected");

      this.logger.info(
        `Attempting Client ${clientid} emitting connect to ws-client with controller ${controllerid}`,
      );

      const client = this.wsApplicationRepository.getClient(clientid);

      if (!client) throw new Error("Client not found"); // TODO: Create a exception
      //   console.log("client.socket", client.socket);

      const encryptedControllerId =
        this.clientDataEncryptUseCase.encrypt(controllerid);
      this.logger.info(
        `Encrypted controller id: ${encryptedControllerId} (${controllerid}) for connecting to ${clientid}`,
      );
      client.socket.emit("emitConnectToController", {
        token: encryptedControllerId,
        controller: data,
      });
      return { status: true };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error("Error joining client:", errorMessage);
      return { status: false, message: errorMessage };
    }
  }
}
