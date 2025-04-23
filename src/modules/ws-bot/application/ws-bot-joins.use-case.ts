import { Configuration } from "@/src/config/env.enum";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Socket } from "socket.io";
import { LoggerService } from "../../shared/providers";
import { WsBotRepository } from "../domain/ws-bot.repository";

@Injectable()
export class WsBotJoinsUseCase {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly wsBotRepository: WsBotRepository,
  ) { }

  async execute(client: Socket) {
    // console.log("bot", client.handshake.headers);
    const { token } = client.handshake.auth as { token: string };

    const botToken = this.configService.get(Configuration.SECRET);

    if (token !== botToken) {
      this.logger.error("Unauthorized bot connection attempt");
      client.disconnect();
    }


    this.wsBotRepository.generateClient(client);
  }
}
