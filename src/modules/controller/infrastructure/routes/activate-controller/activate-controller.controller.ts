import { Body, Controller, Post } from "@nestjs/common";

import { CONTROLLER_ROUTE } from "../route.constants";
import { ActivateControllerDto } from "../../../application/activate-controller-use-case/activate-controller.dto";
import { ActivateControllerUseCase } from "../../../application/activate-controller-use-case/activate-controller.use-case";

@Controller(CONTROLLER_ROUTE)
export class ActivateController {
  constructor(
    private readonly activateControllerUseCase: ActivateControllerUseCase,
  ) {}

  @Post("activate")
  async run(@Body() body: ActivateControllerDto) {
    return await this.activateControllerUseCase.execute(body);
  }
}
