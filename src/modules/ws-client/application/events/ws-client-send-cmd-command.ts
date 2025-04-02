import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import { WsClientRepository } from "../../domain/ws-client.repository";
import { ClientNotFoundException } from "@/src/repository/db/user/exceptions";
import { WsClientGateway } from "../../infrastructure/ws-client.gateway";
import { SendCmdCommandToClientDto } from "@/src/modules/controller/infrastructure/routes/dto/controller.dto";

@Injectable()
export class WsClientSendCmdCommand {
  constructor(
    private readonly wsClientRepository: WsClientRepository,

    private readonly logger: LoggerService,
    private readonly wsClientGateway: WsClientGateway,
  ) {}

  async execute(clientid: string, data: SendCmdCommandToClientDto) {
    this.logger.info(`Sending command to client: ${clientid}`);

    this.wsClientGateway.sendEventToClient(clientid, "runCmdCommand", data);
  }
}
