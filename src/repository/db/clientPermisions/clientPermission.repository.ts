import { Injectable, OnModuleInit } from "@nestjs/common";
import {
  ClientPermissionModel,
  PermissionsAllowed,
  type Permissions,
} from "./clientPermission.schema";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";
import { RedisRepository } from "../../redis/domain/redis.repository";

@Injectable()
export class ClientPermissionRepository implements OnModuleInit {
  constructor(
    @InjectModel(ClientPermissionModel.name)
    private readonly clientPermissionModel: Model<ClientPermissionModel>,
    private readonly redisRepository: RedisRepository,
  ) {}

  async onModuleInit() {
    // // console.log(`The module has been initialized.`);
    // const permissions = await this.clientPermissionModel.find(
    //   {},
    //   { _id: 0, __v: 0 },
    // );
    // console.log(permissions);
    // await Promise.all(
    //   permissions.map(async permission => {
    //     const key = `${permission.clientid}:${permission.controllerid}`;
    //     const { controllerid, clientid, ...rest } = permission.toJSON();
    //     console.log("formatted", JSON.stringify(rest));
    //     return this.redisRepository.HSET(["permissions", [clientid]], rest);
    //   }),
    // );
  }
  async createPermissionDocument(clientid: string, controllerid: string) {
    try {
      return await this.clientPermissionModel.create({
        clientid,
        controllerid,
      });
    } catch (error: any) {
      // console.log(error);
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
    const permissions = await this.clientPermissionModel
      .findOne(
        {
          clientid,
          controllerid,
        },
        { _id: 0, controllerid: 0, clientid: 0, __v: 0 },
      )
      .select(permission);

    if (!permissions) return false;

    return permissions[permission];
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
    const res = await this.clientPermissionModel.updateOne(
      { clientid, controllerid },
      { [permission]: value },
    );
    // console.log(res);
    return res;
  }

  async updatePermissions(
    clientid: string,
    controllerid: string,
    permissions: Partial<PermissionsAllowed>,
  ) {
    const res = await this.clientPermissionModel.updateOne(
      { clientid, controllerid },
      { ...permissions },
    );

    this.redisRepository.HSET(
      [`permissions`, [clientid, controllerid]],
      permissions,
    );
    return res;
  }
}
