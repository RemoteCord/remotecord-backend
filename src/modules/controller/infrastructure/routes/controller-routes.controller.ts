import { WsApplicationConnectClientUseCase } from "@/src/modules/ws-application/application/events/ws-application-connect-client.use-case";
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { GetCurrentClientUseCase } from "../../application/get-current-client.use-case";
import { SelectCurrentClientUseCase } from "../../application/select-current-client.use-case";
import { ActivateControllerUseCase } from "../../application/activate-controller.use-case";
import { CONTROLLER_ROUTE } from "../route.constants";
import { AddFriendToControllerUseCase } from "../../application/add-friend-to-controller.use-case";
import { GetExplorerClientUseCase } from "../../application/events/get-explorer-client.use-case";
import { GetFriendsUseCase } from "../../application/get-friends.use-case";
import { ScreensClientUseCase } from "../../application/screenshot-client.use-case";
import { ClientPermissionRepository } from "@/src/repository/db/clientPermisions/clientPermission.repository";
import { ClientPermissionGuard } from "@/src/repository/db/clientPermisions/clientPermission.guard";
import {
  ActivateControllerDto,
  AddFriendToControllerDto,
  BaseControllerDto,
  ConnectClientDto,
  DeleteFriendFromControllerDto,
  GetExplorerFromClientDto,
  SelectCurrentClientDto,
} from "./dto/controller.dto";
import { LoggerService } from "@/src/modules/shared/providers";
import { MessageBotGuard } from "../../application/guards/MessageBot.guard";
import type { FastifyRequest } from "fastify";
import { ControllerAuthorizationGuard } from "../../application/guards/ControllerAuthorization.guard";
import { DeleteFriendFromControrllerUseCase } from "../../application/delete-friend-from-controller.use-case";

@UseGuards(ControllerAuthorizationGuard)
@Controller(CONTROLLER_ROUTE)
export class ControllerRoutes {
  private logger = new Logger("ControllerRoutes");
  constructor(
    private readonly wsApllicationConnectClientUseCase: WsApplicationConnectClientUseCase,
    private readonly getCurrentClientUseCase: GetCurrentClientUseCase,
    private readonly selectCurrentClientUseCase: SelectCurrentClientUseCase,
    private readonly activateControllerUseCase: ActivateControllerUseCase,
    private readonly addFriendtoControllerUseCase: AddFriendToControllerUseCase,
    private readonly deleteFriendFromControllerUseCase: DeleteFriendFromControrllerUseCase,
    private readonly getExplorerClientUseCase: GetExplorerClientUseCase,
    private readonly getFriendsUseCase: GetFriendsUseCase,
    private readonly screensClientUseCase: ScreensClientUseCase,
  ) { }

  @Get(":controllerid")
  async getCurrentClient(@Param("controllerid") controllerid: string) {
    return await this.getCurrentClientUseCase.execute(controllerid);
  }
  @Post(":controllerid/disconnect-client")
  async disconnectClient(@Param("controllerid") controllerid: string) {
    return await this.wsApllicationConnectClientUseCase.disconnect(
      controllerid,
    );
  }

  @UseGuards(MessageBotGuard)
  @Post(":controllerid/connect-client")
  async connectClient(
    @Param("controllerid") controllerid: string,
    @Body() body: ConnectClientDto,
    @Req() req: FastifyRequest,
  ) {
    const { clientid, username, avatar, messageid } = body;

    // this.logger.log(`Running connect-client for clientid`);

    return await this.wsApllicationConnectClientUseCase.connect(
      controllerid,
      clientid,
      req.headers["identifier"] as string,
      {
        username,
        avatar,
      },
    );
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

  @Post(":controllerid/delete-friend")
  async deleteFriend(
    @Param("controllerid") controllerid: string,
    @Body() body: DeleteFriendFromControllerDto,
  ) {
    // console.log(body, controllerid);

    return await this.deleteFriendFromControllerUseCase.execute(controllerid, body);
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

  @UseGuards(MessageBotGuard, ClientPermissionGuard)
  @Post(":controllerid/get-screens")
  async getScreens(
    @Param("controllerid") controllerid: string,
    @Body() body: BaseControllerDto,
    @Req() req: FastifyRequest,
  ) {
    return await this.screensClientUseCase.getScreens(
      controllerid,
      req.headers["identifier"] as string,
    );
  }

  @UseGuards(ClientPermissionGuard)
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
