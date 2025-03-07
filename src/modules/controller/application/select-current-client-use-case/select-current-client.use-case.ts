import { Injectable } from "@nestjs/common";
import { SelectCurrentClientDto } from "../../infrastructure/routes/current-client/current-client.dto";
import { ControllerRepository } from "@/src/repository/controller/controller.repository";

@Injectable()
export class SelectCurrentClientUseCase {
  constructor(private readonly controllerRepository: ControllerRepository) {}
  async execute(controllerid: string, body: SelectCurrentClientDto) {
    await this.controllerRepository.updateController(controllerid, {
      activeclient: body.clientid,
    });

    return { status: true };
  }
}
