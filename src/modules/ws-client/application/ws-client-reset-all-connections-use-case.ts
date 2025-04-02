import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";
import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { ClientDataEncryptUseCase } from "../../auth/application/client-data-encrypt.use-case";
import { WsClientRepository } from "../domain/ws-client.repository";
import { UserRepository } from "@/src/repository/db/user/user.repository";
import { LoggerService } from "../../shared/providers";
import { WsClientVerifyConnectionUseCase } from "./ws-client-verify-connection.use-case";
import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";

@Injectable()
export class WsClientResetAllConnectionsUseCase {
  constructor(
    private readonly controllerRepository: ControllerRepository,
    private readonly wsClientRepsitory: WsClientRepository,
    private readonly redisRepository: RedisRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute() {
    try {
      this.logger.info("Resetting all client connections");
      await this.wsClientRepsitory.removeAllClients();
      await this.controllerRepository.resetAllActiveClients();

      const keys = await this.redisRepository.HKEYS(["client-data"]);

      await Promise.all(
        keys.map(async key => {
          await this.redisRepository.HDEL(["ws", [key]], "client");
        }),
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error("Error joining client:", errorMessage);
    }
  }
}
