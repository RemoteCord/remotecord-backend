import { forwardRef, Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Configuration } from "../../config/env.enum";
import { UserModel, UserSchema } from "./user/user.schema";
import { UserRepository } from "./user/user.repository";
import {
  ControllerModel,
  ControllerSchema,
} from "./controller/controller.schema";
import { ControllerRepository } from "./controller/controller.repository";
import { SharedModule } from "../../modules/shared/shared.module";
import { AuthModule } from "../../modules/auth/auth.module";
import {
  ClientPermissionModel,
  ClientPermissionSchema,
} from "./clientPermisions/clientPermission.schema";
import { ClientPermissionRepository } from "./clientPermisions/clientPermission.repository";
import { ClientPermissionGuard } from "./clientPermisions/clientPermission.guard";
import { ClientModule } from "@/src/modules/client/infrastructure/client.module";

import { SubscriptionsRepository } from "./subscriptions/subscriptions.repository";
import {
  SubscriptionsModel,
  SubscriptionsSchema,
} from "./subscriptions/subscriptions.schema";
import { CustomersModel, CustomersSchema } from "./customers/customers.schema";
import { CustomersRepository } from "./customers/customers.repository";
import { CommandsModel, CommandsSchema } from "./commands/commands.schema";
import { CommandsLogsRepository } from "./commands/commands-log.repository";

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
      { name: ClientPermissionModel.name, schema: ClientPermissionSchema },
      { name: SubscriptionsModel.name, schema: SubscriptionsSchema },
      { name: CustomersModel.name, schema: CustomersSchema },
      { name: CommandsModel.name, schema: CommandsSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    UserRepository,
    ControllerRepository,
    ClientPermissionRepository,
    SubscriptionsRepository,
    CustomersRepository,
    CommandsLogsRepository,
    ClientPermissionGuard,
    // Add missing dependency here if it's a provider
  ],
  exports: [
    MongooseModule,
    UserRepository,
    ControllerRepository,
    ClientPermissionRepository,
    ClientPermissionGuard,
    SubscriptionsRepository,
    CommandsLogsRepository,
    CustomersRepository,
  ],
})
export class SchemasModule { }
