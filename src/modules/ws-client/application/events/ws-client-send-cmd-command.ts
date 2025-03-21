import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import { WsClientRepository } from "../../domain/ws-client.repository";
import { ClientNotFoundException } from "@/src/repository/db/user/exceptions";
import { SendCmdCommandToClientDto } from "@/src/modules/controller/infrastructure/routes/dto/send-command.dto";

@Injectable()
export class WsClientSendCmdCommand {
  constructor(
    private readonly wsClientRepository: WsClientRepository,

    private readonly logger: LoggerService,
  ) {}

  async execute(clientid: string, data: SendCmdCommandToClientDto) {
    const client = await this.wsClientRepository.getClient(clientid);

    if (!client) {
      this.logger.error(`Client not found: ${clientid}`);
      throw new ClientNotFoundException(clientid);
    }

    this.logger.info(`Sending command to client: ${clientid}`);

    const { socket } = client;

    socket.emit("runCmdCommand", data);
  }
}
