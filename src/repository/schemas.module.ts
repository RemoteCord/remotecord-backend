import { forwardRef, Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Configuration } from "../config/env.enum";
import { UserModel, UserSchema } from "./user/user.schema";
import { UserRepository } from "./user/user.repository";
import {
  ControllerModel,
  ControllerSchema,
} from "./controller/controller.schema";
import { ControllerRepository } from "./controller/controller.repository";
import { SharedModule } from "../modules/shared/shared.module";
import { AuthModule } from "../modules/auth/auth.module";

@Module({
  imports: [
    SharedModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: `${configService.get(Configuration.MONGO_CONNECTION_STRING)}`,
      }),
    }),
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserSchema },
      { name: ControllerModel.name, schema: ControllerSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [UserRepository, ControllerRepository],
  exports: [MongooseModule, UserRepository, ControllerRepository],
})
export class SchemasModule {}
