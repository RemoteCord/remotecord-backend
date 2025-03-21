import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";
import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { ClientDataEncryptUseCase } from "../../auth/application/client-data-encrypt.use-case";
import { WsClientRepository } from "../domain/ws-client.repository";
import { UserRepository } from "@/src/repository/db/user/user.repository";
import { LoggerService } from "../../shared/providers";
import { WsClientVerifyConnectionUseCase } from "./ws-client-verify-connection.use-case";

@Injectable()
export class WsClientResetAllConnectionsUseCase {
  constructor(
    private readonly controllerRepository: ControllerRepository,
    private readonly userRepository: UserRepository,
    private readonly wsClientRepsitory: WsClientRepository,
    private readonly WsClientVerifyConnectionUseCase: WsClientVerifyConnectionUseCase,
    private readonly logger: LoggerService,
  ) {}

  async execute() {
    try {
      this.logger.info("Resetting all client connections");
      await this.wsClientRepsitory.removeAllClients();
      await this.controllerRepository.resetAllActiveClients();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error("Error joining client:", errorMessage);
    }
  }
}
