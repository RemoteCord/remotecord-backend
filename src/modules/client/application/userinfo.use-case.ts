import { UserRepository } from "@/src/repository/db/user/user.repository";
import { Injectable } from "@nestjs/common";
import { WsApplicationRepository } from "../../ws-application/domain/ws-application.repository";
import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";
import { ClientPermissionRepository } from "@/src/repository/db/clientPermisions/clientPermission.repository";
import { PermissionsAllowed } from "@/src/repository/db/clientPermisions/clientPermission.schema";

@Injectable()
export class UserInfoUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly wsApplicationRepository: WsApplicationRepository,
    private readonly clientPermissionsRepository: ClientPermissionRepository,
    private readonly controllerRepository: ControllerRepository,
  ) {}

  async getFriends(clientid: string) {
    try {
      const controllers =
        await this.controllerRepository.getFriendsControllersByClientId(
          clientid,
        );

      const friends = await Promise.all(
        controllers.map(async controller => {
          const permissions =
            await this.clientPermissionsRepository.getAllUniquePermissions(
              clientid,
              controller.controllerid,
            );

          return {
            controllerid: controller.controllerid,
            picture: controller.picture,
            name: controller.name,
            permissions: permissions,
          };
        }),
      );

      return { friends };
    } catch (error) {
      return { friends: [] };
    }
  }

  async deleteFriend(clientid: string, controllerid: string) {
    console.log("deleteFriend", clientid, controllerid);
    try {
      await this.controllerRepository.deleteFriendFromController(
        controllerid,
        clientid,
      );
      return { status: true };
    } catch (error) {
      return { status: false };
    }
  }

  async getUserInfo(clientid: string): Promise<{ username: string }> {
    const userinfo = await this.userRepository.getUserById(clientid);
    if (!userinfo) throw new Error("User not found");
    return {
      username: userinfo.name,
    };
  }

  async updateUsername(
    clientid: string,
    username: string,
  ): Promise<{ status: boolean }> {
    try {
      await this.userRepository.updateUser(clientid, { name: username });
      // await this.wsApplicationRepository.updateClientData(clientid, {
      //   name: username,
      // });
      return { status: true };
    } catch (error) {
      return { status: false };
    }
  }

  async updateControllerPermissions(
    permissions: PermissionsAllowed,
    controllerid: string,
    clientid: string,
  ) {
    try {
      await this.clientPermissionsRepository.updatePermissions(
        clientid,
        controllerid,
        permissions,
      );
      return { status: true };
    } catch (error) {
      return { status: false };
    }
  }
}
