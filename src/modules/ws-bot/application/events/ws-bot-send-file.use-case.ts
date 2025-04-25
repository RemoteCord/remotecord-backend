import { Injectable } from "@nestjs/common";
import { WsBotRepository } from "../../domain/ws-bot.repository";
import { FileMetadata } from "@/src/modules/client/types/file.types";
import { WsBotGateway } from "../../infrastructure/ws-bot.gateway";

@Injectable()
export class WsBotSendFileUseCase {
  constructor(private readonly wsBotGateway: WsBotGateway) { }

  async execute(controllerid: string, fileurl: string, metadata: FileMetadata) {
    console.log("Emitting send file to bot", controllerid, fileurl, metadata);
    this.wsBotGateway.sendEventToBot(controllerid, "downloadFile", {
      file: fileurl,
      fileMetadata: metadata,
    });

    return;
  }


}
