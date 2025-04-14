import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { WsApplicationRepository } from "../domain/ws-application.repository";
import { LoggerService } from "../../shared/providers";

@Injectable()
export class WsApplicationLeavesUseCase {
  constructor(private readonly logger: LoggerService) {}

  async execute(client: Socket) {
    try {
      const { clientid } = client.handshake.query as {
        clientid: string;
      };

      this.logger.info(`Client ${clientid} disconnected from application`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error("Error joining client:", errorMessage);
    }
  }
}
