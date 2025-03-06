import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { TestsController } from "./tests.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "@/src/schemas/user.schema";

@Module({
  controllers: [TestsController],
  providers: [],
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class TestsModule {}
