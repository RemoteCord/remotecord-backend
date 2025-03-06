import { Module } from "@nestjs/common";
import { CreateUserUseCase } from "./aplication/create-user-use-case/create-user.use-case";
import { AuthGuard } from "./infrastructure/auth.guard";
import { CreateUserController } from "./infrastructure/routes/create-user/create-user.controller";
import { SupabaseRepository } from "./domain/supabase.repository";
import { SchemasModule } from "@/src/repository/schemas.module";
import { SharedModule } from "../shared/shared.module";
import { WsClientModule } from "../ws-client/ws-client.module";

@Module({
  imports: [SchemasModule, SharedModule, WsClientModule],
  controllers: [CreateUserController],
  providers: [CreateUserUseCase, AuthGuard, SupabaseRepository],
  exports: [AuthGuard],
})
export class AuthModule {}
