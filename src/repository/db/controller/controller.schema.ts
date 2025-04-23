import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ControllerDocument = HydratedDocument<ControllerModel>;

@Schema()
export class ControllerModel {
  @Prop({ unique: true, required: true })
  controllerid!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  picture!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: false, default: false })
  premium?: boolean;

  @Prop({ required: false, default: [] })
  friends?: string[];

  @Prop({ required: false, default: "" })
  activeclient?: string;

  @Prop({ required: false, default: "" })
  locale?: string;
}

export const ControllerSchema = SchemaFactory.createForClass(ControllerModel);
