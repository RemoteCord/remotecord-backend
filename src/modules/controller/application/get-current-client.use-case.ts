import { LoggerService } from "@/src/modules/shared/providers";
import { ControllerRepository } from "@/src/repository/controller/controller.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GetCurrentClientUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly controllerRepository: ControllerRepository,
  ) {}

  async execute(
    controllerid: string,
  ): Promise<{ activeclient: string | null }> {
    try {
      const controller =
        await this.controllerRepository.getControllerById(controllerid);

      this.logger.info(
        "getting active client from",
        controllerid,
        controller.activeclient,
      );
      return {
        activeclient: controller.activeclient,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      this.logger.error(
        `Error getting active client from controller ${controllerid}: ${errorMessage}`,
      );

      return { activeclient: null };
    }
  }
}
