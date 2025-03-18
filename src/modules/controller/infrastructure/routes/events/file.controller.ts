import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CONTROLLER_ROUTE } from "../../route.constants";
import { GetFileDto, SendFileToClientDto } from "../dto/file.dto";
import { FileToClientUseCase } from "../../../application/events/file-to-client.use-case";

@Controller(CONTROLLER_ROUTE)
export class FileController {
  constructor(private readonly fileToClientUseCase: FileToClientUseCase) {}

  @Post(":controllerid/upload-file")
  async getCurrentClient(
    @Param("controllerid") controllerid: string,
    @Body() body: SendFileToClientDto,
  ) {
    return await this.fileToClientUseCase.sendFileToClient(controllerid, body);
  }

  @Post(":controllerid/file")
  async getFileFromClient(
    @Param("controllerid") controllerid: string,
    @Body() body: GetFileDto,
  ) {
    return await this.fileToClientUseCase.getFileFromClient(controllerid, body);
  }
}
