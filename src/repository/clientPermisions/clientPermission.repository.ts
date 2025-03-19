import { Injectable } from "@nestjs/common";
import {
  ClientPermissionModel,
  type Permissions,
} from "./clientPermission.schema";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";

@Injectable()
export class ClientPermissionRepository {
  constructor(
    @InjectModel(ClientPermissionModel.name)
    private readonly clientPermissionModel: Model<ClientPermissionModel>,
  ) {}

  async createPermissionDocument(clientid: string) {
    try {
      return await this.clientPermissionModel.create({
        clientid,
      });
    } catch (error: any) {
      if (error?.code === 11000) {
        // console.log(error);
        return;
      }
      throw new Error("Failed to create permission document");
    }
  }

  async getPermission(clientid: string, permission: Permissions) {
    return await this.clientPermissionModel
      .findOne({
        clientid,
      })
      .select(permission);
  }

  async getAllPermissions(clientid: string) {
    return await this.clientPermissionModel.findOne({ clientid });
  }

  async updatePermission(
    clientid: string,
    permission: Permissions,
    value: boolean,
  ) {
    return await this.clientPermissionModel.updateOne(
      { clientid },
      { [permission]: value },
    );
  }
}
