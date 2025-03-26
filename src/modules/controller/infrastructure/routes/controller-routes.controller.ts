import { WsApplicationConnectClientUseCase } from "@/src/modules/ws-application/application/events/ws-application-connect-client.use-case";
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ConnectClientDto } from "./dto/connect-client.dto";
import { SelectCurrentClientDto } from "./dto/current-client.dto";
import { GetCurrentClientUseCase } from "../../application/get-current-client.use-case";
import { SelectCurrentClientUseCase } from "../../application/select-current-client.use-case";
import { ActivateControllerUseCase } from "../../application/activate-controller.use-case";
import { CONTROLLER_ROUTE } from "../route.constants";
import { AddFriendToControllerUseCase } from "../../application/add-friend-to-controller.use-case";
import { AddFriendToControllerDto } from "./dto/add-friend-to-controller.dto";
import { GetExplorerFromClientDto } from "./dto/get-explorer-client.dto";
import { GetExplorerClientUseCase } from "../../application/events/get-explorer-client.use-case";
import { GetFriendsUseCase } from "../../application/get-friends.use-case";
import { ScreensClientUseCase } from "../../application/screenshot-client.use-case";
import { ActivateControllerDto } from "./dto/activate-controller.dto";
import { ClientPermissionRepository } from "@/src/repository/db/clientPermisions/clientPermission.repository";
import { ClientPermissionGuard } from "@/src/repository/db/clientPermisions/clientPermission.guard";

@Controller(CONTROLLER_ROUTE)
export class ControllerRoutes {
  constructor(
    private readonly wsApllicationConnectClientUseCase: WsApplicationConnectClientUseCase,
    private readonly getCurrentClientUseCase: GetCurrentClientUseCase,
    private readonly selectCurrentClientUseCase: SelectCurrentClientUseCase,
    private readonly activateControllerUseCase: ActivateControllerUseCase,
    private readonly addFriendtoControllerUseCase: AddFriendToControllerUseCase,
    private readonly getExplorerClientUseCase: GetExplorerClientUseCase,
    private readonly getFriendsUseCase: GetFriendsUseCase,
    private readonly screensClientUseCase: ScreensClientUseCase,
    private readonly clientPermissionRepository: ClientPermissionRepository,
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

  @Post(":controllerid/activate")
  async activateController(
    @Param("controllerid") controllerid: string,
    @Body() body: ActivateControllerDto,
  ) {
    return await this.activateControllerUseCase.execute(
      controllerid,
      body.picture,
      body.name,
    );
  }

  @Post(":controllerid/add-friend")
  async addFriend(
    @Param("controllerid") controllerid: string,
    @Body() body: AddFriendToControllerDto,
  ) {
    console.log(body, controllerid);

    return await this.addFriendtoControllerUseCase.execute(controllerid, body);
  }

  @Get(":controllerid/friends")
  async getFriendsController(@Param("controllerid") controllerid: string) {
    return await this.getFriendsUseCase.execute(controllerid);
  }

  @UseGuards(ClientPermissionGuard)
  @Post(":controllerid/explorer")
  async getExplorerClient(
    @Param("controllerid") controllerid: string,
    @Body() body: GetExplorerFromClientDto,
  ) {
    return await this.getExplorerClientUseCase.execute(controllerid, body);
  }

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
