import { UnauthorizedException } from "@nestjs/common";
import { Permissions } from "../clientPermission.schema";

export class CustomNotAllowedException extends UnauthorizedException {
  constructor(
    clienctid: string,
    controllerid: string,
    permission: Permissions,
  ) {
    super(
      `Controller ${controllerid} not allowed by client ${clienctid} for permission ${permission}`,
    );
  }
}
