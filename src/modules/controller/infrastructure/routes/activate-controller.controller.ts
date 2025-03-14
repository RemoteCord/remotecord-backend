import { Body, Controller, Param, Post } from "@nestjs/common";

import { CONTROLLER_ROUTE } from "../route.constants";
import { ActivateControllerDto } from "../../application/dto/activate-controller.dto";
import { ActivateControllerUseCase } from "../../application/activate-controller.use-case";

@Controller(CONTROLLER_ROUTE)
export class ActivateController {
  constructor(
    private readonly activateControllerUseCase: ActivateControllerUseCase,
  ) {}

  @Post(":controllerid/activate")
  async run(@Param("controllerid") controllerid: string) {
    return await this.activateControllerUseCase.execute(controllerid);
  }
}
