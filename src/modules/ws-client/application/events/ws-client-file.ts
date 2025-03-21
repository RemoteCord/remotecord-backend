import { Injectable } from "@nestjs/common";
import { WsClientRepository } from "../../domain/ws-client.repository";
import type {
  AddFileClient,
  ClientGetFile,
  ClientUploadFile,
} from "./ws-events.type";
import { ClientNotFoundException } from "@/src/repository/db/user/exceptions";
import { WsBotRepository } from "@/src/modules/ws-bot/domain/ws-bot.repository";
import { LoggerService } from "@/src/modules/shared/providers";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class WsClientFile {
  constructor(
    private readonly wsClientRepository: WsClientRepository,
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
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

      // this.logger.info(
      //   `Emmiting getting file from client ${clientid} ${tokenFile}`,
      // );

      this.logger.info(
        `Getting file from client eventtttt ${clientid} ${fileroute} `,
      );
      // const { upload_url } = await fetch(
      //   "http://localhost:3002/api/upload-endpoint",
      // )

      const CDN_URL = this.configService.get<string>("CDN_URL");

      const { upload_url } = await fetch(`${CDN_URL}/api/upload-endpoint`)
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
