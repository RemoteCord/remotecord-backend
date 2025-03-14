import { Body, Controller, Param, Post } from "@nestjs/common";
import { CONTROLLER_ROUTE } from "../route.constants";
import { WsApplicationConnectClientUseCase } from "@/src/modules/ws-application/application/events/ws-application-connect-client.use-case";
import { ConnectClientDto } from "./dto/connect-client.dto";

@Controller(CONTROLLER_ROUTE)
export class ConnectClientController {
  constructor(
    private readonly wsApllicationConnectClientUseCase: WsApplicationConnectClientUseCase,
  ) {}

  @Post(":controllerid/disconnect-client")
  async disconnectClient(@Param("controllerid") controllerid: string) {
    return await this.wsApllicationConnectClientUseCase.disconnect(
      controllerid,
    );
  }

  @Post(":controllerid/connect-client")
  async connectClient(
    @Param("controllerid") controllerid: string,
    @Body() body: ConnectClientDto,
  ) {
    const { clientid, username, avatar } = body;

    console.log("running connect-client", controllerid, clientid);

    return await this.wsApllicationConnectClientUseCase.connect(
      controllerid,
      clientid,
      {
        username,
        avatar,
      },
    );
  }
}
