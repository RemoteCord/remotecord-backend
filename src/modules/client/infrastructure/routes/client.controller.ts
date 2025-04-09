import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CLIENT_ROUTE } from "../route.constants";
import { AuthGuard } from "@/src/modules/auth/infrastructure/auth.guard";
import type { FastifyRequest } from "fastify";

import { LoggerService } from "@/src/modules/shared/providers";
import { UserInfoUseCase } from "../../application/userinfo.use-case";
import {
  UpdateControllerPermissionsDto,
  UpdateUsernameDto,
} from "../dto/client.dto";
import { JwtAuthGuard } from "@/src/modules/auth/infrastructure/jwt.guard";

@UseGuards(JwtAuthGuard)
@Controller(CLIENT_ROUTE)
export class ClientController {
  constructor(
    private readonly userInfoUseCase: UserInfoUseCase,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(AuthGuard)
  @Get("user-info")
  async getUserInfo(@Req() req: FastifyRequest) {
    const clientid = req.headers["clientid"] as string;
    return await this.userInfoUseCase.getUserInfo(clientid);
  }

  @UseGuards(AuthGuard)
  @Post("user-name")
  async updateUsername(
    @Req() req: FastifyRequest,
    @Body() body: UpdateUsernameDto,
  ) {
    const clientid = req.headers["clientid"] as string;
    return await this.userInfoUseCase.updateUsername(clientid, body.username);
    // return await this.getUserInfoUseCase.getUserName(clientid);
  }

  @UseGuards(AuthGuard)
  @Get("friends")
  async getFriends(@Req() req: FastifyRequest) {
    const clientid = req.headers["clientid"] as string;
    return await this.userInfoUseCase.getFriends(clientid);
  }

  @UseGuards(AuthGuard)
  @Delete("friends/:controllerid")
  async deleteFriend(
    @Req() req: FastifyRequest,
    @Param("controllerid") controllerid: string,
  ) {
    const clientid = req.headers["clientid"] as string;
    return await this.userInfoUseCase.deleteFriend(clientid, controllerid);
  }

  @UseGuards(AuthGuard)
  @Post("friends/permissions")
  async updateControllerPermissions(
    @Req() req: FastifyRequest,
    @Body() body: UpdateControllerPermissionsDto,
  ) {
    const clientid = req.headers["clientid"] as string;

    const { permissions, controllerid } = body;

    return await this.userInfoUseCase.updateControllerPermissions(
      permissions,
      controllerid,
      clientid,
    );
  }
}
