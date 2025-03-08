import { LoggerService } from "@/src/modules/shared/providers";
import { WsClientGetScreens } from "@/src/modules/ws-client/application/events/ws-client-get-screens";
import { ControllerRepository } from "@/src/repository/controller/controller.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GetAvailableScreensUseCase {
  constructor(
    private readonly controllerRepository: ControllerRepository,
    private readonly wsClientGetScreens: WsClientGetScreens,
    private readonly logger: LoggerService,
  ) {}

  async execute(controllerid: string) {
    this.logger.info(
      `Getting available screens for controller ${controllerid}`,
    );
    const activeclient = (
      await this.controllerRepository.getControllerById(controllerid)
    ).activeclient;

    await this.wsClientGetScreens.execute(activeclient);

    return { status: true };
  }
}
