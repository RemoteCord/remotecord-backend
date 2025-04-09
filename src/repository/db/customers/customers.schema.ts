import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CustomersDocument = HydratedDocument<CustomersModel>;

@Schema()
export class CustomersModel {
  @Prop({ required: true, unique: true })
  customerid!: string;

  @Prop({ required: true, unique: true })
  email!: string;
}

export const CustomersSchema = SchemaFactory.createForClass(CustomersModel);
