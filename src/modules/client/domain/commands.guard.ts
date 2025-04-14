import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { CommandsRepository } from "./commands.repository";
import { LoggerService } from "../../shared/providers";
import { Socket } from "socket.io";
import { Permissions } from "@/src/repository/db/clientPermisions/clientPermission.schema";

@Injectable()
export class CommandsGuard implements CanActivate {
  private logger = new Logger("CommandsGuard");
  constructor(
    private reflector: Reflector,
    private readonly commandsRepository: CommandsRepository,
    // private readonly logger: LoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const clientid = client.handshake.query["clientid"] as string;
    const controllerid = client.handshake.query["controllerid"] as string;
    this.logger.log(`Running Commands Guard ${clientid}`);
    const command = this.reflector.get<string>(
      "command",
      context.getHandler(),
    ) as Permissions;

    const allowed = await this.commandsRepository.verifyPermissionEvent(
      clientid,
      command,
    );

    if (!allowed) {
      this.logger.error(
        `Client ${clientid} not allowed to execute command: ${command}`,
      );
      return false;
    }

    await this.commandsRepository.deleteCommandEvent(clientid, command);

    this.logger.log(
      `Sending command event: ${command} from client ${clientid} to controller ${controllerid}`,
    );
    return true;
  }
}
