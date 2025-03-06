import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { User, UserSchema } from "@/src/schemas/user.schema";

import { CreateUserUseCase } from "./aplication/create-user-use-case/create-user.use-case";
import { AuthGuard } from "./infrastructure/auth.guard";
import { CreateUserController } from "./infrastructure/routes/create-user/create-user.controller";
import { UserRepository } from "./infrastructure/user.repository";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [CreateUserController],
  providers: [CreateUserUseCase, UserRepository, AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
