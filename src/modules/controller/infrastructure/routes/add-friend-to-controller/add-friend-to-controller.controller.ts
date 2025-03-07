import { Body, Controller, Param, Post } from "@nestjs/common";

import { CONTROLLER_ROUTE } from "../route.constants";
import { AddFriendToControllerUseCase } from "../../../application/add-friend-to-controller-use-case/add-friend-to-controller.use-case";
import { AddFriendToControllerDto } from "./add-friend-to-controller.dto";

@Controller(CONTROLLER_ROUTE)
export class AddFriendToController {
  constructor(
    private readonly addFriendtoControllerUseCase: AddFriendToControllerUseCase,
  ) {}

  @Post(":controllerid/add-friend")
  async run(
    @Param("controllerid") controllerid: string,
    @Body() body: AddFriendToControllerDto,
  ) {
    console.log(body, controllerid);

    return await this.addFriendtoControllerUseCase.execute({
      controllerid,
      clientid: body.clientid,
    });
  }
}
