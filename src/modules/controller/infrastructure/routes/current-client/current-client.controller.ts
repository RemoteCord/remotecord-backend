import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CONTROLLER_ROUTE } from "../route.constants";
import { GetCurrentClientUseCase } from "../../../application/get-current-client-use-case";
import { SelectCurrentClientDto } from "./current-client.dto";
import { SelectCurrentClientUseCase } from "../../../application/select-current-client-use-case";

@Controller(CONTROLLER_ROUTE)
export class CurrentClientController {
  constructor(
    private readonly getCurrentClientUseCase: GetCurrentClientUseCase,
    private readonly selectCurrentClientUseCase: SelectCurrentClientUseCase,
  ) {}

  @Get(":controllerid")
  async getCurrentClient(@Param("controllerid") controllerid: string) {
    return await this.getCurrentClientUseCase.execute(controllerid);
  }

  @Post(":controllerid/select-client")
  async selectClient(
    @Param("controllerid") controllerid: string,
    @Body() body: SelectCurrentClientDto,
  ) {
    return await this.selectCurrentClientUseCase.execute(controllerid, body);
  }
}
