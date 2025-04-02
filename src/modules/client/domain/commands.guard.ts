import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { CommandsRepository } from "./commands.repository";
import { LoggerService } from "../../shared/providers";
import { Socket } from "socket.io";
import { Permissions } from "@/src/repository/db/clientPermisions/clientPermission.schema";

@Injectable()
export class CommandsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly commandsRepository: CommandsRepository,
    private readonly logger: LoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();

    const command = this.reflector.get<string>(
      "command",
      context.getHandler(),
    ) as Permissions;

    if (!command) {
      this.logger.error("Missing command decorator in ws-client gateway event");
      return false;
    }

    const clientid = client.handshake.query["clientid"] as string;

    const allowed = await this.commandsRepository.verifyPermissionEvent(
      clientid,
      command,
    );

    if (!allowed) {
      this.logger.error(
        `Client ${clientid} not allowed to execute command:`,
        command,
      );
      return false;
    }

    await this.commandsRepository.deleteCommandEvent(clientid, command);

    return true;
  }
}
