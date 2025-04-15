import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import type { WsBotConnectionEvent } from "../../types/ws-bot-events.types";
import { WsClientRepository } from "@/src/modules/ws-client/domain/ws-client.repository";
import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";
import { WsBotGateway } from "../../infrastructure/ws-bot.gateway";
@Injectable()
export class WsBotConnectClientUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly wsClientRepository: WsClientRepository,
    private readonly redisRepository: RedisRepository,
    private readonly wsBotGateway: WsBotGateway,
  ) { }
  async execute(data: WsBotConnectionEvent) {
    const { controllerid, clientid } = data;

    const wsClientData = await this.wsClientRepository.getClient(clientid);
    if (!wsClientData) {
      this.logger.error(`Client ${clientid} not found`);
      return;
    }

    this.logger.info(
      `Emiting connect client event ${clientid} to controller ${controllerid} ${data.identifier}`,
    );

    const messageid = await this.redisRepository.HGET(
      ["messages-bot"],
      data.identifier,
    );

    // console.log("messageid", messageid);

    this.wsBotGateway.sendEventToBot(controllerid, "connectedClient", {
      clientid,
      alias: wsClientData.name,
      messageid,
    });
    return;
  }
}
