import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import type { WsBotConnectionEvent } from "./ws-bot-events.types";
import { WsBotRepository } from "../../domain/ws-bot.repository";
import { WsClientRepository } from "@/src/modules/ws-client/domain/ws-client.repository";
import { WsApplicationRepository } from "@/src/modules/ws-application/domain/ws-application.repository";
import { UserRepository } from "@/src/repository/db/user/user.repository";

@Injectable()
export class WsBotDisconnectClientUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly wsBotRepository: WsBotRepository,
    private readonly wsApplicationRepository: WsApplicationRepository,

    private readonly clientRepository: UserRepository,
  ) {}
  async execute(data: WsBotConnectionEvent) {
    const { controllerid, clientid } = data;
    // const wsData = this.wsApplicationRepository.getClient(clientid);
    const clientData = await this.clientRepository.getUserById(clientid);

    // console.log("controllerid:", controllerid, clientid, wsData);

    if (!clientData) {
      this.logger.error(`Client ${clientid} not found`);
      return;
    }

    this.logger.info(
      `Emiting disconnect client event ${clientid} to controller ${controllerid}`,
    );

    this.wsBotRepository.socket?.emit("disconnectedClient", {
      controllerid,
      clientid,
      alias: clientData.name,
    });
  }
}
