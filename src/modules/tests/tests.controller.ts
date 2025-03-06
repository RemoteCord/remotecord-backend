import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JWTPayload } from "jose";

import { decode } from "../shared/decrypt";
import { AuthGuard } from "../auth/infrastructure/auth.guard";

@Controller("tests")
export class TestsController {
  constructor(private configService: ConfigService) {}

  //   @Post("decrypt")
  //   async decrypt(
  //     @Body() body: { token: string },
  //   ): Promise<{ result: JWTPayload }> {
  //     const secret = this.configService.get<string>("AUTH_SECRET");
  //     if (!secret) throw new Error("AUTH_SECRET not found");

  //     const result = await decode({
  //       salt: "authjs.session-token",
  //       token: body.token,
  //       secret,
  //     });

  //     if (!result) throw new Error("Invalid token");

  //     return { result };
  //   }

  @UseGuards(AuthGuard)
  @Get()
  test(): { message: string } {
    return { message: "Hello World" };
  }
}
