import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import { WsBotSendExplorerEvent } from "../../types/ws-bot-events.types";
import { WsBotRepository } from "../../domain/ws-bot.repository";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";
import { WsBotGateway } from "../../infrastructure/ws-bot.gateway";

@Injectable()
export class WsBotSendExplorerUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly wsBotGateway: WsBotGateway,
  ) {}
  async execute(data: WsBotSendExplorerEvent) {
    const { controllerid, files, folder, relativepath } = data;
    this.logger.info(
      `WSBOT Emiting emmiting explorer to controller ${controllerid}`,
    );

    this.wsBotGateway.sendEventToBot(controllerid, "getFilesFolder", {
      files,
      folder,
      relativepath,
    });
  }
}
