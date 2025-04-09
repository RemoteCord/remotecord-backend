import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";

import { CreateUserDto } from "../../../application/create-user-use-case/create-user.dto";
import { CreateUserUseCase } from "../../../application/create-user-use-case/create-user.use-case";
import { AUTH_ROUTE } from "./route.constants";
import { JwtAuthGuard } from "../../jwt.guard";
import type { FastifyRequest } from "fastify";
import { AuthGuard } from "../../auth.guard";

@Controller(AUTH_ROUTE)
export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @UseGuards(JwtAuthGuard, AuthGuard)
  @Post("callback")
  async run(
    @Body() body: CreateUserDto,
    @Req() req: FastifyRequest,
  ): Promise<{ status: boolean; token?: string }> {
    console.log("request", req.headers["user"]);

    const { clientid, email, username, picture } = req.headers as Record<
      string,
      string
    >;

    return await this.createUserUseCase.execute({
      name: username,
      email: email,
      picture: picture,
      clientid: clientid,
    });
  }
}
