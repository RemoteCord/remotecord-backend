import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<UserModel>;

@Schema()
export class UserModel {
  @Prop({ unique: true, required: true })
  id!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  avatar!: string;

  @Prop({ required: true })
  name!: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);

