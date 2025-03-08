import { IsNotEmpty, IsString } from "class-validator";

export class SendFileToClientDto {
  @IsString()
  @IsNotEmpty()
  fileroute!: string;
}

export class GetFileDto {
  @IsString()
  @IsNotEmpty()
  fileroute!: string;

  @IsString()
  @IsNotEmpty()
  controllerid!: string;
}
