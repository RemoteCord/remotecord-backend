import { Module } from "@nestjs/common";
import { ActivateController } from "./infrastructure/routes/activate-controller/activate-controller.controller";
import { SharedModule } from "../shared/shared.module";
import { SchemasModule } from "@/src/repository/schemas.module";

import { ActivateControllerUseCase } from "./application/activate-controller-use-case";
import { AddFriendToControllerUseCase } from "./application/add-friend-to-controller-use-case";
import { GetCurrentClientUseCase } from "./application/get-current-client-use-case";

import { AddFriendToController } from "./infrastructure/routes/add-friend-to-controller/add-friend-to-controller.controller";
import { CurrentClientController } from "./infrastructure/routes/current-client/current-client.controller";
import { GetFriendsUseCase } from "./application/get-friends-use-case/get-friends.use-case";
import { GetFriendsController } from "./infrastructure/routes/get-friends/get-friends.controller";
import { SendFileToClientUseCase } from "./application/events/send-file-to-client-use-case/send-file-to-client.use-case";
import { SendFileToClientController } from "./infrastructure/routes/send-file-to-client/send-file-to-client.controller";
import { WsClientModule } from "../ws-client/ws-client.module";
import { SelectCurrentClientUseCase } from "./application/select-current-client-use-case";
import { GetAvailableScreensUseCase } from "./application/get-available-screens-use-case/get-available-screens.use-case";
import { ConnectClientController } from "./infrastructure/routes/connect-client/connect-client.controller";
import { WsApplicationModule } from "../ws-application/ws-application.module";
import { GetScreensClientController } from "./infrastructure/routes/get-screens/get-screens-client.controller";

@Module({
  controllers: [
    ActivateController,
    AddFriendToController,
    CurrentClientController,
    GetFriendsController,
    SendFileToClientController,
    ConnectClientController,
    GetScreensClientController,
  ],
  providers: [
    ActivateControllerUseCase,
    AddFriendToControllerUseCase,
    GetCurrentClientUseCase,
    GetFriendsUseCase,
    SendFileToClientUseCase,
    SelectCurrentClientUseCase,
    GetAvailableScreensUseCase,
  ],
  imports: [SharedModule, SchemasModule, WsClientModule, WsApplicationModule],
})
export class ControllerModule {}
