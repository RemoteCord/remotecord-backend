import { IsNotEmpty, IsString } from "class-validator";

export class SendCmdCommandToClientDto {
  @IsString()
  @IsNotEmpty()
  command!: string;
}
