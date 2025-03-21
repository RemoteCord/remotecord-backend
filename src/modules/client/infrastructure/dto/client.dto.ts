import type { PermissionsAllowed } from "@/src/repository/db/clientPermisions/clientPermission.schema";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUsernameDto {
  @IsString()
  @IsNotEmpty()
  username!: string;
}

export class UpdateControllerPermissionsDto {
  @IsString()
  @IsNotEmpty()
  controllerid!: string;

  @IsNotEmpty({ each: true })
  permissions!: PermissionsAllowed;
}
