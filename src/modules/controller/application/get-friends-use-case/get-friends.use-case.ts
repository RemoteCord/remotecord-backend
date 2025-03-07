import { LoggerService } from "@/src/modules/shared/providers";
import { ControllerRepository } from "@/src/repository/controller/controller.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GetFriendsUseCase {
  constructor(
    private readonly controllerRepository: ControllerRepository,
    private readonly logger: LoggerService,
  ) {}
  async execute(controllerid: string) {
    try {
      const controller =
        await this.controllerRepository.getControllerById(controllerid);

      console.log("controller:", controller);
      return {
        clients: controller.friends,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      this.logger.error(
        `Error getting active client from controller ${controllerid}: ${errorMessage}`,
      );

      return { clients: [] };
    }
  }
}
