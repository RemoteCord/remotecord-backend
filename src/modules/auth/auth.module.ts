import { forwardRef, Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { CreateUserUseCase } from "./application/create-user-use-case/create-user.use-case";
import { AuthGuard } from "./infrastructure/auth.guard";
import { CreateUserController } from "./infrastructure/routes/create-user/create-user.controller";
import { SchemasModule } from "@/src/repository/db/schemas.module";
import { ClientDataEncryptUseCase } from "./application/client-data-encrypt.use-case";
import { SharedModule } from "../shared/shared.module";
import { Configuration } from "@/src/config/env.enum";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.stratergy";
import authConfig from "./auth.config";
import { JwtAuthGuard } from "./infrastructure/jwt.guard";

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(authConfig),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get(Configuration.SECRET),
      }),
    }),
    PassportModule.register({ defaultStrategy: "jwt" }),

    forwardRef(() => SchemasModule),
    SharedModule,
  ],
  controllers: [CreateUserController],
  providers: [
    ClientDataEncryptUseCase,
    CreateUserUseCase,
    AuthGuard,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [
    AuthGuard,
    ClientDataEncryptUseCase,
    PassportModule,
    JwtStrategy,
    JwtAuthGuard,
  ],
})
export class AuthModule {}
