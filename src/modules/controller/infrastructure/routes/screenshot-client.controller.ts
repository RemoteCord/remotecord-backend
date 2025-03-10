import { Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CONTROLLER_ROUTE } from "../route.constants";
import { ScreensClientUseCase } from "../../application/screenshot-client.use-case";

@Controller(CONTROLLER_ROUTE)
export class GetScreensClientController {
  constructor(private readonly screensClientUseCase: ScreensClientUseCase) {}

  @Get(":controllerid/get-screens")
  async getScreens(@Param("controllerid") controllerid: string) {
    return await this.screensClientUseCase.getScreens(controllerid);
  }

  @Get(":controllerid/send-screenshot")
  async sendScreenshot(
    @Param("controllerid") controllerid: string,
    @Query("screenid") screenid: string,
  ) {
    return await this.screensClientUseCase.sendScreenshot(
      controllerid,
      screenid,
    );
  }
}
