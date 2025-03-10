import { Injectable } from "@nestjs/common";
import {
  WsBotSendScreensEvent,
  WsBotSendScreenshotEvent,
} from "./ws-bot-events.types";
import { LoggerService } from "@/src/modules/shared/providers";
import { WsBotRepository } from "../../domain/ws-bot.repository";

@Injectable()
export class WsBotScreenshotUseCase {
  constructor(
    private readonly wsBotRepository: WsBotRepository,
    private readonly logger: LoggerService,
  ) {}

  async sendScreens(data: WsBotSendScreensEvent) {
    this.logger.info(`Emiting send screens event to bot ${data.controllerid}`);

    if (!this.wsBotRepository.socket) {
      this.logger.error("No ws-bot socket found");
      return;
    }

    return this.wsBotRepository.socket.emit("sendScreensToBot", {
      controllerid: data.controllerid,
      screens: data.screens,
    });
  }

  async sendScreenshot(data: WsBotSendScreenshotEvent) {
    this.logger.info(
      `Emiting send screenshot event to bot ${data.controllerid}`,
    );

    if (!this.wsBotRepository.socket) {
      this.logger.error("No ws-bot socket found");
      return;
    }

    return this.wsBotRepository.socket.emit("sendScreenshotToBot", {
      controllerid: data.controllerid,
      screenshot: data.buffer,
    });
  }
}
