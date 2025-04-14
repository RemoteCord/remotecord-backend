import { Injectable } from "@nestjs/common";
import { WsBotRepository } from "../../domain/ws-bot.repository";
import { WsBotSendMessage } from "../../types/ws-bot-events.types";
import { WsBotGateway } from "../../infrastructure/ws-bot.gateway";

@Injectable()
export class WsBotSendMessageUseCase {
  constructor(private readonly wsBotGateway: WsBotGateway) {}

  async execute(controllerid: string, data: WsBotSendMessage) {
    console.log("Bot sends message");

    this.wsBotGateway.sendEventToBot(controllerid, "message", data);
    return;
  }
}
