import { LoggerService } from "@/src/modules/shared/providers";
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CDN_ROUTE } from "../route.constants";
import { UploadCdnUseCase } from "../../application/upload-cdn.use-case";
import { DecodeTokenDto, UploadCallbackDto } from "./dto/upload-cdn.dto";
import type { FastifyRequest } from "fastify";

@Controller(CDN_ROUTE)
export class UploadCdnController {
  constructor(
    private readonly logger: LoggerService,
    private readonly uploadCdnUseCase: UploadCdnUseCase,
  ) {}

  @Post("upload")
  async uploadFileCallback(@Body() body: UploadCallbackDto) {
    return await this.uploadCdnUseCase.uploadCallbackUseCase(body);
  }

  // @UseGuards(AuthGuard)
  @Post("decode-token")
  async decodeToken(@Body() body: DecodeTokenDto) {
    this.logger.info("Decode token", body);
    return await this.uploadCdnUseCase.decodeToken(body.token);
  }

  // @UseGuards(AuthGuard)
  @Get("verify-token-file")
  async verifyTokenFile(
    @Query("token") token: string,
    @Query("clientid") clientid: string,

    @Req() req: FastifyRequest,
  ) {
    this.logger.info("Verify token file", token);
    return await this.uploadCdnUseCase.verifyTokenFile(token, clientid);
  }
}
