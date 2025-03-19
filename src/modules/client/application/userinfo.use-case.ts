import { UserRepository } from "@/src/repository/user/user.repository";
import { Injectable } from "@nestjs/common";
import { WsApplicationRepository } from "../../ws-application/domain/ws-application.repository";

@Injectable()
export class UserInfoUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly wsApplicationRepository: WsApplicationRepository,
  ) {}

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
      await this.wsApplicationRepository.updateClientData(clientid, {
        name: username,
      });
      return { status: true };
    } catch (error) {
      return { status: false };
    }
  }
}
