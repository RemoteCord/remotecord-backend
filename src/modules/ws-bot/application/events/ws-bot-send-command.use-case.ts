import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import type {
  WsBotConnectionEvent,
  WsBotSendCmdCommandEvent,
} from "./ws-bot-events.types";
import { WsBotRepository } from "../../domain/ws-bot.repository";

@Injectable()
export class WsBotSendCommandUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly wsBotRepository: WsBotRepository,
  ) {}
  async execute(data: WsBotSendCmdCommandEvent) {
    const { controllerid, pwd, stdout } = data;

    this.logger.info(
      `WSBOT Emiting emmiting command to controller ${controllerid}`,
    );

    this.wsBotRepository.socket?.emit("getCmdCommand", {
      controllerid,
      path: pwd,
      output: stdout,
    });
  }
}
