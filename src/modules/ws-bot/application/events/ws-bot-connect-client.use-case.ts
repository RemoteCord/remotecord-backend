import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import type { WsBotConnectionEvent } from "./ws-bot-events.types";
import { WsBotRepository } from "../../domain/ws-bot.repository";
// import crypto from "node:crypto";
import { ClientDataEncryptUseCase } from "@/src/modules/auth/application/client-data-encrypt.use-case";
import { WsClientRepository } from "@/src/modules/ws-client/domain/ws-client.repository";
@Injectable()
export class WsBotConnectClientUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly wsBotRepository: WsBotRepository,
    private readonly wsClientRepository: WsClientRepository,
  ) {}
  async execute(data: WsBotConnectionEvent) {
    const { controllerid, clientid } = data;

    const wsClientData = this.wsClientRepository.getClient(clientid);
    if (!wsClientData) {
      this.logger.error(`Client ${clientid} not found`);
      return;
    }

    this.logger.info(
      `Emiting connect client event ${clientid} to controller ${controllerid}`,
    );
    if (!this.wsBotRepository.socket) {
      this.logger.error("No ws-bot socket found");
      return;
    }

    return this.wsBotRepository.socket.emit("connectedClient", {
      controllerid,
      clientid,
      alias: wsClientData.client_data.name,
    });
  }
}
