import { Injectable } from "@nestjs/common";
import { FileRequest } from "../../ws-client/types/tasks.type";
import { FileRepository } from "../domain/file.repository";
import { WsBotSendFileUseCase } from "../../ws-bot/application/events/ws-bot-send-file.use-case";

@Injectable()
export class FileUploaderUseCase {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly wsBotSendFileUseCase: WsBotSendFileUseCase,
  ) {}

  async execute(
    clientid: string,
    controllerid: string,
    body: {
      tokenFile: string;
      file: Record<string, Storage.MultipartFile[]>;
    },
  ) {
    const { file, tokenFile } = body;

    const validateToken = this.fileRepository.getTokenForFile(clientid);

    if (!validateToken) {
      throw new Error("Token not found");
    }

    if (tokenFile !== validateToken) {
      throw new Error("Client not authorized for uploading file");
    }

    // console.log(files);
    // console.log(body);

    const fileFormatted: FileRequest = {
      buffer: Buffer.from(file.file[0].buffer).buffer,
      metadata: {
        filename: file.file[0].filename,
        size: file.file[0].size,
        format: file.file[0].mimetype,
      },
    };

    this.fileRepository.addFile(validateToken, controllerid, fileFormatted);

    this.wsBotSendFileUseCase.execute(controllerid, validateToken);

    return {
      message: "File uploaded",
    };
  }
}
