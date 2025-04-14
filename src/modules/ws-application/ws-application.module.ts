import { forwardRef, Module } from "@nestjs/common";
import { WsApplicationGateway } from "./infrastructure/ws-application.gateway";
import { WsApplicationRepository } from "./domain/ws-application.repository";
import { WsApplicationJoinsUseCase } from "./application/ws-application-joins.use-case";
import { WsApplicationLeavesUseCase } from "./application/ws-application-leaves.use-case";
import { WsApplicationVerifyConnectionUseCase } from "./application/ws-application-verify-connection.use-case";
import { WsApplicationGuard } from "./application/ws-application.guard";
import { SchemasModule } from "@/src/repository/db/schemas.module";
import { AuthModule } from "../auth/auth.module";
import { WsApplicationConnectClientUseCase } from "./application/events/ws-application-connect-client.use-case";
import { WsApplicationAddFriend } from "./application/events/ws-application-add-friend";
import { WsApplicationAddFriendUseCase } from "./application/ws-application-friend.use-case";
import { WsClientModule } from "../ws-client/ws-client.module";
import { WsBotModule } from "../ws-bot/ws-bot.module";

@Module({
  providers: [
    WsApplicationGateway,
    WsApplicationRepository,
    WsApplicationJoinsUseCase,
    WsApplicationLeavesUseCase,
    WsApplicationVerifyConnectionUseCase,
    WsApplicationConnectClientUseCase,
    WsApplicationGuard,
    WsApplicationAddFriend,
    WsApplicationAddFriendUseCase,
  ],
  exports: [
    WsApplicationJoinsUseCase,
    WsApplicationLeavesUseCase,
    WsApplicationConnectClientUseCase,
    WsApplicationRepository,
    WsApplicationAddFriend,
    WsApplicationAddFriendUseCase,
  ],
  imports: [
    forwardRef(() => SchemasModule),
    forwardRef(() => AuthModule),
    forwardRef(() => WsClientModule),
    forwardRef(() => WsBotModule),
  ],
})
export class WsApplicationModule {}
