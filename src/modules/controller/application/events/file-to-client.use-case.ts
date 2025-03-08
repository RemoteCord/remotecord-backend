import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable, StreamableFile } from "@nestjs/common";
import {
  GetFileDto,
  SendFileToClientDto,
} from "../../infrastructure/routes/dto/file.dto";
import { ControllerRepository } from "@/src/repository/controller/controller.repository";
import { WsClientFile } from "@/src/modules/ws-client/application/events/ws-client-file";
import { WsBotRepository } from "@/src/modules/ws-bot/domain/ws-bot.repository";
import Crypto from "node:crypto";
import { ClientRepository } from "@/src/modules/client/domain/client.repository";
@Injectable()
export class FileToClientUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly controllerRepository: ControllerRepository,
    private readonly wsClientFile: WsClientFile,
    private readonly clientRepository: ClientRepository,
  ) {}
  async sendFileToClient(controllerid: string, data: SendFileToClientDto) {
    const activeclient = (
      await this.controllerRepository.getControllerById(controllerid)
    ).activeclient;

    this.logger.info(
      `Sending file to client ${activeclient} from controller ${controllerid}`,
    );

    if (!activeclient) this.logger.error("No active client found");

    await this.wsClientFile.uploadFileToClient({
      clientid: activeclient,
      fileroute: data.fileroute,
    });
  }

  async getFileFromRepository(controllerid: string) {
    const file = this.clientRepository.getFile(controllerid);

    if (!file || !file.buffer) {
      this.logger.error("File not found or file buffer is empty");
      throw new Error("File not found or file buffer is empty");
    }

    return new StreamableFile(new Uint8Array(file.buffer), {
      type: "application/octet-stream",
      disposition: `attachment; filename="${file.metadata.filename}"`,
    });
  }

  async getFileFromClient(controllerid: string, data: GetFileDto) {
    const token = Crypto.randomBytes(48)
      .toString("base64")
      .replace(/\//g, "_")
      .replace(/\+/g, "-");

    console.log(token);

    this.logger.info(
      `Unique token generating for file ${controllerid}: ${token}`,
    );

    const activeclient = (
      await this.controllerRepository.getControllerById(controllerid)
    ).activeclient;

    this.logger.info(
      `Getting file from client ${activeclient} from controller ${controllerid} ${token}`,
    );

    if (!activeclient) this.logger.error("No active client found");

    this.clientRepository.addTokenForFile(activeclient, token);

    await this.wsClientFile.getFileFromClient({
      clientid: activeclient,
      fileroute: data.fileroute,
    });
  }
}
