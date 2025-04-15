import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import type { WsBotSendTaksEvent } from "../../types/ws-bot-events.types";
import { WsBotRepository } from "../../domain/ws-bot.repository";
import { WsBotGateway } from "../../infrastructure/ws-bot.gateway";

@Injectable()
export class WsBotSendTasksUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly wsBotGateway: WsBotGateway,
  ) { }
  async execute(data: WsBotSendTaksEvent) {
    const { controllerid, tasks } = data;

    // this.logger.info(
    //   `WSBOT Emiting emmiting command to controller ${controllerid}`,
    // );


    this.wsBotGateway.sendEventToBot(controllerid, "getTasksFromClient", {
      tasks,
    });

    return;
  }
}
