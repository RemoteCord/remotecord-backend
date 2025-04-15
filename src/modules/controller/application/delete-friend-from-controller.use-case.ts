import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";
import { Injectable } from "@nestjs/common";
import { LoggerService } from "@/src/modules/shared/providers";
import { UserRepository } from "@/src/repository/db/user/user.repository";
import { ClientNotFoundException } from "@/src/repository/db/user/exceptions";
import { AddFriendToControllerDto, DeleteFriendFromControllerDto } from "../infrastructure/routes/dto/controller.dto";
import { WsApplicationAddFriend } from "../../ws-application/application/events/ws-application-add-friend";
import { ClientDataEncryptUseCase } from "../../auth/application/client-data-encrypt.use-case";

@Injectable()
export class DeleteFriendFromControrllerUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
    private readonly controllerRepository: ControllerRepository,
    private readonly wsApplicationAddFriend: WsApplicationAddFriend,
    private readonly clientDataEncryptUseCase: ClientDataEncryptUseCase,
  ) { }

  async execute(
    controllerid: string,
    dto: DeleteFriendFromControllerDto,
  ): Promise<{ status: boolean; message?: string; }> {
    const { clientid } = dto;
    try {
      const existClient = await this.userRepository.getUserById(clientid);
      if (!existClient) throw new ClientNotFoundException();

      const controllerData =
        await this.controllerRepository.getControllerById(controllerid);
      if (!controllerData) {
        throw new Error("Controller not found");
      }

      console.log("existClient", existClient, controllerData, controllerData.friends?.includes(clientid));

      controllerData.friends = controllerData.friends?.filter(
        friend => friend !== clientid,
      );
      await this.controllerRepository.updateController(controllerid, {
        friends: controllerData.friends,
      });

      return { status: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      this.logger.error(
        `Error deleting ${clientid} from controller ${controllerid}: ${errorMessage}`,
      );
      return { status: false, message: errorMessage };
    }
  }
}
