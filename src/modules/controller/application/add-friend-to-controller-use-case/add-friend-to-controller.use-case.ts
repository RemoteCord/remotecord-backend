import { ControllerRepository } from "@/src/repository/controller/controller.repository";
import { Injectable } from "@nestjs/common";
import { AddFriendToControllerDto } from "./add-friend-to-controller-use-case.dto";
import { LoggerService } from "@/src/modules/shared/providers";
import { UserRepository } from "@/src/repository/user/user.repository";
import { ClientNotFoundException } from "@/src/repository/user/exceptions";

@Injectable()
export class AddFriendToControllerUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly controllerRepository: ControllerRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(
    dto: AddFriendToControllerDto,
  ): Promise<{ status: boolean; message?: string }> {
    const { controllerid, clientid } = dto;
    try {
      const existClient = await this.userRepository.getUserById(clientid);
      if (!existClient) throw new ClientNotFoundException();

      const res = await this.controllerRepository.addFriendToController(
        controllerid,
        clientid,
      );

      console.log(res);
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
