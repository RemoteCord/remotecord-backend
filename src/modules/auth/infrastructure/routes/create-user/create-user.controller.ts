import { Body, Controller, Post } from "@nestjs/common";

import { CreateUserDto } from "../../../aplication/create-user-use-case/create-user.dto";
import { CreateUserUseCase } from "../../../aplication/create-user-use-case/create-user.use-case";
import { AUTH_ROUTE } from "./route.constants";

@Controller(AUTH_ROUTE)
export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async run(@Body() body: CreateUserDto): Promise<{ message: string }> {
    return await this.createUserUseCase.execute(body);
  }
}
