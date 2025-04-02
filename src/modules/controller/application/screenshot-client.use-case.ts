import { LoggerService } from "@/src/modules/shared/providers";
import { WsClientScreens } from "@/src/modules/ws-client/application/events/ws-client-screens";
import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";
import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ScreensClientUseCase {
  constructor(
    private readonly controllerRepository: ControllerRepository,
    private readonly wsClientScreens: WsClientScreens,
    private readonly redisRepository: RedisRepository,
    private readonly logger: LoggerService,
  ) {}

  async getScreens(controllerid: string, identifier: string) {
    this.logger.info(
      `Getting available screens for controller ${controllerid}`,
    );

    const activeclient = await this.redisRepository.HGET(
      ["connection-ws"],
      controllerid,
    );

    if (!activeclient) return;

    await this.wsClientScreens.getScreens(activeclient, identifier);

    return { status: true };
  }

  async sendScreenshot(controllerid: string, screenid: string) {
    this.logger.info(
      `Sending screenshot ${screenid} to controller ${controllerid}`,
    );

    const activeclient = (
      await this.controllerRepository.getControllerById(controllerid)
    ).activeclient;

    if (!activeclient) return;
    await this.wsClientScreens.getScreenshot(activeclient, screenid);

    return { status: true };
  }
}
