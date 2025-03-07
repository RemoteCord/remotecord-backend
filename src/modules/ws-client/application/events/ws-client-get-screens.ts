import { Injectable } from "@nestjs/common";
import { WsClientRepository } from "../../domain/ws-client.repository";
import { ClientUploadFile } from "./ws-events.type";
import { ClientNotFoundException } from "@/src/repository/user/exceptions";
import { LoggerService } from "@/src/modules/shared/providers";

@Injectable()
export class WsClientGetScreens {
  constructor(
    private readonly wsClientRepository: WsClientRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(clientid: string) {
    const client = await this.wsClientRepository.getClient(clientid);

    if (!client) {
      this.logger.error(`Client not found: ${clientid}`);
      throw new ClientNotFoundException(clientid);
    }

    this.logger.info(`Emiting get screens event to client ${clientid}`);

    const { socket } = client;

    socket.emit("getScreensFromClient");
  }
}
