import { Injectable } from "@nestjs/common";
import {
  ClientPermissionModel,
  PermissionsAllowed,
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

  async createPermissionDocument(clientid: string, controllerid: string) {
    try {
      return await this.clientPermissionModel.create({
        clientid,
        controllerid,
      });
    } catch (error: any) {
      console.log(error);
      if (error?.code === 11000) {
        // console.log(error);
        return;
      }
      throw new Error("Failed to create permission document");
    }
  }

  async getAllUniquePermissions(clientid: string, controllerid: string) {
    return await this.clientPermissionModel.findOne(
      { clientid, controllerid },
      { _id: 0, controllerid: 0, clientid: 0, __v: 0 },
    );
  }

  async getPermission(
    clientid: string,
    controllerid: string,
    permission: Permissions,
  ) {
    return await this.clientPermissionModel
      .findOne(
        {
          clientid,
          controllerid,
        },
        { _id: 0, controllerid: 0, clientid: 0, __v: 0 },
      )
      .select(permission);
  }

  async getAllPermissions(clientid: string) {
    return await this.clientPermissionModel.find({ clientid });
  }

  async updatePermission(
    clientid: string,
    controllerid: string,
    permission: Permissions,
    value: boolean,
  ) {
    return await this.clientPermissionModel.updateOne(
      { clientid, controllerid },
      { [permission]: value },
    );
  }

  async updatePermissions(
    clientid: string,
    controllerid: string,
    permissions: Partial<PermissionsAllowed>,
  ) {
    return await this.clientPermissionModel.updateOne(
      { clientid, controllerid },
      { ...permissions },
    );
  }
}
