import { forwardRef, Module } from "@nestjs/common";
import { WsApplicationGateway } from "./infrastructure/ws-application.gateway";
import { WsApplicationRepository } from "./domain/ws-application.repository";
import { WsApplicationJoinsUseCase } from "./application/ws-application-joins.use-case";
import { WsApplicationLeavesUseCase } from "./application/ws-application-leaves.use-case";
import { WsApplicationVerifyConnectionUseCase } from "./application/ws-application-verify-connection.use-case";
import { WsApplicationResetAllConnectionsUseCase } from "./application/ws-application-reset-all-connections-use-case";
import { WsApplicationGuard } from "./application/ws-application.guard";
import { SchemasModule } from "@/src/repository/schemas.module";
import { AuthModule } from "../auth/auth.module";
import { WsApplicationConnectClientUseCase } from "./application/events/ws-application-connect-client.use-case";

@Module({
  providers: [
    WsApplicationGateway,
    WsApplicationRepository,
    WsApplicationJoinsUseCase,
    WsApplicationLeavesUseCase,
    WsApplicationVerifyConnectionUseCase,
    WsApplicationResetAllConnectionsUseCase,
    WsApplicationConnectClientUseCase,
    WsApplicationGuard,
  ],
  exports: [
    WsApplicationJoinsUseCase,
    WsApplicationLeavesUseCase,
    WsApplicationResetAllConnectionsUseCase,
    WsApplicationConnectClientUseCase,
  ],
  imports: [SchemasModule, forwardRef(() => AuthModule)],
})
export class WsApplicationModule {}
