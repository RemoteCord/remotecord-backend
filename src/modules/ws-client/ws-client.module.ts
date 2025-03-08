import { forwardRef, Module } from "@nestjs/common";
import { WsClientGateway } from "./infrastructure/ws-client.gateway";
import { WsClientRepository } from "./domain/ws-client.repository";
import { WsClientJoinsUseCase } from "./application/ws-client-joins.use-case";
import { SchemasModule } from "@/src/repository/schemas.module";
import { AuthModule } from "../auth/auth.module";
import { WsClientLeavesUseCase } from "./application/ws-client-leaves.use-case";
import { WsClientVerifyConnectionUseCase } from "./application/ws-client-verify-connection.use-case";
import { WsClientResetAllConnectionsUseCase } from "./application/ws-client-reset-all-connections-use-case";
import { WsClientGuard } from "./application/ws-client.guard";
import { WsClientFile } from "./application/events/ws-client-file";
import { WsBotModule } from "../ws-bot/ws-bot.module";
import { WsClientGetScreens } from "./application/events/ws-client-get-screens";
import { WsClientSendCmdCommand } from "./application/events/ws-client-send-cmd-command";
import { ClientModule } from "../client/infrastructure/client.module";

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
    WsClientGetScreens,
    WsClientSendCmdCommand,
  ],
  exports: [
    WsClientJoinsUseCase,
    WsClientLeavesUseCase,
    WsClientResetAllConnectionsUseCase,
    WsClientFile,
    WsClientGetScreens,
    WsClientSendCmdCommand,
    WsClientRepository,
  ],
  imports: [
    SchemasModule,
    forwardRef(() => AuthModule),
    WsBotModule,
    ClientModule,
  ],
})
export class WsClientModule {}
