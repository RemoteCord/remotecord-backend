import { Body, Controller, Param, Post } from "@nestjs/common";
import { SendCmdCommandToClientDto } from "../dto/send-command.dto";
import { SendCmdCommandToClientUseCase } from "../../../application/events/send-cmd-command.use-case";
import { CONTROLLER_ROUTE } from "../../route.constants";

@Controller(CONTROLLER_ROUTE)
export class SendCmdCommandController {
  constructor(
    private readonly sendCmdToClientUseCase: SendCmdCommandToClientUseCase,
  ) {}

  @Post(":controllerid/cmd")
  async sendCmdCommandToClient(
    @Param("controllerid") controllerid: string,
    @Body() body: SendCmdCommandToClientDto,
  ) {
    return await this.sendCmdToClientUseCase.execute(controllerid, body);
  }
}
