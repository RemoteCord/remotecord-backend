import { Controller, Get, Param } from "@nestjs/common";
import { CONTROLLER_ROUTE } from "../../route.constants";
import { GetTasksUseCase } from "../../../application/events/get-tasks.use-case";

@Controller(CONTROLLER_ROUTE)
export class GetTasksController {
  constructor(private readonly getTasksUseCase: GetTasksUseCase) {}

  @Get(":controllerid/tasks")
  async sendTasksToEvent(@Param("controllerid") controllerid: string) {
    return await this.getTasksUseCase.execute(controllerid);
  }
}
