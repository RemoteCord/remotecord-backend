import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import type {
  WsBotAddFriendEvent,
  WsBotConnectionEvent,
} from "./ws-bot-events.types";
import { WsBotRepository } from "../../domain/ws-bot.repository";
// import crypto from "node:crypto";
import { ClientDataEncryptUseCase } from "@/src/modules/auth/application/client-data-encrypt.use-case";
@Injectable()
export class WsBotSendFriendUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly wsBotRepository: WsBotRepository,
    private readonly clientDataEncryptUseCase: ClientDataEncryptUseCase,
  ) {}
  async execute(data: WsBotAddFriendEvent) {
    const { controllerid, clientid } = data;

    this.logger.info(
      `Emiting connect client event ${clientid} to controller ${controllerid}`,
    );
    if (!this.wsBotRepository.socket) {
      this.logger.error("No ws-bot socket found");
      return;
    }

    return this.wsBotRepository.socket.emit("addFriend", {
      controllerid,
      clientid,
    });
  }
}
