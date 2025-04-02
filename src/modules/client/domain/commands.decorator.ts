import { Permissions } from "@/src/repository/db/clientPermisions/clientPermission.schema";
import { SetMetadata } from "@nestjs/common";
export const SetCommand = (command: Permissions) =>
  SetMetadata("command", command);
