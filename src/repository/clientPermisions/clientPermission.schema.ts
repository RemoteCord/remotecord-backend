import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

export type ClientPermissionDocument = HydratedDocument<ClientPermissionModel>;

export type Permissions =
  | "getFile"
  | "uploadFile"
  | "explorer"
  | "shell"
  | "process"
  | "screenshot";

@Schema()
export class ClientPermissionModel {
  @Prop({ unique: true, required: true })
  clientid!: string;

  @Prop({ required: false, default: 1 })
  getFile!: number;

  @Prop({ required: false, default: 1 })
  uploadFile!: number;

  @Prop({ required: false, default: 1 })
  explorer!: number;

  @Prop({ required: false, default: 1 })
  shell!: number;

  @Prop({ required: false, default: 1 })
  process!: number;

  @Prop({ required: false, default: 1 })
  screenshot!: number;
}

export const ClientPermissionSchema = SchemaFactory.createForClass(
  ClientPermissionModel,
);
