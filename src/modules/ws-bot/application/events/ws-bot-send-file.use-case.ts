import { Injectable } from "@nestjs/common";
import { WsBotRepository } from "../../domain/ws-bot.repository";
import { FileRepository } from "@/src/modules/client/domain/file.repository";

@Injectable()
export class WsBotSendFileUseCase {
  constructor(
    private readonly wsBotRepository: WsBotRepository,
    private readonly fileRepository: FileRepository,
  ) {}

  async execute(controllerid: string, token: string) {
    const data = await this.fileRepository.getFile(token);

    if (!data) {
      throw new Error("File not found or file buffer is empty");
    }

    const { file } = data;

    this.wsBotRepository.socket?.emit("downloadFile", {
      controllerid,
      file: `https://api2.luqueee.dev/api/controllers/${controllerid}/file?token=${token}`,
      fileMetadata: file.metadata,
    });
  }
}
