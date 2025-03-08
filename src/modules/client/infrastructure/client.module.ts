import { forwardRef, Module } from "@nestjs/common";
import { FileUploaderController } from "./routes/file-uploader.controller";
import { AuthModule } from "../../auth/auth.module";
import { SchemasModule } from "@/src/repository/schemas.module";
import { WsBotModule } from "../../ws-bot/ws-bot.module";
import { WsClientModule } from "../../ws-client/ws-client.module";
import { FileUploaderUseCase } from "../application/file-uploader.use-case";
import { ClientRepository } from "../domain/client.repository";

@Module({
  imports: [
    forwardRef(() => AuthModule),

    SchemasModule,
    forwardRef(() => WsBotModule),
    forwardRef(() => WsClientModule),
  ],
  controllers: [FileUploaderController],
  providers: [FileUploaderUseCase, ClientRepository],
  exports: [ClientRepository],
})
export class ClientModule {}
