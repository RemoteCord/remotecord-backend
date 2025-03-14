import {
  Body,
  Controller,
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

@Controller(CLIENT_ROUTE)
export class FileUploaderController {
  constructor(
    private readonly wsClientRepository: WsClientRepository,
    private readonly logger: LoggerService,
  ) {}

  // @UseGuards(AuthGuard)
  // @Post("file/upload")
  // @UseInterceptors(
  //   MultipartInterceptor({
  //     maxFileSize: 1024 * 1024 * 1024, // 1GB limit
  //   }),
  // )
  // async uploadFile(
  //   @Files() file: Record<string, Storage.MultipartFile[]>,
  //   @Req() req: FastifyRequest,
  //   @Body() body: FileUploadorDto,
  // ) {
  //   try {
  //     // const files = (req as any).storedFiles;
  //     const clientid = req.headers.clientid;

  //     const client = this.wsClientRepository.getClient(clientid);

  //     if (!client) {
  //       throw new Error("Client not found");
  //     }

  //     const { controllerid } = client;

  //     const { tokenFile } = body;

  //     return await this.fileUploaderUseCase.execute(clientid, controllerid, {
  //       tokenFile,
  //       file,
  //     });
  //   } catch (error) {
  //     this.logger.error("Error uploading file:", error);
  //     return {
  //       success: false,
  //     };
  //   }
  // }
}
