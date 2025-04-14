import { Injectable, Logger } from "@nestjs/common";
import { WsClientRepository } from "../../domain/ws-client.repository";
import type {
  AddFileClient,
  ClientGetFile,
  ClientUploadFile,
} from "../../types/ws-client-events.type";
import { ClientNotFoundException } from "@/src/repository/db/user/exceptions";
import { WsBotRepository } from "@/src/modules/ws-bot/domain/ws-bot.repository";
import { LoggerService } from "@/src/modules/shared/providers";
import { ConfigService } from "@nestjs/config";
import { WsClientGateway } from "../../infrastructure/ws-client.gateway";

@Injectable()
export class WsClientFile {
  private logger = new Logger("WsClientFile");
  constructor(
    private readonly wsClientRepository: WsClientRepository,
    // private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly wsClientGateway: WsClientGateway,
  ) {}

  async uploadFileToClient({ clientid, fileroute }: ClientUploadFile) {
    this.wsClientGateway.sendEventToClient(clientid, "uploadFile", {
      fileroute,
    });
  }

  async getFileFromClient({ clientid, fileroute }: ClientGetFile) {
    try {
      // this.logger.info(
      //   `Emmiting getting file from client ${clientid} ${tokenFile}`,
      // );

      // const { upload_url } = await fetch(
      //   "http://localhost:3002/api/upload-endpoint",
      // )

      const CDN_URL = this.configService.get<string>("CDN_URL");

      const { upload_url } = await fetch(
        `${CDN_URL}/api/upload-endpoint?clientid=${clientid}`,
      ).then(
        async res => (await res.json()) as Promise<{ upload_url: string }>,
      );

      this.logger.log(`Upload url: ${upload_url}`);

      this.wsClientGateway.sendEventToClient(clientid, "getFileFromClient", {
        fileroute,
        upload_url,
      });
    } catch (error: unknown) {
      this.logger.error("Error on get file from client", error);
      throw new Error("Error on get file from client");
    }
  }
}
