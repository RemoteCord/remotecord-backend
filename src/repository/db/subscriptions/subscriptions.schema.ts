import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SubscriptionsDocument = HydratedDocument<SubscriptionsModel>;

@Schema()
export class SubscriptionsModel {
  @Prop({ unique: true, required: true })
  subscriptionid!: string;

  @Prop({ required: true, unique: true })
  customerid!: string;

  @Prop({ required: false, default: true })
  active?: boolean;
}

export const SubscriptionsSchema =
  SchemaFactory.createForClass(SubscriptionsModel);
