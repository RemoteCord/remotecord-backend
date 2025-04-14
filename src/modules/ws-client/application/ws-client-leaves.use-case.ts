import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

import { LoggerService } from "../../shared/providers";
import { WsBotDisconnectClientUseCase } from "../../ws-bot/application/events/ws-bot-disconnect-client.use-case";
import { WsClientRepository } from "../domain/ws-client.repository";
import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";

@Injectable()
export class WsClientLeavesUseCase {
  constructor(
    private readonly wsClientRepository: WsClientRepository,
    private readonly wsBotDisconnectClientUseCase: WsBotDisconnectClientUseCase,
    private readonly controllerRepository: ControllerRepository,

    private readonly logger: LoggerService,
  ) {}

  async execute(client: Socket) {
    try {
      const { clientid, controllerid } = client.handshake.query as {
        clientid: string;
        controllerid: string;
      };

      this.logger.info(`Client ${clientid} disconnected`);

      await this.controllerRepository.updateController(controllerid, {
        activeclient: "",
      });

      await this.wsBotDisconnectClientUseCase.execute({
        clientid,
        controllerid,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error("Error disconnecting client:", errorMessage);
    }
  }
}
