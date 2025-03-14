import { GetExplorerFromClientDto } from "@/src/modules/controller/infrastructure/routes/dto/get-explorer-client.dto";
import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import { WsClientRepository } from "../../domain/ws-client.repository";

@Injectable()
export class WsClientGetTasks {
  constructor(
    private readonly logger: LoggerService,
    private readonly wsClientRepository: WsClientRepository,
  ) {}

  async execute(clientid: string) {
    const client = this.wsClientRepository.getClient(clientid);

    if (!client) {
      this.logger.error(`Client socket not found: ${clientid}`);
      throw new Error("Client not found");
    }

    client.socket.emit("getTasksFromClient");

    return { status: true };
  }
}
