import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";
import { Injectable } from "@nestjs/common";
import { LoggerService } from "@/src/modules/shared/providers";
import { UserRepository } from "@/src/repository/db/user/user.repository";
import { ClientNotFoundException } from "@/src/repository/db/user/exceptions";
import { AddFriendToControllerDto } from "../infrastructure/routes/dto/add-friend-to-controller.dto";
import { WsApplicationAddFriend } from "../../ws-application/application/events/ws-application-add-friend";
import { ClientDataEncryptUseCase } from "../../auth/application/client-data-encrypt.use-case";

@Injectable()
export class AddFriendToControllerUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
    private readonly controllerRepository: ControllerRepository,
    private readonly wsApplicationAddFriend: WsApplicationAddFriend,
    private readonly clientDataEncryptUseCase: ClientDataEncryptUseCase,
  ) {}

  async execute(
    controllerid: string,
    dto: AddFriendToControllerDto,
  ): Promise<{ status: boolean; message?: string; isAlreadyAdded: boolean }> {
    const { clientid, username, avatar } = dto;
    try {
      const existClient = await this.userRepository.getUserById(clientid);
      if (!existClient) throw new ClientNotFoundException();

      const controllerData =
        await this.controllerRepository.getControllerById(controllerid);

      if (!controllerData) {
        throw new Error("Controller not found");
      }

      this.logger.info(`Adding ${clientid} to controller ${controllerid}`);

      if (controllerData.friends?.includes(clientid)) {
        return {
          status: false,
          isAlreadyAdded: true,
        };
      }

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

      return { status: true, isAlreadyAdded: false };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      this.logger.error(
        `Error adding ${clientid} to controller ${controllerid}: ${errorMessage}`,
      );
      return { status: false, message: errorMessage, isAlreadyAdded: false };
    }
  }
}
