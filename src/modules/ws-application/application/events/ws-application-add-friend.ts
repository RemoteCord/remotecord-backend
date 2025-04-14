import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import { AddFriendToControllerDto } from "@/src/modules/controller/infrastructure/routes/dto/controller.dto";
import { WsApplicationGateway } from "../../infrastructure/ws-application.gateway";

@Injectable()
export class WsApplicationAddFriend {
  constructor(
    private readonly logger: LoggerService,
    private readonly wsApplicationGateway: WsApplicationGateway,
  ) {}

  async execute(
    clientid: string,
    encryptedToken: string,
    data: AddFriendToControllerDto & { controllerid: string },
  ) {
    this.logger.info(
      `Attempting Client ${clientid} emitting addFriend to ws-client with controller ${data.controllerid}`,
    );

    this.wsApplicationGateway.sendEventToApplication(clientid, "addFriend", {
      ...data,
      token: encryptedToken,
    });
  }
}
