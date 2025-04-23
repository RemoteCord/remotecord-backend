import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CommandsDocument = HydratedDocument<CommandsModel>;

@Schema()
export class CommandsModel {
  @Prop({ required: true })
  controllerid!: string;
  @Prop({ required: true })
  clientid!: string;

  @Prop({ required: true })
  command!: string;

  @Prop({ required: true })
  timestamp!: Date;



}

export const CommandsSchema = SchemaFactory.createForClass(CommandsModel);
