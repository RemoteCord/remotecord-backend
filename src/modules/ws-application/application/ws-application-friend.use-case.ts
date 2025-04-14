import { Injectable } from "@nestjs/common";
import { LoggerService } from "../../shared/providers";
import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";
import { WsBotSendFriendUseCase } from "../../ws-bot/application/events/ws-bot-send-friend.use-case";
import { ClientPermissionRepository } from "@/src/repository/db/clientPermisions/clientPermission.repository";

@Injectable()
export class WsApplicationAddFriendUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly controllerRepository: ControllerRepository,
    private readonly clientPermissionsRepository: ClientPermissionRepository,
    private readonly wsBotSendFriendUseCase: WsBotSendFriendUseCase,
  ) {}

  async execute(
    token: string,
    accept: boolean,
    clientid: string,
    controllerid: string,
  ) {
    try {
      this.logger.info(`WsApplicationAddFriend ${clientid} ${controllerid} `);
      const res = await this.controllerRepository.addFriendToController(
        controllerid,
        clientid,
      );

      this.clientPermissionsRepository.createPermissionDocument(
        clientid,
        controllerid,
      );

      this.wsBotSendFriendUseCase.execute({
        accept,
        controllerid,
        clientid,
      });

      return res;
    } catch (error) {
      this.logger.error("Error WsApplicationAddFriend");
    }
  }
}
