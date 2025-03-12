import { Injectable } from "@nestjs/common";
import { LoggerService } from "../../shared/providers";
import { ControllerRepository } from "@/src/repository/controller/controller.repository";
import { WsApplicationRepository } from "../domain/ws-application.repository";

@Injectable()
export class WsApplicationAddFriendUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly controllerRepository: ControllerRepository,

    private readonly wsApplicationRepository: WsApplicationRepository,
  ) {}

  async execute(token: string, clientid: string) {
    try {
      this.logger.info(`WsApplicationAddFriend ${clientid} `);

      const request = this.wsApplicationRepository.getRequest(clientid);

      if (!request) throw new Error("Request not found");

      if (request.token !== token) throw new Error("Token not match");

      const res = await this.controllerRepository.addFriendToController(
        request.controllerid,
        clientid,
      );

      this.wsApplicationRepository.removeRequest(clientid);

      return res;
    } catch (error) {
      this.logger.error("Error WsApplicationAddFriend");
    }
  }
}
