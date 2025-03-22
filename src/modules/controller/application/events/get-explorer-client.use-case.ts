import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import { GetExplorerFromClientDto } from "../../infrastructure/routes/dto/get-explorer-client.dto";
import { WsClientGetExplorer } from "@/src/modules/ws-client/application/events/ws-client-get-explorer";
import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";

import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";
import path from "path";
import { DirEntry } from "@/src/modules/ws-client/types/tasks.type";
import { WsBotSendExplorerUseCase } from "@/src/modules/ws-bot/application/events/ws-bot-send-explorer.use-case";

@Injectable()
export class GetExplorerClientUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly controllerRepository: ControllerRepository,

    private readonly wsClientGetExplorer: WsClientGetExplorer,

    private readonly redisRepository: RedisRepository,
    private readonly wsBotSendExplorerUseCase: WsBotSendExplorerUseCase,
  ) {}

  async execute(controllerid: string, data: GetExplorerFromClientDto) {
    this.logger.info(
      `Sending event get explorer from controller: ${controllerid} ${data}`,
    );

    const { relativepath, folder } = data;

    const controller =
      await this.controllerRepository.getControllerById(controllerid);

    if (!controller) {
      this.logger.error(`Controller not found: ${controllerid}`);
      throw new Error("Controller not found");
    }

    const clientid = controller.activeclient;

    console.log(clientid);

    if (!clientid) return;

    const resultPath = path.join(folder, relativepath);
    const key = `${clientid}:${resultPath}`;

    const cache = await this.redisRepository.getEntity("explorer", key);

    if (!cache) {
      return await this.wsClientGetExplorer.execute(clientid, data);
    }

    const cacheFormated: DirEntry[] = JSON.parse(JSON.parse(cache));

    this.logger.info(`Using cache for ${key}`);

    // const formatted = Array.from(cacheFormated);
    // console.log("cacheFormated", cacheFormated);

    this.wsBotSendExplorerUseCase.execute({
      controllerid,
      files: cacheFormated,
      folder,
      relativepath,
    });

    return;

    // console.log("cacheFormated", cacheFormated);

    // console.log("cache", cache);
    // if (!cache) {
    // }
  }
}
