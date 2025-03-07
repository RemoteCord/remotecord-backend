import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import { SendFileToClientDto } from "../../../infrastructure/routes/send-file-to-client/send-file-to-client.dto";
import { ControllerRepository } from "@/src/repository/controller/controller.repository";
import { WsClientRepository } from "@/src/modules/ws-client/domain/ws-client.repository";
import { WsClientUploadFile } from "@/src/modules/ws-client/application/events/ws-client-upload-file";

@Injectable()
export class SendFileToClientUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly controllerRepository: ControllerRepository,
    private readonly wsClientUploadFile: WsClientUploadFile,
  ) {}
  async execute(controllerid: string, data: SendFileToClientDto) {
    const activeclient = (
      await this.controllerRepository.getControllerById(controllerid)
    ).activeclient;

    this.logger.info(
      `Sending file to client ${activeclient} from controller ${controllerid}`,
    );

    if (!activeclient) this.logger.error("No active client found");

    await this.wsClientUploadFile.execute({
      clientid: activeclient,
      fileroute: data.fileroute,
    });
  }
}
