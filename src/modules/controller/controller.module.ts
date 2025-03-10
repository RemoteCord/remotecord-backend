import { Module } from "@nestjs/common";
import { ActivateController } from "./infrastructure/routes/activate-controller.controller";
import { SharedModule } from "../shared/shared.module";
import { SchemasModule } from "@/src/repository/schemas.module";

import { ActivateControllerUseCase } from "./application/activate-controller.use-case";
import { AddFriendToControllerUseCase } from "./application/add-friend-to-controller.use-case";
import { GetCurrentClientUseCase } from "./application/get-current-client.use-case";

import { AddFriendToController } from "./infrastructure/routes/add-friend-to-controller.controller";
import { CurrentClientController } from "./infrastructure/routes/current-client.controller";
import { GetFriendsUseCase } from "./application/get-friends.use-case";
import { GetFriendsController } from "./infrastructure/routes/get-friends.controller";
import { FileToClientUseCase } from "./application/events/file-to-client.use-case";
import { FileController } from "./infrastructure/routes/events/file.controller";
import { WsClientModule } from "../ws-client/ws-client.module";
import { SelectCurrentClientUseCase } from "./application/select-current-client.use-case";
import { ScreensClientUseCase } from "./application/screenshot-client.use-case";
import { ConnectClientController } from "./infrastructure/routes/connect-client.controller";
import { WsApplicationModule } from "../ws-application/ws-application.module";
import { GetScreensClientController } from "./infrastructure/routes/screenshot-client.controller";
import { SendCmdCommandToClientUseCase } from "./application/events/send-cmd-command.use-case";
import { SendCmdCommandController } from "./infrastructure/routes/events/send-cmd-command.controller";
import { WsBotModule } from "../ws-bot/ws-bot.module";
import { ClientModule } from "../client/infrastructure/client.module";
import { GetExplorerClientController } from "./infrastructure/routes/get-explorer-client.controller";
import { GetExplorerClientUseCase } from "./application/events/get-explorer-client.use-case";

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
  ],
  imports: [
    SharedModule,
    SchemasModule,
    WsClientModule,
    WsApplicationModule,
    WsBotModule,
    ClientModule,
  ],
})
export class ControllerModule {}
