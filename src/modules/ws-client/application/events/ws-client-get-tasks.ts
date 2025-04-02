import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import { WsClientRepository } from "../../domain/ws-client.repository";
import { WsClientGateway } from "../../infrastructure/ws-client.gateway";

@Injectable()
export class WsClientGetTasks {
  constructor(
    private readonly logger: LoggerService,
    private readonly wsClientGateway: WsClientGateway,
  ) {}

  async execute(clientid: string) {
    await this.wsClientGateway.sendEventToClient(
      clientid,
      "getTasksFromClient",
      {},
    );

    return { status: true };
  }
}
