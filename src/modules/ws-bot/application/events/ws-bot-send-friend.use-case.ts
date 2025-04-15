import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import type {
  WsBotAddFriendEvent,
  WsBotConnectionEvent,
} from "../../types/ws-bot-events.types";
import { WsBotRepository } from "../../domain/ws-bot.repository";
// import crypto from "node:crypto";
import { ClientDataEncryptUseCase } from "@/src/modules/auth/application/client-data-encrypt.use-case";
import { WsBotGateway } from "../../infrastructure/ws-bot.gateway";
@Injectable()
export class WsBotSendFriendUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly wsBotGateway: WsBotGateway,
  ) { }
  async execute(data: WsBotAddFriendEvent) {
    const { controllerid, clientid } = data;

    this.logger.info(
      `Emiting connect client event ${clientid} to controller ${controllerid}`,
    );

    this.wsBotGateway.sendEventToBot(controllerid, "addFriend", data);

    return;
  }
}
