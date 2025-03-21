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

export type PermissionsAllowed = Omit<
  ClientPermissionModel,
  "clientid" | "controllerid"
>;

@Schema()
export class ClientPermissionModel {
  @Prop({ required: true })
  clientid!: string;

  @Prop({ required: true })
  controllerid!: string;

  @Prop({ required: false, default: true })
  getFile!: boolean;

  @Prop({ required: false, default: true })
  uploadFile!: boolean;

  @Prop({ required: false, default: true })
  explorer!: boolean;

  @Prop({ required: false, default: true })
  shell!: boolean;

  @Prop({ required: false, default: true })
  process!: boolean;

  @Prop({ required: false, default: true })
  screenshot!: boolean;
}

export const ClientPermissionSchema = SchemaFactory.createForClass(
  ClientPermissionModel,
);
