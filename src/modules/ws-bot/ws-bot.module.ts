import { forwardRef, Module } from "@nestjs/common";
import { WsBotGateway } from "./infrastructure/ws-bot.gateway";
import { WsBotRepository } from "./domain/ws-bot.repository";
import { WsBotJoinsUseCase } from "./application/ws-bot-joins.use-case";
import { WsBotSendMessageUseCase } from "./application/events/ws-bot-send-message.use-case";
import { WsBotLeavesUseCase } from "./application/ws-bot-leaves.use-case";
import { WsBotConnectClientUseCase } from "./application/events/ws-bot-connect-client.use-case";
import { WsBotDisconnectClientUseCase } from "./application/events/ws-bot-disconnect-client.use-case";
import { AuthModule } from "../auth/auth.module";
import { WsBotSendScreensUseCase } from "./application/events/ws-bot-send-screens.use-case";
import { WsBotSendCommandUseCase } from "./application/events/ws-bot-send-command.use-case";
import { WsBotSendFileUseCase } from "./application/events/ws-bot-send-file.use-case";
import { ClientModule } from "../client/infrastructure/client.module";

@Module({
  providers: [
    WsBotGateway,
    WsBotRepository,
    WsBotJoinsUseCase,
    WsBotLeavesUseCase,
    WsBotSendMessageUseCase,
    WsBotConnectClientUseCase,
    WsBotDisconnectClientUseCase,
    WsBotSendScreensUseCase,
    WsBotSendCommandUseCase,
    WsBotSendFileUseCase,
  ],
  exports: [
    WsBotSendMessageUseCase,
    WsBotConnectClientUseCase,
    WsBotDisconnectClientUseCase,
    WsBotSendScreensUseCase,
    WsBotSendMessageUseCase,
    WsBotSendCommandUseCase,
    WsBotSendFileUseCase,
    WsBotRepository,
  ],
  imports: [forwardRef(() => AuthModule), ClientModule],
})
export class WsBotModule {}
