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
import { generateRandomHex } from "@/src/utils";
@Injectable()
export class FileToClientUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly controllerRepository: ControllerRepository,
    private readonly wsClientFile: WsClientFile,
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

  async getFileFromClient(controllerid: string, data: GetFileDto) {
    const token = generateRandomHex();

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

    await this.wsClientFile.getFileFromClient({
      clientid: activeclient,
      fileroute: data.fileroute,
    });
  }
}
