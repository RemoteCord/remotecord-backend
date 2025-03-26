import { GetExplorerFromClientDto } from "@/src/modules/controller/infrastructure/routes/dto/get-explorer-client.dto";
import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import { WsClientRepository } from "../../domain/ws-client.repository";
import { WsClientGateway } from "../../infrastructure/ws-client.gateway";

@Injectable()
export class WsClientGetExplorer {
  constructor(
    private readonly logger: LoggerService,
    private readonly wsClientRepository: WsClientRepository,
    private readonly wsClientGateway: WsClientGateway,
  ) {}

  async execute(clientid: string, data: GetExplorerFromClientDto) {
    const client = this.wsClientRepository.getClient(clientid);

    if (!client) {
      this.logger.error(`Client socket not found: ${clientid}`);
      throw new Error("Client not found");
    }

    await this.wsClientGateway.sendEventToClient(
      clientid,
      "getFilesFolder",
      data,
    );

    // client.socket.emit("getFilesFolder", data);

    return { status: true };
  }
}
