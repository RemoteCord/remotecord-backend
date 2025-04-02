import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "../../auth/auth.module";
import { SchemasModule } from "@/src/repository/db/schemas.module";
import { WsBotModule } from "../../ws-bot/ws-bot.module";
import { WsClientModule } from "../../ws-client/ws-client.module";
import { KeyLoggerRepository } from "../domain/keylogger.repository";
import { ClientController } from "./routes/client.controller";
import { UserInfoUseCase } from "../application/userinfo.use-case";
import { WsApplicationModule } from "../../ws-application/ws-application.module";
import { CommandsRepository } from "../domain/commands.repository";
import { CommandsGuard } from "../domain/commands.guard";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => WsApplicationModule),
    forwardRef(() => SchemasModule),
    forwardRef(() => WsBotModule),
    forwardRef(() => WsClientModule),
  ],
  controllers: [ClientController],
  providers: [
    KeyLoggerRepository,
    UserInfoUseCase,
    CommandsRepository,
    CommandsGuard,
  ],
  exports: [
    KeyLoggerRepository,
    UserInfoUseCase,
    CommandsRepository,
    CommandsGuard,
  ],
})
export class ClientModule {}
