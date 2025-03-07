import { ControllerRepository } from "@/src/repository/controller/controller.repository";
import { Injectable } from "@nestjs/common";
import { ActivateControllerDto } from "./activate-controller.dto";
import { LoggerService } from "@/src/modules/shared/providers";

@Injectable()
export class ActivateControllerUseCase {
  constructor(
    private readonly controllerRepository: ControllerRepository,
    private readonly logger: LoggerService,
  ) {}

  async execute(dto: ActivateControllerDto): Promise<{ status: boolean }> {
    try {
      const res = await this.controllerRepository.create(dto.controllerid);

      console.log(res);
      return { status: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      this.logger.error(`Error activating controller: ${errorMessage}`);
      return { status: false };
    }
  }
}
