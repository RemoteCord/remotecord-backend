import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "../../auth/auth.module";
import { SchemasModule } from "@/src/repository/schemas.module";
import { WsBotModule } from "../../ws-bot/ws-bot.module";
import { WsClientModule } from "../../ws-client/ws-client.module";
import { KeyLoggerRepository } from "../domain/keylogger.repository";

@Module({
  imports: [
    forwardRef(() => AuthModule),

    SchemasModule,
    forwardRef(() => WsBotModule),
    forwardRef(() => WsClientModule),
  ],
  controllers: [],
  providers: [KeyLoggerRepository],
  exports: [KeyLoggerRepository],
})
export class ClientModule {}
