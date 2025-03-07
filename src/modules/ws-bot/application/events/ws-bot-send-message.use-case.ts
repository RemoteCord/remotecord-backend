import { Injectable } from "@nestjs/common";
import { WsBotRepository } from "../../domain/ws-bot.repository";
import { WsBotSendMessage } from "./ws-bot-events.types";

@Injectable()
export class WsBotSendMessageUseCase {
  constructor(private readonly wsBotRepository: WsBotRepository) {}

  async execute(data: WsBotSendMessage) {
    console.log("Bot sends message");

    const { controllerid, ...rest } = data;

    this.wsBotRepository.socket?.send({
      ...rest,
    });
  }
}
