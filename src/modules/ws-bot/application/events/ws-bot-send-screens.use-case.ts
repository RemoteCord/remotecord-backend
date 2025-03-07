import { Injectable } from "@nestjs/common";
import { WsBotSendScreensEvent } from "./ws-bot-events.types";
import { LoggerService } from "@/src/modules/shared/providers";
import { WsBotRepository } from "../../domain/ws-bot.repository";

@Injectable()
export class WsBotSendScreensUseCase {
  constructor(
    private readonly wsBotRepository: WsBotRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(data: WsBotSendScreensEvent) {
    this.logger.info(`Emiting send screens event to bot ${data.controllerid}`);

    if (!this.wsBotRepository.socket) {
      this.logger.error("No ws-bot socket found");
      return;
    }

    return this.wsBotRepository.socket.emit("sendScreensToBot", {
      controllerid: data.controllerid,
      screens: data,
    });
  }
}
