import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import { SendCmdCommandToClientDto } from "../../infrastructure/routes/dto/controller.dto";
import { GetCurrentClientUseCase } from "../get-current-client.use-case";
import { WsClientSendCmdCommand } from "@/src/modules/ws-client/application/events/ws-client-send-cmd-command";

@Injectable()
export class SendCmdCommandToClientUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly getCurrentClientUseCase: GetCurrentClientUseCase,
    private readonly wsClientSendCmdCommand: WsClientSendCmdCommand,
  ) {}

  async execute(controllerid: string, data: SendCmdCommandToClientDto) {
    const { activeclient } =
      await this.getCurrentClientUseCase.execute(controllerid);

    if (!activeclient) {
      this.logger.error("No active client found");
      return;
    }

    this.logger.info(
      `Sending command to client: ${activeclient} ${data.command}`,
    );

    await this.wsClientSendCmdCommand.execute(activeclient, data);
  }
}
