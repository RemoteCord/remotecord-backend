import { Controller, Get, Param } from "@nestjs/common";
import { CONTROLLER_ROUTE } from "../route.constants";
import { WsClientGetScreens } from "@/src/modules/ws-client/application/events/ws-client-get-screens";
import { LoggerService } from "@/src/modules/shared/providers";
import { GetCurrentClientUseCase } from "../../../application/get-current-client-use-case";
import { GetAvailableScreensUseCase } from "../../../application/get-available-screens-use-case/get-available-screens.use-case";

@Controller(CONTROLLER_ROUTE)
export class GetScreensClientController {
  constructor(
    private readonly wsClientGetScreens: WsClientGetScreens,
    private readonly getAvaialableScreensUseCase: GetAvailableScreensUseCase,
    private readonly logger: LoggerService,
  ) {}

  @Get(":controllerid/get-screens")
  async getScreens(@Param("controllerid") controllerid: string) {
    return await this.getAvaialableScreensUseCase.execute(controllerid);
  }
}
