import { LoggerService } from "@/src/modules/shared/providers";
import { WsApplicationRepository } from "@/src/modules/ws-application/domain/ws-application.repository";
import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";
import { Injectable } from "@nestjs/common";
import { ClientDataEncryptUseCase } from "../../auth/application/client-data-encrypt.use-case";
import { WsClientRepository } from "../../ws-client/domain/ws-client.repository";
import { UserRepository } from "@/src/repository/db/user/user.repository";
import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";

@Injectable()
export class GetFriendsUseCase {
  constructor(
    private readonly controllerRepository: ControllerRepository,
    private readonly logger: LoggerService,
    private readonly clientRepository: UserRepository,
    private readonly wsClientRepository: WsClientRepository,
    private readonly redisRepository: RedisRepository,
    private readonly wsApplicationRepository: WsApplicationRepository,
  ) {}
  async execute(controllerid: string) {
    try {
      const { friends } =
        await this.controllerRepository.getControllerById(controllerid);

      // console.log("controller:", controller);
      this.logger.info(
        `Getting friends for controller ${controllerid} ${friends}`,
      );
      if (!friends) return;

      const friendsResult = await Promise.all(
        friends.map(async friend => {
          const clientData = await this.clientRepository.getUserById(friend);

          if (!clientData) {
            throw new Error("Client not found");
          }

          const clientWs = await this.redisRepository.HGET(
            ["ws", [friend]],
            "client",
          );
          const clientApplication =
            this.wsApplicationRepository.getClient(friend);
          // console.log("active:", active);
          return {
            clientid: friend,
            isactive: clientApplication ? true : false,
            isconnected: clientWs ? true : false,
            alias: clientData.name,
          };
        }),
      );

      console.log("friendsResult:", friendsResult);

      return {
        clients: friendsResult,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      this.logger.error(
        `Error getting active client from controller ${controllerid}: ${errorMessage}`,
      );

      return { clients: [] };
    }
  }
}
