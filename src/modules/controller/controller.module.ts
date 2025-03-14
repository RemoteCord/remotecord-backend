import { Module } from "@nestjs/common";

import { SchemasModule } from "@/src/repository/schemas.module";

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
import { ActivateController } from "./infrastructure/routes/activate-controller.controller";
import { AddFriendToController } from "./infrastructure/routes/add-friend-to-controller.controller";
import { ConnectClientController } from "./infrastructure/routes/connect-client.controller";
import { CurrentClientController } from "./infrastructure/routes/current-client.controller";
import { FileController } from "./infrastructure/routes/events/file.controller";
import { SendCmdCommandController } from "./infrastructure/routes/events/send-cmd-command.controller";
import { GetExplorerClientController } from "./infrastructure/routes/get-explorer-client.controller";
import { GetFriendsController } from "./infrastructure/routes/get-friends.controller";
import { GetScreensClientController } from "./infrastructure/routes/screenshot-client.controller";
import { AuthModule } from "../auth/auth.module";
import { GetTasksController } from "./infrastructure/routes/events/get-tasks.controller";
import { GetTasksUseCase } from "./application/events/get-tasks.use-case";

@Module({
  controllers: [
    ActivateController,
    AddFriendToController,
    CurrentClientController,
    GetFriendsController,
    FileController,
    ConnectClientController,
    GetScreensClientController,
    SendCmdCommandController,
    GetExplorerClientController,
    GetTasksController,
  ],
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
  ],
  imports: [
    SharedModule,
    SchemasModule,
    WsClientModule,
    WsApplicationModule,
    WsBotModule,
    ClientModule,
    AuthModule,
  ],
})
export class ControllerModule {}
