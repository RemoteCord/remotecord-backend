import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import type { WsBotConnectionEvent } from "./ws-bot-events.types";
import { WsBotRepository } from "../../domain/ws-bot.repository";

@Injectable()
export class WsBotDisconnectClientUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly wsBotRepository: WsBotRepository,
  ) {}
  async execute(data: WsBotConnectionEvent) {
    const { controllerid, clientid } = data;

    this.logger.info(
      `Emiting disconnect client event ${clientid} to controller ${controllerid}`,
    );

    this.wsBotRepository.socket?.emit("disconnectedClient", {
      controllerid,
      clientid,
    });
  }
}
