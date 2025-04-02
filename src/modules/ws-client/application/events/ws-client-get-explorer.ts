import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import { WsClientRepository } from "../../domain/ws-client.repository";
import { WsClientGateway } from "../../infrastructure/ws-client.gateway";
import { GetExplorerFromClientDto } from "@/src/modules/controller/infrastructure/routes/dto/controller.dto";

@Injectable()
export class WsClientGetExplorer {
  constructor(
    private readonly logger: LoggerService,
    private readonly wsClientRepository: WsClientRepository,
    private readonly wsClientGateway: WsClientGateway,
  ) {}

  async execute(clientid: string, data: GetExplorerFromClientDto) {
    console.log("get explorer client", data);
    await this.wsClientGateway.sendEventToClient(
      clientid,
      "getFilesFolder",
      data,
    );

    // client.socket.emit("getFilesFolder", data);

    return { status: true };
  }
}
