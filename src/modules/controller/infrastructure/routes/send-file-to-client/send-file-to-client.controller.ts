import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CONTROLLER_ROUTE } from "../route.constants";
import { GetCurrentClientUseCase } from "@/modules/controller/application/get-current-client-use-case/get-current-client.use-case";
import { GetFriendsUseCase } from "../../../application/get-friends-use-case/get-friends.use-case";
import { SendFileToClientDto } from "./send-file-to-client.dto";
import { SendFileToClientUseCase } from "../../../application/events/send-file-to-client-use-case/send-file-to-client.use-case";

@Controller(CONTROLLER_ROUTE)
export class SendFileToClientController {
  constructor(
    private readonly sendFileToClientUseCase: SendFileToClientUseCase,
  ) {}

  @Post(":controllerid/files")
  async getCurrentClient(
    @Param("controllerid") controllerid: string,
    @Body() body: SendFileToClientDto,
  ) {
    return await this.sendFileToClientUseCase.execute(controllerid, body);
  }
}
