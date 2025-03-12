import { ControllerRepository } from "@/src/repository/controller/controller.repository";
import { Injectable } from "@nestjs/common";
import { LoggerService } from "@/src/modules/shared/providers";
import { UserRepository } from "@/src/repository/user/user.repository";
import { ClientNotFoundException } from "@/src/repository/user/exceptions";
import { AddFriendToControllerDto } from "../infrastructure/routes/dto/add-friend-to-controller.dto";
import { WsApplicationAddFriend } from "../../ws-application/application/events/ws-application-add-friend";
import { ClientDataEncryptUseCase } from "../../auth/application/client-data-encrypt.use-case";

@Injectable()
export class AddFriendToControllerUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
    private readonly wsApplicationAddFriend: WsApplicationAddFriend,
    private readonly clientDataEncryptUseCase: ClientDataEncryptUseCase,
  ) {}

  async execute(
    controllerid: string,
    dto: AddFriendToControllerDto,
  ): Promise<{ status: boolean; message?: string }> {
    const { clientid, username, avatar } = dto;
    try {
      const existClient = await this.userRepository.getUserById(clientid);
      if (!existClient) throw new ClientNotFoundException();

      const encryptedToken =
        this.clientDataEncryptUseCase.encrypt(controllerid);

      // const res = await this.controllerRepository.addFriendToController(
      //   controllerid,
      //   clientid,
      // );

      // console.log(res);

      this.wsApplicationAddFriend.execute(clientid, encryptedToken, {
        ...dto,
        controllerid,
      });

      return { status: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      this.logger.error(
        `Error adding ${clientid} to controller ${controllerid}: ${errorMessage}`,
      );
      return { status: false, message: errorMessage };
    }
  }
}
