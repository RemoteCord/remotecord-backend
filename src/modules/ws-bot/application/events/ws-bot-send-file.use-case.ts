import { Injectable } from "@nestjs/common";
import { WsBotRepository } from "../../domain/ws-bot.repository";
import { ClientRepository } from "@/src/modules/client/domain/client.repository";

@Injectable()
export class WsBotSendFileUseCase {
  constructor(
    private readonly wsBotRepository: WsBotRepository,
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(controllerid: string) {
    this.wsBotRepository.socket?.emit("downloadFile", {
      controllerid,
      file: `https://api2.luqueee.dev/api/controllers/${controllerid}/file`,
    });
  }
}
