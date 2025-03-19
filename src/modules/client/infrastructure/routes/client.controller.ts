import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CLIENT_ROUTE } from "../route.constants";
import { AuthGuard } from "@/src/modules/auth/infrastructure/auth.guard";
import { MultipartInterceptor } from "@/src/modules/shared/interceptors/multipart.interceptor";
import { Files } from "@/src/decorators/files.decorator";
import type { FastifyRequest } from "fastify";

import { WsBotRepository } from "@/src/modules/ws-bot/domain/ws-bot.repository";
import { FileRequest } from "@/src/modules/ws-client/types/tasks.type";
import { WsClientRepository } from "@/src/modules/ws-client/domain/ws-client.repository";
import { FileUploadorDto } from "../dto/file-uploader.dto";
import { LoggerService } from "@/src/modules/shared/providers";
import { UserInfoUseCase } from "../../application/userinfo.use-case";
import { UpdateUsernameDto } from "../dto/client.dto";

@Controller(CLIENT_ROUTE)
export class ClientController {
  constructor(
    private readonly userInfoUseCase: UserInfoUseCase,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(AuthGuard)
  @Get("user-info")
  async getUserInfo(@Req() req: FastifyRequest) {
    const clientid: string = req.headers.clientid!;
    return await this.userInfoUseCase.getUserInfo(clientid);
  }

  @UseGuards(AuthGuard)
  @Post("user-name")
  async updateUsername(
    @Req() req: FastifyRequest,
    @Body() body: UpdateUsernameDto,
  ) {
    const clientid: string = req.headers.clientid!;
    return await this.userInfoUseCase.updateUsername(clientid, body.username);
    // return await this.getUserInfoUseCase.getUserName(clientid);
  }
}
