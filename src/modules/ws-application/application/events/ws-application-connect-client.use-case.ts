import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable, Logger } from "@nestjs/common";
import { Socket } from "socket.io";
import { WsApplicationRepository } from "../../domain/ws-application.repository";
import { ClientDataEncryptUseCase } from "@/src/modules/auth/application/client-data-encrypt.use-case";
import { WsClientRepository } from "@/src/modules/ws-client/domain/ws-client.repository";
import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";
import { WsApplicationGateway } from "../../infrastructure/ws-application.gateway";
import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";
import { WsClientGateway } from "@/src/modules/ws-client/infrastructure/ws-client.gateway";
import { generateRandomHash } from "@/src/utils";

@Injectable()
export class WsApplicationConnectClientUseCase {
  private logger = new Logger("WsApplicationConnectClientUseCase");
  constructor(
    private readonly controllerRepository: ControllerRepository,
    private readonly wsApplicationRepository: WsApplicationRepository,
    private readonly redisRepository: RedisRepository,
    private readonly wsApplicationGateway: WsApplicationGateway,
    private readonly wsClientGateway: WsClientGateway,
  ) { }

  async disconnect(controllerid: string) {
    try {
      const clientid =
        await this.controllerRepository.getActiveClient(controllerid);
      if (!clientid) throw new Error("Controller not found");

      await this.wsClientGateway.sendEventToClient(
        clientid,
        "emitDisconnectFromController",
        {
          controller: controllerid,
        },
      );

      // this.logger.log(`Disconnecting controller ${controllerid}`);

      // await this.redisRepository.HDEL(["ws", [clientid]], "client");

      return { status: true };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error("Error disconnecting client:", errorMessage);
      return { status: false, message: errorMessage };
    }
  }

  async connect(
    controllerid: string,
    clientid: string,
    identifier: string,
    data: {
      username: string;
      avatar: string;
    },
  ) {
    // const { username, avatar } = data;
    try {
      const activeclient =
        await this.controllerRepository.getActiveClient(controllerid);
      console.log(activeclient);
      if (activeclient === clientid)
        throw new Error("Client already connected");

      if (activeclient !== "")
        throw new Error("Controller have another client connected");


      const tokenConnection = generateRandomHash();

      this.redisRepository.HSET(
        ["token-connections"],
        {
          [controllerid]: tokenConnection,
        },
        true,
      );

      this.wsApplicationGateway.sendEventToApplication(
        clientid,
        "emitConnectToController",
        {
          controllerid,
          tokenConnection,
          controller: data,
          identifier,
        },
      );

      return { status: true };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error("Error joining client:", errorMessage);
      return { status: false, message: errorMessage };
    }
  }
}
