import { LoggerService } from "@/src/modules/shared/providers";
import { Injectable } from "@nestjs/common";
import { GetCurrentClientUseCase } from "../get-current-client.use-case";
import { WsClientSendCmdCommand } from "@/src/modules/ws-client/application/events/ws-client-send-cmd-command";
import { WsClientGetTasks } from "@/src/modules/ws-client/application/events/ws-client-get-tasks";

@Injectable()
export class GetTasksUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly getCurrentClientUseCase: GetCurrentClientUseCase,
    private readonly wsClientGetTasks: WsClientGetTasks,
  ) {}

  async execute(controllerid: string) {
    const { activeclient } =
      await this.getCurrentClientUseCase.execute(controllerid);

    if (!activeclient) {
      this.logger.error("No active client found");
      return;
    }

    this.logger.info(`Sending tasks event to client: ${activeclient} `);

    await this.wsClientGetTasks.execute(activeclient);
  }
}
