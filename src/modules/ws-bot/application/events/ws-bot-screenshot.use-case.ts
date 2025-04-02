import { Injectable } from "@nestjs/common";
import {
  WsBotSendScreensEvent,
  WsBotSendScreenshotEvent,
} from "../../types/ws-bot-events.types";
import { LoggerService } from "@/src/modules/shared/providers";
import { WsBotRepository } from "../../domain/ws-bot.repository";
import { WsBotGateway } from "../../infrastructure/ws-bot.gateway";

@Injectable()
export class WsBotScreenshotUseCase {
  constructor(
    private readonly wsBotGateway: WsBotGateway,
    private readonly logger: LoggerService,
  ) {}

  async sendScreens(data: WsBotSendScreensEvent) {
    this.logger.info(
      `Emiting send screens event to bot ${data.controllerid} ${JSON.stringify(data)}`,
    );

    return await this.wsBotGateway.sendEventToBot(
      data.controllerid,
      "sendScreensToBot",
      {
        screens: data.screens,
        messageid: data.identifier,
      },
    );
  }

  async sendScreenshot(data: WsBotSendScreenshotEvent) {
    this.logger.info(
      `Emiting send screenshot event to bot ${data.controllerid}`,
    );

    return await this.wsBotGateway.sendEventToBot(
      data.controllerid,
      "sendScreenshotToBot",
      {
        screenshot: data.buffer,
      },
    );
  }
}
