import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ControllerDocument = HydratedDocument<ControllerModel>;

@Schema()
export class ControllerModel {
  @Prop({ unique: true, required: true })
  controllerid!: string;

  @Prop({ required: false, default: [] })
  friends!: string[];

  @Prop({ required: false, default: "" })
  activeclient!: string;
}

export const ControllerSchema = SchemaFactory.createForClass(ControllerModel);
