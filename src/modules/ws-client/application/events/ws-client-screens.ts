import { Injectable } from "@nestjs/common";
import { WsClientRepository } from "../../domain/ws-client.repository";
import { ClientNotFoundException } from "@/src/repository/db/user/exceptions";
import { LoggerService } from "@/src/modules/shared/providers";
import { WsClientGateway } from "../../infrastructure/ws-client.gateway";

@Injectable()
export class WsClientScreens {
  constructor(
    private readonly wsClientRepository: WsClientRepository,
    private readonly logger: LoggerService,
    private readonly wsClientGateway: WsClientGateway,
  ) {}

  async getScreens(clientid: string, identifier: string) {
    this.logger.info(`Emiting get screens event to client ${clientid}`);

    this.wsClientGateway.sendEventToClient(clientid, "getScreensFromClient", {
      identifier,
    });
  }

  async getScreenshot(clientid: string, screenid: string) {
    this.logger.info(`Emiting send screenshot event to client ${clientid}`);

    this.wsClientGateway.sendEventToClient(clientid, "getScreenshot", {
      screenid,
    });
  }
}
