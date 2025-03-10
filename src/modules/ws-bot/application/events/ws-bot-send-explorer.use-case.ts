import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import { WsBotSendExplorerEvent } from "./ws-bot-events.types";
import { WsBotRepository } from "../../domain/ws-bot.repository";

@Injectable()
export class WsBotSendExplorerUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly wsBotRepository: WsBotRepository,
  ) {}
  async execute(data: WsBotSendExplorerEvent) {
    const { controllerid, files, folder, relativepath } = data;
    this.logger.info(
      `WSBOT Emiting emmiting explorer to controller ${controllerid}`,
    );

    this.wsBotRepository.socket?.emit("getFilesFolder", {
      controllerid,
      files,
      folder,
      relativepath,
    });
  }
}
