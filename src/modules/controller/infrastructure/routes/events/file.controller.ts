import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CONTROLLER_ROUTE } from "../../route.constants";
import { GetFileDto, SendFileToClientDto } from "../dto/file.dto";
import { FileToClientUseCase } from "../../../application/events/file-to-client.use-case";
import { FileRepository } from "@/src/modules/client/domain/file.repository";

@Controller(CONTROLLER_ROUTE)
export class FileController {
  constructor(
    private readonly fileToClientUseCase: FileToClientUseCase,
    private readonly fileRepository: FileRepository,
  ) {}

  @Post(":controllerid/upload-file")
  async getCurrentClient(
    @Param("controllerid") controllerid: string,
    @Body() body: SendFileToClientDto,
  ) {
    return await this.fileToClientUseCase.sendFileToClient(controllerid, body);
  }

  @Get(":controllerid/file")
  async getFile(
    @Param("controllerid") controllerid: string,
    @Query("token") token: string,
  ) {
    return await this.fileToClientUseCase.getFileFromRepository(
      controllerid,
      token,
    );
  }

  @Post(":controllerid/file")
  async getFileFromClient(
    @Param("controllerid") controllerid: string,
    @Body() body: GetFileDto,
  ) {
    return await this.fileToClientUseCase.getFileFromClient(controllerid, body);
  }
}
