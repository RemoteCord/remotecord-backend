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
    const client = this.wsClientRepository.getClient(clientid);

    if (!client) {
      throw new ClientNotFoundException(clientid);
    }

    const { socket } = client;

    const tokenFile = this.fileRepository.getTokenForFile(clientid);

    this.logger.info(
      `Emmiting getting file from client ${clientid} ${tokenFile}`,
    );

    socket.emit("getFileFromClient", {
      fileroute,
      tokenFile,
    });
  }
}
