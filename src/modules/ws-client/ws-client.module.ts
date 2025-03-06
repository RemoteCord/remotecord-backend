import { Module } from "@nestjs/common";
import { ClientDataEncryptUseCase } from "./application/client-data-encrypt.use-case";
import { WsClientGateway } from "./infrastructure/ws-client.gateway";
import { WsClientService } from "./domain/ws-client.service";
import { ClientJoinsUseCase } from "./application/client-joins.use-case";
import { SchemasModule } from "@/src/repository/schemas.module";
import { SharedModule } from "../shared/shared.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  providers: [
    ClientDataEncryptUseCase,
    WsClientGateway,
    WsClientService,
    ClientJoinsUseCase,
  ],
  exports: [ClientDataEncryptUseCase, ClientJoinsUseCase],
  imports: [SchemasModule, JwtModule.register({ secret: "ABC" })],
})
export class WsClientModule {}
