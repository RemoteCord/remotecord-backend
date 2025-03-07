import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Socket } from "socket.io";
import { LoggerService } from "../../shared/providers";
import { WsBotRepository } from "../domain/ws-bot.repository";

@Injectable()
export class WsBotLeavesUseCase {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly wsBotRepository: WsBotRepository,
  ) {}

  async execute() {
    this.logger.info("Bot disconnected");
    this.wsBotRepository.removeClient();
  }
}
