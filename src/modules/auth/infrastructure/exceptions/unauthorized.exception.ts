import { UnauthorizedException } from "@nestjs/common";

export class CustomUnathorizedException extends UnauthorizedException {
  constructor() {
    super("Unauthorized");
  }
}
