import { Injectable } from "@nestjs/common";
import { WsClientRepository } from "../../domain/ws-client.repository";
import type {
  AddFileClient,
  ClientGetFile,
  ClientUploadFile,
} from "./ws-events.type";
import { ClientNotFoundException } from "@/src/repository/user/exceptions";
import { WsBotRepository } from "@/src/modules/ws-bot/domain/ws-bot.repository";
import { LoggerService } from "@/src/modules/shared/providers";
import { FileRepository } from "@/src/modules/client/domain/file.repository";

@Injectable()
export class WsClientFile {
  constructor(
    private readonly wsClientRepository: WsClientRepository,
    private readonly fileRepository: FileRepository,
    private readonly logger: LoggerService,
  ) {}

  async uploadFileToClient({ clientid, fileroute }: ClientUploadFile) {
    const client = this.wsClientRepository.getClient(clientid);

    if (!client) {
      throw new ClientNotFoundException(clientid);
    }

    const { socket } = client;

    socket.emit("uploadFile", {
      fileroute,
    });
  }

  async getFileFromClient({ clientid, fileroute }: ClientGetFile) {
    try {
      const client = this.wsClientRepository.getClient(clientid);

      if (!client) {
        throw new ClientNotFoundException(clientid);
      }

      const { socket } = client;

      const tokenFile = this.fileRepository.getTokenForFile(clientid);

      this.logger.info(
        `Emmiting getting file from client ${clientid} ${tokenFile}`,
      );

      this.logger.info(
        `Getting file from client eventtttt ${clientid} ${fileroute} ${tokenFile}`,
      );
      const { upload_url } = await fetch(
        "http://localhost:3002/api/upload-endpoint",
      )
        .then(
          async res => (await res.json()) as Promise<{ upload_url: string }>,
        )
        .catch(error => {
          this.logger.error("Error on get file from client", error);
          throw new Error("Error on get file from client");
        });
      this.logger.info(upload_url);
      socket.emit("getFileFromClient", {
        fileroute,
        upload_url,
      });
    } catch (error: unknown) {
      this.logger.error("Error on get file from client", error);
      throw new Error("Error on get file from client");
    }
  }
}
