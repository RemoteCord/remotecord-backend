import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import { GetExplorerFromClientDto } from "../../infrastructure/routes/dto/get-explorer-client.dto";
import { WsClientGetExplorer } from "@/src/modules/ws-client/application/events/ws-client-get-explorer";
import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";

@Injectable()
export class GetExplorerClientUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly controllerRepository: ControllerRepository,

    private readonly wsClientGetExplorer: WsClientGetExplorer,
  ) {}

  async execute(controllerid: string, data: GetExplorerFromClientDto) {
    this.logger.info(
      `Sending event get explorer from controller: ${controllerid} ${data}`,
    );

    const controller =
      await this.controllerRepository.getControllerById(controllerid);

    if (!controller) {
      this.logger.error(`Controller not found: ${controllerid}`);
      throw new Error("Controller not found");
    }

    const clientid = controller.activeclient;

    if (!clientid) return;

    return await this.wsClientGetExplorer.execute(clientid, data);
  }
}
