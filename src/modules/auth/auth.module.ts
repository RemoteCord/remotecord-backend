import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { CreateUserUseCase } from "./application/create-user-use-case/create-user.use-case";
import { AuthGuard } from "./infrastructure/auth.guard";
import { CreateUserController } from "./infrastructure/routes/create-user/create-user.controller";
import { SupabaseRepository } from "./domain/supabase.repository";
import { SchemasModule } from "@/src/repository/schemas.module";
import { ClientDataEncryptUseCase } from "./application/client-data-encrypt.use-case";
import { SharedModule } from "../shared/shared.module";
import { Configuration } from "@/src/config/env.enum";

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: "60m" },
    }),
    forwardRef(() => SchemasModule),
    SharedModule,
  ],
  controllers: [CreateUserController],
  providers: [
    ClientDataEncryptUseCase,
    CreateUserUseCase,
    AuthGuard,
    SupabaseRepository,
  ],
  exports: [AuthGuard, ClientDataEncryptUseCase],
})
export class AuthModule {}
