import { IsNotEmpty, IsString } from "class-validator";

export class SendFileToClientDto {
  @IsString()
  @IsNotEmpty()
  fileroute!: string;
}
