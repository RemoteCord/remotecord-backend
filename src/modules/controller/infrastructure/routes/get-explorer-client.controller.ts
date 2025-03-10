import { Body, Controller, Param, Post } from "@nestjs/common";
import { CONTROLLER_ROUTE } from "../route.constants";
import { GetExplorerFromClientDto } from "./dto/get-explorer-client.dto";
import { GetExplorerClientUseCase } from "../../application/events/get-explorer-client.use-case";

@Controller(CONTROLLER_ROUTE)
export class GetExplorerClientController {
  constructor(
    private readonly getExplorerClientUseCase: GetExplorerClientUseCase,
  ) {}

  @Post(":controllerid/explorer")
  async getExplorerClient(
    @Param("controllerid") controllerid: string,
    @Body() body: GetExplorerFromClientDto,
  ) {
    return await this.getExplorerClientUseCase.execute(controllerid, body);
  }
}
