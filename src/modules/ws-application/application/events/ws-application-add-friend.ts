import { GetExplorerFromClientDto } from "@/src/modules/controller/infrastructure/routes/dto/get-explorer-client.dto";
import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import { WsClientRepository } from "../../../ws-client/domain/ws-client.repository";
import { AddFriend } from "../../../ws-client/application/events/ws-events.type";
import { WsApplicationRepository } from "@/src/modules/ws-application/domain/ws-application.repository";
import { AddFriendToControllerDto } from "@/src/modules/controller/infrastructure/routes/dto/add-friend-to-controller.dto";

@Injectable()
export class WsApplicationAddFriend {
  constructor(
    private readonly logger: LoggerService,
    private readonly wsApplicationRepository: WsApplicationRepository,
  ) {}

  async execute(
    clientid: string,
    encryptedToken: string,
    data: AddFriendToControllerDto & { controllerid: string },
  ) {
    const client = this.wsApplicationRepository.getClient(clientid);

    if (!client) {
      this.logger.error(`Client socket not found: ${clientid}`);
      throw new Error("Client not found");
    }

    this.logger.info(
      `Attempting Client ${clientid} emitting addFriend to ws-client with controller ${data.controllerid}`,
    );

    this.wsApplicationRepository.addRequest(clientid, {
      controllerid: data.controllerid,
      token: encryptedToken,
    });

    client.socket.emit("addFriend", {
      ...data,
      token: encryptedToken,
    });
  }
}
