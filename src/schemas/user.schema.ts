import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: true })
  lastName!: string;

  @Prop({ required: true })
  organization!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  picture!: string;

  @Prop({ required: true })
  course!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
