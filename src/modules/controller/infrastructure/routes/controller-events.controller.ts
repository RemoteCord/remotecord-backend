import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CONTROLLER_ROUTE } from "../route.constants";
import { GetFileDto, SendFileToClientDto } from "./dto/file.dto";
import { FileToClientUseCase } from "../../application/events/file-to-client.use-case";
import { GetTasksUseCase } from "../../application/events/get-tasks.use-case";
import { SendCmdCommandToClientDto } from "./dto/send-command.dto";
import { SendCmdCommandToClientUseCase } from "../../application/events/send-cmd-command.use-case";

@Controller(CONTROLLER_ROUTE)
export class ControllerEvents {
  constructor(
    private readonly fileToClientUseCase: FileToClientUseCase,
    private readonly getTasksUseCase: GetTasksUseCase,
    private readonly sendCmdToClientUseCase: SendCmdCommandToClientUseCase,
  ) {}

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

  @Get(":controllerid/tasks")
  async sendTasksToEvent(@Param("controllerid") controllerid: string) {
    return await this.getTasksUseCase.execute(controllerid);
  }

  @Post(":controllerid/cmd")
  async sendCmdCommandToClient(
    @Param("controllerid") controllerid: string,
    @Body() body: SendCmdCommandToClientDto,
  ) {
    return await this.sendCmdToClientUseCase.execute(controllerid, body);
  }
}
