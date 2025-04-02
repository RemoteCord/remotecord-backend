import { Injectable } from "@nestjs/common";
import { SelectCurrentClientDto } from "../infrastructure/routes/dto/controller.dto";
import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";

@Injectable()
export class SelectCurrentClientUseCase {
  constructor(private readonly controllerRepository: ControllerRepository) {}
  async execute(controllerid: string, body: SelectCurrentClientDto) {
    // console.log(body);
    await this.controllerRepository.updateController(controllerid, {
      activeclient: body.clientid,
    });

    return { status: true };
  }
}
