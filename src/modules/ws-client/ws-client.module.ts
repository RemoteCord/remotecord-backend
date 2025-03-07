import { forwardRef, Module } from "@nestjs/common";
import { ClientDataEncryptUseCase } from "../auth/application/client-data-encrypt.use-case";
import { WsClientGateway } from "./infrastructure/ws-client.gateway";
import { WsClientRepository } from "./domain/ws-client.repository";
import { WsClientJoinsUseCase } from "./application/ws-client-joins.use-case";
import { SchemasModule } from "@/src/repository/schemas.module";
import { AuthModule } from "../auth/auth.module";
import { WsClientLeavesUseCase } from "./application/ws-client-leaves.use-case";
import { WsClientVerifyConnectionUseCase } from "./application/ws-client-verify-connection.use-case";
import { WsClientResetAllConnectionsUseCase } from "./application/ws-client-reset-all-connections-use-case";
import { WsClientGuard } from "./application/ws-client.guard";
import { WsClientUploadFile } from "./application/events/ws-client-upload-file";
import { WsBotModule } from "../ws-bot/ws-bot.module";
import { WsClientGetScreens } from "./application/events/ws-client-get-screens";

@Module({
  providers: [
    WsClientGateway,
    WsClientRepository,
    WsClientJoinsUseCase,
    WsClientLeavesUseCase,
    WsClientVerifyConnectionUseCase,
    WsClientResetAllConnectionsUseCase,
    WsClientGuard,
    WsClientUploadFile,
    WsClientGetScreens,
  ],
  exports: [
    WsClientJoinsUseCase,
    WsClientLeavesUseCase,
    WsClientResetAllConnectionsUseCase,
    WsClientUploadFile,
    WsClientGetScreens,
  ],
  imports: [SchemasModule, forwardRef(() => AuthModule), WsBotModule],
})
export class WsClientModule {}
