import { Module } from "@nestjs/common";
import { CreateUserUseCase } from "./application/create-user-use-case/create-user.use-case";
import { AuthGuard } from "./infrastructure/auth.guard";
import { CreateUserController } from "./infrastructure/routes/create-user/create-user.controller";
import { SupabaseRepository } from "./domain/supabase.repository";
import { SchemasModule } from "@/src/repository/schemas.module";
import { SharedModule } from "../shared/shared.module";
import { WsClientModule } from "../ws-client/ws-client.module";
import { ClientDataEncryptUseCase } from "./application/client-data-encrypt.use-case";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    SchemasModule,
    SharedModule,
    WsClientModule,
    JwtModule.register({ secret: "ABC" }),
  ],
  controllers: [CreateUserController],
  providers: [
    CreateUserUseCase,
    AuthGuard,
    SupabaseRepository,
    ClientDataEncryptUseCase,
  ],
  exports: [AuthGuard, ClientDataEncryptUseCase],
})
export class AuthModule {}
