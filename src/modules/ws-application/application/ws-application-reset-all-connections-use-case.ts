import { ControllerRepository } from "@/src/repository/controller/controller.repository";
import { Injectable } from "@nestjs/common";
import { WsApplicationRepository } from "../domain/ws-application.repository";
import { LoggerService } from "../../shared/providers";

@Injectable()
export class WsApplicationResetAllConnectionsUseCase {
  constructor(
    private readonly controllerRepository: ControllerRepository,
    private readonly wsApplicationRepository: WsApplicationRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute() {
    try {
      this.logger.info("Resetting all client connections");
      await this.wsApplicationRepository.removeAllClients();
      await this.controllerRepository.resetAllActiveClients();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error("Error joining client:", errorMessage);
    }
  }
}
