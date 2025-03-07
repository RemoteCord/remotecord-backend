import { Controller, Get, Param } from "@nestjs/common";
import { CONTROLLER_ROUTE } from "../route.constants";
import { GetCurrentClientUseCase } from "@/modules/controller/application/get-current-client-use-case/get-current-client.use-case";
import { GetFriendsUseCase } from "../../../application/get-friends-use-case/get-friends.use-case";

@Controller(CONTROLLER_ROUTE)
export class GetFriendsController {
  constructor(private readonly getFriendsUseCase: GetFriendsUseCase) {}

  @Get(":controllerid/friends")
  async getCurrentClient(@Param("controllerid") controllerid: string) {
    return await this.getFriendsUseCase.execute(controllerid);
  }
}
