import { Module } from "@nestjs/common";
import { UploadCdnController } from "./infrastructure/routes/upload-cdn.controller";
import { UploadCdnUseCase } from "./application/upload-cdn.use-case";
import { AuthModule } from "../auth/auth.module";
import { ClientModule } from "../client/infrastructure/client.module";
import { UserRepository } from "@/src/repository/user/user.repository";
import { SchemasModule } from "@/src/repository/schemas.module";
import { WsClientModule } from "../ws-client/ws-client.module";
import { WsBotModule } from "../ws-bot/ws-bot.module";

@Module({
  imports: [
    AuthModule,
    ClientModule,
    SchemasModule,
    WsClientModule,
    WsBotModule,
  ],
  controllers: [UploadCdnController],
  providers: [UploadCdnUseCase],
  exports: [UploadCdnUseCase],
})
export class CdnModule {}
