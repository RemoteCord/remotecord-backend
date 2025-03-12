import { Injectable } from "@nestjs/common";
import { FileRequest } from "../../ws-client/types/tasks.type";
import { FileRepository } from "../domain/file.repository";
import { WsBotSendFileUseCase } from "../../ws-bot/application/events/ws-bot-send-file.use-case";
import { createFile } from "../../shared/helpers/file.helpers";

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
      metadata: {
        filename: file.file[0].filename,
        size: file.file[0].size,
        format: file.file[0].mimetype,
      },
    };

    const extFile = fileFormatted.metadata.filename.split(".")[1];
    console.log(`${tokenFile}${fileFormatted.metadata.format}`, extFile);

    const fileBuffer = Buffer.from(file.file[0].buffer).buffer;

    const path = await createFile(`${tokenFile}.${extFile}`, fileBuffer);

    this.fileRepository.addFile(
      validateToken,
      controllerid,
      path,
      fileFormatted.metadata,
    );

    this.wsBotSendFileUseCase.execute(controllerid, validateToken);

    return {
      message: "File uploaded",
    };
  }
}
