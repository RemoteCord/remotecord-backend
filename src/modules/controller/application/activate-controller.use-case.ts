import { ControllerRepository } from "@/src/repository/controller/controller.repository";
import { Injectable } from "@nestjs/common";
import { LoggerService } from "@/src/modules/shared/providers";

@Injectable()
export class ActivateControllerUseCase {
  constructor(
    private readonly controllerRepository: ControllerRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(
    controllerid: string,
  ): Promise<{ status: boolean; isAlreadyActivated: boolean }> {
    try {
      const res = await this.controllerRepository.create(controllerid);

      this.logger.info(`Controller activated: ${res}`);
      return { status: true, isAlreadyActivated: false };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Error activating controller: ${errorMessage}`);
      if (errorMessage === "Controller already exists") {
        this.logger.info(`Controller already exists: ${controllerid}`);
        return { status: false, isAlreadyActivated: true };
      }

      return { status: false, isAlreadyActivated: false };
    }
  }
}
