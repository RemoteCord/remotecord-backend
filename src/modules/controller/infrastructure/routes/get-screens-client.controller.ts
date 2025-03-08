import { Controller, Get, Param } from "@nestjs/common";
import { CONTROLLER_ROUTE } from "../route.constants";
import { WsClientGetScreens } from "@/src/modules/ws-client/application/events/ws-client-get-screens";
import { LoggerService } from "@/src/modules/shared/providers";
import { GetAvailableScreensUseCase } from "../../application/get-available-screens.use-case";

@Controller(CONTROLLER_ROUTE)
export class GetScreensClientController {
  constructor(
    private readonly getAvaialableScreensUseCase: GetAvailableScreensUseCase,
  ) {}

  @Get(":controllerid/get-screens")
  async getScreens(@Param("controllerid") controllerid: string) {
    return await this.getAvaialableScreensUseCase.execute(controllerid);
  }
}
